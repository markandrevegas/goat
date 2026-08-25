export interface MediaDetails {
	source_url: string
	alt_text?: string
	media_details?: {
		width: number
		height: number
	}
}

export interface AuthorDetails {
	id: number
	name: string
	slug: string
	avatar_urls?: Record<string, string>
}

export interface WordPressBase {
	id: number
	title: {
		rendered: string
	}
	slug: string
}

export interface WordPressMenuItem extends WordPressBase {}

export interface WordPressLandingPage extends WordPressBase {
	acf: Record<string, any>
}

export interface WordPressPostOrPage extends WordPressBase {
	date: string
	content: {
		rendered: string
	}
	excerpt?: {
		rendered: string
	}
	acf?: Record<string, any>
	yoast_head_json?: {
		og_image?: { url: string }[]
	}
	_embedded?: {
		"wp:featuredmedia"?: MediaDetails[]
		author?: AuthorDetails[]
	}
}
