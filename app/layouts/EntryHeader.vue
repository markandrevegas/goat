<script setup lang="ts">
import Instagram from "~/components/icons/Instagram.vue"
import Facebook from "~/components/icons/Facebook.vue"
import Linkedin from "~/components/icons/Linkedin.vue"

defineProps<{
	layoutStyle?: string
	title: string
	authorName?: string
	formattedDate?: string
	datePublished?: string | null
	featuredImageUrl?: string | null
	featuredImageAlt?: string
	featuredImageWidth?: number
	featuredImageHeight?: number
}>()
</script>

<template>
	<header v-if="layoutStyle === 'hero'" class="text-palladian absolute inset-0 z-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
		<div class="relative z-20 mx-auto flex max-w-3xl flex-col items-center px-4 md:max-w-4xl">
			<h1 class="text-center text-4xl tracking-tight md:text-5xl" v-html="title"></h1>

			<div v-if="authorName || formattedDate" class="mt-4 flex items-center space-x-2 text-sm">
				<span v-if="authorName" class="font-medium">By {{ authorName }}</span>
				<span v-if="authorName && formattedDate">|</span>
				<time v-if="formattedDate" :datetime="datePublished ?? undefined">{{ formattedDate }}</time>
			</div>

			<div class="mt-4 flex items-center justify-center gap-2">
				<Instagram class="size-6" />
				<Facebook class="size-6" />
				<Linkedin class="size-6" />
			</div>
		</div>

		<div v-if="featuredImageUrl" class="absolute inset-0 z-10 h-screen w-full">
			<NuxtImg :src="featuredImageUrl" :alt="featuredImageAlt" sizes="100vw" loading="eager" format="webp" class="h-screen w-full bg-red-500 object-cover object-center" />
			<div class="pointer-events-none absolute inset-0 bg-black/40"></div>
		</div>
	</header>

	<header v-else class="bg-brand text-palladian mb-8 flex min-h-[18rem] w-full flex-col items-center justify-center p-8">
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
