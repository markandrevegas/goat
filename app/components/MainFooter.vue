<script setup lang="ts">
import Linkedin from "./icons/Linkedin.vue"
import Instagram from "./icons/Instagram.vue"
import Facebook from "./icons/Facebook.vue"

const { getPages } = useWordPress()
const { data: menuPages } = await getPages({
	include: ["betingelser", "lejebetingleser-for-private", "lejebetingleser-for-erhverv", "information-for-guests", "privatlivspolitik"],
	exclude: ["privacy-policy", "terms-of-service", "cookiepolitik"]
})
const pageItems = computed(() => {
	if (!menuPages.value) return []
	return menuPages.value.map((item) => {
		if (item.slug === "information-for-guests") {
			return {
				...item,
				title: { ...item.title, rendered: "Information for guests" }
			}
		}
		return item
	})
})
</script>
<template>
	<footer class="text-base/6">
		<div class="grid flex-shrink-0 grid-cols-1 gap-4 p-8 py-24 sm:mx-auto sm:max-w-6xl sm:grid-cols-2 md:grid-cols-4">
			<div class="flex flex-col gap-1">
				<p class="font-display text-lg font-semibold">Floating G.O.A.T.</p>
				<p>Langebrogade 1C<br />1411 København K<br />CVR: 44307987</p>
			</div>
			<div class="flex flex-col">
				<p class="font-display text-lg font-semibold">Kontakt</p>
				<p>
					info@floatinggoat.dk<br />
					Telefontid: Hverdage 9-18<br />
					+45 30104262
				</p>
			</div>
			<div class="flex flex-col">
				<p class="font-display text-lg font-semibold">Information</p>
				<ul class="list-reset">
					<li v-for="item in pageItems" :key="item.id">
						<NuxtLink :to="item.slug" class="underline transition-opacity duration-400 hover:decoration-2">{{ item.title.rendered }}</NuxtLink>
					</li>
				</ul>
			</div>
			<div class="flex flex-col">
				<p class="font-display text-lg font-semibold">Find os</p>
				<div class="fill-palladian flex w-full justify-start gap-4">
					<Instagram class="size-6" />
					<Facebook class="size-6" />
					<Linkedin class="size-6" />
				</div>
			</div>
		</div>
		<div class="py-8 text-center">&copy; {{ new Date().getFullYear() }}</div>
	</footer>
</template>
