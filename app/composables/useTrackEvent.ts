export const useTrackEvent = () => {
  const route = useRoute()

  const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
    if (import.meta.client && typeof window.gtag === 'function') {
      const isDev = import.meta.dev || window.location.hostname === 'localhost'

      const payload = {
        page_path: route.path,
        page_title: typeof document !== 'undefined' ? document.title : '',
        ...params,
        debug_mode: isDev
      }

      window.gtag('event', eventName, payload)

      if (isDev) {
        console.log(`[GA4 Event Fired]: ${eventName}`, payload)
      }
    }
  }

  return { trackEvent }
}