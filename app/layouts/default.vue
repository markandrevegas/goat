<script setup lang="ts">
import { onMounted } from "vue"
const { loadConsent } = useCookieConsent()
const { data: menuItems, status } = await useWordPressMenu({
	pages: [],
	posts: [1]
})
const resetConsent = () => {
	window.localStorage.removeItem("cookie-consent")
	window.localStorage.removeItem("cookie-consent-timestamp")
	location.reload()
}
onMounted(() => {
	loadConsent()
})
</script>

<template>
	<div class="relative min-h-screen">
		<div v-if="$slots['bg-video']" class="relative min-h-screen w-full overflow-hidden">
			<slot name="bg-video"></slot>
		</div>
		<div class="absolute top-0 right-0 left-0 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
			<ClientOnly>
				<button v-if="import.meta.dev" class="fixed right-2 bottom-2 z-50 rounded bg-black px-3 py-1 text-xs text-white opacity-70 hover:opacity-100" @@click="resetConsent">Reset consent (dev)</button>
				<Menu :items="menuItems || []" />
			</ClientOnly>
		</div>

		<div class="relative z-10 flex min-h-screen flex-col">
			<main class="flex-grow">
				<slot></slot>
			</main>
			<MainFooter />
			<ClientOnly>
				<CookieBanner />
			</ClientOnly>
		</div>
	</div>
</template>
