<script setup lang="ts">
useHead({
	link: [
		{
			rel: "preload",
			href: "/_fonts/HgJel4iAS5mDVqJaDUYKmxaMJg4zKHTGmyD1FQkOsTM-2hVuuQIZ4GSGMgNv6dvlqz7cfD6lr7xLohUph7OCgFg.woff2",
			as: "font",
			type: "font/woff2",
			crossorigin: "anonymous"
		},
		{
			rel: "preload",
			href: "/_fonts/pZrE-slef2USYSteHMofh38tG-0x5V8w3-m5O8o55BA-2lkoGCOmO7jeyF1uZ0eej8W_w9soLdR904X6bIAsF0k.woff2",
			as: "font",
			type: "font/woff2",
			crossorigin: "anonymous"
		},
		{
			rel: "preload",
			href: "/_fonts/pBA_EGUUgytVcAn30G3L7jSPUjTfQBkUF_SVrKXvks4-P8M5mJujzuY5Rvr7oSsGgEy3RgI8I6ZroH9ErPwewNI.woff2",
			as: "font",
			type: "font/woff2",
			crossorigin: "anonymous"
		}
	]
})
</script>

<template>
	<div class="relative min-h-screen">
		<Menu />
		<div v-if="$slots['bg-video']" class="relative min-h-screen w-full overflow-hidden">
			<slot name="bg-video"></slot>
		</div>

		<div class="relative flex min-h-screen flex-col">
			<main class="flex-grow">
				<slot></slot>
			</main>
			<MainFooter />
		</div>
	</div>
</template>
