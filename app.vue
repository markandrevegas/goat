<script setup lang="ts"></script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>

	<ClientOnly>
		<!--<button class="fixed right-24 bottom-24 z-50 hidden rounded bg-black px-3 py-1 text-xs text-white opacity-70 hover:opacity-100" @click="resetConsent">Reset consent (dev)</button>-->
		<CookieBanner />
	</ClientOnly>
</template>
