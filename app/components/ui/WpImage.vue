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

const props = defineProps<{
	imageId?: number | string
	alt?: string
	class?: string
	sizes?: string
}>()

const config = useRuntimeConfig()
const wpBaseUrl = (config.public.goatWordpressUrl as string) || ""

const isUrl = computed(() => typeof props.imageId === "string" && props.imageId.startsWith("http"))
const shouldFetch = computed(() => !!props.imageId && !isUrl.value)

const { data: media, execute } = await useAsyncData(
	`wp-media-${props.imageId}`,
	() =>
		$fetch<WpMedia>(`/media/${props.imageId}`, {
			baseURL: wpBaseUrl
		}),
	{
		immediate: shouldFetch.value
	}
)

watch(shouldFetch, (newValue) => {
	if (newValue && !media.value) {
		execute()
	}
})

const src = computed(() => {
	if (isUrl.value) return props.imageId as string

	return media.value?.source_url || ""
})

const srcset = computed(() => {
	const sizes = media.value?.media_details?.sizes

	if (!sizes) return ""

	return Object.values(sizes)
		.filter((size) => size.source_url && size.width)
		.sort((a, b) => a.width - b.width)
		.map((size) => `${size.source_url} ${size.width}w`)
		.join(", ")
})

const altText = computed(() => props.alt || media.value?.alt_text || "")
</script>

<template>
	<img v-if="src" :src="src" :srcset="srcset || undefined" :sizes="props.sizes || '(max-width: 640px) 100vw, 33.33vw'" :alt="altText" :class="props.class" loading="lazy" />
</template>
