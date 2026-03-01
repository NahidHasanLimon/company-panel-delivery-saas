<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Items</h2>
        <p class="text-xs text-gray-500 dark:text-gray-400">Manage company items</p>
      </div>
      <button
        class="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black"
        @click="openCreateModal"
      >
        Add Item
      </button>
    </div>

    <div class="bg-white dark:bg-gray-800 rounded-lg card-shadow p-3">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
        <div class="lg:col-span-3">
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Search by name or code"
            class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            @input="handleSearchInput"
          >
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select
            v-model="filters.active"
            class="w-full px-2 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            @change="handleStatusChange"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex items-center justify-center py-10 bg-white dark:bg-gray-800 rounded-xl card-shadow">
      <div class="h-6 w-6 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
      <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Loading items...</span>
    </div>

    <template v-else>
      <div v-if="items.length" class="bg-white dark:bg-gray-800 rounded-xl card-shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Code</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unit</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Notes</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Created</th>
                <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="item in items" :key="item.id" class="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{{ item.name }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.code || 'N/A' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 dark:text-white">{{ item.unit || 'N/A' }}</td>
                <td class="px-4 py-3 text-sm text-gray-900 dark:text-white max-w-[260px] truncate">{{ item.notes || 'N/A' }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <span
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                    :class="item.is_active ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'"
                  >
                    {{ item.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{{ formatDate(item.created_at) }}</td>
                <td class="px-4 py-3 whitespace-nowrap">
                  <div class="flex items-center gap-1">
                    <button
                      class="inline-flex h-7 w-7 items-center justify-center rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
                      title="View"
                      aria-label="View item"
                      @click="openViewModal(item)"
                    >
                      <Eye class="h-3.5 w-3.5" />
                    </button>
                    <button
                      class="inline-flex h-7 w-7 items-center justify-center rounded border border-slate-300 text-slate-700 hover:bg-slate-50"
                      title="Edit"
                      aria-label="Edit item"
                      @click="openEditModal(item)"
                    >
                      <Pencil class="h-3.5 w-3.5" />
                    </button>
                    <button
                      class="inline-flex h-7 w-7 items-center justify-center rounded border border-indigo-300 text-indigo-700 hover:bg-indigo-50 disabled:opacity-50"
                      :disabled="togglingId === item.id"
                      :title="item.is_active ? 'Deactivate' : 'Activate'"
                      :aria-label="item.is_active ? 'Deactivate item' : 'Activate item'"
                      @click="openToggleConfirm(item)"
                    >
                      <Loader2 v-if="togglingId === item.id" class="h-3.5 w-3.5 animate-spin" />
                      <X v-else-if="item.is_active" class="h-3.5 w-3.5" />
                      <Check v-else class="h-3.5 w-3.5" />
                    </button>
                    <button
                      class="inline-flex h-7 w-7 items-center justify-center rounded border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-50"
                      :disabled="deletingId === item.id"
                      title="Delete"
                      aria-label="Delete item"
                      @click="openDeleteConfirm(item)"
                    >
                      <Trash2 class="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="showEmptyState" class="text-center py-10 bg-white dark:bg-gray-800 rounded-xl card-shadow">
        <p class="text-sm font-medium text-gray-800 dark:text-gray-200">No items yet</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Create your first item to get started.</p>
        <button
          class="mt-3 rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black"
          @click="openCreateModal"
        >
          Add First Item
        </button>
      </div>

      <div v-else-if="showNoMatches" class="text-center py-10 bg-white dark:bg-gray-800 rounded-xl card-shadow">
        <p class="text-sm text-gray-600 dark:text-gray-400">No items found for current filters.</p>
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
      v-if="showFormModal"
      class="fixed inset-0 z-50 bg-slate-900/25 backdrop-blur-[1px] flex items-center justify-center p-4"
      @click.self="closeFormModal"
    >
      <div class="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-xl">
        <div class="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <div>
            <h3 class="text-sm font-semibold text-slate-900">{{ formTitle }}</h3>
            <p class="text-xs text-slate-500 mt-0.5">Manage item details</p>
          </div>
          <button class="rounded-md p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-800" @click="closeFormModal">✕</button>
        </div>

        <div class="p-4 space-y-3">
          <p
            v-if="formServerError"
            class="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700"
          >
            {{ formServerError }}
          </p>

          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Name <span class="text-red-600">*</span></label>
            <input
              v-model="form.name"
              type="text"
              class="w-full rounded-md border border-slate-300 px-3 py-2 text-xs"
              :disabled="isViewMode"
            >
            <p v-if="formErrors.name" class="mt-1 text-[11px] text-red-600">{{ formErrors.name }}</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Code</label>
              <input
                v-model="form.code"
                type="text"
                class="w-full rounded-md border border-slate-300 px-3 py-2 text-xs"
                :disabled="isViewMode"
              >
              <p v-if="formErrors.code" class="mt-1 text-[11px] text-red-600">{{ formErrors.code }}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-slate-700 mb-1">Unit</label>
              <input
                v-model="form.unit"
                type="text"
                class="w-full rounded-md border border-slate-300 px-3 py-2 text-xs"
                :disabled="isViewMode"
              >
              <p v-if="formErrors.unit" class="mt-1 text-[11px] text-red-600">{{ formErrors.unit }}</p>
            </div>
          </div>

          <div>
            <label class="block text-xs font-medium text-slate-700 mb-1">Notes</label>
            <textarea
              v-model="form.notes"
              rows="3"
              class="w-full rounded-md border border-slate-300 px-3 py-2 text-xs"
              :disabled="isViewMode"
            ></textarea>
            <p v-if="formErrors.notes" class="mt-1 text-[11px] text-red-600">{{ formErrors.notes }}</p>
          </div>

          <div class="flex items-center gap-2">
            <input
              id="item-active"
              v-model="form.is_active"
              type="checkbox"
              class="h-3.5 w-3.5 rounded border-slate-300"
              :disabled="isViewMode"
            >
            <label for="item-active" class="text-xs text-slate-700">Active</label>
          </div>
        </div>

        <div class="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-3">
          <button class="rounded-md border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100" @click="closeFormModal">
            {{ isViewMode ? 'Close' : 'Cancel' }}
          </button>
          <button
            v-if="!isViewMode"
            class="rounded-md bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-black disabled:opacity-60"
            :disabled="submitting"
            @click="submitForm"
          >
            {{ submitting ? 'Saving...' : (formMode === 'create' ? 'Create Item' : 'Update Item') }}
          </button>
        </div>
      </div>
    </div>

    <ConfirmDialog
      v-model="showDeleteConfirm"
      title="Delete Item"
      description="This action cannot be undone."
      :message="'Are you sure you want to delete ' + (pendingDeleteItem?.name || 'this item') + '?'"
      confirm-text="Delete"
      cancel-text="Cancel"
      loading-text="Deleting..."
      :loading="deletingId !== null"
      variant="danger"
      @confirm="confirmDelete"
      @cancel="pendingDeleteItem = null"
    />

    <ConfirmDialog
      v-model="showToggleConfirm"
      :title="pendingToggleItem?.is_active ? 'Deactivate Item' : 'Activate Item'"
      :description="pendingToggleItem?.is_active ? 'This will make the item inactive.' : 'This will make the item active.'"
      :message="'Are you sure you want to ' + (pendingToggleItem?.is_active ? 'deactivate ' : 'activate ') + (pendingToggleItem?.name || 'this item') + '?'"
      :confirm-text="pendingToggleItem?.is_active ? 'Deactivate' : 'Activate'"
      cancel-text="Cancel"
      loading-text="Updating..."
      :loading="togglingId !== null"
      variant="neutral"
      @confirm="confirmToggleStatus"
      @cancel="pendingToggleItem = null"
    />
  </div>
</template>

<script>
import { Eye, Pencil, Trash2, Check, X, Loader2 } from 'lucide-vue-next'
import Pagination from '../components/Pagination.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
import { useToastStore } from '../stores/toast'
import { listItems, getItem, createItem, updateItem, deleteItem } from '../api/items'

export default {
  name: 'Items',
  components: {
    Eye,
    Pencil,
    Trash2,
    Check,
    X,
    Loader2,
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
      items: [],
      pagination: {
        current_page: 1,
        per_page: 15,
        total: 0,
        last_page: 1
      },
      filters: {
        search: '',
        active: 'all'
      },
      currentPage: 1,
      searchDebounceTimer: null,
      syncingRoute: false,

      showFormModal: false,
      formMode: 'create',
      selectedItemId: null,
      submitting: false,
      form: {
        name: '',
        code: '',
        unit: '',
        notes: '',
        is_active: true
      },
      formErrors: {},
      formServerError: '',

      showDeleteConfirm: false,
      pendingDeleteItem: null,
      showToggleConfirm: false,
      pendingToggleItem: null,
      deletingId: null,
      togglingId: null
    }
  },
  computed: {
    isViewMode() {
      return this.formMode === 'view'
    },
    formTitle() {
      if (this.formMode === 'create') return 'Add Item'
      if (this.formMode === 'edit') return 'Edit Item'
      return 'View Item'
    },
    showEmptyState() {
      return !this.loading && this.items.length === 0 && this.pagination.total === 0 && !this.filters.search && this.filters.active === 'all'
    },
    showNoMatches() {
      return !this.loading && this.items.length === 0 && !this.showEmptyState
    }
  },
  watch: {
    '$route.query': {
      async handler(newQuery) {
        if (this.syncingRoute) return
        this.applyQueryToState(newQuery)
        await this.fetchItems()
      }
    }
  },
  async mounted() {
    this.applyQueryToState(this.$route.query)
    await this.fetchItems()
  },
  beforeUnmount() {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer)
    }
  },
  methods: {
    formatDate(value) {
      if (!value) return '-'
      const date = new Date(value)
      if (Number.isNaN(date.getTime())) return value
      return date.toLocaleDateString()
    },
    applyQueryToState(query) {
      this.filters.search = typeof query.search === 'string' ? query.search : ''

      if (query.active === 'true') {
        this.filters.active = 'active'
      } else if (query.active === 'false') {
        this.filters.active = 'inactive'
      } else {
        this.filters.active = 'all'
      }

      const page = Number(query.page)
      this.currentPage = Number.isInteger(page) && page > 0 ? page : 1
    },
    buildQueryFromState() {
      const query = {}
      if (this.filters.search?.trim()) query.search = this.filters.search.trim()
      if (this.filters.active === 'active') query.active = 'true'
      if (this.filters.active === 'inactive') query.active = 'false'
      if (this.currentPage > 1) query.page = String(this.currentPage)
      return query
    },
    async syncRouteQuery() {
      const nextQuery = this.buildQueryFromState()
      const currentQuery = {
        ...(this.$route.query.search ? { search: this.$route.query.search } : {}),
        ...(this.$route.query.active ? { active: this.$route.query.active } : {}),
        ...(this.$route.query.page ? { page: this.$route.query.page } : {})
      }

      if (JSON.stringify(nextQuery) === JSON.stringify(currentQuery)) {
        return
      }

      this.syncingRoute = true
      await this.$router.replace({ query: nextQuery })
      this.syncingRoute = false
    },
    buildListParams() {
      const params = { page: this.currentPage }
      if (this.filters.search?.trim()) params.search = this.filters.search.trim()
      if (this.filters.active === 'active') params.active = true
      if (this.filters.active === 'inactive') params.active = false
      return params
    },
    async fetchItems() {
      try {
        this.loading = true
        const response = await listItems(this.buildListParams())
        const data = response?.data || {}
        this.items = data.data || []
        this.pagination = {
          current_page: data.current_page || this.currentPage,
          per_page: data.per_page || 15,
          total: data.total || 0,
          last_page: data.last_page || 1
        }

        if (this.currentPage > this.pagination.last_page && this.pagination.last_page > 0) {
          this.currentPage = this.pagination.last_page
          await this.syncRouteQuery()
          await this.fetchItems()
        }
      } catch (error) {
        this.handleApiError(error, 'Failed to load items')
      } finally {
        this.loading = false
      }
    },
    async refreshList() {
      await this.syncRouteQuery()
      await this.fetchItems()
    },
    handleSearchInput() {
      if (this.searchDebounceTimer) {
        clearTimeout(this.searchDebounceTimer)
      }
      this.searchDebounceTimer = setTimeout(async () => {
        this.currentPage = 1
        await this.refreshList()
      }, 400)
    },
    async handleStatusChange() {
      this.currentPage = 1
      await this.refreshList()
    },
    async handlePageChange(page) {
      if (page < 1 || page > this.pagination.last_page) return
      this.currentPage = page
      await this.refreshList()
    },
    resetForm() {
      this.form = {
        name: '',
        code: '',
        unit: '',
        notes: '',
        is_active: true
      }
      this.formErrors = {}
      this.formServerError = ''
      this.selectedItemId = null
    },
    mapItemToForm(item) {
      this.form = {
        name: item?.name || '',
        code: item?.code || '',
        unit: item?.unit || '',
        notes: item?.notes || '',
        is_active: Boolean(item?.is_active)
      }
    },
    buildItemPayload(base) {
      const payload = {
        name: (base.name || '').trim(),
        code: (base.code || '').trim(),
        unit: (base.unit || '').trim(),
        notes: (base.notes || '').trim(),
        is_active: Boolean(base.is_active)
      }
      if (!payload.code) delete payload.code
      if (!payload.unit) delete payload.unit
      if (!payload.notes) delete payload.notes
      return payload
    },
    openCreateModal() {
      this.formMode = 'create'
      this.resetForm()
      this.showFormModal = true
    },
    async openViewModal(item) {
      this.formMode = 'view'
      this.resetForm()
      this.showFormModal = true
      await this.loadItem(item.id)
    },
    async openEditModal(item) {
      this.formMode = 'edit'
      this.resetForm()
      this.showFormModal = true
      await this.loadItem(item.id)
    },
    closeFormModal() {
      if (this.submitting) return
      this.showFormModal = false
      this.resetForm()
    },
    async loadItem(id) {
      try {
        const response = await getItem(id)
        const item = response?.data || null
        if (!item) {
          this.toastStore.error('Item not found')
          await this.fetchItems()
          this.closeFormModal()
          return
        }
        this.selectedItemId = item.id
        this.mapItemToForm(item)
      } catch (error) {
        this.handleApiError(error, 'Failed to load item details')
        this.closeFormModal()
      }
    },
    applyValidationPayload(payload) {
      this.formErrors = {}
      this.formServerError = ''

      const errors = payload?.errors || {}
      Object.keys(errors).forEach((field) => {
        this.formErrors[field] = Array.isArray(errors[field]) ? errors[field][0] : errors[field]
      })

      const message = payload?.message || ''
      const normalized = message.toLowerCase()

      if (!Object.keys(this.formErrors).length && message) {
        if (normalized.includes('name has already been taken')) {
          this.formErrors.name = 'The name has already been taken.'
        }
        if (normalized.includes('code has already been taken')) {
          this.formErrors.code = 'The code has already been taken.'
        }
      }

      if (!Object.keys(this.formErrors).length && message) {
        this.formServerError = message
      }
    },
    async submitForm() {
      const payload = this.buildItemPayload(this.form)
      this.formErrors = {}
      this.formServerError = ''

      if (!payload.name) {
        this.formErrors.name = 'Name is required.'
        return
      }

      try {
        this.submitting = true
        let response
        if (this.formMode === 'create') {
          response = await createItem(payload)
        } else {
          response = await updateItem(this.selectedItemId, payload)
        }

        if (response?.success === false) {
          this.applyValidationPayload(response)
          if (!this.formServerError && !Object.keys(this.formErrors).length) {
            this.formServerError = response?.message || 'Failed to save item'
          }
          return
        }

        this.toastStore.success(response?.message || 'Item saved successfully')
        this.closeFormModal()
        await this.fetchItems()
      } catch (error) {
        if (error?.response?.status === 422) {
          this.applyValidationPayload(error?.response?.data || {})
          return
        }
        this.handleApiError(error, 'Failed to save item')
      } finally {
        this.submitting = false
      }
    },
    openDeleteConfirm(item) {
      this.pendingDeleteItem = item
      this.showDeleteConfirm = true
    },
    async confirmDelete() {
      const item = this.pendingDeleteItem
      if (!item?.id) return

      try {
        this.deletingId = item.id
        const response = await deleteItem(item.id)
        this.toastStore.success(response?.message || 'Item deleted successfully')
        this.showDeleteConfirm = false
        this.pendingDeleteItem = null

        if (this.items.length === 1 && this.currentPage > 1) {
          this.currentPage -= 1
        }
        await this.refreshList()
      } catch (error) {
        const message = error?.response?.data?.message || 'Failed to delete item'
        if (error?.response?.status === 422 && message.toLowerCase().includes('used in deliveries')) {
          this.toastStore.warning(`${message} Please deactivate it instead.`)
        } else {
          this.handleApiError(error, message)
        }
      } finally {
        this.deletingId = null
      }
    },
    openToggleConfirm(item) {
      this.pendingToggleItem = item
      this.showToggleConfirm = true
    },
    async confirmToggleStatus() {
      const item = this.pendingToggleItem
      if (!item?.id) return

      try {
        this.togglingId = item.id
        const payload = this.buildItemPayload({
          ...item,
          is_active: !item.is_active
        })

        const response = await updateItem(item.id, payload)
        this.toastStore.success(response?.message || 'Item status updated')
        this.showToggleConfirm = false
        this.pendingToggleItem = null
        await this.fetchItems()
      } catch (error) {
        this.handleApiError(error, 'Failed to update status')
      } finally {
        this.togglingId = null
      }
    },
    handleApiError(error, fallbackMessage) {
      const status = error?.response?.status
      const message = error?.response?.data?.message || fallbackMessage

      if (status === 403) {
        this.toastStore.error('Not authorized')
        return
      }
      if (status === 404) {
        this.toastStore.error('Item not found')
        this.fetchItems()
        return
      }
      if (status === 500) {
        this.toastStore.error('Something went wrong. Please try again.')
        return
      }

      this.toastStore.error(message)
    }
  }
}
</script>
