<script setup lang="ts">
import { computed, watch } from "vue"

interface WpImageSize {
	source_url: string
	width: number
	height: number
}

interface WpMedia {
	source_url: string
	alt_text?: string
	media_details?: {
		width: number
		height: number
		sizes?: Record<string, WpImageSize>
	}
}

const props = withDefaults(
	defineProps<{
		imageId?: number | string | null
		alt?: string
		class?: string
		sizes?: string
		loading?: "lazy" | "eager"
		fetchpriority?: "low" | "high" | "auto"
	}>(),
	{
		loading: "lazy",
		fetchpriority: "auto"
	}
)

const config = useRuntimeConfig()
const wpBaseUrl = (config.public.goatWordpressUrl as string) || ""

const isUrl = computed(() => typeof props.imageId === "string" && props.imageId.startsWith("http"))
const shouldFetch = computed(() => !!props.imageId && !isUrl.value)

const { data: media, execute, error } = await useAsyncData(`wp-media-${props.imageId}`, () => $fetch<WpMedia>(`/media/${props.imageId}`, { baseURL: wpBaseUrl }), { immediate: shouldFetch.value })

watch(error, (err) => {
	if (err) console.error("[WpImage] fetch failed for imageId", props.imageId, err)
})

watch(shouldFetch, (newValue) => {
	if (newValue && !media.value) {
		execute()
	}
})

const src = computed(() => {
	if (isUrl.value) {
		const url = props.imageId as string
		// Default src points to the 300w version if it's an external webp image
		if (url.endsWith(".webp") && !url.includes("-300w") && !url.includes("-600w")) {
			return url.replace(/\.webp$/, "-300w.webp")
		}
		return url
	}
	return media.value?.source_url || ""
})

const srcset = computed(() => {
	// 1. Handle external/direct image URLs
	if (isUrl.value) {
		const url = props.imageId as string
		if (url.endsWith(".webp")) {
			const baseUrl = url.replace(/(-300w|-600w)?\.webp$/, "")
			return `${baseUrl}-300w.webp 1x, ${baseUrl}-600w.webp 2x`
		}
		return ""
	}

	// 2. Handle WordPress API media sizes
	const sizes = media.value?.media_details?.sizes
	if (!sizes) return ""

	return Object.values(sizes)
		.filter((size) => size.source_url && size.width)
		.sort((a, b) => a.width - b.width)
		.map((size) => `${size.source_url} ${size.width}w`)
		.join(", ")
})

const computedSizes = computed(() => {
	if (props.sizes) return props.sizes
	if (isUrl.value) return "120px"

	return "(max-width: 640px) 100vw, 33.33vw"
})

const altText = computed(() => props.alt || media.value?.alt_text || "")
</script>

<template>
	<img v-if="src" :src="src" :srcset="srcset || undefined" :sizes="computedSizes" :alt="altText" :class="props.class" width="120" height="32" decoding="async" :loading="props.loading" :fetchpriority="props.fetchpriority" />
</template>
