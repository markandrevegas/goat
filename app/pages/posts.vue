<script setup lang="ts">
const { getPostCards } = useWordPress()
const { data: posts } = await getPostCards({ exclude: ["hello-world"] })

const formatDate = (iso: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso))

const imageOf = (post: any) => post._embedded?.["wp:featuredmedia"]?.[0]

useSeoMeta({
	title: "Blog",
	ogTitle: "Blog"
})
</script>

<template>
	<section class="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
		<h1 class="mb-12 text-center text-4xl tracking-tight md:text-5xl">Blog</h1>

		<ul v-if="posts?.length" class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
		</ul>
		<p v-else class="text-center font-display italic">No posts yet.</p>
	</section>
</template>