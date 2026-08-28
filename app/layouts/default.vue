<script setup lang="ts">
import { onMounted } from "vue"

const { getMenu } = useWordPress()
const {
	data: menuItems,
	status,
	error
} = await getMenu({
	pages: ["apartments", "simple-meetings", "private-selskaber", "information-for-guests"],
	excludePages: ["privacy-policy"]
})
if (menuItems.value) {
	menuItems.value = menuItems.value.map((item) => {
		if (item.slug === "information-for-guests") {
			return {
				...item,
				title: {
					...item.title,
					rendered: "Information for guests"
				}
			}
		}
		return item
	})
}

const { loadConsent, resetConsent } = useCookieConsent()

onMounted(() => {
	loadConsent()
})
</script>

<template>
	<div class="relative min-h-screen">
		<ClientOnly>
			<Menu />
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
				<button class="fixed right-24 bottom-24 z-50 hidden rounded bg-black px-3 py-1 text-xs text-white opacity-70 hover:opacity-100" @click="resetConsent">Reset consent (dev)</button>
				<CookieBanner />
			</ClientOnly>
		</div>
	</div>
</template>
