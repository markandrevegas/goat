<script setup lang="ts">
import EntryHeader from "~/layouts/EntryHeader.vue"
import Instagram from "~/components/icons/Instagram.vue"
import Facebook from "~/components/icons/Facebook.vue"
import Linkedin from "~/components/icons/Linkedin.vue"

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
	featuredImageUrl?: string | null
	featuredImageAlt?: string
	featuredImageWidth?: number
	featuredImageHeight?: number
	relatedPages?: RelatedPage[]
}>()
</script>

<template>
	<article class="relative flex w-full flex-col" :class="{ 'pt-[100vh]': acf?.layoutstyle === 'hero' }">
		<EntryHeader :layout-style="acf?.layoutstyle" :title="title" :author-name="authorName" :formatted-date="formattedDate" :date-published="datePublished" :featured-image-url="featuredImageUrl" :featured-image-alt="featuredImageAlt" :featured-image-width="featuredImageWidth" :featured-image-height="featuredImageHeight" />

		<main v-if="body" class="flex flex-col gap-4 md:grid md:grid-cols-4">
			<div class="col-span-1">
				<p class="mb-2 hidden text-sm tracking-tight uppercase md:block">Share Content</p>
				<div class="hidden items-center justify-start gap-2 md:flex">
					<Instagram class="size-6" />
					<Facebook class="size-6" />
					<Linkedin class="size-6" />
				</div>
			</div>
			<div class="col-span-2 flex flex-col gap-2 md:pr-8">
				<!-- Only display inline featured image if standard layout is used -->
				<NuxtImg v-if="acf?.layoutstyle !== 'hero' && featuredImageUrl" :src="featuredImageUrl" :alt="featuredImageAlt" :width="featuredImageWidth" :height="featuredImageHeight" sizes="sm:100vw md:50vw lg:800px" loading="lazy" format="webp" />
				<div v-if="body" class="text-palladian prose prose-lg/5 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-palladian prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md mt-4 max-w-none md:mt-0" v-html="body"></div>
				<p v-else class="font-display italic">This page has no content body text.</p>
				<div v-if="slug === 'betingelser'" class="my-8 flex flex-col gap-2">
					<NuxtLink :to="'/lejebetingelser-for-private'" class="block w-max font-semibold underline">Betingelser for private</NuxtLink>
					<NuxtLink :to="'/lejebetingelser-for-erhverv'" class="block w-max font-semibold underline">Betingelser for erhverv</NuxtLink>
				</div>
			</div>
			<div class="col-span-1">
				<p class="font-display mb-2 tracking-tight uppercase">Related</p>
				<ul>
					<li v-for="item in relatedPages" :key="item.id">
						<NuxtLink :to="item.slug">{{ item.title?.rendered }}</NuxtLink>
					</li>
				</ul>
			</div>
		</main>
	</article>
</template>
