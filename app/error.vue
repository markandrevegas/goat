<script setup lang="ts">
import type { NuxtError } from "#app"

const props = defineProps<{
	error: NuxtError
}>()

const is404 = computed(() => props.error.status === 404)

const handleError = () => {
	clearError({ redirect: "/" })
}
</script>

<template>
	<NuxtLayout>
		<div class="error-container flex flex-col justify-center items-center h-screen">
			<template v-if="is404">
				<h1 class="text-4xl font-display mb-2">{{ error.status || 404 }}</h1>
				<p class="max-w-[320px] text-center">Vi kunne ikke finde den side, det indlæg eller det produkt, du leder efter.</p>
			</template>

			<template v-else>
				<h1 class="text-4xl font-display mb-2">{{ error.status || 500 }}</h1>
				<p class="text-lg">Der opstod en fejl på serveren. Prøv igen senere.</p>
				<p v-if="error.statusText" class="error-details">
					{{ error.statusText }}
				</p>
			</template>

			<button @click="handleError" class="mt-8 bg-palladian text-brand hover:bg-brand hover:text-palladian w-max rounded px-3 py-2 font-medium transition-colors duration-400">Return Home</button>
		</div>
	</NuxtLayout>
</template>
