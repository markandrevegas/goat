<script setup lang="ts">
import poster from "~/assets/images/ferry-poster.webp"
import heroMobile from "~/assets/videos/ferry-video.mp4"
import heroDesktop from "~/assets/videos/ferry-video.mp4"
import PrimaryButton from "./ui/PrimaryButton.vue"
import SecondaryButton from "./ui/SecondaryButton.vue"
</script>
<template>
	<div class="text-palladian relative z-10 -mt-2 h-[50vh]">
		<video :poster="poster" autoplay muted playsinline class="absolute inset-0 z-0 h-full w-full object-cover hue-rotate-15">
			<source :src="heroMobile" type="video/mp4" media="(max-width: 767px)" />

			<source :src="heroDesktop" type="video/mp4" media="(min-width: 768px)" />

			Your browser does not support the video tag.
		</video>

		<div class="bg-brand/60 absolute inset-0 z-10"></div>

		<div class="relative z-20 mx-auto flex h-full max-w-6xl flex-col px-8 pt-16 sm:justify-center sm:pb-16 sm:text-center">
			<slot>
				<span class="text-sm uppercase">Find os på airbnb</span>
				<h1 class="text-3xl font-bold tracking-tight md:text-4xl">Floating G.O.A.T.</h1>
				<p class="mx-auto my-4 line-clamp-4 max-w-2xl text-xl/6">Mødelokaler, eventspace, private selskaber og ferielejligheder. <br /><br />På en færge midt i København.</p>
				<div class="flex w-full flex-row gap-4 sm:justify-center">
					<PrimaryButton :event-name="'ferry_book'" :event-params="{ button_name: 'primary_cta' }" :text="'Primary Button'" class="bg-brand text-palladian text-lg" />
					<SecondaryButton :text="'Secondary Button'" :event-params="{ button_name: 'secondary_cta' }" class="text-lg" />
				</div>
			</slot>
		</div>
	</div>
</template>
