<script setup lang="ts">
import WpImage from "./ui/WpImage.vue"
const props = defineProps<{
	header: string
	text: string
	image: number
}>()
</script>
<template>
	<section class="bg-brand !text-palladian flex flex-col items-center justify-center px-4 py-8 sm:flex-row sm:px-8">
		<div class="flex max-w-5xl flex-col sm:flex-row sm:items-center">
			<div class="px-0 py-16 sm:col-span-2 sm:pr-16 sm:pl-8">
				<h2 class="mt-4 text-3xl font-semibold">{{ header }}</h2>
				<p class="font-display mt-6 mb-6 leading-8">{{ text }}</p>
			</div>
			<WpImage v-if="image" :image-id="image" class="block h-full w-full object-cover" />
		</div>
	</section>
</template>
