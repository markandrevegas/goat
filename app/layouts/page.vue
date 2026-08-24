<script setup lang="ts">
const {
	data: menuItems,
	status,
	error
} = await useWordPressMenu({
	pages: [],
	posts: [1, 5]
})
</script>

<template>
	<div class="relative min-h-screen overflow-hidden">
		<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
			<Menu :items="menuItems || []" />
		</div>

		<div class="relative z-10 flex min-h-screen flex-col pt-24">
			<main class="flex-grow">
				<slot></slot>
			</main>

			<MainFooter />
		</div>
	</div>
</template>
