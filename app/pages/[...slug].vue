<script setup>
const route = useRoute()
const config = useRuntimeConfig()

const targetSlug = computed(() => {
	const slugParam = route.params.slug
	if (Array.isArray(slugParam) && slugParam.length > 0) {
		return slugParam[slugParam.length - 1]
	}
	return slugParam || "home"
})

const {
	data: pageData,
	status,
	error,
} = await useFetch(`${config.public.wordpressUrl}/pages`, {
	baseURL: '',
	query: { slug: targetSlug },
	key: `wp-page-${targetSlug}`,
	transform: (res) => {
		if (!Array.isArray(res) || res.length === 0) return null
		return res[0]
	},
})

const page = computed(() => pageData.value)
const seoTitle = computed(() => page.value?.title?.rendered || "Page")
const seoDescription = computed(() => {
	if (!page.value?.excerpt?.rendered) return "Welcome to our site."
	return page.value.excerpt.rendered.replace(/<[^>]*>?/gm, "").trim()
})

useSeoMeta({
	title: seoTitle,
	description: seoDescription,
	ogTitle: seoTitle,
	ogDescription: seoDescription,
})
useSeoMeta({
	title: seoTitle,
	description: seoDescription,
	ogTitle: seoTitle,
	ogDescription: seoDescription,
})
</script>

<template>
	<div class="container mx-auto max-w-4xl px-4 py-12">
		<div v-if="status === 'pending'" class="flex flex-col items-center justify-center space-y-4 py-24">
			<div class="h-12 w-12 animate-spin rounded-full border-b-4 border-indigo-600"></div>
			<p class="animate-pulse text-sm font-medium text-slate-500">Loading content...</p>
		</div>

		<div v-else-if="error || !page" class="rounded-2xl border border-red-100 bg-red-50 px-6 py-24 text-center">
			<h2 class="mb-2 text-xl font-bold text-red-800">Failed to load content</h2>
			<p class="text-sm text-red-600">Could not resolve route or the target slug is missing/unpublished.</p>
		</div>

		<article v-else class="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm md:p-12">
			<header class="mb-8 border-b border-slate-100 pb-6">
				<h1 class="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl" v-html="page.title.rendered"></h1>
			</header>

			<main v-if="page.content?.rendered" class="prose prose-slate prose-lg max-w-none focus:outline-none" v-html="page.content.rendered"></main>
			<p v-else class="text-slate-400 italic">This page has no content body text.</p>
		</article>
	</div>
</template>
