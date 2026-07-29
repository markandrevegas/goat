export interface WordPressPage {
  id: number
  slug: string
  title: {
    rendered: string
  }
}

export const useMenu = () => {
  const config = useRuntimeConfig()
  const baseUrl = config.public.wpApiBaseUrl || 'https://wp.local/wp-json/wp/v2'

  return useAsyncData<WordPressPage[]>(
    'wp-menu-pages',
    async () => {
      const res = await $fetch(`${baseUrl}/pages?per_page=10&_fields=id,title,slug`)
      return Array.isArray(res) ? res : []
    },
    {
      server: false,
      lazy: true
    }
  )
}