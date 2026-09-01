<script setup lang="ts">
import PrimaryButton from "./PrimaryButton.vue"

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
	<div class="text-palladian my-16 flex w-full snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto scroll-smooth px-8 pb-2 [-ms-overflow-style:none] lg:grid lg:snap-none lg:grid-cols-4 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
		<div v-for="(item, index) in items" :key="index" class="relative w-[85%] flex-shrink-0 snap-start flex-col items-center sm:w-[calc(50%-0.5rem)] lg:w-auto">
			<NuxtImg :src="item.img" loading="lazy" class="block aspect-[4/3] w-full object-cover" :alt="item.alt ?? item.title" sizes="85vw sm:50vw lg:25vw" />
			<div class="absolute inset-0 z-10 flex flex-col justify-end">
				<div class="absolute right-0 bottom-0 left-0 flex min-h-40 flex-col gap-4 p-4 sm:p-6">
					<p class="font-display text-xl/6 font-semibold sm:text-lg/5">
						{{ item.title }}
					</p>

					<p class="font-light sm:text-sm/5">
						{{ item.description }}
					</p>

					<PrimaryButton :text="'Book nu'" :event-name="'book_meeting'" :event-params="{ button_name: 'secondary_cta' }" />
				</div>
			</div>

			<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
		</div>
	</div>
</template>
