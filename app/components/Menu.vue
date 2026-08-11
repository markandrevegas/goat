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
		<nav class="mx-auto flex max-w-6xl flex-col-reverse sm:flex-col">
			<div class="flex justify-center py-8">
				<NuxtLink to="/">
					<Logo class="fill-palladian h-24 w-auto" />
				</NuxtLink>
			</div>
			<div class="w-full">
				<!-- Desktop -->
				<div class="hidden w-full flex justify-center items-center space-x-8 md:flex md:justify-center">
					<span v-if="status === 'pending'" class="animate-pulse text-sm text-gray-400"> Loading... </span>

					<span v-else-if="error" class="text-sm text-red-400"> Failed loading menu </span>

					<template v-else>
						<NuxtLink v-for="page in menuItems" :key="page.id" :to="`/${page.slug}`" class="text-palladian text-sm font-medium transition-colors hover:opacity-70" active-class="text-blue-600 font-semibold" v-html="page.title.rendered" />
					</template>
				</div>

				<!-- Mobile button -->
				<div class="flex w-full flex-row justify-end relative -top-[5rem] md:hidden">
					<button @click="isMobileMenuOpen = !isMobileMenuOpen" type="button" class="text-palladian flex w-full justify-end rounded-md p-2 hover:bg-gray-100 hover:text-gray-900 focus:outline-none" aria-controls="mobile-menu" :aria-expanded="isMobileMenuOpen">
						<MenuIcon :is-open="isMobileMenuOpen" />
						<span class="sr-only">Open main menu</span>
					</button>
				</div>
			</div>
			
			<div class="relative h-24 top-[6rem]">
				<Transition enter-active-class="transition-opacity duration-300 ease-out" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-200 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
					<div v-if="isMobileMenuOpen" class="px-4 pt-2 pb-4 shadow-inner">
						<div class="scrollbar-hide flex snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth">
							<span v-if="status === 'pending'" class="block animate-pulse py-2 text-sm whitespace-nowrap text-gray-400"> Loading menu... </span>

							<span v-else-if="error" class="block py-2 text-sm whitespace-nowrap text-red-400"> Failed loading menu </span>

							<template v-else>
								<NuxtLink v-for="page in menuItems" :key="page.id" :to="`/${page.slug}`" @click="isMobileMenuOpen = false" class="text-palladian shrink-0 snap-start rounded-md px-3 py-2.5 text-base font-medium whitespace-nowrap transition-colors hover:bg-gray-200 hover:text-gray-900" active-class="bg-blue-50 text-blue-600 font-semibold" v-html="page.title.rendered" />
							</template>
						</div>
					</div>
				</Transition>
			</div>
		</nav>
	</ClientOnly>
</template>
