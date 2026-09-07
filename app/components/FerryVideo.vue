<script setup lang="ts">
import poster from "~/assets/images/ferry-poster.webp"
import heroMobile from "~/assets/videos/ferry-video.mp4"
import heroDesktop from "~/assets/videos/ferry-video.mp4"
import OutlinedButton from "./ui/OutlinedButton.vue"

interface Props {
	header: string
	header_sm: string
	text: string
	url: string
	button: string
}

const props = defineProps<Props>()
</script>
<template>
	<div class="text-palladian relative z-10 -mt-2 h-[60vh]">
		<video :poster="poster" autoplay muted playsinline class="absolute inset-0 z-0 h-full w-full object-cover hue-rotate-15">
			<source :src="heroMobile" type="video/mp4" media="(max-width: 767px)" />

			<source :src="heroDesktop" type="video/mp4" media="(min-width: 768px)" />

			Your browser does not support the video tag.
		</video>

		<div class="bg-brand/60 absolute inset-0 z-10"></div>

		<div class="relative z-20 mx-auto flex h-full max-w-6xl flex-col px-8 pt-16 sm:justify-center sm:pb-16 sm:text-center">
			<slot>
				<span class="text-sm uppercase" v-html="header_sm"></span>
				<h1 class="text-3xl font-bold tracking-tight md:text-4xl" v-html="header"></h1>
				<p class="mx-auto my-4 line-clamp-4 max-w-2xl text-xl/8" v-html="text"></p>
				<OutlinedButton :url="url" :event-name="'secondary_ferry_click'" :text="button" :event-params="{ button_name: 'secondary_cta' }" class="text-lg mx-auto" />
			</slot>
		</div>
	</div>
</template>
