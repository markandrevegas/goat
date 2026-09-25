<script setup lang="ts">
import Social from "./ui/Social.vue"

const { getPages } = useWordPress()

const {
	data: footerPages,
	status,
	error
} = await getPages({
	include: ["terms-and-conditions", "privacy-policy"],
	exclude: []
})

const pageItems = computed(() => {
	const list = unref(footerPages)
	if (!list || !Array.isArray(list)) return []

	return list.map((item) => {
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
	<ClientOnly>
		<footer class="bg-palladian text-brand text-sm/7">
			<div class="grid flex-shrink-0 grid-cols-1 gap-8 p-8 py-24 sm:mx-auto sm:max-w-6xl sm:grid-cols-2 md:grid-cols-4">
				<div class="flex flex-col gap-1">
					<p class="font-display mb-2 text-lg font-semibold">Floating G.O.A.T.</p>
					<p>Langebrogade 1C<br />1411 København K<br />CVR: 44307987</p>
				</div>
				<div class="flex flex-col">
					<p class="font-display mb-2 text-lg font-semibold">Kontakt</p>
					<p>
						info@floatinggoat.dk<br />
						Telefontid: Hverdage 9-18<br />
						+45 30104262
					</p>
				</div>
				<div class="flex flex-col">
					<p class="font-display mb-2 text-lg font-semibold">Information</p>
					<div v-if="status === 'pending'" class="text-center text-sm">Pending</div>
					<div v-else-if="error" class="text-center text-sm text-red-600">Error</div>
					<ul v-else-if="pageItems.length" class="list-reset">
						<li v-for="item in pageItems" :key="item.id" class="w-max">
							<NuxtLink :to="`/${item.slug}`" class="w-max font-semibold transition-opacity duration-400 hover:border-b-2" v-html="item.title.rendered"></NuxtLink>
						</li>
					</ul>
				</div>
				<div class="flex flex-col">
					<p class="font-display mb-2 text-lg font-semibold">Find os</p>
					<Social class="max-content mr-auto" />
				</div>
			</div>
			<div class="py-8 text-center">&copy; {{ new Date().getFullYear() }}</div>
		</footer>
	</ClientOnly>
</template>
