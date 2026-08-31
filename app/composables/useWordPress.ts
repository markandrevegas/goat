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
	 * author) plus excerpt and yoast_head_json.
	 */
	const getContentBySlug = (endpoint: "posts" | "pages", slug: string) => {
		const key = `wp-single-${endpoint}-${slug}`

		return useAsyncData(key, async () => {
			if (!slug) return null

			const results = await wpFetch<WordPressPostOrPage[]>(endpoint, {
				slug,
				_embed: 1,
				_fields: "id,date,title,slug,content,excerpt,acf,yoast_head_json,_links,_embedded"
			})

			// Return null explicitly if item isn't found
			return results?.[0] ?? null
		})
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

	/**
	 * Batch fetch by array of slugs, preserving the order of the provided slugs.
	 */
	const getBySlugs = async (endpoint: "pages" | "posts", slugs: string[]) => {
		if (!slugs.length) return []
		const results = await wpFetch<WordPressMenuItem[]>(endpoint, {
			slug: slugs.join(","),
			_fields: "id,title,slug"
		})

		// Preserve input order since WP REST API doesn't support orderby="slug_in"
		return slugs.map((slug) => results.find((item) => item.slug === slug)).filter((item): item is WordPressMenuItem => item !== undefined)
	}

	const getPagesBySlugs = (slugs: string[]) => getBySlugs("pages", slugs)
	const getPostsBySlugs = (slugs: string[]) => getBySlugs("posts", slugs)

	/**
	 * All published items of a type, paginated past WP's per_page=100 cap.
	 * Filters out any items whose slug matches excludeSlugs in memory.
	 */
	const getAllByType = async (endpoint: "pages" | "posts", excludeSlugs: string[] = []) => {
		const results: WordPressMenuItem[] = []
		let page = 1
		const excludeSet = new Set(excludeSlugs)

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

			const filteredBatch = excludeSlugs.length ? batch.filter((item) => !excludeSet.has(item.slug)) : batch

			results.push(...filteredBatch)
			if (batch.length < 100) break
			page++
		}

		return results
	}

	/**
	 * Flexible fetcher for Pages with optional inclusion/exclusion lists.
	 */
	const getPages = (options: { include?: string[]; exclude?: string[] } = {}) => {
		const include = options.include || []
		const exclude = options.exclude || []
		const key = `wp-pages-inc-${include.join("-")}-exc-${exclude.join("-")}`

		return useAsyncData(key, async () => {
			if (include.length > 0) {
				const items = await getPagesBySlugs(include)
				return exclude.length ? items.filter((item) => !exclude.includes(item.slug)) : items
			}
			return getAllByType("pages", exclude)
		})
	}

	/**
	 * Flexible fetcher for Posts with optional inclusion/exclusion lists.
	 */
	const getPosts = (options: { include?: string[]; exclude?: string[] } = {}) => {
		const include = options.include || []
		const exclude = options.exclude || []
		const key = `wp-posts-inc-${include.join("-")}-exc-${exclude.join("-")}`

		return useAsyncData(key, async () => {
			if (include.length > 0) {
				const items = await getPostsBySlugs(include)
				return exclude.length ? items.filter((item) => !exclude.includes(item.slug)) : items
			}
			return getAllByType("posts", exclude)
		})
	}

	return {
		getPage,
		getPost,
		getLandingPage,
		getPages,
		getPosts,
		getPagesBySlugs,
		getPostsBySlugs
	}
}
