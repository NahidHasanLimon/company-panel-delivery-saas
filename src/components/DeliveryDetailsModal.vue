<template>
  <div v-if="delivery" class="fixed inset-0 bg-slate-900/15 backdrop-blur-[1px] flex items-center justify-center p-4 z-50">
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-7xl max-h-[95vh] overflow-y-auto">
      <div v-if="loading" class="flex items-center justify-center h-full">
        <span class="text-gray-500 dark:text-gray-400">Loading...</span>
      </div>
      <div v-else>
        <!-- Header Section -->
        <div class="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
            Delivery Details - {{ delivery.tracking_number }}
          </h2>
          <button 
            @click="$emit('close')" 
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close modal"
          >
            <X class="h-5 w-5" />
          </button>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 p-6">
          <!-- Left Column - Delivery Details -->
          <div class="space-y-6">
            <div class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-xs font-semibold text-gray-900 dark:text-white flex items-center">
                  <FileText class="h-4 w-4 mr-2 text-blue-600" />
                  Delivery Details
                </h3>
              </div>
              <div class="p-4 space-y-2">
                <div class="flex justify-between text-xs border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span class="text-gray-500 dark:text-gray-400">Tracking Number:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ delivery.tracking_number }}</span>
                </div>
                <div class="flex justify-between text-xs border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span class="text-gray-500 dark:text-gray-400">Pickup Label:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ delivery.pickup_label }}</span>
                </div>
                <div class="flex justify-between text-xs border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span class="text-gray-500 dark:text-gray-400">Pickup Address:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ delivery.pickup_address }}</span>
                </div>
                <div class="flex justify-between text-xs border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span class="text-gray-500 dark:text-gray-400">Drop Label:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ delivery.drop_label }}</span>
                </div>
                <div class="flex justify-between text-xs border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span class="text-gray-500 dark:text-gray-400">Drop Address:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ delivery.drop_address }}</span>
                </div>
                <div class="flex justify-between text-xs border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span class="text-gray-500 dark:text-gray-400">Expected Delivery Time:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatDateTime(delivery.expected_delivery_time) }}</span>
                </div>
                <div class="flex justify-between text-xs border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span class="text-gray-500 dark:text-gray-400">Amount:</span>
                  <span class="font-medium text-gray-900 dark:text-white">${{ delivery.amount }}</span>
                </div>
              </div>
            </div>

            
          </div>

          <!-- Right Column - Customer & Deliveryman -->
          <div class="space-y-6">
            <!-- Deliveryman Information -->
            <div class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-xs font-semibold text-gray-900 dark:text-white flex items-center">
                  <UserCheck class="h-4 w-4 mr-2 text-blue-600" />
                  Deliveryman
                </h3>
              </div>
              <div class="p-4 space-y-2">
                <div v-if="delivery.delivery_man">
                  <div class="flex justify-between text-xs">
                    <span class="text-gray-500 dark:text-gray-400">Name:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ delivery.delivery_man.name }}</span>
                  </div>
                  <div class="flex justify-between text-xs">
                    <span class="text-gray-500 dark:text-gray-400">Phone:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ delivery.delivery_man.phone }}</span>
                  </div>
                </div>
                <div v-else class="text-center py-4">
                  <UserX class="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p class="text-xs text-gray-500 dark:text-gray-400">No deliveryman assigned</p>
                </div>
              </div>
            </div>
            <!-- Customer Information -->
            <div class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-xs font-semibold text-gray-900 dark:text-white flex items-center">
                  <User class="h-4 w-4 mr-2 text-blue-600" />
                  Customer Information
                </h3>
              </div>
              <div class="p-4 space-y-2">
                <div v-if="delivery.customer">
                  <div class="flex justify-between text-xs">
                    <span class="text-gray-500 dark:text-gray-400">Name:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ delivery.customer.name }}</span>
                  </div>
                  <div class="flex justify-between text-xs">
                    <span class="text-gray-500 dark:text-gray-400">Mobile:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ delivery.customer.mobile_no }}</span>
                  </div>
                  <div v-if="delivery.customer.email" class="flex justify-between text-xs">
                    <span class="text-gray-500 dark:text-gray-400">Email:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ delivery.customer.email }}</span>
                  </div>
                  <div v-if="delivery.customer.address" class="flex justify-between text-xs">
                    <span class="text-gray-500 dark:text-gray-400">Address:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ delivery.customer.address }}</span>
                  </div>
                </div>
              </div>
            </div>
            
          </div>
          <!-- Timeline Section -->
            <div class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden">
              <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
                <h3 class="text-xs font-semibold text-gray-900 dark:text-white flex items-center">
                  <Clock class="h-4 w-4 mr-2 text-blue-600" />
                  Timeline
                </h3>
              </div>
              <div class="p-4 space-y-2">
                <div class="flex justify-between text-xs border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span class="text-gray-500 dark:text-gray-400">Status:</span>
                  <StatusBadge :status="delivery.status" />
                </div>
                <div class="flex justify-between text-xs border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span class="text-gray-500 dark:text-gray-400">Type:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ delivery.delivery_type }}</span>
                </div>
                <div class="flex justify-between text-xs border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span class="text-gray-500 dark:text-gray-400">Delivery Mode:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ delivery.delivery_mode }}</span>
                </div>
                <div class="flex justify-between text-xs border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span class="text-gray-500 dark:text-gray-400">Assigned At:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatDateTime(delivery.assigned_at) }}</span>
                </div>
                <div class="flex justify-between text-xs border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span class="text-gray-500 dark:text-gray-400">In Progress At:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatDateTime(delivery.in_progress_at) }}</span>
                </div>
                <div class="flex justify-between text-xs border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span class="text-gray-500 dark:text-gray-400">Delivered At:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatDateTime(delivery.delivered_at) }}</span>
                </div>
                <div class="flex justify-between text-xs border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span class="text-gray-500 dark:text-gray-400">Delivery Notes:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ delivery.delivery_notes || 'N/A' }}</span>
                </div>
                <div class="flex justify-between text-xs border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span class="text-gray-500 dark:text-gray-400">Proof Notes:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ delivery.proof_notes || 'N/A' }}</span>
                </div>
                <div class="flex justify-between text-xs border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span class="text-gray-500 dark:text-gray-400">Proof Image:</span>
                  <span>
                    <button v-if="delivery.proof_image_url" @click="viewImage(delivery.proof_image_url)" class="text-blue-500 hover:underline">View</button>
                    <span v-else class="text-gray-500 dark:text-gray-400">N/A</span>
                  </span>
                </div>
                <div class="flex justify-between text-xs border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span class="text-gray-500 dark:text-gray-400">Created At:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatDateTime(delivery.created_at) }}</span>
                </div>
                <div class="flex justify-between text-xs border-b border-gray-200 dark:border-gray-600 pb-2">
                  <span class="text-gray-500 dark:text-gray-400">Last Updated At:</span>
                  <span class="font-medium text-gray-900 dark:text-white">{{ formatDateTime(delivery.updated_at) }}</span>
                </div>
              </div>
            </div>
        </div>

        <!-- Items Table -->
        <div class="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 overflow-hidden mt-6">
          <div class="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-600">
            <h3 class="text-xs font-semibold text-gray-900 dark:text-white flex items-center">
              <Package class="h-4 w-4 mr-2 text-blue-600" />
              Items ({{ delivery.items?.length || 0 }})
            </h3>
          </div>
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product Information</th>
                <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity & Unit</th>
                <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Delivery Remarks</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="(item, index) in delivery.items" :key="index">
                <td class="px-4 py-2 text-xs text-gray-900 dark:text-white">
                  <div class="font-semibold">{{ item.name }}</div>
                  <div v-if="item.code" class="text-[10px] font-mono text-gray-500 dark:text-gray-400">({{ item.code }})</div>
                  <div v-if="item.item_notes" class="text-[10px] text-gray-500 dark:text-gray-400">{{ item.item_notes }}</div>
                </td>
                <td class="px-4 py-2 text-xs text-gray-900 dark:text-white">{{ item.quantity }} {{ item.unit }}</td>
                <td class="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">{{ item.notes || 'N/A' }}</td>
              </tr>
            </tbody>
          </table>
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
import StatusBadge from './StatusBadge.vue'

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
    Info,
    StatusBadge
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
    formatDateTime(dateString) {
      if (!dateString) return 'N/A'
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },

    viewImage(url) {
      // Logic to view image in a new tab or modal
      window.open(url, '_blank');
    }
  }
}
</script>
