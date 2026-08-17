<script setup lang="ts">
import { useCookieConsent } from '~/composables/useCookieConsent'
const { showBanner, acceptAll, rejectAll, saveConsent, consent } = useCookieConsent()

const showDetails = ref(false)
const analyticsChecked = ref(consent.value?.analytics ?? false)
const marketingChecked = ref(consent.value?.marketing ?? false)

const savePreferences = () => {
  saveConsent({
    analytics: analyticsChecked.value,
    marketing: marketingChecked.value,
  })
  showDetails.value = false
}
</script>

<template>
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
      class="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white p-4 shadow-lg sm:p-6"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div class="mx-auto max-w-4xl">
        <!-- Simple view -->
        <div v-if="!showDetails" class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-gray-700">
            We use cookies to improve your experience and analyze site usage. You can accept all,
            reject non-essential cookies, or manage your preferences.
          </p>
          <div class="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="showDetails = true"
            >
              Manage
            </button>
            <button
              type="button"
              class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="rejectAll"
            >
              Reject all
            </button>
            <button
              type="button"
              class="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              @click="acceptAll"
            >
              Accept all
            </button>
          </div>
        </div>

        <!-- Detailed preferences view -->
        <div v-else class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <h2 class="text-sm font-semibold text-gray-900">Manage cookie preferences</h2>
            <button
              type="button"
              class="text-sm text-gray-500 hover:text-gray-700"
              @click="showDetails = false"
            >
              Back
            </button>
          </div>

          <div class="space-y-3">
            <div class="flex items-start justify-between gap-4 rounded-md border border-gray-200 p-3">
              <div>
                <p class="text-sm font-medium text-gray-900">Strictly necessary</p>
                <p class="text-xs text-gray-500">Required for the site to function. Always on.</p>
              </div>
              <input type="checkbox" checked disabled class="mt-1 h-4 w-4 rounded border-gray-300 text-gray-400" />
            </div>

            <div class="flex items-start justify-between gap-4 rounded-md border border-gray-200 p-3">
              <div>
                <p class="text-sm font-medium text-gray-900">Analytics</p>
                <p class="text-xs text-gray-500">Helps us understand how the site is used.</p>
              </div>
              <input
                v-model="analyticsChecked"
                type="checkbox"
                class="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
            </div>

            <div class="flex items-start justify-between gap-4 rounded-md border border-gray-200 p-3">
              <div>
                <p class="text-sm font-medium text-gray-900">Marketing</p>
                <p class="text-xs text-gray-500">Used for personalized ads and campaigns.</p>
              </div>
              <input
                v-model="marketingChecked"
                type="checkbox"
                class="mt-1 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
              />
            </div>
          </div>

          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              @click="rejectAll"
            >
              Reject all
            </button>
            <button
              type="button"
              class="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              @click="savePreferences"
            >
              Save preferences
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>