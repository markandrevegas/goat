<script setup lang="ts">
import Airbnb from "../icons/Airbnb.vue"
import StarFilled from "../icons/StarFilled.vue"
import BadgeChecked from "../icons/BadgeChecked.vue"
import ArrowUp from "../icons/ArrowUp.vue"
import ArrowDown from "../icons/ArrowDown.vue"

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

const { data, pending, error } = useFetch<AirbnbApiResponse>("https://floatinggoat.dk/wp-json/custom/v1/airbnb-rating", {
	key: "airbnb-reviews-carousel"
})

if (import.meta.dev && import.meta.client) {
	// console.log(data.value)
}

const optimizeAvatarUrl = (url?: string, width = 240) => {
	if (!url) return "/images/default-avatar.png"
	if (!url.includes("muscache.com")) return url

	// Remove existing query string and attach target size
	const cleanUrl = url.split("?")[0]
	return `${cleanUrl}?im_w=${width}&im_q=high`
}
const scroller = ref<HTMLElement | null>(null)

function scrollByItem(direction: 1 | -1) {
	const el = scroller.value
	const first = el?.firstElementChild as HTMLElement | null
	if (!el || !first) return
	const gap = parseFloat(getComputedStyle(el).rowGap) || 0
	el.scrollBy({ top: direction * (first.offsetHeight + gap), behavior: "smooth" })
}
</script>

<template>
	<section class="overflow-hidden py-16 font-sans px-8">
		<div v-if="pending" class="text-brand text-center font-bold">Loading reviews...</div>

		<div v-else-if="error" class="text-center font-bold text-red-800">Could not load reviews.</div>

		<div v-else-if="data && data?.reviews" class="bg-palladian text-brand flex w-full flex-col sm:mx-auto sm:grid sm:w-3/5 sm:grid-cols-3">
			<div class="grid w-full grid-cols-2 p-4 sm:flex sm:flex-col sm:justify-center">
				<div class="flex flex-col">
					<h2 class="font-display text-2xl tracking-tight">Excellent</h2>
					<div class="flex">
						<StarFilled v-for="i in 5" :key="i" class="size-4" />
					</div>
				</div>
				<div class="flex flex-col sm:pt-8">
					<Airbnb class="self-end sm:self-start" />
					<p class="mt-2 mb-6 w-max self-end text-xs font-medium sm:self-start">
						Based on
						<a href="https://www.airbnb.com/rooms/1097007987468938423" target="_blank" class="font-bold underline decoration-2 underline-offset-2 hover:opacity-70" v-html="data?.reviews_count + ' reviews'"></a>
					</p>
				</div>
			</div>
			<div class="flex w-full items-stretch gap-2 bg-white pr-4 sm:col-span-2">
				<div ref="scroller" class="flex h-76 flex-1 snap-y snap-mandatory scroll-pt-2 [scrollbar-width:none] flex-col gap-2 overflow-y-auto scroll-smooth sm:h-64 [&::-webkit-scrollbar]:hidden">
					<div v-for="review in data?.reviews" :key="review.id" class="flex h-72 w-full shrink-0 snap-start flex-col p-6">
						<div class="mb-3 flex items-center gap-x-3">
							<img
								:src="optimizeAvatarUrl(review.reviewer?.pictureUrl)"
								:srcset="`${optimizeAvatarUrl(review.reviewer?.pictureUrl, 100)} 1x, ${optimizeAvatarUrl(review.reviewer?.pictureUrl, 240)} 2x`"
								:alt="review.reviewer?.firstName || 'Reviewer'"
								width="48"
								height="48"
								loading="lazy"
								decoding="async"
								crossorigin="anonymous"
								class="h-12 w-12 shrink-0 rounded-full object-cover"
								@error="
									(e) => {
										const img = e.target as HTMLImageElement
										img.onerror = null
										img.removeAttribute('srcset')
										img.src = 'https://a0.muscache.com/defaults/user_pic-225x225.png'
									}
								"
							/>
							<div>
								<div class="flex items-start justify-start">
									<h3 class="text-brand text-base/5 font-bold" v-html="review.reviewer?.firstName"></h3>
									<BadgeChecked class="ml-1 text-blue-500" />
								</div>
								<p class="text-brand/60 text-xs/5 font-medium" v-html="review.localizedDate"></p>
							</div>
						</div>

						<div class="-gap-[.1rem] mb-4 flex items-center">
							<StarFilled v-for="i in review.rating" :key="i" class="text-brand size-4" />
						</div>

						<p class="text-brand mb-4 line-clamp-4 flex-grow text-xs/4" v-html="review.localizedText || review.text"></p>
					</div>
				</div>

				<div class="flex flex-col justify-start gap-2 pt-8">
					<button type="button" aria-label="Previous review" class="text-brand flex items-center justify-center rounded-full transition-colors hover:text-gray-100" @click="scrollByItem(-1)">
						<ArrowUp class="text-brand size-6" />
						<!--<svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6" /></svg>-->
					</button>
					<button type="button" aria-label="Next review" class="text-brand flex items-center justify-center rounded-full transition-colors hover:text-gray-100" @click="scrollByItem(1)">
						<ArrowDown class="text-brand size-6" />
						<!--<svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>-->
					</button>
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
