// composables/useWordPressMenu.ts
export const useWordPressMenu = async (options: { pages?: number[]; posts?: number[] } = {}) => {
	const config = useRuntimeConfig()
	const goatWordpressUrl = config.public.goatWordpressUrl

	const pageIds = options.pages || []
	const postIds = options.posts || []
	return await useAsyncData(`wp-menu-${pageIds.join("-")}-${postIds.join("-")}`, async () => {
		const fetches = []
		if (pageIds.length > 0) {
			fetches.push(
				$fetch<any[]>(`${goatWordpressUrl}/pages`, {
					query: {
						include: pageIds.join(","),
						_fields: "id,title,slug"
					}
				})
			)
		} else {
			fetches.push(
				$fetch<any[]>(`${goatWordpressUrl}/pages`, {
					query: {
						per_page: 100,
						_fields: "id,title,slug"
					}
				})
			)
		}

		// Fetch Posts if requested
		if (postIds.length > 0) {
			fetches.push(
				$fetch<any[]>(`${goatWordpressUrl}/posts`, {
					query: {
						include: postIds.join(","),
						_fields: "id,title,slug"
					}
				})
			)
		}

		const results = await Promise.all(fetches)

		// Flatten and combine page and post items into a single array
		return results.flat()
	})
}
