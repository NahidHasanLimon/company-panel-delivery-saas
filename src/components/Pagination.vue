<template>
  <div class="flex items-center justify-between bg-white dark:bg-gray-800 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
    <div class="flex items-center text-sm text-gray-700 dark:text-gray-300">
      <span>Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} results</span>
    </div>
    
    <div class="flex items-center space-x-2">
      <button 
        @click="$emit('page-change', currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-300"
      >
        Previous
      </button>
      
      <div class="flex space-x-1">
        <button 
          v-for="page in visiblePages" 
          :key="page"
          @click="$emit('page-change', page)"
          class="px-3 py-1 text-sm border rounded-md dark:text-gray-300"
          :class="page === currentPage 
            ? 'bg-blue-600 text-white border-blue-600' 
            : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        @click="$emit('page-change', currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:text-gray-300"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    },
    perPage: {
      type: Number,
      required: true
    }
  },
  emits: ['page-change'],
  computed: {
    startItem() {
      return (this.currentPage - 1) * this.perPage + 1
    },
    endItem() {
      return Math.min(this.currentPage * this.perPage, this.totalItems)
    },
    visiblePages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, this.currentPage + 2)
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    }
  }
}
</script>