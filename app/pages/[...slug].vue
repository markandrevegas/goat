<script setup>
const route = useRoute()
const config = useRuntimeConfig()
const wordpressUrl = config.public.wordpressUrl
definePageMeta({
	layout: "page"
})
const slug = computed(() => {
	const params = route.params.slug
	return Array.isArray(params) ? params.join("/") : params || ""
})
const {
	data: pageData,
	pending,
	error
} = await useFetch(
	() => {
		const targetSlug = slug.value || "home"
		return `${wordpressUrl}/pages?slug=${targetSlug}`
	},
	{
		watch: [slug]
	}
)

const page = computed(() => pageData.value?.[0] || null)
if (error.value) {
	throw createError({
		statusCode: error.value.statusCode || 500,
		statusMessage: "Failed to fetch content from WordPress",
		fatal: true
	})
}

if (!pending.value && !page.value) {
	throw createError({
		statusCode: 404,
		statusMessage: `Page '/${slug.value}' not found`,
		fatal: true
	})
}

const seoTitle = computed(() => page.value?.title?.rendered || "Page")
const seoDescription = computed(() => {
	if (!page.value?.excerpt?.rendered) return "Welcome to our site."
	return page.value.excerpt.rendered.replace(/<[^>]*>?/gm, "").trim()
})
const ogImage = computed(() => {
	return page.value?.yoast_head_json?.og_image?.[0]?.url || "/default-og.jpg"
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
	<div class="container mx-auto max-w-4xl px-4 py-12">
		<div v-if="pending" class="flex flex-col items-center justify-center space-y-4 py-24">
			<div class="h-12 w-12 animate-spin rounded-full border-b-4 border-indigo-600"></div>
			<p class="animate-pulse text-sm font-medium text-slate-500">Loading content...</p>
		</div>

		<div v-else-if="error" class="rounded-2xl border border-red-100 bg-red-50 px-6 py-24 text-center">
			<h2 class="mb-2 text-xl font-bold text-red-800">Failed to load content</h2>
			<p class="text-sm text-red-600">Could not resolve route or the target slug is missing/unpublished.</p>
		</div>

		<article v-else class="w-full">
			<header class="mb-8">
				<h1 class="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl" v-html="page.title.rendered"></h1>
			</header>

			<main v-if="page.content?.rendered" class="prose prose-slate prose-lg max-w-none focus:outline-none" v-html="page.content.rendered"></main>
			<p v-else class="font-display text-brand italic">This page has no content body text.</p>
		</article>
	</div>
</template>
