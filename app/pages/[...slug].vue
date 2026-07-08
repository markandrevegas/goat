<script setup>
const route = useRoute()
const config = useRuntimeConfig()

const targetSlug = computed(() => {
	const slugs = route.params.slug
	return Array.isArray(slugs) ? slugs.join("/") : slugs || "home"
})

const {
	data: pageData,
	status,
	error,
} = await useFetch(() => `${config.public.wpApiBaseUrl}pages?slug=${targetSlug.value}`, {
	server: false,
	lazy: true,
	transform: (response) => {
		if (!response || response.length === 0) return null

		const page = response[0]
		return {
			title: page.title?.rendered || "Untitled",
			content: page.content?.rendered || "",
			excerpt: page.excerpt?.rendered || "",
		}
	},
})

watchEffect(() => {
	if (pageData.value) {
		console.log("WordPress API standard payload generated successfully:", pageData.value)
	}
})
</script>

<template>
	<div class="container mx-auto max-w-4xl px-4 py-12">
		<ClientOnly>
			<div v-if="status === 'pending'" class="flex flex-col items-center justify-center space-y-4 py-24">
				<div class="h-12 w-12 animate-spin rounded-full border-b-4 border-indigo-600"></div>
				<p class="animate-pulse text-sm font-medium text-slate-500">Loading content...</p>
			</div>

			<div v-else-if="error || !pageData" class="rounded-2xl border border-red-100 bg-red-50 px-6 py-24 text-center">
				<h2 class="mb-2 text-xl font-bold text-red-800">Failed to load content</h2>
				<p class="text-sm text-red-600">Could not resolve route or the target slug is missing/unpublished in WordPress.</p>
			</div>

			<article v-else class="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm md:p-12">
				<header class="mb-8 border-b border-slate-100 pb-6">
					<h1 class="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl" v-html="pageData.title"></h1>
				</header>

				<main v-if="pageData.content" class="prose prose-slate prose-lg max-w-none focus:outline-none" v-html="pageData.content"></main>

				<p v-else class="italic text-slate-400">This page has no content body text.</p>
			</article>
		</ClientOnly>
	</div>
</template>
