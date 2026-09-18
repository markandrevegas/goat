<script setup lang="ts">
import WpImage from "~/assets/components/ui/WpImage.vue"
import Instagram from "~/assets/components/icons/Instagram.vue"
import Facebook from "~/assets/components/icons/Facebook.vue"
import Linkedin from "~/assets/components/icons/Linkedin.vue"
import PrimaryButton from "~/assets/components/ui/PrimaryButton.vue"

const facebookUrl = "https://facebook.com/FloatingGOATCopenhagen"
const instagramUrl = "https://instagram.com/floating_goat_cph/"
const linkedinUrl = "https://linkedin.com/company/mar-k-waterside"

const props = defineProps<{
	layoutStyle?: string
	title: string
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
	privateHeroExcerpt?: string
	privateHeroImageId?: number
	privateFeatureImageId?: number
}>()
</script>

<template>
	<header v-if="props.layoutStyle === 'hero'" class="text-palladian absolute inset-0 z-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
		<div class="grid max-w-6xl grid-cols-4 px-8">
			<div class="relative z-20 col-span-4 mx-auto sm:col-span-2 sm:col-start-2">
				<h1 class="text-4xl tracking-tighter" v-html="title"></h1>
				<p v-if="privateHeroExcerpt" v-html="privateHeroExcerpt" class="mt-6 max-w-lg text-base/7"></p>
				<div class="flex w-full justify-start">
					<PrimaryButton v-if="buttonText" :text="buttonText || 'Book nu'" :event-name="'book_meeting'" :event-params="{ button_name: 'secondary_cta' }" />
				</div>
				<div v-if="authorName || formattedDate" class="mt-4 flex items-center space-x-2 text-sm">
					<span v-if="authorName" class="font-medium">Published by {{ authorName }}</span>
					<span v-if="authorName && formattedDate">|</span>
					<time v-if="formattedDate" :datetime="datePublished ?? undefined">{{ formattedDate }}</time>
				</div>

				<div class="mt-4 flex hidden items-center justify-center gap-4">
					<Instagram class="transition-transform duration-300 hover:scale-110 hover:cursor-pointer" :url="instagramUrl ?? instagramUrl" :size="24" />
					<Facebook class="transition-transform duration-300 hover:scale-110 hover:cursor-pointer" :url="facebookUrl ?? facebookUrl" :size="24" />
					<Linkedin class="transition-transform duration-300 hover:scale-110 hover:cursor-pointer" :url="linkedinUrl ?? linkedinUrl" :size="24" />
				</div>
			</div>
		</div>

		<div class="absolute inset-0 z-10 h-full w-full">
			<WpImage v-if="featuredImageUrl" :image-id="featuredImageUrl" class="block h-full w-full object-cover" />
			<WpImage v-if="privateHeroImageId" :image-id="privateHeroImageId" class="block h-full w-full object-cover" />
			<WpImage v-if="privateFeatureImageId" :image-id="privateFeatureImageId" class="block h-full w-full object-cover" />
			<div class="pointer-events-none absolute inset-0 bg-black/60"></div>
		</div>
	</header>

	<header v-else class="mb-8 flex min-h-[18rem] w-full flex-col items-center justify-center p-8">
		<div class="mx-auto flex max-w-3xl flex-col items-center md:max-w-4xl">
			<h1 class="text-center text-4xl tracking-tight md:text-5xl" v-html="title"></h1>
			<div v-if="authorName || formattedDate" class="mt-4 flex items-center space-x-2 text-sm">
				<span v-if="authorName" class="font-medium">By {{ authorName }}</span>
				<span v-if="authorName && formattedDate">|</span>
				<time v-if="formattedDate" :datetime="datePublished ?? undefined">{{ formattedDate }}</time>
			</div>
		</div>
	</header>
</template>
