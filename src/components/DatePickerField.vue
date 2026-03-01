<template>
  <div>
    <label v-if="label" class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{{ label }}</label>
    <div class="relative">
      <input
        ref="inputEl"
        :value="modelValue"
        type="date"
        :class="inputClass"
        @input="$emit('update:modelValue', $event.target.value)"
        @change="$emit('change', $event.target.value)"
      >
      <button
        type="button"
        class="absolute inset-y-0 right-0 flex items-center px-2 text-slate-500 hover:text-slate-800"
        @click="openPicker"
        aria-label="Open calendar"
      >
        <Calendar class="h-3.5 w-3.5" />
      </button>
    </div>
  </div>
</template>

<script>
import { Calendar } from 'lucide-vue-next'

export default {
  name: 'DatePickerField',
  components: { Calendar },
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    inputClass: {
      type: String,
      default:
        'standard-date w-full px-2 py-1.5 pr-8 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500'
    }
  },
  emits: ['update:modelValue', 'change'],
  methods: {
    openPicker() {
      const input = this.$refs.inputEl
      if (!input) return
      if (typeof input.showPicker === 'function') {
        input.showPicker()
      } else {
        input.focus()
      }
    }
  }
}
</script>
