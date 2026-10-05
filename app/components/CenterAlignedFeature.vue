<script setup lang="ts">
const props = defineProps<{
	header: string
	text: string
}>()
</script>
<template>
	<section class="flex flex-col items-center justify-center sm:flex-row">
		<div class="flex max-w-5xl flex-col sm:flex-row sm:items-center">
			<div class="px-0 pt-16 text-center sm:col-span-2 sm:px-8">
				<h2 class="mt-8 text-3xl font-semibold">{{ header }}</h2>
				<p class="mt-6 max-w-xl leading-[1.5]">{{ text }}</p>
			</div>
		</div>
	</section>
</template>
