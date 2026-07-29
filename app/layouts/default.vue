<script setup lang="ts">
const { data: menuItems, status } = await useMenu()
</script>

<template>
	<div class="flex min-h-screen flex-col bg-gray-50">
		<Menu :items="menuItems || []" :loading="status === 'pending'" />

		<div class="flex-grow">
			<slot></slot>
		</div>

		<footer class="border-t border-gray-100 bg-white py-6 text-center text-sm text-gray-500">&copy; {{ new Date().getFullYear() }}</footer>
	</div>
</template>
