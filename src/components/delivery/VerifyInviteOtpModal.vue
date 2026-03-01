<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 z-50 bg-slate-900/25 backdrop-blur-[1px] flex items-center justify-center p-4"
    @click.self="close"
  >
    <div class="w-full max-w-md overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
      <div class="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
        <div>
          <h3 class="text-sm font-semibold text-slate-900">Verify Invitation</h3>
          <p class="mt-0.5 text-xs text-slate-500">Enter the 6-digit OTP</p>
        </div>
        <button
          class="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
          @click="close"
          aria-label="Close"
        >
          <X class="h-4 w-4" />
        </button>
      </div>

      <div class="space-y-4 p-5">
        <div>
          <label class="mb-2 block text-xs font-medium text-slate-700">One-Time Password</label>
          <div class="grid grid-cols-6 gap-2">
            <input
              v-for="(digit, index) in otpDigits"
              :key="index"
              :ref="el => setOtpInputRef(el, index)"
              v-model="otpDigits[index]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              class="h-11 w-full rounded-md border border-slate-300 bg-white text-center text-base font-semibold text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              @input="handleDigitInput(index, $event)"
              @keydown="handleDigitKeydown(index, $event)"
              @paste="handlePaste($event)"
            >
          </div>
        </div>

        <div class="flex items-center justify-between rounded-md border border-slate-200 px-3 py-2 text-xs">
          <span class="font-medium text-slate-600">Expires in {{ countdownLabel }}</span>
          <button
            class="font-semibold text-slate-800 transition-colors hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="resendLoading"
            @click="$emit('resend')"
          >
            {{ resendLoading ? 'Resending...' : 'Resend OTP' }}
          </button>
        </div>

        <p v-if="errorMessage" class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">{{ errorMessage }}</p>
      </div>

      <div class="flex items-center justify-end gap-2 border-t border-slate-200 bg-white px-4 py-3">
        <button
          class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
          @click="close"
        >
          Cancel
        </button>
        <button
          class="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="verifyLoading || otpValue.length !== 6"
          @click="submitVerify"
        >
          {{ verifyLoading ? 'Verifying...' : 'Verify OTP' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { X } from 'lucide-vue-next'

export default {
  name: 'VerifyInviteOtpModal',
  components: { X },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    mobileNumber: {
      type: String,
      default: ''
    },
    expiresAt: {
      type: String,
      default: ''
    },
    verifyLoading: {
      type: Boolean,
      default: false
    },
    resendLoading: {
      type: Boolean,
      default: false
    },
    errorMessage: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'verify', 'resend'],
  data() {
    return {
      otpDigits: ['', '', '', '', '', ''],
      remainingSeconds: 0,
      timerId: null,
      otpInputRefs: []
    }
  },
  computed: {
    otpValue() {
      return this.otpDigits.join('')
    },
    countdownLabel() {
      if (this.remainingSeconds <= 0) return '00:00'
      const minutes = Math.floor(this.remainingSeconds / 60)
      const seconds = this.remainingSeconds % 60
      return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    }
  },
  watch: {
    modelValue(newValue) {
      if (newValue) {
        this.resetOtp()
        this.startCountdown()
        this.$nextTick(() => {
          this.focusInput(0)
        })
      } else {
        this.stopCountdown()
      }
    },
    expiresAt() {
      if (this.modelValue) {
        this.startCountdown()
      }
    }
  },
  beforeUnmount() {
    this.stopCountdown()
  },
  methods: {
    setOtpInputRef(el, index) {
      if (!el) return
      this.otpInputRefs[index] = el
    },
    resetOtp() {
      this.otpDigits = ['', '', '', '', '', '']
    },
    focusInput(index) {
      const input = this.otpInputRefs[index]
      if (input) input.focus()
    },
    handleDigitInput(index, event) {
      const value = (event.target.value || '').replace(/\D/g, '')
      this.otpDigits[index] = value.slice(-1)

      if (this.otpDigits[index] && index < 5) {
        this.$nextTick(() => this.focusInput(index + 1))
      }
    },
    handleDigitKeydown(index, event) {
      if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
        this.$nextTick(() => this.focusInput(index - 1))
      }
      if (event.key === 'ArrowLeft' && index > 0) {
        event.preventDefault()
        this.focusInput(index - 1)
      }
      if (event.key === 'ArrowRight' && index < 5) {
        event.preventDefault()
        this.focusInput(index + 1)
      }
      if (event.key === 'Enter') {
        this.submitVerify()
      }
    },
    handlePaste(event) {
      const pasted = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, 6)
      if (!pasted) return
      event.preventDefault()
      const digits = pasted.split('')
      this.otpDigits = Array.from({ length: 6 }, (_, index) => digits[index] || '')
      const nextIndex = Math.min(digits.length, 5)
      this.$nextTick(() => this.focusInput(nextIndex))
    },
    submitVerify() {
      if (this.verifyLoading || this.otpValue.length !== 6) {
        return
      }
      this.$emit('verify', this.otpValue)
    },
    close() {
      this.$emit('update:modelValue', false)
    },
    startCountdown() {
      this.stopCountdown()
      this.updateRemainingSeconds()
      this.timerId = setInterval(() => {
        this.updateRemainingSeconds()
      }, 1000)
    },
    stopCountdown() {
      if (this.timerId) {
        clearInterval(this.timerId)
        this.timerId = null
      }
    },
    updateRemainingSeconds() {
      if (!this.expiresAt) {
        this.remainingSeconds = 0
        return
      }
      const expiresAtMs = new Date(this.expiresAt).getTime()
      if (Number.isNaN(expiresAtMs)) {
        this.remainingSeconds = 0
        return
      }
      const diffSeconds = Math.floor((expiresAtMs - Date.now()) / 1000)
      this.remainingSeconds = Math.max(0, diffSeconds)
    }
  }
}
</script>
