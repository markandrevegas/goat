<!-- components/ImageCarousel.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"

const props = withDefaults(
	defineProps<{
		header?: string
		headerSm?: string
		text?: string
		url?: string
		button?: string
	}>(),
	{
		header: "Header Text",
		headerSm: "Small Header Text",
		text: "lorem",
		url: "/",
		button: "Click Here"
	}
)

const { getGalleryImages } = useWordPress()
const { data: images, error } = await getGalleryImages(props.url)

if (error.value) {
	console.error("[ImageCarousel] fetch failed:", error.value)
}

const current = ref(0)
const isOpen = ref(false)

const openLightbox = (index: number) => {
	current.value = index
	isOpen.value = true
}

const closeLightbox = () => {
	isOpen.value = false
}

const next = () => {
	current.value = (current.value + 1) % (images.value?.length ?? 1)
}

const prev = () => {
	current.value = (current.value - 1 + (images.value?.length ?? 1)) % (images.value?.length ?? 1)
}

// Keyboard navigation (Escape to close, Left/Right arrows to slide)
const handleKeyDown = (e: KeyboardEvent) => {
	if (!isOpen.value) return
	if (e.key === "Escape") closeLightbox()
	if (e.key === "ArrowRight") next()
	if (e.key === "ArrowLeft") prev()
}

onMounted(() => window.addEventListener("keydown", handleKeyDown))
onUnmounted(() => window.removeEventListener("keydown", handleKeyDown))
</script>

<template>
	<div v-if="images?.length" class="w-full">
		<p v-if="header" class="font-display text-lg" v-html="header"></p>
		<p v-if="text" v-html="text" class="mt-2 mb-6"></p>

		<div class="relative w-full overflow-hidden rounded-xl">
			<div class="flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${current * 100}%)` }">
				<img v-for="(img, i) in images" :key="img.name" :src="img.url" :alt="img.name" @click="openLightbox(i)" class="aspect-video w-full shrink-0 cursor-pointer object-cover transition-opacity hover:opacity-95" />
			</div>

			<button @click="prev" aria-label="Previous slide" class="absolute top-1/2 left-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-xl text-white hover:bg-black/75">‹</button>
			<button @click="next" aria-label="Next slide" class="absolute top-1/2 right-2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-xl text-white hover:bg-black/75">›</button>
		</div>

		<div class="mt-4 flex justify-center gap-1">
			<button v-for="(img, i) in images" :key="img.name" @click="current = i" :aria-label="'Slide ' + (i + 1)" class="size-2 rounded-full transition-colors" :class="i === current ? 'bg-brand' : 'bg-brand/30'" />
		</div>

		<Teleport to="body">
			<Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
				<div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm sm:p-8" @click.self="closeLightbox">
					<button @click="closeLightbox" aria-label="Close modal" class="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-2xl text-white hover:bg-black/80">✕</button>

					<div class="relative flex max-h-full max-w-5xl items-center justify-center">
						<img :src="images?.[current]?.url" :alt="images?.[current]?.name" class="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl" />

						<button @click="prev" aria-label="Previous image" class="absolute left-2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-2xl text-white hover:bg-black/80 sm:-left-12">‹</button>
						<button @click="next" aria-label="Next image" class="absolute right-2 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-2xl text-white hover:bg-black/80 sm:-right-12">›</button>
					</div>

					<div class="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1 text-sm font-medium text-white">{{ current + 1 }} / {{ images.length }}</div>
				</div>
			</Transition>
		</Teleport>
	</div>
</template>
