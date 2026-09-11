import type { WordPressPostOrPage, WordPressMenuItem, WordPressLandingPage, WordPressPrivatePage } from "~/types/wordpress"

export type ContentType = "pages" | "posts" | "private"

// Internal type name -> actual REST base, for types where they differ
const REST_BASE: Record<ContentType, string> = {
	pages: "pages",
	posts: "posts",
	private: "privatepage"
}

export const useWordPress = () => {
	const config = useRuntimeConfig()
	const wpFetch = <T>(endpoint: string, query: Record<string, any>) => {
		if (!config.public.goatWordpressUrl) {
			throw new Error("[wpFetch] NUXT_PUBLIC_GOAT_WORDPRESS_URL is not set.")
		}

		return $fetch<T>(`${config.public.goatWordpressUrl}/${endpoint}`, {
			query,
			retry: 4,
			retryDelay: 3_000,
			timeout: 10_000
		})
	}
	/**
	 * Single post or page fetcher by slug
	 */
	const getContentBySlug = async (type: "pages" | "posts", slug: string) => {
		if (!slug) return null

		try {
			const results = await wpFetch<WordPressPostOrPage[]>(REST_BASE[type], {
				slug,
				status: "publish",
				_embed: 1,
				_fields: "id,date,title,slug,content,excerpt,acf,yoast_head_json,_links,_embedded"
			})

			return results?.[0] ? { ...results[0], _type: type } : null
		} catch (err: any) {
			if (err?.response?.status === 404) return null
			console.error(`[getContentBySlug] type=${type} slug=${slug}`, err)
			throw err
		}
	}

	const getPage = (slug: string) => getContentBySlug("pages", slug)
	const getPost = (slug: string) => getContentBySlug("posts", slug)

	const getLandingPage = async (slug: string) => {
		const results = await wpFetch<WordPressLandingPage[]>("landingpage", {
			slug,
			_fields: "id,title,slug,acf"
		})
		return results[0] ?? null
	}

	const getPrivatePage = async (slug: string) => {
		if (!slug) return null

		try {
			const results = await wpFetch<WordPressPrivatePage[]>(REST_BASE.private, {
				slug,
				_fields: "id,title,slug,acf"
			})

			return results[0] ? { ...results[0], _type: "private" as const } : null
		} catch (err: any) {
			if (err?.response?.status === 404) return null
			console.error(`[getPrivatePage] slug=${slug}`, err)
			throw err
		}
	}

	/**
	 * Resolves a single slug against pages, posts, and private pages in turn.
	 */
	const resolveContentBySlug = async (slug: string) => {
		if (!slug) return null
		console.log("[resolveContentBySlug] START", slug)

		const page = await getContentBySlug("pages", slug)
		console.log("[resolveContentBySlug] pages result:", page)
		if (page) return page

		const post = await getContentBySlug("posts", slug)
		console.log("[resolveContentBySlug] posts result:", post)
		if (post) return post

		const privatePage = await getPrivatePage(slug)
		console.log("[resolveContentBySlug] private result:", privatePage)
		if (privatePage) return privatePage

		console.log("[resolveContentBySlug] nothing matched")
		return null
	}

	/**
	 * Batch-fetch a known list of slugs, preserving the requested order
	 */
	const getBySlugs = async (type: ContentType, slugs: string[]) => {
		if (!slugs.length) return []

		const results = await wpFetch<WordPressMenuItem[]>(REST_BASE[type], {
			slug: slugs.join(","),
			_fields: "id,title,slug"
		})

		return slugs.map((slug) => results.find((item) => item.slug === slug)).filter((item): item is WordPressMenuItem => item !== undefined)
	}

	/**
	 * Fetch every published item of a type, paginated, optionally excluding slugs
	 */
	const getAllByType = async (type: ContentType, excludeSlugs: string[] = []) => {
		const results: WordPressMenuItem[] = []
		const excludeSet = new Set(excludeSlugs)
		let page = 1

		while (true) {
			const batch = await wpFetch<WordPressMenuItem[]>(REST_BASE[type], {
				status: "publish",
				per_page: 100,
				page,
				orderby: "date",
				order: "desc",
				_fields: "id,title,slug"
			})
			if (!batch.length) break

			results.push(...(excludeSet.size ? batch.filter((item) => !excludeSet.has(item.slug)) : batch))

			if (batch.length < 100) break
			page++
		}

		return results
	}

	/**
	 * Shared list-fetcher used by getPages / getPosts / getPrivatePages
	 */
	const getContentList = (type: ContentType, options: { include?: string[]; exclude?: string[] } = {}) => {
		const include = options.include ?? []
		const exclude = options.exclude ?? []
		const key = `wp-${type}-inc-${include.join("-")}-exc-${exclude.join("-")}`

		return useAsyncData(key, async () => {
			if (include.length > 0) {
				const items = await getBySlugs(type, include)
				return exclude.length ? items.filter((item) => !exclude.includes(item.slug)) : items
			}
			return getAllByType(type, exclude)
		})
	}

	const getPages = (options: { include?: string[]; exclude?: string[] } = {}) => getContentList("pages", options)
	const getPosts = (options: { include?: string[]; exclude?: string[] } = {}) => getContentList("posts", options)
	const getPrivatePages = (options: { include?: string[]; exclude?: string[] } = {}) => getContentList("private", options)

	const getPagesBySlugs = (slugs: string[]) => getBySlugs("pages", slugs)
	const getPostsBySlugs = (slugs: string[]) => getBySlugs("posts", slugs)
	const getPrivatePagesBySlugs = (slugs: string[]) => getBySlugs("private", slugs)

	return {
		getPage,
		getPost,
		getPrivatePage,
		getLandingPage,
		getContentBySlug,
		resolveContentBySlug,
		getPages,
		getPosts,
		getPrivatePages,
		getBySlugs,
		getAllByType,
		getPagesBySlugs,
		getPostsBySlugs,
		getPrivatePagesBySlugs
	}
}
