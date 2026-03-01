<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 bg-slate-900/25 backdrop-blur-[1px] flex items-center justify-center p-4"
    @click.self="handleCancel"
  >
    <div class="w-full max-w-sm rounded-xl border border-slate-200 bg-white shadow-xl">
      <div class="border-b border-slate-200 px-4 py-3">
        <h3 class="text-sm font-semibold text-slate-900">{{ title }}</h3>
        <p v-if="description" class="mt-0.5 text-xs text-slate-500">{{ description }}</p>
      </div>

      <div class="px-4 py-3">
        <p class="text-xs text-slate-700">{{ message }}</p>
      </div>

      <div class="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
        <button
          class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="loading"
          @click="handleCancel"
        >
          {{ cancelText }}
        </button>
        <button
          class="rounded-md px-3 py-1.5 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60"
          :class="confirmButtonClass"
          :disabled="loading"
          @click="$emit('confirm')"
        >
          {{ loading ? loadingText : confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Confirm Action'
    },
    description: {
      type: String,
      default: ''
    },
    message: {
      type: String,
      default: ''
    },
    confirmText: {
      type: String,
      default: 'Confirm'
    },
    cancelText: {
      type: String,
      default: 'Cancel'
    },
    loadingText: {
      type: String,
      default: 'Processing...'
    },
    loading: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String,
      default: 'danger' // danger | neutral
    }
  },
  emits: ['update:modelValue', 'confirm', 'cancel'],
  computed: {
    confirmButtonClass() {
      if (this.variant === 'neutral') {
        return 'border border-slate-300 bg-slate-900 text-white hover:bg-black'
      }
      return 'border border-red-300 bg-red-50 text-red-700 hover:bg-red-100'
    }
  },
  methods: {
    handleCancel() {
      if (this.loading) return
      this.$emit('cancel')
      this.$emit('update:modelValue', false)
    }
  }
}
</script>
