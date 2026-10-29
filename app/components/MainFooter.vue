<script setup lang="ts">
import { useCookieConsent } from "~/composables/useCookieConsent"

import Social from "./ui/Social.vue"
import Popup from "./icons/Popup.vue"
import TextButton from "./ui/TextButton.vue"
const { getPages } = useWordPress()
const { openBanner } = useCookieConsent()

const {
	data: footerPages,
	status,
	error
} = await getPages({
	include: ["terms-and-conditions", "privacy-policy", "about-us"],
	exclude: []
})

const pageItems = computed(() => {
	const list = unref(footerPages)
	if (!list || !Array.isArray(list)) return []

	return list.map((item) => {
		if (item.slug === "information-for-guests") {
			return {
				...item,
				title: { ...item.title, rendered: "Information for guests" }
			}
		}
		return item
	})
})

const isDev = import.meta.dev
</script>

<template>
	<LazyClientOnly>
		<footer class="text-sm/7">
			<div class="grid flex-shrink-0 grid-cols-1 gap-8 p-8 py-24 sm:mx-auto sm:max-w-6xl sm:grid-cols-2 md:grid-cols-4">
				<div class="flex flex-col gap-1">
					<p class="font-display mb-2 text-lg font-semibold">Floating G.O.A.T.</p>
					<p>Langebrogade 1C<br />1411 København K<br />CVR: 44307987</p>
				</div>
				<div class="flex flex-col">
					<p class="font-display mb-2 text-lg font-semibold">Contact</p>
					<p>
						info@floatinggoat.dk<br />
						Phone hours: Weekdays 9-18<br />
						+45 30104262
					</p>
				</div>
				<div class="flex flex-col">
					<p class="font-display mb-2 text-lg font-semibold">Information</p>
					<div v-if="status === 'pending'" class="text-center text-sm">Pending</div>
					<div v-else-if="error" class="text-center text-sm text-red-600">Error</div>
					<ul v-else-if="pageItems.length" class="list-reset">
						<li class="w-max"><a href="https://floatinggoat.dk/sitemap_index.xml" target="_blank" class="text-palladian w-max font-semibold transition-opacity duration-400 hover:border-b-2">Sitemap</a></li>
						<li v-for="item in pageItems" :key="item.id" class="w-max">
							<NuxtLink :to="`/${item.slug}`" class="w-max font-semibold transition-opacity duration-400 hover:border-b-2" v-html="item.title.rendered"></NuxtLink>
						</li>
						<li v-if="isDev" class="w-max"><a href="/posts" class="text-palladian w-max font-semibold transition-opacity duration-400 hover:border-b-2">Blog</a></li>
						<li class="w-max">
							<TextButton @click="openBanner" iconPos="right" :event-name="'open_cookie_settings'" :text="'Open cookie settings'" aria-haspopup="dialog" aria-expanded="false" aria-controls="cookie-settings-modal" class="text-palladian w-max pb-0 font-semibold transition-opacity duration-400 hover:border-b-2">
								<template #icon>
									<Popup />
								</template>
							</TextButton>
						</li>
					</ul>
				</div>
				<div class="flex flex-col">
					<p class="font-display mb-2 text-lg font-semibold">Find us</p>
					<Social class="max-content mr-auto" />
				</div>
			</div>
			<div class="py-8 text-center">&copy; {{ new Date().getFullYear() }} Floating G.O.A.T.</div>
		</footer>
	</LazyClientOnly>
</template>
