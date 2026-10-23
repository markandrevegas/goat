<script setup lang="ts">
const route = useRoute()
import PrimaryButton from "../ui/PrimaryButton.vue"
import WpImage from "./WpImage.vue"

interface ColumnItem {
	img: number | string
	title: string
	description: string
	alt?: string
	buttonText?: string
	url?: string
}

interface Props {
	items: ColumnItem[]
}

defineProps<Props>()
const buttonLocation = computed(() => {
	const raw = route.params.slug
	const parts = (Array.isArray(raw) ? raw : [raw ?? ""]).flatMap((p) => String(p).split(/[,/]/)).filter(Boolean)
	return "/" + parts.join("/")
})
const formatEventName = (url?: string) => {
	if (!url) return "feature_to_"

	const cleanedUrl = url
		.replace(/^\/|\/$/g, "")
		.replace(/,/g, "")
		.replace(/\//g, "_")

	return `feature_to_${cleanedUrl}`
}
</script>

<template>
	<div class="mx-auto flex w-max flex-col shadow-xl shadow-black/40 sm:flex-row sm:justify-center">
		<div v-for="(item, index) in items" :key="index" class="text-palladian relative flex min-h-[40vh] flex-col items-center justify-center bg-cover bg-center sm:min-h-[50vh]">
			<div class="relative z-20 px-4 text-center sm:px-16">
				<p class="font-display relative mb-0 text-2xl" v-html="item.title"></p>
				<p v-html="item.description" class="mt-2 mb-6 line-clamp-3 min-h-[24h] text-xs"></p>
				<PrimaryButton :url="item.url" :text="item.buttonText" :event-params="{ button_location: buttonLocation }" :event-name="formatEventName(item.url)" class="bg-palladian text-brand hover:bg-brand hover:text-palladian text-xl uppercase hover:cursor-pointer" />
			</div>
			<WpImage :loading="index === 0 ? 'eager' : 'lazy'" :fetchpriority="index === 0 ? 'high' : 'auto'" :image-id="item.img" :alt="item.alt ?? item.title" class="absolute inset-0 size-full object-cover hue-rotate-15" />
			<div class="absolute inset-0 z-10 bg-black/60"></div>
		</div>
	</div>
</template>
