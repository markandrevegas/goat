// composables/useCookieConsent.ts
export function useCookieConsent() {
	const { public: { gtmId } } = useRuntimeConfig()
  const showBanner = useState('cookie-banner-visible', () => false)
  const analyticsGranted = useState('consent-analytics', () => false)
  const marketingGranted = useState('consent-marketing', () => false)

  // Resolve stored state synchronously — this runs BEFORE GTM initializes
  function resolveStoredConsent() {
    if (import.meta.server) return null

    const stored = localStorage.getItem('cookie-consent')
    if (!stored) return null

    try {
      return JSON.parse(stored) as { analytics: boolean, marketing: boolean }
    } catch {
      return null
    }
  }

  const storedConsent = resolveStoredConsent()

  // This runs at module scope so defaultConsent gets the right value on first paint
  const { consent } = useScriptGoogleTagManager({
    id: gtmId,
    defaultConsent: {
      ad_storage: storedConsent?.marketing ? 'granted' : 'denied',
      ad_user_data: storedConsent?.marketing ? 'granted' : 'denied',
      ad_personalization: storedConsent?.marketing ? 'granted' : 'denied',
      analytics_storage: storedConsent?.analytics ? 'granted' : 'denied',
    },
  })

  function loadConsent() {
    const stored = resolveStoredConsent()
    if (stored) {
      analyticsGranted.value = stored.analytics
      marketingGranted.value = stored.marketing
      showBanner.value = false
    } else {
      showBanner.value = true
    }
  }

  function saveConsent(choices: { analytics: boolean, marketing: boolean }) {
    localStorage.setItem('cookie-consent', JSON.stringify(choices))
    localStorage.setItem('cookie-consent-timestamp', Date.now().toString())

    analyticsGranted.value = choices.analytics
    marketingGranted.value = choices.marketing
    showBanner.value = false

    // Push the update to GTM/gtag
    consent?.update({
      analytics_storage: choices.analytics ? 'granted' : 'denied',
      ad_storage: choices.marketing ? 'granted' : 'denied',
      ad_user_data: choices.marketing ? 'granted' : 'denied',
      ad_personalization: choices.marketing ? 'granted' : 'denied',
    })
  }

  function acceptAll() {
    saveConsent({ analytics: true, marketing: true })
  }

  function rejectAll() {
    saveConsent({ analytics: false, marketing: false })
  }

  function resetConsent() {
    localStorage.removeItem('cookie-consent')
    localStorage.removeItem('cookie-consent-timestamp')
    showBanner.value = true
  }

  return {
    showBanner,
    analyticsGranted,
    marketingGranted,
    loadConsent,
    saveConsent,
    acceptAll,
    rejectAll,
    resetConsent,
  }
}