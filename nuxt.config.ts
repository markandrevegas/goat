import type { NitroRouteConfig } from 'nitropack'
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
		scripts?: {
			registry?: {
				googleAnalytics?: {
					id?: string
					queryParams?: {
						debug_mode?: boolean
						[key: string]: unknown
					}
					[key: string]: unknown
				}
				[key: string]: unknown
			}
			[key: string]: unknown
		}
		image?: {
			provider: string
			quality?: number
			domains?: string[]
		}
		nitro?: {
			preset?: string
			prerender?: {
				crawlLinks?: boolean
				routes?: string[]
			}
			externals?: {
				inline?: string[]
			}
			experimental?: {
				openAPI?: boolean
			}
			routeRules?: Record<string, NitroRouteConfig>
		}
	}
}
export default defineNuxtConfig({
	app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/goat/' : '/'
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@tailwindcss/typography', '@nuxt/scripts'],
  runtimeConfig: {
    public: {
      gaMeasurementId: process.env.NUXT_PUBLIC_GA_MEASUREMENT_ID,
      wordpressUrl: process.env.WP_API_BASE_URL || 'http://localhost:3001',
      wpApiBaseUrl: process.env.WP_API_BASE_URL,
      gtagId: process.env.NUXT_PUBLIC_GTAG_ID
    }
  },
  future: {
    compatibilityVersion: 4
  },
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  },
  scripts: {
    registry: {
      googleAnalytics: {
        id: process.env.NUXT_PUBLIC_GTAG_ID
      }
    }
  },
  typescript: {
    tsConfig: {
      compilerOptions: {
        types: ['bun']
      }
    }
  },
  nitro: {
		preset: "github-pages",
		prerender: {
			crawlLinks: true,
      routes: ['/']
    },
		routeRules: {
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
			'/**': {
        headers: {
          'Content-Security-Policy': "style-src 'self' 'unsafe-inline'"
        }
      }
    }
	}
})