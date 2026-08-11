<script setup lang="ts">
import PrimaryButton from './PrimaryButton.vue'

interface CardItem {
	img: string
	title: string
	description: string
	alt?: string
}

interface Props {
	items: CardItem[]
}

defineProps<Props>()
</script>

<template>
	<div class="text-palladian flex h-full w-full sm:max-w-xl sm:mx-auto snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto scroll-smooth px-8 pb-2 my-16 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
		<div v-for="(item, index) in items" :key="index" class="relative w-[85%] flex-shrink-0 snap-start sm:w-1/2">
			<NuxtImg :src="item.img" loading="lazy" class="h-auto w-full" :alt="item.alt ?? item.title" />
			<div class="absolute inset-0 z-10 flex flex-col justify-end gap-1">
				<div class="absolute right-0 bottom-0 left-0 min-h-40 pt-4 px-4 flex gap-2 flex-col">
					<p class="font-display text-xl/6 sm:text-base/5 font-semibold">{{ item.title }}</p>
					<p class="font-light sm:text-xs/4">{{ item.description }}</p>
					<PrimaryButton :text="'Book nu'" />
				</div>
			</div>
			<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
		</div>
	</div>
</template>
