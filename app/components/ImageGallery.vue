<script setup lang="ts">
const { getGalleryImages } = useWordPress()
const { data: images, error } = await getGalleryImages()
if (error.value) {
	console.error("[ImageGallery] fetch failed:", error.value)
}
const current = ref(0)

const next = () => (current.value = (current.value + 1) % (images.value?.length ?? 1))
const prev = () => (current.value = (current.value - 1 + (images.value?.length ?? 1)) % (images.value?.length ?? 1))
</script>

<template>
	<div v-if="images?.length" class="w-full">
		<div class="relative w-full overflow-hidden rounded-xl">
			<div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${current * 100}%)` }">
				<img v-for="img in images" :key="img.name" :src="img.url" :alt="img.name" class="aspect-video w-full shrink-0 object-cover" />
			</div>

			<button @click="prev" class="absolute top-1/2 left-2 hidden -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60">‹</button>
			<button @click="next" class="absolute top-1/2 right-2 hidden -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60">›</button>
		</div>

		<div class="mt-4 flex justify-center gap-1">
			<button v-for="(img, i) in images" :key="img.name" @click="current = i" class="size-2 rounded-full" :class="i === current ? 'bg-brand' : 'bg-brand/30'" />
		</div>
	</div>
</template>
