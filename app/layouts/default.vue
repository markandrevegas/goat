<script setup lang="ts">
const { data: menuItems, status } = await useMenu()
</script>

<template>
	<div class="relative min-h-screen overflow-hidden">
		<div v-if="$slots['bg-video']" class="relative min-h-screen w-full">
			<Menu :items="menuItems || []" :loading="status === 'pending'" class="bg-transparent" />
			<slot name="bg-video"></slot>
		</div>

		<div class="relative z-10 flex min-h-screen flex-col">
			<main class="flex-grow">
				<slot></slot>
			</main>

			<footer class="py-6 text-center text-sm">&copy; {{ new Date().getFullYear() }}</footer>
		</div>
	</div>
</template>
