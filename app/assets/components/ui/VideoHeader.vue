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
	<div class="text-palladian absolute inset-0 z-10 overflow-hidden">
		<video v-if="videoUrl" :poster="posterUrl" autoplay muted playsinline loop class="absolute inset-0 z-0 h-full w-full object-cover">
			<source :src="videoUrl" type="video/mp4" />
			Your browser does not support the video tag.
		</video>

		<div class="absolute inset-0 z-10 bg-black/40"></div>

		<div class="relative z-20 mx-auto flex h-full max-w-6xl flex-col justify-center gap-2 px-8 text-center">
			<slot>
				<h1 v-if="title" class="text-3xl font-bold tracking-tight md:text-4xl" v-html="title"></h1>
				<p v-if="excerpt" class="mx-auto my-4 max-w-2xl text-xl/5" v-html="excerpt"></p>

				<div class="flex flex-row justify-center gap-4">
					<PrimaryButton :event-name="''" :text="primaryButtonText" class="bg-brand text-palladian text-lg" />
					<SecondaryButton :event-name="''" :text="secondaryButtonText" class="text-lg" />
				</div>
			</slot>
		</div>
	</div>
</template>
