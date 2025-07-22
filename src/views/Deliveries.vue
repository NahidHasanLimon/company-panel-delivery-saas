<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Deliveries</h2>
        <p class="text-gray-600 dark:text-gray-400">Manage all deliveries</p>
      </div>
      <div class="flex space-x-3">
        <!-- View Toggle -->
        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button 
            @click="viewMode = 'table'"
            class="px-3 py-1 text-sm rounded-md transition-colors"
            :class="viewMode === 'table' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'"
          >
          >
            <List class="h-4 w-4" />
          </button>
          <button 
            @click="viewMode = 'grid'"
            class="px-3 py-1 text-sm rounded-md transition-colors"
            :class="viewMode === 'grid' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'"
          >
            <Grid class="h-4 w-4" />
          </button>
        </div>
        <button 
          @click="$router.push('/deliveries/create')"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus class="h-4 w-4" />
          <span>New Delivery</span>
        </button>
      </div>
    </div>

    <!-- Advanced Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        
        <!-- Search Field with Type Selection -->
        <div class="lg:col-span-2">
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <div class="flex">
            <select 
              v-model="filters.searchType"
              class="rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="tracking_number">Tracking Number</option>
              <option value="customer_name">Customer Name</option>
              <option value="customer_mobile">Customer Mobile</option>
              <option value="delivery_man_phone">Deliveryman Phone</option>
            </select>
            <input 
              v-model="filters.searchValue"
              type="text"
              :placeholder="getSearchPlaceholder()"
              class="flex-1 rounded-r-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
          </div>
        </div>

        <!-- Delivery Type -->
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Type</label>
          <select 
            v-model="filters.deliveryType"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Types</option>
            <option v-for="type in deliveryTypes" :key="type.value" :value="type.value">
              {{ type.label }}
            </option>
          </select>
        </div>

        <!-- Delivery Mode -->
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Mode</label>
          <select 
            v-model="filters.deliveryMode"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Modes</option>
            <option v-for="mode in deliveryModes" :key="mode.value" :value="mode.value">
              {{ mode.label }}
            </option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select 
            v-model="filters.status"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Status</option>
            <option v-for="status in statusOptions" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>

        <!-- Deliveryman -->
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Deliveryman</label>
          <select 
            v-model="filters.deliveryManId"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Deliverymen</option>
            <option v-for="deliveryman in deliverymen" :key="deliveryman.id" :value="deliveryman.id">
              {{ deliveryman.name }}
            </option>
          </select>
        </div>

        <!-- From Date -->
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">From Date</label>
          <input 
            v-model="filters.fromDate"
            type="date"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
        </div>

        <!-- To Date -->
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">To Date</label>
          <input 
            v-model="filters.toDate"
            type="date"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
        </div>

        <!-- Sort By -->
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
          <select 
            v-model="filters.sortBy"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="created_at">Created Date</option>
            <option value="updated_at">Updated Date</option>
            <option value="customer_name">Customer Name</option>
            <option value="amount">Amount</option>
            <option value="status">Status</option>
          </select>
        </div>

        <!-- Sort Order -->
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Sort Order</label>
          <select 
            v-model="filters.sortOrder"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        <!-- Per Page -->
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Per Page</label>
          <select 
            v-model="filters.perPage"
            class="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="10">10</option>
            <option value="15">15</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <!-- Filter Actions -->
      <div class="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
        <div class="text-sm text-gray-500 dark:text-gray-400">
          <span v-if="appliedFiltersCount > 0">{{ appliedFiltersCount }} filter(s) applied</span>
          <span v-else>No filters applied</span>
        </div>
        <div class="flex space-x-2">
          <button 
            @click="clearFilters"
            class="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Clear All
          </button>
          <button 
            @click="applyFilters"
            class="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Table View -->
    <div v-else-if="viewMode === 'table'" class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tracking Number</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Deliveryman</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Type/Mode</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="delivery in deliveries" :key="delivery.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">
                {{ delivery.tracking_number }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ delivery.customer?.name || 'N/A' }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ delivery.customer?.phone || 'N/A' }}</div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div v-if="delivery.delivery_man" class="text-sm text-gray-900 dark:text-white">
                  <div class="font-medium">{{ delivery.delivery_man.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ delivery.delivery_man.phone }}</div>
                </div>
                <span v-else class="text-sm text-gray-500 dark:text-gray-400">Unassigned</span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="text-sm text-gray-900 dark:text-white">{{ delivery.delivery_type }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ delivery.delivery_mode }}</div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <span 
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusColor(delivery.status)"
                >
                  {{ delivery.status }}
                </span>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                ${{ delivery.amount || '0.00' }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {{ formatDate(delivery.created_at) }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-1">
                  <button 
                    v-if="delivery.status === 'pending'"
                    @click="assignDelivery(delivery.id)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 p-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                    title="Assign Delivery"
                  >
                    <UserCheck class="h-4 w-4" />
                  </button>
                  <button 
                    v-if="delivery.status === 'in-transit'"
                    @click="completeDelivery(delivery.id)"
                    class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 p-1 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                    title="Complete Delivery"
                  >
                    <Check class="h-4 w-4" />
                  </button>
                  <button 
                    @click="viewDelivery(delivery.id)"
                    class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 p-1 hover:bg-gray-50 dark:hover:bg-gray-700 rounded"
                    title="View Details"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div 
        v-for="delivery in deliveries" 
        :key="delivery.id"
        class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <div class="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Package class="h-3 w-3 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ delivery.tracking_number }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDate(delivery.created_at) }}</p>
            </div>
          </div>
          <span 
            class="px-2 py-1 text-xs font-semibold rounded-full"
            :class="getStatusColor(delivery.status)"
          >
            {{ delivery.status }}
          </span>
        </div>

        <div class="space-y-2 mb-3">
          <div class="flex items-start space-x-2">
            <User class="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <div class="text-xs min-w-0">
              <p class="font-medium text-gray-900 dark:text-white truncate">{{ delivery.customer?.name || 'N/A' }}</p>
              <p class="text-gray-500 dark:text-gray-400 truncate">{{ delivery.customer?.phone || 'N/A' }}</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-2">
            <UserCheck class="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <div class="text-xs min-w-0">
              <p class="font-medium text-gray-900 dark:text-white truncate">{{ delivery.delivery_man?.name || 'Unassigned' }}</p>
              <p v-if="delivery.delivery_man?.phone" class="text-gray-500 dark:text-gray-400 truncate">{{ delivery.delivery_man.phone }}</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-2">
            <MapPin class="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <div class="text-xs min-w-0">
              <p class="font-medium text-gray-900 dark:text-white">Type: {{ delivery.delivery_type }}</p>
              <p class="text-gray-500 dark:text-gray-400">Mode: {{ delivery.delivery_mode }}</p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-600">
          <div class="text-sm font-semibold text-gray-900 dark:text-white">
            ${{ delivery.amount || '0.00' }}
          </div>
        </div>

        <div class="flex space-x-1 mt-3">
          <button 
            v-if="delivery.status === 'pending'"
            @click="assignDelivery(delivery.id)"
            class="flex-1 bg-blue-600 text-white p-2 rounded text-xs hover:bg-blue-700 transition-colors flex items-center justify-center"
            title="Assign Delivery"
          >
            <UserCheck class="h-4 w-4" />
          </button>
          <button 
            v-if="delivery.status === 'in-transit'"
            @click="completeDelivery(delivery.id)"
            class="flex-1 bg-green-600 text-white p-2 rounded text-xs hover:bg-green-700 transition-colors flex items-center justify-center"
            title="Complete Delivery"
          >
            <Check class="h-4 w-4" />
          </button>
          <button 
            @click="viewDelivery(delivery.id)"
            class="flex-1 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 p-2 rounded text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center"
            title="View Details"
          >
            <Eye class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="!loading && deliveries.length === 0" class="text-center py-12">
      <Package class="h-12 w-12 text-gray-400 mx-auto mb-4" />
      <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No deliveries found</h3>
      <p class="text-gray-500 dark:text-gray-400 mb-4">Try adjusting your filters or create a new delivery.</p>
      <button 
        @click="$router.push('/deliveries/create')"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        Create Delivery
      </button>
    </div>

    <!-- Pagination -->
    <Pagination 
      v-if="pagination && pagination.total > 0"
      :current-page="pagination.current_page"
      :total-pages="pagination.last_page"
      :total-items="pagination.total"
      :per-page="pagination.per_page"
      :from="pagination.from"
      :to="pagination.to"
      :has-more-pages="pagination.has_more_pages"
      @page-change="handlePageChange"
    />

    <!-- Delivery Details Modal -->
    <DeliveryDetailsModal 
      v-if="showDetailsModal"
      :delivery="selectedDelivery"
      :loading="detailsLoading"
      @close="closeDetailsModal"
    />

  </div>
</template>

<script>
import { 
  List,
  Grid,
  Plus,
  Package,
  Clock,
  User,
  UserCheck,
  MapPin,
  Navigation,
  Eye,
  Check
} from 'lucide-vue-next'
import Pagination from '../components/Pagination.vue'
import DeliveryDetailsModal from '../components/DeliveryDetailsModal.vue'
import { useToastStore } from '../stores/toast'

export default {
  name: 'Deliveries',
  components: {
    List,
    Grid,
    Plus,
    Package,
    Clock,
    User,
    UserCheck,
    MapPin,
    Navigation,
    Eye,
    Check,
    Pagination,
    DeliveryDetailsModal
  },
  setup() {
    const toastStore = useToastStore()
    return { toastStore }
  },
  data() {
    return {
      loading: false,
      viewMode: 'table', // 'table' or 'grid'
      deliveries: [],
      pagination: null,
      deliverymen: [],
      deliveryTypes: [],
      deliveryModes: [],
      statusOptions: [],
      filters: {
        searchType: 'tracking_number',
        searchValue: '',
        deliveryType: '',
        deliveryMode: '',
        status: '',
        deliveryManId: '',
        fromDate: '',
        toDate: '',
        sortBy: 'created_at',
        sortOrder: 'desc',
        perPage: '15'
      },
      appliedFilters: {},
      showDetailsModal: false,
      selectedDelivery: null,
      detailsLoading: false
    }
  },
  computed: {
    appliedFiltersCount() {
      return Object.keys(this.appliedFilters).filter(key => 
        this.appliedFilters[key] !== null && 
        this.appliedFilters[key] !== '' && 
        this.appliedFilters[key] !== undefined
      ).length
    }
  },
  async mounted() {
    await this.loadInitialData()
    await this.loadDeliveries()
  },
  methods: {
    async loadInitialData() {
      try {
        // Load deliverymen, delivery types, and modes
        await Promise.all([
          this.loadDeliverymen(),
          this.loadDeliveryOptions()
        ])
      } catch (error) {
        console.error('Error loading initial data:', error)
        this.toastStore.error('Failed to load initial data')
      }
    },

    async loadDeliverymen() {
      try {
        const { fetchCompanyDeliverymen } = await import('../api/delivery')
        const response = await fetchCompanyDeliverymen()
        if (response.success) {
          this.deliverymen = response.data.data || response.data || []
        }
      } catch (error) {
        console.error('Error loading deliverymen:', error)
      }
    },

    async loadDeliveryOptions() {
      try {
        const { fetchDeliveryOptions } = await import('../api/delivery')
        const response = await fetchDeliveryOptions()
        if (response.success) {
          const options = response.data.data || response.data
          this.deliveryTypes = options.delivery_types || []
          this.deliveryModes = options.delivery_modes || []
          this.statusOptions = options.delivery_statuses || []
        }
      } catch (error) {
        console.error('Error loading delivery options:', error)
      }
    },

    async loadDeliveries(page = 1) {
      try {
        this.loading = true
        const { fetchDeliveries } = await import('../api/delivery')
        
        // Build API parameters
        const params = {
          page,
          per_page: this.appliedFilters.perPage || this.filters.perPage,
          sort_by: this.appliedFilters.sortBy || this.filters.sortBy,
          sort_order: this.appliedFilters.sortOrder || this.filters.sortOrder
        }

        // Add filters to params
        if (this.appliedFilters.searchValue && this.appliedFilters.searchType) {
          params[this.appliedFilters.searchType] = this.appliedFilters.searchValue
        }
        if (this.appliedFilters.deliveryType) {
          params.delivery_type = this.appliedFilters.deliveryType
        }
        if (this.appliedFilters.deliveryMode) {
          params.delivery_mode = this.appliedFilters.deliveryMode
        }
        if (this.appliedFilters.status) {
          params.status = this.appliedFilters.status
        }
        if (this.appliedFilters.deliveryManId) {
          params.delivery_man_id = this.appliedFilters.deliveryManId
        }
        if (this.appliedFilters.fromDate) {
          params.from_date = this.appliedFilters.fromDate
        }
        if (this.appliedFilters.toDate) {
          params.to_date = this.appliedFilters.toDate
        }

        const response = await fetchDeliveries(params)
        
        if (response.success) {
          this.deliveries = response.data.deliveries || []
          this.pagination = response.data.pagination || null
        }
      } catch (error) {
        console.error('Error loading deliveries:', error)
        this.toastStore.error('Failed to load deliveries')
      } finally {
        this.loading = false
      }
    },

    getSearchPlaceholder() {
      const placeholders = {
        tracking_number: 'Enter tracking number...',
        customer_name: 'Enter customer name...',
        customer_mobile: 'Enter customer mobile...',
        delivery_man_phone: 'Enter deliveryman phone...'
      }
      return placeholders[this.filters.searchType] || 'Search...'
    },

    applyFilters() {
      this.appliedFilters = { ...this.filters }
      this.loadDeliveries(1)
    },

    clearFilters() {
      this.filters = {
        searchType: 'tracking_number',
        searchValue: '',
        deliveryType: '',
        deliveryMode: '',
        status: '',
        deliveryManId: '',
        fromDate: '',
        toDate: '',
        sortBy: 'created_at',
        sortOrder: 'desc',
        perPage: '15'
      }
      this.appliedFilters = {}
      this.loadDeliveries(1)
    },

    handlePageChange(page) {
      this.loadDeliveries(page)
    },

    getStatusColor(status) {
      const colors = {
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'assigned': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'in-transit': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        'delivered': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      }
      return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    async assignDelivery(deliveryId) {
      try {
        // This would typically open a modal to select deliveryman
        this.toastStore.info('Assign delivery functionality to be implemented')
      } catch (error) {
        console.error('Error assigning delivery:', error)
        this.toastStore.error('Error assigning delivery. Please try again.')
      }
    },

    async completeDelivery(deliveryId) {
      try {
        // This would typically call an API to complete the delivery
        this.toastStore.info('Complete delivery functionality to be implemented')
      } catch (error) {
        console.error('Error completing delivery:', error)
        this.toastStore.error('Error completing delivery. Please try again.')
      }
    },

    async viewDelivery(deliveryId) {
      try {
        this.showDetailsModal = true
        this.detailsLoading = true
        this.selectedDelivery = null

        const { fetchDeliveryDetails } = await import('../api/delivery')
        const response = await fetchDeliveryDetails(deliveryId)
        
        if (response.success) {
          this.selectedDelivery = response.data
        }
      } catch (error) {
        console.error('Error loading delivery details:', error)
        this.toastStore.error('Failed to load delivery details')
        this.closeDetailsModal()
      } finally {
        this.detailsLoading = false
      }
    },

    closeDetailsModal() {
      this.showDetailsModal = false
      this.selectedDelivery = null
      this.detailsLoading = false
    }
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
