<script setup lang="ts">
import { useTrackEvent } from "~/composables/useTrackEvent"

const props = defineProps<{
	text?: string
	eventName: string
	eventParams?: Record<string, any>
	url?: string
}>()

const emit = defineEmits<{
	click: [event: MouseEvent]
}>()

const { trackEvent } = useTrackEvent()

const handleButtonClick = async (event: MouseEvent) => {
	emit("click", event)

	if (props.url) {
		const isExternal = props.url.startsWith("http://") || props.url.startsWith("https://")
		if (isExternal) {
			window.open(props.url, "_blank")
		} else {
			await navigateTo(props.url)
		}
	}

	try {
		trackEvent(props.eventName, props.eventParams ?? {})
	} catch (e) {
		console.error("trackEvent failed:", e)
	}
}
</script>

<template>
	<button @click="handleButtonClick" class="font-sofia w-max rounded px-2 py-1 font-medium transition-colors duration-400">
		{{ text }}
	</button>
</template>
