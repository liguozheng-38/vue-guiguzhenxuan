import { createApp } from 'vue'
import App from '@/App.vue'
import 'element-plus/dist/index.css'
import '@/styles/reset.scss'
import gloalComponent from '@/components/index'
import router from '@/router/index'
import pinia from '@/store/index'
//引入路由鉴权文件
import './permission'
//暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'

//引入自定义指令文件
import { isHasButton } from '@/directive/has'

const app = createApp(App)
app.use(gloalComponent)
app.use(router)
app.use(pinia)

app.use(isHasButton)
app.mount('#app')
