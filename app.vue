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
		},
		{
			rel: "preload",
			href: "/_fonts/pZrE-slef2USYSteHMofh38tG-0x5V8w3-m5O8o55BA-2lkoGCOmO7jeyF1uZ0eej8W_w9soLdR904X6bIAsF0k.woff2",
			as: "font",
			type: "font/woff2",
			crossorigin: "anonymous"
		},
		{
			rel: "preload",
			href: "/_fonts/pBA_EGUUgytVcAn30G3L7jSPUjTfQBkUF_SVrKXvks4-P8M5mJujzuY5Rvr7oSsGgEy3RgI8I6ZroH9ErPwewNI.woff2",
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
