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
//引入Element Plus国际化
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
//引入自定义指令文件
import { isHasButton } from '@/directive/has'

const app = createApp(App)
app.use(gloalComponent)
app.use(router)
app.use(pinia)
//配置Element Plus国际化为中文
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(isHasButton)
app.mount('#app')
