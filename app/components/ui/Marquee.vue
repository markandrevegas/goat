<script setup lang="ts">
interface MarqueeItem {
	logo: string
	label: string
}

interface Props {
	items: MarqueeItem[]
	speed?: number
	pauseOnHover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
	speed: 20,
	pauseOnHover: true,
})

const loopItems = computed(() => [...props.items, ...props.items])
</script>

<template>
	<div class="bg-white pt-16 pb-24">
		<div class="px-4">
			<h2 class="font-display mb-8 text-center uppercase">former clients</h2>
			<div class="relative mx-auto w-full max-w-3xl overflow-hidden">
				<div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-white to-transparent" />
				<div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-white to-transparent" />
				<div
						class="marquee-track flex w-max items-center gap-12 animate-marquee"
						:class="{ 'pause-on-hover': pauseOnHover }"
						:style="{ animationDuration: `${speed}s` }"
					>
						<div v-for="(item, index) in loopItems" :key="index" class="flex shrink-0 items-center gap-2">
							<img :src="item.logo" :alt="item.label" class="h-8 w-8 object-contain" />
							<span class="text-sm font-medium whitespace-nowrap text-gray-700">{{ item.label }}</span>
						</div>
					</div>
			</div>
		</div>
	</div>
</template>
