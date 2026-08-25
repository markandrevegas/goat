<script setup lang="ts">
import { useTrackEvent } from "~/composables/useTrackEvent"

defineProps({
	text: {
		type: String,
		required: true
	}
})

const { trackEvent } = useTrackEvent()

const handleButtonClick = () => {
	trackEvent("test_click", {
		button_name: "primary_cta"
	})
}
</script>

<template>
	<button @click="handleButtonClick" class="bg-action w-max rounded px-3 py-2 font-medium text-white transition-colors hover:bg-[#21658D]">{{ text }}</button>
</template>
