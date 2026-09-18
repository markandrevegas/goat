<script setup lang="ts">
import WpImage from "./ui/WpImage.vue"
const props = defineProps<{
	header: string
	text: string
	image: number
}>()
</script>
<template>
	<section class="bg-palladian text-brand flex flex-col items-center justify-center pb-8 sm:flex-row">
		<div class="flex max-w-5xl flex-col sm:flex-row sm:items-center">
			<div class="px-0 py-16 sm:col-span-2 sm:px-8">
				<h2 class="mt-4 text-3xl font-semibold">{{ header }}</h2>
				<p class="mt-6 mb-6">{{ text }}</p>
			</div>
			<WpImage v-if="image" :image-id="image" class="block h-full w-full object-cover" />
		</div>
	</section>
</template>
