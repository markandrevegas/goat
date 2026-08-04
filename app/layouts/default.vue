<script setup lang="ts">
const { data: menuItems, status } = await useMenu()
</script>

<template>
	<div class="relative min-h-screen overflow-hidden text-white font-sans">
		<div v-if="$slots['bg-video']" class="relative w-full min-h-screen">
			<Menu :items="menuItems || []" :loading="status === 'pending'" class="bg-transparent" />
      <slot name="bg-video"></slot>
    </div>

		<div class="relative z-10 flex min-h-screen flex-col">
			

			<main class="flex-grow">
				<slot></slot>
			</main>

			<footer class="border-t border-white/10 bg-black/20 py-6 text-center text-sm text-white/70 backdrop-blur-sm">&copy; {{ new Date().getFullYear() }}</footer>
		</div>
	</div>
</template>
