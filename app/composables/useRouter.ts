// composables/useWpRouter.ts
export const useWpRouter = () => {
	const { getAllByType } = useWordPress()

	// Nuxt useState caches this globally across page transitions
	const routeMap = useState<Record<string, "pages" | "posts" | "private"> | null>("wp-route-map", () => null)

	const initRouteMap = async () => {
		if (routeMap.value) return routeMap.value

		const [pages, posts, privatePages] = await Promise.all([getAllByType("pages"), getAllByType("posts"), getAllByType("private")])

		const map: Record<string, "pages" | "posts" | "private"> = {}
		pages.forEach((p) => (map[p.slug] = "pages"))
		posts.forEach((p) => (map[p.slug] = "posts"))
		privatePages.forEach((p) => (map[p.slug] = "private"))

		routeMap.value = map
		return map
	}

	return { routeMap, initRouteMap }
}
