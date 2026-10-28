<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue"
import MenuIcon from "./icons/MenuIcon.vue"
import Social from "./ui/Social.vue"
import Logo from "~/components/icons/Logo.vue"
import LogoText from "./icons/LogoText.vue"

const isScrolled = ref(false)

function handleScroll() {
	isScrolled.value = window.scrollY > 0
}

onMounted(() => {
	handleScroll()
	window.addEventListener("scroll", handleScroll, { passive: true })
})

onUnmounted(() => {
	window.removeEventListener("scroll", handleScroll)
})

const isMobileMenuOpen = ref(false)
const { getPages, getPosts } = useWordPress()

const {
	data: menuPages,
	status,
	error
} = await getPages({
	include: ["apartments", "meetings-and-events", "rooftop-terrace", "information-for-guests", "about-us"],
	exclude: []
})

const centerOrder = ["meetings-and-events", "rooftop-terrace", "apartments"]

const pageItems = computed(() => {
	if (!menuPages.value) return []
	return menuPages.value.map((item) => {
		if (item.slug === "information-for-guests") {
			return {
				...item,
				title: { ...item.title, rendered: "Information for guests" }
			}
		}
		if (item.slug === "meetings-and-events") {
			return {
				...item,
				title: { ...item.title, rendered: "Meeting and Events" }
			}
		}
		if (item.slug === "about-us") {
			return {
				...item,
				title: { ...item.title, rendered: "About us" }
			}
		}
		return item
	})
})

const { data: centerPages } = await getPages({
	include: centerOrder,
	exclude: []
})

const centerMenuItems = computed(() => {
	if (!centerPages.value) return []
	return centerPages.value.map((item) => ({
		id: item.id,
		title: item.slug === "meetings-and-events" ? "Meetings and Events" : item.title?.rendered || item.title,
		path: `/${item.slug}`
	}))
})

const { data: postItems } = await getPosts({
	exclude: ["uncategorized-sample-post", "hello-world"]
})
</script>

<template>
	<nav aria-label="Main navigation" class="fixed top-0 right-0 left-0 z-50 w-full transition-colors duration-300" :class="isScrolled ? 'bg-brand text-palladian' : 'text-brand'">
		<div class="mx-auto grid h-24 w-full max-w-6xl grid-cols-4 items-center justify-center px-8 py-2">
			<div class="col-span-1 flex justify-start items-center gap-2">
				<NuxtLink to="/">
					<span class="flex justify-center items-center h-12 w-12 rounded-full bg-brand">
						<Logo class="size-6" />
					</span>
					<span class="sr-only">Logo</span>
				</NuxtLink>
				<NuxtLink to="/">
					<LogoText class="w-4/5" />
				</NuxtLink>
			</div>

			<div class="invisible col-span-2 lg:visible">
				<ul v-if="centerMenuItems.length" class="flex items-center justify-start space-x-8 text-[12px]">
					<li v-for="item in centerMenuItems" :key="item.id || item.path">
						<NuxtLink :to="item.path" class="text-palladian transition-opacity hover:opacity-70">
							<span v-html="item.title"></span>
						</NuxtLink>
					</li>
				</ul>
				<span v-else class="text-xs text-gray-400">Loading menu...</span>
			</div>

			<div class="col-span-1 flex items-center justify-end">
				<button @click="isMobileMenuOpen = !isMobileMenuOpen" type="button" aria-label="Open main menu" aria-controls="mobile-menu" :aria-expanded="isMobileMenuOpen">
					<MenuIcon :is-open="isMobileMenuOpen" class="text-palladian" />
				</button>
			</div>
		</div>

		<Transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
			<div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 bg-black/70" @click="isMobileMenuOpen = false"></div>
		</Transition>

		<Transition enter-active-class="transition-transform duration-300 ease-out" enter-from-class="translate-x-full" enter-to-class="translate-x-0" leave-active-class="transition-transform duration-200 ease-in" leave-from-class="translate-x-0" leave-to-class="translate-x-full">
			<div v-if="isMobileMenuOpen" id="mobile-menu" aria-label="Mobile navigation" class="bg-palladian fixed top-0 right-0 z-50 h-full w-full max-w-[80vw] overflow-y-auto px-4 pt-6 pb-4 shadow-xl sm:w-84">
				<div class="mb-4 flex justify-end">
					<button @click="isMobileMenuOpen = false" :aria-label="isMobileMenuOpen ? 'Close main menu' : 'Open main menu'" type="button" class="text-brand focus-visible:outline-2 focus-visible:outline-offset-2">
						<MenuIcon :is-open="isMobileMenuOpen" />
					</button>
				</div>

				<span v-if="status === 'pending'" class="block animate-pulse py-2 text-sm text-gray-400"> Loading menu... </span>

				<span v-else-if="error" class="block py-2 text-sm text-red-400"> Failed loading menu </span>

				<div v-else class="text-brand flex flex-col gap-4 pt-8">
					<h3 class="text-sm font-semibold uppercase">Main menu</h3>
					<ul class="space-y-2">
						<li v-for="page in pageItems" :key="page.id">
							<NuxtLink :to="`/${page.slug}`" @click="isMobileMenuOpen = false" class="text-brand w-max text-sm font-semibold transition-colors duration-400 hover:border-b-2" active-class="border-b-2" v-html="page.title.rendered" />
						</li>
					</ul>
					<h3 class="mt-4 text-sm font-semibold uppercase">Follow us</h3>
					<Social class="mr-auto" />
					<h3 class="mt-4 hidden text-sm font-semibold uppercase">Recent posts</h3>
					<ul class="hidden space-y-1">
						<li v-for="post in postItems" :key="post.id">
							<NuxtLink :to="`/${post.slug}`" @click="isMobileMenuOpen = false" class="text-brand w-max text-sm font-semibold transition-colors duration-400 hover:border-b-2" active-class="border-b-2" v-html="post.title.rendered" />
						</li>
					</ul>
				</div>
			</div>
		</Transition>
	</nav>
</template>
