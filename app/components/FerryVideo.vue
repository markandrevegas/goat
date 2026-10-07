<script setup lang="ts">
import { ref } from "vue"

import heroMobile from "~/assets/videos/ferry-video.mp4"
import heroDesktop from "~/assets/videos/ferry-video.mp4"
import PrimaryButton from "./ui/PrimaryButton.vue"

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
		<video v-if="props" autoplay muted playsinline class="absolute inset-0 z-0 h-full w-full object-cover hue-rotate-15" @playing="isVideoPlaying = true">
			<source :src="heroMobile" type="video/mp4" media="(max-width: 639px)" />
			<source :src="heroDesktop" type="video/mp4" media="(min-width: 640px)" />
			Your browser does not support the video tag.
		</video>
		<NuxtImg v-else src="/images/ferry.webp" alt="Hero video poster" sizes="sm:100vw md:100vw lg:100vw" format="webp" quality="65" loading="lazy" fetchpriority="low" class="pointer-events-none absolute inset-0 z-0 h-full w-full object-cover hue-rotate-15" />

		<div class="bg-brand/50 absolute inset-0 z-10 mix-blend-multiply"></div>

		<div class="relative z-20 mx-auto flex h-full max-w-6xl flex-col px-8 pt-16 sm:justify-center sm:pb-16">
			<slot>
				<span class="text-sm uppercase" v-html="props.headerSm"></span>
				<h2 class="mt-4 text-3xl font-semibold" v-html="props.header"></h2>
				<p class="mt-6 mb-6 sm:max-w-xl" v-html="text"></p>
				<PrimaryButton :url="props.url || '/business-lounge'" :text="props.button" :event-params="{ button_name: 'business_lounge_button' }" :event-name="'go_to_business_lounge'" class="bg-palladian text-brand hover:bg-brand hover:text-palladian text-xl uppercase hover:cursor-pointer" />
			</slot>
		</div>
	</div>
</template>
