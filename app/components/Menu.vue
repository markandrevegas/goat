<script setup lang="ts">
import { ref, computed } from "vue"

const isMobileMenuOpen = ref(false)
const { data, status, error } = await useMenu()
const menuItems = computed(() => data.value || [])
</script>

<template>
	<ClientOnly>
		<nav class="sticky top-0 z-50 border-b border-gray-200 bg-white">
			<div class="mx-auto max-w-6xl px-4">
				<div class="flex h-16 items-center justify-between">
					<div class="flex-shrink-0">
						<NuxtLink to="/" class="text-xl font-bold tracking-tight text-gray-900 transition-colors hover:text-blue-600"> goat </NuxtLink>
					</div>

					<!-- Desktop -->
					<div class="hidden items-center space-x-8 md:flex">
						<span v-if="status === 'pending'" class="animate-pulse text-sm text-gray-400"> Loading... </span>

						<span v-else-if="error" class="text-sm text-red-400"> Failed loading menu </span>
						
						<template v-else>
							<NuxtLink v-for="page in menuItems" :key="page.id" :to="`/${page.slug}`" class="text-sm font-medium text-gray-600 transition-colors hover:text-blue-600" active-class="text-blue-600 font-semibold" v-html="page.title.rendered" />
						</template>
						<EventButton />
					</div>

					<!-- Mobile button -->
					<div class="flex items-center md:hidden">
						<button @click="isMobileMenuOpen = !isMobileMenuOpen" type="button" class="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none" aria-controls="mobile-menu" :aria-expanded="isMobileMenuOpen">
							<span class="sr-only">Open main menu</span>

							<svg v-if="!isMobileMenuOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
							</svg>

							<svg v-else class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
							</svg>
						</button>
					</div>
				</div>
			</div>

			<!-- Mobile menu -->
			<Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
				<div v-show="isMobileMenuOpen" id="mobile-menu" class="overflow-hidden bg-gray-50 md:hidden">
					<div class="space-y-2 px-4 pb-4 pt-2 shadow-inner">
						<span v-if="status === 'pending'" class="block animate-pulse py-2 text-sm text-gray-400"> Loading menu... </span>

						<span v-else-if="error" class="block py-2 text-sm text-red-400"> Failed loading menu </span>

						<template v-else>
							<NuxtLink v-for="page in menuItems" :key="page.id" :to="`/${page.slug}`" @click="isMobileMenuOpen = false" class="block rounded-md px-3 py-2.5 text-base font-medium text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-900" active-class="bg-blue-50 text-blue-600 font-semibold" v-html="page.title.rendered" />
						</template>
						<EventButton />
					</div>
				</div>
			</Transition>
		</nav>
	</ClientOnly>
</template>
