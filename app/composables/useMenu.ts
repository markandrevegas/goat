export interface WordPressPage {
  id: number
  slug: string
  title: {
    rendered: string
  }
}

export const useMenu = () => {
  const config = useRuntimeConfig()
  const wordpressUrl = config.public.wordpressUrl

  return useAsyncData<WordPressPage[]>(
    'wp-menu-pages',
    async () => {
      const res = await $fetch(`${wordpressUrl}/pages`, {
        baseURL: '', 
        query: {
          include: [4619, 6652, 3].join(','),
          orderby: 'include',
          _fields: 'id,title,slug'
        }
      })
      
      return Array.isArray(res) ? res : []
    },
    {
      lazy: true,
      server: false
    }
  )
}