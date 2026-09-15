<script setup lang="ts">
import Airbnb from '../icons/Airbnb.vue'
import StarFilled from '../icons/StarFilled.vue'
import BadgeChecked from '../icons/BadgeChecked.vue'
import QuoteMark from '../icons/QuoteMark.vue'

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
	<section class="bg-palladian text-brand w-full overflow-hidden px-4 py-12 font-sans md:px-8">
		<div v-if="pending" class="text-brand text-center font-bold">Loading reviews...</div>

		<div v-else-if="error" class="text-center font-bold text-red-800">Could not load reviews.</div>

		<div v-else-if="data?.success" class="mx-auto flex max-w-6xl flex-col items-center gap-2 lg:flex-row lg:items-stretch">

			<div class="flex min-w-[250px] shrink-0 flex-col items-center justify-center">
        <!-- Airbnb Logo text approximation (Red) -->
				<div>
					<Airbnb class="scale-175" />
				</div>
				<h2 class="tracking-tight mt-6 mb-2 text-xl font-display md:text-3xl">Excellent</h2>

				<!-- 5 Large Stars -->
				<div class="mb-2 flex">
          <StarFilled v-for="i in 5" :key="i" />
				</div>

				<p class="mb-4 text-sm font-medium">
					Based on <NuxtLink :to="'https://www.airbnb.com/rooms/1097007987468938423'" target="_blank"><span class="font-bold underline decoration-2 underline-offset-2">{{ data.reviews_count }} reviews</span></NuxtLink>
				</p>

				
			</div>

			<div class="flex justify-start items-center w-full snap-x snap-mandatory [scrollbar-width:none] gap-4 overflow-x-auto scroll-smooth px-2 pt-2 pb-6 [-ms-overflow-style:none] lg:snap-none lg:overflow-scroll lg:gap-4 [&::-webkit-scrollbar]:hidden">

				<div v-for="review in data.reviews" :key="review.id" class="flex  snap-start min-w-[320px] h-72 flex-col rounded-2xl bg-white p-6 shadow-sm sm:w-[calc(50%-0.5rem)] lg:w-[320px]">
					<!-- Reviewer Header -->
					<div class="mb-3 flex items-center gap-x-3">
						<img :src="review.reviewer?.pictureUrl" :alt="review.reviewer?.firstName" class="h-12 w-12 rounded-full object-cover" />
						<div>
							<h3 class="text-lg/5 font-bold">
								{{ review.reviewer?.firstName }}
							</h3>
							<p class="text-[12px] font-medium text-brand/60">
								{{ review.localizedDate }}
							</p>
						</div>
					</div>

					<!-- Stars & Verified Badge -->
					<div class="mb-4 flex items-center gap-1">
            <StarFilled v-for="i in review.rating" :key="i" />
            <BadgeChecked class="text-blue-500 ml-1" />
					</div>

					<!-- Review Text -->
					<p class="mb-4 line-clamp-4 flex-grow text-sm/5 text-brand">
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
