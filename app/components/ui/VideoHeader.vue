<script setup lang="ts">
import { ref } from "vue"
import PrimaryButton from "./PrimaryButton.vue"
import SecondaryButton from "./SecondaryButton.vue"

const img = useImage()
const posterUrl = computed(() => img("/images/ferry-poster.webp", { width: 1920, quality: 45, format: "webp" }))

interface Props {
	title?: string
	excerpt?: string
	videoUrl?: string
	posterUrl?: string
	primaryButtonText?: string
	primaryButtonUrl?: string
	secondaryButtonText?: string
	secondaryButtonUrl?: string
	tertiaryButtonText?: string
	tertiaryButtonUrl?: string
}
defineProps<Props>()
const isVideoPlaying = ref(false)
const showVideo = ref(false)

onMounted(() => {
	const start = () => (showVideo.value = true)
	if ("requestIdleCallback" in window) {
		requestIdleCallback(start, { timeout: 3000 })
	} else {
		setTimeout(start, 1500)
	}
})
</script>

<template>
	<div class="relative h-screen">
		<div class="relative flex h-[calc(100vh-60px)] flex-col">
			<video v-if="showVideo && videoUrl" :poster="posterUrl" autoplay muted playsinline loop preload="none" fetchpriority="high" class="absolute inset-0 z-0 h-full w-full object-cover" @playing="isVideoPlaying = true">
				<source :src="videoUrl" type="video/mp4" />
				Your browser does not support the video tag.
			</video>
			<NuxtImg v-else src="/images/ferry-poster.webp" alt="Hero background poster" sizes="sm:100vw md:100vw lg:100vw" densities="1x" format="webp" quality="45" loading="eager" fetchpriority="auto" preload class="absolute inset-0 z-0 h-full w-full object-cover hue-rotate-15" />
			<div class="absolute inset-0 z-10 bg-black/40"></div>

			<div class="relative z-20 mx-auto flex h-full max-w-6xl flex-col justify-center gap-2 px-8 text-center">
				<h1 v-if="title" class="text-4xl tracking-tight">{{ title }}</h1>
				<p v-if="excerpt" class="mx-auto my-4 max-w-[320px] text-base/7 sm:max-w-lg sm:px-4" v-html="excerpt"></p>
			</div>
		</div>
		<div class="absolute bottom-0 z-20 h-[60px] w-full">
			<div class="button-group bg-palladian text-brand absolute top-0 left-1/2 z-50 flex -translate-x-1/2 -translate-y-1/2 flex-row">
				<span class="button-group__item">
					<PrimaryButton :url="primaryButtonUrl" :event-name="''" :text="primaryButtonText" class="rounded-r-none border-0 px-6 text-xl uppercase" />
				</span>
				<span class="button-group__item">
					<PrimaryButton :url="secondaryButtonUrl" :event-name="''" :text="secondaryButtonText" class="rounded-none border-0 px-6 text-xl uppercase" />
				</span>
				<span class="button-group__item">
					<PrimaryButton :url="tertiaryButtonUrl" :event-name="''" :text="'Reserve Rooms'" class="rounded-l-none border-0 px-6 text-xl uppercase" />
				</span>
			</div>
		</div>
	</div>
</template>
<style scoped>
.button-group__item {
	position: relative;
	display: flex;
}

.button-group__item:not(:last-child)::after {
	content: "|";
	position: absolute;
	top: 37%;
	right: 0;
	height: 16px;
	transform: translate(50%, -50%);
	color: var(--palladian);
	pointer-events: none;
	z-index: 1;
}
</style>
