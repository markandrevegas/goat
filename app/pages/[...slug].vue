<script setup lang="ts">
import { computed } from "vue"

definePageMeta({ layout: "page", key: (route) => route.fullPath })

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
const datePublished = computed(() => rawContentData.value?.date || null)

const { data: allPages } = await getPages()

const includedSlugs = ["apartments", "simple-meetings", "rooftop-terrace", "business-lounge"]

const relatedPages = computed(() => {
	if (!allPages.value) return []
	return allPages.value.filter((page) => page.id !== contentId.value && includedSlugs.includes(page.slug))
})
/*const relatedPages = computed(() => {
	if (!allPages.value) return []
	return allPages.value.filter((page) => ![contentId.value, 61, 69, 64, 71, 56, 59].includes(page.id))
})*/

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

const headerExcerpt = computed(() => {
	return rawContentData.value?.acf?.header_excerpt ?? ""
})

const pageVideoHeaderUrl = computed(() => {
	return rawContentData.value?.acf?.page_header_video_url
})
const pageVideoHeaderPoster = computed(() => {
	return rawContentData.value?.acf?.page_header_video_poster
})

/*const headerVideoUrl = computed(() => {
	return rawContentData.value?.acf?.page_header_video_url ?? ""
})*/

const featuredImageAlt = computed(() => featuredMedia.value?.alt_text || contentTitle.value)
const featuredImageWidth = computed(() => featuredMedia.value?.media_details?.width || 1200)
const featuredImageHeight = computed(() => featuredMedia.value?.media_details?.height || 630)

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

const currentLayoutStyle = computed(() => contentAcf.value?.layoutstyle)
if (import.meta.dev && import.meta.client) {
	console.log(currentLayoutStyle.value)
}

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
	<NuxtLayout>
		<div>
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

				<PageContent v-else-if="hasContent && isPage" :acf="contentAcf" :title="contentTitle" :body="contentBody" :slug="contentSlug" :excerpt="headerExcerpt" :featured-image-url="featuredImageUrl" :featured-image-alt="featuredImageAlt" :featured-image-width="featuredImageWidth" :featured-image-height="featuredImageHeight" :related-pages="relatedPages" :layout-style="currentLayoutStyle" :page-video-header-url="pageVideoHeaderUrl" :page-video-header-poster="pageVideoHeaderPoster" />
			</div>
			<div v-if="contentSlug === 'apartments'">
				<div class="mx-auto max-w-6xl px-8">
					<h2 class="mb-6 text-lg font-semibold">Available apartments</h2>
					<div class="grid grid-cols-3 gap-4">
						<NuxtLink to="/captains-quarters" class="group relative block h-40 overflow-hidden rounded-md">
							<NuxtImg src="/images/ferry-poster.webp" alt="Captain's Quarters" class="absolute inset-0 size-full object-cover hue-rotate-15" />
							<div class="absolute inset-0 bg-black/40"></div>
							<div class="relative z-10 flex size-full items-end p-4 pb-8">
								<p class="text-palladian font-display text-xl leading-5 transition-all duration-400 hover:scale-105">Captain's Quarters</p>
							</div>
						</NuxtLink>
						<NuxtLink to="/studio-apartment" class="group relative block h-40 overflow-hidden rounded-md">
							<NuxtImg src="/images/ferry-poster.webp" alt="Studio Apartment" class="absolute inset-0 size-full object-cover hue-rotate-15" />
							<div class="absolute inset-0 bg-black/40"></div>
							<div class="relative z-10 flex size-full items-end p-4 pb-8">
								<p class="text-palladian font-display text-xl leading-5 transition-all duration-400 hover:scale-105">Studio Apartment</p>
							</div>
						</NuxtLink>
						<NuxtLink to="/bow-apartment" class="group relative block h-40 overflow-hidden rounded-md">
							<NuxtImg src="/images/ferry-poster.webp" alt="Bow Apartment" class="absolute inset-0 size-full object-cover hue-rotate-15" />
							<div class="bg-brand/50 absolute inset-0 z-10 mix-blend-multiply"></div>
							<div class="relative z-10 flex size-full items-end p-4 pb-8">
								<p class="text-palladian font-display text-xl leading-5 transition-all duration-400 hover:scale-105">Bow Apartment</p>
							</div>
						</NuxtLink>
					</div>
				</div>
			</div>
			<div v-if="['rooftop-terrace', 'studio-apartment', 'bow-apartment', 'business-lounge'].includes(contentSlug)">
				<div class="w-full sm:mx-auto sm:w-4/5">
					<ImageGridWide :header="contentAcf?.gallery_header" :text="contentAcf?.gallery_text" :button="contentAcf?.gallery_button" :url="targetSlug" />
				</div>
			</div>
		</div>
	</NuxtLayout>
</template>
