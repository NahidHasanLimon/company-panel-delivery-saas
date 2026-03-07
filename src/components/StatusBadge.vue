<template>
  <span class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold" :class="badgeClass">
    <span v-if="showDot" class="h-1.5 w-1.5 rounded-full" :class="dotClass"></span>
    {{ displayLabel }}
  </span>
</template>

<script>
import { getStatusBadgeClass, getStatusDotClass } from '../utils/statusPalette'

export default {
  name: 'StatusBadge',
  props: {
    status: {
      type: [String, Number, null],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    showDot: {
      type: Boolean,
      default: true
    },
    fallback: {
      type: String,
      default: 'N/A'
    }
  },
  computed: {
    badgeClass() {
      return getStatusBadgeClass(this.status)
    },
    dotClass() {
      return getStatusDotClass(this.status)
    },
    displayLabel() {
      if (this.label) return this.label
      if (this.status === null || this.status === undefined || this.status === '') return this.fallback
      return String(this.status)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase())
    }
  }
}
</script>
