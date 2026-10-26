// Only these upstream paths can be reached through the proxy
const ALLOWED = [/^product-unavailability\/\d+\/days$/]

export default defineCachedEventHandler(
	async (event) => {
		if (event.method !== "GET") {
			throw createError({ statusCode: 405, statusMessage: "Method Not Allowed" })
		}

		const config = useRuntimeConfig(event)
		const subpath = (getRouterParam(event, "path") || "").replace(/^\/+/, "")

		if (!ALLOWED.some((re) => re.test(subpath))) {
			throw createError({ statusCode: 404, statusMessage: "Not Found" })
		}

		try {
			return await $fetch(`/api-v2/${subpath}`, {
				baseURL: String(config.sharefoxStoreUrl),
				query: getQuery(event)
			})
		} catch (err: any) {
			throw createError({ statusCode: err.statusCode || 502, statusMessage: "Sharefox proxy error" })
		}
	},
	{ maxAge: 60 * 5, getKey: (event) => event.path }
)
