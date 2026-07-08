<script setup>
const WP_API_URL = 'https://wp.local/wp-json/wp/v2'

const { data, error } = await useAsyncData('wp-index-data', async () => {
  const [pagesRes, postsRes] = await Promise.all([
    $fetch(`${WP_API_URL}/pages?per_page=10&_fields=id,title,slug`),
    $fetch(`${WP_API_URL}/posts?per_page=10&_fields=id,title,slug,date,excerpt`)
  ])

  return { pages: pagesRes, posts: postsRes }
}, {
  server: false
})

const pages = computed(() => data.value?.pages || [])
const posts = computed(() => data.value?.posts || [])
</script>
<template>
  <main class="max-w-6xl mx-auto px-4 py-12">
    <header class="mb-12 border-b pb-6">
      <h1 class="text-4xl font-extrabold text-gray-900 tracking-tight">WordPress Content Index</h1>
      <p class="mt-2 text-lg text-gray-600">Browse all available pages and articles.</p>
    </header>
		<ClientOnly>
			<div v-if="error" class="p-4 bg-red-50 border border-red-200 rounded-md text-red-800 mb-8">
      <p class="font-semibold">Failed to load content from WordPress.</p>
      <p class="text-sm opacity-90">{{ error.message }}</p>
    </div>

    <div class="grid md:grid-cols-2 gap-12" v-else>
      
      <section>
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          📁 Pages
          <span class="text-sm font-normal text-gray-500">({{ pages?.length || 0 }})</span>
        </h2>
        
        <ul class="space-y-3">
          <li v-for="page in pages" :key="page.id" class="border-b pb-3 last:border-0">
            <NuxtLink 
              :to="`/${page.slug}`" 
              class="text-blue-600 hover:text-blue-800 font-medium transition-colors"
              v-html="page.title.rendered"
            />
          </li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          ✍️ Recent Posts
          <span class="text-sm font-normal text-gray-500">({{ posts?.length || 0 }})</span>
        </h2>

        <div class="space-y-6">
          <article v-for="post in posts" :key="post.id" class="group">
            <NuxtLink :to="`/blog/${post.slug}`" class="block">
              <h3 
                class="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors"
                v-html="post.title.rendered"
              ></h3>
              <time class="text-xs text-gray-400 block mt-1">
                {{ new Date(post.date).toLocaleDateString('en-US', { dateStyle: 'medium' }) }}
              </time>
              <div 
                class="prose prose-sm max-w-none text-gray-600 mt-2 line-clamp-2"
                v-html="post.excerpt.rendered"></div>
            </NuxtLink>
          </article>
        </div>
      </section>

    </div>
		</ClientOnly>
    
  </main>
</template>

