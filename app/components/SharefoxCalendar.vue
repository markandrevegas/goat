<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue"
import ArrowRight from "./icons/ArrowRight.vue"
import ArrowLeft from "./icons/ArrowLeft.vue"
import Warning from "./icons/Warning.vue"

const props = defineProps<{ slug: string }>()

const { getProducts, fetchUnavailabilityDays } = useSharefox()

const { data: products } = await getProducts()
const productId = computed(() => products.value?.find((p) => p.slug === props.slug)?.id)

const now = new Date()
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

const currentYear = ref(now.getFullYear())
const currentMonth = ref(now.getMonth() + 1)

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const currentMonthName = computed(() => monthNames[currentMonth.value - 1])
const daysInMonth = computed(() => new Date(currentYear.value, currentMonth.value, 0).getDate())
const paddingDays = computed(() => {
	const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1).getDay()
	return firstDay === 0 ? 6 : firstDay - 1
})

// Full = fully booked or closed. Partial = has bookings but still has capacity.
const unavailable = ref(new Set<string>())
const partial = ref(new Set<string>())
const loadedMonths = new Set<string>()
const loading = ref(false)

const loadMonth = async () => {
	const id = productId.value
	const key = `${currentYear.value}-${currentMonth.value}`
	if (!id || loadedMonths.has(key)) return

	loadedMonths.add(key)
	loading.value = true
	try {
		const res = await fetchUnavailabilityDays(id, { year: currentYear.value, month: currentMonth.value })

		// Full or closed days are unavailable
		const fullSet = new Set<string>([...(res.fullDays ?? []), ...(res.closedDays ?? [])])

		// Sharefox's bookedDays = "has at least one booking", so those that
		// aren't full or closed are the partial days
		const partialSet = new Set<string>([...(res.partialDays ?? []), ...(res.bookedDays ?? [])])
		for (const d of fullSet) partialSet.delete(d)

		unavailable.value = new Set([...unavailable.value, ...fullSet])
		partial.value = new Set([...partial.value, ...partialSet])
	} catch (e) {
		console.error("loadMonth failed", e)
		loadedMonths.delete(key)
	} finally {
		loading.value = false
	}
}

onMounted(loadMonth)
watch([currentYear, currentMonth], loadMonth)

const formatDate = (day: number) => {
	const m = String(currentMonth.value).padStart(2, "0")
	const d = String(day).padStart(2, "0")
	return `${currentYear.value}-${m}-${d}`
}

const getDateObject = (day: number) => new Date(currentYear.value, currentMonth.value - 1, day)

const isPastDate = (day: number) => getDateObject(day) < today
const isDayUnavailable = (day: number) => unavailable.value.has(formatDate(day))
const isDayPartial = (day: number) => partial.value.has(formatDate(day))

const isFutureUnavailable = (day: number) => !isPastDate(day) && isDayUnavailable(day)
const isFuturePartial = (day: number) => !isPastDate(day) && !isDayUnavailable(day) && isDayPartial(day)

const prevMonth = () => {
	if (currentMonth.value === 1) {
		currentMonth.value = 12
		currentYear.value--
	} else {
		currentMonth.value--
	}
}
const nextMonth = () => {
	if (currentMonth.value === 12) {
		currentMonth.value = 1
		currentYear.value++
	} else {
		currentMonth.value++
	}
}
</script>

<template>
	<div class="calendar-wrapper my-4 border border-gray-200 bg-white shadow-sm">
		<!-- Header -->
		<div class="mb-8 flex items-start justify-between p-4">
			<div class="flex flex-col gap-1">
				<h3 class="font-sans text-xl font-semibold tracking-tight text-gray-900">{{ currentMonthName }} {{ currentYear }}</h3>
				<div class="flex w-full items-center gap-2 text-xs text-gray-500">
					<Warning class="size-5 text-amber-500" />
					<p>Check day legend for partial vs. full availability.</p>
				</div>
			</div>

			<div class="flex gap-1">
				<button type="button" class="rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-200" aria-label="Previous Month" @click="prevMonth">
					<ArrowLeft />
				</button>
				<button type="button" class="rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-200" aria-label="Next Month" @click="nextMonth">
					<ArrowRight />
				</button>
			</div>
		</div>

		<!-- Days of Week Header -->
		<div class="mb-2 grid grid-cols-7 gap-1 px-4 text-center text-xs font-semibold text-gray-400">
			<div>Mon</div>
			<div>Tue</div>
			<div>Wed</div>
			<div>Thu</div>
			<div>Fri</div>
			<div>Sat</div>
			<div>Sun</div>
		</div>

		<!-- Calendar Grid -->
		<div class="grid grid-cols-7 gap-1.5 px-4 transition-opacity" :class="loading ? 'opacity-60' : 'opacity-100'">
			<div v-for="pad in paddingDays" :key="'pad-' + pad" class="h-9"></div>

			<div v-for="day in daysInMonth" :key="day" class="relative flex h-9 items-center justify-center rounded-md border text-xs font-medium transition-colors select-none" :class="[isPastDate(day) ? 'cursor-not-allowed border-gray-100 bg-gray-100 text-gray-300 opacity-50' : isFutureUnavailable(day) ? 'border-red-200 bg-red-200 text-red-700 line-through' : isFuturePartial(day) ? 'border-amber-300 bg-amber-100 font-semibold text-amber-900' : 'border-gray-200 bg-gray-200 text-gray-700 hover:bg-gray-300']">
				{{ day }}

				<!-- Optional: Little indicator dot for partial dates -->
				<!--<span v-if="isFuturePartial(day)" class="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-amber-500"></span>-->
			</div>
		</div>

		<!-- Updated Footer Legend -->
		<div class="mt-4 flex flex-wrap items-center justify-start gap-6 bg-gray-50 p-4 text-xs text-gray-600">
			<div class="flex items-center gap-2">
				<span class="inline-block h-4 w-4 rounded border border-gray-300 bg-gray-200"></span>
				<span>Available</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="inline-block h-4 w-4 rounded border border-amber-300 bg-amber-100"></span>
				<span>Limited</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="inline-block h-4 w-4 rounded border border-red-200 bg-red-200"></span>
				<span>Unavailable</span>
			</div>
		</div>
	</div>
</template>
