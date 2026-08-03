<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: Object as () => NuxtError
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-gray-50 dark:bg-brand text-gray-900 dark:text-white">
    <span class="text-8xl font-black text-brand dark:text-gray-200 mb-4">
      {{ error?.statusCode || '404' }}
    </span>
    
    <h1 class="text-3xl font-bold mb-2">
      {{ error?.statusCode === 404 ? 'Page Not Found' : 'An error occurred' }}
    </h1>
    
    <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
      {{ error?.message || "Sorry, the page you are looking for doesn't exist or has been moved." }}
    </p>

    <button
      @click="handleError"
      class="px-6 py-3 bg-brand text-white dark:bg-white dark:text-brand font-semibold rounded-lg shadow hover:opacity-90 transition"
    >
      Back to Home
    </button>
  </div>
</template>