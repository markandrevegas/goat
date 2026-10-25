<script setup lang="ts">
const { getPostCards } = useWordPress()
const { data: posts } = await getPostCards({ exclude: ["hello-world"] })

definePageMeta({
	layout: "default"
})
const formatDate = (iso: string) =>
	new Intl.DateTimeFormat("da-DK", {
		year: "numeric",
		month: "long",
		day: "numeric",
		timeZone: "UTC"
	}).format(new Date(iso))

const imageOf = (post: any) => post._embedded?.["wp:featuredmedia"]?.[0]

useSeoMeta({
	title: "Blog",
	ogTitle: "Blog"
})
</script>

<template>
	<section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
		<header class="flex min-h-[60vh] w-full flex-col justify-center pt-16 md:min-h-[75vh]">
			<div class="flex flex-col items-center justify-center sm:grid sm:grid-cols-4">
				<div class="relative z-20 col-span-2 sm:col-start-2">
					<h1 class="text-4xl" v-html="'BlogHeader'"></h1>
					<p v-html="'Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. '" class="mt-3 mb-2 w-full text-sm/5 sm:max-w-2xl"></p>
					<!--
				<PrimaryButton v-if="callToAction" :event-params="{ button_location: slug }" :url="callToActionUrl" :text="callToAction" :event-name="'start_booking_' + slug" class="bg-palladian text-brand hover:bg-palladian/80 mt-4 mb-8 text-xl uppercase hover:cursor-pointer" />-->
				</div>
			</div>
		</header>

		<ul v-if="posts?.length" class="columns-1 gap-6 sm:columns-2 md:columns-3 lg:columns-4">
			<li v-for="post in posts" :key="post.id" class="mb-8 break-inside-avoid-column">
				<NuxtLink :to="`/${post.slug}`" class="group flex flex-col">
					<div class="mb-4 w-full overflow-hidden bg-black/5">
						<NuxtImg :src="imageOf(post).source_url" :alt="imageOf(post).alt_text || ''" :width="imageOf(post).media_details?.width || 800" :height="imageOf(post).media_details?.height || 600" sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" loading="lazy" format="webp" class="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105" />
					</div>

					<h2 class="text-base leading-snug font-semibold group-hover:underline" v-html="post.title.rendered"></h2>

					<div v-if="post.excerpt?.rendered" class="line-clamp-3 text-xs leading-relaxed" v-html="post.excerpt.rendered"></div>
				</NuxtLink>
			</li>
		</ul>
		<!--<ul v-if="posts?.length" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
			<li v-for="post in posts" :key="post.id">
				<NuxtLink :to="`/${post.slug}`" class="group flex h-full flex-col gap-4">
					<div class="aspect-[4/3] overflow-hidden rounded-xl bg-black/5">
						<NuxtImg v-if="imageOf(post)?.source_url" :src="imageOf(post).source_url" :alt="imageOf(post).alt_text || ''" :width="800" :height="600" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" loading="lazy" format="webp" class="size-full object-cover transition-transform duration-300 group-hover:scale-105" />
					</div>
					<time :datetime="post.date" class="text-sm tracking-tight uppercase">{{ formatDate(post.date) }}</time>
					<h2 class="text-xl font-semibold tracking-tight group-hover:underline" v-html="post.title.rendered"></h2>
					<div class="prose line-clamp-3 text-sm" v-html="post.excerpt?.rendered"></div>
				</NuxtLink>
			</li>
		</ul>-->
		<p v-else class="font-display text-center italic">No posts yet.</p>
	</section>
</template>
