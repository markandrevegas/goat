<script setup lang="ts">
import { computed, watch } from "vue"
import SlimTrustWidget from "~/components/ui/SlimTrustWidget.vue"

interface YoastSchemaGraphItem {
	"@type"?: string | string[]
	datePublished?: string
	[key: string]: any
}

interface YoastHead {
	og_description?: string
	og_image?: { url: string; width?: number; height?: number }[]
	schema?: {
		"@graph"?: YoastSchemaGraphItem[]
	}
}

const route = useRoute()
const { getContentBySlug, getPages } = useWordPress()

const slugParam = computed(() => {
	const params = route.params.slug
	return Array.isArray(params) ? params : [params || ""]
})

const targetSlug = computed(() => {
	const segments = slugParam.value.filter(Boolean)
	return segments[segments.length - 1] || "home"
})

interface CardItem {
	header?: string
	text?: string
	[key: string]: any
}

const {
	data: rawContentData,
	error,
	pending
} = await useAsyncData(
	`wp-content-${targetSlug.value}`,
	async () => {
		const slug = targetSlug.value
		if (!slug) return null

		return (await getContentBySlug("pages", slug)) ?? (await getContentBySlug("posts", slug)) ?? null
	},
	{ watch: [targetSlug] }
)

if (error.value) {
	throw createError({
		statusCode: error.value?.status || 500,
		statusMessage: "Failed to fetch content from WordPress",
		fatal: true
	})
}

if (!rawContentData.value) {
	throw createError({
		statusCode: 404,
		statusMessage: "WordPress Content Not Found",
		fatal: true
	})
}

const isPage = computed(() => rawContentData.value?._type === "pages")
const isPost = computed(() => rawContentData.value?._type === "posts")

const hasContent = computed(() => !!rawContentData.value)

const contentId = computed(() => rawContentData.value?.id || null)
const contentTitle = computed(() => rawContentData.value?.title?.rendered || "")
const contentSlug = computed(() => rawContentData.value?.slug || "")
const contentBody = computed(() => rawContentData.value?.content?.rendered || "")
const contentAcf = computed(() => rawContentData.value?.acf || {})
const datePublished = computed(() => {
	if (rawContentData.value?.date) {
		return rawContentData.value.date
	}

	const yoastGraph = yoastHead.value?.schema?.["@graph"]
	if (Array.isArray(yoastGraph)) {
		const item = yoastGraph.find((entry) => {
			const types = Array.isArray(entry["@type"]) ? entry["@type"] : [entry["@type"]]
			return types.includes("WebPage") || types.includes("Article")
		})
		if (item?.datePublished) {
			return item.datePublished
		}
	}

	return null
})
const formattedDate = computed(() => {
	if (!datePublished.value || typeof datePublished.value !== "string") return ""

	const raw = datePublished.value
	const dateString = raw.endsWith("Z") ? raw : `${raw}Z`
	const parsedDate = new Date(dateString)

	if (Number.isNaN(parsedDate.getTime())) return ""

	return new Intl.DateTimeFormat("da-DK", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC"
	}).format(parsedDate)
})

const { data: allPages } = await getPages()

const forApartments = ["business-lounge", "rooftop-terrace", "simple-meeting"]
const forEvents = ["business-lounge", "rooftop-terrace", "meetings-and-events"]
const forBusiness = ["rooftop-terrace", "meetings-and-events"]
const forStudio = ["bow-apartment", "studio-apartment", "rooftop-terrace"]
const forExtras = ["business-lounge", "rooftop-terrace", "apartments"]
const forCaptainsQuarters = [ "studio-apartment", "bow-apartment"]

const relatedPages = computed(() => {
	if (!allPages.value) return []

	const currentSlug = allPages.value.find((page) => page.id === contentId.value)?.slug ?? ""

	let relatedSlugs: string[] = []
	if (currentSlug === "business-lounge") {
		relatedSlugs = forBusiness
	} else if (forApartments.includes(currentSlug) || currentSlug === "meetings-and-events") {
		relatedSlugs = forEvents
	} else if (forEvents.includes(currentSlug) || currentSlug === "apartments") {
		relatedSlugs = forApartments
	} else if (forEvents.includes(currentSlug) || currentSlug === "studio-apartment") {
		relatedSlugs = forStudio
	} else if (forEvents.includes(currentSlug) || currentSlug === "bow-apartment") {
		relatedSlugs = forStudio
	} else if (forEvents.includes(currentSlug) || currentSlug === "extra-services") {
		relatedSlugs = forExtras
	} else if (forEvents.includes(currentSlug) || currentSlug === "captains-quarters") {
		relatedSlugs = forCaptainsQuarters
	}

	return allPages.value.filter((page) => page.id !== contentId.value && relatedSlugs.includes(page.slug)).sort((a, b) => relatedSlugs.indexOf(a.slug) - relatedSlugs.indexOf(b.slug))
})

const authorDetails = computed(() => rawContentData.value?._embedded?.author?.[0] || null)
const authorName = computed(() => authorDetails.value?.name || "")

const featuredMedia = computed(() => rawContentData.value?._embedded?.["wp:featuredmedia"]?.[0] || null)
const featuredImageUrl = computed(() => featuredMedia.value?.source_url || null)

const headerExcerpt = computed(() => contentAcf.value?.header_excerpt ?? "")
const pageVideoHeaderUrl = computed(() => contentAcf.value?.page_header_video_url)
const pageVideoHeaderPoster = computed(() => contentAcf.value?.page_header_video_poster)

const threeColumnItems = computed(() => {
	if (!contentAcf.value) return []
	return extractColumns(contentAcf.value, ["one", "two", "three"])
})

const sharedColumns = useCookie<CardItem[]>("threeColumnsData", {
	maxAge: 60 * 60 * 24 * 7,
	sameSite: "lax",
	default: () => []
})

watch(
	threeColumnItems,
	(newItems) => {
		if (newItems && newItems.length) {
			sharedColumns.value = newItems
		}
	},
	{ immediate: true, deep: true }
)

const featuredImageAlt = computed(() => featuredMedia.value?.alt_text || contentTitle.value)
const featuredImageWidth = computed(() => featuredMedia.value?.media_details?.width || 1200)
const featuredImageHeight = computed(() => featuredMedia.value?.media_details?.height || 630)

const siteUrl = "https://floatinggoat.dk"
const namedEntities: Record<string, string> = {
	amp: "&",
	lt: "<",
	gt: ">",
	quot: '"',
	apos: "'",
	nbsp: " ",
	hellip: "…",
	ndash: "–",
	mdash: "—",
	lsquo: "‘",
	rsquo: "’",
	ldquo: "“",
	rdquo: "”"
}

function decodeHtml(html: string) {
	return html.replace(/&([a-z]+);/gi, (match, name) => namedEntities[name.toLowerCase()] ?? match)
}

function decodeEntities(str: string): string {
	if (!str) return ""
	return str.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec)).replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
}

const toPlainText = (html: string) =>
	decodeEntities(decodeHtml(html.replace(/<[^>]*>/g, " ")))
		.replace(/\[…\]|\[\.\.\.\]/g, "")
		.replace(/\s+/g, " ")
		.trim()

const truncate = (text: string, max = 155) => (text.length > max ? text.slice(0, max).replace(/\s+\S*$/, "") + "…" : text)

const yoastHead = computed(() => rawContentData.value?.yoast_head_json as YoastHead | undefined)
const rawTitle = rawContentData.value?.title?.rendered

const seoTitle = computed(() => toPlainText(contentTitle.value) || "Page")

const seoDescription = computed(() => {
	const source = yoastHead.value?.og_description || rawContentData.value?.excerpt?.rendered || rawContentData.value?.content?.rendered || ""
	return truncate(toPlainText(source)) || "Welcome to our site."
})

const yoastImage = computed(() => yoastHead.value?.og_image?.[0])
const ogImageRaw = computed(() => yoastImage.value?.url || featuredImageUrl.value || "/default-og.jpg")
const ogImage = computed(() => (ogImageRaw.value.startsWith("http") ? ogImageRaw.value : `${siteUrl}${ogImageRaw.value}`))

const ogImageWidth = computed(() => (yoastImage.value?.url ? yoastImage.value.width : featuredImageUrl.value ? featuredImageWidth.value : 1200) || 1200)
const ogImageHeight = computed(() => (yoastImage.value?.url ? yoastImage.value.height : featuredImageUrl.value ? featuredImageHeight.value : 630) || 630)

const canonicalUrl = computed(() => `${siteUrl}${route.path}`.replace(/\/+$/, ""))

const cleanSeoTitle = computed(() => seoTitle.value)
const cleanSeoDescription = computed(() => seoDescription.value)

const currentLayoutStyle = computed(() => contentAcf.value?.layoutstyle)

useSeoMeta({
	title: () => decodeEntities(decodeHtml(rawTitle || "")),
	titleTemplate: null,
	description: () => cleanSeoDescription.value,
	ogTitle: () => cleanSeoTitle.value,
	ogDescription: () => cleanSeoDescription.value,
	ogUrl: () => canonicalUrl.value,
	ogSiteName: "Floating G.O.A.T.",
	ogLocale: "en_GB",
	ogImage: () => ogImage.value,
	ogImageWidth: () => ogImageWidth.value,
	ogImageHeight: () => ogImageHeight.value,
	ogImageAlt: () => featuredImageAlt.value,
	ogType: () => (isPost.value ? "article" : "website"),
	articlePublishedTime: () => (isPost.value && rawContentData.value?.date ? `${rawContentData.value.date}Z` : undefined),
	twitterCard: "summary_large_image",
	twitterTitle: () => cleanSeoTitle.value,
	twitterDescription: () => cleanSeoDescription.value,
	twitterImage: () => ogImage.value
})
</script>

<template>
	<div class="w-full">
		<div class="container mx-auto max-w-6xl p-8">
			<div v-if="pending" class="flex flex-col items-center justify-center space-y-4 py-24">
				<div class="h-12 w-12 animate-spin rounded-full border-b-4 border-indigo-600"></div>
				<p class="animate-pulse text-sm font-medium text-slate-500">Loading content...</p>
			</div>

			<div v-else-if="error" class="rounded-2xl border border-red-100 bg-red-50 px-6 py-24 text-center">
				<h2 class="mb-2 text-xl font-bold text-red-800">Failed to load content</h2>
				<p class="text-sm text-red-600">Could not resolve route or the target slug is missing/unpublished.</p>
			</div>

			<PostContent v-else-if="hasContent && isPost" :title="contentTitle" :body="contentBody" :slug="contentSlug" :acf="contentAcf" :author-name="authorName" :formatted-date="formattedDate" :date-published="datePublished" :featured-image-url="featuredImageUrl" :featured-image-alt="featuredImageAlt" :featured-image-width="featuredImageWidth" :featured-image-height="featuredImageHeight" :layout-style="currentLayoutStyle" />

			<PageContent v-else-if="hasContent && isPage" :acf="contentAcf" :title="contentTitle" :body="contentBody" :slug="contentSlug" :excerpt="headerExcerpt" :featured-image-url="featuredImageUrl" :featured-image-alt="featuredImageAlt" :featured-image-width="featuredImageWidth" :featured-image-height="featuredImageHeight" :related-pages="relatedPages" :layout-style="currentLayoutStyle" :page-video-header-url="pageVideoHeaderUrl" :page-video-header-poster="pageVideoHeaderPoster" :date-published="datePublished" :formatted-date="formattedDate" />
		</div>

		<div v-if="contentSlug === 'apartments'">
			<SlimTrustWidget />
		</div>

		<div v-if="['meetings-and-events', 'simple-meeting', 'rooftop-terrace', 'studio-apartment', 'bow-apartment', 'business-lounge'].includes(contentSlug)">
			<div class="max-w-3xl sm:mx-auto">
				<!--<div class="mx-auto max-w-2xl">
					<ImageCarousel :header="contentAcf?.gallery_header" :text="contentAcf?.gallery_text" :button="contentAcf?.gallery_button" :url="targetSlug" />
				</div>-->
				<ImageGridWide :header="contentAcf?.gallery_header" :text="contentAcf?.gallery_text" :button="contentAcf?.gallery_button" :url="targetSlug" />
			</div>
		</div>
	</div>
</template>
