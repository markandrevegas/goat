<script setup lang="ts">
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
	<div class="text-palladian flex h-full w-full snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto scroll-smooth px-8 pb-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
		<div v-for="(item, index) in items" :key="index" class="relative w-[85%] flex-shrink-0 snap-start sm:w-1/2 md:w-1/4">
			<NuxtImg :src="item.img" loading="lazy" class="h-auto w-full" :alt="item.alt ?? item.title" />
			<div class="absolute inset-0 z-10 flex flex-col justify-end gap-1 p-8">
				<p class="font-display text-xl/6 font-semibold">{{ item.title }}</p>
				<p class="font-light">{{ item.description }}</p>
			</div>
			<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
		</div>
	</div>
</template>
