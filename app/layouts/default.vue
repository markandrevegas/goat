<script setup lang="ts">
const { data: menuItems, status } = await useMenu()
</script>

<template>
	<div class="relative min-h-screen overflow-hidden text-white">
		<slot name="bg-video"></slot>

		<div class="relative z-10 flex min-h-screen flex-col">
			<Menu :items="menuItems || []" :loading="status === 'pending'" class="bg-transparent" />

			<main class="flex-grow">
				<slot></slot>
			</main>

			<footer class="border-t border-white/10 bg-black/20 py-6 text-center text-sm text-white/70 backdrop-blur-sm">&copy; {{ new Date().getFullYear() }}</footer>
		</div>
	</div>
</template>
