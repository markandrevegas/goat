<script setup lang="ts">
import moodImg from "~/assets/images/byenspuls.webp"
import posterImg from "~/assets/images/poster.webp"
import PrimaryButton from "~/components/ui/PrimaryButton.vue"
</script>
<template>
	<section class="relative">
		<!-- Background -->
		<div class="sticky top-0 h-[50vh]">
			<img :src="moodImg" loading="lazy" class="block h-[50vh] w-full object-cover" alt="Events" />
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
				<div class="flex max-w-5xl flex-col sm:grid sm:grid-cols-3">
					<img :src="posterImg" loading="lazy" class="mb-6 h-full w-full object-cover" alt="Events" sizes="100vw" />
					<div class="px-4 py-16 sm:col-span-2 sm:px-8">
						<span class="text-center text-sm uppercase">private selskaber</span>
						<h2 class="mt-4 text-4xl font-semibold">Hold jeres selskab på Floating G.O.A.T.</h2>
						<p class="mt-6 text-lg">I kommer i de bedste hænder hos os. Uanset om I ønsker at holde bryllup med de nærmeste, arrangere et foredrag, fejre en fødselsdag eller noget helt fjerde. Vi er klar til at hjælpe jer med at skabe de bedste rammer, så I kan fokusere på jeres gæster.</p>
						<p class="mt-4 mb-6">Priserne starter fra 12.500 kr.</p>
						<PrimaryButton :text="'Reserver nu'" :event-name="'feature_book'" :event-params="{ button_name: 'secondary_cta' }" class="bg-brand text-palladian w-max flex-shrink" />
					</div>
				</div>
			</section>
		</div>
	</section>
</template>
