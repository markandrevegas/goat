<!-- components/ui/SocialLinks.vue -->
<script setup lang="ts">
import Instagram from "~/components/icons/Instagram.vue"
import Facebook from "~/components/icons/Facebook.vue"
import Linkedin from "~/components/icons/Linkedin.vue"

interface Props {
	instagramUrl?: string
	facebookUrl?: string
	linkedinUrl?: string
	iconSize?: number
}

const props = withDefaults(defineProps<Props>(), {
	facebookUrl: "https://facebook.com/FloatingGOATCopenhagen",
	instagramUrl: "https://instagram.com/floating_goat_cph/",
	linkedinUrl: "https://linkedin.com/company/mar-k-waterside",
	iconSize: 24
})
</script>

<template>
	<div class="mt-4 flex items-center justify-center gap-4">
		<Instagram v-if="props.instagramUrl" class="transition-transform duration-300 hover:scale-110 hover:cursor-pointer" :url="props.instagramUrl" :size="props.iconSize" />
		<Facebook v-if="props.facebookUrl" class="transition-transform duration-300 hover:scale-110 hover:cursor-pointer" :url="props.facebookUrl" :size="props.iconSize" />
		<Linkedin v-if="props.linkedinUrl" class="transition-transform duration-300 hover:scale-110 hover:cursor-pointer" :url="props.linkedinUrl" :size="props.iconSize" />
	</div>
</template>
