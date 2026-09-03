<script setup lang="ts">
import { computed, watch } from "vue"

const props = defineProps<{
	imageId?: number | string
	alt?: string
	class?: string
}>()

const config = useRuntimeConfig()
const wpBaseUrl = (config.public.goatWordpressUrl as string) || ''
const isUrl = computed(() => typeof props.imageId === "string" && props.imageId.startsWith("http"))
const shouldFetch = computed(() => !!props.imageId && !isUrl.value)

// Use 'immediate' instead of 'enabled' for conditional fetching
const { data: media, execute } = await useAsyncData(
	`wp-media-${props.imageId}`,
	() =>
		$fetch<{ source_url: string; alt_text?: string }>(`/media/${props.imageId}`, {
			baseURL: wpBaseUrl
		}),
	{
		immediate: shouldFetch.value
	}
)

// Watch for changes in imageId to execute manually if it starts false and later becomes truthy
watch(shouldFetch, (newValue) => {
	if (newValue && !media.value) {
		execute()
	}
})

const src = computed(() => {
	if (isUrl.value) return props.imageId as string
	return media.value?.source_url || ""
})

const altText = computed(() => props.alt || media.value?.alt_text || "")
</script>

<template>
	<img v-if="src" :src="src" :alt="altText" :class="props.class" loading="lazy" />
</template>
