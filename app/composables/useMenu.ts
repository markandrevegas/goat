export interface WordPressPage {
	id: number
	slug: string
	title: {
		rendered: string
	}
}
interface WordPressMenuOptions {
	pages?: number[]
	posts?: number[]
}

export const useWordPressMenu = (options: WordPressMenuOptions = {}) => {
	const { pages = [], posts = [] } = options

	const config = useRuntimeConfig()
	const wordpressUrl = config.public.wordpressUrl

	return useAsyncData<WordPressPage[]>(
		`wp-menu-${pages.join("-")}-${posts.join("-")}`,
		async () => {
			const requests = []

			if (pages.length) {
				requests.push(
					$fetch<WordPressPage[]>(`${wordpressUrl}/pages`, {
						baseURL: "",
						query: {
							include: pages.join(","),
							orderby: "include",
							_fields: "id,title,slug"
						}
					})
				)
			}

			if (posts.length) {
				requests.push(
					$fetch<WordPressPage[]>(`${wordpressUrl}/posts`, {
						baseURL: "",
						query: {
							include: posts.join(","),
							orderby: "include",
							_fields: "id,title,slug,excerpt"
						}
					})
				)
			}

			const results = await Promise.all(requests)

			return results.flat()
		},
		{
			lazy: true,
			server: false
		}
	)
}
