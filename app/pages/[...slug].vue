<script setup lang="ts">
import { computed } from "vue"

// 1. Static macro declarations FIRST
definePageMeta({ layout: false })

// 2. Route & Composables
const route = useRoute()
const { getContentBySlug, getPages } = useWordPress()

// 3. Computed params
const slugParam = computed(() => {
  const params = route.params.slug
  return Array.isArray(params) ? params : [params || ""]
})

const targetSlug = computed(() => {
  const segments = slugParam.value.filter(Boolean)
  return segments[segments.length - 1] || "home"
})

// 4. Async Data Fetching
const {
  data: rawContentData,
  error,
  pending
} = await useAsyncData(
  `wp-content-${targetSlug.value}`,
  async () => {
    const slug = targetSlug.value
    if (!slug) return null

    const page = await getContentBySlug("pages", slug)
    if (page) return page

    const post = await getContentBySlug("posts", slug)
    if (post) return post

    const privatePage = await getContentBySlug("private", slug)
    if (privatePage) return privatePage

    return null
  },
  { watch: [targetSlug] }
)

// 5. Guards & Error handling
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

// 6. Reactive Content Computed Properties
const isPost = computed(() => rawContentData.value?._type === "posts")
const isPrivatePage = computed(() => rawContentData.value?._type === "private")
const hasContent = computed(() => !!rawContentData.value)

const useBlogLayout = computed(() => isPost.value || rawContentData.value?.slug === "information-for-guests")
const layoutName = computed(() => (useBlogLayout.value ? "blog" : "page"))

/*const useBlogLayout = computed(() => isPost.value || rawContentData.value?.slug === "information-for-guests")
const layoutName = computed(() => (useBlogLayout.value ? "blog" : "page"))*/

// Content Field Mappings
const contentId = computed(() => rawContentData.value?.id || null)
const contentTitle = computed(() => rawContentData.value?.title?.rendered || "")
const contentSlug = computed(() => rawContentData.value?.slug || "")
const contentBody = computed(() => rawContentData.value?.content?.rendered || "")
const contentAcf = computed(() => rawContentData.value?.acf || {})
const datePublished = computed(() => rawContentData.value?.date || null)

// Fetch related pages
const { data: allPages } = await getPages()

const relatedPages = computed(() => {
	if (useBlogLayout.value || !allPages.value) return []
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
	description: seoDescription,
	ogTitle: seoTitle,
	ogDescription: seoDescription,
	ogImage: ogImage,
	ogType: "website",
	twitterCard: "summary_large_image",
	twitterTitle: seoTitle,
	twitterDescription: seoDescription,
	twitterImage: ogImage,
	...(isPrivatePage.value && { robots: "noindex, nofollow" }) // Automatically apply noindex for private pages
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
