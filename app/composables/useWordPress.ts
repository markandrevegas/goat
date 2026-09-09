import type { WordPressPostOrPage, WordPressMenuItem, WordPressLandingPage, WordPressPrivatePage } from "~/types/wordpress"

const wpFetch = <T>(endpoint: string, query: Record<string, any>) => {
	const config = useRuntimeConfig()

	if (!config.public.goatWordpressUrl) {
		throw new Error("[wpFetch] NUXT_PUBLIC_GOAT_WORDPRESS_URL is not set.")
	}

	const fullUrl = `${config.public.goatWordpressUrl}/${endpoint}`

	return $fetch<T>(fullUrl, {
		query,
		retry: 4,
		retryDelay: 3_000,
		timeout: 10_000
	})
}

export const useWordPress = () => {
	/**
	 * Single post, page, or private CPT fetcher
	 */
	const getContentBySlug = async (endpoint: "posts" | "pages" | "private", slug: string) => {
	if (!slug) return null

	try {
		const results = await wpFetch<WordPressPostOrPage[]>(endpoint, {
			slug,
			status: "publish",
			_embed: 1,
			_fields: "id,date,title,slug,content,excerpt,acf,yoast_head_json,_links,_embedded"
		})

		return results?.[0] ? { ...results[0], _type: endpoint } : null
	} catch (err: any) {
		// A 404 just means "no such route/content" — let the caller fall
		// through to the next type instead of blowing up the whole page.
		if (err?.response?.status === 404) return null
		throw err
	}
}

	const getPage = (slug: string) => getContentBySlug("pages", slug)
	const getPost = (slug: string) => getContentBySlug("posts", slug)
	const getPrivatePage = (slug: string) => getContentBySlug("private", slug)

	const getLandingPage = async (slug: string) => {
		const results = await wpFetch<WordPressLandingPage[]>("landingpage", {
			slug,
			_fields: "id,title,slug,acf"
		})
		return results[0] ?? null
	}

	const getBySlugs = async (endpoint: "pages" | "posts" | "private", slugs: string[]) => {
		if (!slugs.length) return []
		const results = await wpFetch<WordPressMenuItem[]>(endpoint, {
			slug: slugs.join(","),
			_fields: "id,title,slug"
		})

		return slugs.map((slug) => results.find((item) => item.slug === slug)).filter((item): item is WordPressMenuItem => item !== undefined)
	}

	const getPagesBySlugs = (slugs: string[]) => getBySlugs("pages", slugs)
	const getPostsBySlugs = (slugs: string[]) => getBySlugs("posts", slugs)
	const getPrivatePagesBySlugs = (slugs: string[]) => getBySlugs("private", slugs)

	const getAllByType = async (endpoint: "pages" | "posts" | "private", excludeSlugs: string[] = []) => {
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

	const getPrivatePages = (options: { include?: string[]; exclude?: string[] } = {}) => {
		const include = options.include || []
		const exclude = options.exclude || []
		const key = `wp-private-pages-inc-${include.join("-")}-exc-${exclude.join("-")}`

		return useAsyncData(key, async () => {
			if (include.length > 0) {
				const items = await getPrivatePagesBySlugs(include)
				return exclude.length ? items.filter((item) => !exclude.includes(item.slug)) : items
			}
			return getAllByType("private", exclude)
		})
	}

	return {
		getPage,
		getPost,
		getPrivatePage,
		getContentBySlug,
		getLandingPage,
		getPages,
		getPosts,
		getPrivatePages,
		getPagesBySlugs,
		getPostsBySlugs,
		getPrivatePagesBySlugs,
		getAllByType
	}
}