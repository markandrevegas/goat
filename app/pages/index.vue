<script setup>
import { computed, watch } from "vue"
import Marquee from "~/components/ui/Marquee.vue"
import CardScroller from "~/components/ui/CardScroller.vue"
import meetingImg from "~/assets/images/meeting.webp"
import eventsImg from "~/assets/images/events.webp"
import workshopImg from "~/assets/images/workshop.webp"

definePageMeta({
	layout: false
})

const config = useRuntimeConfig()
const wordpressUrl = config.public.wordpressUrl
const pageFields = ["id", "title", "slug", "excerpt"]

const { data, status, error } = await useAsyncData(
	"wp-index-data",
	async () => {
		const [pagesRes, postsRes] = await Promise.all([
			$fetch(`${wordpressUrl}/pages`, {
				baseURL: "",
				query: { per_page: 10, _fields: pageFields.join(",") }
			}),
			$fetch(`${wordpressUrl}/posts`, {
				baseURL: "",
				query: { per_page: 10, _fields: pageFields.join(",") }
			})
		])

		return { pages: pagesRes || [], posts: postsRes || [] }
	},
	{
		server: false,
		lazy: true
	}
)

const pages = computed(() => data.value?.pages || [])
const posts = computed(() => data.value?.posts || [])

const homePage = computed(() => {
	return pages.value.find((p) => p.slug === "home" || p.slug === "index") || pages.value[0] || null
})
const seoTitle = computed(() => {
	return homePage.value?.title?.rendered?.replace("&#8211;", "").replace("MAR-K Waterside", "").trim()
})

const excerpt = computed(() => {
	return homePage.value?.excerpt?.rendered
})

const seoDescription = computed(() => {
	if (homePage.value?.excerpt?.rendered) {
		return homePage.value.excerpt.rendered.replace(/<[^>]*>?/gm, "").trim()
	}

	return "Discover our latest articles, insights, and updates."
})

const ogImage = computed(() => {
	return homePage.value?.yoast_head_json?.og_image?.[0]?.url || "/default-og.jpg"
})

useSeoMeta({
	title: seoTitle,
	titleTemplate: null,
	metaTitle: seoTitle,
	description: seoDescription,
	ogTitle: seoTitle,
	ogDescription: seoDescription,
	ogImage: ogImage,
	ogType: "website",
	twitterCard: "summary_large_image",
	twitterTitle: seoTitle,
	twitterDescription: seoDescription,
	twitterImage: ogImage
})
</script>
<template>
	<NuxtLayout name="default">
		<template #bg-video>
			<IndexVideo :title="seoTitle" :subtitle="seoDescription" />
		</template>
		<Marquee
			:items="[
				{ logo: 'https://placehold.co/64x64', label: 'Acme Corp' },
				{ logo: 'https://placehold.co/64x64', label: 'Globex' },
				{ logo: 'https://placehold.co/64x64', label: 'Initech' }
			]"
			:speed="20"
		/>
		<FirstRow />
		<CardScroller
			:items="[
				{ img: meetingImg, title: 'Møder og strategidage', description: 'Hold møde med panoramaudsigt ud over vandet og til Københavns spir og tage.' },
				{ img: eventsImg, title: 'Events og receptioner', description: 'Skab en helt særlig ramme om jeres arrangement med byens liv og vandets ro som baggrundstæppe.' },
				{ img: workshopImg, title: 'Workshops og teambuilding', description: 'Omsæt indsigt til handling. Floating G.O.A.T. er et perfekt sted til at tænke nye tanker og blive inspireret.' },
				{ img: eventsImg, title: 'Workshops og teambuilding', description: 'Omsæt indsigt til handling. Floating G.O.A.T. er et perfekt sted til at tænke nye tanker og blive inspireret.' }
			]"
		/>
		<!--<ServicesGrid />-->
		<div class="mx-auto hidden max-w-6xl px-4 py-12">
			<ClientOnly>
				<div v-if="status === 'pending'">
					<span class="animate-pulse text-sm text-gray-400"> Loading... </span>
				</div>
				<div v-else-if="error" class="mb-8 rounded-md border border-red-200 bg-red-50 p-4 text-red-800">
					<p class="font-semibold">Failed to load content from WordPress.</p>
					<p class="text-sm opacity-90">{{ error.message }}</p>
				</div>

				<div class="grid gap-12 md:grid-cols-2" v-else>
					<section>
						<h2 class="mb-6 flex items-center gap-2 text-2xl font-bold">
							Pages
							<span class="text-sm font-normal text-gray-500">({{ pages?.length || 0 }})</span>
						</h2>

						<ul class="space-y-3">
							<li v-for="page in pages" :key="page.id" class="border-b pb-3 last:border-0">
								<NuxtLink :to="`/${page.slug}`" class="font-medium text-blue-600 transition-colors hover:text-blue-800" v-html="page.title.rendered" />
							</li>
						</ul>
					</section>
				</div>
			</ClientOnly>
		</div>
	</NuxtLayout>
</template>
