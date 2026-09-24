<script setup lang="ts">
import WpImage from "./ui/WpImage.vue"
import EntryHeader from "~/layouts/EntryHeader.vue"
import Social from "./ui/Social.vue"
import ImageGallery from "./ImageGallery.vue"

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
	authorName?: string
	datePublished?: string | null
	formattedDate?: string
	featuredImageUrl?: number | null
	featuredImageAlt?: string
	featuredImageWidth?: number
	featuredImageHeight?: number
	relatedPages?: RelatedPage[]
	privateHeroImageId?: number
	privateHeroExcerpt?: string
	privateFeatureImageId: number
}>()
</script>

<template>
	<article class="w-full" :class="{ 'pt-[100vh]': acf?.layoutstyle === 'hero' }">
		<EntryHeader :layout-style="acf?.layoutstyle || ''" :title="acf?.private_hero_header" :author-name="authorName" :privateHeroExcerpt="acf?.private_hero_excerpt" :privateFeatureImageId="privateFeatureImageId" :privateHeroImageId="privateHeroImageId" />

		<main v-if="body" class="mb-16 pt-[60vh]">
			<div class="col-span-1 hidden sm:block">
				<p class="mb-2 text-sm tracking-tight uppercase md:block">Share Content</p>
				<Social class="mr-auto w-max" />
			</div>
			<div class="col-span-2 flex flex-col gap-2 md:pr-8">
				<WpImage loading="eager" fetchpriority="high" v-if="acf?.layoutstyle !== 'hero' && featuredImageUrl" :image-id="featuredImageUrl" :alt="featuredImageAlt" />
				<div v-if="body" class="prose prose-lg/5 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-brand prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md max-w-none" v-html="body"></div>
				<p v-else class="font-display italic">This page has no content body text.</p>
			</div>
			<div class="col-span-1 mt-16 sm:mt-0"></div>
		</main>
		<ImageGallery v-if="slug === '6-person-apartment'" />
		<TwoColumnFeature v-if="slug === 'about'" :header="acf?.private_feature_header" :text="acf?.private_feature_text" :image="acf?.private_feature_image"></TwoColumnFeature>
	</article>
</template>
