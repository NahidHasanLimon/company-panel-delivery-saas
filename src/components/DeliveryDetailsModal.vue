<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white dark:bg-gray-800 flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 rounded-t-xl">
        <div class="flex items-center space-x-4">
          <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Package class="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900 dark:text-white">Delivery Details</h2>
            <p v-if="delivery" class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <span class="font-mono">{{ delivery.tracking_number }}</span>
              <span 
                class="ml-3 px-2 py-1 text-xs font-semibold rounded-full"
                :class="getStatusColor(delivery.status)"
              >
                {{ delivery.status }}
              </span>
            </p>
          </div>
        </div>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
        >
          <X class="h-6 w-6" />
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Content -->
      <div v-else-if="delivery" class="p-6">
        
        <!-- Quick Stats Cards -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div class="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Amount</p>
                <p class="text-lg font-bold text-blue-900 dark:text-blue-100">${{ delivery.amount }}</p>
              </div>
              <DollarSign class="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">Items</p>
                <p class="text-lg font-bold text-green-900 dark:text-green-100">{{ delivery.items?.length || 0 }}</p>
              </div>
              <Package class="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-purple-600 dark:text-purple-400 uppercase tracking-wide">Type</p>
                <p class="text-sm font-bold text-purple-900 dark:text-purple-100">{{ delivery.delivery_type }}</p>
              </div>
              <Truck class="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wide">Mode</p>
                <p class="text-sm font-bold text-orange-900 dark:text-orange-100">{{ delivery.delivery_mode }}</p>
              </div>
              <Zap class="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          <!-- Left Column - Customer & Deliveryman -->
          <div class="space-y-6">
            
            <!-- Customer Information -->
            <div class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                  <User class="h-4 w-4 mr-2 text-blue-600" />
                  Customer Information
                </h3>
              </div>
              <div class="p-4">
                <div v-if="delivery.customer" class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Name:</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ delivery.customer.name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Mobile:</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ delivery.customer.mobile_no }}</span>
                  </div>
                  <div v-if="delivery.customer.email" class="flex justify-between">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Email:</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ delivery.customer.email }}</span>
                  </div>
                  <div v-if="delivery.customer.customer_code" class="flex justify-between">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Code:</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white font-mono">{{ delivery.customer.customer_code }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Deliveryman Information -->
            <div class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                  <UserCheck class="h-4 w-4 mr-2 text-blue-600" />
                  Deliveryman
                </h3>
              </div>
              <div class="p-4">
                <div v-if="delivery.delivery_man" class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Name:</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ delivery.delivery_man.name }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Phone:</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ delivery.delivery_man.phone }}</span>
                  </div>
                  <div v-if="delivery.assigned_at" class="flex justify-between">
                    <span class="text-sm text-gray-500 dark:text-gray-400">Assigned:</span>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDateTime(delivery.assigned_at) }}</span>
                  </div>
                </div>
                <div v-else class="text-center py-4">
                  <UserX class="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p class="text-sm text-gray-500 dark:text-gray-400">No deliveryman assigned</p>
                </div>
              </div>
            </div>

            <!-- Timeline -->
            <div class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                  <Clock class="h-4 w-4 mr-2 text-blue-600" />
                  Timeline
                </h3>
              </div>
              <div class="p-4">
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span class="text-sm text-gray-500 dark:text-gray-400">Created</span>
                    </div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDateTime(delivery.created_at) }}</span>
                  </div>
                  <div v-if="delivery.assigned_at" class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                      <span class="text-sm text-gray-500 dark:text-gray-400">Assigned</span>
                    </div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDateTime(delivery.assigned_at) }}</span>
                  </div>
                  <div v-if="delivery.in_progress_at" class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span class="text-sm text-gray-500 dark:text-gray-400">In Progress</span>
                    </div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDateTime(delivery.in_progress_at) }}</span>
                  </div>
                  <div v-if="delivery.delivered_at" class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span class="text-sm text-gray-500 dark:text-gray-400">Delivered</span>
                    </div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDateTime(delivery.delivered_at) }}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <div class="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                      <span class="text-sm text-gray-500 dark:text-gray-400">Updated</span>
                    </div>
                    <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDateTime(delivery.updated_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Middle Column - Addresses & Notes -->
          <div class="space-y-6">
            
            <!-- Addresses -->
            <div class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                  <MapPin class="h-4 w-4 mr-2 text-blue-600" />
                  Addresses
                </h3>
              </div>
              <div class="p-4 space-y-4">
                <!-- Pickup Address -->
                <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                  <div class="flex items-start">
                    <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span class="text-xs font-bold text-white">P</span>
                    </div>
                    <div class="flex-1">
                      <h4 class="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">{{ delivery.pickup_label }}</h4>
                      <p class="text-sm text-blue-800 dark:text-blue-200">{{ delivery.pickup_address }}</p>
                    </div>
                  </div>
                </div>
                
                <!-- Drop Address -->
                <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                  <div class="flex items-start">
                    <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span class="text-xs font-bold text-white">D</span>
                    </div>
                    <div class="flex-1">
                      <h4 class="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">{{ delivery.drop_label }}</h4>
                      <p class="text-sm text-green-800 dark:text-green-200">{{ delivery.drop_address }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Delivery Info -->
            <div class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                  <Info class="h-4 w-4 mr-2 text-blue-600" />
                  Delivery Info
                </h3>
              </div>
              <div class="p-4 space-y-3">
                <div class="flex justify-between">
                  <span class="text-sm text-gray-500 dark:text-gray-400">Expected Time:</span>
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDateTime(delivery.expected_delivery_time) }}</span>
                </div>
              </div>
            </div>

            <!-- Notes -->
            <div v-if="delivery.delivery_notes" class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                  <FileText class="h-4 w-4 mr-2 text-blue-600" />
                  Delivery Notes
                </h3>
              </div>
              <div class="p-4">
                <p class="text-sm text-gray-900 dark:text-white leading-relaxed">{{ delivery.delivery_notes }}</p>
              </div>
            </div>

            <!-- Proof (if delivered) -->
            <div v-if="delivery.status === 'delivered' && (delivery.proof_notes || delivery.proof_image_url)" class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                  <CheckCircle class="h-4 w-4 mr-2 text-green-600" />
                  Delivery Proof
                </h3>
              </div>
              <div class="p-4 space-y-3">
                <div v-if="delivery.proof_notes">
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Notes:</span>
                  <p class="text-sm text-gray-900 dark:text-white mt-1">{{ delivery.proof_notes }}</p>
                </div>
                <div v-if="delivery.proof_image_url">
                  <span class="text-sm font-medium text-gray-500 dark:text-gray-400">Image:</span>
                  <img 
                    :src="delivery.proof_image_url" 
                    alt="Delivery Proof" 
                    class="mt-2 max-w-full rounded-lg border border-gray-200 dark:border-gray-600"
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Items Table -->
          <div class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
            <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                <Package class="h-4 w-4 mr-2 text-blue-600" />
                Items ({{ delivery.items?.length || 0 }})
              </h3>
            </div>
            <div class="overflow-hidden">
              <div v-if="delivery.items && delivery.items.length > 0" class="divide-y divide-gray-200 dark:divide-gray-600">
                <div 
                  v-for="(item, index) in delivery.items" 
                  :key="index" 
                  class="p-4 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                      <h4 class="text-sm font-semibold text-gray-900 dark:text-white mb-1">{{ item.name }}</h4>
                      <p class="text-xs font-mono text-gray-500 dark:text-gray-400">{{ item.code }}</p>
                    </div>
                    <div class="text-right">
                      <div class="text-sm font-bold text-gray-900 dark:text-white">{{ item.quantity }} {{ item.unit }}</div>
                      <div class="text-xs text-gray-500 dark:text-gray-400">Quantity</div>
                    </div>
                  </div>
                  
                  <div v-if="item.notes || item.item_notes" class="space-y-2">
                    <div v-if="item.notes" class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border-l-4 border-blue-400">
                      <div class="flex items-start">
                        <div class="w-4 h-4 bg-blue-400 rounded-full flex items-center justify-center mr-2 mt-0.5">
                          <span class="text-xs font-bold text-white">N</span>
                        </div>
                        <div>
                          <p class="text-xs font-medium text-blue-800 dark:text-blue-200">Customer Notes</p>
                          <p class="text-sm text-blue-900 dark:text-blue-100">{{ item.notes }}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div v-if="item.item_notes" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border-l-4 border-gray-400">
                      <div class="flex items-start">
                        <div class="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center mr-2 mt-0.5">
                          <span class="text-xs font-bold text-white">I</span>
                        </div>
                        <div>
                          <p class="text-xs font-medium text-gray-600 dark:text-gray-300">Item Notes</p>
                          <p class="text-sm text-gray-700 dark:text-gray-200 italic">{{ item.item_notes }}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-8">
                <Package class="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p class="text-sm text-gray-500 dark:text-gray-400">No items listed</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex justify-end p-6 border-t border-gray-200 dark:border-gray-700">
        <button 
          @click="$emit('close')"
          class="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  X, 
  Package, 
  User, 
  UserCheck, 
  UserX,
  MapPin, 
  Clock, 
  FileText, 
  CheckCircle,
  DollarSign,
  Truck,
  Zap,
  Info
} from 'lucide-vue-next'

export default {
  name: 'DeliveryDetailsModal',
  components: {
    X,
    Package,
    User,
    UserCheck,
    UserX,
    MapPin,
    Clock,
    FileText,
    CheckCircle,
    DollarSign,
    Truck,
    Zap,
    Info
  },
  props: {
    delivery: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
  methods: {
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

    formatDateTime(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>
