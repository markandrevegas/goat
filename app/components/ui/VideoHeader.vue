<script setup lang="ts">
import PrimaryButton from "./PrimaryButton.vue"
import SecondaryButton from "./SecondaryButton.vue"

interface Props {
	title?: string
	excerpt?: string
	videoUrl?: string
	posterUrl?: string
	primaryButtonText?: string
	primaryButtonUrl?: string
	secondaryButtonText?: string
	secondaryButtonUrl?: string
}
defineProps<Props>()
</script>

<template>
	<div class="relative flex min-h-screen flex-col">
		<video v-if="videoUrl" :poster="posterUrl" autoplay muted playsinline loop class="absolute inset-0 z-0 h-full w-full object-cover">
			<source :src="videoUrl" type="video/mp4" />
			Your browser does not support the video tag.
		</video>

		<div class="absolute inset-0 z-10 bg-black/40"></div>

		<div class="relative z-30 mx-auto flex h-full max-w-6xl flex-col justify-center gap-2 px-8 text-center">
			<h1 v-if="title" class="text-xl font-bold tracking-tight md:text-4xl" v-html="title">Title</h1>
			<p v-if="excerpt" class="mx-auto my-4 max-w-2xl" v-html="excerpt"></p>

			<div class="hidden flex flex-row justify-center gap-4">
				<PrimaryButton :url="primaryButtonUrl" :event-name="''" :text="primaryButtonText" class="bg-brand text-palladian" />
				<!--<SecondaryButton :url="secondaryButtonUrl" :event-name="''" :text="secondaryButtonText" />-->
			</div>
		</div>
	</div>
</template>
