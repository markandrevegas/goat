export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()
	const rawPath = event.context.params?.path || ""
	const query = getQuery(event)

	// Clean shop domain (must NOT contain http:// or https://)
	const rawDomain = config.public?.sharefoxShopDomain || config.sharefoxShopDomain || ""
	const shopDomain = rawDomain.replace(/^https?:\/\//, "").replace(/\/$/, "")

	// Base Sharefox API URL
	const rawBaseUrl = config.sharefoxApiUrl || config.public?.sharefoxApiUrl || "https://api.mysharefox.com/api-v2"
	const baseUrl = rawBaseUrl.replace(/\/$/, "")

	const cleanPath = rawPath.replace(/^\/+/, "")
	const targetUrl = `${baseUrl}/${cleanPath}`

	try {
		return await $fetch(targetUrl, {
			query,
			headers: {
				"x-sharefox-shop-domain": shopDomain,
				locale: "da"
			}
		})
	} catch (error: any) {
		throw createError({
			statusCode: error?.response?.status || 500,
			statusMessage: error?.response?.statusText || "Failed to fetch from Sharefox API",
			data: error?.data
		})
	}
})
