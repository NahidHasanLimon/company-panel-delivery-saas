<template>
  <div class="bg-white dark:bg-gray-800 rounded-lg card-shadow p-4">
    <div class="flex flex-col gap-3 md:flex-row md:items-end">
      <div class="flex-1">
        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Invite Delivery Man (Mobile)</label>
        <input
          v-model="mobileNumber"
          type="text"
          inputmode="numeric"
          placeholder="01700000000"
          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          @keyup.enter="submitInvite"
        >
      </div>
      <button
        class="px-4 py-2 text-sm font-medium bg-slate-900 text-white rounded-md hover:bg-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="loading || !mobileNumber.trim()"
        @click="submitInvite"
      >
        {{ loading ? 'Sending...' : 'Send OTP' }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InviteDeliveryManPanel',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['invite'],
  data() {
    return {
      mobileNumber: ''
    }
  },
  methods: {
    submitInvite() {
      const mobile = this.mobileNumber.trim()
      if (!mobile || this.loading) {
        return
      }
      this.$emit('invite', mobile)
    },
    setMobileNumber(mobile) {
      this.mobileNumber = mobile || ''
    },
    clear() {
      this.mobileNumber = ''
    }
  }
}
</script>
