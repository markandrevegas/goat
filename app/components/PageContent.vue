<script setup lang="ts">
defineProps<{
	title: string
	body: string
}>()
</script>

<template>
	<article class="w-full">
		<header class="mx-auto mb-8 flex max-w-3xl flex-col items-center">
			<h1 class="text-4xl tracking-tight md:text-5xl" v-html="title"></h1>
		</header>
		<main v-if="body" class="mx-auto max-w-3xl">
			<div class="text-palladian prose prose-lg/5 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-palladian prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md mt-4 max-w-none" v-html="body"></div>
		</main>
		<p v-else class="font-display italic">This page has no content body text.</p>
	</article>
</template>