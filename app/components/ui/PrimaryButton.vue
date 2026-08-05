<script setup lang="ts">
defineProps({
	text: {
		type: String,
		required: true,
	},
})
const handleButtonClick = () => {
	useTrackEvent("test_click", {
		button_name: "primary_cta",
	})
}
</script>

<template>
	<button @click="handleButtonClick" class="bg-palladian text-brand rounded px-4 py-2 font-medium shadow transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">{{ text }}</button>
</template>
