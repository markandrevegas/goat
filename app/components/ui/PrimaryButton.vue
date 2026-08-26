<script setup lang="ts">
import { useTrackEvent } from "~/composables/useTrackEvent"

const props = defineProps({
	text: {
		type: String,
		required: true
	},
	eventName: {
		type: String,
		required: true
	},
	eventParams: {
		type: Object as () => Record<string, any>,
		default: () => ({})
	}
})

const { trackEvent } = useTrackEvent()
const handleButtonClick = () => {
	trackEvent(props.eventName, props.eventParams)
}
</script>

<template>
	<button @click="handleButtonClick" class="bg-brand w-max rounded px-3 py-2 font-medium text-palladian transition-colors hover:bg-palladian hover:text-brand duration-400">{{ text }}</button>
</template>