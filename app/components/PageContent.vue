<script setup lang="ts">
import PrimaryButton from './ui/PrimaryButton.vue'

defineProps<{
	title: string
	body: string
	slug: string
}>()
</script>

<template>
	<article class="w-full">
		<header class="mx-auto mb-8 flex max-w-6xl flex-col">
			<h1 class="text-3xl tracking-tight md:text-4xl max-w-2xl" v-html="title"></h1>
		</header>
		<main v-if="body" class="mx-auto max-w-6xl">
			<div class="text-palladian prose mt-4 max-w-xl" v-html="body"></div>
			<div v-if="slug === 'betingelser'" class="mx-auto max-w-3xl mt-4">
				<NuxtLink :to="'/lejebetingelser-for-private'">
					<span class="font-semibold block w-max">Betingelser for private</span></NuxtLink>
				<NuxtLink :to="'/lejebetingelser-for-erhverv'">Betingelser for erhverv</NuxtLink>
		</div>
		</main>
		<p v-else class="font-display italic">This page has no content body text.</p>
	</article>
</template>
