<script setup lang="ts">
defineProps<{
	title: string
	body: string
}>()
</script>

<template>
	<article class="w-full">
		<header class="mx-auto mb-8 flex max-w-6xl flex-col">
			<h1 class="text-3xl md:text-4xl tracking-tight md:text-5xl" v-html="title"></h1>
		</header>
		<main v-if="body" class="mx-auto max-w-6xl">
			<div class="text-palladian prose mt-4 max-w-xl" v-html="body"></div>
		</main>
		<p v-else class="font-display italic">This page has no content body text.</p>
	</article>
</template>
