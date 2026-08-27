<script setup lang="ts">
import { ref } from "vue"
import { useWindowScroll } from "@vueuse/core"
import Logo from "~/assets/svg/anchor.svg?component"
import MenuIcon from "./icons/MenuIcon.vue"
import Facebook from "./icons/Facebook.vue"
import Instagram from "./icons/Instagram.vue"
import Linkedin from "./icons/Linkedin.vue"

const { y } = useWindowScroll()
const isMobileMenuOpen = ref(false)
const { getMenu, getPosts } = useWordPress()
const {
	data: menuItems,
	status,
	error
} = await getMenu({
	pages: [61, 64, 71],
	excludePages: [59, 56]
})
const {
	data: postItems
} = await getMenu({
	posts: [51, 1],
	pages: [],
	excludePages: [59, 56, 64, 61, 71, 69]
})
</script>

<template>
	<nav class="fixed top-0 right-0 left-0 z-50 h-24 w-full transition-colors duration-300" :class="y > 0 ? 'bg-brand' : 'bg-transparent'">
		<div class="flex w-full items-center justify-between p-4">
			<div class="max-content flex items-center">
				<NuxtLink to="/">
					<Logo class="fill-palladian h-16 w-auto hidden" />
					<span class="inline-block h-8 w-8 rounded-full bg-palladian mr-4"></span>
				</NuxtLink>
				<div class="hidden md:flex md:flex-col">
					<span class="font-display text-2xl font-light">Floating G.O.A.T.</span>
					<span class="text-[11px] uppercase">Events, Meetings, Apartments</span>
				</div>
			</div>

			<button @click="isMobileMenuOpen = !isMobileMenuOpen" type="button" aria-controls="mobile-menu" :aria-expanded="isMobileMenuOpen">
				<MenuIcon :is-open="isMobileMenuOpen" />
				<span class="sr-only">Open main menu</span>
			</button>
		</div>

		<Transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
			<div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 bg-black/70" @click="isMobileMenuOpen = false"></div>
		</Transition>

		<Transition enter-active-class="transition-transform duration-300 ease-out" enter-from-class="translate-x-full" enter-to-class="translate-x-0" leave-active-class="transition-transform duration-200 ease-in" leave-from-class="translate-x-0" leave-to-class="translate-x-full">
			<div v-if="isMobileMenuOpen" id="mobile-menu" class="bg-palladian fixed top-0 right-0 z-50 h-full w-full max-w-[80vw] overflow-y-auto px-4 pt-6 pb-4 shadow-xl sm:w-84">
				<div class="mb-4 flex justify-end">
					<button @click="isMobileMenuOpen = false" type="button" class="text-brand focus:outline-none">
						<MenuIcon v-model:is-open="isMobileMenuOpen" />
						<span class="sr-only">Close main menu</span>
					</button>
				</div>

				<span v-if="status === 'pending'" class="block animate-pulse py-2 text-sm text-gray-400"> Loading menu... </span>

				<span v-else-if="error" class="block py-2 text-sm text-red-400"> Failed loading menu </span>

				<div v-else class="flex flex-col gap-4 pt-8 text-brand">
					<h3 class="text-sm font-semibold uppercase">Main menu</h3>
					<ul class="space-y-1">
						<li v-for="page in menuItems" :key="page.id">
							<NuxtLink :to="`/${page.slug}`" @click="isMobileMenuOpen = false" class="text-brand w-max text-sm transition-colors" active-class="border-b-2 font-semibold" v-html="page.title.rendered" />
						</li>
					</ul>
					<h3 class="text-sm font-semibold uppercase mt-4">Follow us</h3>
					<div class="flex justify-start gap-2">
						<Instagram />
						<Facebook />
						<Linkedin />
					</div>
					<h3 class="text-sm font-semibold uppercase mt-4">Recent posts</h3>
					<ul class="space-y-1">
						<li v-for="post in postItems" :key="post.id">
							<NuxtLink :to="`/${post.slug}`" @click="isMobileMenuOpen = false" class="text-brand w-max text-sm transition-colors" active-class="border-b-2 font-semibold" v-html="post.title.rendered" />
						</li>
					</ul>
				</div>
			</div>
		</Transition>
	</nav>
</template>
