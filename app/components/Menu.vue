<script setup lang="ts">
import { ref } from "vue"
import { useWindowScroll } from "@vueuse/core"
import Logo from "~/assets/svg/anchor.svg?component"
import MenuIcon from "./icons/MenuIcon.vue"

const { y } = useWindowScroll()
const isMobileMenuOpen = ref(false)
const {
	data: menuItems,
	status,
	error
} = await useWordPressMenu({
	pages: [2],
	posts: [1]
})
</script>

<template>
	<nav class="fixed top-0 right-0 left-0 z-50 h-24 w-full transition-colors duration-300" :class="y > 0 ? 'bg-brand' : 'bg-transparent'">
		<div class="flex w-full items-center justify-between p-4">
			<div class="max-content flex items-center">
				<NuxtLink to="/">
					<Logo class="fill-palladian h-16 w-auto" />
				</NuxtLink>
				<div class="hidden md:flex md:flex-col">
					<span class="font-display text-3xl font-light">Floating G.O.A.T.</span>
					<span class="text-xs font-semibold uppercase">Events, Meetings, Apartments</span>
				</div>
			</div>

			<button @click="isMobileMenuOpen = !isMobileMenuOpen" type="button" aria-controls="mobile-menu" :aria-expanded="isMobileMenuOpen">
				<MenuIcon :is-open="isMobileMenuOpen" />
				<span class="sr-only">Open main menu</span>
			</button>
		</div>

		<Transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
			<div v-if="isMobileMenuOpen" class="fixed inset-0 z-40 bg-black/50" @click="isMobileMenuOpen = false"></div>
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

				<div v-else class="flex flex-col gap-4 pt-8">
					<NuxtLink v-for="page in menuItems" :key="page.id" :to="`/${page.slug}`" @click="isMobileMenuOpen = false" class="text-brand text-base font-medium transition-colors w-max" active-class="border-b-2 font-semibold" v-html="page.title.rendered" />
				</div>
			</div>
		</Transition>
	</nav>
</template>
