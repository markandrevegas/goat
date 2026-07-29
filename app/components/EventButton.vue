<script setup lang="ts">
const { trackEvent } = useTrackEvent()

const handleButtonClick = () => {
	trackEvent("test_click", {
		button_name: "hero_cta",
		page: "homepage",
	})
}
</script>

<template>
	<div class="p-8">
		<button @click="handleButtonClick" class="rounded bg-blue-600 px-4 py-2 text-white shadow hover:bg-blue-700">Fire GA4 Test Event</button>
	</div>
</template>
