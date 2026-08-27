<script setup lang="ts">
import MapMarker from "../icons/MapMarker.vue"
const props = defineProps<{
	query: string
	title?: string
	address: string
	email: string
	tel: string
}>()

const mapSrc = computed(() => `https://maps.google.com/maps?q=${encodeURIComponent(props.query)}&output=embed`)
</script>

<template>
	<div class="flex w-full flex-col gap-4">
		<iframe :src="mapSrc" :title="title || 'Map'" class="mt-8 h-80 w-full rounded-xl border-0" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
	</div>
</template>
