interface LandingPageACF {
	[key: string]: any
}

interface WordPressLandingPage {
	id: number
	title: {
		rendered: string
	}
	slug: string
	acf: LandingPageACF
}

export const useGoatWordPress = () => {
	const config = useRuntimeConfig()
	const goatWordpressUrl = config.public.goatWordpressUrl

	const getLandingPage = async (slug: string) => {
		const results = await $fetch<WordPressLandingPage[]>(`${goatWordpressUrl}/landingpage`, {
			baseURL: "",
			query: {
				slug,
				_fields: "id,title,slug,acf"
			}
		})

		return results[0] ?? null
	}

	return {
		getLandingPage
	}
}
