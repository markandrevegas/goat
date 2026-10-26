<script setup lang="ts">
import { computed, ref } from "vue"
import ArrowRight from "./icons/ArrowRight.vue"
import ArrowLeft from "./icons/ArrowLeft.vue"
import Warning from "./icons/Warning.vue";

interface BookedRange {
	start: string
	end: string
	summary?: string
}

const props = defineProps<{
	bookedRanges: BookedRange[]
}>()

const now = new Date()
// Month is 1-indexed (1 = January, 12 = December)
const currentYear = ref(now.getFullYear())
const currentMonth = ref(now.getMonth() + 1)

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const currentMonthName = computed(() => monthNames[currentMonth.value - 1])

const daysInMonth = computed(() => {
	return new Date(currentYear.value, currentMonth.value, 0).getDate()
})

const paddingDays = computed(() => {
	const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1).getDay()
	return firstDay === 0 ? 6 : firstDay - 1
})

const formatDate = (day: number) => {
	const m = String(currentMonth.value).padStart(2, "0")
	const d = String(day).padStart(2, "0")
	return `${currentYear.value}-${m}-${d}`
}

const isDayBooked = (day: number) => {
	const dateStr = formatDate(day)
	return props.bookedRanges.some((range) => dateStr >= range.start && dateStr <= range.end)
}

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

		<div class="mb-8 flex items-start justify-between p-4">
			<div class="flex flex-col gap-1">
				<h3 class="text-brand font-sans text-xl font-semibold tracking-tight">{{ currentMonthName }} {{ currentYear }}</h3>
				<div class="w-full text-brand/60 flex justify-start gap-2 text-xs leading-4">
					<Warning class="text-red-600 size-6" />
					<p>Dates marked in red are currently booked.</p>
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

		<div class="mb-2 grid grid-cols-7 gap-1 px-4 text-center text-xl font-sofia font-semibold text-gray-400">
			<div>Mon</div>
			<div>Tue</div>
			<div>Wed</div>
			<div>Thu</div>
			<div>Fri</div>
			<div>Sat</div>
			<div>Sun</div>
		</div>

		<div class="grid grid-cols-7 gap-1.5 px-4">
			<div v-for="pad in paddingDays" :key="'pad-' + pad" class="h-9"></div>
			<div v-for="day in daysInMonth" :key="day" class="flex h-9 items-center justify-center rounded-md border text-lg font-sofia font-medium transition-colors select-none" :class="isDayBooked(day) ? 'border-red-200 bg-red-200 text-red-700 line-through' : 'border-gray-200 bg-gray-200 text-gray-700'">
				{{ day }}
			</div>
		</div>

		<div class="mt-4 flex items-center justify-start gap-6 p-4 text-xs text-gray-600 bg-gray-50">
			<div class="flex items-center gap-2">
				<span class="inline-block h-4 w-4 rounded border border-gray-300 bg-gray-200"></span>
				<span class="font-sofia text-lg uppercase">Available</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="inline-block h-4 w-4 rounded border border-red-200 bg-red-200"></span>
				<span class="font-sofia text-lg uppercase">Booked</span>
			</div>
		</div>
	</div>
</template>
