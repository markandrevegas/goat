<script setup lang="ts">
import { ref, watch, onMounted } from "vue"
import { useCookieConsent } from "~/composables/useCookieConsent"
import OpenSettings from "~/components/icons/OpenSettings.vue"

const { showBanner, acceptAll, rejectAll, saveConsent, analyticsGranted, marketingGranted, loadConsent } = useCookieConsent()

const showDetails = ref(false)
const analyticsChecked = ref(false)
const marketingChecked = ref(false)

onMounted(() => {
	loadConsent()
})

watch(
	[analyticsGranted, marketingGranted],
	() => {
		analyticsChecked.value = analyticsGranted.value
		marketingChecked.value = marketingGranted.value
	},
	{ immediate: true }
)

const savePreferences = () => {
	saveConsent({
		analytics: analyticsChecked.value,
		marketing: marketingChecked.value
	})
	showDetails.value = false
}
</script>

<template>
	<div v-if="showBanner" class="bg-palladian text-brand fixed inset-x-0 bottom-0 z-[9999] border-t border-gray-200 p-8 text-sm shadow-lg sm:p-6" role="dialog" aria-live="polite" aria-label="Cookie consent">
		<div class="mx-auto max-w-4xl">
			<div v-if="!showDetails" class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
				<div class="sm:max-w-xl">
					<p class="text-brand mb-4">We use cookies to improve your experience and analyze how the site is used. You can accept all cookies, decline non-essential cookies, or manage your preferences.</p>
					<button type="button" @click="showDetails = true" class="flex items-center gap-2 text-left font-semibold">
						Settings<span><OpenSettings :size="12" /></span>
					</button>
				</div>

				<div class="mt-4 flex shrink-0 gap-4 sm:mt-0">
					<button type="button" aria-label="Reject all" class="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50" @click="rejectAll">Reject</button>
					<button type="button" aria-label="Accept all" class="rounded-md bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800" @click="acceptAll">Accept</button>
				</div>
			</div>

			<div v-else class="flex flex-col gap-4">
				<div class="flex items-center justify-between">
					<h2 class="font-sans font-semibold">Manage cookie preferences</h2>
					<button type="button" aria-label="Go back" class="text-sm text-gray-500 hover:text-gray-700" @click="showDetails = false">Back</button>
				</div>

				<div class="space-y-3">
					<div class="flex items-start justify-between gap-4">
						<div>
							<p class="font-medium text-gray-900">Necessary</p>
							<p class="text-sm text-gray-500">Required for the site to function. Always enabled.</p>
						</div>
						<input type="checkbox" checked disabled class="mt-1 h-4 w-4 rounded border-gray-300 text-gray-400" />
					</div>

					<div class="flex items-start justify-between gap-4">
						<div>
							<p class="font-medium text-gray-900">Analytics</p>
							<p class="text-sm text-gray-500">Helps us understand how the site is used.</p>
						</div>
						<input v-model="analyticsChecked" type="checkbox" class="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
					</div>

					<div class="flex items-start justify-between gap-4">
						<div>
							<p class="font-medium text-gray-900">Marketing</p>
							<p class="text-sm text-gray-500">Used for personalized ads and campaigns.</p>
						</div>
						<input v-model="marketingChecked" type="checkbox" class="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
					</div>
				</div>

				<div class="flex justify-between gap-2 py-8 sm:justify-end">
					<button type="button" aria-label="Reject all" class="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50" @click="rejectAll">Reject</button>
					<button type="button" aria-label="Save your settings" class="rounded-md bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800" @click="savePreferences">Save settings</button>
				</div>
			</div>
		</div>
	</div>
</template>
