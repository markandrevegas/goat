<script setup lang="ts">
import { computed } from "vue"
import Instagram from "~/components/icons/Instagram.vue"
import Facebook from "~/components/icons/Facebook.vue"
import Linkedin from "~/components/icons/Linkedin.vue"

import EntryHeader from "~/layouts/EntryHeader.vue"
import ThreeCardLayout from "./ui/ThreeCardLayout.vue"
import MapEmbed from "./ui/MapEmbed.vue"
import Social from "./ui/Social.vue"

const { getPosts } = useWordPress()

const props = defineProps<{
	title: string
	body: string
	slug: string
	acf?: Record<string, any>
	authorName: string
	formattedDate: string
	datePublished: string | null
	featuredImageUrl: string | null
	featuredImageAlt: string
	featuredImageWidth: number
	featuredImageHeight: number
}>()
const { data: postItems } = await getPosts({
	exclude: [props.slug]
})

const layoutStyle = computed(() => {
	return props.acf?.layoutstyle
})
</script>

<template>
	<article class="w-full" :class="{ 'pt-[100vh]': layoutStyle === 'hero' }">
		<EntryHeader :layout-style="layoutStyle" :title="title" :author-name="authorName" :formatted-date="formattedDate" :date-published="datePublished" :featured-image-url="featuredImageUrl" :featured-image-alt="featuredImageAlt" :featured-image-width="featuredImageWidth" :featured-image-height="featuredImageHeight" />

		<!-- Main 3-Column Content Grid -->
		<main v-if="body && slug !== 'information-for-guests'" class="flex flex-col gap-4 md:grid md:grid-cols-4">
			<!-- Column 1: Share icons -->
			<div class="col-span-1">
				<p class="mb-2 hidden text-sm tracking-tight uppercase md:block">Share Content</p>
				<Social />
			</div>

			<!-- Column 2 (Middle): Standard Mode Image rendering first, followed by content -->
			<div class="col-span-2 flex flex-col gap-4 md:pr-8">
				<NuxtImg v-if="layoutStyle !== 'hero' && featuredImageUrl" :src="featuredImageUrl" :alt="featuredImageAlt" :width="featuredImageWidth" :height="featuredImageHeight" sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" format="webp" class="w-full rounded-xl object-cover shadow-sm" />

				<div v-if="body" class="text-palladian prose prose-lg/5 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-palladian prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md max-w-none" v-html="body"></div>
				<p v-else class="font-display italic">This page has no content body text.</p>
			</div>

			<!-- Column 3: Sidebar -->
			<div class="col-span-1">
				<p class="mb-2 text-sm tracking-tight uppercase">Recent Posts</p>
				<ul class="space-y-1">
					<li v-for="post in postItems" :key="post.id">
						<NuxtLink :to="`/${post.slug}`" class="text-palladian w-max text-sm transition-colors" active-class="border-b-2 font-semibold" v-html="post.title.rendered" />
					</li>
				</ul>
			</div>
		</main>

		<!-- Special Layout for information-for-guests -->
		<main v-if="body && slug === 'information-for-guests'" class="mt-8 flex flex-col gap-4 md:mt-12 md:mb-16 md:grid md:grid-cols-4">
			<div class="col-span-1"></div>
			<div class="col-span-2 flex flex-col gap-2 md:pr-8">
				<div v-if="body" class="prose max-w-none text-center" v-html="body"></div>
				<p v-else class="font-display italic">This page has no content body text.</p>
			</div>
			<div class="col-span-1"></div>
		</main>

		<ThreeCardLayout v-if="slug === 'information-for-guests'" :acf="acf" />
		<MapEmbed v-if="slug === 'information-for-guests'" :query="acf?.ferryaddress" :address="acf?.ferryaddress" :email="acf?.email" :tel="acf?.tel" />
	</article>
</template>
