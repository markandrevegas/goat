export const useTrackEvent = () => {
  const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
    if (import.meta.client && typeof window.gtag === 'function') {
      const isDev = process.dev || window.location.hostname === 'localhost'
      
      window.gtag('event', eventName, {
        ...params,
        debug_mode: isDev
      })

      if (isDev) {
        console.log(`[GA4 Event Fired]: ${eventName}`, params)
      }
    }
  }

  return { trackEvent }
}