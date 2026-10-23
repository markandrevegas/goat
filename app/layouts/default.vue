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
		<div v-if="$slots['bg-video']" class="relative w-full">
			<slot name="bg-video"></slot>
		</div>

		<div class="relative flex flex-col">
			<main class="flex-grow">
				<div>
					<slot></slot>
				</div>
			</main>
		</div>
	</div>
</template>
