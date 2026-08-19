interface WordPressMenuOptions {
	pages?: number[]
	posts?: number[]
}

export const useWordPressMenu = (options: WordPressMenuOptions = {}) => {
	const { pages = [], posts = [] } = options

	const { getPages, getPosts } = useWordPress()

	return useAsyncData(
		`wp-menu-${pages.join("-")}-${posts.join("-")}`,
		async () => {
			const [pageItems, postItems] = await Promise.all([getPages(pages), getPosts(posts)])

			return [...pageItems, ...postItems]
		},
		{
			lazy: true
		}
	)
}
