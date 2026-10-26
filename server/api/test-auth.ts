
import { getSharefoxToken } from '~~/server/utils/sharefoxAuth'

export default defineEventHandler(async () => {
  const config = useRuntimeConfig()

  if (!config.sharefoxEmail || !config.sharefoxPassword) {
    return {
      success: false,
      message: 'Missing SHAREFOX_EMAIL or SHAREFOX_PASSWORD in runtimeConfig'
    }
  }

  try {

		const startTime = Date.now()
    const token = await getSharefoxToken()
    const duration = Date.now() - startTime

		const maskedToken = token.length > 16 
      ? `${token.slice(0, 8)}...${token.slice(-8)}` 
      : '***'

    return {
      success: true,
      durationMs: duration,
      tokenLength: token.length,
      preview: maskedToken,
      message: 'Token successfully retrieved and cached!'
    }
  } catch (err: any) {
    return {
      success: false,
      statusCode: err.statusCode || 500,
      message: err.message,
      data: err.data
    }
  }
})