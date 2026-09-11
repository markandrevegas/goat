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
		head: {
			htmlAttrs: {
				lang: "da-DK"
			},
			meta: [
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ name: "robots", content: "noindex, nofollow" }
			],
			link: wpOrigin
				? [
						{
							rel: "preconnect",
							href: wpOrigin,
							crossorigin: ""
						}
					]
				: []
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
				defaultConsent: {
					ad_storage: "denied",
					analytics_storage: "denied",
					ad_user_data: "denied",
					ad_personalization: "denied"
				}
			}
		},
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
			"/*.xsl": { proxy: "https://www.floatinggoat.dk/*.xsl" }
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
		provider: "none"
	}
})
