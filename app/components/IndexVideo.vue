<script setup lang="ts">
import heroMobile from "~/assets/videos/floating-goat-homepage.mp4"
import heroDesktop from "~/assets/videos/floating-goat-homepage.mp4"

interface Props {
	title?: string
	subtitle?: string
}
withDefaults(defineProps<Props>(), {
	title: "Welcome to Our Site",
	subtitle: "",
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

		<div class="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center text-white">
			<slot>
				<h1 class="text-4xl font-bold tracking-tight md:text-6xl" v-html="title"></h1>
				<p class="mt-4 max-w-xl text-lg text-gray-200 md:text-xl" v-html="subtitle"></p>
			</slot>
		</div>
	</div>
</template>
