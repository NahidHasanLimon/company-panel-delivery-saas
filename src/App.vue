<template>
  <div>
    <Loader v-if="loaderState.loading" />
    <router-view />
    <ToastContainer />
  </div>
</template>

<script>
import Loader from './components/Loader.vue'
import ToastContainer from './components/ToastContainer.vue'
import { loaderState } from './stores/loader'

export default {
  name: 'App',
  components: { Loader, ToastContainer },
  setup() {
    return { loaderState }
  }
}
</script>