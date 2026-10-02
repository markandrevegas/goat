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

const handleButtonClick = async (event: MouseEvent) => {
	if (import.meta.dev && import.meta.client) {
		console.log("clicked", JSON.stringify(props.url), props.target)
	}
	
	emit("click", event)

	// 1. Track event first
	try {
		trackEvent(props.eventName, props.eventParams ?? {})
	} catch (e) {
		console.error("trackEvent failed:", e)
	}

	// 2. Open link in target window
	if (props.url) {
		const url = props.url.trim()
		const isExternal = /^https?:\/\//i.test(url)

		if (props.target === "_blank") {
			window.open(url, "_blank", "noopener")
		} else if (isExternal) {
			window.location.assign(url)
		} else {
			await navigateTo(url)
		}
	}
}
</script>

<template>
	<button type="button" @click="handleButtonClick" class="font-sofia w-max rounded px-3 py-1.5 font-medium tracking-wide transition-colors duration-400">
		<slot>{{ text }}</slot>
	</button>
</template>
