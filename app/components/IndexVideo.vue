<script setup lang="ts">
import heroMobile from "~/assets/videos/floating-goat-homepage.mp4"
import heroDesktop from "~/assets/videos/floating-goat-homepage.mp4"
import PrimaryButton from "./ui/PrimaryButton.vue"
import SecondaryButton from "./ui/SecondaryButton.vue"

interface Props {
	title?: string
	subtitle?: string
}

const props = defineProps<{
	title?: string
	subtitle?: string
}>()

const truncatedSubtitle = computed(() => {
	if (!props.subtitle) return ""

	let plainText = props.subtitle.replace(/<[^>]*>/g, "").trim()

	if (import.meta.client) {
		const doc = new DOMParser().parseFromString(props.subtitle, "text/html")
		plainText = doc.body.textContent || ""
	}

	return plainText.length > 40 ? plainText.slice(0, 100).trim() + "..." : plainText
})
</script>
<template>
	<div class="absolute inset-0 -z-10 overflow-hidden">
		<video autoplay muted playsinline class="absolute inset-0 z-0 h-full w-full object-cover">
			<source :src="heroMobile" type="video/mp4" media="(max-width: 767px)" />

			<source :src="heroDesktop" type="video/mp4" media="(min-width: 768px)" />

			Your browser does not support the video tag.
		</video>

		<div class="absolute inset-0 z-10 bg-black/40"></div>

		<div class="relative z-20 flex h-full flex-col gap-2 justify-center items-start px-8 text-white sm:pl-32">
			<slot>
				<h1 class="text-3xl font-bold tracking-tight md:text-6xl" v-html="title"></h1>
				<p class="my-4 line-clamp-4 max-w-xl text-lg text-gray-200 md:text-xl" v-html="truncatedSubtitle"></p>
				<div class="flex flex-row gap-4">
					<PrimaryButton :text="'Primary'" />
					<SecondaryButton :text="'Secondary'" />
				</div>
			</slot>
			
		</div>
	</div>
</template>
