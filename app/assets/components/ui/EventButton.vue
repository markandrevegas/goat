<script setup lang="ts">
import { useTrackEvent } from "~/composables/useTrackEvent"

const { trackEvent } = useTrackEvent()
const props = withDefaults(
	defineProps<{
		buttonName?: string
		text: string
	}>(),
	{
		buttonName: "cta"
	}
)

const handleButtonClick = () => {
	trackEvent("test_click", {
		button_name: props.buttonName
	})
}
</script>

<template>
	<button @click="handleButtonClick" class="bg-palladian text-brand rounded px-4 py-2 font-medium shadow transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">
		{{ text }}
	</button>
</template>
