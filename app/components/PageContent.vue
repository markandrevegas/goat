<script setup lang="ts">
import WpImage from "./ui/WpImage.vue"
import EntryHeader from "~/layouts/EntryHeader.vue"
import Social from "./ui/Social.vue"
import SecondaryButton from "./ui/SecondaryButton.vue"
import ImageGallery from "./ImageGallery.vue"
import MapEmbed from "./ui/MapEmbed.vue"
import ThreeCardLayout from "./ui/ThreeCardLayout.vue"
interface RelatedPage {
	id: number
	title: { rendered: string }
	slug: string
}

const props = defineProps<{
	title: string
	body: string
	slug: string
	acf?: Record<string, any>
	layoutStyle?: string
	authorName?: string
	datePublished?: string | null
	formattedDate?: string
	featuredImageUrl?: string | null
	featuredImageAlt?: string
	featuredImageWidth?: number
	featuredImageHeight?: number
	relatedPages?: RelatedPage[]
}>()

const sharedLayout = useLayoutStyle()
watch(
	() => props.layoutStyle ?? props.acf?.layoutstyle,
	(value) => {
		sharedLayout.value = value ?? null
	},
	{ immediate: true }
)

if (import.meta.client) {
	console.log(props.acf)
}
</script>

<template>
	<article class="relative w-full">
		<EntryHeader :layout-style="layoutStyle" :title="title" :author-name="authorName" :formatted-date="formattedDate" :date-published="datePublished" :featured-image-url="featuredImageUrl" :featured-image-alt="featuredImageAlt" :featured-image-width="featuredImageWidth" :featured-image-height="featuredImageHeight" />

		<main v-if="body && slug !== 'information-for-guests'" class="flex flex-col gap-4 md:grid md:grid-cols-4">
			<div class="col-span-1 hidden md:block">
				<p class="mb-4 text-sm font-bold uppercase md:block">Share content</p>
				<Social class="w-max" />
			</div>
			<div class="col-span-2 flex flex-col gap-2 md:pr-8">
				<WpImage loading="eager" fetchpriority="high" v-if="acf?.layoutstyle !== 'hero' && featuredImageUrl" :image-id="featuredImageUrl" :alt="featuredImageAlt" />
				<div v-if="body" class="prose prose-lg/5 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-brand prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md mb-16 max-w-none" v-html="body"></div>
				<p v-else class="font-display italic">This page has no content body text.</p>
				<div v-if="slug === 'simple-meetings'" class="mt-8 w-full">
					<SecondaryButton class="mx-auto" :url="'https://mar-k-waterside.mysharefox.com/products/1025/events'" :text="'Book nu'" :event-name="'simple_to_sharefox'" :event-params="{ button_name: 'SimpleMeetingsButton' }" />
				</div>
				<div v-if="slug === 'apartments'" class="mt-8 w-full">
					<SecondaryButton :url="'https://www.airbnb.dk/rooms/1097007987468938423?source_impression_id=p3_1772114290_P3dpvLUu7wLo2UJ8'" :text="'Book nu'" :event-name="'simple_to_airbnb'" :event-params="{ button_name: 'SimpleMeetingsButton' }" />
				</div>
				<div v-if="slug === 'private-events'" class="mt-8 w-full">
					<SecondaryButton :url="'https://mar-k-waterside.mysharefox.com/products/1025/events'" :text="'Reserve your event'" :event-name="'events_to_sharefox'" :event-params="{ button_name: 'SimpleMeetingsButton' }" />
				</div>
				<div v-if="slug === 'betingelser'" class="my-8 flex flex-col gap-2">
					<NuxtLink :to="'/lejebetingelser-for-private'" class="block w-max font-semibold underline">Betingelser for private</NuxtLink>
					<NuxtLink :to="'/lejebetingelser-for-erhverv'" class="block w-max font-semibold underline">Betingelser for erhverv</NuxtLink>
				</div>
				<ImageGallery v-if="slug == 'rooftop-terrace'" :header="acf?.gallery_header" :text="acf?.gallery_text" :button="acf?.gallery_button" :url="acf?.gallery_url" class="md:col-span-2 md:col-start-2" />
			</div>
			<div class="col-span-1 mt-16 sm:mt-0">
				<p class="mb-4 text-sm font-bold uppercase md:block">Related</p>
				<ul class="list-reset space-y-2">
					<li v-for="item in relatedPages" :key="item.id">
						<NuxtLink :to="item.slug"><span v-html="item.title?.rendered" class="w-max font-semibold transition-opacity duration-400 hover:border-b-2"></span></NuxtLink>
					</li>
				</ul>
			</div>
		</main>
		<div v-if="slug === 'information-for-guests'">
			<div v-if="body" class="prose text-palladian text-lg/8 mb-16 max-w-3xl mx-auto text-center" v-html="body"></div>
			<ThreeCardLayout :acf="acf" />
			<MapEmbed :query="acf?.ferryaddress" :address="acf?.ferryaddress" :email="acf?.email" :tel="acf?.tel" />
		</div>
	</article>
</template>
