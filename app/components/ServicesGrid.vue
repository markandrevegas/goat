<script setup lang="ts">
import meetingImg from "~/assets/images/meeting.webp"
import eventsImg from "~/assets/images/events.webp"
import workshopImg from "~/assets/images/workshop.webp"
</script>
<template>
	<div class="text-palladian grid h-full w-full gap-4 px-8 sm:grid-cols-2 md:grid-cols-4">
		<div class="relative flex-shrink-0">
			<NuxtImg :src="meetingImg" loading="lazy" class="h-auto w-full" alt="Events"></NuxtImg>
			<div class="absolute inset-0 z-10 flex flex-col justify-end gap-1 p-8">
				<p class="font-display text-xl/6 font-semibold">Møder og strategidage</p>
				<p class="font-light">Hold møde med panoramaudsigt ud over vandet og til Københavns spir og tage.</p>
			</div>
			<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
		</div>

		<div class="relative flex-shrink-0">
			<NuxtImg :src="eventsImg" loading="lazy" class="h-auto w-full" alt="Events"></NuxtImg>
			<div class="absolute inset-0 z-10 flex flex-col justify-end gap-1 p-8">
				<p class="font-display text-xl/6 font-semibold">Events og receptioner</p>
				<p class="font-light">Skab en helt særlig ramme om jeres arrangement med byens liv og vandets ro som baggrundstæppe.</p>
			</div>
			<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
		</div>
		<div class="relative flex-shrink-0">
			<NuxtImg :src="workshopImg" loading="lazy" class="h-auto w-full" alt="Events"></NuxtImg>
			<div class="absolute inset-0 z-10 flex flex-col justify-end gap-1 p-8">
				<p class="font-display text-xl/6 font-semibold">Workshops og teambuilding</p>
				<p class="font-light">Omsæt indsigt til handling. Floating G.O.A.T. er et perfekt sted til at tænke nye tanker og blive inspireret.</p>
			</div>
			<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
		</div>
		<div class="relative flex-shrink-0">
			<NuxtImg :src="eventsImg" loading="lazy" class="h-auto w-full" alt="Events"></NuxtImg>
			<div class="absolute inset-0 z-10 flex flex-col justify-end gap-1 p-8">
				<p class="font-display text-xl/6 font-semibold">Workshops og teambuilding</p>
				<p class="font-light">Omsæt indsigt til handling. Floating G.O.A.T. er et perfekt sted til at tænke nye tanker og blive inspireret.</p>
			</div>
			<div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
		</div>
	</div>
</template>
