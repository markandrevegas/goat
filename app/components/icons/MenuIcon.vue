<template>
	<div class="hover:bg-accent flex cursor-pointer items-center justify-center rounded-md p-1.5 transition-colors duration-200 select-none" @click="toggle" @mouseenter="isHovering = true" @mouseleave="isHovering = false" role="button" tabindex="0" :aria-expanded="isOpen" aria-label="Toggle Navigation Menu">
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<Motion is="line" v-for="(line, index) in lines" :key="`${line.x1}_${line.x2}_${line.y1}_${line.y2}`" :ref="(el) => (targetList[index] = el)" stroke="currentColor" :x1="line.x1" :y1="line.y1" :x2="line.x2" :y2="line.y2" :transform-origin="variants.transformOrigin[index]" />
		</svg>
	</div>
</template>

<script>
export default {
	name: "MenuIcon"
}
</script>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue"
import { MotionComponent as Motion, useMotion } from "@vueuse/motion"

const props = defineProps({
	isOpen: {
		type: Boolean,
		default: false
	}
})

const emit = defineEmits(["update:isOpen", "click"])

const lines = [
	{ x1: 4, y1: 6, x2: 20, y2: 6 },
	{ x1: 4, y1: 12, x2: 20, y2: 12 },
	{ x1: 4, y1: 18, x2: 20, y2: 18 }
]

const defaultTransition = {
	type: "spring",
	stiffness: 260,
	damping: 20
}

const variants = {
	normal: {
		rotate: 0,
		y: 0,
		opacity: 1
	},
	animate: (i) => ({
		rotate: i === 0 ? 45 : i === 2 ? -45 : 0,
		y: i === 0 ? 6 : i === 2 ? -6 : 0,
		opacity: i === 1 ? 0 : 1,
		transition: defaultTransition
	}),
	transformOrigin: ["12 6", "0 0", "12 18"]
}

const len = lines.length
const targetList = ref(new Array(len).fill(null))
const targetInstanceList = reactive([])

const isHovering = ref(false)

// While closed, hover previews the "X" shape. Once open, it stays "X"
// regardless of hover — hover only matters for the closed -> preview case.
const isActive = computed(() => props.isOpen || isHovering.value)

onMounted(() => {
	for (let i = 0; i < len; i++) {
		targetInstanceList[i] = useMotion(targetList.value[i], {
			initial: isActive.value ? variants.animate(i) : variants.normal
		})
	}
	animateState(isActive.value)
})

function animateState(active) {
	for (let i = 0; i < len; i++) {
		const variant = active ? variants.animate(i) : variants.normal
		const instance = targetInstanceList[i]
		if (instance) {
			instance.apply({
				transition: defaultTransition,
				...variant
			})
		}
	}
}

watch(isActive, (newValue) => {
	animateState(newValue)
})

function toggle() {
	const nextState = !props.isOpen
	emit("update:isOpen", nextState)
	emit("click", nextState)
}
</script>
