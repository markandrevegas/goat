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
const wpBaseUrl = (config.public?.goatWordpressUrl as string) || ""

// 1. Safe URL Detection
const isUrl = computed(() => {
	if (!props.imageId) return false
	return typeof props.imageId === "string" && props.imageId.startsWith("https")
})

// 2. Only fetch from API if imageId is present AND is a numeric ID or non-URL string ID
const shouldFetch = computed(() => !!props.imageId && !isUrl.value)

// 3. Create a clean, deterministic cache key (never pass a raw http URL into key string)
const asyncKey = computed(() => {
	if (shouldFetch.value) return `wp-media-${props.imageId}`
	return null
})

const {
	data: media,
	execute,
	error
} = await useAsyncData(
	asyncKey.value || `wp-media-idle-${Math.random()}`,
	() => {
		if (!shouldFetch.value) return Promise.resolve(null)
		return $fetch<WpMedia>(`/media/${props.imageId}`, { baseURL: wpBaseUrl })
	},
	{ immediate: shouldFetch.value }
)

watch(error, (err) => {
	if (err) console.error("[WpImage] fetch failed for imageId", props.imageId, err)
})

watch(shouldFetch, (newValue) => {
	if (newValue && !media.value) {
		execute()
	}
})

// 4. Robust src resolution
const src = computed(() => {
	if (!props.imageId) return ""

	if (isUrl.value) {
		const url = String(props.imageId)
		// Only transform custom webp images if they end with .webp
		if (url.endsWith(".webp")) {
			return url.replace(/(-120w|-240w|-300w|-600w)?\.webp$/, "-120w.webp")
		}
		return url
	}

	return media.value?.source_url || ""
})

// 5. Robust srcset resolution
const srcset = computed(() => {
	if (isUrl.value) {
		const url = String(props.imageId)
		if (url.endsWith(".webp")) {
			const baseUrl = url.replace(/(-120w|-240w|-300w|-600w)?\.webp$/, "")
			return `${baseUrl}-120w.webp 1x, ${baseUrl}-240w.webp 2x`
		}
		return undefined
	}

	const sizes = media.value?.media_details?.sizes
	if (!sizes) return undefined

	const formattedSizes = Object.values(sizes)
		.filter((size) => size.source_url && size.width)
		.sort((a, b) => a.width - b.width)
		.map((size) => `${size.source_url} ${size.width}w`)
		.join(", ")

	return formattedSizes || undefined
})

const computedSizes = computed(() => {
	if (props.sizes) return props.sizes
	if (isUrl.value) return "120px"
	return "(max-width: 640px) 100vw, 33.33vw"
})

const altText = computed(() => props.alt || media.value?.alt_text || "")
</script>

<template>
	<img v-if="src" :src="src" :srcset="srcset" :sizes="computedSizes" :alt="altText" :class="props.class" width="120" height="32" decoding="async" :loading="props.loading" :fetchpriority="props.fetchpriority" />
</template>
