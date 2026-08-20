import type { NitroRouteConfig } from "nitropack"
import tailwindcss from "@tailwindcss/vite"
declare module "nuxt/schema" {
	interface NuxtConfig {
		site?: {
			url?: string
			name?: string
			[key: string]: unknown
		}
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
		client: false
	},
	compatibilityDate: "2025-07-15",
	css: ["~/assets/css/main.css"],
	devtools: { enabled: true },
	modules: ["@tailwindcss/typography", "@nuxt/scripts", "nuxt-svgo", "@nuxt/fonts", "@vueuse/nuxt", "@vueuse/motion/nuxt", "@nuxtjs/i18n", "@nuxt/image", "@dargmuesli/nuxt-cookie-control"],
	runtimeConfig: {
		public: {
			ga4StreamId: process.env.NUXT_PUBLIC_GA4_STREAM_ID,
			ga4PropertyId: process.env.NUXT_PUBLIC_GA4_PROPERTY_ID,
			goatWordpressUrl: process.env.NUXT_PUBLIC_GOAT_WORDPRESS_URL,
			gtmId: process.env.NUXT_PUBLIC_GTM_ID
		}
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
				defaultConsent: {
					ad_storage: "denied",
					analytics_storage: "denied",
					ad_user_data: "denied",
					ad_personalization: "denied"
				}
			}
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
		preset: "github-pages",
		prerender: {
			crawlLinks: true,
			routes: ["/"]
		},
		routeRules: {
			"/_nuxt/**": { headers: { "cache-control": "public, max-age=31536000, immutable" } },
			"/**": {
				headers: {
					"Content-Security-Policy": "style-src 'self' 'unsafe-inline'"
				}
			}
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
		domains: []
	}
})
