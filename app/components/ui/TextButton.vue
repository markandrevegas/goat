<script setup lang="ts">
import { useTrackEvent } from "~/composables/useTrackEvent"

const props = defineProps<{
	text?: string
	eventName: string
	eventParams?: Record<string, any>
	url?: string
	icon?: string
	iconPos?: "left" | "right"
}>()

const emit = defineEmits<{
	click: [event: MouseEvent]
}>()

const { trackEvent } = useTrackEvent()

const handleButtonClick = async (event: MouseEvent) => {
	emit("click", event)

	if (props.url) {
		const isExternal = props.url.startsWith("http://") || props.url.startsWith("https://")
		await navigateTo(props.url, {
			external: isExternal
		})
	}

	try {
		trackEvent(props.eventName, props.eventParams ?? {})
	} catch (e) {
		console.error("trackEvent failed:", e)
	}
}
</script>

<template>
	<button @click="handleButtonClick" type="button" class="text-brand inline-flex items-center gap-1.5 p-0 leading-4">
		<slot name="icon" v-if="iconPos !== 'right'">
			<Icon v-if="icon" :name="icon" class="h-4 w-4 shrink-0" />
		</slot>
		<slot>{{ text }}</slot>
		<slot name="icon" v-if="iconPos === 'right'">
			<Icon v-if="icon" :name="icon" class="h-4 w-4 shrink-0" />
		</slot>
	</button>
</template>
