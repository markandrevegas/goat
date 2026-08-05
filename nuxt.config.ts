import type { NitroRouteConfig } from 'nitropack'
import tailwindcss from '@tailwindcss/vite'
declare module "nuxt/schema" {
	interface NuxtConfig {
		site?: {
			url?: string
			name?: string
			[key: string]: unknown
		}
		gtag?: {
			id?: string
			config?: {
				page_title?: string
				send_page_view?: boolean
				debug_mode?: boolean
				[key: string]: unknown
			}
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
    baseURL: process.env.NODE_ENV === 'production' ? '/goat/' : '/',
		head: {
			htmlAttrs: {
				lang: 'da-DK',
			},
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  compatibilityDate: '2025-07-15',
	css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  modules: ['@tailwindcss/typography', '@nuxt/scripts', 'nuxt-svgo', 'nuxt-gtag', '@nuxt/fonts', '@vueuse/nuxt', '@vueuse/motion/nuxt', '@nuxtjs/i18n'],
  runtimeConfig: {
    public: {
      gaMeasurementId: process.env.NUXT_PUBLIC_GA_MEASUREMENT_ID,
      wordpressUrl: process.env.NUXT_PUBLIC_WORDPRESS_URL,
      gtagId: process.env.NUXT_PUBLIC_GTAG_ID
    }
  },
  future: {
    compatibilityVersion: 4
  },
  vite: {
		plugins: [
      tailwindcss()
    ],
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
	},
	svgo: {
    dts: true
  },
	gtag: {
    id: process.env.NUXT_PUBLIC_GTAG_ID || 'G-0TNS5Z0421',
    config: {
      page_title: 'Nuxt App',
      send_page_view: true,
			debug_mode: false
    }
  },
	fonts: {
    defaults: {
      weights: [400, 500, 600, 700],
      styles: ['normal', 'italic']
    }
  }
})