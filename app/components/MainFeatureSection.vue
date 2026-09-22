<script setup lang="ts">
import WpImage from "./ui/WpImage.vue"
import SecondaryButton from "./ui/SecondaryButton.vue"
interface Props {
	featureHeaderSm: string
	featureHeaderLg: string
	featureImage: number | string
	featureText: string
	featureButton: string
	featureUrl: string
}
const props = defineProps<Props>()
</script>
<template>
	<section class="flex items-center justify-center pb-8">
		<div class="flex max-w-5xl flex-col flex-col-reverse sm:flex-row sm:items-center">
			<WpImage loading="lazy" v-if="props.featureImage" :image-id="props.featureImage" :alt="props.featureHeaderLg ?? 'Vandets ro og byens puls'" class="block h-[60vh] w-full object-cover" />
			<div class="px-4 py-16 sm:col-span-2 sm:px-8">
				<span class="text-center text-sm uppercase">{{ featureHeaderSm }}</span>
				<h2 class="mt-4 text-3xl font-semibold">{{ featureHeaderLg }}</h2>
				<p class="mt-6 mb-6">{{ featureText }}</p>
				<SecondaryButton :url="featureUrl" :text="featureButton" :event-name="'feature_click'" :event-params="{ button_name: 'secondary_cta' }" class="font-sofia bg-palladian text-brand hover:text-palladian hover:bg-brand px-4 text-xl uppercase" />
			</div>
		</div>
	</section>
</template>
