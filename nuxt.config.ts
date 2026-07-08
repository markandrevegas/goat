export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@tailwindcss/typography'],
  /*tailwindcss: {
    config: {
      plugins: [
        require('@tailwindcss/typography')
      ]
    }
  },*/
  runtimeConfig: {
    public: {
      wpApiBaseUrl: process.env.WP_API_BASE_URL
    }
  },
  future: {
    compatibilityVersion: 4
  },
  vite: {
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  }
})