import { createApp } from 'vue'
import App from '@/App.vue'
import 'element-plus/dist/index.css'
import '@/styles/reset.scss'
import gloalComponent from '@/components/index'
import router from '@/router/index'
import pinia from '@/store/index'
//引入路由鉴权文件
import './permission'

const app = createApp(App)
app.use(gloalComponent)
app.use(router)
app.use(pinia)
app.mount('#app')
