<script setup lang="ts">
const route = useRoute()

const { getPages } = useWordPress()
const { data: menuPages } = await getPages({
	include: ["apartments", "simple-meetings", "private-selskaber", "information-for-guests"],
	exclude: ["privatlivspolitik", "cookiepolitik"]
})
const isGuestInfo = computed(() => route.path === "/information-for-guests")
</script>

<template>
	<div :class="isGuestInfo ? 'bg-brand text-palladian' : 'bg-palladian text-brand'" class="relative min-h-screen overflow-hidden transition-colors duration-300">
		<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
			<Menu :items="menuPages || []" />
		</div>

		<div class="relative z-10 flex h-full flex-col">
			<main class="flex-grow">
				<slot></slot>
			</main>
		</div>
		<MainFooter />
	</div>
</template>
