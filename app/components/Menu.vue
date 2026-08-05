<script setup lang="ts">
import { ref, computed } from "vue"
import Logo from "~/assets/svg/anchor.svg?component"
import MenuIcon from "./ui/MenuIcon.vue"

const isMobileMenuOpen = ref(false)
const { data, status, error } = await useMenu()
const menuItems = computed(() => data.value || [])
</script>

<template>
	<ClientOnly>
		<nav class="sticky top-0 z-50 sm:pl-24">
			<div class="sm:px-8">
				<div class="w-full">
					<!-- Desktop -->
					<div class="hidden items-center space-x-8 md:flex">
						<span v-if="status === 'pending'" class="animate-pulse text-sm text-gray-400"> Loading... </span>

						<span v-else-if="error" class="text-sm text-red-400"> Failed loading menu </span>

						<template v-else>
							<NuxtLink v-for="page in menuItems" :key="page.id" :to="`/${page.slug}`" class="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600" active-class="text-blue-600 font-semibold" v-html="page.title.rendered" />
						</template>
					</div>

					<!-- Mobile button -->
					<div class="relative flex w-full flex-col md:hidden">
						<button @click="isMobileMenuOpen = !isMobileMenuOpen" type="button" class="flex w-full justify-end rounded-md p-2 text-white hover:bg-gray-100 hover:text-gray-900 focus:outline-none" aria-controls="mobile-menu" :aria-expanded="isMobileMenuOpen">
							<MenuIcon :is-open="isMobileMenuOpen" />
							<span class="sr-only">Open main menu</span>

							<!--<svg v-if="!isMobileMenuOpen" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
							</svg>

							<svg v-else class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>-->
						</button>
					</div>
				</div>
				<div class="mt-8 flex flex-shrink-0 items-center justify-start">
					<NuxtLink to="/"><Logo class="h-16 w-auto fill-white" /></NuxtLink>
					<span class="text-2xl">floating g.o.a.t.</span>
				</div>
				<div class="relative h-16">
					<Transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
						<div v-if="isMobileMenuOpen" class="space-y-2 px-4 pt-2 pb-4 shadow-inner">
							<span v-if="status === 'pending'" class="block animate-pulse py-2 text-sm text-gray-400"> Loading menu... </span>

							<span v-else-if="error" class="block py-2 text-sm text-red-400"> Failed loading menu </span>

							<template v-else>
								<NuxtLink v-for="page in menuItems" :key="page.id" :to="`/${page.slug}`" @click="isMobileMenuOpen = false" class="rounded-md px-3 py-2.5 text-base font-medium text-white transition-colors hover:bg-gray-200 hover:text-gray-900" active-class="bg-blue-50 text-blue-600 font-semibold" v-html="page.title.rendered" />
							</template>
						</div>
					</Transition>
				</div>
			</div>
		</nav>
	</ClientOnly>
</template>
