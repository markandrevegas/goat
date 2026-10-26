let cachedToken: string | null = null
let tokenExpiresAt: number = 0

export async function getSharefoxToken(): Promise<string> {
	const config = useRuntimeConfig()
	const now = Date.now()

	// Return cached token if it exists and hasn't expired (with a 5-minute buffer)
	if (cachedToken && tokenExpiresAt > now + 5 * 60 * 1000) {
		return cachedToken
	}

	const baseURL = String(config.sharefoxApiUrl || "https://fg.floatinggoat.dk")

	try {
		const res = await $fetch<{ token?: string; access_token?: string; expiresIn?: number }>("/admin/login", {
			baseURL,
			method: "POST",
			headers: {
				"x-sharefox-shop-domain": String(config.sharefoxShopDomain || "fg.floatinggoat.dk"),
				"Content-Type": "application/json"
			},
			body: {
				email: config.sharefoxEmail,
				password: config.sharefoxPassword
			}
		})

		const token = res.token || res.access_token
		if (!token) {
			throw new Error("No token returned from Sharefox login")
		}

		cachedToken = token
		const ttl = (res.expiresIn ?? 24 * 60 * 60) * 1000
		tokenExpiresAt = now + ttl

		return cachedToken
	} catch (error: any) {
		console.error("Sharefox Authentication Error:", error.data || error.message)
		throw createError({
			statusCode: 401,
			statusMessage: "Failed to authenticate with Sharefox"
		})
	}
}
