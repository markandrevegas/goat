let cachedToken: string | null = null
let tokenExpiresAt: number = 0

interface SharefoxLoginResponse {
  token?: string
  access_token?: string
  jwt?: string
  expiresIn?: number
  [key: string]: any
}

export async function getSharefoxToken(): Promise<string> {
  const config = useRuntimeConfig()
  const now = Date.now()

  // 1. Return cached token if valid
  if (cachedToken && tokenExpiresAt > now + 5 * 60 * 1000) {
    return cachedToken
  }

  // Auth must point to the central Sharefox API gateway
  const authBaseURL = 'https://api.mysharefox.com'
  const shopDomain = String(config.sharefoxShopDomain || 'mar-k-waterside.admin.mysharefox.com')
	const adminDomain = String(config.sharefoxAdminDomain || 'mar-k-waterside.admin.mysharefox.com')
  const email = String(config.sharefoxEmail || '')
  const password = String(config.sharefoxPassword || '')

  if (!email || !password) {
    throw createError({
      statusCode: 500,
      statusMessage: 'SHAREFOX_EMAIL or SHAREFOX_PASSWORD is missing in runtimeConfig'
    })
  }

  const body = { email, password }

  const headers: Record<string, string> = {
    'x-sharefox-shop-domain': shopDomain,
		'x-sharefox-admin-domain': adminDomain,
    'locale': 'da',
    'origin': '1',
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }

  // Endpoints to check on api.mysharefox.com
  const endpoints = ['/login', '/admin/login', '/api-v2/auth/login']
  let lastError: any = null

  for (const endpoint of endpoints) {
    try {
      console.log(`[SharefoxAuth] Attempting login at ${authBaseURL}${endpoint}...`)

      const res = await $fetch<SharefoxLoginResponse>(endpoint, {
        baseURL: authBaseURL,
        method: 'POST',
        headers,
        body,
        retry: 0
      })

      const token = res.token || res.access_token || res.jwt
      if (!token) {
        console.warn(`[SharefoxAuth] No token field in response from ${endpoint}:`, res)
        continue
      }

      cachedToken = token
      const ttl = (res.expiresIn ?? 24 * 60 * 60) * 1000
      tokenExpiresAt = now + ttl

      console.log(`[SharefoxAuth] Successfully retrieved token via ${endpoint}!`)
      return cachedToken
    } catch (err: any) {
      lastError = err
      console.error(`[SharefoxAuth] Failed at ${endpoint}:`, {
        statusCode: err.statusCode || err.response?.status,
        message: err.data?.message || err.message
      })
    }
  }

  throw createError({
    statusCode: lastError?.statusCode || 401,
    statusMessage: lastError?.data?.message || lastError?.statusMessage || 'Sharefox authentication failed',
    data: lastError?.data || lastError?.response?._data
  })
}