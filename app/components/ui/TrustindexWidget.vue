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

const { data, pending, error } = await useFetch<AirbnbApiResponse>("https://floatinggoat.dk/wp-json/custom/v1/airbnb-rating", { key: "airbnb-reviews-carousel" })
</script>

<template>
	<section class="bg-palladian text-brand flex h-[80vh] w-full flex-col justify-center overflow-hidden px-4 font-sans md:h-screen md:px-8">
		<div v-if="pending" class="text-brand text-center font-bold">Loading reviews...</div>

		<div v-else-if="error" class="text-center font-bold text-red-800">Could not load reviews.</div>

		<div v-else-if="data?.success" class="mx-auto flex w-full flex-col items-center gap-8 lg:flex-row lg:items-stretch">
			<div class="mx-auto flex w-[250px] shrink-0 flex-col items-center justify-center">
				<h2 class="font-display mb-2 text-xl tracking-tight md:text-3xl">Excellent</h2>

				<!-- 5 Large Stars -->
				<div class="mb-2 flex">
					<StarFilled v-for="i in 5" :key="i" class="size-6" />
				</div>

				<p class="mt-2 mb-6 text-sm font-medium">
					Based on
					<NuxtLink :to="'https://www.airbnb.com/rooms/1097007987468938423'" target="_blank" class="font-bold underline decoration-2 underline-offset-2 hover:opacity-70">{{ data.reviews_count }} reviews</NuxtLink>
				</p>

				<!-- Airbnb Logo text approximation (Red) -->
				<div>
					<Airbnb class="scale-175" />
				</div>
			</div>

			<div class="flex w-full snap-x snap-mandatory [scrollbar-width:none] items-center justify-start gap-4 overflow-x-auto scroll-smooth px-2 pt-2 pb-6 [-ms-overflow-style:none] lg:snap-none lg:gap-4 lg:overflow-scroll [&::-webkit-scrollbar]:hidden">
				<div v-for="review in data.reviews" :key="review.id" class="flex h-72 min-w-[320px] snap-start flex-col rounded-2xl bg-white p-6 shadow-sm sm:w-[calc(50%-0.5rem)] lg:w-[320px]">
					<!-- Reviewer Header -->
					<div class="mb-3 flex items-center gap-x-3">
						<img :src="review.reviewer?.pictureUrl" :alt="review.reviewer?.firstName" class="h-12 w-12 rounded-full object-cover" />
						<div>
							<div class="flex items-start justify-start">
								<h3 class="text-base/5 font-bold">
									{{ review.reviewer?.firstName }}
								</h3>
								<BadgeChecked class="ml-1 text-blue-500" />
							</div>

							<p class="text-brand/60 text-xs/5 font-medium">
								{{ review.localizedDate }}
							</p>
						</div>
					</div>

					<!-- Stars & Verified Badge -->
					<div class="-gap-[.1rem] mb-4 flex items-center">
						<StarFilled v-for="i in review.rating" :key="i" class="size-4" />
					</div>

					<!-- Review Text -->
					<p class="text-brand mb-4 line-clamp-4 flex-grow text-xs/5">
						{{ review.localizedText || review.text }}
					</p>

					<!-- Footer: Read More & Quote Icon -->
					<div class="mt-auto flex justify-end">
						<!-- Large Quote Icon -->
						<QuoteMark class="size-8" />
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
