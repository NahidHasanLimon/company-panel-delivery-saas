<template>
  <div class="relative">
    <button 
      type="button"
      @click="toggleDropdown"
      class="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 dark:bg-gray-800 dark:text-white cursor-pointer flex items-center justify-between"
      :class="{ 'ring-1 ring-blue-500 border-blue-500': showDropdown }"
    >
      <span
        class="text-left flex-1"
        :class="selectedLabel ? 'text-gray-900 dark:text-white' : 'text-gray-800 dark:text-gray-100'"
      >
        {{ selectedLabel || placeholder }}
      </span>
      <svg 
        class="h-4 w-4 text-gray-400 transition-transform"
        :class="{ 'rotate-180': showDropdown }"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
      </svg>
    </button>
    
    <!-- Dropdown -->
    <div
      v-if="showDropdown"
      class="absolute z-[1000] w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg overflow-hidden"
      :class="dropdownPositionClass"
    >
      <!-- Search input inside dropdown -->
      <div class="p-2 border-b border-gray-200 dark:border-gray-600">
        <input 
          v-model="searchTerm"
          @input="handleSearch"
          type="text"
          class="w-full p-2 text-sm border border-gray-300 dark:border-gray-600 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-600 dark:placeholder-gray-300 dark:bg-gray-700 dark:text-white"
          :placeholder="searchPlaceholder"
          ref="searchInput"
        >
      </div>
      
      <!-- Options container -->
      <div class="max-h-48 overflow-y-auto">
        <div v-if="loading" class="p-3 text-center text-sm text-gray-800 dark:text-gray-100">
          {{ loadingText }}
        </div>
        <div v-else-if="filteredOptions.length === 0 && searchTerm && searchTerm.trim() !== ''" class="p-3 text-center text-sm text-gray-800 dark:text-gray-100">
          {{ noResultsText }}
        </div>
        <div v-else-if="filteredOptions.length === 0 && options.length === 0" class="p-3 text-center text-sm text-gray-800 dark:text-gray-100">
          No options available
        </div>
        <div v-else>
          <!-- Clear selection option -->
          <button
            v-if="modelValue && allowClear"
            type="button"
            @click.stop="clearSelection"
            class="w-full text-left px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 border-b border-gray-200 dark:border-gray-700"
          >
            {{ clearText }}
          </button>
          <!-- Options -->
          <button
            v-for="option in filteredOptions"
            :key="getOptionKey(option)"
            type="button"
            @click.stop="selectOption(option)"
            class="w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
            :class="{ 'bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-100': isSelected(option) }"
          >
            <slot name="option" :option="option" :isSelected="isSelected(option)">
              <div class="font-semibold">{{ getOptionLabel(option) }}</div>
              <div v-if="getOptionSubLabel(option)" class="text-xs text-gray-800 dark:text-gray-200">
                {{ getOptionSubLabel(option) }}
              </div>
            </slot>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchableDropdown',
  props: {
    modelValue: {
      type: [String, Number, Object, null],
      default: null
    },
    options: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: 'Select an option...'
    },
    searchPlaceholder: {
      type: String,
      default: 'Search...'
    },
    loading: {
      type: Boolean,
      default: false
    },
    loadingText: {
      type: String,
      default: 'Loading...'
    },
    noResultsText: {
      type: String,
      default: 'No results found'
    },
    clearText: {
      type: String,
      default: 'Clear selection'
    },
    allowClear: {
      type: Boolean,
      default: true
    },
    // For object options - specify which property to use as key
    optionKey: {
      type: String,
      default: 'id'
    },
    // For object options - specify which property to use as label
    optionLabel: {
      type: String,
      default: 'name'
    },
    // For object options - specify which property to use as sub-label
    optionSubLabel: {
      type: String,
      default: null
    },
    // Search fields - which properties to search in
    searchFields: {
      type: Array,
      default: () => ['name']
    }
  },
  emits: ['update:modelValue', 'search', 'select', 'clear'],
  data() {
    return {
      showDropdown: false,
      searchTerm: '',
      openDirection: 'down'
    }
  },
  computed: {
    dropdownPositionClass() {
      if (this.openDirection === 'up') {
        return 'bottom-full mb-1'
      }
      return 'top-full mt-1'
    },
    selectedLabel() {
      if (!this.modelValue) return ''
      
      const selected = this.options.find(option => {
        const optionValue = this.getOptionKey(option)
        return optionValue === this.modelValue || (typeof this.modelValue === 'object' && this.modelValue && optionValue === this.modelValue[this.optionKey])
      })
      
      if (selected) {
        const label = this.getOptionLabel(selected)
        const subLabel = this.getOptionSubLabel(selected)
        return subLabel ? `${label} || ${subLabel}` : label
      }
      
      return ''
    },
    filteredOptions() {
      if (!Array.isArray(this.options)) {
        return []
      }
      
      if (!this.searchTerm || this.searchTerm.trim() === '') {
        return this.options
      }
      
      const search = this.searchTerm.toLowerCase()
      return this.options.filter(option => {
        if (!option) return false
        
        return this.searchFields.some(field => {
          const value = this.getNestedProperty(option, field)
          return value && value.toString().toLowerCase().includes(search)
        })
      })
    }
  },
  watch: {
    showDropdown(newVal) {
      if (newVal) {
        this.$nextTick(() => {
          if (this.$refs.searchInput) {
            this.$refs.searchInput.focus()
          }
        })
      }
    },
    // Reset search when options change
    options() {
      this.searchTerm = ''
    }
  },
  mounted() {
    document.addEventListener('click', this.handleOutsideClick)
    window.addEventListener('resize', this.handleViewportChange)
    window.addEventListener('scroll', this.handleViewportChange, true)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleOutsideClick)
    window.removeEventListener('resize', this.handleViewportChange)
    window.removeEventListener('scroll', this.handleViewportChange, true)
  },
  methods: {
    updateOpenDirection() {
      const buttonEl = this.$el?.querySelector('button')
      if (!buttonEl) return

      const rect = buttonEl.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight

      const estimatedDropdownHeight = 280
      const spaceBelow = viewportHeight - rect.bottom
      const spaceAbove = rect.top

      if (spaceBelow < estimatedDropdownHeight && spaceAbove > spaceBelow) {
        this.openDirection = 'up'
      } else {
        this.openDirection = 'down'
      }
    },
    handleViewportChange() {
      if (this.showDropdown) {
        this.updateOpenDirection()
      }
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
      if (this.showDropdown) {
        this.updateOpenDirection()
        // Reset search when opening dropdown
        this.searchTerm = ''
        this.$emit('search', this.searchTerm)
        // Focus search input
        this.$nextTick(() => {
          if (this.$refs.searchInput) {
            this.$refs.searchInput.focus()
          }
        })
      }
    },
    handleSearch() {
      this.$emit('search', this.searchTerm)
    },
    selectOption(option) {
      const value = this.getOptionKey(option)
      this.$emit('update:modelValue', value)
      this.$emit('select', option)
      this.searchTerm = ''
      this.showDropdown = false
    },
    clearSelection() {
      this.$emit('update:modelValue', null)
      this.$emit('clear')
      this.searchTerm = ''
      // Keep dropdown open and ensure we show all options again
      this.showDropdown = true
      // Focus back to search input
      this.$nextTick(() => {
        if (this.$refs.searchInput) {
          this.$refs.searchInput.focus()
        }
      })
    },
    isSelected(option) {
      if (!this.modelValue) return false
      
      const optionValue = this.getOptionKey(option)
      return optionValue === this.modelValue || (typeof this.modelValue === 'object' && this.modelValue && optionValue === this.modelValue[this.optionKey])
    },
    getOptionKey(option) {
      if (!option) return null
      return typeof option === 'object' ? option[this.optionKey] : option
    },
    getOptionLabel(option) {
      if (!option) return ''
      return typeof option === 'object' ? option[this.optionLabel] : option
    },
    getOptionSubLabel(option) {
      if (!option || !this.optionSubLabel) return null
      return typeof option === 'object' ? option[this.optionSubLabel] : null
    },
    getNestedProperty(obj, path) {
      if (!obj || !path) return null
      return path.split('.').reduce((current, key) => current && current[key], obj)
    },
    handleOutsideClick(event) {
      // Only close if clicking outside the dropdown and it's currently open
      if (this.showDropdown && this.$el && !this.$el.contains(event.target)) {
        this.showDropdown = false
      }
    }
  }
}
</script>
