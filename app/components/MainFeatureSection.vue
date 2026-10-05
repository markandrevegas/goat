<script setup lang="ts">
import WpImage from "./ui/WpImage.vue"
import PrimaryButton from "./ui/PrimaryButton.vue"
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
	<section class="relative flex justify-center md:pt-24 md:pb-16">
		<div class="flex max-w-6xl flex-col-reverse md:flex-row md:items-center">
			<WpImage loading="lazy" v-if="props.featureImage" :image-id="props.featureImage" :alt="props.featureHeaderLg ?? 'Vandets ro og byens puls'" class="block h-[60vh] w-full object-cover" />
			<div class="px-4 py-16 sm:col-span-2 sm:px-8">
				<span class="text-center text-sm uppercase">{{ featureHeaderSm }}</span>
				<h2 class="mt-4 text-3xl font-semibold">{{ featureHeaderLg }}</h2>
				<p class="mt-6 mb-6">{{ featureText }}</p>
				<PrimaryButton :url="featureUrl" :text="featureButton" :event-name="'go_to_simple_meeting'" :event-params="{ button_name: 'index_feature_button' }" class="bg-palladian text-brand hover:bg-brand/80 mb-8 text-2xl uppercase hover:cursor-pointer" />
			</div>
		</div>
	</section>
</template>
