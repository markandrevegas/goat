<script setup lang="ts">
import Instagram from "~/components/icons/Instagram.vue"
import Facebook from "~/components/icons/Facebook.vue"
import Linkedin from "~/components/icons/Linkedin.vue"

interface RelatedPage {
	id: number
	title: { rendered: string }
	slug: string
}

defineProps<{
	title: string
	body: string
	slug: string
	acf: Record<string, any>
	authorName: string
	datePublished: string | null
	formattedDate: string
	featuredImageUrl?: string | null
	featuredImageAlt?: string
	featuredImageWidth?: number
	featuredImageHeight?: number
	relatedPages?: RelatedPage[]
}>()
</script>

<template>
	<article class="flex w-full flex-col">
		<header v-if="acf.layoutStyle === 'hero'" class="relative -top-[2rem] right-1/2 left-1/2 -mx-[50vw] mb-12 flex h-[calc(100vh-80px)] w-screen flex-col items-center justify-center overflow-hidden p-8 text-white">
			<div class="relative z-20 mx-auto flex max-w-3xl flex-col items-center md:max-w-4xl">
				<h1 class="text-center text-4xl tracking-tight md:text-5xl" v-html="title"></h1>
				<div v-if="authorName || formattedDate" class="mt-4 flex items-center space-x-2 text-sm">
					<span v-if="authorName" class="hidden font-medium">By {{ authorName }}</span>
					<span class="font-medium">Published</span>
					<span v-if="formattedDate">|</span>
					<time v-if="formattedDate" :datetime="datePublished ?? undefined">{{ formattedDate }}</time>
				</div>
			</div>
			<div v-if="featuredImageUrl" class="absolute inset-0 z-10 size-full">
				<NuxtImg :src="featuredImageUrl" :alt="featuredImageAlt" :width="featuredImageWidth" :height="featuredImageHeight" sizes="100vw" loading="eager" format="webp" class="size-full object-cover object-center" />
				<div class="pointer-events-none absolute inset-0 bg-black/40"></div>
			</div>
		</header>

		<header v-else class="mx-auto mb-8 flex h-72 max-w-3xl flex-col items-center justify-center md:max-w-4xl">
			<h1 class="text-center text-4xl tracking-tight md:text-5xl" v-html="title"></h1>
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
				<div v-if="slug === 'betingelser'" class="my-8 flex flex-col gap-2">
					<NuxtLink :to="'/lejebetingelser-for-private'" class="block w-max font-semibold underline">Betingelser for private</NuxtLink>
					<NuxtLink :to="'/lejebetingelser-for-erhverv'" class="block w-max font-semibold underline">Betingelser for erhverv</NuxtLink>
				</div>
			</div>
			<div class="col-span-1">
				<p class="font-display mb-2 tracking-tight uppercase">Related</p>
				<ul>
					<li v-for="item in relatedPages">
						<NuxtLink :to="item.slug">{{ item.title?.rendered }}</NuxtLink>
					</li>
				</ul>
			</div>
		</main>
	</article>
</template>
