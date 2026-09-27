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
	<div class="hover:bg-accent flex cursor-pointer items-center justify-center rounded-md p-1.5 transition-colors duration-200 select-none" role="button" tabindex="0" :aria-expanded="isOpen" aria-label="Toggle Navigation Menu" @click="toggle" @mouseenter="isHovering = true" @mouseleave="isHovering = false">
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<line v-for="(line, index) in lines" :key="index" :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2" :class="['transition-all duration-300', index === 0 && isOpen && 'translate-y-[6px] rotate-45', index === 1 && isOpen && 'opacity-0', index === 2 && isOpen && '-translate-y-[6px] -rotate-45', index === 1 && !isOpen && isHovering && 'translate-x-2']" />
		</svg>
	</div>
</template>
