// server/plugins/verify-gtm-id.ts
export default defineNitroPlugin(() => {
	if (process.env.NODE_ENV === "production" && !process.env.NUXT_PUBLIC_GTM_ID) {
		throw new Error("NUXT_PUBLIC_GTM_ID is not set — refusing to start in production with the test container ID")
	}
})
