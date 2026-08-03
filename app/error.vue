<!-- app/error.vue -->
<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps({
  error: Object as () => NuxtError
})

// Determine if this is a 404 or a server/network 500 error
const is404 = computed(() => props.error?.status === 404)

const title = computed(() => {
  if (is404.value) return 'Page Not Found'
  return props.error?.statusCode === 500 ? 'Server Error' : 'Something Went Wrong'
})

const defaultMessage = computed(() => {
  if (is404.value) return "Sorry, the page you are looking for doesn't exist or has been moved."
  return "We're having trouble connecting to our servers. Please try again in a few moments."
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50 text-slate-900">
    <span class="text-8xl font-black text-indigo-600 mb-4">
      {{ error?.status || '500' }}
    </span>
    
    <h1 class="text-3xl font-bold mb-2">
      {{ title }}
    </h1>
    
    <p class="text-slate-600 mb-8 max-w-md">
      {{ error?.statusText || defaultMessage }}
    </p>

    <button
      @click="handleError"
      class="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
    >
      Back to Home
    </button>
  </div>
</template>