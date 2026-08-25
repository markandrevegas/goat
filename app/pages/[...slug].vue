<script setup>
const route = useRoute()
const { getPost, getPage } = useWordPress()

const slug = computed(() => {
	const params = route.params.slug
	return Array.isArray(params) ? params.join("/") : params || ""
})

const targetSlug = computed(() => slug.value || "home")

// Fetch page data dynamically based on the current slug
const { data: rawPageData, pending: pagePending, error: pageError } = await useAsyncData(`wp-page-${targetSlug.value}`, () => getPage(targetSlug.value), { watch: [targetSlug] })

// Fetch post data dynamically based on the current slug
const { data: rawPostData, pending: postPending, error: postError } = await useAsyncData(`wp-post-${slug.value}`, () => (slug.value ? getPost(slug.value) : Promise.resolve(null)), { watch: [slug] })

// Combined status states
const pending = computed(() => pagePending.value || postPending.value)
const error = computed(() => (pageError.value && postError.value ? pageError.value : null))

// Gracefully fall back to post if page isn't matched
const rawContentData = computed(() => rawPageData.value || rawPostData.value || null)
const isPost = computed(() => !rawPageData.value && !!rawPostData.value)
const hasContent = computed(() => !!rawContentData.value)

// Which layout wraps this route — decided by content type, not by the
// route itself, since both pages and posts share the same flat slug space.
definePageMeta({
	layout: false
})
const layoutName = computed(() => (isPost.value ? "blog" : "page"))

// Itemized Computed Exports from WP Data
const contentId = computed(() => rawContentData.value?.id || null)
const contentTitle = computed(() => rawContentData.value?.title?.rendered || "")
const contentSlug = computed(() => rawContentData.value?.slug || "")
const contentBody = computed(() => rawContentData.value?.content?.rendered || "")
const contentAcf = computed(() => rawContentData.value?.acf || {})
const datePublished = computed(() => rawContentData.value?.date || null)

const formattedDate = computed(() => {
	if (!datePublished.value) return ""

	// Append UTC explicitly to force consistent SSR date rendering
	const dateString = datePublished.value.endsWith("Z") ? datePublished.value : `${datePublished.value}Z`

	const parsedDate = new Date(dateString)

	if (isNaN(parsedDate.getTime())) return ""

	return new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC"
	}).format(parsedDate)
})
const authorDetails = computed(() => rawContentData.value?._embedded?.author?.[0] || null)
const authorName = computed(() => authorDetails.value?.name || "")
// Featured Image Data Extraction
const featuredMedia = computed(() => rawContentData.value?._embedded?.["wp:featuredmedia"]?.[0] || null)
const featuredImageUrl = computed(() => featuredMedia.value?.source_url || null)
const featuredImageAlt = computed(() => featuredMedia.value?.alt_text || contentTitle.value)
const featuredImageWidth = computed(() => featuredMedia.value?.media_details?.width || 1200)
const featuredImageHeight = computed(() => featuredMedia.value?.media_details?.height || 630)

// Error handling & 404 navigation
if (error.value) {
	throw createError({
		statusCode: error.value?.status || 500,
		statusMessage: "Failed to fetch content from WordPress",
		fatal: true
	})
}

if (!pending.value && !hasContent.value) {
	throw createError({
		statusCode: 404,
		statusMessage: `Page '/${slug.value}' not found`,
		fatal: true
	})
}

// SEO Metadata computed properties
const seoTitle = computed(() => contentTitle.value || "Page")
const seoDescription = computed(() => {
	const excerpt = rawContentData.value?.excerpt?.rendered
	if (!excerpt) return "Welcome to our site."
	return excerpt.replace(/<[^>]*>?/gm, "").trim()
})
const ogImage = computed(() => {
	return rawContentData.value?.yoast_head_json?.og_image?.[0]?.url || featuredImageUrl.value || "/default-og.jpg"
})

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

			<PostContent
				v-else-if="hasContent && isPost"
				:title="contentTitle"
				:body="contentBody"
				:author-name="authorName"
				:formatted-date="formattedDate"
				:date-published="datePublished"
				:featured-image-url="featuredImageUrl"
				:featured-image-alt="featuredImageAlt"
				:featured-image-width="featuredImageWidth"
				:featured-image-height="featuredImageHeight"
			/>

			<PageContent v-else-if="hasContent" :title="contentTitle" :body="contentBody" :slug="contentSlug" />
		</div>
	</NuxtLayout>
</template>