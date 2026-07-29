declare global {
  interface Window {
    gtag?: (...args: any[]) => void
    dataLayer?: any[]
  }
}
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const measurementId = config.public.gtagId

  if (!measurementId) {
    console.warn('[GA4] Missing NUXT_PUBLIC_GA_MEASUREMENT_ID in environment variables.')
    return
  }

  const isDev = import.meta.dev || (import.meta.client && window.location.hostname === 'localhost')

  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
        async: true
      },
      {
        innerHTML: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${measurementId}', {
            send_page_view: true,
            debug_mode: ${isDev}
          });
        `,
        type: 'text/javascript'
      }
    ]
  })

  const router = useRouter()
  router.afterEach((to) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: to.fullPath,
        page_title: document.title,
        debug_mode: isDev
      })
    }
  })
})