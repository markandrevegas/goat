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
			await navigateTo(props.url, {
				external: props.url.startsWith("http")
			})
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
	<button @click="handleButtonClick" type="button" class="text-brand p-0">
		{{ text }}
	</button>
</template>
