<script setup lang="ts">
const { trackEvent } = useTrackEvent()

const handleButtonClick = () => {
  trackEvent('test_click', {
    button_name: 'menu_cta'
  })
}
</script>

<template>
  <div class="p-8">
    <button 
      @click="handleButtonClick" 
      class="rounded bg-blue-600 px-4 py-2 font-medium text-white shadow transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Fire GA4 Test Event
    </button>
  </div>
</template>