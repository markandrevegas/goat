<script setup lang="ts">
interface Props {
	header?: string
	headerSm?: string
	text?: string
	url?: string
	button?: string
}

const props = defineProps<Props>()
const { getGalleryImages } = useWordPress()
const { data: images, error } = await getGalleryImages("images")
if (error.value) {
	console.error("[ImageGallery] fetch failed:", error.value)
}
const current = ref(0)

const next = () => (current.value = (current.value + 1) % (images.value?.length ?? 1))
const prev = () => (current.value = (current.value - 1 + (images.value?.length ?? 1)) % (images.value?.length ?? 1))
</script>

<template>
	<div v-if="images?.length" class="w-full">
		<p class="font-display text-center text-lg" v-html="header"></p>
		<p v-html="text" class="mt-2 mb-6 text-center text-sm"></p>
		<div class="relative w-full overflow-hidden rounded-xl">
			<div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${current * 100}%)` }">
				<img v-for="img in images" :key="img.name" :src="img.url" :alt="img.name" class="aspect-video w-full shrink-0 object-cover" />
			</div>

			<button @click="prev" aria-label="Previous slide" class="absolute top-1/2 left-2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60">‹</button>
			<button @click="next" aria-label="Next slide" class="absolute top-1/2 right-2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60">›</button>
		</div>

		<div class="mt-4 flex justify-center gap-1">
			<button v-for="(img, i) in images" :key="img.name" @click="current = i" :aria-label="'Slide' + i" class="size-2 rounded-full" :class="i === current ? 'bg-brand' : 'bg-brand/30'" />
		</div>
	</div>
</template>
