<script setup lang="ts">
import { ref } from "vue"
import Logo from "~/assets/svg/anchor.svg?component"
import MenuIcon from "./icons/MenuIcon.vue"
defineProps<{
	items: any[]
	loading?: boolean
}>()
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
	<nav class="mx-auto flex max-w-6xl flex-col">
		<div class="flex w-full justify-between sm:justify-center">
			<!-- Desktop -->
			<div class="w-max text-center md:pt-16">
				<NuxtLink to="/">
					<Logo class="fill-palladian mx-auto mb-8 h-16 w-auto" />
				</NuxtLink>
				<div class="hidden space-x-8 sm:flex">
					<span v-if="status === 'pending'" class="animate-pulse text-sm text-gray-400"> Loading... </span>

					<span v-else-if="error" class="text-sm text-red-400"> Failed loading menu </span>

					<template v-else>
						<NuxtLink v-for="page in menuItems" :key="page.id" :to="`/${page.slug}`" class="text-sm font-medium transition-colors hover:border-b-2" active-class="border-b-2 font-semibold" v-html="page.title.rendered" />
					</template>
				</div>
			</div>

			<!-- Mobile button -->
			<div class="flex w-max justify-end md:hidden">
				<button @click="isMobileMenuOpen = !isMobileMenuOpen" type="button" class="text-palladian flex w-full justify-end rounded-md p-2 hover:bg-gray-100 hover:text-gray-900 focus:outline-none" aria-controls="mobile-menu" :aria-expanded="isMobileMenuOpen">
					<MenuIcon :is-open="isMobileMenuOpen" />
					<span class="sr-only">Open main menu</span>
				</button>
			</div>
		</div>
		<div class="mt-8 flex flex-shrink-0 flex-col items-center justify-start sm:items-start">
			<NuxtLink to="/">
				<Logo class="fill-palladian hidden h-24 w-auto" />
			</NuxtLink>
			<span class="hidden text-2xl">floating g.o.a.t.</span>
		</div>
		<div class="relative h-24">
			<Transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
				<div v-if="isMobileMenuOpen" class="px-4 pt-2 pb-4 shadow-inner">
					<div class="scrollbar-hide flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth">
						<span v-if="status === 'pending'" class="block animate-pulse py-2 text-sm whitespace-nowrap text-gray-400"> Loading menu... </span>

						<span v-else-if="error" class="block py-2 text-sm whitespace-nowrap text-red-400"> Failed loading menu </span>

						<template v-else>
							<NuxtLink v-for="page in menuItems" :key="page.id" :to="`/${page.slug}`" @click="isMobileMenuOpen = false" class="text-palladian shrink-0 snap-start rounded-md px-3 py-2.5 text-base font-medium whitespace-nowrap transition-colors hover:bg-gray-200 hover:text-gray-900" active-class="font-bold" v-html="page.title.rendered" />
						</template>
					</div>
				</div>
			</Transition>
		</div>
	</nav>
</template>
