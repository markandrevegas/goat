<script setup lang="ts">
import { computed } from "vue"

definePageMeta({ layout: false, key: (route) => route.fullPath })

const route = useRoute()
const { getContentBySlug, getPages, getPosts } = useWordPress()

const slugParam = computed(() => {
	const params = route.params.slug
	return Array.isArray(params) ? params : [params || ""]
})

const targetSlug = computed(() => {
	const segments = slugParam.value.filter(Boolean)
	return segments[segments.length - 1] || "home"
})

const {
	data: rawContentData,
	error,
	pending
} = await useAsyncData(
	`wp-content-${targetSlug.value}`,
	async () => {
		const slug = targetSlug.value
		// console.log("[slug.vue] resolving slug:", slug)
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
// console.log(rawContentData.value)

const isPage = computed(() => rawContentData.value?._type === "pages")
const isPost = computed(() => rawContentData.value?._type === "posts")
console.log(isPost.value)
const hasContent = computed(() => !!rawContentData.value)

/*const useBlogLayout = computed(() => isPage.value || rawContentData.value?.slug === "information-for-guests")
const layoutName = computed(() => (useBlogLayout.value ? "blog" : "page"))*/

const contentId = computed(() => rawContentData.value?.id || null)
const contentTitle = computed(() => rawContentData.value?.title?.rendered || "")
const contentSlug = computed(() => rawContentData.value?.slug || "")
const contentBody = computed(() => rawContentData.value?.content?.rendered || "")
const contentAcf = computed(() => rawContentData.value?.acf || {})
// console.log(contentAcf.value)
const datePublished = computed(() => rawContentData.value?.date || null)

const { data: allPages } = await getPages()

const relatedPages = computed(() => {
	if (!allPages.value) return []
	return allPages.value.filter((page) => ![contentId.value, 61, 69, 64, 71, 56, 59].includes(page.id))
})

const formattedDate = computed(() => {
	if (!datePublished.value || typeof datePublished.value !== "string") return ""

	const dateString = datePublished.value.endsWith("Z") ? datePublished.value : `${datePublished.value}Z`
	const parsedDate = new Date(dateString)

	if (Number.isNaN(parsedDate.getTime())) return ""

	return new Intl.DateTimeFormat("da-DK", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC"
	}).format(parsedDate)
})

const authorDetails = computed(() => rawContentData.value?._embedded?.author?.[0] || null)
const authorName = computed(() => authorDetails.value?.name || "")

const featuredMedia = computed(() => rawContentData.value?._embedded?.["wp:featuredmedia"]?.[0] || null)
const featuredImageUrl = computed(() => featuredMedia.value?.source_url || null)

const privateHeroExcerpt = computed(() => {
	return rawContentData.value?.acf?.private_hero_excerpt ?? ""
})
const privateHeroButtonText = computed(() => {
	return rawContentData.value?.acf?.private_hero_button ?? ""
})

const privateFeatureImageId = computed(() => {
	return rawContentData.value?.acf?.private_feature_image || 0
})

const featuredImageAlt = computed(() => featuredMedia.value?.alt_text || contentTitle.value)
const featuredImageWidth = computed(() => featuredMedia.value?.media_details?.width || 1200)
const featuredImageHeight = computed(() => featuredMedia.value?.media_details?.height || 630)

console.log(featuredImageUrl.value)

const seoTitle = computed(() => contentTitle.value || "Page")
const seoDescription = computed(() => {
	const excerpt = rawContentData.value?.excerpt?.rendered
	if (!excerpt) return "Welcome to our site."
	return excerpt.replace(/<[^>]*>?/gm, "").trim()
})
const ogImage = computed(() => rawContentData.value?.yoast_head_json?.og_image?.[0]?.url || featuredImageUrl.value || "/default-og.jpg")

function decodeEntities(str: string): string {
	if (!str) return ""
	return str.replace(/&#(\d+);/g, (_, dec) => String.fromCharCode(dec)).replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
}
const cleanSeoTitle = computed(() => decodeEntities(seoTitle.value))
const cleanSeoDescription = computed(() => decodeEntities(seoDescription.value))
// New: separate source for private pages, since the image lives in ACF, not featured_media
const privateHeroImageId = computed(() => contentAcf.value?.private_hero_image ?? null)
// console.log(privateHeroImageId.value)
const currentLayoutStyle = computed(() => contentAcf.value?.layoutstyle)
console.log(currentLayoutStyle.value)
useSeoMeta({
	title: cleanSeoTitle.value,
	titleTemplate: null,
	description: cleanSeoDescription.value,
	ogTitle: cleanSeoTitle.value,
	ogDescription: cleanSeoDescription.value,
	ogImage: ogImage,
	ogType: "website",
	twitterCard: "summary_large_image",
	twitterTitle: cleanSeoTitle.value,
	twitterDescription: cleanSeoDescription.value,
	twitterImage: ogImage
})
</script>

<template>
	<NuxtLayout name="page">
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

			<PageContent v-else-if="hasContent && isPage" :acf="contentAcf" :title="contentTitle" :body="contentBody" :slug="contentSlug" :featured-image-url="featuredImageUrl" :featured-image-alt="featuredImageAlt" :featured-image-width="featuredImageWidth" :featured-image-height="featuredImageHeight" :related-pages="relatedPages" :layout-style="currentLayoutStyle" />
		</div>
	</NuxtLayout>
</template>
