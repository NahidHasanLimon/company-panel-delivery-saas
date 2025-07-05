<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Deliveries</h2>
        <p class="text-gray-600 dark:text-gray-400">Track and manage all deliveries</p>
      </div>
      <div class="flex space-x-3">
        <!-- View Toggle -->
        <div class="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button 
            @click="viewMode = 'table'"
            class="px-3 py-1 text-sm rounded-md transition-colors"
            :class="viewMode === 'table' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300'"
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
          @click="showAddModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus class="h-4 w-4" />
          <span>New Delivery</span>
        </button>
      </div>
    </div>

    <!-- Filter Component -->
    <FilterForm 
      :show-status="true"
      :show-deliveryman="true"
      :show-priority="true"
      :status-options="statusOptions"
      :deliverymen-options="store.deliverymen"
      @filter-change="handleFilterChange"
    />

    <!-- Table View -->
    <div v-if="viewMode === 'table'" class="bg-white dark:bg-gray-800 rounded-xl card-shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Customer</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Deliveryman</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Pickup</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Delivery</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Value</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="delivery in paginatedDeliveries" :key="delivery.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ delivery.id }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-white">{{ delivery.customerName }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ delivery.customerPhone }}</div>
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                {{ delivery.deliverymanName || 'Unassigned' }}
              </td>
              <td class="px-4 py-3 max-w-xs">
                <div class="text-sm text-gray-900 dark:text-white truncate">{{ delivery.pickupAddress }}</div>
              </td>
              <td class="px-4 py-3 max-w-xs">
                <div class="text-sm text-gray-900 dark:text-white truncate">{{ delivery.deliveryAddress }}</div>
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
                ${{ delivery.orderValue }}
              </td>
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-1">
                  <button 
                    v-if="delivery.status === 'pending'"
                    @click="assignDelivery(delivery.id)"
                    class="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 text-xs px-2 py-1 border border-blue-600 dark:border-blue-400 rounded"
                  >
                    Assign
                  </button>
                  <button 
                    v-if="delivery.status === 'in-transit'"
                    @click="completeDelivery(delivery.id)"
                    class="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 text-xs px-2 py-1 border border-green-600 dark:border-green-400 rounded"
                  >
                    Complete
                  </button>
                  <button class="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 text-xs px-2 py-1 border border-gray-300 dark:border-gray-600 rounded">
                    View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div 
        v-for="delivery in paginatedDeliveries" 
        :key="delivery.id"
        class="bg-white dark:bg-gray-800 rounded-lg card-shadow p-4 hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-2">
            <div class="w-6 h-6 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
              <Package class="h-3 w-3 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white">{{ delivery.id }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatTime(delivery.createdAt) }}</p>
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
              <p class="font-medium text-gray-900 dark:text-white truncate">{{ delivery.customerName }}</p>
              <p class="text-gray-500 dark:text-gray-400 truncate">{{ delivery.customerPhone }}</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-2">
            <UserCheck class="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <div class="text-xs min-w-0">
              <p class="font-medium text-gray-900 dark:text-white truncate">{{ delivery.deliverymanName || 'Unassigned' }}</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-2">
            <MapPin class="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <div class="text-xs min-w-0">
              <p class="font-medium text-gray-900 dark:text-white truncate">{{ delivery.pickupAddress }}</p>
            </div>
          </div>
          
          <div class="flex items-start space-x-2">
            <Navigation class="h-3 w-3 text-gray-400 mt-0.5 flex-shrink-0" />
            <div class="text-xs min-w-0">
              <p class="font-medium text-gray-900 dark:text-white truncate">{{ delivery.deliveryAddress }}</p>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between py-2 border-t border-gray-200 dark:border-gray-600">
          <div class="flex items-center space-x-3">
            <div class="text-xs">
              <p class="font-semibold text-gray-900 dark:text-white">${{ delivery.orderValue }}</p>
            </div>
            <div class="text-xs">
              <p class="font-semibold text-gray-900 dark:text-white">{{ delivery.estimatedTime }}</p>
            </div>
          </div>
          <div 
            class="w-2 h-2 rounded-full"
            :class="getPriorityColor(delivery.priority)"
          ></div>
        </div>

        <div class="flex space-x-1 mt-3">
          <button 
            v-if="delivery.status === 'pending'"
            @click="assignDelivery(delivery.id)"
            class="flex-1 bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
          >
            Assign
          </button>
          <button 
            v-if="delivery.status === 'in-transit'"
            @click="completeDelivery(delivery.id)"
            class="flex-1 bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700 transition-colors"
          >
            Complete
          </button>
          <button class="flex-1 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 px-2 py-1 rounded text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
            View
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <Pagination 
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      :total-items="filteredDeliveries.length"
      :per-page="parseInt(filters.perPage)"
      @page-change="handlePageChange"
    />

    <!-- Add Delivery Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-gray-900/20 dark:bg-gray-900/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create New Delivery</h3>
        <form @submit.prevent="addDelivery" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Customer</label>
              <select 
                v-model="formData.customerId"
                required
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select Customer</option>
                <option v-for="customer in store.customers" :key="customer.id" :value="customer.id">
                  {{ customer.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deliveryman</label>
              <select 
                v-model="formData.deliverymanId"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Assign Later</option>
                <option v-for="deliveryman in store.deliverymen" :key="deliveryman.id" :value="deliveryman.id">
                  {{ deliveryman.name }}
                </option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pickup Address</label>
            <input 
              v-model="formData.pickupAddress"
              type="text" 
              required
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter pickup address"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Delivery Address</label>
            <input 
              v-model="formData.deliveryAddress"
              type="text" 
              required
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter delivery address"
            >
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order Value</label>
              <input 
                v-model="formData.orderValue"
                type="number" 
                step="0.01"
                required
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="0.00"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
              <select 
                v-model="formData.priority"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimated Time</label>
              <input 
                v-model="formData.estimatedTime"
                type="text" 
                required
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="30 min"
              >
            </div>
          </div>
          <div class="flex space-x-3 pt-4">
            <button 
              type="button"
              @click="closeModal"
              class="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Delivery
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useDashboardStore } from '../stores/dashboard'
import { Package, User, UserCheck, MapPin, Navigation, Plus, List, Grid } from 'lucide-vue-next'
import FilterForm from '../components/FilterForm.vue'
import Pagination from '../components/Pagination.vue'

export default {
  name: 'Deliveries',
  components: {
    Package,
    User,
    UserCheck,
    MapPin,
    Navigation,
    Plus,
    List,
    Grid,
    FilterForm,
    Pagination
  },
  setup() {
    const store = useDashboardStore()
    return { store }
  },
  data() {
    return {
      showAddModal: false,
      currentPage: 1,
      viewMode: 'table', // 'table' or 'grid'
      filters: {
        search: '',
        status: '',
        deliveryman: '',
        priority: '',
        fromDate: '',
        toDate: '',
        perPage: '12'
      },
      formData: {
        customerId: '',
        deliverymanId: '',
        pickupAddress: '',
        deliveryAddress: '',
        orderValue: '',
        priority: 'medium',
        estimatedTime: ''
      },
      statusOptions: [
        { value: 'pending', label: 'Pending' },
        { value: 'assigned', label: 'Assigned' },
        { value: 'in-transit', label: 'In Transit' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' }
      ]
    }
  },
  computed: {
    filteredDeliveries() {
      let filtered = [...this.store.deliveries]
      
      if (this.filters.search) {
        const search = this.filters.search.toLowerCase()
        filtered = filtered.filter(delivery => 
          delivery.id.toLowerCase().includes(search) ||
          delivery.customerName.toLowerCase().includes(search) ||
          delivery.customerPhone.includes(search) ||
          delivery.deliverymanName.toLowerCase().includes(search) ||
          delivery.pickupAddress.toLowerCase().includes(search) ||
          delivery.deliveryAddress.toLowerCase().includes(search)
        )
      }
      
      if (this.filters.status) {
        filtered = filtered.filter(delivery => delivery.status === this.filters.status)
      }
      
      if (this.filters.deliveryman) {
        filtered = filtered.filter(delivery => delivery.deliverymanName === this.filters.deliveryman)
      }
      
      if (this.filters.priority) {
        filtered = filtered.filter(delivery => delivery.priority === this.filters.priority)
      }
      
      if (this.filters.fromDate) {
        filtered = filtered.filter(delivery => 
          new Date(delivery.createdAt) >= new Date(this.filters.fromDate)
        )
      }
      
      if (this.filters.toDate) {
        filtered = filtered.filter(delivery => 
          new Date(delivery.createdAt) <= new Date(this.filters.toDate + 'T23:59:59')
        )
      }
      
      return filtered
    },
    totalPages() {
      return Math.ceil(this.filteredDeliveries.length / parseInt(this.filters.perPage))
    },
    paginatedDeliveries() {
      const start = (this.currentPage - 1) * parseInt(this.filters.perPage)
      const end = start + parseInt(this.filters.perPage)
      return this.filteredDeliveries.slice(start, end)
    }
  },
  methods: {
    handleFilterChange(newFilters) {
      this.filters = { ...newFilters }
      this.currentPage = 1
    },
    handlePageChange(page) {
      this.currentPage = page
    },
    getStatusColor(status) {
      const colors = {
        'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        'assigned': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        'in-transit': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
        'completed': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      }
      return colors[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    },
    getPriorityColor(priority) {
      const colors = {
        'high': 'bg-red-500',
        'medium': 'bg-yellow-500',
        'low': 'bg-green-500'
      }
      return colors[priority] || 'bg-gray-500'
    },
    formatTime(timestamp) {
      return new Date(timestamp).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    assignDelivery(deliveryId) {
      const availableDeliveryman = this.store.deliverymen.find(d => d.status === 'active')
      if (availableDeliveryman) {
        this.store.assignDelivery(deliveryId, availableDeliveryman.id)
      }
    },
    completeDelivery(deliveryId) {
      this.store.updateDeliveryStatus(deliveryId, 'completed')
    },
    addDelivery() {
      const selectedCustomer = this.store.customers.find(c => c.id == this.formData.customerId)
      const selectedDeliveryman = this.store.deliverymen.find(d => d.id == this.formData.deliverymanId)
      
      const newDelivery = {
        id: 'DEL-' + String(this.store.deliveries.length + 1).padStart(3, '0'),
        customerName: selectedCustomer?.name || '',
        customerPhone: selectedCustomer?.phone || '',
        deliverymanName: selectedDeliveryman?.name || '',
        pickupAddress: this.formData.pickupAddress,
        deliveryAddress: this.formData.deliveryAddress,
        status: this.formData.deliverymanId ? 'assigned' : 'pending',
        priority: this.formData.priority,
        orderValue: parseFloat(this.formData.orderValue),
        estimatedTime: this.formData.estimatedTime,
        createdAt: new Date().toISOString()
      }
      
      this.store.deliveries.push(newDelivery)
      this.closeModal()
    },
    closeModal() {
      this.showAddModal = false
      this.formData = {
        customerId: '',
        deliverymanId: '',
        pickupAddress: '',
        deliveryAddress: '',
        orderValue: '',
        priority: 'medium',
        estimatedTime: ''
      }
    }
  }
}
</script>