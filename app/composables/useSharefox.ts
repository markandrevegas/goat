type Localized = { dk: string; en: string }
export interface SharefoxProductListItem {
	id: number
	name: Localized
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
		images?: { link: string; heading?: string }
		productCategories: { id: number; name: string; slug?: string }[]
	}
	photosVideos?: any[]
}

export interface ProductUnavailabilityDaysParams {
	locationId?: number | string
	channelId?: number | string
	month: number | string // e.g. 10
	year: number | string // e.g. 2026
	type?: "pickup" | "delivery" | string
	breakdown?: number | boolean // 1 or 0
}

// Typical response structure returned by Sharefox /api-v2/
export interface DayAvailabilityBreakdown {
	date: string // "YYYY-MM-DD"
	available: boolean
	unavailable: boolean
	reason?: string
	slots?: {
		startTime: string
		endTime: string
		available: boolean
		quantityAvailable?: number
	}[]
}

export type ProductUnavailabilityDaysResponse = DayAvailabilityBreakdown[] | Record<string, any>

export function useSharefox() {
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

export function useSharefoxServer() {
	const sfServerFetch = <T>(path: string, query?: Record<string, any>) => {
		const cleanPath = path.replace(/^\//, "")
		return $fetch<T>(`/api/sharefox/${cleanPath}`, {
			query,
			retry: 2,
			retryDelay: 3000
		})
	}

	// --- New method for unavailability days ---
	const getProductUnavailabilityDays = (productId: number | string, params: ProductUnavailabilityDaysParams) => {
		// Generate a unique reactive key based on id and params
		const cacheKey = `sharefox-unavailability-${productId}-${JSON.stringify(params)}`

		return useAsyncData(cacheKey, () => sfServerFetch<ProductUnavailabilityDaysResponse>(`api-v2/product-unavailability/${productId}/days`, params))
	}

	return {
		getProductUnavailabilityDays
	}
}
