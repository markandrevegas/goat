<script setup lang="ts"></script>
<template>
	<footer class="bg-palladian text-brand">
		<div class="grid flex-shrink-0 grid-cols-1 gap-4 p-8 py-24 sm:mx-auto sm:max-w-6xl sm:grid-cols-2 md:grid-cols-4">
			<div class="flex flex-col gap-1">
				<p class="font-display font-semibold">MAR-K WATERSIDE</p>
				<p class="text-sm">Langebrogade 1C<br />1411 København K<br />CVR: 44307987</p>
			</div>
			<div class="flex flex-col">
				<p class="font-display font-semibold">Kontakt</p>
				<p class="text-sm">
					info@mar-k.dk<br />
					Telefontid: Hverdage 9-18<br />
					+45 30104262
				</p>
			</div>
			<div class="flex flex-col">
				<p class="font-display font-semibold">Information</p>
			</div>
			<div class="flex flex-col">
				<p class="font-display font-semibold">Find os</p>
			</div>
		</div>
		<div class="py-8 text-center">&copy; {{ new Date().getFullYear() }}</div>
	</footer>
</template>
