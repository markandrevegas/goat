<script setup lang="ts">
import { onMounted } from "vue"
import { useCookieConsent } from "~/app/plugins/cookie-consent.client"
useHead({
	link: [
		{
			rel: "preload",
			href: "/_fonts/HgJel4iAS5mDVqJaDUYKmxaMJg4zKHTGmyD1FQkOsTM-2hVuuQIZ4GSGMgNv6dvlqz7cfD6lr7xLohUph7OCgFg.woff2",
			as: "font",
			type: "font/woff2",
			crossorigin: "anonymous"
		}
	]
})
</script>

<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>

	<ClientOnly>
		<!--<button class="fixed right-24 bottom-24 z-50 hidden rounded bg-black px-3 py-1 text-xs text-white opacity-70 hover:opacity-100" @click="resetConsent">Reset consent (dev)</button>-->
		<CookieBanner />
	</ClientOnly>
</template>
