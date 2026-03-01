<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Deliveryman Invitations</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">Invite and verify delivery personnel with OTP</p>
      </div>
      <button
        class="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black"
        @click="openInviteModal"
      >
        Invite Delivery Man
      </button>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg card-shadow p-3">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-2">
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            v-model="filters.status"
            class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            @change="loadInvitations(1)"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="verified">Verified</option>
            <option value="expired">Expired</option>
            <option value="canceled">Canceled</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number</label>
          <input
            v-model="filters.mobileNumber"
            type="text"
            placeholder="01700000000"
            class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            @input="handleMobileInput"
          >
        </div>

        <DatePickerField
          v-model="filters.fromDate"
          label="From Date"
          input-class="standard-date w-full px-2 py-1.5 pr-8 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          @change="loadInvitations(1)"
        />

        <DatePickerField
          v-model="filters.toDate"
          label="To Date"
          input-class="standard-date w-full px-2 py-1.5 pr-8 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          @change="loadInvitations(1)"
        />

        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Per Page</label>
          <select
            v-model="filters.perPage"
            class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            @change="loadInvitations(1)"
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <div class="mt-3 flex justify-end">
        <button
          class="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          @click="clearFilters"
        >
          Clear Filters
        </button>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-10 bg-white dark:bg-gray-800 rounded-xl card-shadow">
      <div class="h-6 w-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
      <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading invitations...</span>
    </div>

    <template v-else>
      <div class="bg-white dark:bg-gray-800 rounded-xl card-shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Invite ID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mobile</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Delivery Man ID</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Expires At</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="invitation in invitations"
                :key="invitation.id"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">#{{ invitation.id }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ invitation.mobile_number || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="statusClass(invitation.status)"
                  >
                    {{ invitation.status || 'N/A' }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ invitation.delivery_man_id || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{{ formatDateTime(invitation.expires_at) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{{ formatDateTime(invitation.created_at) }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-2">
                    <button
                      v-if="invitation.status === 'pending'"
                      class="px-2 py-1 text-xs rounded border border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white transition-colors"
                      @click="openVerifyModal(invitation)"
                    >
                      Verify OTP
                    </button>
                    <button
                      v-if="invitation.status === 'pending'"
                      class="px-2 py-1 text-xs rounded border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="resendLoadingId === invitation.id"
                      @click="handleResendForRow(invitation)"
                    >
                      {{ resendLoadingId === invitation.id ? 'Resending...' : 'Resend OTP' }}
                    </button>
                    <span
                      v-if="invitation.status !== 'pending'"
                      class="text-xs text-gray-500 dark:text-gray-400"
                    >
                      Read only
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="!invitations.length" class="text-center py-10 bg-white dark:bg-gray-800 rounded-xl card-shadow">
        <p class="text-sm text-gray-600 dark:text-gray-400">No invitations found for current filters.</p>
      </div>

      <Pagination
        v-if="pagination.total > 0 && pagination.last_page > 1"
        :current-page="pagination.current_page"
        :total-pages="pagination.last_page"
        :total-items="pagination.total"
        :per-page="pagination.per_page"
        @page-change="handlePageChange"
      />
    </template>

    <VerifyInviteOtpModal
      v-model="showOtpModal"
      :mobile-number="otpContext.mobileNumberMasked || otpContext.mobileNumberRaw"
      :expires-at="otpContext.expiresAt"
      :verify-loading="verifyLoading"
      :resend-loading="resendLoading"
      :error-message="otpError"
      @verify="handleVerifyOtp"
      @resend="handleResendOtp"
    />

    <div
      v-if="showInviteModal"
      class="fixed inset-0 z-50 bg-slate-900/25 backdrop-blur-[1px] flex items-center justify-center p-4"
      @click.self="closeInviteModal"
    >
      <div class="w-full max-w-sm rounded-xl border border-slate-200 bg-white shadow-xl">
        <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">Invite Delivery Man</h3>
            <p class="text-xs text-slate-500 mt-0.5">Enter mobile number to send OTP</p>
          </div>
          <button
            class="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            @click="closeInviteModal"
            aria-label="Close invite modal"
          >
            ✕
          </button>
        </div>

        <div class="p-4 space-y-3">
          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Mobile Number</label>
            <input
              v-model="inviteMobile"
              type="text"
              inputmode="numeric"
              placeholder="01700000000"
              class="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              @keyup.enter="submitInviteFromModal"
            >
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
          <button
            class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
            @click="closeInviteModal"
          >
            Cancel
          </button>
          <button
            class="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="inviteLoading || !inviteMobile.trim()"
            @click="submitInviteFromModal"
          >
            {{ inviteLoading ? 'Sending...' : 'Send Invite' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VerifyInviteOtpModal from '../components/delivery/VerifyInviteOtpModal.vue'
import Pagination from '../components/Pagination.vue'
import DatePickerField from '../components/DatePickerField.vue'
import {
  fetchDeliveryManInvitations,
  inviteDeliveryMan,
  resendDeliveryManInvitation,
  verifyDeliveryManInvite
} from '../api/delivery'
import { useToastStore } from '../stores/toast'

export default {
  name: 'DeliveryInvitations',
  components: {
    VerifyInviteOtpModal,
    Pagination,
    DatePickerField
  },
  setup() {
    const toastStore = useToastStore()
    return { toastStore }
  },
  data() {
    return {
      loading: false,
      inviteLoading: false,
      showInviteModal: false,
      inviteMobile: '',
      verifyLoading: false,
      resendLoading: false,
      resendLoadingId: null,
      showOtpModal: false,
      otpError: '',
      mobileDebounceTimer: null,
      invitations: [],
      pagination: {
        current_page: 1,
        per_page: 15,
        total: 0,
        last_page: 1,
        from: 0,
        to: 0,
        has_more_pages: false
      },
      filters: {
        status: '',
        mobileNumber: '',
        fromDate: '',
        toDate: '',
        perPage: '15'
      },
      otpContext: {
        inviteId: null,
        mobileNumberRaw: '',
        mobileNumberMasked: '',
        expiresAt: ''
      }
    }
  },
  async mounted() {
    await this.loadInvitations(1)
  },
  beforeUnmount() {
    if (this.mobileDebounceTimer) {
      clearTimeout(this.mobileDebounceTimer)
    }
  },
  methods: {
    openInviteModal() {
      this.inviteMobile = ''
      this.showInviteModal = true
    },
    closeInviteModal() {
      this.showInviteModal = false
    },
    async submitInviteFromModal() {
      const mobile = this.inviteMobile.trim()
      if (!mobile) {
        return
      }
      const success = await this.handleInviteSubmit(mobile)
      if (success) {
        this.closeInviteModal()
      }
    },
    getErrorMessage(error, fallbackMessage) {
      return error?.response?.data?.message || fallbackMessage
    },
    buildParams(page = 1) {
      const params = {
        page,
        per_page: Number(this.filters.perPage) || 15,
        sort_by: 'created_at',
        sort_order: 'desc'
      }

      if (this.filters.status) {
        params.status = this.filters.status
      }
      if (this.filters.mobileNumber?.trim()) {
        params.mobile_number = this.filters.mobileNumber.trim()
      }
      if (this.filters.fromDate) {
        params.from_date = this.filters.fromDate
      }
      if (this.filters.toDate) {
        params.to_date = this.filters.toDate
      }

      return params
    },
    async loadInvitations(page = 1) {
      try {
        this.loading = true
        const response = await fetchDeliveryManInvitations(this.buildParams(page))
        if (response?.success) {
          const data = response.data || {}
          this.invitations = data.invitations || []
          this.pagination = data.pagination || this.pagination
        } else {
          this.invitations = []
        }
      } catch (error) {
        console.error('Error loading invitations:', error)
        this.toastStore.error(this.getErrorMessage(error, 'Failed to load invitations'))
      } finally {
        this.loading = false
      }
    },
    statusClass(status) {
      switch (status) {
        case 'pending':
          return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
        case 'verified':
          return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
        case 'expired':
          return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        case 'canceled':
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        default:
          return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
      }
    },
    formatDateTime(value) {
      if (!value) return '-'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return value
      return date.toLocaleString()
    },
    async handleInviteSubmit(mobileNumber) {
      try {
        this.inviteLoading = true
        const response = await inviteDeliveryMan(mobileNumber)
        const payload = response?.data || {}
        const message = response?.message || 'Request processed.'

        if (payload.already_added || payload.linked) {
          this.toastStore.success(message)
          await this.loadInvitations(this.pagination.current_page || 1)
          return true
        }

        if (payload.invite_id && payload.expires_at) {
          this.otpContext = {
            inviteId: payload.invite_id,
            mobileNumberRaw: mobileNumber,
            mobileNumberMasked: payload.mobile_number || mobileNumber,
            expiresAt: payload.expires_at
          }
          this.otpError = ''
          this.showOtpModal = true
          this.toastStore.success(message)
          await this.loadInvitations(this.pagination.current_page || 1)
          return true
        }

        this.toastStore.info(message)
        return true
      } catch (error) {
        this.toastStore.error(this.getErrorMessage(error, 'Failed to send invitation OTP'))
        return false
      } finally {
        this.inviteLoading = false
      }
    },
    openVerifyModal(invitation) {
      this.otpContext = {
        inviteId: invitation.id,
        mobileNumberRaw: invitation.mobile_number || '',
        mobileNumberMasked: invitation.mobile_number || '',
        expiresAt: invitation.expires_at || ''
      }
      this.otpError = ''
      this.showOtpModal = true
    },
    async handleVerifyOtp(otp) {
      if (!this.otpContext.inviteId) {
        this.otpError = 'Invitation ID is missing.'
        return
      }

      try {
        this.verifyLoading = true
        this.otpError = ''
        const response = await verifyDeliveryManInvite(this.otpContext.inviteId, otp)

        this.toastStore.success(response?.message || 'Invitation verified successfully.')
        this.showOtpModal = false
        await this.loadInvitations(this.pagination.current_page || 1)
      } catch (error) {
        this.otpError = this.getErrorMessage(error, 'Failed to verify OTP')
      } finally {
        this.verifyLoading = false
      }
    },
    async handleResendForRow(invitation) {
      if (!invitation?.id) {
        this.toastStore.error('Invitation ID not available')
        return
      }

      try {
        this.resendLoadingId = invitation.id
        const response = await resendDeliveryManInvitation(invitation.id)
        const payload = response?.data || {}

        if (payload.invite_id && payload.expires_at && this.otpContext.inviteId === invitation.id) {
          this.otpContext = {
            ...this.otpContext,
            inviteId: payload.invite_id,
            mobileNumberRaw: invitation.mobile_number || this.otpContext.mobileNumberRaw,
            mobileNumberMasked: payload.mobile_number || this.otpContext.mobileNumberMasked || this.otpContext.mobileNumberRaw,
            expiresAt: payload.expires_at
          }
        }

        this.toastStore.success(response?.message || 'OTP resent successfully.')
        await this.loadInvitations(this.pagination.current_page || 1)
      } catch (error) {
        this.toastStore.error(this.getErrorMessage(error, 'Failed to resend OTP'))
      } finally {
        this.resendLoadingId = null
      }
    },
    async handleResendOtp() {
      if (!this.otpContext.inviteId) {
        this.otpError = 'Invitation ID is missing. Close and retry from table row.'
        return
      }

      try {
        this.resendLoading = true
        this.otpError = ''

        const response = await resendDeliveryManInvitation(this.otpContext.inviteId)
        const payload = response?.data || {}

        if (payload.invite_id && payload.expires_at) {
          this.otpContext = {
            ...this.otpContext,
            inviteId: payload.invite_id,
            mobileNumberMasked: payload.mobile_number || this.otpContext.mobileNumberMasked || this.otpContext.mobileNumberRaw,
            expiresAt: payload.expires_at
          }
        }

        this.toastStore.success(response?.message || 'OTP resent successfully.')
        await this.loadInvitations(this.pagination.current_page || 1)
      } catch (error) {
        this.otpError = this.getErrorMessage(error, 'Failed to resend OTP')
      } finally {
        this.resendLoading = false
      }
    },
    handlePageChange(page) {
      if (page < 1 || page > this.pagination.last_page) {
        return
      }
      this.loadInvitations(page)
    },
    handleMobileInput() {
      if (this.mobileDebounceTimer) {
        clearTimeout(this.mobileDebounceTimer)
      }
      this.mobileDebounceTimer = setTimeout(() => {
        this.loadInvitations(1)
      }, 350)
    },
    clearFilters() {
      this.filters = {
        status: '',
        mobileNumber: '',
        fromDate: '',
        toDate: '',
        perPage: '15'
      }
      this.loadInvitations(1)
    }
  }
}
</script>
