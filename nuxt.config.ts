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

function wordpressOrigin(): string | null {
	const wpUrl = process.env.NUXT_PUBLIC_GOAT_WORDPRESS_URL
	if (!wpUrl) return null
	try {
		return new URL(wpUrl).origin
	} catch {
		return null
	}
}

const wpOrigin = wordpressOrigin()

export default defineNuxtConfig({
	ssr: true,
	app: {
		baseURL: "/",
		buildAssetsDir: "/_nuxt/",
		head: {
			htmlAttrs: {
				lang: "da-DK"
			},
			meta: [{ name: "viewport", content: "width=device-width, initial-scale=1" }],
			link: [
				...(wpOrigin
					? [
							{
								rel: "preconnect",
								href: wpOrigin,
								crossorigin: "" as const
							}
						]
					: []),
				{
					rel: "icon",
					type: "image/png",
					href: "/favicon/favicon-96x96.png",
					sizes: "96x96"
				},
				{
					rel: "icon",
					type: "image/svg+xml",
					href: "/favicon/favicon.svg"
				},
				{
					rel: "shortcut icon",
					href: "/favicon/favicon.ico"
				},
				{
					rel: "apple-touch-icon",
					sizes: "180x180",
					href: "/favicon/apple-touch-icon.png"
				},
				{
					rel: "manifest",
					href: "/favicon/site.webmanifest"
				}
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
	modules: ["@tailwindcss/typography", "@nuxt/scripts", "nuxt-svgo", "@nuxt/fonts", "@nuxt/image", "@nuxtjs/sitemap"],
	runtimeConfig: {
		sharefoxEmail: process.env.SHAREFOX_EMAIL || "",
		sharefoxPassword: process.env.SHAREFOX_PASSWORD || "",
		sharefoxAuthUrl: process.env.SHAREFOX_AUTH_URL,
		sharefoxAdminDomain: process.env.SHAREFOX_ADMIN_DOMAIN,
		sharefoxApiUrl: process.env.SHAREFOX_API_URL,
		sharefoxStoreUrl: process.env.SHAREFOX_SHOP_DOMAIN,
		sharefoxShopDomain: process.env.SHAREFOX_SHOP_DOMAIN,
		public: {
			siteUrl: "https://floatinggoat.dk",
			goatWordpressUrl: process.env.NUXT_PUBLIC_GOAT_WORDPRESS_URL,
			gtmId: process.env.NUXT_PUBLIC_GTM_ID || process.env.GTM_ID || "",
			sharefoxApiUrl: process.env.NUXT_PUBLIC_SHAREFOX_API_URL,
			sharefoxShopDomain: process.env.NUXT_PUBLIC_SHAREFOX_SHOP_DOMAIN
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
		registry: {},
		defaultScriptOptions: {
			trigger: "onNuxtReady"
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
		// Explicit for clarity — this is what actually runs under pm2 on
		// the VPS (`.output/server/index.mjs`), replacing the old static
		// `.output/public/` artifact that rsync used to push to one.com.
		preset: "node-server",
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
			"/*.xsl": { proxy: "https://www.floatinggoat.dk/*.xsl" },
			"/_ipx/**": {
				headers: {
					"cache-control": "public, max-age=31536000, immutable"
				}
			},
			"/images/**": {
				headers: {
					"cache-control": "public, max-age=31536000, immutable"
				}
			}
		}
	},
	svgo: {
		dts: true
	},
	fonts: {
		providers: {
			fontshare: false
		},
		families: [
			{
				name: "Inter",
				weights: [400, 600],
				styles: ["normal"],
				subsets: ["latin"]
			},
			{
				name: "Fraunces",
				weights: [400, 600],
				styles: ["normal"],
				subsets: ["latin"]
			}
		]
	},
	image: {
		domains: ["www.floatinggoat.dk", "floatinggoat.dk", "a0.muscache.com", "muscache.com"]
	}
})
