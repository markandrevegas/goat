<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue"
import PrimaryButton from "~/components/ui/PrimaryButton.vue"

const props = defineProps<{
	title: string
	excerpt?: string
	callToAction?: string
	callToActionUrl?: string
	authorName?: string
	formattedDate?: string
	datePublished?: string | null
	videoUrl?: string
	posterUrl?: string
	slug?: string
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const showVideo = ref(false)

useHead({
	link: computed(() => (props.posterUrl ? [{ rel: "preload", as: "image", href: props.posterUrl, fetchpriority: "high" }] : []))
})

onMounted(() => {
	const start = () => {
		showVideo.value = true
		nextTick(() => videoRef.value?.load())
	}
	if ("requestIdleCallback" in window) {
		requestIdleCallback(start, { timeout: 3000 })
	} else {
		setTimeout(start, 1500)
	}
})
</script>

<template>
	<header class="text-palladian relative -top-[2rem] right-1/2 left-1/2 -mx-[50vw] mb-12 flex min-h-[60vh] md:min-h-[75vh] w-screen flex-col justify-center overflow-hidden pt-24">
		<div class="grid w-full grid-cols-4 gap-4 sm:mx-auto sm:max-w-6xl sm:px-8">
			<div class="relative z-20 col-span-3 pl-8 md:col-span-2 md:col-start-2 md:pl-0">
				<h1 class="text-4xl tracking-tighter" v-html="title"></h1>
				<p v-if="excerpt" v-html="excerpt" class="mt-3 mb-2 w-full text-sm/5 sm:max-w-2xl"></p>
				<div v-if="callToAction" class="flex w-full justify-start">
					<PrimaryButton :url="callToActionUrl" target="_self" :text="callToAction" :event-name="'book_' + slug" class="bg-palladian text-brand hover:bg-brand/80 hover:text-palladian mt-4 mb-8 text-xl uppercase hover:cursor-pointer" />
				</div>
				<div v-if="authorName || formattedDate" class="mt-4 flex flex-col space-x-2 text-sm">
					<span v-if="authorName" class="font-medium">Published by {{ authorName }}</span>
					<time v-if="formattedDate" :datetime="datePublished ?? undefined">{{ formattedDate }}</time>
				</div>
			</div>
		</div>

		<div v-if="videoUrl" class="absolute inset-0 z-10 w-full">
			<video ref="videoRef" :poster="posterUrl" autoplay muted playsinline loop preload="none" class="h-full w-full object-cover">
				<source v-if="showVideo" :src="videoUrl" type="video/mp4" />
			</video>
			<div class="pointer-events-none absolute inset-0 bg-black/60"></div>
		</div>
	</header>
</template>
