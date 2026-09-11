<script setup lang="ts">
import WpImage from "./ui/WpImage.vue"
import EntryHeader from "~/layouts/EntryHeader.vue"
import Social from "./ui/Social.vue"
import SecondaryButton from "./ui/SecondaryButton.vue"

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
	excerpt?: string
	authorName?: string
	datePublished?: string | null
	formattedDate?: string
	featuredImageUrl?: number | null
	featuredImageAlt?: string
	featuredImageWidth?: number
	featuredImageHeight?: number
	relatedPages?: RelatedPage[]
	privateHeroImageId: number
}>()
</script>

<template>
	<article class="w-full" :class="{ 'pt-[100vh]': acf?.layoutstyle === 'hero' }">
		<EntryHeader :layout-style="acf?.layoutstyle || ''" :title="title" :author-name="authorName" :excerpt="excerpt" :privateHeroImageId="privateHeroImageId" :formatted-date="formattedDate" :date-published="datePublished" :featured-image-alt="featuredImageAlt" :featured-image-width="featuredImageWidth" :featured-image-height="featuredImageHeight" />

		<main v-if="body" class="flex flex-col gap-4 bg-red-200 md:grid md:grid-cols-4">
			<div class="col-span-1 hidden sm:block">
				<p class="mb-2 text-sm tracking-tight uppercase md:block">Share Content</p>
				<Social class="mr-auto w-max" />
			</div>
			<div class="col-span-2 flex flex-col gap-2 md:pr-8">
				<WpImage loading="eager" fetchpriority="high" v-if="acf?.layoutstyle !== 'hero' && featuredImageUrl" :image-id="featuredImageUrl" :alt="featuredImageAlt" />
				<div v-if="body" class="prose prose-lg/5 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-brand prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md max-w-none" v-html="body"></div>
				<p v-else class="font-display italic">This page has no content body text.</p>
			</div>
			<div class="col-span-1 mt-16 sm:mt-0">
				<p class="mb-4 text-sm tracking-tight uppercase md:block">Related</p>
				<ul class="list-reset space-y-1">
					<li v-for="item in relatedPages" :key="item.id">
						<NuxtLink :to="item.slug">{{ item.title?.rendered }}</NuxtLink>
					</li>
				</ul>
			</div>
		</main>
	</article>
</template>
