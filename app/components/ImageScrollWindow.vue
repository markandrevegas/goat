<script setup lang="ts">
import WpImage from "~/components/ui/WpImage.vue"
import CardScroller from "~/components/ui/CardScroller.vue"

export interface CardItem {
	img: string
	title: string
	description: string
	buttonText?: string
	alt?: string
}

interface Props {
	scrollHeader: string
	scrollImage: number | string
	standardCards: CardItem[]
}

defineProps<Props>()
</script>

<template>
	<section class="relative">
		<!-- The amount of extra scroll we need for the heading -->
		<div class="relative h-[100vh]">
			<!-- Sticky image -->
			<div class="sticky top-0 h-screen w-full overflow-hidden">
				<WpImage v-if="scrollImage" :image-id="scrollImage" :alt="scrollHeader ?? 'Vandets ro og byens puls'" class="block h-full w-full object-cover" />

				<div class="absolute inset-0 bg-black/30" />

				<!-- This is the scrolling content -->
				<div class="absolute inset-0">
					<div class="flex h-full items-center justify-center px-6">
						<h2 class="text-palladian max-w-2xl text-center text-5xl" v-html="scrollHeader" />
					</div>
				</div>
			</div>
		</div>

		<!-- Cards start immediately after the scroll window -->
		<div class="bg-brand relative z-20 -mt-[20vh]">
			<CardScroller :items="standardCards" />
		</div>
	</section>
</template>
