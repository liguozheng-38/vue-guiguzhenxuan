import { createApp } from 'vue'
import App from '@/App.vue'
import '@/styles/reset.scss'
import gloalComponent from '@/components/index'
import router from '@/router/index'

const app = createApp(App)
app.use(gloalComponent)
app.use(router)
app.mount('#app')
