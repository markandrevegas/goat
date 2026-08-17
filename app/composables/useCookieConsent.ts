type ConsentState = {
  necessary: true
  analytics: boolean
  marketing: boolean
}

const CONSENT_KEY = 'cookie-consent'

export const useCookieConsent = () => {
  const consent = useState<ConsentState | null>('cookie-consent', () => null)
  const showBanner = useState<boolean>('cookie-banner-visible', () => false)

  const loadConsent = () => {
    if (import.meta.server) return
    const stored = localStorage.getItem(CONSENT_KEY)
    if (stored) {
      consent.value = JSON.parse(stored)
      showBanner.value = false
    } else {
      showBanner.value = true
    }
  }

  const saveConsent = (state: Omit<ConsentState, 'necessary'>) => {
    const full: ConsentState = { necessary: true, ...state }
    consent.value = full
    if (import.meta.client) {
      localStorage.setItem(CONSENT_KEY, JSON.stringify(full))
      localStorage.setItem(`${CONSENT_KEY}-timestamp`, new Date().toISOString())
    }
    showBanner.value = false
  }

  const acceptAll = () => saveConsent({ analytics: true, marketing: true })
  const rejectAll = () => saveConsent({ analytics: false, marketing: false })

  const openSettings = () => {
    showBanner.value = true
  }

  const isConsentGiven = (category: 'analytics' | 'marketing') => {
    return consent.value?.[category] === true
  }

  return {
    consent,
    showBanner,
    loadConsent,
    saveConsent,
    acceptAll,
    rejectAll,
    openSettings,
    isConsentGiven,
  }
}