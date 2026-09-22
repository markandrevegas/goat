<script setup>
import { computed } from "vue"
import Marquee from "~/components/ui/Marquee.vue"
import TrustindexWidget from "~/components/ui/TrustindexWidget.vue"
import posterImg from "~/assets/images/ferry-poster.webp"
import ThreeColumns from "~/components/ui/ThreeColumns.vue"
import CardScroller from "~/components/ui/CardScroller.vue"
import Goat from "~/components/icons/Goat.vue"
import VideoHeader from "~/components/ui/VideoHeader.vue"
import ImageScrollWindow from "~/components/ImageScrollWindow.vue"
import FirstRow from "~/components/FirstRow.vue"

definePageMeta({
	layout: false
})

const { getLandingPage } = useWordPress()
const { data: page, status, error } = await useAsyncData("wp-index", () => getLandingPage("index-page"))

const landing = computed(() => page.value?.acf || {})
const showReviews = computed(() => {
	const value = landing.value?.show_reviews
	return value === 'true' || value === true
})
if (import.meta.dev) {
	console.log(landing.value)
	console.log(showReviews.value)
}

const layoutStyle = computed(() => landing.value?.layoutstyle)

const videoHeaderVideoUrl = computed(() => landing.value?.video_header_video_url || "")
const videoHeaderPoster = computed(() => landing.value?.video_header_video_poster || "")

const videoHeaderTitle = computed(() => landing.value?.video_header_title || "")
const videoHeaderExcerpt = computed(() => landing.value?.video_header_excerpt || "")
const videoHeaderPrimaryButton = computed(() => landing.value?.video_header_primary_button || "")
const videoHeaderPrimaryButtonUrl = computed(() => landing.value?.video_header_primary_button_url || "")
const videoHeaderSecondaryButton = computed(() => landing.value?.video_header_secondary_button || "")
const videoHeaderSecondaryButtonUrl = computed(() => landing.value?.video_header_secondary_button_url || "")
const videoHeaderTertiaryButton = computed(() => landing.value?.video_header_secondary_button || "")
const videoHeaderTertiaryButtonUrl = computed(() => landing.value?.video_header_secondary_button_url || "")

// 1. First set: 'firstcolumnheader', 'secondcolumnheader', etc.
const standardCards = computed(() => extractColumns(landing.value, ["first", "second", "third", "fourth"]))

// 2. Second set: 'header_one', 'header_two', 'header_three'
const threeColumnItems = computed(() => extractColumns(landing.value, ["one", "two", "three"]))

const featureHeaderSm = computed(() => landing.value?.feature_header_sm || "")
const featureHeaderLg = computed(() => landing.value?.feature_header_lg || "")
const featureImage = computed(() => landing.value?.feature_image || "")
const featureUrl = computed(() => landing.value?.feature_url || "")
const featureButton = computed(() => landing.value?.feature_button || "")
const featureText = computed(() => landing.value?.reservations_text || "")

const ferryVideoHeader = computed(() => landing.value?.ferry_video_header || "")
const ferryVideoHeaderSm = computed(() => landing.value?.ferry_video_header_sm || "")
const ferryVideoText = computed(() => landing.value?.ferry_video_text || "")
const ferryVideoButton = computed(() => landing.value?.ferry_video_button || "")
const ferryVideoUrl = computed(() => landing.value?.ferry_video_url || "")

const scrollHeader = computed(() => landing.value?.scroll_header || "")
const scrollImage = computed(() => landing.value?.scroll_image || "")

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
		<template v-if="layoutStyle === 'video'" #bg-video>
			<VideoHeader v-if="layoutStyle === 'video'" :title="videoHeaderTitle" :excerpt="videoHeaderExcerpt" :videoUrl="videoHeaderVideoUrl" :posterUrl="videoHeaderPoster" :primaryButtonText="videoHeaderPrimaryButton" :primaryButtonUrl="videoHeaderPrimaryButtonUrl" :secondaryButtonText="videoHeaderSecondaryButton" :secondaryButtonUrl="videoHeaderSecondaryButtonUrl" :tertiaryButtonText="videoHeaderTertiaryButton" :tertiaryButtonUrl="videoHeaderTertiaryButtonUrl" />
		</template>

		<MainFeatureSection :feature-header-sm="featureHeaderSm" :feature-header-lg="featureHeaderLg" :feature-image="featureImage" :feature-text="featureText" :feature-button="featureButton" :feature-url="featureUrl" />

		<Marquee folder="clients" :speed="60" />

		<TrustindexWidget v-if="showReviews === true" />

		<FerryVideo :header="ferryVideoHeader" :header-sm="ferryVideoHeaderSm" :text="ferryVideoText" :url="ferryVideoUrl" :button="ferryVideoButton" />
	</NuxtLayout>
</template>
