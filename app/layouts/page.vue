<script setup lang="ts">
const { data: menuItems, status } = await useMenu()
</script>

<template>
	<div class="relative min-h-screen overflow-hidden">
		<div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
			<PageMenu :items="menuItems || []" :loading="status === 'pending'" class="bg-transparent" />
		</div>

		<div class="relative z-10 flex min-h-screen flex-col">
			<main class="flex-grow">
				<slot></slot>
			</main>

			<MainFooter />
		</div>
	</div>
</template>
