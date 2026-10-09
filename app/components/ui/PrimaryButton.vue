<script setup lang="ts">
import { useTrackEvent } from "~/composables/useTrackEvent"

const props = withDefaults(
	defineProps<{
		text?: string
		eventName: string
		eventParams?: Record<string, any>
		url?: string
		target?: "_blank" | "_self"
	}>(),
	{ target: "_self" }
)

const emit = defineEmits<{
	click: [event: MouseEvent]
}>()

const { trackEvent } = useTrackEvent()

const handleTrack = (event: MouseEvent) => {
	if (import.meta.dev && import.meta.client) {
		console.log("clicked", JSON.stringify(props.url), props.target)
	}

	emit("click", event)

	try {
		trackEvent(props.eventName, props.eventParams ?? {})
	} catch (e) {
		console.error("trackEvent failed:", e)
	}
}

// Helper to check if url is external
const isExternal = computed(() => {
	if (!props.url) return false
	return /^https?:\/\//i.test(props.url.trim())
})
</script>

<template>
	<!-- 1. External URL -> Plain <a> tag -->
	<a v-if="url && isExternal" :href="url" :target="target" :rel="target === '_blank' ? 'noopener noreferrer' : undefined" @click="handleTrack" class="font-sofia inline-block w-max rounded px-3 py-1.5 font-medium tracking-wide transition-colors duration-400">
		<slot>{{ text }}</slot>
	</a>

	<!-- 2. Internal Route -> <NuxtLink> (renders as <a href="..."> in SSR HTML) -->
	<NuxtLink v-else-if="url" :to="url" :target="target" @click="handleTrack" class="font-sofia inline-block w-max rounded px-3 py-1.5 font-medium tracking-wide transition-colors duration-400">
		<slot>{{ text }}</slot>
	</NuxtLink>

	<!-- 3. No URL -> Native <button> -->
	<button v-else type="button" @click="handleTrack" class="font-sofia w-max rounded px-3 py-1.5 font-medium tracking-wide transition-colors duration-400">
		<slot>{{ text }}</slot>
	</button>
</template>
