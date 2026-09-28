import { ref, onMounted } from "vue"

const showBanner = ref(false)
const analyticsGranted = ref(false)
const marketingGranted = ref(false)

// GTM only recognises the Arguments object, not an array
function gtag(..._args: unknown[]) {
	window.dataLayer = window.dataLayer || []
	// eslint-disable-next-line prefer-rest-params
	;(window.dataLayer as unknown[]).push(arguments)
}

export function useCookieConsent() {
	function resolveStoredConsent() {
		if (typeof window === "undefined") return null
		const stored = localStorage.getItem("cookie-consent")
		if (!stored) return null
		try {
			return JSON.parse(stored) as { analytics: boolean; marketing: boolean }
		} catch {
			return null
		}
	}

	function loadConsent() {
		if (typeof window === "undefined") return
		const choices = resolveStoredConsent()
		if (choices) {
			analyticsGranted.value = choices.analytics
			marketingGranted.value = choices.marketing
			showBanner.value = false
		} else {
			showBanner.value = true
		}
	}

	if (import.meta.client) {
		onMounted(() => {
			loadConsent()
		})
	}

	function saveConsent(choices: { analytics: boolean; marketing: boolean }) {
		localStorage.setItem("cookie-consent", JSON.stringify(choices))
		localStorage.setItem("cookie-consent-timestamp", Date.now().toString())

		analyticsGranted.value = choices.analytics
		marketingGranted.value = choices.marketing
		showBanner.value = false

		// Google Consent Mode v2 update
		if (import.meta.client) {
			gtag("consent", "update", {
				analytics_storage: choices.analytics ? "granted" : "denied",
				ad_storage: choices.marketing ? "granted" : "denied",
				ad_user_data: choices.marketing ? "granted" : "denied",
				ad_personalization: choices.marketing ? "granted" : "denied",
				personalization_storage: choices.analytics ? "granted" : "denied",
				functionality_storage: "granted",
				security_storage: "granted"
			})
		}
	}

	return {
		showBanner,
		analyticsGranted,
		marketingGranted,
		loadConsent,
		saveConsent,
		acceptAll: () => saveConsent({ analytics: true, marketing: true }),
		rejectAll: () => saveConsent({ analytics: false, marketing: false }),
		openBanner: () => {
			showBanner.value = true
		},
		resetConsent: () => {
			if (typeof window === "undefined") return
			localStorage.removeItem("cookie-consent")
			localStorage.removeItem("cookie-consent-timestamp")
			analyticsGranted.value = false
			marketingGranted.value = false
			showBanner.value = true
		}
	}
}