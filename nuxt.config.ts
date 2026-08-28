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
	}
}

/**
 * Fetches every slug for a given WP endpoint, paginating through
 * per_page=100 until exhausted. Used by the prerender:routes hook
 * below so unlinked content (e.g. campaign landing pages) still
 * gets built into the static export, since crawlLinks alone only
 * follows <a href> links found starting from "/".
 */
async function fetchAllSlugs(wpUrl: string, endpoint: string): Promise<string[]> {
	const slugs: string[] = []
	let page = 1

	while (true) {
		const res = await fetch(`${wpUrl}/${endpoint}?per_page=100&page=${page}&_fields=slug`)
		if (!res.ok) {
			// Some endpoints (e.g. a missing custom post type) 400 on an
			// out-of-range page instead of returning []. Treat any
			// non-ok response as "no more results" rather than failing
			// the whole build.
			break
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
	compatibilityDate: "2025-07-15",
	css: ["~/assets/css/main.css"],
	devtools: { enabled: true },
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
			failOnError: false
		},
		routeRules: {
			"/_nuxt/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
			"/**": {
				headers: {
					"Content-Security-Policy": "style-src 'self' 'unsafe-inline'"
				}
			},
			"/sitemap_index.xml": { proxy: "https://www.floatinggoat.dk/sitemap_index.xml" },
			"/sitemap.xml": { proxy: "https://www.floatinggoat.dk/sitemap_index.xml" },
			"/*.xml": { proxy: "https://www.floatinggoat.dk/*.xml" },
			"/*.xsl": { proxy: "https://www.floatinggoat.dk/*.xsl" }
		}
	},
	hooks: {
		"nitro:config": async (nitroConfig) => {
			const wpUrl = process.env.NUXT_PUBLIC_GOAT_WORDPRESS_URL
			if (!wpUrl) {
				console.warn("NUXT_PUBLIC_GOAT_WORDPRESS_URL not set — skipping WP route discovery")
				return
			}

			const [pageSlugs, postSlugs] = await Promise.all([fetchAllSlugs(wpUrl, "pages"), fetchAllSlugs(wpUrl, "posts")])

			// Landing pages (e.g. pages/sample-page.vue) are individual
			// file-based routes, not served through [...slug].vue, so
			// Nuxt already includes them in the static build on its own
			// — no WP lookup needed for those.
			nitroConfig.prerender = nitroConfig.prerender || {}
			nitroConfig.prerender.routes = nitroConfig.prerender.routes || []
			for (const slug of [...pageSlugs, ...postSlugs]) {
				nitroConfig.prerender.routes.push(`/${slug}`)
			}

			console.log(`Prerender: added ${pageSlugs.length} pages, ${postSlugs.length} posts`)
		}
	},
	svgo: {
		dts: true
	},
	fonts: {
		defaults: {
			weights: [300, 400, 500, 600, 700],
			styles: ["normal", "italic"],
			subsets: ["latin", "latin-ext"]
		}
	},
	image: {
		quality: 80,
		provider: "none",
		dir: "assets/images",
		domains: ["https://www.floatinggoat.dk"]
	}
})
