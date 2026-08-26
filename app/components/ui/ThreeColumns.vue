<script setup lang="ts">
import PrimaryButton from "../ui/PrimaryButton.vue"

interface ColumnItem {
	img: string
	title: string
	description: string
	alt?: string
}

interface Props {
	items: ColumnItem[]
}

defineProps<Props>()
</script>
<template>
	<div class="mt-24 flex flex-col sm:grid sm:grid-cols-3">
		<div v-for="(item, index) in items" :key="index" class="text-palladian relative flex min-h-[40vh] flex-col items-center justify-center bg-blue-100 bg-cover bg-center sm:min-h-screen" :style="{ backgroundImage: `url(${item.img})` }">
			<div class="relative z-20 px-4 text-center sm:px-16">
				<p class="font-display relative mb-4 text-2xl md:text-4xl" v-html="item.title"></p>
				<p v-html="item.description" class="mb-4 line-clamp-2 min-h-[2lh]"></p>
				<PrimaryButton :text="'Button'" event-name="download_pdf" :event-params="{ button_name: 'primary_cta' }"></PrimaryButton>
			</div>
			<div class="from-brand/70 to-brand/20 absolute inset-0 bg-gradient-to-t" />
		</div>
	</div>
</template>
