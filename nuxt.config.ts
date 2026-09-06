import type { NitroRouteConfig } from "nitropack"
import tailwindcss from "@tailwindcss/vite"
declare module "nuxt/schema" {
	interface NuxtConfig {
		schemaOrg?: {
			identity?: {
				type?: string
				name?: string
				logo?: string
				[key: string]: unknown
			}
			[key: string]: unknown
		}
		sourcemap?: {
			server?: boolean
			client?: boolean
		}
		generate?: {
			fallback?: string
		}
	}
}

/**
 * fetch() with retry + backoff + timeout. 429/5xx and network errors are
 * retried; other non-ok statuses (401/403/404 etc.) are returned as-is so
 * the caller can decide what they mean rather than being retried blindly.
 */
async function fetchWithRetry(url: string, retries = 3, backoffMs = 500): Promise<Response> {
	let lastErr: unknown

	for (let attempt = 1; attempt <= retries; attempt++) {
		try {
			const res = await fetch(url, { signal: AbortSignal.timeout(10_000) })
			if (res.ok || (res.status !== 429 && res.status < 500)) return res
			lastErr = new Error(`HTTP ${res.status} from ${url}`)
		} catch (err) {
			lastErr = err
		}
		if (attempt < retries) await new Promise((r) => setTimeout(r, backoffMs * attempt))
	}

	throw lastErr instanceof Error ? lastErr : new Error(String(lastErr))
}

/**
 * Fetches every slug for a given WP endpoint, paginating through
 * per_page=100 until exhausted. Used by the prerender:routes hook
 * below so unlinked content (e.g. campaign landing pages) still
 * gets built into the static export, since crawlLinks alone only
 * follows <a href> links found starting from "/".
 *
 * A 400 (rest_post_invalid_page_number) past page 1 is WP's real
 * "end of results" signal and is treated as such. Any other non-ok
 * status — including a non-ok on page 1 — is a genuine failure and
 * is thrown, not swallowed, so a bad WP response doesn't silently
 * look like "no more pages."
 */
async function fetchAllSlugs(wpUrl: string, endpoint: string): Promise<string[]> {
	const slugs: string[] = []
	let page = 1

	while (true) {
		const res = await fetchWithRetry(`${wpUrl}/${endpoint}?per_page=100&page=${page}&_fields=slug`)

		if (!res.ok) {
			if (page > 1 && res.status === 400) break
			throw new Error(`[fetchAllSlugs] ${endpoint} page ${page} returned HTTP ${res.status}`)
		}

		const data = (await res.json()) as { slug: string }[]
		if (!Array.isArray(data) || data.length === 0) break

		slugs.push(...data.map((item) => item.slug))
		if (data.length < 100) break
		page++
	}

	return slugs
}

export default defineNuxtConfig({
	ssr: true,
	app: {
		baseURL: "/",
		head: {
			htmlAttrs: {
				lang: "da-DK"
			},
			meta: [
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ name: "robots", content: "noindex, nofollow" }
			]
		}
	},
	sourcemap: {
		server: false,
		client: true
	},
	features: {
		inlineStyles: true
	},
	compatibilityDate: "2025-07-15",
	css: ["~/assets/css/main.css"],
	devtools: { enabled: process.env.NODE_ENV !== "production" },
	modules: ["@tailwindcss/typography", "@nuxt/scripts", "nuxt-svgo", "@nuxt/fonts", "@vueuse/nuxt", "@vueuse/motion/nuxt", "@nuxt/image", "@dargmuesli/nuxt-cookie-control", "@nuxtjs/sitemap"],
	runtimeConfig: {
		public: {
			goatWordpressUrl: process.env.NUXT_PUBLIC_GOAT_WORDPRESS_URL,
			gtmId: process.env.NUXT_PUBLIC_GTM_ID
		}
	},
	site: {
		url: "https://floatinggoat.dk"
	},
	future: {
		compatibilityVersion: 4
	},
	vite: {
		plugins: [tailwindcss()],
		optimizeDeps: {
			include: ["@vue/devtools-core", "@vue/devtools-kit"]
		}
	},
	scripts: {
		registry: {
			googleTagManager: {
				id: process.env.NUXT_PUBLIC_GTM_ID,
				trigger: "onNuxtReady",
				scriptOptions: {
					bundle: false
				},
				defaultConsent: {
					ad_storage: "denied",
					analytics_storage: "denied",
					ad_user_data: "denied",
					ad_personalization: "denied"
				}
			}
		},
		defaultScriptOptions: {
			trigger: "onNuxtReady",
			bundle: false
		}
	},
	typescript: {
		tsConfig: {
			compilerOptions: {
				types: ["bun"]
			}
		}
	},
	nitro: {
		prerender: {
			crawlLinks: true,
			routes: ["/"],
			// Flipped to true: a prerender-time error anywhere (including
			// the WP route-enumeration hook below) should fail the build,
			// not silently ship a partial static export. Revert to false
			// if this turns out to be too strict for other prerender steps.
			failOnError: true,
			// Capped low deliberately: [...slug].vue fires 2 WP requests per
			// route (page + post) plus a full getPages() re-fetch of the
			// whole catalog on every route render, so even moderate
			// concurrency here bursts enough simultaneous requests at WP
			// to trip its rate limiting (seen as HTTP 429s during generate).
			concurrency: 2
		},
		routeRules: {
			"/_nuxt/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
			"/**": {
				headers: {
					"Content-Security-Policy": "style-src 'self' 'unsafe-inline'",
					"cache-control": "public, max-age=86400"
				}
			},
			"/sitemap_index.xml": { proxy: "https://www.floatinggoat.dk/sitemap_index.xml" },
			"/sitemap.xml": { proxy: "https://www.floatinggoat.dk/sitemap_index.xml" },
			"/*.xml": { proxy: "https://www.floatinggoat.dk/*.xml" },
			"/*.xsl": { proxy: "https://www.floatinggoat.dk/*.xsl" }
		}
	},
	generate: {
		fallback: "404.html"
	},
	hooks: {
		async "prerender:routes"(ctx) {
			const wpUrl = process.env.NUXT_PUBLIC_GOAT_WORDPRESS_URL
			if (!wpUrl) {
				throw new Error("[prerender] NUXT_PUBLIC_GOAT_WORDPRESS_URL is not set — aborting build")
			}

			const [pagesResult, postsResult] = await Promise.allSettled([fetchAllSlugs(wpUrl, "pages"), fetchAllSlugs(wpUrl, "posts")])

			const failures = [pagesResult.status === "rejected" ? `pages: ${pagesResult.reason}` : null, postsResult.status === "rejected" ? `posts: ${postsResult.reason}` : null].filter(Boolean)

			if (failures.length) {
				// Fail loudly. A build that silently ships with missing
				// routes is worse than one that fails in CI where you'll
				// actually see it.
				throw new Error(`[prerender] Failed to enumerate WP routes:\n${failures.join("\n")}`)
			}

			const pageSlugs = pagesResult.status === "fulfilled" ? pagesResult.value : []
			const postSlugs = postsResult.status === "fulfilled" ? postsResult.value : []

			// A live WP site should never legitimately return zero pages.
			// If it does, something's wrong upstream (wrong URL, auth,
			// empty DB) — better to catch that here than ship a site
			// with no routes.
			if (pageSlugs.length === 0) {
				throw new Error("[prerender] WP returned 0 pages — aborting build rather than shipping an empty site")
			}

			pageSlugs.forEach((slug) => ctx.routes.add(`/${slug}`))
			postSlugs.forEach((slug) => ctx.routes.add(`/${slug}`))

			console.log(`[prerender] queued ${pageSlugs.length} pages, ${postSlugs.length} posts`)
		}
	},
	svgo: {
		dts: true
	},
	fonts: {
		providers: {
			fontshare: false
		},
		defaults: {
			weights: [300, 400, 500, 600, 700],
			styles: ["normal", "italic"],
			subsets: ["latin", "latin-ext"]
		}
	},
	image: {
		provider: "none"
	}
})
