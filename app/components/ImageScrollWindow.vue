<script setup lang="ts">
import moodImg from "~/assets/images/byenspuls.webp"
import posterImg from "~/assets/images/poster.webp"
import PrimaryButton from "~/components/ui/PrimaryButton.vue"
import WpImage from "~/components/ui/WpImage.vue"

interface Props {
	featureHeaderSm: string
	featureHeaderLg: string
	featureImage: number | string
	featureText: string
}

const props = defineProps<Props>()
</script>
<template>
	<section class="relative">
		<!-- Background -->
		<div class="sticky top-0 h-[60vh]">
			<img :src="moodImg" loading="lazy" class="block h-[60vh] w-full object-cover" alt="Events" />
			<div class="absolute inset-0 bg-black/30" />
		</div>

		<!-- Foreground -->
		<div class="relative z-10 -mt-[50vh]">
			<section class="text-palladian flex h-[50vh] items-center justify-center px-6">
				<div class="max-w-2xl text-center">
					<h2 class="text-5xl">Vandets ro og byens puls</h2>
				</div>
			</section>

			<section class="bg-brand text-palladian flex min-h-screen items-center justify-center pb-8">
				<div class="flex max-w-5xl flex-col sm:flex-row sm:items-center">
					<WpImage v-if="props.featureImage" :image-id="props.featureImage" :alt="props.featureHeaderLg ?? 'Vandets ro og byens puls'" class="block h-[60vh] w-full object-cover" />
					<div class="px-4 py-16 sm:col-span-2 sm:px-8">
						<span class="text-center text-sm uppercase">{{ featureHeaderSm }}</span>
						<h2 class="mt-4 text-3xl font-semibold">{{ featureHeaderLg }}</h2>
						<p class="mt-6 mb-6">{{ featureText }}</p>
						<PrimaryButton :text="'Reserver nu'" :event-name="'feature_book'" :event-params="{ button_name: 'secondary_cta' }" />
					</div>
				</div>
			</section>
		</div>
	</section>
</template>
