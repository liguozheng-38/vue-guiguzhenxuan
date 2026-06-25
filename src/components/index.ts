import { type App, type Component } from 'vue'
//引入项目中全部的全局组件
import Category from './Category/index.vue'
import BaseDialog from './BaseDialog/index.vue'
import BaseDrawer from './BaseDrawer/index.vue'
import Pageinator from './Pageinator/index.vue'
import SearchForm from './SearchForm/index.vue'
//引入element-plus提供全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
//全局对象
const allGloablComponent: Record<string, Component> = {
  Category,
  BaseDialog,
  BaseDrawer,
  Pageinator,
  SearchForm,
}
//对外暴露插件对象
export default {
  //务必叫做install方法
  install(app: App<Element>) {
    //注册项目全部的全局组件
    Object.keys(allGloablComponent).forEach((key) => {
      //注册为全局组件
      app.component(key, allGloablComponent[key])
    })
    //将element-plus提供图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
