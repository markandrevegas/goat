<script setup lang="ts">
import CookieBanner from "~/components/CookieBanner.vue"

const { resetConsent } = useCookieConsent()

const route = useRoute()
const config = useRuntimeConfig()

const canonicalUrl = computed(() => {
	const rawSiteUrl = (config.public.siteUrl as string) || "https://floatinggoat.dk"
	const siteUrl = rawSiteUrl.replace(/\/+\$/, "")
	const path = route.path === "/" ? "" : route.path.replace(/\/+\$/, "")

	return `${siteUrl}${path}`
})

useHead({
	link: [
		{
			rel: "canonical",
			href: canonicalUrl,
			key: "canonical"
		}
	]
})
</script>

<template>
	<NuxtLayout>
		<NuxtPage
			:transition="{
				name: 'page',
				mode: 'default'
			}"
		/>
	</NuxtLayout>
	<CookieBanner />
	<button class="fixed right-24 bottom-24 z-50 hidden rounded bg-black px-3 py-1 text-xs text-white opacity-70 hover:opacity-100" @click="resetConsent">Reset consent (dev)</button>
</template>
