<template>
	<a :href="url" target="_blank" rel="noopener noreferrer">
		<svg xmlns="http://www.w3.org/2000/svg" :width.attr="size" 
			:height.attr="size" viewBox="0 0 24 24">
			<g fill="none" stroke="currentColor" stroke-width="1.5">
				<path stroke-linecap="round" stroke-linejoin="round" d="M12 16a4 4 0 1 0 0-8a4 4 0 0 0 0 8" />
				<path d="M3 16V8a5 5 0 0 1 5-5h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5Z" />
				<path stroke-linecap="round" stroke-linejoin="round" d="m17.5 6.51l.01-.011" />
			</g>
		</svg>
	</a>
</template>

<script setup lang="ts">
const props = withDefaults(
	defineProps<{
		size?: number
		url?: string
	}>(),
	{
		size: 24,
		url: "https://www.instagram.com/floating_goat_cph/"
	}
)
</script>
