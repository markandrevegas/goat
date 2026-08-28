// composables/useCookieConsent.ts
export function useCookieConsent() {
	const showBanner = useState("cookie-banner-visible", () => false)
	const analyticsGranted = useState("consent-analytics", () => false)
	const marketingGranted = useState("consent-marketing", () => false)

	// Synchronously resolve local storage on client load
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

	// Read existing choice before GTM initializes
	const stored = resolveStoredConsent()

	const { consent } = useScriptGoogleTagManager({
		scriptOptions: { bundle: false },
		defaultConsent: {
			analytics_storage: stored?.analytics ? "granted" : "denied",
			ad_storage: stored?.marketing ? "granted" : "denied",
			ad_user_data: stored?.marketing ? "granted" : "denied",
			ad_personalization: stored?.marketing ? "granted" : "denied",
			personalization_storage: stored?.analytics ? "granted" : "denied",
			functionality_storage: "granted",
			security_storage: "granted"
		}
	})

	function loadConsent() {
		const choices = resolveStoredConsent()
		if (choices) {
			analyticsGranted.value = choices.analytics
			marketingGranted.value = choices.marketing
			showBanner.value = false
		} else {
			showBanner.value = true
		}
	}

	function saveConsent(choices: { analytics: boolean; marketing: boolean }) {
		localStorage.setItem("cookie-consent", JSON.stringify(choices))
		localStorage.setItem("cookie-consent-timestamp", Date.now().toString())

		analyticsGranted.value = choices.analytics
		marketingGranted.value = choices.marketing
		showBanner.value = false

		// Push consent updates to GTM
		consent?.update({
			analytics_storage: choices.analytics ? "granted" : "denied",
			ad_storage: choices.marketing ? "granted" : "denied",
			ad_user_data: choices.marketing ? "granted" : "denied",
			ad_personalization: choices.marketing ? "granted" : "denied",
			personalization_storage: choices.analytics ? "granted" : "denied",
			functionality_storage: "granted",
			security_storage: "granted"
		})

		if (import.meta.client) {
			window.dataLayer = window.dataLayer || []
			window.dataLayer.push({ event: "consent_update" })
		}
	}

	return {
		showBanner,
		analyticsGranted,
		marketingGranted,
		loadConsent,
		saveConsent,
		acceptAll: () => saveConsent({ analytics: true, marketing: true }),
		rejectAll: () => saveConsent({ analytics: false, marketing: false })
	}
}
