<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <Menu />

    <div class="flex-grow">
      <slot></slot>
    </div>

    <footer class="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-500">
      &copy; {{ new Date().getFullYear() }} My Headless WP Site.
    </footer>
  </div>
</template>