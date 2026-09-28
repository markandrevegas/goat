export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig()
	const gtmId = config.public.gtmId

	if (!gtmId) return

	let stored: { analytics: boolean; marketing: boolean } | null = null
	try {
		const raw = localStorage.getItem("cookie-consent")
		if (raw) stored = JSON.parse(raw)
	} catch {
		stored = null
	}

	useScriptGoogleTagManager({
		id: gtmId,
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
})