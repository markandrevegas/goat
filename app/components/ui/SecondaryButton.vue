<script setup lang="ts">
defineProps({
	text: {
		type: String,
		required: true
	}
})
const handleButtonClick = () => {
	useTrackEvent("test_click", {
		button_name: "secondary_cta",
	})
}
</script>

<template>
	<button @click="handleButtonClick" class="rounded bg-palladian/20 px-4 py-2 font-medium text-palladian shadow transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">Secondary</button>
</template>
