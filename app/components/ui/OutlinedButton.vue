<script setup lang="ts">
import { useTrackEvent } from "~/composables/useTrackEvent"

const props = defineProps<{
	text: string
	eventName: string
	eventParams?: Record<string, any>
	url?: string
}>()

const emit = defineEmits<{
	click: [event: MouseEvent]
}>()

const { trackEvent } = useTrackEvent()

const handleButtonClick = (event: MouseEvent) => {
	trackEvent(props.eventName, props.eventParams ?? {})
	emit("click", event)
	if (props.url) {
		window.open(props.url, "_parent")
	}
}
</script>

<template>
	<button @click="handleButtonClick" class="border-palladian text-palladian hover:bg-palladian hover:text-brand border border-palladian hover:border-transparent w-max rounded px-3 py-2 font-medium transition-colors duration-400">
		{{ text }}
	</button>
</template>
