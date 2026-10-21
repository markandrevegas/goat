// server/api/calendar.get.ts
import ical from "node-ical"

// 1. Define the interface
export interface BookedRange {
	start: string
	end: string
	summary: string
}

export interface CalendarResponse {
	success: boolean
	bookedRanges: BookedRange[]
}

// 2. Annotate the event handler return type
export default defineEventHandler(async (event): Promise<CalendarResponse> => {
	const airbnbIcalUrl = process.env.AIRBNB_ICAL_URL || ""

	const rawData = await $fetch<string>(airbnbIcalUrl)
	const parsed = ical.parseICS(rawData)

	const bookedRanges: BookedRange[] = []

	for (const key in parsed) {
		if (Object.prototype.hasOwnProperty.call(parsed, key)) {
			const item = parsed[key]

			if (item && item.type === "VEVENT" && item.start && item.end) {
				const startDate = new Date(item.start)
				const endDate = new Date(item.end)

				bookedRanges.push({
					start: startDate.toISOString().split("T")[0] as string,
					end: endDate.toISOString().split("T")[0] as string,
					summary: typeof item.summary === "string" ? item.summary : "Not Available"
				})
			}
		}
	}

	return { success: true, bookedRanges }
})
