<script setup lang="ts">
import { onMounted } from "vue"

const { getPages } = useWordPress()
const { data: menuPages } = await getPages({
	include: ["apartments", "simple-meetings", "private-selskaber", "information-for-guests"],
	exclude: ["privacy-policy", "terms-of-service"]
})
if (menuPages.value) {
	menuPages.value = menuPages.value.map((item) => {
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
		</div>
	</div>
</template>
