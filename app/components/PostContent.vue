<script setup lang="ts">
import Instagram from "~/components/icons/Instagram.vue"
import Facebook from "~/components/icons/Facebook.vue"
import Linkedin from "~/components/icons/Linkedin.vue"

defineProps<{
	title: string
	body: string
	authorName: string
	formattedDate: string
	datePublished: string | null
	featuredImageUrl: string | null
	featuredImageAlt: string
	featuredImageWidth: number
	featuredImageHeight: number
}>()
</script>

<template>
	<article class="w-full">
		<header class="mx-auto mb-8 flex max-w-3xl flex-col items-center">
			<h1 class="text-4xl tracking-tight md:text-5xl" v-html="title"></h1>
			<div v-if="authorName || formattedDate" class="mt-4 flex items-center space-x-2 text-sm">
				<span v-if="authorName" class="hidden font-medium">By {{ authorName }}</span>
				<span class="font-medium">Published</span>
				<span v-if="formattedDate">|</span>
				<time v-if="formattedDate" :datetime="datePublished ?? undefined">{{ formattedDate }}</time>
			</div>
			<div class="mt-4 flex items-center justify-start gap-2">
				<Instagram class="size-6" />
				<Facebook class="size-6" />
				<Linkedin class="size-6" />
			</div>
		</header>
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
				<NuxtImg v-if="featuredImageUrl" :src="featuredImageUrl" :alt="featuredImageAlt" :width="featuredImageWidth" :height="featuredImageHeight" sizes="sm:100vw md:50vw lg:800px" loading="lazy" format="webp" />
				<div v-if="body" class="text-palladian prose prose-lg/5 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-palladian prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md mt-4 max-w-none md:mt-0" v-html="body"></div>
				<p v-else class="font-display italic">This page has no content body text.</p>
			</div>
			<div class="col-span-1">
				<p class="mb-2 text-sm tracking-tight uppercase">Recent Posts</p>
			</div>
		</main>
	</article>
</template>
