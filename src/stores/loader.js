import { reactive } from 'vue'

export const loaderState = reactive({
  loading: false
})

export function showLoader() {
  loaderState.loading = true
}

export function hideLoader() {
  loaderState.loading = false
}
