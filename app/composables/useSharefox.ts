export interface SharefoxProductListItem {
	id: number
	name: string
	slug: string
	price: number
	priceExclVat: number
	perDay: boolean
	images: { link: string; heading?: string }[]
	descriptionWeb?: string
	productAvailability?: number
}

export interface SharefoxProduct {
	id: number
	slug: string
	seoTitle?: string
	seoDescription?: string
	retailPriceForDisplay?: number
	productGroup: {
		name: string
		price: number
		priceExclVat: number
		perDay: boolean
		summary?: string
		descriptionWeb?: string
		titleTag?: string
		images?: { link: string; heading?: string } // spec says object; verify against a live response
		productCategories: { id: number; name: string; slug?: string }[]
	}
	photosVideos?: any[]
}

export function useSharefox() {
	// Call synchronously at the top, per the async-context gotcha
	const config = useRuntimeConfig()
	const sfFetch = <T>(path: string, query?: Record<string, any>) =>
		$fetch<T>(path, {
			baseURL: config.public.sharefoxApiUrl,
			headers: { "x-sharefox-shop-domain": config.public.sharefoxShopDomain, locale: "da" },
			query,
			retry: 2,
			retryDelay: 3000
		})

	const getProducts = (query?: { limit?: number; offset?: number; categories?: string; search?: string }) => useAsyncData(`sharefox-products-${JSON.stringify(query ?? {})}`, () => sfFetch<SharefoxProductListItem[]>("/products/", query))

	const getAvailableProducts = (startDate: string) =>
		useAsyncData(`sharefox-available-${startDate}`, async () => {
			const products = await sfFetch<SharefoxProductListItem[]>("/products/", { startDate })
			return products.filter((p) => (p.productAvailability ?? 0) > 0)
		})
	const getProduct = (id: number | string) => useAsyncData(`sharefox-product-${id}`, () => sfFetch<SharefoxProduct>(`/products/${id}`))

	return { getProducts, getProduct }
}
