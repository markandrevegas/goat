<script setup lang="ts">
import CookieBanner from "~/components/CookieBanner.vue"

const { resetConsent } = useCookieConsent()
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
	<CookieBanner />
	<button class="fixed right-24 bottom-24 z-50 hidden rounded bg-black px-3 py-1 text-xs text-white opacity-70 hover:opacity-100" @click="resetConsent">Reset consent (dev)</button>
</template>
