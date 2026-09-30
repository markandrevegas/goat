<script setup lang="ts">
import WpImage from "./ui/WpImage.vue"
import EntryHeader from "~/layouts/EntryHeader.vue"
import Social from "./ui/Social.vue"
import SecondaryButton from "./ui/SecondaryButton.vue"
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

if (import.meta.dev && import.meta.client) {
	console.log(props.acf)
}

useHead({
	link: [{ rel: "canonical", href: "'https://floatinggoat.dk/" + props.slug }]
})
</script>

<template>
	<article class="relative w-full">
		<EntryHeader :layout-style="layoutStyle" :excerpt="acf?.header_excerpt" :title="title" :author-name="authorName" :formatted-date="formattedDate" :date-published="datePublished" :featured-image-url="featuredImageUrl" :featured-image-alt="featuredImageAlt" :featured-image-width="featuredImageWidth" :featured-image-height="featuredImageHeight" />

		<main v-if="body && slug !== 'information-for-guests'" class="flex flex-col gap-4 md:grid md:grid-cols-4">
			<div class="col-span-1 hidden md:block">
				<p class="mb-4 text-sm font-bold uppercase md:block">Share content</p>
				<Social class="w-max" />
			</div>
			<div class="col-span-2 flex flex-col gap-2 md:pr-8">
				<WpImage loading="eager" fetchpriority="high" v-if="acf?.layoutstyle !== 'hero' && featuredImageUrl" :image-id="featuredImageUrl" :alt="featuredImageAlt" />
				<div v-if="body" class="prose prose-lg/5 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-brand prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md mb-8 max-w-none" v-html="body"></div>
				<p v-else class="font-display italic">This page has no content body text.</p>
				<details v-if="acf?.extended_info_content" class="group w-full border border-neutral-200 bg-white [interpolate-size:allow-keywords] details-content:h-0 details-content:overflow-hidden details-content:opacity-0 details-content:transition-[height,opacity,content-visibility] details-content:transition-discrete details-content:duration-300 details-content:ease-out open:shadow-sm open:details-content:h-auto open:details-content:opacity-100">
					<summary class="text-brown flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display text-lg font-semibold select-none [&::-webkit-details-marker]:hidden">
						Practical information
						<svg class="size-5 shrink-0 transition-transform duration-300 group-open:rotate-180" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path d="M5 8l5 5 5-5" />
						</svg>
					</summary>
					<div class="px-5 pb-5 text-sm leading-relaxed text-neutral-700 [&_a]:underline [&_li]:pl-1 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5 [&_ul_ul]:mt-1 [&>*+*]:mt-3 [&_b]:font-display" v-html="acf?.extended_info_content"></div>
				</details>
			</div>
			<div class="col-span-1 mt-16 sm:mt-0">
				<p class="mb-4 text-sm font-bold uppercase md:block">Related</p>
				<ul class="list-reset space-y-2 sm:space-y-1">
					<li v-for="item in relatedPages" :key="item.id">
						<NuxtLink :to="item.slug"><span v-html="item.title?.rendered" class="w-max font-semibold transition-opacity duration-400 hover:border-b-2"></span></NuxtLink>
					</li>
				</ul>
			</div>
		</main>
		<div v-if="slug === 'information-for-guests'">
			<div v-if="body" class="prose text-palladian mx-auto mb-16 max-w-3xl text-center text-lg/8" v-html="body"></div>
			<ThreeCardLayout :acf="acf" />
			<MapEmbed :query="acf?.ferryaddress" :address="acf?.ferryaddress" :email="acf?.email" :tel="acf?.tel" />
		</div>
	</article>
</template>
