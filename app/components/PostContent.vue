<script setup lang="ts">
import { computed } from "vue"
import Instagram from "~/components/icons/Instagram.vue"
import Facebook from "~/components/icons/Facebook.vue"
import Linkedin from "~/components/icons/Linkedin.vue"
import ThreeCardLayout from "./ui/ThreeCardLayout.vue"
import MapEmbed from "./ui/MapEmbed.vue"

const props = defineProps<{
	title: string
	body: string
	slug: string
	acf: Record<string, any>
	authorName: string
	formattedDate: string
	datePublished: string | null
	featuredImageUrl: string | null
	featuredImageAlt: string
	featuredImageWidth: number
	featuredImageHeight: number
}>()

// Default layout is 'standard' (image in middle column).
// Editors can override this in WP via an ACF Select field with choices 'standard' | 'hero'
const layoutStyle = computed(() => {
	return props.acf?.layout_type || "standard"
})
</script>

<template>
	<article class="w-full">
		<!-- HERO LAYOUT: Full-Width Background Header -->
		<header v-if="layoutStyle === 'hero'" class="relative mb-8 flex min-h-[420px] w-full flex-col items-center justify-center overflow-hidden p-8 text-white md:min-h-[450px]">
			<div class="relative z-20 mx-auto flex max-w-3xl flex-col items-center md:max-w-4xl">
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
			</div>

			<!-- Absolute Image Background -->
			<div v-if="featuredImageUrl" class="absolute inset-0 z-10 size-full">
				<NuxtImg :src="featuredImageUrl" :alt="featuredImageAlt" :width="featuredImageWidth" :height="featuredImageHeight" sizes="100vw" loading="lazy" format="webp" class="size-full object-cover" />
				<div class="pointer-events-none absolute inset-0 bg-black/40"></div>
			</div>
		</header>

		<!-- STANDARD LAYOUT: Centered Text Header -->
		<header v-else class="mx-auto mb-8 flex max-w-3xl flex-col items-center md:max-w-4xl">
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

		<!-- Main 3-Column Content Grid -->
		<main v-if="body && slug !== 'information-for-guests'" class="flex flex-col gap-4 md:grid md:grid-cols-4">
			<!-- Column 1: Share icons -->
			<div class="col-span-1">
				<p class="mb-2 hidden text-sm tracking-tight uppercase md:block">Share Content</p>
				<div class="hidden items-center justify-start gap-2 md:flex">
					<Instagram class="size-6" />
					<Facebook class="size-6" />
					<Linkedin class="size-6" />
				</div>
			</div>

			<!-- Column 2 (Middle): Standard Mode Image rendering first, followed by content -->
			<div class="col-span-2 flex flex-col gap-4 md:pr-8">
				<NuxtImg v-if="layoutStyle === 'standard' && featuredImageUrl" :src="featuredImageUrl" :alt="featuredImageAlt" :width="featuredImageWidth" :height="featuredImageHeight" sizes="(max-width: 768px) 100vw, 50vw" loading="lazy" format="webp" class="w-full rounded-xl object-cover shadow-sm" />

				<div v-if="body" class="text-palladian prose prose-lg/5 prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-palladian prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:shadow-md max-w-none" v-html="body"></div>
				<p v-else class="font-display italic">This page has no content body text.</p>
			</div>

			<!-- Column 3: Sidebar -->
			<div class="col-span-1">
				<p class="mb-2 text-sm tracking-tight uppercase">Recent Posts</p>
			</div>
		</main>

		<!-- Special Layout for information-for-guests -->
		<main v-if="body && slug === 'information-for-guests'" class="flex flex-col gap-4 md:mb-16 md:grid md:grid-cols-4">
			<div class="col-span-1"></div>
			<div class="col-span-2 flex flex-col gap-2 md:pr-8">
				<div v-if="body" class="prose mt-4 max-w-none text-center md:mt-0" v-html="body"></div>
				<p v-else class="font-display italic">This page has no content body text.</p>
			</div>
			<div class="col-span-1"></div>
		</main>

		<ThreeCardLayout v-if="slug === 'information-for-guests'" :acf="acf" />
		<MapEmbed v-if="slug === 'information-for-guests'" :query="acf?.ferryaddress" :address="acf?.ferryaddress" :email="acf?.email" :tel="acf?.tel" />
	</article>
</template>
