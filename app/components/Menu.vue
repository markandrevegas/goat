<script setup>
const WP_API_URL = 'https://wp.local/wp-json/wp/v2'

const { data: menuItems, status } = await useLazyFetch(`${WP_API_URL}/pages`, {
  key: 'wp-global-menu', 
    query: {
    per_page: 20,
    _fields: 'id,title,slug'
  },
})
</script>
<template>
  <nav class="bg-white border-b border-gray-200">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between h-16 items-center">
        
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="text-xl font-bold text-gray-900 tracking-tight hover:text-blue-600 transition-colors">
            🚀 My Site
          </NuxtLink>
        </div>

        <div class="hidden md:flex space-x-8">
          <span v-if="status === 'pending'" class="text-gray-400 text-sm animate-pulse">
            Loading menu...
          </span>

          <template v-else>
            <NuxtLink 
              v-for="page in menuItems" 
              :key="page.id"
              :to="`/${page.slug}`"
              class="text-gray-600 hover:text-blue-600 font-medium text-sm transition-colors"
              active-class="text-blue-600 font-semibold"
              v-html="page.title.rendered"
            />
          </template>
        </div>

        <div class="hidden md:block">
          <NuxtLink to="/blog" class="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            Blog
          </NuxtLink>
        </div>

      </div>
    </div>
  </nav>
</template>