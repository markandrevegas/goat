<script setup lang="ts">
interface Props {
	folder?: string
	speed?: number
	pauseOnHover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	folder: "images",
	speed: 10,
	pauseOnHover: true
})

const { getGalleryImages } = useWordPress()
const { data: galleryData } = await getGalleryImages(props.folder)

const loopItems = computed(() => {
	if (!galleryData.value) return []
	const items = galleryData.value.map((img) => ({
		logo: img.url,
		label: img.name.replace(/\.[^/.]+$/, "")
	}))
	return [...items, ...items]
})
</script>

<template>
	<div class="text-brand bg-palladian pt-24 pb-24">
		<div class="flex flex-col sm:grid sm:grid-cols-2 sm:gap-8 sm:max-w-5xl sm:mx-auto px-4">
			<div class="flex items-center justify-start sm:col-span-1">
				<div>
					<p class="mt-2 font-sans text-xs uppercase">Our guests</p>
					<h2 class="text-4xl/8 sm:text32xl mt-2 tracking-tight">Some of our former visitors</h2>
					<p class="py-4">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Facere placeat officiis deserunt nobis atqu.</p>
				</div>
			</div>
			<div class="relative mx-auto pt-8 w-full max-w-3xl overflow-hidden sm:col-span-1">
				<div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-palladian to-transparent" />
				<div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-palladian to-transparent" />
				<div class="marquee-track animate-marquee flex w-max items-center gap-12" :class="{ 'pause-on-hover': pauseOnHover }" :style="{ animationDuration: `${speed}s` }">
					<div v-for="(item, index) in loopItems" :key="index" class="flex flex-col shrink-0 items-center gap-2">
						<img :src="item.logo" :alt="item.label" class="h-12 max-h-12 w-auto max-w-[120px] object-contain" />
						<span class="text-xs font-semibold palladianspace-nowrap text-gray-700">{{ item.label }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
