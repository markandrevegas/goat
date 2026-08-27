<!-- ~/error.vue -->
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
		<div class="error-container">
			<template v-if="is404">
				<h1>404 - Page Not Found</h1>
				<p>The WordPress post, page, or product you are looking for does not exist.</p>
			</template>

			<template v-else>
				<h1>{{ error.status || 500 }} - Something Went Wrong</h1>
				<p>Our servers (or WordPress API) encountered an issue. Please try again later.</p>
				<p v-if="error.statusText" class="error-details">
					{{ error.statusText }}
				</p>
			</template>

			<button @click="handleError">Return Home</button>
		</div>
	</NuxtLayout>
</template>
