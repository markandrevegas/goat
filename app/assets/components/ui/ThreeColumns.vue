<script setup lang="ts">
import PrimaryButton from "./PrimaryButton.vue"
import WpImage from "./WpImage.vue"

interface ColumnItem {
	img: number | string
	title: string
	description: string
	alt?: string
	buttonText: string
	url?: string
}

interface Props {
	items: ColumnItem[]
}

defineProps<Props>()
</script>

<template>
	<div class="flex flex-col pt-[3rem] sm:grid sm:grid-cols-3">
		<div v-for="(item, index) in items" :key="index" class="text-palladian relative flex min-h-[40vh] flex-col items-center justify-center bg-blue-100 bg-cover bg-center sm:min-h-screen">
			<div class="relative z-20 px-4 text-center sm:px-16">
				<p class="font-display relative mb-0 text-2xl" v-html="item.title"></p>
				<p v-html="item.description" class="mb-4 line-clamp-2 min-h-[2lh]"></p>
				<PrimaryButton :url="item.url" :text="item.buttonText" :event-name="'three_column_click'" :event-params="{ button_name: 'primary_cta' }" />
			</div>

			<WpImage :loading="index === 0 ? 'eager' : 'lazy'" :fetchpriority="index === 0 ? 'high' : 'auto'" :image-id="item.img" :alt="item.alt ?? item.title" class="absolute inset-0 size-full object-cover hue-rotate-15" />
			<div class="absolute inset-0 z-10 bg-black/60"></div>
		</div>
	</div>
</template>
