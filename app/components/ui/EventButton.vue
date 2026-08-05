<script setup lang="ts">
const handleButtonClick = () => {
	useTrackEvent("test_click", {
		button_name: "menu_cta",
	})
}
</script>

<template>
	<button @click="handleButtonClick" class="rounded bg-palladian px-4 py-2 font-medium text-brand shadow transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none">Fire GA4 Test Event</button>
</template>
