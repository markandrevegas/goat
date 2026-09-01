<script setup>
import { onMounted } from "vue"

const route = useRoute()
const { getPost, getPage, getPages } = useWordPress()

const slugParam = computed(() => {
	const params = route.params.slug
	return Array.isArray(params) ? params : [params || ""]
})

const targetSlug = computed(() => slugParam.value[slugParam.value.length - 1] || "home")
// Combine fetching inside a single top-level useAsyncData block
const {
	data: rawContentData,
	error,
	pending
} = await useAsyncData(
	`wp-content-${targetSlug.value}`,
	async () => {
		// Fetch page and post in parallel
		const [pageRes, postRes] = await Promise.all([getPage(targetSlug.value), getPost(targetSlug.value)])

		// Each getPage/getPost call swallows its own fetch errors into its
		// own local `error` ref rather than throwing — so a rate-limited
		// or failed request looks identical to "no content" unless we
		// check error.value explicitly here and re-throw it as a real
		// failure instead of letting it fall through to a false 404.
		if (pageRes.error.value && postRes.error.value) {
			throw createError({
				statusCode: 500,
				statusMessage: `WordPress fetch failed for "${targetSlug.value}": ${pageRes.error.value?.message || postRes.error.value?.message}`,
				fatal: true
			})
		}

		return pageRes.data.value || postRes.data.value || null
	},
	{ watch: [targetSlug] }
)

// 404 Guard: Executes ONLY after the async promise resolves
if (error.value) {
	throw createError({
		statusCode: error.value?.statusCode || 500,
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

// Flags & Layout determination
const isPost = computed(() => rawContentData.value?.type === "post")
const hasContent = computed(() => !!rawContentData.value)

definePageMeta({ layout: false })

const useBlogLayout = computed(() => isPost.value || rawContentData.value?.slug === "information-for-guests")
const layoutName = computed(() => (useBlogLayout.value ? "blog" : "page"))

// Content Field Mappings
const contentId = computed(() => rawContentData.value?.id || null)
const contentTitle = computed(() => rawContentData.value?.title?.rendered || "")
const contentSlug = computed(() => rawContentData.value?.slug || "")
const contentBody = computed(() => rawContentData.value?.content?.rendered || "")
const contentAcf = computed(() => rawContentData.value?.acf || {})
const datePublished = computed(() => rawContentData.value?.date || null)

onMounted(() => {
	console.log("Client-side ACF Data:", contentAcf.value)
})

if (import.meta.client) {
	console.log(`[WP ACF] slug=${contentSlug.value}`, contentAcf.value)
}

// Fetch related pages
const { data: allPages } = await getPages()

const relatedPages = computed(() => {
	if (useBlogLayout.value || !allPages.value) return []
	return allPages.value.filter((page) => ![contentId.value, 59, 56, 71].includes(page.id))
})

const formattedDate = computed(() => {
	if (!datePublished.value) return ""
	const dateString = datePublished.value.endsWith("Z") ? datePublished.value : `${datePublished.value}Z`
	const parsedDate = new Date(dateString)
	if (isNaN(parsedDate.getTime())) return ""

	return new Intl.DateTimeFormat("da-DK", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC"
	}).format(parsedDate)
})

const authorDetails = computed(() => rawContentData.value?._embedded?.author?.[0] || null)
const authorName = computed(() => authorDetails.value?.name || "")

// Featured Media
const featuredMedia = computed(() => rawContentData.value?._embedded?.["wp:featuredmedia"]?.[0] || null)
const featuredImageUrl = computed(() => featuredMedia.value?.source_url || null)
const featuredImageAlt = computed(() => featuredMedia.value?.alt_text || contentTitle.value)
const featuredImageWidth = computed(() => featuredMedia.value?.media_details?.width || 1200)
const featuredImageHeight = computed(() => featuredMedia.value?.media_details?.height || 630)

// SEO Metadata
const seoTitle = computed(() => contentTitle.value || "Page")
const seoDescription = computed(() => {
	const excerpt = rawContentData.value?.excerpt?.rendered
	if (!excerpt) return "Welcome to our site."
	return excerpt.replace(/<[^>]*>?/gm, "").trim()
})
const ogImage = computed(() => rawContentData.value?.yoast_head_json?.og_image?.[0]?.url || featuredImageUrl.value || "/default-og.jpg")

useSeoMeta({
	title: seoTitle,
	titleTemplate: null,
	metaTitle: seoTitle,
	description: seoDescription,
	ogTitle: seoTitle,
	ogDescription: seoDescription,
	ogImage: ogImage,
	ogType: "website",
	twitterCard: "summary_large_image",
	twitterTitle: seoTitle,
	twitterDescription: seoDescription,
	twitterImage: ogImage
})
</script>

<template>
	<NuxtLayout :name="layoutName">
		<div class="container mx-auto max-w-6xl p-8">
			<div v-if="pending" class="flex flex-col items-center justify-center space-y-4 py-24">
				<div class="h-12 w-12 animate-spin rounded-full border-b-4 border-indigo-600"></div>
				<p class="animate-pulse text-sm font-medium text-slate-500">Loading content...</p>
			</div>

			<div v-else-if="error" class="rounded-2xl border border-red-100 bg-red-50 px-6 py-24 text-center">
				<h2 class="mb-2 text-xl font-bold text-red-800">Failed to load content</h2>
				<p class="text-sm text-red-600">Could not resolve route or the target slug is missing/unpublished.</p>
			</div>

			<PostContent v-else-if="hasContent && useBlogLayout" :title="contentTitle" :body="contentBody" :slug="contentSlug" :acf="contentAcf" :author-name="authorName" :formatted-date="formattedDate" :date-published="datePublished" :featured-image-url="featuredImageUrl" :featured-image-alt="featuredImageAlt" :featured-image-width="featuredImageWidth" :featured-image-height="featuredImageHeight" />

			<PageContent v-else-if="hasContent" :acf="contentAcf" :title="contentTitle" :body="contentBody" :slug="contentSlug" :featured-image-url="featuredImageUrl" :featured-image-alt="featuredImageAlt" :featured-image-width="featuredImageWidth" :featured-image-height="featuredImageHeight" :related-pages="relatedPages" />
		</div>
	</NuxtLayout>
</template>
