<template>
  <div class="space-y-4">
    <div>
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Customers</h2>
      <p class="text-xs text-gray-500 dark:text-gray-400">Manage your customer database</p>
    </div>

    <form class="bg-white dark:bg-gray-800 rounded-lg card-shadow p-3" @submit.prevent="applyFilters">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-2">
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input
            v-model="filters.name"
            type="text"
            placeholder="Search by name"
            class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile</label>
          <input
            v-model="filters.mobile"
            type="text"
            placeholder="Search by mobile"
            class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            v-model="filters.email"
            type="text"
            placeholder="Search by email"
            class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Customer Code</label>
          <input
            v-model="filters.customerCode"
            type="text"
            placeholder="Search by code"
            class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Per Page</label>
          <select
            v-model="filters.perPage"
            class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <div class="mt-2 flex items-center justify-end gap-2">
        <button
          type="button"
          class="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          @click="resetFilters"
        >
          Clear
        </button>
        <button
          type="submit"
          class="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black disabled:opacity-60"
          :disabled="loading"
        >
          {{ loading ? 'Applying...' : 'Apply Filter' }}
        </button>
      </div>
    </form>

    <div v-if="loading" class="flex items-center justify-center py-10 bg-white dark:bg-gray-800 rounded-xl card-shadow">
      <div class="h-6 w-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
      <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading customers...</span>
    </div>

    <template v-else>
      <div v-if="customers.length" class="bg-white dark:bg-gray-800 rounded-xl card-shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th class="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th class="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Mobile</th>
                <th class="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Address</th>
                <th class="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer Code</th>
                <th class="px-4 py-2.5 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="customer in customers" :key="customer.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-4 py-2.5 text-sm font-medium text-gray-900 dark:text-white">{{ customer.name || '-' }}</td>
                <td class="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200">{{ customer.email || '-' }}</td>
                <td class="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200">{{ customer.mobile_no || '-' }}</td>
                <td class="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 max-w-[220px] truncate">{{ customer.address || '-' }}</td>
                <td class="px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200">{{ customer.customer_code || '-' }}</td>
                <td class="px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300">{{ formatDate(customer.created_at) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="showEmptyState" class="text-center py-10 bg-white dark:bg-gray-800 rounded-xl card-shadow">
        <p class="text-sm text-gray-600 dark:text-gray-400">No customers yet.</p>
      </div>

      <div v-else-if="showNoMatches" class="text-center py-10 bg-white dark:bg-gray-800 rounded-xl card-shadow">
        <p class="text-sm text-gray-600 dark:text-gray-400">No customers found for current filters.</p>
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
  </div>
</template>

<script>
import Pagination from '../components/Pagination.vue'
import { useToastStore } from '../stores/toast'
import { listCompanyCustomers } from '../api/customers'

export default {
  name: 'Customers',
  components: {
    Pagination
  },
  setup() {
    const toastStore = useToastStore()
    return { toastStore }
  },
  data() {
    return {
      loading: false,
      syncingRoute: false,
      customers: [],
      filters: {
        name: '',
        email: '',
        mobile: '',
        customerCode: '',
        perPage: '15'
      },
      currentPage: 1,
      pagination: {
        current_page: 1,
        per_page: 15,
        total: 0,
        last_page: 1
      }
    }
  },
  computed: {
    showEmptyState() {
      return !this.loading && this.customers.length === 0 && this.pagination.total === 0 && !this.hasFilters
    },
    showNoMatches() {
      return !this.loading && this.customers.length === 0 && this.hasFilters
    },
    hasFilters() {
      return Boolean(this.filters.name || this.filters.email || this.filters.mobile || this.filters.customerCode)
    }
  },
  watch: {
    '$route.query': {
      async handler(newQuery) {
        if (this.syncingRoute) return
        this.applyQueryToState(newQuery)
        await this.fetchCustomers()
      }
    }
  },
  async mounted() {
    this.applyQueryToState(this.$route.query)
    await this.fetchCustomers()
  },
  methods: {
    formatDate(value) {
      if (!value) return '-'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return value
      return date.toLocaleDateString()
    },
    applyQueryToState(query) {
      this.filters.name = typeof query.name === 'string' ? query.name : ''
      this.filters.email = typeof query.email === 'string' ? query.email : ''
      this.filters.mobile = typeof query.mobile === 'string' ? query.mobile : ''
      this.filters.customerCode = typeof query.customer_code === 'string' ? query.customer_code : ''
      const perPage = Number(query.per_page)
      this.filters.perPage = Number.isInteger(perPage) && perPage > 0 ? String(perPage) : '15'

      const page = Number(query.page)
      this.currentPage = Number.isInteger(page) && page > 0 ? page : 1
    },
    buildQueryFromState() {
      const query = {}
      if (this.filters.name?.trim()) query.name = this.filters.name.trim()
      if (this.filters.email?.trim()) query.email = this.filters.email.trim()
      if (this.filters.mobile?.trim()) query.mobile = this.filters.mobile.trim()
      if (this.filters.customerCode?.trim()) query.customer_code = this.filters.customerCode.trim()
      if (this.filters.perPage !== '15') query.per_page = this.filters.perPage
      if (this.currentPage > 1) query.page = String(this.currentPage)
      return query
    },
    async syncRouteQuery() {
      const nextQuery = this.buildQueryFromState()
      const currentQuery = {
        ...(this.$route.query.name ? { name: this.$route.query.name } : {}),
        ...(this.$route.query.email ? { email: this.$route.query.email } : {}),
        ...(this.$route.query.mobile ? { mobile: this.$route.query.mobile } : {}),
        ...(this.$route.query.customer_code ? { customer_code: this.$route.query.customer_code } : {}),
        ...(this.$route.query.per_page ? { per_page: this.$route.query.per_page } : {}),
        ...(this.$route.query.page ? { page: this.$route.query.page } : {})
      }

      if (JSON.stringify(nextQuery) === JSON.stringify(currentQuery)) {
        return
      }

      this.syncingRoute = true
      await this.$router.replace({ query: nextQuery })
      this.syncingRoute = false
    },
    buildParams() {
      const params = { page: this.currentPage }
      if (this.filters.name?.trim()) params.name = this.filters.name.trim()
      if (this.filters.email?.trim()) params.email = this.filters.email.trim()
      if (this.filters.mobile?.trim()) params.mobile_no = this.filters.mobile.trim()
      if (this.filters.customerCode?.trim()) params.customer_code = this.filters.customerCode.trim()
      params.per_page = Number(this.filters.perPage) || 15
      return params
    },
    async fetchCustomers() {
      try {
        this.loading = true

        const response = await listCompanyCustomers(this.buildParams())
        if (response?.success === false) {
          this.customers = []
          this.pagination = {
            current_page: 1,
            per_page: 15,
            total: 0,
            last_page: 1
          }
          this.toastStore.error(response?.message || 'Failed to load customers')
          return
        }

        const data = response?.data || {}
        this.customers = Array.isArray(data.data) ? data.data : []
        this.pagination = {
          current_page: data.current_page || this.currentPage,
          per_page: data.per_page || 15,
          total: data.total || 0,
          last_page: data.last_page || 1
        }

        if (this.currentPage > this.pagination.last_page && this.pagination.last_page > 0) {
          this.currentPage = this.pagination.last_page
          await this.syncRouteQuery()
          await this.fetchCustomers()
        }
      } catch (error) {
        const message = error?.response?.data?.message || 'Failed to load customers'
        this.toastStore.error(message)
        this.customers = []
      } finally {
        this.loading = false
      }
    },
    async applyFilters() {
      this.currentPage = 1
      await this.syncRouteQuery()
      await this.fetchCustomers()
    },
    async resetFilters() {
      this.filters.name = ''
      this.filters.email = ''
      this.filters.mobile = ''
      this.filters.customerCode = ''
      this.filters.perPage = '15'
      this.currentPage = 1
      await this.syncRouteQuery()
      await this.fetchCustomers()
    },
    async handlePageChange(page) {
      if (page < 1 || page > this.pagination.last_page) return
      this.currentPage = page
      await this.syncRouteQuery()
      await this.fetchCustomers()
    }
  }
}
</script>
