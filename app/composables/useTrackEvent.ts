export const useTrackEvent = () => {
	const route = useRoute()

	const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
		if (import.meta.client) {
			const isDev = import.meta.dev || window.location.hostname === "localhost"

			const payload = {
				event: eventName, // Sets the GTM custom event name
				page_path: route.path,
				page_title: typeof document !== "undefined" ? document.title : "",
				...params,
				debug_mode: isDev
			}

			// Ensure dataLayer array exists
			window.dataLayer = window.dataLayer || []
			window.dataLayer.push(payload)

			if (isDev) {
				console.log(`[DataLayer Event Pushed]: ${eventName}`, payload)
			}
		}
	}

	return { trackEvent }
}