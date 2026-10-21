<script setup lang="ts">
import { computed, ref } from "vue"
import ArrowRight from "./icons/ArrowRight.vue"
import ArrowLeft from "./icons/ArrowLeft.vue"

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

// Days in the active month
const daysInMonth = computed(() => {
	return new Date(currentYear.value, currentMonth.value, 0).getDate()
})

// Offset calculation so Day 1 aligns under the right weekday (Monday start)
const paddingDays = computed(() => {
	const firstDay = new Date(currentYear.value, currentMonth.value - 1, 1).getDay()
	// Convert Sunday (0) to 6 for Monday-based calendar grid
	return firstDay === 0 ? 6 : firstDay - 1
})

// Format day into YYYY-MM-DD string matching range dates
const formatDate = (day: number) => {
	const m = String(currentMonth.value).padStart(2, "0")
	const d = String(day).padStart(2, "0")
	return `${currentYear.value}-${m}-${d}`
}

// Check if a specific calendar date is inside a booked range
const isDayBooked = (day: number) => {
	const dateStr = formatDate(day)
	return props.bookedRanges.some((range) => dateStr >= range.start && dateStr < range.end)
}

// Month navigation controls
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
		<div class="mb-4 hidden border-b border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
			<p>Dates marked in red are currently booked.</p>
		</div>

		<div class="mb-8 flex items-start justify-between p-4">
			<div class="flex flex-col">
				<h3 class="text-brand font-sans text-2xl font-semibold tracking-tight">{{ currentMonthName }} {{ currentYear }}</h3>
				<div class="border-b border-amber-200 bg-amber-50 text-xs text-amber-900">
					<p class="font-semibold">📅 Availability Calendar (Read-Only)</p>
					<p>Direct bookings are coming soon. Dates marked in red are currently booked on Airbnb.</p>
				</div>
			</div>

			<div class="flex gap-1">
				<button type="button" class="rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-100" aria-label="Previous Month" @click="prevMonth">
					<ArrowLeft />
				</button>
				<button type="button" class="rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-100" aria-label="Next Month" @click="nextMonth">
					<ArrowRight />
				</button>
			</div>
		</div>

		<div class="mb-2 grid grid-cols-7 gap-1 px-4 text-center text-xs font-semibold text-gray-400">
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
			<div v-for="day in daysInMonth" :key="day" class="flex h-9 items-center justify-center rounded-md border text-xs font-medium transition-colors select-none" :class="isDayBooked(day) ? 'border-red-200 bg-red-100 text-red-700 line-through' : 'border-gray-200 bg-gray-50 text-gray-700'">
				{{ day }}
			</div>
		</div>

		<div class="mt-4 flex items-center justify-center gap-6 border-t p-4 text-xs text-gray-600">
			<div class="flex items-center gap-2">
				<span class="inline-block h-3 w-3 rounded border border-gray-300 bg-gray-50"></span>
				<span>Available</span>
			</div>
			<div class="flex items-center gap-2">
				<span class="inline-block h-3 w-3 rounded border border-red-200 bg-red-100"></span>
				<span>Booked</span>
			</div>
		</div>
	</div>
</template>
