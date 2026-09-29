<script setup>
import { ref } from "vue"

const props = defineProps({
	isOpen: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(["update:isOpen", "click"])

const isHovering = ref(false)

const lines = [
	{ x1: 4, y1: 6, x2: 20, y2: 6 },
	{ x1: 4, y1: 12, x2: 20, y2: 12 },
	{ x1: 4, y1: 18, x2: 20, y2: 18 }
]

function toggle() {
	const nextState = !props.isOpen

	emit("update:isOpen", nextState)
	emit("click", nextState)
}
</script>
<template>
	<div class="hover:bg-accent flex cursor-pointer items-center justify-center rounded-md p-1.5 transition-colors duration-200 select-none" role="button" tabindex="0" :aria-expanded="isOpen" :aria-label="isOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'" @click="toggle" @keydown.enter.prevent="toggle" @keydown.space.prevent="toggle" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
		<!-- Burger -->
		<svg v-if="!isOpen" key="burger" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<line x1="4" y1="6" x2="20" y2="6" />
			<line x1="4" y1="12" x2="20" y2="12" :class="['transition-transform duration-300', isHovering && 'translate-x-2']" />
			<line x1="4" y1="18" x2="20" y2="18" />
		</svg>

		<!-- Close X -->
		<svg v-else key="close" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
			<path :class="{ 'draw-x': isHovering }" fill="none" stroke="currentColor" stroke-dasharray="12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 12l7 7M12 12l-7 -7M12 12l-7 7M12 12l7 -7" />
		</svg>
	</div>
</template>
<style scoped>
@keyframes draw-x {
	from {
		stroke-dashoffset: 12;
	}
	to {
		stroke-dashoffset: 0;
	}
}
.draw-x {
	animation: draw-x 0.6s ease-out;
}
</style>
