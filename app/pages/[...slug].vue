<script setup>
const route = useRoute()
const config = useRuntimeConfig()
const goatWordpressUrl = config.public.goatWordpressUrl
definePageMeta({
	layout: "page"
})
const slug = computed(() => {
	const params = route.params.slug
	return Array.isArray(params) ? params.join("/") : params || ""
})

const {
	data: pageData,
	pending: pagePending,
	error: pageError
} = await useFetch(
	() => {
		const targetSlug = slug.value || "home"
		return `${goatWordpressUrl}/pages?slug=${targetSlug}`
	},
	{
		watch: [slug]
	}
)

const {
	data: postData,
	pending: postPending,
	error: postError
} = await useFetch(() => `${goatWordpressUrl}/posts?slug=${slug.value}`, {
	watch: [slug],
	immediate: !!slug.value
})

const pending = computed(() => pagePending.value || postPending.value)
const error = computed(() => (pageError.value && postError.value ? pageError.value : null))

const page = computed(() => pageData.value?.[0] || null)
const post = computed(() => postData.value?.[0] || null)

// Prefer page match; fall back to post
const content = computed(() => page.value || post.value)
const isPost = computed(() => !page.value && !!post.value)

if (error.value) {
	throw createError({
		statusCode: error.value.statusCode || 500,
		statusMessage: "Failed to fetch content from WordPress",
		fatal: true
	})
}

if (!pending.value && !content.value) {
	throw createError({
		statusCode: 404,
		statusMessage: `Page '/${slug.value}' not found`,
		fatal: true
	})
}

const seoTitle = computed(() => content.value?.title?.rendered || "Page")
const seoDescription = computed(() => {
	if (!content.value?.excerpt?.rendered) return "Welcome to our site."
	return content.value.excerpt.rendered.replace(/<[^>]*>?/gm, "").trim()
})
const ogImage = computed(() => {
	return content.value?.yoast_head_json?.og_image?.[0]?.url || "/default-og.jpg"
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
	<div class="container mx-auto max-w-6xl p-8 py-12">
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
				<h1 class="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl" v-html="content.title.rendered"></h1>
			</header>

			<main v-if="content.content?.rendered" class="prose prose-slate prose-lg max-w-2xl focus:outline-none" v-html="content.content.rendered"></main>
			<main v-if="isPost" class="prose prose-slate prose-lg max-w-2xl focus:outline-none" v-html="content.content.rendered"></main>
			<p v-else class="font-display text-brand italic">This page has no content body text.</p>
		</article>
	</div>
</template>
