<script setup lang="ts">
const { getPages } = useWordPress()
const { data: menuPages } = await getPages({
	include: ["apartments", "simple-meetings", "private-selskaber", "information-for-guests"],
	exclude: ["privatlivspolitik", "cookiepolitik"]
})
</script>

<template>
	<div class="relative min-h-screen overflow-hidden">
		<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
			<Menu :items="menuPages || []" />
		</div>

		<div class="relative z-10 flex min-h-screen flex-col">
			<main class="flex-grow">
				<slot></slot>
			</main>

			<MainFooter />
		</div>
	</div>
</template>
