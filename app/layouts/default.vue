<script setup lang="ts">
import { onMounted } from "vue"

const { loadConsent, resetConsent } = useCookieConsent()
const { getMenu } = useWordPress()
const { data: menuItems, status } = await getMenu({
	pages: [2],
	posts: [1]
})

onMounted(() => {
	loadConsent()
})
</script>

<template>
	<div class="relative min-h-screen">
		<ClientOnly>
			<Menu :items="menuItems || []" />
		</ClientOnly>
		<div v-if="$slots['bg-video']" class="relative min-h-screen w-full overflow-hidden">
			<slot name="bg-video"></slot>
		</div>

		<div class="relative flex min-h-screen flex-col">
			<main class="flex-grow">
				<slot></slot>
			</main>
			<MainFooter />
			<ClientOnly>
				<button class="fixed right-24 bottom-24 z-50 rounded bg-black px-3 py-1 text-xs text-white opacity-70 hover:opacity-100" @click="resetConsent">Reset consent (dev)</button>
				<CookieBanner />
			</ClientOnly>
		</div>
	</div>
</template>