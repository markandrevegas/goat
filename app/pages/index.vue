<script setup lang="ts">
import { computed, onMounted } from "vue"

import TrustindexWidget from "~/components/ui/TrustindexWidget.vue"
import posterImg from "~/assets/images/ferry-poster.webp"
import VideoHeader from "~/components/ui/VideoHeader.vue"
import Marquee from "~/components/ui/Marquee.vue"
import ThreeColumns from "~/components/ui/ThreeColumns.vue"
import CenterAlignedFeature from "~/components/CenterAlignedFeature.vue"

const trustindexRef = ref<HTMLElement | null>(null)
const shouldLoadReviews = ref(false)

definePageMeta({
	layout: 'default'
})

const { getLandingPage } = useWordPress()
const { data: page, status, error } = await useAsyncData("wp-index", () => getLandingPage("index-page"))

const landing = computed(() => page.value?.acf || {})
const layoutStyle = computed(() => landing.value?.layoutstyle)
const stateLayoutStyle = useLayoutStyle()
watch(
	layoutStyle,
	(val) => {
		stateLayoutStyle.value = val || null
	},
	{ immediate: true }
)
const showReviews = computed(() => {
	const value = landing.value?.show_reviews
	return value === "true" || value === true
})

const videoHeaderVideoUrl = computed(() => landing.value?.video_header_video_url || "")
const videoHeaderPoster = computed(() => landing.value?.video_header_video_poster || "")

const videoHeaderTitle = computed(() => landing.value?.video_header_title || "")
const videoHeaderExcerpt = computed(() => landing.value?.video_header_excerpt || "")
const videoHeaderPrimaryButton = computed(() => landing.value?.video_header_primary_button || "")
const videoHeaderPrimaryButtonUrl = computed(() => landing.value?.video_header_primary_button_url || "")
const videoHeaderSecondaryButton = computed(() => landing.value?.video_header_secondary_button || "")
const videoHeaderSecondaryButtonUrl = computed(() => landing.value?.video_header_secondary_button_url || "")
const videoHeaderTertiaryButton = computed(() => landing.value?.video_header_tertiary_button || "")
const videoHeaderTertiaryButtonUrl = computed(() => landing.value?.video_header_tertiary_button_url || "")

// 1. First set: 'firstcolumnheader', 'secondcolumnheader', etc.
/*const standardCards = computed(() => extractColumns(landing.value, ["first", "second", "third", "fourth"]))*/

// 2. Second set: 'header_one', 'header_two', 'header_three'
const threeColumnItems = computed(() => extractColumns(landing.value, ["one", "two", "three"]))

const featureHeaderSm = computed(() => landing.value?.feature_header_sm || "")
const featureHeaderLg = computed(() => landing.value?.feature_header_lg || "")
const featureImage = computed(() => landing.value?.feature_image || "")
const featureUrl = computed(() => landing.value?.feature_url || "")
const featureButton = computed(() => landing.value?.feature_button || "")
const featureText = computed(() => landing.value?.feature_text || "")

const businessLoungeHeaderSm = computed(() => landing.value?.business_lounge_header_sm)
const businessLoungeHeader = computed(() => landing.value?.business_lounge_header)
const businessLoungeText = computed(() => landing.value?.business_lounge_text)
const businessLoungeButton = computed(() => landing.value?.business_lounge_button)
const businessLoungeUrl = computed(() => landing.value?.business_lounge_url)

const centeredFeatureHeader = computed(() => landing.value?.centered_feature_header)
const centeredFeatureText = computed(() => landing.value?.centered_feature_text)

const seoTitle = computed(() => {
	return page.value?.yoast_head_json?.title
})

const ogImage = computed(() => {
	return page.value?.yoast_head_json?.og_image?.[0]?.url || "/default-og.jpg"
})

const seoDescription = computed(() => {
	return page.value?.yoast_head_json?.description
})

useHead({
	link: [{ rel: "canonical", href: "https://floatinggoat.dk/" }]
})
useSeoMeta({
	title: seoTitle,
	titleTemplate: null,
	description: seoDescription,
	ogTitle: seoTitle,
	ogDescription: seoDescription,
	ogImage: ogImage,
	ogType: "website",
	twitterCard: "summary_large_image",
	twitterTitle: seoTitle,
	twitterDescription: seoDescription,
	twitterImage: ogImage
})

onMounted(() => {
	const observer = new IntersectionObserver(
		([entry]) => {
			if (entry?.isIntersecting) {
				shouldLoadReviews.value = true
				observer.disconnect()
			}
		},
		{ rootMargin: "200px" }
	)
	if (trustindexRef.value) observer.observe(trustindexRef.value)
})

if (import.meta.dev && import.meta.client) {
	console.log(landing.value)
}
</script>
<template>
	<NuxtLayout>
		<template v-if="layoutStyle === 'video'" #bg-video>
			<VideoHeader :title="videoHeaderTitle" :excerpt="videoHeaderExcerpt" :videoUrl="videoHeaderVideoUrl" :posterUrl="videoHeaderPoster" :primaryButtonText="videoHeaderPrimaryButton" :primaryButtonUrl="videoHeaderPrimaryButtonUrl" :secondaryButtonText="videoHeaderSecondaryButton" :secondaryButtonUrl="videoHeaderSecondaryButtonUrl" :tertiaryButtonText="videoHeaderTertiaryButton" :tertiaryButtonUrl="videoHeaderTertiaryButtonUrl" />
		</template>

		<LazyCenterAlignedFeature :header="centeredFeatureHeader" :text="centeredFeatureText" />

		<LazyMainFeatureSection :feature-header-sm="featureHeaderSm" :feature-header-lg="featureHeaderLg" :feature-image="featureImage" :feature-text="featureText" :feature-button="featureButton" :feature-url="featureUrl" />

		<ThreeColumns v-if="threeColumnItems.length" :items="threeColumnItems" />

		<Marquee folder="clients" :speed="40" />

		<div ref="trustindexRef">
			<TrustindexWidget v-if="showReviews === true && shouldLoadReviews" />
		</div>

		<LazyFerryVideo :header="businessLoungeHeader" :header-sm="businessLoungeHeaderSm" :text="businessLoungeText" :url="businessLoungeUrl" :button="businessLoungeButton" />
	</NuxtLayout>
</template>
