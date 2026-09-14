<script setup lang="ts">
const widgetId = '901be4667e89303bb536335194e'
interface ReviewResponse {
  status: string
  source: string
  data?: any
  html?: string
}const { data: payload, pending, error } = await useFetch<ReviewResponse>(
  'https://your-wordpress-site.com/wp-json/custom/v1/trustindex-reviews',
  {
    key: 'trustindex-wp-api',
    // Cache payload on client-side navigations
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key],
  }
)

useHead({
	link: [
    {
      rel: 'stylesheet',
      href: `https://cdn.trustindex.io/assets/widget-pres-v2.css`
    },
    {
      rel: 'stylesheet',
      href: `https://cdn.trustindex.io/assets/platform/Google/icon.css`
    }
  ],
  script: [
    {
      src: `https://cdn.trustindex.io/loader.js?${widgetId}`,
      async: true,
      defer: true,
    },
  ],
})
</script>

<template>
  <div class="reviews-section">
    <div v-if="pending" class="loading">Loading reviews...</div>
    <div v-else-if="error" class="error">Failed to load reviews.</div>

    <!-- Render if WP returned raw HTML shortcode string -->
    <div 
      v-else-if="payload?.html" 
      class="trustindex-html" 
      v-html="payload.html" 
    />

    <!-- Render custom Vue markup if WP returned raw JSON data -->
    <div v-else-if="payload?.data" class="custom-reviews-grid">
      <!-- Loop through custom reviews object returned from options -->
      <pre>{{ payload.data }}</pre>
    </div>
  </div>
  <!--<div class="trustindex-wrapper relative h-96 bg-red-200">
		<div v-if="payload" v-html="payload"></div>
    <div :id="`trustindex-widget-${widgetId}`"></div>
  </div>-->
</template>