<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Orders</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">Manage all company orders</p>
      </div>
      <button
        class="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black"
        @click="$router.push('/orders/create')"
      >
        New Order
      </button>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg card-shadow p-3">
      <div v-if="optionsLoading" class="text-xs text-gray-500 dark:text-gray-400">Loading filter options...</div>

      <template v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <div v-for="field in visibleFilterKeys" :key="field">
            <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{{ formatLabel(field) }}</label>

            <input
              v-if="filterSchema[field]?.type === 'text'"
              v-model="filters[field]"
              type="text"
              class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              :placeholder="`Enter ${formatLabel(field).toLowerCase()}`"
            >

            <input
              v-else-if="filterSchema[field]?.type === 'date'"
              v-model="filters[field]"
              type="date"
              class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >

            <select
              v-else-if="filterSchema[field]?.type === 'select'"
              v-model="filters[field]"
              class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option
                v-for="option in filterSchema[field]?.options || []"
                :key="`${field}-${String(option.value)}`"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            class="text-xs px-2 py-1 rounded-md border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            @click="showAllFilters = !showAllFilters"
          >
            {{ showAllFilters ? 'Show Less Filters' : 'Show All Filters' }}
          </button>

          <div class="flex items-center gap-2">
            <button
              class="px-2.5 py-1 text-xs text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              @click="clearFilters"
            >
              Clear
            </button>
            <button
              class="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              @click="applyFilters"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </template>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-10 bg-white dark:bg-gray-800 rounded-xl card-shadow">
      <div class="h-6 w-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
      <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading orders...</span>
    </div>

    <template v-else>
      <div v-if="orders.length" class="bg-white dark:bg-gray-800 rounded-xl card-shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order No</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Delivery Medium</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Delivery Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="order in orders" :key="order.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ order.order_number }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="text-sm text-gray-900 dark:text-white">{{ order.customer?.name || 'N/A' }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ order.customer?.mobile_no || '-' }}</div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ titleCase(order.order_type) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ titleCase(order.delivery_medium) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <StatusBadge :status="order.status" />
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <StatusBadge :status="order.delivery_status" />
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <StatusBadge :status="order.payment_status" />
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  BDT {{ formatAmount(order.amount) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{{ formatDate(order.created_at) }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <button
                    class="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-800 hover:bg-gray-100 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
                    title="View Order"
                    aria-label="View Order"
                    @click="viewOrder(order.id)"
                  >
                    <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="text-center py-10 bg-white dark:bg-gray-800 rounded-xl card-shadow">
        <p class="text-sm text-gray-600 dark:text-gray-400">No orders found for current filters.</p>
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

    <div
      v-if="showDetailsModal"
      class="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 p-4"
      @click.self="closeDetailsModal"
    >
      <div class="w-full max-w-4xl rounded-xl border border-gray-200 bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-800">
        <div class="mb-3 flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-gray-900 dark:text-white">Order Details</h3>
            <p class="text-xs text-gray-700 dark:text-gray-200">{{ selectedOrder?.order_number || '-' }}</p>
          </div>
          <button class="text-sm text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white" @click="closeDetailsModal">
            Close
          </button>
        </div>

        <div v-if="detailsLoading" class="py-8 text-center text-sm text-gray-700 dark:text-gray-200">
          Loading order details...
        </div>

        <div v-else-if="selectedOrder" class="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
          <div class="grid grid-cols-1 gap-1.5 rounded-md border border-gray-200 p-3 text-xs text-gray-900 dark:border-gray-700 dark:text-white md:grid-cols-2">
            <p><span class="font-bold">Order Type:</span> {{ titleCase(selectedOrder.order_type) }}</p>
            <p><span class="font-bold">Delivery Medium:</span> {{ titleCase(selectedOrder.delivery_medium) }}</p>
            <p><span class="font-bold">Status:</span> {{ titleCase(selectedOrder.status) }}</p>
            <p><span class="font-bold">Delivery Status:</span> {{ titleCase(selectedOrder.delivery_status) }}</p>
            <p><span class="font-bold">Payment Method:</span> {{ titleCase(selectedOrder.payment_method) }}</p>
            <p><span class="font-bold">Payment Status:</span> {{ titleCase(selectedOrder.payment_status) }}</p>
            <p><span class="font-bold">Amount:</span> BDT {{ formatAmount(selectedOrder.amount) }}</p>
            <p><span class="font-bold">Paid:</span> BDT {{ formatAmount(selectedOrder.paid_amount) }}</p>
            <p><span class="font-bold">Collectible:</span> BDT {{ formatAmount(selectedOrder.collectible_amount) }}</p>
          </div>

          <div class="grid grid-cols-1 gap-1.5 rounded-md border border-gray-200 p-3 text-xs text-gray-900 dark:border-gray-700 dark:text-white md:grid-cols-2">
            <p><span class="font-bold">Customer:</span> {{ selectedOrder.customer?.name || '-' }}</p>
            <p><span class="font-bold">Customer Mobile:</span> {{ selectedOrder.customer?.mobile_no || '-' }}</p>
            <p><span class="font-bold">Drop Contact:</span> {{ selectedOrder.drop_contact_name || '-' }}</p>
            <p><span class="font-bold">Drop Mobile:</span> {{ selectedOrder.drop_mobile_number || '-' }}</p>
            <p class="md:col-span-2"><span class="font-bold">Drop Address:</span> {{ selectedOrder.drop_address || '-' }}</p>
            <p><span class="font-bold">Drop Latitude:</span> {{ selectedOrder.drop_latitude || '-' }}</p>
            <p><span class="font-bold">Drop Longitude:</span> {{ selectedOrder.drop_longitude || '-' }}</p>
          </div>

          <div class="rounded-md border border-gray-200 p-3 dark:border-gray-700">
            <p class="mb-2 text-xs font-bold text-gray-900 dark:text-white">Order Items</p>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Item</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Unit</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Unit Price</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Qty</th>
                    <th class="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Line Total</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                  <tr v-for="item in selectedOrder.order_items || []" :key="item.id">
                    <td class="px-3 py-2 text-xs text-gray-900 dark:text-white">{{ item.item_name || item.item?.name || '-' }}</td>
                    <td class="px-3 py-2 text-xs text-gray-900 dark:text-white">{{ item.unit || item.item?.unit || '-' }}</td>
                    <td class="px-3 py-2 text-xs text-gray-900 dark:text-white">{{ formatAmount(item.unit_price) }}</td>
                    <td class="px-3 py-2 text-xs text-gray-900 dark:text-white">{{ item.quantity || 0 }}</td>
                    <td class="px-3 py-2 text-xs text-gray-900 dark:text-white">{{ formatAmount((Number(item.unit_price || 0) * Number(item.quantity || 0))) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Pagination from '../components/Pagination.vue'
import StatusBadge from '../components/StatusBadge.vue'
import { useToastStore } from '../stores/toast'
import { fetchOrderFilterOptions, fetchOrders, fetchOrderDetails } from '../api/orders'

export default {
  name: 'Orders',
  components: {
    Pagination,
    StatusBadge
  },
  setup() {
    const toastStore = useToastStore()
    return { toastStore }
  },
  data() {
    return {
      optionsLoading: false,
      loading: false,
      filterSchema: {},
      filters: {},
      appliedFilters: {},
      showAllFilters: false,
      orders: [],
      showDetailsModal: false,
      detailsLoading: false,
      selectedOrder: null,
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1
      }
    }
  },
  computed: {
    orderedFilterKeys() {
      return Object.keys(this.filterSchema)
    },
    visibleFilterKeys() {
      if (this.showAllFilters) return this.orderedFilterKeys
      return this.orderedFilterKeys.slice(0, 8)
    }
  },
  async mounted() {
    await this.loadFilterOptions()
    await this.loadOrders()
  },
  methods: {
    getApiErrorMessage(error, fallbackMessage) {
      const responseData = error?.response?.data
      if (responseData?.message) return responseData.message
      const errors = responseData?.errors
      if (errors && typeof errors === 'object') {
        const firstKey = Object.keys(errors)[0]
        const firstValue = firstKey ? errors[firstKey] : null
        if (Array.isArray(firstValue) && firstValue.length) return firstValue[0]
        if (typeof firstValue === 'string') return firstValue
      }
      return fallbackMessage
    },
    async loadFilterOptions() {
      this.optionsLoading = true
      try {
        const response = await fetchOrderFilterOptions()
        if (response.success) {
          this.filterSchema = response?.data?.filters || {}
          this.resetFiltersFromSchema()
          this.appliedFilters = { ...this.filters }
        }
      } catch (error) {
        const message = this.getApiErrorMessage(error, 'Failed to load order filter options')
        this.toastStore.error(message)
      } finally {
        this.optionsLoading = false
      }
    },
    resetFiltersFromSchema() {
      const next = {}
      Object.entries(this.filterSchema).forEach(([key, config]) => {
        if (Object.prototype.hasOwnProperty.call(config, 'default')) {
          next[key] = config.default
        } else if (config.type === 'select') {
          next[key] = ''
        } else {
          next[key] = ''
        }
      })
      this.filters = next
    },
    buildParams(page = 1) {
      const params = { page }
      const source = this.appliedFilters

      Object.entries(source).forEach(([key, value]) => {
        const isEmpty = value === '' || value === null || value === undefined
        if (!isEmpty) {
          params[key] = value
        }
      })

      if (!params.per_page && this.filterSchema.per_page?.default) {
        params.per_page = this.filterSchema.per_page.default
      }

      return params
    },
    async loadOrders(page = 1) {
      this.loading = true
      try {
        const response = await fetchOrders(this.buildParams(page))
        if (response.success) {
          this.orders = response?.data?.orders || []
          this.pagination = response?.data?.pagination || {
            current_page: 1,
            per_page: 10,
            total: 0,
            last_page: 1
          }
        } else {
          this.toastStore.warning(response?.message || 'Failed to load orders')
        }
      } catch (error) {
        const message = this.getApiErrorMessage(error, 'Failed to load orders')
        this.toastStore.error(message)
      } finally {
        this.loading = false
      }
    },
    applyFilters() {
      this.appliedFilters = { ...this.filters }
      this.loadOrders(1)
    },
    clearFilters() {
      this.resetFiltersFromSchema()
      this.appliedFilters = { ...this.filters }
      this.loadOrders(1)
    },
    handlePageChange(page) {
      this.loadOrders(page)
    },
    async viewOrder(orderId) {
      this.showDetailsModal = true
      this.detailsLoading = true
      this.selectedOrder = null
      try {
        const response = await fetchOrderDetails(orderId)
        if (response.success) {
          this.selectedOrder = response.data || null
        } else {
          this.toastStore.warning(response?.message || 'Failed to load order details')
        }
      } catch (error) {
        this.toastStore.error(this.getApiErrorMessage(error, 'Failed to load order details'))
      } finally {
        this.detailsLoading = false
      }
    },
    closeDetailsModal() {
      this.showDetailsModal = false
      this.selectedOrder = null
      this.detailsLoading = false
    },
    formatLabel(value) {
      if (!value) return ''
      return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    },
    titleCase(value) {
      if (!value) return 'N/A'
      return String(value)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
    },
    formatDate(value) {
      if (!value) return 'N/A'
      return new Date(value).toLocaleString()
    },
    formatAmount(value) {
      const num = Number(value)
      if (Number.isNaN(num)) return value || '0.00'
      return num.toFixed(2)
    }
  }
}
</script>
