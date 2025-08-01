<template>
  <div class="fixed top-4 right-4 z-50 space-y-2">
    <div
      v-for="toast in toasts"
      :key="toast.id"
      :class="[
        'max-w-sm px-6 py-4 rounded-lg shadow-xl transform transition-all duration-300 ease-in-out',
        'flex items-center space-x-3 border-2 backdrop-blur-sm',
        toastClasses[toast.type],
        toast.show ? 'translate-x-0' : 'translate-x-full'
      ]"
    >
      <!-- Icon -->
      <button 
        @click="removeToast(toast.id)"
        class="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
        title="Close notification"
      >
        <svg v-if="toast.type === 'success'" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="toast.type === 'error'" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="toast.type === 'warning'" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
      </button>

      <!-- Message -->
      <div class="flex-1 text-sm font-semibold leading-relaxed">
        {{ toast.message }}
      </div>

      <!-- Close Button -->
      <button
        @click="removeToast(toast.id)"
        class="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
      >
        <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
import { useToastStore } from '../stores/toast'
import { storeToRefs } from 'pinia'

export default {
  name: 'ToastContainer',
  setup() {
    const toastStore = useToastStore()
    const { toasts } = storeToRefs(toastStore)

    const toastClasses = {
      success: 'bg-green-100 dark:bg-green-800 text-green-900 dark:text-green-100 border-green-300 dark:border-green-600 shadow-green-200/50 dark:shadow-green-900/50',
      error: 'bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-600 shadow-red-200/30 dark:shadow-red-900/30',
      warning: 'bg-yellow-100 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 border-yellow-300 dark:border-yellow-600 shadow-yellow-200/50 dark:shadow-yellow-900/50',
      info: 'bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100 border-blue-300 dark:border-blue-600 shadow-blue-200/50 dark:shadow-blue-900/50'
    }

    const removeToast = (id) => {
      toastStore.remove(id)
    }

    return {
      toasts,
      toastClasses,
      removeToast
    }
  }
}
</script>
