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
    if (import.meta.dev) {
      console.warn('[GA4] Missing gtagId in runtimeConfig.')
    }
    return
  }

  const isDev = import.meta.dev || window.location.hostname === 'localhost'
  window.dataLayer = window.dataLayer || []
  
  function gtag(...args: any[]) {
    window.dataLayer?.push(args)
  }

  window.gtag = gtag

  gtag('js', new Date())
  gtag('config', measurementId, {
    send_page_view: true,
    debug_mode: isDev
  })

  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${measurementId}`,
        async: true
      }
    ]
  })

  // 4. Handle client-side route changes for SPA navigation
  const router = useRouter()
  router.afterEach((to) => {
    // Small delay ensures document.title has updated after page transition
    nextTick(() => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', {
          send_to: measurementId, // Explicitly binds to stream
          page_path: to.fullPath,
          page_title: document.title,
          debug_mode: isDev
        })
      }
    })
  })
})