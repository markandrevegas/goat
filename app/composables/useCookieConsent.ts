export function useCookieConsent() {
	const showBanner = useState("cookie-banner-visible", () => false)
	const analyticsGranted = useState("consent-analytics", () => false)
	const marketingGranted = useState("consent-marketing", () => false)

	function resolveStoredConsent() {
		if (import.meta.server) return null
		const stored = localStorage.getItem("cookie-consent")
		if (!stored) return null
		try {
			return JSON.parse(stored) as { analytics: boolean; marketing: boolean }
		} catch {
			return null
		}
	}

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

	// 1. Resolve stored consent synchronously during composable init
	const initialConsent = resolveStoredConsent()
	const initialAnalytics = initialConsent ? initialConsent.analytics : false
	const initialMarketing = initialConsent ? initialConsent.marketing : false

	// 2. Pass existing consent status directly into defaultConsent
	const { consent } = useScriptGoogleTagManager({
		scriptOptions: { bundle: false },
		defaultConsent: {
			analytics_storage: initialAnalytics ? "granted" : "denied",
			ad_storage: initialMarketing ? "granted" : "denied",
			ad_user_data: initialMarketing ? "granted" : "denied",
			ad_personalization: initialMarketing ? "granted" : "denied"
		}
	})

	function saveConsent(choices: { analytics: boolean; marketing: boolean }) {
		localStorage.setItem("cookie-consent", JSON.stringify(choices))
		localStorage.setItem("cookie-consent-timestamp", Date.now().toString())

		analyticsGranted.value = choices.analytics
		marketingGranted.value = choices.marketing
		showBanner.value = false

		consent?.update({
			analytics_storage: choices.analytics ? "granted" : "denied",
			ad_storage: choices.marketing ? "granted" : "denied",
			ad_user_data: choices.marketing ? "granted" : "denied",
			ad_personalization: choices.marketing ? "granted" : "denied"
		})

		if (import.meta.client) {
			window.dataLayer = window.dataLayer || []
			window.dataLayer.push({ event: "consent_update" })
		}
	}

	function acceptAll() {
		saveConsent({ analytics: true, marketing: true })
	}

	function rejectAll() {
		saveConsent({ analytics: false, marketing: false })
	}

	function resetConsent() {
		localStorage.removeItem("cookie-consent")
		localStorage.removeItem("cookie-consent-timestamp")
		analyticsGranted.value = false
		marketingGranted.value = false
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
		resetConsent
	}
}
