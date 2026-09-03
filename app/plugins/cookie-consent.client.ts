export default defineNuxtPlugin(() => {
	const { loadConsent } = useCookieConsent()
	loadConsent()
})
