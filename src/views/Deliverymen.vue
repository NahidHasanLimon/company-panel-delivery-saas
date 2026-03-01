<template>
  <div class="space-y-4">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Delivery Personnel</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">Manage your delivery team</p>
      </div>
      <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        <button
          @click="viewMode = 'table'"
          class="px-2 py-1 text-xs rounded-md transition-colors"
          :class="viewMode === 'table' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'"
        >
          <List class="h-4 w-4" />
        </button>
        <button
          @click="viewMode = 'grid'"
          class="px-2 py-1 text-xs rounded-md transition-colors"
          :class="viewMode === 'grid' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'"
        >
          <Grid class="h-4 w-4" />
        </button>
      </div>
    </div>

    <FilterForm
      :show-status="true"
      :show-deliveryman="false"
      :show-priority="false"
      :show-identification-number="true"
      :status-options="statusOptions"
      @filter-change="handleFilterChange"
    />

    <div v-if="loading" class="flex items-center justify-center py-10">
      <div class="h-6 w-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
      <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading delivery personnel...</span>
    </div>

    <template v-else>
      <div v-if="viewMode === 'table'" class="bg-white dark:bg-gray-800 rounded-xl card-shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Deliveryman</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Contact</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Identification No.</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Deliveries</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rating</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="deliveryman in deliverymen" :key="deliveryman.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
                      <User class="h-4 w-4 text-white" />
                    </div>
                    <div class="ml-3">
                      <div class="text-sm font-medium text-gray-900 dark:text-white">{{ deliveryman.name }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">{{ deliveryman.email || 'N/A' }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ deliveryman.mobile_no || 'N/A' }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ deliveryman.identification_number || 'N/A' }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ deliveryman.total_deliveries ?? 0 }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ getAverageRating(deliveryman) }}
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="deliveryman.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
                  >
                    {{ deliveryman.status || 'N/A' }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <button
                    class="px-2 py-1 text-xs rounded border border-red-300 text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    :disabled="unlinkingId === deliveryman.id"
                    @click="handleUnlinkDeliveryman(deliveryman)"
                  >
                    {{ unlinkingId === deliveryman.id ? 'Removing...' : 'Remove' }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div
          v-for="deliveryman in deliverymen"
          :key="deliveryman.id"
          class="bg-white dark:bg-gray-800 rounded-lg card-shadow p-4"
        >
          <div class="flex items-center space-x-3 mb-3">
            <div class="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center">
              <User class="h-5 w-5 text-white" />
            </div>
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white truncate">{{ deliveryman.name }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ deliveryman.email || 'N/A' }}</p>
            </div>
            <span
              class="px-2 py-1 text-xs font-semibold rounded-full"
              :class="deliveryman.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
            >
              {{ deliveryman.status || 'N/A' }}
            </span>
          </div>

          <div class="space-y-2">
            <div class="flex items-center text-xs text-gray-600 dark:text-gray-400">
              <Phone class="h-3 w-3 mr-2 flex-shrink-0" />
              <span class="truncate">{{ deliveryman.mobile_no || 'N/A' }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <div class="flex items-center">
                <Package class="h-3 w-3 mr-1 text-slate-700" />
                <span class="font-medium text-gray-900 dark:text-white">{{ deliveryman.total_deliveries ?? 0 }}</span>
              </div>
              <div class="flex items-center">
                <Star class="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                <span class="font-medium text-gray-900 dark:text-white">{{ getAverageRating(deliveryman) }}</span>
              </div>
            </div>
            <div class="pt-1">
              <button
                class="w-full px-2 py-1 text-xs rounded border border-red-300 text-red-700 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="unlinkingId === deliveryman.id"
                @click="handleUnlinkDeliveryman(deliveryman)"
              >
                {{ unlinkingId === deliveryman.id ? 'Removing...' : 'Remove from Company' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!deliverymen.length" class="text-center py-10 bg-white dark:bg-gray-800 rounded-xl card-shadow">
        <Users class="h-10 w-10 text-gray-400 mx-auto mb-3" />
        <p class="text-sm text-gray-600 dark:text-gray-400">No delivery personnel found for current filters.</p>
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

    <ConfirmDialog
      v-model="showUnlinkConfirmModal"
      title="Remove Deliveryman"
      description="This will unlink the deliveryman from your company."
      :message="'Are you sure you want to remove ' + (pendingUnlinkDeliveryman?.name || 'this deliveryman') + '?'"
      confirm-text="Remove"
      cancel-text="Cancel"
      loading-text="Removing..."
      :loading="unlinkingId !== null"
      variant="danger"
      @confirm="confirmUnlinkDeliveryman"
      @cancel="closeUnlinkConfirmModal"
    />

  </div>
</template>

<script>
import { User, Phone, Package, Star, List, Grid, Users } from 'lucide-vue-next'
import FilterForm from '../components/FilterForm.vue'
import Pagination from '../components/Pagination.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { fetchCompanyDeliverymen, unlinkCompanyDeliveryman } from '../api/delivery'
import { useToastStore } from '../stores/toast'

export default {
  name: 'Deliverymen',
  components: {
    User,
    Phone,
    Package,
    Star,
    List,
    Grid,
    Users,
    FilterForm,
    Pagination,
    ConfirmDialog
  },
  setup() {
    const toastStore = useToastStore()
    return { toastStore }
  },
  data() {
    return {
      loading: false,
      unlinkingId: null,
      showUnlinkConfirmModal: false,
      pendingUnlinkDeliveryman: null,
      viewMode: 'table',
      deliverymen: [],
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        last_page: 1,
        from: 0,
        to: 0,
        has_more_pages: false
      },
      filters: {
        search: '',
        status: '',
        identificationNumber: '',
        fromDate: '',
        toDate: '',
        perPage: '10'
      },
      statusOptions: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
      ],
      searchDebounceTimer: null
    }
  },
  async mounted() {
    await this.loadDeliverymen(1)
  },
  beforeUnmount() {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer)
    }
  },
  methods: {
    handleUnlinkDeliveryman(deliveryman) {
      if (!deliveryman?.id) {
        this.toastStore.error('Invalid deliveryman selected')
        return
      }
      this.pendingUnlinkDeliveryman = deliveryman
      this.showUnlinkConfirmModal = true
    },
    closeUnlinkConfirmModal() {
      if (this.unlinkingId !== null) {
        return
      }
      this.showUnlinkConfirmModal = false
      this.pendingUnlinkDeliveryman = null
    },
    async confirmUnlinkDeliveryman() {
      const deliveryman = this.pendingUnlinkDeliveryman
      if (!deliveryman?.id) {
        this.toastStore.error('Invalid deliveryman selected')
        this.closeUnlinkConfirmModal()
        return
      }

      try {
        this.unlinkingId = deliveryman.id
        const response = await unlinkCompanyDeliveryman(deliveryman.id)
        this.toastStore.success(response?.message || 'Deliveryman removed successfully')
        this.showUnlinkConfirmModal = false
        this.pendingUnlinkDeliveryman = null
        await this.loadDeliverymen(this.pagination.current_page || 1)
      } catch (error) {
        const message = error?.response?.data?.message || 'Failed to remove deliveryman'
        this.toastStore.error(message)
      } finally {
        this.unlinkingId = null
      }
    },
    async loadDeliverymen(page = 1) {
      try {
        this.loading = true

        const params = {
          page,
          per_page: Number(this.filters.perPage) || 10,
          sort_by: 'created_at',
          sort_order: 'desc'
        }

        if (this.filters.search?.trim()) {
          params.search = this.filters.search.trim()
        }
        if (this.filters.identificationNumber?.trim()) {
          params.identification_number = this.filters.identificationNumber.trim()
        }
        if (this.filters.status === 'active' || this.filters.status === 'inactive') {
          params.status = this.filters.status
        }
        if (this.filters.fromDate) {
          params.from_date = this.filters.fromDate
        }
        if (this.filters.toDate) {
          params.to_date = this.filters.toDate
        }

        const response = await fetchCompanyDeliverymen(params)
        if (response?.success) {
          const data = response.data || {}
          this.deliverymen = data.delivery_men || []
          this.pagination = data.pagination || this.pagination
        } else {
          this.deliverymen = []
          this.pagination = {
            current_page: 1,
            per_page: Number(this.filters.perPage) || 10,
            total: 0,
            last_page: 1,
            from: 0,
            to: 0,
            has_more_pages: false
          }
        }
      } catch (error) {
        console.error('Error loading delivery personnel:', error)
        this.toastStore.error('Failed to load delivery personnel')
      } finally {
        this.loading = false
      }
    },
    handleFilterChange(newFilters) {
      this.filters = {
        ...this.filters,
        ...newFilters
      }

      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer)
      }

      this.searchDebounceTimer = setTimeout(() => {
        this.loadDeliverymen(1)
      }, 300)
    },
    handlePageChange(page) {
      if (page < 1 || page > this.pagination.last_page) {
        return
      }
      this.loadDeliverymen(page)
    },
    getAverageRating(deliveryman) {
      const count = Number(deliveryman.total_rating_count || 0)
      const points = Number(deliveryman.total_rating_points || 0)

      if (!count) return '0.0'
      return (points / count).toFixed(1)
    }
  }
}
</script>
