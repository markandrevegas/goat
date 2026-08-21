interface MediaDetails {
	source_url: string
	alt_text?: string
	media_details?: {
		width: number
		height: number
	}
}

interface AuthorDetails {
	id: number
	name: string
	slug: string
	avatar_urls?: Record<string, string>
}

export interface WordPressPostOrPage {
	id: number
	title: {
		rendered: string
	}
	slug: string
	content: {
		rendered: string
	}
	acf?: Record<string, any>
	_embedded?: {
		"wp:featuredmedia"?: MediaDetails[]
		author?: AuthorDetails[]
	}
}

export const useWordPressContent = () => {
	const config = useRuntimeConfig()
	const goatWordpressUrl = config.public.goatWordpressUrl

	const getContentBySlug = async (endpoint: "posts" | "pages", slug: string) => {
		const results = await $fetch<WordPressPostOrPage[]>(`${goatWordpressUrl}/${endpoint}`, {
			query: {
				slug,
				_embed: 1,
				_fields: "id,title,slug,content,acf,_links,_embedded"
			}
		})

		return results[0] ?? null
	}

	return {
		getPost: (slug: string) => getContentBySlug("posts", slug),
		getPage: (slug: string) => getContentBySlug("pages", slug)
	}
}
