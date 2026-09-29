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

const handleButtonClick = (event: MouseEvent) => {
	trackEvent(props.eventName, props.eventParams ?? {})
	emit("click", event)
	if (props.url) {
		window.open(props.url, "_parent")
	}
}
</script>

<template>
	<button @click="handleButtonClick" class="bg-palladian text-brand font-sofia hover:bg-brand hover:text-palladian h-12 px-6 text-xl font-medium uppercase shadow transition-colors duration-400 focus:outline-none">
		{{ text }}
	</button>
</template>
