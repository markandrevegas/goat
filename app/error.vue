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
		<div class="error-container flex h-screen flex-col items-center justify-center">
			<template v-if="is404">
				<h1 class="font-display mb-2 text-4xl">{{ error.status || 404 }}</h1>
				<p class="max-w-[320px] text-center">Vi kunne ikke finde den side, det indlæg eller det produkt, du leder efter.</p>
			</template>

			<template v-else>
				<h1 class="font-display mb-2 text-4xl">{{ error.status || 500 }}</h1>
				<p class="text-lg">Der opstod en fejl på serveren. Prøv igen senere.</p>
				<p v-if="error.statusText" class="error-details">
					{{ error.statusText }}
				</p>
			</template>

			<button @click="handleError" class="bg-palladian text-brand hover:bg-brand hover:text-palladian mt-8 w-max rounded px-3 py-2 font-medium transition-colors duration-400">Tilbage til forsiden</button>
		</div>
	</NuxtLayout>
</template>
