//创建用户相关的小仓库
import { defineStore } from 'pinia'
import { ref, nextTick } from 'vue'
import router from '@/router'
import type { RouteRecordRaw } from 'vue-router'
//引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
import type {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
  ResponseData,
} from '@/api/user/type'
//引入操作本地存储的工具方法
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
//@ts-expect-error lodash 无 TS 声明
import cloneDeep from 'lodash/cloneDeep'
//引入路由(常量路由)
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'

// 深拷贝并过滤路由：cloneDeep 保证嵌套对象不共享引用，再恢复 component 函数
function filterAsyncRoute(
  routes: RouteRecordRaw[],
  allowedNames: string[],
): RouteRecordRaw[] {
  const cloned = cloneDeep(routes) as RouteRecordRaw[]
  return restoreComponents(filterByNames(cloned, allowedNames), routes)
}

// 递归恢复 component 函数引用（cloneDeep 破坏动态 import，从原始路由取回）
function restoreComponents(
  filtered: RouteRecordRaw[],
  originals: RouteRecordRaw[],
): RouteRecordRaw[] {
  const restored = filtered.map((item) => {
    const original = originals.find((o) => o.name === item.name)
    const component = original?.component ?? item.component
    return {
      ...item,
      component: component ?? undefined,
      children: item.children
        ? restoreComponents(item.children, original?.children || [])
        : undefined,
    } as RouteRecordRaw
  })
  return restored
}

// 从深拷贝中按名称过滤，子路由匹配时自动保留父路由
function filterByNames(
  routes: RouteRecordRaw[],
  allowedNames: string[],
): RouteRecordRaw[] {
  const filtered = routes
    .map((item) => {
      const filteredChildren = item.children
        ? filterByNames(item.children, allowedNames)
        : undefined
      const hasMatchingChild = filteredChildren && filteredChildren.length > 0
      const selfMatch = allowedNames.includes(item.name as string)
      // 自身匹配或任意子路由匹配，则保留
      if (selfMatch || hasMatchingChild) {
        return {
          ...item,
          children: filteredChildren,
        } as RouteRecordRaw
      }
      return null
    })
    .filter((item): item is RouteRecordRaw => item !== null)
  return filtered
}

// Repository
const api = {
  login: async (data: loginFormData) => await reqLogin(data),
  getUserInfo: async () => await reqUserInfo(),
  logout: async () => await reqLogout(),
  filterAsyncRoute: (routes: string[]) => filterAsyncRoute(asyncRoute, routes),
  getUserRoutes: (routes: string[]) => {
    const userAsyncRoute = api.filterAsyncRoute(routes)
    return [...constantRoute, ...userAsyncRoute, anyRoute]
  },
}

//创建用户小仓库 - 组合式API
const useUserStore = defineStore('User', () => {
  const token = ref<string>(GET_TOKEN())
  const menuRoutes = ref<RouteRecordRaw[]>([...constantRoute])
  const username = ref<string>('')
  const avatar = ref<string>('')
  const buttons = ref<string[]>([])
  const asyncRouteLoaded = ref<boolean>(false)

  //用户登录
  const userLogin = async (data: loginFormData) => {
    const loginData: loginResponseData = await api.login(data)
    if (loginData.code == 200) {
      token.value = loginData.data
      SET_TOKEN(loginData.data)
      return 'ok'
    } else {
      return Promise.reject(new Error(loginData.message))
    }
  }

  //获取用户信息
  const userInfo = async () => {
    const result: userInfoReponseData = await api.getUserInfo()
    if (result.code == 200) {
      username.value = result.data.roles[0]
      avatar.value = result.data.avatar
      buttons.value = result.data.buttons

      const userAsyncRoute = api.filterAsyncRoute(result.data.routes)
      // console.log('[userInfo] routes:', result.data.routes, 'buttons:', result.data.buttons)
      menuRoutes.value = api.getUserRoutes(result.data.routes)
      // console.log('[userInfo] menuRoutes after:', menuRoutes.value.map((r: RouteRecordRaw) => r.name))

      // 动态追加异步路由 + 兜底路由
      ;[...userAsyncRoute, anyRoute].forEach((route) => {
        router.addRoute(route)
      })
      await nextTick()
      asyncRouteLoaded.value = true
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  }

  //退出登录
  const userLogout = async () => {
    const result: ResponseData = await api.logout()
    if (result.code == 200) {
      token.value = ''
      username.value = ''
      avatar.value = ''
      buttons.value = []
      asyncRouteLoaded.value = false
      menuRoutes.value = [...constantRoute]

      // 移除动态添加的路由
      asyncRoute.forEach((route) => {
        if (router.hasRoute(route.name as string)) {
          router.removeRoute(route.name as string)
        }
        if (route.children) {
          route.children.forEach((child) => {
            if (router.hasRoute(child.name as string)) {
              router.removeRoute(child.name as string)
            }
          })
        }
      })
      if (router.hasRoute(anyRoute.name as string)) {
        router.removeRoute(anyRoute.name as string)
      }

      REMOVE_TOKEN()
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  }

  return {
    token,
    menuRoutes,
    username,
    avatar,
    buttons,
    asyncRouteLoaded,
    userLogin,
    userInfo,
    userLogout,
  }
})

export default useUserStore
