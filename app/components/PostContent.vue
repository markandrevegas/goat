<script setup lang="ts">
import WpImage from "./ui/WpImage.vue"
import EntryHeader from "~/layouts/EntryHeader.vue"
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
	layoutStyle?: string
}>()

const sharedLayout = useLayoutStyle()
watch(
	() => props.acf?.layoutstyle,
	(value) => {
		sharedLayout.value = value ?? null
	},
	{ immediate: true }
)

const { data: postItems } = await getPosts({
	exclude: []
})
</script>

<template>
	<article class="relative w-full">
		<EntryHeader :layout-style="layoutStyle" :title="title" :author-name="authorName" :formatted-date="formattedDate" :date-published="datePublished" :featured-image-url="featuredImageUrl" :featured-image-alt="featuredImageAlt" :featured-image-width="featuredImageWidth" :featured-image-height="featuredImageHeight" />

		<div v-if="body && slug !== 'information-for-guests'" class="flex flex-col gap-4 md:grid md:grid-cols-4">

			<div class="col-span-1 mb-8 sm:mb-0">
				<p class="mb-2 text-sm tracking-tight uppercase md:block">Share Content</p>
				<Social />
			</div>

			<div class="col-span-2 flex flex-col gap-4 md:pr-8">
				<WpImage loading="eager" fetchpriority="high" v-if="acf?.layoutstyle === 'standard' && featuredImageUrl" :image-id="featuredImageUrl" :alt="featuredImageAlt" sizes="sm:100vw md:50vw lg:800px" />

				<div v-if="body" class="text-palladian prose prose-lg/5 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-palladian prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md max-w-none" v-html="body"></div>
				<p v-else class="font-display italic">This page has no content body text.</p>
			</div>

			<div class="col-span-1">
				<p v-if="postItems" class="mt-8 mb-2 text-sm tracking-tight uppercase sm:mt-0">Recent Posts</p>
				
				<ul v-if="postItems" class="space-y-2">
					<li v-for="post in postItems" :key="post.id">
						<NuxtLink :to="`/${post.slug}`" class="w-max font-semibold transition-opacity duration-400 hover:border-b-2" v-html="post.title.rendered" />
					</li>
					<li>
						<NuxtLink to="/posts" class="w-max font-semibold transition-opacity duration-400 hover:border-b-2">All posts</NuxtLink>
					</li>
				</ul>
			</div>
		</div>
	</article>
</template>
