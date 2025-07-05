<template>
  <div>
    <Loader v-if="loaderState.loading" />
    <router-view />
  </div>
</template>

<script>
import Loader from './components/Loader.vue'
import { loaderState } from './stores/loader'

export default {
  name: 'App',
  components: { Loader },
  setup() {
    return { loaderState }
  }
}
</script>