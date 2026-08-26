<script setup lang="ts">
const props = defineProps<{
	query: string
	title?: string
}>()

const mapSrc = computed(() => `https://maps.google.com/maps?q=${encodeURIComponent(props.query)}&output=embed`)
</script>

<template>
	<iframe :src="mapSrc" :title="title || 'Map'" class="mt-8 h-80 w-full rounded-xl border-0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
</template>