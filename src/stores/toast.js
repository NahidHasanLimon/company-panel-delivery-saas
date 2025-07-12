import { defineStore } from 'pinia'

export const useToastStore = defineStore('toast', {
  state: () => ({
    toasts: []
  }),

  actions: {
    show(message, type = 'info', duration = 4000) {
      const id = Date.now() + Math.random()
      const toast = {
        id,
        message,
        type, // 'success', 'error', 'warning', 'info'
        duration,
        show: true
      }

      this.toasts.push(toast)

      // Auto remove after duration
      if (duration > 0) {
        setTimeout(() => {
          this.remove(id)
        }, duration)
      }

      return id
    },

    success(message, duration = 4000) {
      return this.show(message, 'success', duration)
    },

    error(message, duration = 6000) {
      return this.show(message, 'error', duration)
    },

    warning(message, duration = 5000) {
      return this.show(message, 'warning', duration)
    },

    info(message, duration = 4000) {
      return this.show(message, 'info', duration)
    },

    notification(title, body, duration = 6000) {
      const message = title && body ? `${title}: ${body}` : title || body
      return this.show(message, 'info', duration)
    },

    remove(id) {
      const index = this.toasts.findIndex(toast => toast.id === id)
      if (index > -1) {
        this.toasts.splice(index, 1)
      }
    },

    clear() {
      this.toasts = []
    }
  }
})
