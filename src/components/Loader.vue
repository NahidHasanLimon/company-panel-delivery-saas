<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
    <div class="flex flex-col items-center">
      <svg class="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span class="mt-4 text-blue-700 dark:text-blue-300 font-semibold">Loading...</span>
    </div>
  </div>
</template>

<script setup>
// No script needed for simple loader
</script>

<style scoped>
</style>
