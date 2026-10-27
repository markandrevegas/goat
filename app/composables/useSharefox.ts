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

export interface ProductUnavailabilityDays {
	fullDays: string[]
	partialDays: string[]
	closedDays: string[]
	bookedDays: string[]
}

export interface DayAvailabilityBreakdown {
	date: string
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
	const sfServerFetch = <T>(path: string, query?: Record<string, any>) => {
		const cleanPath = path.replace(/^\/+/, "")
		return $fetch<T>(`/api/sharefox/${cleanPath}`, {
			query,
			retry: 1,
			retryDelay: 1000
		})
	}

	const getProducts = (query?: { limit?: number; offset?: number; categories?: string; search?: string }) => useAsyncData(`sharefox-products-${JSON.stringify(query ?? {})}`, () => sfServerFetch<SharefoxProductListItem[]>("products", query))

	const getAvailableProducts = (startDate: string) =>
		useAsyncData(`sharefox-available-${startDate}`, async () => {
			const products = await sfServerFetch<SharefoxProductListItem[]>("products", { startDate })
			return (products || []).filter((p) => (p.productAvailability ?? 0) > 0)
		})

	const getProduct = (id: number | string) => useAsyncData(`sharefox-product-${id}`, () => sfServerFetch<SharefoxProduct>(`products/${id}`))

	const fetchUnavailabilityDays = async (productId: number | string, params: { month: number; year: number }) => {
		const res = await sfServerFetch<ProductUnavailabilityDays>(`product-unavailability/${productId}/days`, {
			locationId: 4,
			channelId: 1,
			type: "pickup",
			breakdown: 1,
			...params
		})
		console.log("RAW unavailability", JSON.stringify(res, null, 2))
		const full = new Set([...(res?.fullDays || []), ...(res?.closedDays || [])])
		const partial = new Set([...(res?.partialDays || []), ...(res?.bookedDays || [])])

		// A day that's full or closed is never partial
		for (const d of full) partial.delete(d)
		return {
			fullDays: [...full],
			partialDays: [...partial],
			closedDays: [...new Set(res?.closedDays || [])],
			bookedDays: [...new Set(res?.bookedDays || [])]
		}
	}

	return {
		getProducts,
		getAvailableProducts,
		getProduct,
		fetchUnavailabilityDays
	}
}
