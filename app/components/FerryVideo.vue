<script setup lang="ts">
import { ref } from "vue"

import heroMobile from "~/assets/videos/ferry-video.mp4"
import heroDesktop from "~/assets/videos/ferry-video.mp4"
import OutlinedButton from "./ui/OutlinedButton.vue"

interface Props {
	header: string
	headerSm?: string
	text: string
	url: string
	button: string
}

const props = defineProps<Props>()
const isVideoPlaying = ref(false)
</script>

<template>
	<div class="text-palladian relative z-10 -mt-2 h-[60vh]">
		<!-- Video tag without the native :poster attribute -->
		<video autoplay muted playsinline class="absolute inset-0 z-0 h-full w-full object-cover hue-rotate-15" @playing="isVideoPlaying = true">
			<source :src="heroMobile" type="video/mp4" media="(max-width: 639px)" />
			<source :src="heroDesktop" type="video/mp4" media="(min-width: 640px)" />
			Your browser does not support the video tag.
		</video>

		<!-- NuxtImg Overlay using the direct asset import -->
		<NuxtImg v-if="!isVideoPlaying" src="/images/ferry-poster.webp" alt="Hero video poster" sizes="sm:100vw md:100vw lg:100vw" format="webp" quality="65" loading="lazy" preload class="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover hue-rotate-15" />

		<div class="bg-brand/60 absolute inset-0 z-10"></div>

		<div class="relative z-20 mx-auto flex h-full max-w-6xl flex-col px-8 pt-16 sm:justify-center sm:pb-16 sm:text-center">
			<slot>
				<span class="text-sm uppercase" v-html="props.headerSm"></span>
				<h1 class="text-3xl font-bold tracking-tight md:text-4xl" v-html="props.header"></h1>
				<p class="mx-auto my-4 line-clamp-4 max-w-2xl text-xl/8" v-html="text"></p>
				<OutlinedButton :url="props.url" :event-name="'secondary_ferry_click'" :text="props.button" :event-params="{ button_name: 'secondary_cta' }" class="mx-auto text-lg" />
			</slot>
		</div>
	</div>
</template>
