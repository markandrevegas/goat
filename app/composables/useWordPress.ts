interface WordPressPage {
	id: number
	title: {
		rendered: string
	}
	slug: string
	excerpt?: {
		rendered: string
	}
}

interface WordPressPost extends WordPressPage {}

export const useWordPress = () => {
	const config = useRuntimeConfig()
	const goatWordpressUrl = config.public.goatWordpressUrl

	const getPages = async (ids: number[] = []) => {
		if (!ids.length) {
			return []
		}

		return await $fetch<WordPressPage[]>(`${goatWordpressUrl}/pages`, {
			baseURL: "",
			query: {
				include: ids.join(","),
				orderby: "include",
				_fields: "id,title,slug"
			}
		})
	}

	const getPosts = async (ids: number[] = []) => {
		if (!ids.length) {
			return []
		}

		return await $fetch<WordPressPost[]>(`${goatWordpressUrl}/posts`, {
			baseURL: "",
			query: {
				include: ids.join(","),
				orderby: "include",
				_fields: "id,title,slug,excerpt"
			}
		})
	}

	return {
		getPages,
		getPosts
	}
}
