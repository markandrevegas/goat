<!-- app/error.vue -->
<script setup lang="ts">
import type { NuxtError } from "#app"

const props = defineProps({
	error: Object as () => NuxtError
})

// Determine if this is a 404 or a server/network 500 error
const is404 = computed(() => props.error?.status === 404)

const title = computed(() => {
	if (is404.value) return "Page Not Found"
	return props.error?.statusCode === 500 ? "Server Error" : "Something Went Wrong"
})

const defaultMessage = computed(() => {
	if (is404.value) return "Sorry, the page you are looking for doesn't exist or has been moved."
	return "We're having trouble connecting to our servers. Please try again in a few moments."
})

const handleError = () => clearError({ redirect: "/" })
</script>

<template>
	<div class="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-6 text-center text-slate-900">
		<span class="mb-4 text-8xl font-black text-indigo-600">
			{{ error?.status || "500" }}
		</span>

		<h1 class="mb-2 text-3xl font-bold">
			{{ title }}
		</h1>

		<p class="mb-8 max-w-md text-slate-600">
			{{ error?.statusText || defaultMessage }}
		</p>

		<button @click="handleError" class="rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white shadow transition hover:bg-indigo-700">Back to Home</button>
	</div>
</template>
