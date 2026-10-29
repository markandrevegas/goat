<script setup lang="ts">
import CookieBanner from "~/components/CookieBanner.vue"

const { resetConsent } = useCookieConsent()

const route = useRoute()
const config = useRuntimeConfig()

const canonicalUrl = computed(() => {
	const rawSiteUrl = (config.public.siteUrl as string) || "https://floatinggoat.dk"
	const siteUrl = rawSiteUrl.replace(/\/+$/, "")
	let path = route.path
	if (path !== "/" && !path.endsWith("/")) {
		path = `${path}/`
	}

	return `${siteUrl}${path}`
})

useHead(() => {
	const siteUrl = ((config.public.siteUrl as string) || "https://floatinggoat.dk").replace(/\/+$/, "")

	const organizationSchema = {
		"@context": "https://schema.org",
		"@type": "Organization",
		"@id": `${siteUrl}/#organization`,
		name: "Floating G.O.A.T.",
		url: siteUrl,
		logo: `${siteUrl}/logo/logo.png`,
		sameAs: ["https://www.instagram.com/floating_goat_cph/", "https://linkedin.com/company/mar-k-waterside ", "https://facebook.com/FloatingGOATCopenhagen"]
	}

	return {
		link: [
			{
				rel: "canonical",
				href: canonicalUrl.value,
				key: "canonical"
			}
		],
		script: [
			{
				key: "ld-organization",
				type: "application/ld+json",
				innerHTML: JSON.stringify(organizationSchema).replace(/</g, "\\u003c")
			}
		]
	}
})
</script>

<template>
	<NuxtLayout>
		<NuxtPage></NuxtPage>
	</NuxtLayout>
	<MainFooter />
	<CookieBanner />
	<button class="fixed right-24 bottom-24 z-50 hidden rounded bg-black px-3 py-1 text-xs text-white opacity-70 hover:opacity-100" @click="resetConsent">Reset consent (dev)</button>
</template>
