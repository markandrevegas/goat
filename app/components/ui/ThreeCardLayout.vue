<script setup lang="ts">
import PrimaryButton from "./PrimaryButton.vue"
defineProps<{
	acf: Record<string, any>
}>()

const handleDirections = () => {
	const link = document.createElement("a")
	link.href = "/pdfs/Directions.pdf"
	link.download = "Directions.pdf"
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}

const handleCheckIn = () => {
	const link = document.createElement("a")
	link.href = "/pdfs/Checking-in.pdf"
	link.download = "Checking-in.pdf"
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}

const handleGeneralInfo = () => {
	const link = document.createElement("a")
	link.href = "/pdfs/General-Information.pdf"
	link.download = "General-Information.pdf"
	document.body.appendChild(link)
	link.click()
	document.body.removeChild(link)
}
</script>

<template>
	<ClientOnly>
		<section class="text-brand mx-auto flex max-w-6xl flex-col gap-4 md:grid md:grid-cols-3">
			<div class="bg-palladian min-h-48 px-6 pt-6">
				<h3 class="font-display text-3xl text-lg font-semibold">{{ acf?.firstheader }}</h3>
				<p class="mb-4 line-clamp-2 min-h-[2lh]">{{ acf?.firsttext }}</p>
				<PrimaryButton @click="handleDirections" :text="acf?.firstbutton" event-name="download_pdf" :event-params="{ button_name: 'primary_cta' }" />
			</div>
			<div class="bg-palladian min-h-48 px-6 pt-6">
				<h3 class="font-display text-3xl text-lg font-semibold">{{ acf.secondheader }}</h3>
				<p class="mb-4 line-clamp-2 min-h-[2lh]">{{ acf?.secondtext }}</p>
				<PrimaryButton @click="handleCheckIn" :text="acf?.secondbutton" event-name="download_pdf" :event-params="{ button_name: 'primary_cta' }"></PrimaryButton>
			</div>
			<div class="bg-palladian min-h-48 px-6 pt-6">
				<h3 class="font-display text-3xl text-lg font-semibold">{{ acf.thirdheader }}</h3>
				<p class="mb-4 line-clamp-2 min-h-[2lh]">{{ acf?.thirdtext }}</p>
				<PrimaryButton @click="handleGeneralInfo" :text="acf?.thirdbutton" event-name="download_pdf" :event-params="{ button_name: 'primary_cta' }"></PrimaryButton>
			</div>
		</section>
	</ClientOnly>
</template>
