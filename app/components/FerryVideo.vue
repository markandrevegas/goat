<script setup lang="ts">
import poster from "~/assets/images/ferry-poster.webp"
import heroMobile from "~/assets/videos/ferry-video.mp4"
import heroDesktop from "~/assets/videos/ferry-video.mp4"
import PrimaryButton from "./ui/PrimaryButton.vue"
import SecondaryButton from "./ui/SecondaryButton.vue"

/*interface Props {
	title?: string
	subtitle?: string
}

const props = defineProps<{
	title?: string
	subtitle?: string
}>()*/
</script>
<template>
	<div class="text-palladian relative z-10 -mt-2 h-[50vh]">
		<video :poster="poster" autoplay muted playsinline class="absolute inset-0 z-0 h-full w-full object-cover">
			<source :src="heroMobile" type="video/mp4" media="(max-width: 767px)" />

			<source :src="heroDesktop" type="video/mp4" media="(min-width: 768px)" />

			Your browser does not support the video tag.
		</video>

		<div class="absolute inset-0 z-10 bg-black/40"></div>

		<div class="relative z-20 mx-auto flex h-full max-w-6xl flex-col sm:justify-center sm:text-center gap-2 px-8">
			<slot>
				<span class="text-sm uppercase">Find os på airbnb</span>
				<h1 class="text-3xl font-bold tracking-tight md:text-4xl">Floating G.O.A.T.</h1>
				<p class="mx-auto my-4 line-clamp-4 max-w-2xl text-xl/5">Mødelokaler, eventspace, private selskaber og ferielejligheder. <br /><br />På en færge midt i København.</p>
				<div class="flex hidden flex-row justify-center gap-4">
					<PrimaryButton :text="'Primary Button'" class="bg-brand text-palladian text-lg" />
					<SecondaryButton :text="'Secondary Button'" class="text-lg" />
				</div>
			</slot>
		</div>
	</div>
</template>
