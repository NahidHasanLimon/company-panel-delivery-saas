<template>
  <div class="app-shell compact-panel h-screen overflow-hidden bg-slate-100 transition-colors duration-200" style="overscroll-behavior: none; -webkit-overflow-scrolling: touch;">
    <!-- Sidebar -->
    <div 
      class="app-sidebar fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out border-r border-gray-200 flex flex-col"
      :class="[
        isMobile
          ? (sidebarOpen ? 'w-56 translate-x-0' : '-translate-x-full w-56')
          : (sidebarCollapsed ? 'w-14' : 'w-52'),
        'transition-all duration-300'
      ]"
    >
      <!-- Logo Section -->
      <div class="flex items-center justify-between h-12 px-3 border-b border-slate-200/70">
        <div>
          <p v-if="!sidebarCollapsed" class="text-sm font-semibold tracking-tight text-slate-900">DeliverFlow</p>
          <p v-else class="text-sm font-semibold tracking-tight text-slate-900">D</p>
        </div>
        <!-- Mobile Close Button -->
        <button
          @click="sidebarOpen = false"
          class="lg:hidden p-1 rounded-md text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      <!-- Navigation -->
      <nav class="mt-3 px-2 flex-1 overflow-y-auto">
        <div class="space-y-1">
          <SidebarNavLink
            v-for="item in operationsNavItems"
            :key="item.routeName"
            :to="item.to"
            :route-name="item.routeName"
            :label="item.label"
            :icon="item.icon"
            :collapsed="sidebarCollapsed"
          />
        </div>
        <!-- Bottom Section -->
        <div class="mt-5 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div class="space-y-1">
            <SidebarNavLink
              v-for="item in accountNavItems"
              :key="item.routeName"
              :to="item.to"
              :route-name="item.routeName"
              :label="item.label"
              :icon="item.icon"
              :collapsed="sidebarCollapsed"
            />
            <button
              @click="logout"
              class="w-full flex items-center px-3 py-2.5 text-[13px] font-semibold text-slate-800 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-all duration-200"
            >
              <LogOut class="w-4 h-4 text-slate-700 transition-colors" :class="sidebarCollapsed ? '' : 'mr-3'" />
              <span v-if="!sidebarCollapsed">Logout</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
    <!-- Main Content -->
    <div 
      class="h-screen overflow-hidden transition-all duration-300 ease-in-out flex flex-col"
      :class="[
        isMobile
          ? 'lg:pl-0'
          : (sidebarCollapsed ? 'pl-14' : 'pl-52')
      ]"
      style="overscroll-behavior: none;"
    >
      <!-- Header -->
      <header class="app-header flex-shrink-0 sticky top-0 z-30 bg-white border-b border-gray-200 transition-colors duration-200">
        <div class="flex items-center justify-between px-2.5 lg:px-3.5 py-1.5">
          <div class="flex items-center space-x-3">
            <!-- Mobile Sidebar Toggle -->
            <button
              @click="toggleSidebar"
              class="lg:hidden p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
            >
              <Menu class="w-4 h-4" />
            </button>
            <!-- Desktop Sidebar Toggle -->
            <button
              @click="toggleSidebarCollapse"
              class="hidden lg:flex p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
              :title="sidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
            >
              <PanelLeftOpen v-if="sidebarCollapsed" class="w-4 h-4" />
              <PanelLeftClose v-else class="w-4 h-4" />
            </button>
            <h2 class="text-sm font-semibold tracking-tight text-slate-900 dark:text-white">{{ getPageTitle() }}</h2>
          </div>
          
          <div class="flex items-center space-x-1.5">
            <!-- Dark Mode Toggle -->
            <button
              @click="toggleDarkMode"
              class="control-btn p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
              aria-label="Toggle dark mode"
              :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            >
              <Sun v-if="isDarkMode" class="w-4 h-4" />
              <Moon v-else class="w-4 h-4" />
            </button>
            
            <!-- Notifications Dropdown -->
            <div class="relative" data-dropdown="notifications">
              <button 
                @click="toggleNotifications"
                class="control-btn p-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500 relative"
                aria-label="Open notifications"
              >
                <Bell class="w-4 h-4" />
                <span v-if="unreadNotifications > 0" class="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
                  {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
                </span>
              </button>
              <div 
                v-if="showNotifications"
                class="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
                @click.stop
              >
                <div class="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <h3 class="text-sm font-semibold text-slate-900 dark:text-white">Notifications</h3>
                  <button @click="markAllAsRead" class="text-sm text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">Mark all read</button>
                </div>
                <div class="max-h-96 overflow-y-auto">
                  <div v-if="notifications.length === 0" class="p-4 text-center text-sm text-slate-500 dark:text-slate-400">No notifications</div>
                  <div v-else>
                    <div v-for="notification in notifications" :key="notification.id" class="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer" :class="{ 'bg-slate-100 dark:bg-slate-700/40': !notification.read }" @click="markAsRead(notification.id)">
                      <div class="flex items-start space-x-3">
                        <div class="flex-shrink-0">
                          <div class="w-8 h-8 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                            <component :is="getNotificationIcon(notification.type)" class="w-4 h-4 text-slate-700 dark:text-slate-200" />
                          </div>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-slate-900 dark:text-white">{{ notification.title }}</p>
                          <p class="text-xs text-slate-500 dark:text-slate-400">{{ notification.message }}</p>
                          <p class="text-xs text-slate-400 dark:text-slate-500 mt-1">{{ formatNotificationTime(notification.time) }}</p>
                        </div>
                        <div v-if="!notification.read" class="w-2 h-2 bg-slate-700 dark:bg-slate-300 rounded-full"></div>
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
                class="control-btn flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-slate-500"
                aria-label="Open user menu"
              >
                <div class="w-7 h-7 bg-slate-900 dark:bg-slate-200 rounded-full flex items-center justify-center">
                  <User class="w-4 h-4 text-white dark:text-slate-900" />
                </div>
                <div class="hidden md:block text-left">
                  <p class="text-sm font-medium text-slate-900 dark:text-white">Admin User</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">admin@deliverflow.com</p>
                </div>
                <ChevronDown class="w-4 h-4 text-slate-500 dark:text-slate-400" />
              </button>
              <div 
                v-if="showUserMenu"
                class="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50"
                @click.stop
              >
                <div class="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p class="text-sm font-medium text-slate-900 dark:text-white">Admin User</p>
                  <p class="text-xs text-slate-500 dark:text-slate-400">admin@deliverflow.com</p>
                </div>
                <div class="py-2">
                  <router-link to="/profile" @click.native="showUserMenu = false" class="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <User class="w-4 h-4 mr-3" />
                    View Profile
                  </router-link>
                  <button @click="openChangePassword" class="w-full flex items-center px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <Lock class="w-4 h-4 mr-3" />
                    Change Password
                  </button>
                  <button @click="openSettings" class="w-full flex items-center px-4 py-2 text-sm text-slate-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
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
      <main class="flex-1 overflow-y-auto p-2.5 lg:p-3" style="overscroll-behavior: contain; -webkit-overflow-scrolling: touch;">
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
  UserPlus,
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
import SidebarNavLink from '../components/layout/SidebarNavLink.vue'
import { ROUTE_TITLES, OPERATIONS_NAV_ITEMS, ACCOUNT_NAV_ITEMS } from '../constants/layoutNavigation'

const NAV_ICON_COMPONENTS = {
  BarChart3,
  Package,
  Users,
  UserCheck,
  UserPlus,
  TrendingUp,
  User
}

export default {
  name: 'DashboardLayout',
  components: {
    BarChart3,
    Package,
    Users,
    UserCheck,
    UserPlus,
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
    CheckCircle,
    SidebarNavLink
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
    },
    operationsNavItems() {
      return OPERATIONS_NAV_ITEMS.map((item) => ({
        ...item,
        icon: NAV_ICON_COMPONENTS[item.icon]
      }))
    },
    accountNavItems() {
      return ACCOUNT_NAV_ITEMS.map((item) => ({
        ...item,
        icon: NAV_ICON_COMPONENTS[item.icon]
      }))
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
    document.addEventListener('keydown', this.handleEscapeKey)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
    document.removeEventListener('keydown', this.handleEscapeKey)
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
      return ROUTE_TITLES[this.$route.name] || 'Dashboard'
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
    handleEscapeKey(event) {
      if (event.key === 'Escape') {
        this.showNotifications = false
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
      this.$router.push('/profile?tab=security')
    },
    openSettings() {
      this.showUserMenu = false
      this.$router.push('/profile?tab=settings')
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
