declare global {
	interface Window {
		dataLayer?: unknown[]
	}
}

export interface CookieConsentChoices {
	analytics: boolean
	marketing: boolean
}

export interface GoogleConsentPayload {
	analytics_storage: "granted" | "denied"
	ad_storage: "granted" | "denied"
	ad_user_data: "granted" | "denied"
	ad_personalization: "granted" | "denied"
	personalization_storage: "granted" | "denied"
	functionality_storage: "granted"
	security_storage: "granted"
}

const STORAGE_KEY = "cookie-consent"
const STORAGE_TIMESTAMP_KEY = "cookie-consent-timestamp"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

/**
 * Validates whether an incoming value matches the expected CookieConsentChoices schema.
 */
export function isValidConsentChoices(value: unknown): value is CookieConsentChoices {
	if (!value || typeof value !== "object") return false
	const candidate = value as Record<string, unknown>
	return typeof candidate.analytics === "boolean" && typeof candidate.marketing === "boolean"
}

/**
 * Transforms boolean preferences into Google Consent Mode v2 configuration.
 */
export function buildGoogleConsentPayload(choices: CookieConsentChoices): GoogleConsentPayload {
	const analyticsStatus = choices.analytics ? "granted" : "denied"
	const marketingStatus = choices.marketing ? "granted" : "denied"

	return {
		analytics_storage: analyticsStatus,
		ad_storage: marketingStatus,
		ad_user_data: marketingStatus,
		ad_personalization: marketingStatus,
		personalization_storage: analyticsStatus,
		functionality_storage: "granted",
		security_storage: "granted"
	}
}

/**
 * Dispatches gtag consent update to window.dataLayer strictly on the client side.
 */
export function pushGtagConsent(payload: GoogleConsentPayload): void {
	if (!import.meta.client || typeof window === "undefined") return

	try {
		window.dataLayer = window.dataLayer || []
		// GTM requires the raw Arguments object rather than a standard JS array
		;(function (this: unknown, ..._args: unknown[]) {
			// eslint-disable-next-line prefer-rest-params
			window.dataLayer?.push(arguments)
		})("consent", "update", payload)
	} catch (error) {
		// Non-fatal logging to avoid interrupting the user experience
		console.error("[useCookieConsent] Failed to push gtag consent update:", error)
	}
}

/**
 * Safely reads stored consent from localStorage with error boundary protection
 * for environments blocking access (e.g., restricted sandboxes or private browsing).
 */
export function readLocalStorageConsent(): CookieConsentChoices | null {
	if (!import.meta.client || typeof window === "undefined") return null

	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return null
		const parsed = JSON.parse(raw)
		return isValidConsentChoices(parsed) ? parsed : null
	} catch (error) {
		console.warn("[useCookieConsent] Unable to read from localStorage:", error)
		return null
	}
}

/**
 * Safely writes consent choices to localStorage with error catching for quota limits.
 */
export function writeLocalStorageConsent(choices: CookieConsentChoices): void {
	if (!import.meta.client || typeof window === "undefined") return

	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(choices))
		localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString())
	} catch (error) {
		console.warn("[useCookieConsent] Unable to write to localStorage:", error)
	}
}

/**
 * Safely clears consent choices from localStorage.
 */
export function clearLocalStorageConsent(): void {
	if (!import.meta.client || typeof window === "undefined") return

	try {
		localStorage.removeItem(STORAGE_KEY)
		localStorage.removeItem(STORAGE_TIMESTAMP_KEY)
	} catch (error) {
		console.warn("[useCookieConsent] Unable to remove from localStorage:", error)
	}
}

/**
 * SSR-safe Cookie Consent Composable.
 * Uses useState to prevent cross-request state pollution and useCookie for SSR-safe persistence.
 */
export function useCookieConsent() {
	// SSR-safe reactive state isolated per request to prevent cross-request state leakage
	const showBanner = useState<boolean>("cookie_consent_show_banner", () => false)
	const analyticsGranted = useState<boolean>("cookie_consent_analytics_granted", () => false)
	const marketingGranted = useState<boolean>("cookie_consent_marketing_granted", () => false)

	// Nuxt useCookie provides SSR-friendly cookie access and serialization across server/client
	const consentCookie = useCookie<CookieConsentChoices | null>(STORAGE_KEY, {
		maxAge: COOKIE_MAX_AGE,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production"
	})

	/**
	 * Synchronizes state from available persistent stores (cookie or client localStorage fallback).
	 */
	function loadConsent(): void {
		// 1. Check SSR-serialized cookie state
		if (isValidConsentChoices(consentCookie.value)) {
			analyticsGranted.value = consentCookie.value.analytics
			marketingGranted.value = consentCookie.value.marketing
			showBanner.value = false
			return
		}

		// 2. Client-only fallback to localStorage (for backward compatibility)
		if (import.meta.client) {
			const localConsent = readLocalStorageConsent()
			if (localConsent) {
				consentCookie.value = localConsent
				analyticsGranted.value = localConsent.analytics
				marketingGranted.value = localConsent.marketing
				showBanner.value = false
				return
			}
			showBanner.value = true
		}
	}

	/**
	 * Persists user consent, synchronizes cookies and localStorage, and notifies Google Tag Manager.
	 */
	function saveConsent(choices: CookieConsentChoices): void {
		// Error handling: enforce valid schema with createError
		if (!isValidConsentChoices(choices)) {
			throw createError({
				statusCode: 400,
				statusMessage: "Invalid cookie consent choices provided. Expected { analytics: boolean, marketing: boolean }.",
				fatal: false
			})
		}

		// Update reactive state
		analyticsGranted.value = choices.analytics
		marketingGranted.value = choices.marketing
		showBanner.value = false

		// Persist state SSR-safely via cookie
		consentCookie.value = choices

		// Persist to localStorage and dispatch Google Consent Mode update on client
		if (import.meta.client) {
			writeLocalStorageConsent(choices)
			const consentPayload = buildGoogleConsentPayload(choices)
			pushGtagConsent(consentPayload)
		}
	}

	/**
	 * Resets all consent choices and opens the banner again.
	 */
	function resetConsent(): void {
		consentCookie.value = null
		analyticsGranted.value = false
		marketingGranted.value = false
		showBanner.value = true

		if (import.meta.client) {
			clearLocalStorageConsent()
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
		resetConsent
	}
}
