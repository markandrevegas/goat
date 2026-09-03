export interface CardItem {
	img: number | string
	title: string
	description: string
	buttonText?: string
	alt?: string
}

export function extractColumns(
	acfData: Record<string, any>,
	prefixes: string[]
): CardItem[] {
	if (!acfData) return []

	return prefixes
		.map((prefix): CardItem | null => {
			const p = prefix.toLowerCase()

			// Check exact pattern prefix matches first
			const title = acfData[`header_${p}`] ?? acfData[`${p}columnheader`] ?? acfData[`${p}header`]
			const description = acfData[`header_${p}_text`] ?? acfData[`${p}columntext`] ?? acfData[`${p}text`]
			const img = acfData[`header_${p}_image`] ?? acfData[`${p}columnimage`] ?? acfData[`${p}image`]
			const buttonText = acfData[`header_${p}_button`] ?? acfData[`${p}columnbutton`] ?? acfData[`${p}button`]

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