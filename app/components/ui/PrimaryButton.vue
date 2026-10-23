<script setup lang="ts">
import { useTrackEvent } from "~/composables/useTrackEvent"

const props = defineProps<{
	text?: string
	eventName?: string
	eventParams?: Record<string, any>
	url?: string
	target?: "_blank" | "_self"
}>()
const emit = defineEmits<{
	click: [event: MouseEvent]
}>()
const formattedUrl = computed(() => {
	if (!props.url) return ""
	if (Array.isArray(props.url)) return props.url.join("")
	return String(props.url)
})

const { trackEvent } = useTrackEvent()

const handleTrack = (event: MouseEvent) => {
	emit("click", event)

	const name = props.eventName
	if (!name) return

	try {
		trackEvent(name, {
			button_text: props.text ?? "",
			button_url: formattedUrl.value,
			...props.eventParams
		})
	} catch (e) {
		console.error("trackEvent failed:", e)
	}
}

const isExternal = computed(() => {
	if (!props.url) return false
	return /^https?:\/\//i.test(props.url.trim())
})
</script>

<template>
	<a v-if="url && isExternal" :href="url" :target="target" :rel="target === '_blank' ? 'noopener noreferrer' : undefined" @click="handleTrack" class="font-sofia inline-block w-max rounded px-3 py-1.5 font-medium tracking-wide transition-colors duration-400">
		<slot>{{ text }}</slot>
	</a>

	<NuxtLink v-else-if="url" :to="url" :target="target" @click="handleTrack" class="font-sofia inline-block w-max rounded px-3 py-1.5 font-medium tracking-wide transition-colors duration-400">
		<slot>{{ text }}</slot>
	</NuxtLink>

	<button v-else type="button" @click="handleTrack" class="font-sofia w-max rounded px-3 py-1.5 font-medium tracking-wide transition-colors duration-400">
		<slot>{{ text }}</slot>
	</button>
</template>
