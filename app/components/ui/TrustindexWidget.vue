<script setup lang="ts">
import Airbnb from "../icons/Airbnb.vue"
import StarFilled from "../icons/StarFilled.vue"
import BadgeChecked from "../icons/BadgeChecked.vue"
import QuoteMark from "../icons/QuoteMark.vue"

interface Reviewer {
	firstName: string
	pictureUrl: string
}

interface Review {
	id: string
	localizedText?: string
	text?: string
	localizedDate: string
	rating: number
	reviewer: Reviewer
}

interface AirbnbApiResponse {
	success: boolean
	rating: number | null
	reviews_count: number
	reviews: Review[]
}

const { data, pending, error } = useFetch<AirbnbApiResponse>(
	"https://floatinggoat.dk/wp-json/custom/v1/airbnb-rating",
	{
		key: "airbnb-reviews-carousel"
	}
)
</script>

<template>
	<section class="relative -top-[2px] mx-auto flex h-full w-full px-4 sm:px-0 sm:w-4/5 flex-col justify-center overflow-hidden py-24 font-sans md:h-screen">
		<div v-if="pending" class="text-brand text-center font-bold">Loading reviews...</div>

		<div v-else-if="error" class="text-center font-bold text-red-800">Could not load reviews.</div>

		<div v-else-if="data?.success" class="mx-auto flex w-full flex-col items-center gap-8 lg:flex-row lg:items-stretch">
			<div class="mx-auto flex w-[250px] shrink-0 flex-col items-center justify-center">
				<h2 class="font-display mb-2 text-4xl tracking-tight">Excellent</h2>
				<div class="mb-2 flex">
					<StarFilled v-for="i in 5" :key="i" class="size-6 sm:size-7" />
				</div>
				<p class="mt-2 mb-6 text-sm font-medium">
					Based on
					<NuxtLink :to="'https://www.airbnb.com/rooms/1097007987468938423'" target="_blank" class="font-bold underline decoration-2 underline-offset-2 hover:opacity-70">{{ data.reviews_count }} reviews</NuxtLink>
				</p>
				<div class="mt-4">
					<Airbnb class="scale-250" />
				</div>
			</div>
			<div class="flex w-full snap-x snap-mandatory [scrollbar-width:none] items-center justify-start gap-4 overflow-x-auto scroll-smooth px-2 pt-2 pb-6 [-ms-overflow-style:none] lg:snap-none lg:gap-4 lg:overflow-scroll [&::-webkit-scrollbar]:hidden">
				<div v-for="review in data.reviews" :key="review.id" class="flex h-72 min-w-[320px] snap-start flex-col rounded-2xl bg-white p-6 shadow-sm sm:w-[calc(50%-0.5rem)] lg:w-[240px]">
					<div class="mb-3 flex items-center gap-x-3">
						<img loading="lazy" fetchpriority="low" :src="review.reviewer?.pictureUrl" :alt="review.reviewer?.firstName" class="h-12 w-12 rounded-full object-cover" />
						<div>
							<div class="flex items-start justify-start">
								<h3 class="text-brand text-base/5 font-bold">
									{{ review.reviewer?.firstName }}
								</h3>
								<BadgeChecked class="ml-1 text-blue-500" />
							</div>

							<p class="text-brand/60 text-xs/5 font-medium">
								{{ review.localizedDate }}
							</p>
						</div>
					</div>
					<div class="-gap-[.1rem] mb-4 flex items-center">
						<StarFilled v-for="i in review.rating" :key="i" class="text-brand size-4" />
					</div>
					<p class="text-brand mb-4 line-clamp-4 flex-grow text-sm/5">
						{{ review.localizedText || review.text }}
					</p>
					<div class="mt-auto flex justify-end">
						<QuoteMark class="text-brand size-8" />
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.hide-scroll-bar {
	-ms-overflow-style: none;
	scrollbar-width: none;
}
.hide-scroll-bar::-webkit-scrollbar {
	display: none;
}
</style>
