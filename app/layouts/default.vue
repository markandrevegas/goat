<script setup lang="ts">
const { data: menuItems, status } = await useWordPressMenu({
	pages: [],
	posts: [1]
})
</script>

<template>
	<div class="relative min-h-screen">
		<div v-if="$slots['bg-video']" class="relative min-h-screen w-full overflow-hidden">
			<slot name="bg-video"></slot>
		</div>
		<div class="absolute top-0 right-0 left-0 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
			<ClientOnly>
				<Menu :items="menuItems || []" />
			</ClientOnly>
		</div>

		<div class="relative z-10 flex min-h-screen flex-col">
			<main class="flex-grow">
				<slot></slot>
			</main>
			<ClientOnly>
				<CookieBanner />
			</ClientOnly>
			<MainFooter />
		</div>
	</div>
</template>
