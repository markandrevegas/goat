export interface CardItem {
	img: number | string
	title: string
	description: string
	buttonText?: string
	alt?: string
}

/**
 * Maps flat ACF column fields into a structured CardItem array
 */
export function extractColumns(acfData: Record<string, any>, prefixes = ["first", "second", "third", "fourth"]): CardItem[] {
	if (!acfData) return []

	return prefixes
		.map((prefix): CardItem | null => {
			const title = acfData[`${prefix}columnheader`]
			const description = acfData[`${prefix}columntext`]
			const img = acfData[`${prefix}columnimage`]
			const buttonText = acfData[`${prefix}columnbutton`]

			if (!title && !description) return null

			return {
				title,
				description,
				img,
				...(buttonText ? { buttonText } : {})
			}
		})
		.filter((item): item is CardItem => item !== null)
}
