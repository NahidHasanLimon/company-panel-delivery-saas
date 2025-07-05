<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg card-shadow p-4 mb-4">
    <div class="flex items-center justify-between mb-3">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white">Search & Filter</h3>
      <button 
        @click="toggleFilters"
        class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium flex items-center space-x-1"
      >
        <Filter class="h-4 w-4" />
        <span>{{ showAdvanced ? 'Hide' : 'More' }}</span>
      </button>
    </div>
    
    <!-- Basic Search -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
      <div>
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
        <div class="relative">
          <Search class="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
          <input 
            v-model="filters.search"
            type="text" 
            placeholder="Search..."
            class="w-full pl-7 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            @input="$emit('filter-change', filters)"
          >
        </div>
      </div>
      
      <div v-if="showStatus">
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
        <select 
          v-model="filters.status"
          class="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          @change="$emit('filter-change', filters)"
        >
          <option value="">All Status</option>
          <option v-for="status in statusOptions" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>
      
      <div v-if="showDeliveryman">
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Deliveryman</label>
        <select 
          v-model="filters.deliveryman"
          class="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          @change="$emit('filter-change', filters)"
        >
          <option value="">All</option>
          <option v-for="deliveryman in deliverymenOptions" :key="deliveryman.id" :value="deliveryman.name">
            {{ deliveryman.name }}
          </option>
        </select>
      </div>
      
      <div>
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Per page</label>
        <select 
          v-model="filters.perPage"
          class="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          @change="$emit('filter-change', filters)"
        >
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>
    
    <!-- Advanced Filters -->
    <div v-if="showAdvanced" class="border-t border-gray-200 dark:border-gray-600 pt-3">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div v-if="showPriority">
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
          <select 
            v-model="filters.priority"
            class="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            @change="$emit('filter-change', filters)"
          >
            <option value="">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">From Date</label>
          <input 
            v-model="filters.fromDate"
            type="date" 
            class="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            @change="$emit('filter-change', filters)"
          >
        </div>
        
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
          <input 
            v-model="filters.toDate"
            type="date" 
            class="w-full px-2 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            @change="$emit('filter-change', filters)"
          >
        </div>
      </div>
      
      <div class="flex justify-end space-x-2 mt-3">
        <button 
          @click="clearFilters"
          class="px-3 py-1 text-sm text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Clear
        </button>
        <button 
          @click="$emit('filter-change', filters)"
          class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { Search, Filter } from 'lucide-vue-next'

export default {
  name: 'FilterForm',
  components: {
    Search,
    Filter
  },
  props: {
    showStatus: {
      type: Boolean,
      default: true
    },
    showDeliveryman: {
      type: Boolean,
      default: false
    },
    showPriority: {
      type: Boolean,
      default: false
    },
    statusOptions: {
      type: Array,
      default: () => []
    },
    deliverymenOptions: {
      type: Array,
      default: () => []
    }
  },
  emits: ['filter-change'],
  data() {
    return {
      showAdvanced: false,
      filters: {
        search: '',
        status: '',
        deliveryman: '',
        priority: '',
        fromDate: '',
        toDate: '',
        perPage: '10'
      }
    }
  },
  methods: {
    toggleFilters() {
      this.showAdvanced = !this.showAdvanced
    },
    clearFilters() {
      this.filters = {
        search: '',
        status: '',
        deliveryman: '',
        priority: '',
        fromDate: '',
        toDate: '',
        perPage: '10'
      }
      this.$emit('filter-change', this.filters)
    }
  }
}
</script>