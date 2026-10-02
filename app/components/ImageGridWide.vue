<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		acf?: Record<string, any>
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
	console.error("[ImageGallery] fetch failed:", error.value)
}

// const current = ref(0)

/*const next = () => (current.value = (current.value + 1) % (images.value?.length ?? 1))
const prev = () => (current.value = (current.value - 1 + (images.value?.length ?? 1)) % (images.value?.length ?? 1))*/
</script>

<template>
	<div v-if="images?.length" class="w-full px-6 pt-8 pb-16">
		<div class="mx-auto max-w-3xl sm:text-center">
			<p class="font-display text-lg" v-html="header"></p>
			<p v-html="text" class="mt-2 mb-6"></p>
		</div>
		<div class="columns-2 gap-4 sm:columns-3 lg:columns-4">
			<div v-for="(img, index) in images" :key="index" class="mb-4 break-inside-avoid">
				<NuxtImg :key="img.name" :src="img.url" :alt="img.name" class="w-full rounded-xl object-cover shadow-sm" loading="lazy" format="webp" />
			</div>
		</div>
	</div>
</template>
