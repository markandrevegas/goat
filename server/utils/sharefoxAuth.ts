let cachedToken: string | null = null
let tokenExpiresAt = 0
let inflight: Promise<string> | null = null

const LOGIN_PATH = "/login"

function jwtExpiry(token: string): number | null {
	try {
		const part = token.split(".")[1]
		if (!part) return null
		const payload = JSON.parse(Buffer.from(part, "base64url").toString())
		return typeof payload.exp === "number" ? payload.exp * 1000 : null
	} catch {
		return null
	}
}

export function sharefoxHeaders(extra: Record<string, string> = {}) {
	const config = useRuntimeConfig()
	return {
		"x-sharefox-shop-domain": String(config.public.sharefoxShopDomain),
		locale: "da",
		origin: "1",
		Accept: "application/json"
	}
}

export async function getSharefoxToken(): Promise<string> {
	if (cachedToken && tokenExpiresAt > Date.now() + 5 * 60 * 1000) return cachedToken
	if (inflight) return inflight

	inflight = (async () => {
		const config = useRuntimeConfig()
		if (!config.sharefoxEmail || !config.sharefoxPassword) {
			throw createError({ statusCode: 500, statusMessage: "Sharefox credentials missing" })
		}

		const res = await $fetch<{ token?: string; access_token?: string; jwt?: string; expiresIn?: number }>(LOGIN_PATH, {
			baseURL: String(config.sharefoxAuthUrl),
			method: "POST",
			headers: sharefoxHeaders({ "Content-Type": "application/json" }),
			body: { email: config.sharefoxEmail, password: config.sharefoxPassword },
			retry: 0
		})

		const token = res.token || res.access_token || res.jwt
		if (!token) throw createError({ statusCode: 502, statusMessage: "No token in Sharefox login response" })

		cachedToken = token
		tokenExpiresAt = jwtExpiry(token) ?? Date.now() + (res.expiresIn ?? 3600) * 1000
		return token
	})().finally(() => {
		inflight = null
	})

	return inflight
}
