<script setup lang="ts">
import { ref, watch } from "vue"
import { useCookieConsent } from "~/composables/useCookieConsent"
import OpenSettings from "~/components/icons/OpenSettings.vue"

const { showBanner, acceptAll, rejectAll, saveConsent, analyticsGranted, marketingGranted } = useCookieConsent()

const showDetails = ref(false)
const analyticsChecked = ref(false)
const marketingChecked = ref(false)

watch(
	[analyticsGranted, marketingGranted, showDetails],
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
	<ClientOnly>
		<Teleport to="body">
			<Transition 
				enter-active-class="transition ease-out duration-300" 
				enter-from-class="translate-y-full opacity-0" 
				enter-to-class="translate-y-0 opacity-100" 
				leave-active-class="transition ease-in duration-200" 
				leave-from-class="translate-y-0 opacity-100" 
				leave-to-class="translate-y-full opacity-0"
			>
				<div 
					v-if="showBanner" 
					class="fixed inset-x-0 bottom-0 z-[9999] border-t border-gray-200 bg-palladian p-8 text-sm text-brand shadow-lg sm:p-6" 
					role="dialog" 
					aria-live="polite" 
					aria-label="Cookie consent"
				>
					<div class="mx-auto max-w-4xl">
						<div v-if="!showDetails" class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
							<div class="sm:max-w-xl">
								<p class="mb-4 text-brand">Vi bruger cookies til at forbedre din oplevelse og analysere brugen af siden. Du kan acceptere alle cookies, afvise ikke-nødvendige cookies eller administrere dine præferencer.</p>
								<button type="button" @click="showDetails = true" class="flex items-center gap-2 font-semibold text-left">
									Indstillinger<span><OpenSettings :size="12" /></span>
								</button>
							</div>

							<div class="mt-4 flex shrink-0 gap-4 sm:mt-0">
								<button type="button" aria-label="Reject all" class="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50" @click="rejectAll">Afvis</button>
								<button type="button" aria-label="Accept all" class="rounded-md bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800" @click="acceptAll">Accepter</button>
							</div>
						</div>

						<!-- Detailed preferences view -->
						<div v-else class="flex flex-col gap-4">
							<div class="flex items-center justify-between">
								<h2 class="font-sans font-semibold">Administrer cookiepræferencer</h2>
								<button type="button" aria-label="Go back" class="text-sm text-gray-500 hover:text-gray-700" @click="showDetails = false">Tilbage</button>
							</div>

							<div class="space-y-3">
								<div class="flex items-start justify-between gap-4">
									<div>
										<p class="font-medium text-gray-900">Nødvendige</p>
										<p class="text-sm text-gray-500">Nødvendige for, at siden fungerer. Altid aktiveret.</p>
									</div>
									<input type="checkbox" checked disabled class="mt-1 h-4 w-4 rounded border-gray-300 text-gray-400" />
								</div>

								<div class="flex items-start justify-between gap-4">
									<div>
										<p class="font-medium text-gray-900">Analytics</p>
										<p class="text-sm text-gray-500">Hjælper os med at forstå, hvordan siden bruges.</p>
									</div>
									<input v-model="analyticsChecked" type="checkbox" class="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
								</div>

								<div class="flex items-start justify-between gap-4">
									<div>
										<p class="font-medium text-gray-900">Marketing</p>
										<p class="text-sm text-gray-500">Bruges til personaliserede annoncer og kampagner.</p>
									</div>
									<input v-model="marketingChecked" type="checkbox" class="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900" />
								</div>
							</div>

							<div class="flex justify-between gap-2 py-8 sm:justify-end">
								<button type="button" aria-label="Reject all" class="rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 hover:bg-gray-50" @click="rejectAll">Afvis alle</button>
								<button type="button" aria-label="Save your settings" class="rounded-md bg-gray-900 px-4 py-2 font-medium text-white hover:bg-gray-800" @click="savePreferences">Gem præferencer</button>
							</div>
						</div>
					</div>
				</div>
			</Transition>
		</Teleport>
	</ClientOnly>
</template>