export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  router.afterEach((to) => {
    nextTick(() => {
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({
        event: "page_view",
        page_path: to.fullPath,
        page_title: document.title
      })
    })
  })
})