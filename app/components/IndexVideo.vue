<script setup lang="ts">
import heroMobile from "~/assets/videos/floating-goat-homepage.mp4"
import heroDesktop from "~/assets/videos/floating-goat-homepage.mp4"

interface Props {
	title?: string
	subtitle?: string
}

const props = defineProps<{
  title?: string
  subtitle?: string
}>()

const truncatedSubtitle = computed(() => {
  if (!props.subtitle) return ''
  
  let plainText = props.subtitle.replace(/<[^>]*>/g, '').trim()

  if (import.meta.client) {
    const doc = new DOMParser().parseFromString(props.subtitle, 'text/html')
    plainText = doc.body.textContent || ''
  }

  return plainText.length > 40 ? plainText.slice(0, 240).trim() + '...' : plainText
})
</script>
<template>
	<div class="absolute inset-0 -z-10 overflow-hidden">
		<video autoplay loop muted playsinline class="absolute inset-0 z-0 h-full w-full object-cover">
			<source :src="heroMobile" type="video/mp4" media="(max-width: 767px)" />

			<source :src="heroDesktop" type="video/mp4" media="(min-width: 768px)" />

			Your browser does not support the video tag.
		</video>

		<div class="absolute inset-0 z-10 bg-black/40"></div>

		<div class="relative z-20 flex h-full flex-col justify-center px-8 sm:pl-32 text-white">
			<slot>
				<h1 class="text-4xl font-bold tracking-tight md:text-6xl" v-html="title"></h1>
				<p class="mt-4 max-w-xl text-lg text-gray-200 md:text-xl line-clamp-4" v-html="truncatedSubtitle"></p>
			</slot>
		</div>
	</div>
</template>
