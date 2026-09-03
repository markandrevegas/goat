<script setup>
import { computed } from "vue"
import Marquee from "~/components/ui/Marquee.vue"
import Goat from "~/components/icons/Goat.vue"

import ThreeColumns from "~/components/ui/ThreeColumns.vue"
import CardScroller from "~/components/ui/CardScroller.vue"

definePageMeta({
	layout: false
})

const { getLandingPage } = useWordPress()
const { data: page, status, error } = await useAsyncData("wp-index", () => getLandingPage("index-page"))

const landing = computed(() => page.value?.acf || {})

// 1. First set: 'firstcolumnheader', 'secondcolumnheader', etc.
const standardCards = computed(() => 
	extractColumns(landing.value, ["first", "second", "third", "fourth"])
)

// 2. Second set: 'header_one', 'header_two', 'header_three'
const threeColumnItems = computed(() => 
	extractColumns(landing.value, ["one", "two", "three"])
)

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

/*useSeoMeta({
	title: seoTitle,
	titleTemplate: null,
	metaTitle: seoTitle,
	description: seoDescription,
	ogTitle: seoTitle,
	ogDescription: seoDescription,
	ogImage: ogImage,
	ogType: "website",
	twitterCard: "summary_large_image",
	twitterTitle: seoTitle,
	twitterDescription: seoDescription,
	twitterImage: ogImage
})*/
/*watchEffect(() => {
	if (page.value) {
		console.log("Full WordPress Page Data:", page.value)
		console.log("Current ACF Fields:", page.value.acf)
	}
	if (error.value) {
		console.error("Error fetching landing page:", error.value)
	}
})*/
</script>
<template>
	<NuxtLayout name="default">
		<!--<template #bg-video>
			<IndexVideo :title="seoTitle" :subtitle="seoDescription" />
		</template>-->
		<ThreeColumns
			:items="threeColumnItems"
		/>
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

		<!--<CardScroller
			:items="[
				{ img: eventsImg, title: 'Events og receptioner', description: 'Skab en helt særlig ramme om jeres arrangement med byens liv og vandets ro som baggrundstæppe.' },
				{ img: meetingImg, title: 'Møder og strategidage', description: 'Hold møde med panoramaudsigt ud over vandet og til Københavns spir og tage.' },
				{ img: workshopImg, title: 'Workshops og teambuilding', description: 'Omsæt indsigt til handling. Floating G.O.A.T. er et perfekt sted til at tænke nye tanker og blive inspireret.' },
				{ img: eventsImg, title: 'Workshops og teambuilding', description: 'Omsæt indsigt til handling. Floating G.O.A.T. er et perfekt sted til at tænke nye tanker og blive inspireret.' }
			]"
		/>-->
		<ImageScrollWindow />
		<FerryVideo />
	</NuxtLayout>
</template>
