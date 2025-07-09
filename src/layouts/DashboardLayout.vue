<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Sidebar -->
    <div 
      class="fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-lg transform transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700"
      :class="[
        isMobile
          ? (sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full w-64')
          : (sidebarCollapsed ? 'w-20' : 'w-64'),
        'transition-all duration-300'
      ]"
    >
      <!-- Logo Section -->
      <div class="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800">
        <h1 class="text-xl font-bold text-white" v-if="!sidebarCollapsed">DeliverFlow</h1>
        <h1 class="text-xl font-bold text-white" v-else>D</h1>
        <!-- Mobile Close Button -->
        <button
          @click="sidebarOpen = false"
          class="lg:hidden p-1 rounded-md text-blue-100 hover:bg-blue-500/20 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      <!-- Navigation -->
      <nav class="mt-6 px-2">
        <div class="space-y-1">
          <router-link
            to="/"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group"
            :class="$route.name === 'Dashboard' 
              ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
          >
            <BarChart3 class="w-5 h-5 mr-3 transition-colors" />
            <span v-if="!sidebarCollapsed">Dashboard</span>
          </router-link>
          <router-link
            to="/deliveries"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group"
            :class="$route.name === 'Deliveries' 
              ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
          >
            <Package class="w-5 h-5 mr-3 transition-colors" />
            <span v-if="!sidebarCollapsed">Deliveries</span>
          </router-link>
          <router-link
            to="/deliverymen"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group"
            :class="$route.name === 'Deliverymen' 
              ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
          >
            <Users class="w-5 h-5 mr-3 transition-colors" />
            <span v-if="!sidebarCollapsed">Delivery Personnel</span>
          </router-link>
          <router-link
            to="/customers"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group"
            :class="$route.name === 'Customers' 
              ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
          >
            <UserCheck class="w-5 h-5 mr-3 transition-colors" />
            <span v-if="!sidebarCollapsed">Customers</span>
          </router-link>
          <router-link
            to="/analytics"
            class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group"
            :class="$route.name === 'Analytics' 
              ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
          >
            <TrendingUp class="w-5 h-5 mr-3 transition-colors" />
            <span v-if="!sidebarCollapsed">Analytics</span>
          </router-link>
        </div>
        <!-- Bottom Section -->
        <div class="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div class="space-y-1">
            <router-link
              to="/profile"
              class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group"
              :class="$route.name === 'Profile' 
                ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'"
            >
              <User class="w-5 h-5 mr-3 transition-colors" />
              <span v-if="!sidebarCollapsed">Profile</span>
            </router-link>
            <button
              @click="logout"
              class="w-full flex items-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-all duration-200"
            >
              <LogOut class="w-5 h-5 mr-3 transition-colors" />
              <span v-if="!sidebarCollapsed">Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
    <!-- Main Content -->
    <div class="transition-all duration-300 ease-in-out" :class="sidebarOpen && !sidebarCollapsed ? 'lg:pl-64' : sidebarOpen && sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-0'">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div class="flex items-center justify-between px-4 lg:px-6 py-2">
          <div class="flex items-center space-x-4">
            <!-- Mobile Sidebar Toggle -->
            <button
              @click="toggleSidebar"
              class="lg:hidden p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Menu class="w-5 h-5" />
            </button>
            <!-- Desktop Sidebar Toggle -->
            <button
              @click="toggleSidebarCollapse"
              class="hidden lg:flex p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :title="sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
            >
              <PanelLeftOpen v-if="sidebarCollapsed" class="w-5 h-5" />
              <PanelLeftClose v-else class="w-5 h-5" />
            </button>
            <div>
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">{{ getPageTitle() }}</h2>
              <p class="text-xs text-gray-500 dark:text-gray-400">{{ getPageDescription() }}</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <!-- Dark Mode Toggle -->
            <button
              @click="toggleDarkMode"
              class="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            >
              <Sun v-if="isDarkMode" class="w-5 h-5" />
              <Moon v-else class="w-5 h-5" />
            </button>
            
            <!-- Notifications Dropdown -->
            <div class="relative" data-dropdown="notifications">
              <button 
                @click="toggleNotifications"
                class="p-1.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 relative"
              >
                <Bell class="w-5 h-5" />
                <span v-if="unreadNotifications > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
                </span>
              </button>
              <div 
                v-if="showNotifications"
                class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                @click.stop
              >
                <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
                  <button @click="markAllAsRead" class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">Mark all read</button>
                </div>
                <div class="max-h-96 overflow-y-auto">
                  <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
                  <div v-else>
                    <div v-for="notification in notifications" :key="notification.id" class="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" :class="{ 'bg-blue-50 dark:bg-blue-900/20': !notification.read }" @click="markAsRead(notification.id)">
                      <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0">
                          <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                            <component :is="getNotificationIcon(notification.type)" class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ notification.title }}</p>
                          <p class="text-sm text-gray-500 dark:text-gray-400">{{ notification.message }}</p>
                          <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">{{ formatNotificationTime(notification.time) }}</p>
                        </div>
                        <div v-if="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- User Profile Dropdown -->
            <div class="relative" data-dropdown="user">
              <button 
                @click="toggleUserMenu"
                class="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <div class="w-7 h-7 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                  <User class="w-4 h-4 text-white" />
                </div>
                <div class="hidden md:block text-left">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">admin@deliverflow.com</p>
                </div>
                <ChevronDown class="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
              <div 
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50"
                @click.stop
              >
                <div class="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p class="text-sm font-medium text-gray-900 dark:text-white">Admin User</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">admin@deliverflow.com</p>
                </div>
                <div class="py-2">
                  <router-link to="/profile" @click.native="showUserMenu = false" class="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <User class="w-4 h-4 mr-3" />
                    View Profile
                  </router-link>
                  <button @click="openChangePassword" class="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Lock class="w-4 h-4 mr-3" />
                    Change Password
                  </button>
                  <button @click="openSettings" class="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Settings class="w-4 h-4 mr-3" />
                    Settings
                  </button>
                  <div class="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                  <button @click="logout" class="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut class="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-4 lg:p-6">
        <router-view />
      </main>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="sidebarOpen && isMobile"
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
    ></div>
  </div>
</template>

<script>
import { 
  BarChart3, 
  Package, 
  Users, 
  UserCheck, 
  TrendingUp, 
  User, 
  LogOut, 
  Menu, 
  Bell, 
  Sun, 
  Moon,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  Lock,
  Settings,
  Truck,
  AlertCircle,
  CheckCircle
} from 'lucide-vue-next'
import { useNotificationStore } from '../stores/notification'

export default {
  name: 'DashboardLayout',
  components: {
    BarChart3,
    Package,
    Users,
    UserCheck,
    TrendingUp,
    User,
    LogOut,
    Menu,
    Bell,
    Sun,
    Moon,
    X,
    PanelLeftClose,
    PanelLeftOpen,
    ChevronDown,
    Lock,
    Settings,
    Truck,
    AlertCircle,
    CheckCircle
  },
  setup() {
    // Import notification store
    const notificationStore = useNotificationStore()
    return { notificationStore }
  },
  data() {
    return {
      sidebarOpen: true, // Default to expanded
      sidebarCollapsed: false, // New state for collapsed sidebar
      isDarkMode: false,
      showNotifications: false,
      showUserMenu: false,
      isMobile: false
    }
  },
  computed: {
    unreadNotifications() {
      return this.notificationStore.unreadCount
    },
    notifications() {
      return this.notificationStore.notifications
    }
  },
  mounted() {
    // Check screen size
    this.checkScreenSize()
    window.addEventListener('resize', this.checkScreenSize)

    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode !== null) {
      this.isDarkMode = JSON.parse(savedDarkMode)
    } else {
      // Check system preference
      this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    this.applyDarkMode()

    // Check for saved sidebar state - but default to expanded
    const savedSidebarState = localStorage.getItem('sidebarOpen')
    if (savedSidebarState !== null) {
      this.sidebarOpen = JSON.parse(savedSidebarState)
    } else {
      // Default to expanded on both desktop and mobile
      this.sidebarOpen = true
    }

    // Check for saved sidebar collapsed state
    const savedSidebarCollapsed = localStorage.getItem('sidebarCollapsed')
    if (savedSidebarCollapsed !== null) {
      this.sidebarCollapsed = JSON.parse(savedSidebarCollapsed)
    }

    // On mobile, close sidebar by default for better UX
    if (this.isMobile) {
      this.sidebarOpen = false
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
    window.removeEventListener('resize', this.checkScreenSize)
  },
  watch: {
    isDarkMode(newVal) {
      this.applyDarkMode();
    }
  },
  methods: {
    checkScreenSize() {
      this.isMobile = window.innerWidth < 1024
      // On mobile, auto-close sidebar for better UX
      if (this.isMobile && this.sidebarOpen) {
        this.sidebarOpen = false
      }
    },
    getPageTitle() {
      const titles = {
        'Dashboard': 'Dashboard',
        'Deliveries': 'Deliveries',
        'Deliverymen': 'Delivery Personnel',
        'Customers': 'Customers',
        'Analytics': 'Analytics',
        'Profile': 'Profile'
      }
      return titles[this.$route.name] || 'Dashboard'
    },
    getPageDescription() {
      const descriptions = {
        'Dashboard': 'Overview of your delivery operations',
        'Deliveries': 'Track and manage all deliveries',
        'Deliverymen': 'Manage your delivery team',
        'Customers': 'Manage your customer database',
        'Analytics': 'Performance insights and reports',
        'Profile': 'Manage your account settings'
      }
      return descriptions[this.$route.name] || 'Welcome to DeliverFlow'
    },
    toggleSidebar() {
      if (this.isMobile) {
        this.sidebarOpen = !this.sidebarOpen
        localStorage.setItem('sidebarOpen', JSON.stringify(this.sidebarOpen))
      }
    },
    toggleSidebarCollapse() {
      if (!this.isMobile) {
        this.sidebarCollapsed = !this.sidebarCollapsed
        localStorage.setItem('sidebarCollapsed', JSON.stringify(this.sidebarCollapsed))
      }
    },
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode
      localStorage.setItem('darkMode', JSON.stringify(this.isDarkMode))
      // this.applyDarkMode() // No need, watcher will handle
    },
    applyDarkMode() {
      if (this.isDarkMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
      this.showUserMenu = false
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
      this.showNotifications = false
    },
    handleClickOutside(event) {
      // Check if click is outside notification dropdown
      if (this.showNotifications && !event.target.closest('[data-dropdown="notifications"]')) {
        this.showNotifications = false
      }
      // Check if click is outside user menu dropdown
      if (this.showUserMenu && !event.target.closest('[data-dropdown="user"]')) {
        this.showUserMenu = false
      }
    },
    markAsRead(notificationId) {
      this.notificationStore.markAsRead(notificationId)
    },
    markAllAsRead() {
      this.notificationStore.markAllAsRead()
    },
    getNotificationIcon(type) {
      const icons = {
        'delivery': 'Truck',
        'customer': 'User',
        'alert': 'AlertCircle',
        'success': 'CheckCircle'
      }
      return icons[type] || 'Bell'
    },
    formatNotificationTime(time) {
      const now = new Date()
      const diff = now - time
      const minutes = Math.floor(diff / (1000 * 60))
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))

      if (minutes < 1) return 'Just now'
      if (minutes < 60) return `${minutes}m ago`
      if (hours < 24) return `${hours}h ago`
      return `${days}d ago`
    },
    openChangePassword() {
      this.showUserMenu = false
      // Add change password logic here
      alert('Change password functionality would be implemented here')
    },
    openSettings() {
      this.showUserMenu = false
      // Add settings logic here
      alert('Settings functionality would be implemented here')
    },
    logout() {
      this.showUserMenu = false
      // Clear auth data and redirect to login
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      this.$router.push('/login')
    }
  }
}
</script>