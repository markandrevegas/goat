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

function sharePage(platform: "instagram" | "facebook" | "linkedin", profileUrl?: string) {
	if (!process.client) return

	const currentUrl = encodeURIComponent(window.location.href)

	if (platform === "instagram") {
		if (profileUrl) {
			window.open(profileUrl, "_blank", "noopener,noreferrer")
		}
		return
	}

	let shareEndpoint = ""
	if (platform === "facebook") {
		shareEndpoint = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`
	} else if (platform === "linkedin") {
		shareEndpoint = `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`
	}

	const width = 600
	const height = 600
	const left = (window.innerWidth - width) / 2
	const top = (window.innerHeight - height) / 2

	window.open(shareEndpoint, "ShareDialog", `width=${width},height=${height},top=${top},left=${left},toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=yes`)
}
</script>

<template>
	<div class="mt-4 flex items-center justify-center gap-4">
		<Instagram v-if="props.instagramUrl" @click="sharePage('instagram', props.instagramUrl)" class="transition-transform duration-300 hover:scale-110 hover:cursor-pointer" :url="props.instagramUrl" :size="props.iconSize" />
		<Facebook v-if="props.facebookUrl" @click="sharePage('facebook')" class="transition-transform duration-300 hover:scale-110 hover:cursor-pointer" :url="props.facebookUrl" :size="props.iconSize" />
		<Linkedin v-if="props.linkedinUrl" @click="sharePage('linkedin')" class="transition-transform duration-300 hover:scale-110 hover:cursor-pointer" :url="props.linkedinUrl" :size="props.iconSize" />
	</div>
</template>
