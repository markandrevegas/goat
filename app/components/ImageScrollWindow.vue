<script setup lang="ts">
import moodImg from "~/assets/images/byenspuls.webp"
</script>
<template>
  <section class="relative">
    <!-- Background -->
    <div class="sticky top-0 h-[50vh]">
			<NuxtImg :src="moodImg" loading="lazy" class="h-full w-full object-cover" alt="Events" sizes="100vw" />
      <div class="absolute inset-0 bg-black/30" />
    </div>

    <!-- Foreground -->
    <div class="relative z-10 -mt-[50vh]">
      <section class="flex h-[50vh] items-center justify-center px-6 text-white">
        <div class="max-w-2xl text-center">
          <h1 class="text-5xl">
            Vandets ro og byens puls
          </h1>
        </div>
      </section>

      <section class="flex min-h-screen items-center justify-center bg-white px-6">
        <div class="max-w-3xl">
          <h2 class="text-4xl font-bold">
            The next section
          </h2>

          <p class="mt-6 text-lg">
            Once the sticky container ends, the image leaves the viewport
            naturally.
          </p>
        </div>
      </section>
    </div>
  </section>
</template>
