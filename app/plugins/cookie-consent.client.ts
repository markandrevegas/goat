import { useCookieConsent } from "~/composables/useCookieConsent"
export default defineNuxtPlugin(() => {
  const { loadConsent } = useCookieConsent()
  loadConsent()
})