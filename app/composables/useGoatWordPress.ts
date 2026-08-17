// composables/useWordPress.ts

interface LandingPageACF {
  // fill in your actual ACF field names/types once confirmed from the API response
  [key: string]: any
}

interface WordPressLandingPage {
  id: number
  title: {
    rendered: string
  }
  slug: string
  acf: LandingPageACF
}

export const useGoatWordPress = () => {
  const config = useRuntimeConfig()
  const wordpressUrl = config.public.goatWordpressUrl

  const getLandingPage = async (slug: string) => {
    const results = await $fetch<WordPressLandingPage[]>(`${wordpressUrl}/landingpage`, {
      baseURL: '',
      query: {
        slug,
        _fields: 'id,title,slug,acf'
      }
    })

    return results[0] ?? null
  }

  return {
    getLandingPage
  }
}