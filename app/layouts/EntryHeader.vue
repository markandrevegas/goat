<script setup lang="ts">
import Instagram from "~/components/icons/Instagram.vue"
import Facebook from "~/components/icons/Facebook.vue"
import Linkedin from "~/components/icons/Linkedin.vue"
import PrimaryButton from "~/components/ui/PrimaryButton.vue"
import PageVideoHeader from "~/components/PageVideoHeader.vue"

const facebookUrl = "https://facebook.com/FloatingGOATCopenhagen"
const instagramUrl = "https://instagram.com/floating_goat_cph/"
const linkedinUrl = "https://linkedin.com/company/mar-k-waterside"

const props = defineProps<{
	layoutStyle?: string
	title: string
	excerpt?: string
	buttonText?: string
	authorName?: string
	formattedDate?: string
	datePublished?: string | null
	featuredImageUrl?: string | null
	featuredImageAlt?: string
	featuredImageWidth?: number
	featuredImageHeight?: number
	instagramUrl?: string
	facebookUrl?: string
	linkedinUrl?: string
	callToAction?: string
	callToActionUrl?: string
	videoUrl?: string
	posterUrl?: string
	slug?: string
}>()

if (import.meta.dev) {
	console.log(props.callToActionUrl)
}
</script>

<template>
	<PageVideoHeader v-if="layoutStyle === 'video' && videoUrl" :title="title" :excerpt="excerpt" :call-to-action="callToAction" :call-to-action-url="callToActionUrl" :author-name="authorName" :formatted-date="formattedDate" :date-published="datePublished" :video-url="videoUrl" :poster-url="posterUrl" :slug="slug" />
	<header v-else-if="layoutStyle === 'hero'" class="text-palladian relative -top-[2rem] right-1/2 left-1/2 -mx-[50vw] mb-12 flex min-h-[60vh] md:min-h-[75vh] w-screen flex-col justify-center overflow-hidden pt-24">
		<div class="grid w-full grid-cols-4 gap-4 sm:mx-auto sm:max-w-6xl sm:px-8">
			<div class="relative z-20 col-span-3 pl-8 md:col-span-2 md:col-start-2 md:pl-0">
				<h1 class="text-4xl tracking-tighter" v-html="title"></h1>
				<p v-if="excerpt" v-html="excerpt" class="mt-3 mb-2 w-full text-sm/5 sm:max-w-2xl"></p>
				<div v-if="callToAction" class="flex w-full justify-start">
					<PrimaryButton :url="callToActionUrl" target="_self" :text="callToAction" :event-name="'book_' + slug" class="bg-palladian text-brand hover:bg-brand/80 hover:text-palladian mt-4 mb-8 text-xl uppercase hover:cursor-pointer" />
				</div>
				<div v-if="authorName || formattedDate" class="mt-4 flex flex-col space-x-2 text-sm">
					<span v-if="authorName" class="font-medium">Published by {{ authorName }}</span>
					<span v-if="authorName && formattedDate"></span>
					<time v-if="formattedDate" :datetime="datePublished ?? undefined">{{ formattedDate }}</time>
				</div>

				<div class="mt-4 flex hidden items-center justify-center gap-4">
					<Instagram class="transition-transform duration-300 hover:scale-110 hover:cursor-pointer" :url="instagramUrl ?? instagramUrl" :size="24" />
					<Facebook class="transition-transform duration-300 hover:scale-110 hover:cursor-pointer" :url="facebookUrl ?? facebookUrl" :size="24" />
					<Linkedin class="transition-transform duration-300 hover:scale-110 hover:cursor-pointer" :url="linkedinUrl ?? linkedinUrl" :size="24" />
				</div>
			</div>
		</div>

		<div v-if="layoutStyle == 'hero' && featuredImageUrl" class="absolute inset-0 z-10 w-full">
			<NuxtImg :src="featuredImageUrl" :alt="featuredImageAlt" :width="featuredImageWidth" :height="featuredImageHeight" loading="eager" fetchpriority="high" sizes="sm:100vw md:50vw" format="webp" class="h-full w-full object-cover" />
			<div class="pointer-events-none absolute inset-0 bg-black/60"></div>
		</div>
	</header>

	<header v-else class="flex min-h-[60vh] md:min-h-[75vh] w-full flex-col justify-center pt-16">
		<div class="flex flex-col items-center justify-center sm:grid sm:grid-cols-4">
			<div class="relative z-20 col-span-2 sm:col-start-2">
				<h1 class="text-4xl tracking-tight" v-html="title"></h1>
				<p v-if="excerpt" v-html="excerpt" class="mt-3 mb-2 w-full text-sm/5 sm:max-w-2xl"></p>
				<PrimaryButton v-if="callToAction" :url="callToActionUrl" :text="callToAction" :event-name="'book_' + slug" class="bg-palladian text-brand hover:bg-palladian/80 mt-4 mb-8 text-xl uppercase hover:cursor-pointer" />
			</div>
		</div>
	</header>
</template>
