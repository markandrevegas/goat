<script setup lang="ts">
import WpImage from "./WpImage.vue"

interface Props {
	folder?: string
	speed?: number
	pauseOnHover?: boolean
}

interface GalleryItem {
	id?: number | string
	name: string
	url?: string
	source_url?: string
	src?: string
}

const props = withDefaults(defineProps<Props>(), {
	folder: "clients",
	speed: 20,
	pauseOnHover: true
})

const { getGalleryImages } = useWordPress()
const { data: galleryData } = await getGalleryImages(props.folder)

const loopItems = computed(() => {
	if (!galleryData.value) return []

	const items = (galleryData.value as GalleryItem[])
		// 1. Filter out responsive variant files (-120w, -240w, -300w, -600w, etc.)
		.filter((img) => {
			const identifier = String(img.name || img.url || img.id || "")
			return !/-\d+w\.(webp|png|jpe?g)$/i.test(identifier)
		})
		// 2. Map original base files
		.map((img) => {
			const rawImg = img as Record<string, any>
			return {
				id: img.id || img.url || rawImg.source_url || rawImg.src || "",
				label: img.name
					? img.name
							.replace(/-\d+w\.[^/.]+$/, "")
							.replace(/\.[^/.]+$/, "")
							.replace(/[-_]/g, " ")
					: ""
			}
		})

	// Duplicate items for continuous marquee loop
	return [...items, ...items]
})
</script>

<template>
	<div class="text-brand flex items-center bg-white py-16">
		<div class="flex flex-col overflow-hidden px-4 sm:mx-auto sm:grid sm:max-w-5xl sm:grid-cols-2 sm:gap-8">
			<div class="flex items-center justify-start sm:col-span-1">
				<div>
					<p class="mt-2 font-sans text-xs uppercase">Our guests</p>
					<h2 class="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Some of our former visitors</h2>
					<p class="py-4">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere placeat officiis deserunt nobis atqu.</p>
				</div>
			</div>

			<div class="relative mx-auto flex h-48 w-full max-w-3xl items-center overflow-hidden sm:col-span-1">
				<div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-white to-transparent" />
				<div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-white to-transparent" />

				<div class="marquee-track animate-marquee flex w-max items-center justify-center gap-12" :class="{ 'pause-on-hover': pauseOnHover }" :style="{ animationDuration: `${speed}s` }">
					<div v-for="(item, index) in loopItems" :key="`${item.id}-${index}`" class="flex shrink-0 flex-col items-center gap-2">
						<WpImage :image-id="item.id" :alt="item.label" class="h-8 max-h-8 w-auto max-w-[120px] shrink-0 object-contain" />
						<span class="text-brand text-xs font-semibold whitespace-nowrap text-gray-700">{{ item.label }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
