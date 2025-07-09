import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'
import { useNotificationStore } from './stores/notification'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize notifications after the app is mounted
app.mount('#app')

// Initialize notification service
const notificationStore = useNotificationStore()
notificationStore.initialize().catch(console.error)