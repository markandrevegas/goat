import type { WordPressPostOrPage, WordPressMenuItem, WordPressLandingPage } from "~/types/wordpress"

/**
 * Single shared fetch helper. Absolute URL means Nuxt's ofetch baseURL
 * is irrelevant here, so there's no need to pass baseURL: "" like the
 * old composables did.
 */
const wpFetch = <T>(endpoint: string, query: Record<string, any>) => {
	const config = useRuntimeConfig()
	return $fetch<T>(`${config.public.goatWordpressUrl}/${endpoint}`, { query })
}

export const useWordPress = () => {
	/**
	 * Single page or post by slug. Includes _embed data (featured image,
	 * author) plus excerpt and yoast_head_json, both of which the old
	 * useWordPressContent left out of _fields despite [...slug].vue
	 * reading rawContentData.value?.excerpt and .yoast_head_json — so
	 * seoDescription/ogImage were silently always falling back to
	 * their defaults. Fixed here.
	 */
	const getContentBySlug = async (endpoint: "posts" | "pages", slug: string) => {
		const results = await wpFetch<WordPressPostOrPage[]>(endpoint, {
			slug,
			_embed: 1,
			_fields: "id,date,title,slug,content,excerpt,acf,yoast_head_json,_links,_embedded"
		})
		return results[0] ?? null
	}

	const getPage = (slug: string) => getContentBySlug("pages", slug)
	const getPost = (slug: string) => getContentBySlug("posts", slug)

	/**
	 * Landing pages are a separate custom post type, used for campaign
	 * pages that are deliberately not linked from nav.
	 */
	const getLandingPage = async (slug: string) => {
		const results = await wpFetch<WordPressLandingPage[]>("landingpage", {
			slug,
			_fields: "id,title,slug,acf"
		})
		return results[0] ?? null
	}

	/** Batch fetch by id, preserving the order the ids were given in. */
	const getByIds = async (endpoint: "pages" | "posts", ids: number[]) => {
		if (!ids.length) return []
		return await wpFetch<WordPressMenuItem[]>(endpoint, {
			include: ids.join(","),
			orderby: "include",
			_fields: "id,title,slug"
		})
	}

	const getPagesByIds = (ids: number[]) => getByIds("pages", ids)
	const getPostsByIds = (ids: number[]) => getByIds("posts", ids)

	/**
	 * All published items of a type, paginated past WP's per_page=100 cap.
	 * Used anywhere you want the full set rather than specific pinned ids
	 * (e.g. a "Recent Posts" sidebar, or a full page index).
	 */
	const getAllByType = async (endpoint: "pages" | "posts") => {
		const results: WordPressMenuItem[] = []
		let page = 1

		while (true) {
			const batch = await wpFetch<WordPressMenuItem[]>(endpoint, {
				status: "publish",
				per_page: 100,
				page,
				orderby: "date",
				order: "desc",
				_fields: "id,title,slug"
			})
			if (!batch.length) break
			results.push(...batch)
			if (batch.length < 100) break
			page++
		}

		return results
	}

	const getPages = () => getAllByType("pages")
	const getPosts = () => getAllByType("posts")

	/**
	 * Nav menu data. If no page ids are given, falls back to fetching
	 * all pages (matches the old useWordPressMenu behaviour).
	 */
	const getMenu = (options: { pages?: number[]; posts?: number[] } = {}) => {
		const pageIds = options.pages || []
		const postIds = options.posts || []

		return useAsyncData(`wp-menu-${pageIds.join("-")}-${postIds.join("-")}`, async () => {
			const [pages, posts] = await Promise.all([pageIds.length ? getPagesByIds(pageIds) : getPages(), postIds.length ? getPostsByIds(postIds) : Promise.resolve([])])
			return [...pages, ...posts]
		})
	}

	return {
		getPage,
		getPost,
		getLandingPage,
		getPages,
		getPosts,
		getPagesByIds,
		getPostsByIds,
		getMenu
	}
}