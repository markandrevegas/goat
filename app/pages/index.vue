<script setup>
import { computed } from "vue"
import Marquee from "~/components/ui/Marquee.vue"
import Goat from "~/components/icons/Goat.vue"

import posterImg from "~/assets/images/ferry-poster.webp"

import ThreeColumns from "~/components/ui/ThreeColumns.vue"
import CardScroller from "~/components/ui/CardScroller.vue"

definePageMeta({
	layout: false
})

const { getLandingPage } = useWordPress()
const { data: page, status, error } = await useAsyncData("wp-index", () => getLandingPage("index-page"))

const landing = computed(() => page.value?.acf || {})

if (import.meta.dev) {
	console.log(landing.value)
}

// 1. First set: 'firstcolumnheader', 'secondcolumnheader', etc.
const standardCards = computed(() => extractColumns(landing.value, ["first", "second", "third", "fourth"]))

// 2. Second set: 'header_one', 'header_two', 'header_three'
const threeColumnItems = computed(() => extractColumns(landing.value, ["one", "two", "three"]))

const featureHeaderSm = computed(() => landing.value?.feature_header_sm || "")
const featureHeaderLg = computed(() => landing.value?.feature_header_lg || "")
const featureImage = computed(() => landing.value?.feature_image || "")
const featureText = computed(() => landing.value?.reservations_text || "")

const seoTitle = computed(() => {
	return page.value?.title?.rendered?.replace("&#8211;", "").trim()
})

/*const excerpt = computed(() => {
	return homePage.value?.excerpt?.rendered
})*/

const seoDescription = computed(() => {
	if (landing.value?.excerpt?.rendered) {
		return landing.value.excerpt.rendered.replace(/<[^>]*>?/gm, "").trim()
	}

	return "Discover our latest articles, insights, and updates."
})

/*const ogImage = computed(() => {
	return homePage.value?.yoast_head_json?.og_image?.[0]?.url || "/default-og.jpg"
})*/

useSeoMeta({
	title: seoTitle,
	titleTemplate: null,
	metaTitle: seoTitle,
	description: seoDescription,
	ogTitle: seoTitle,
	ogDescription: seoDescription,
	ogImage: posterImg,
	ogType: "website",
	twitterCard: "summary_large_image",
	twitterTitle: seoTitle,
	twitterDescription: seoDescription,
	twitterImage: posterImg
})
</script>
<template>
	<NuxtLayout name="default">
		<!--<template #bg-video>
			<IndexVideo :title="seoTitle" :subtitle="seoDescription" />
		</template>-->
		<ThreeColumns :items="threeColumnItems" />
		<!--<Marquee
			:items="[
				{ logo: 'https://placehold.co/64x64', label: 'Acme Corp' },
				{ logo: 'https://placehold.co/64x64', label: 'Globex' },
				{ logo: 'https://placehold.co/64x64', label: 'Initech' }
			]"
			:speed="20"
			class="hidden"
		/>-->
		<FirstRow />
		<ClientOnly>
			<CardScroller :items="standardCards" />
		</ClientOnly>
		<ImageScrollWindow :feature-header-sm="featureHeaderSm" :feature-header-lg="featureHeaderLg" :feature-image="featureImage" :feature-text="featureText" />
		<FerryVideo />
	</NuxtLayout>
</template>
