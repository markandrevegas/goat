import { getSharefoxToken } from "~~/server/utils/sharefoxAuth"

export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig()

	// Extracts subpath (e.g. "api-v2/product-unavailability/1027/days")
	const subpath = getRouterParam(event, "path") || ""
	const query = getQuery(event)
	const method = event.method

	// Use tenant domain (e.g. https://fg.floatinggoat.dk) or fallback to api.mysharefox.com
	const baseURL = String(config.sharefoxApiUrl || config.public.sharefoxApiUrl || "https://fg.floatinggoat.dk")
	const shopDomain = String(config.sharefoxShopDomain || config.public.sharefoxShopDomain || "fg.floatinggoat.dk")

	const token = await getSharefoxToken()
	const headers: Record<string, string> = {
		"x-sharefox-shop-domain": shopDomain,
		locale: "da"
	}

	if (config.sharefoxToken) {
		headers["Authentication"] = `Bearer ${config.sharefoxToken}`
	}

	try {
		return await $fetch(`/${subpath.replace(/^\//, "")}`, {
			baseURL,
			method,
			query,
			headers
		})
	} catch (err: any) {
		throw createError({
			statusCode: err.statusCode || 500,
			statusMessage: err.statusMessage || "Sharefox Proxy Error",
			data: err.data
		})
	}
})
