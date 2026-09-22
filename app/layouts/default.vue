<script setup lang="ts"></script>

<template>
	<div class="relative min-h-screen">
		<Menu />
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
