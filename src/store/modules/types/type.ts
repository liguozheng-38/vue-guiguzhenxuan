import type { RouteRecordRaw } from 'vue-router'
//定义分类对象类型
export interface CategoryObj {
  id: number | string
  name: string
}
//定义小仓库数据state类型
export interface UserState {
  token: string | null
  menuRoutes: RouteRecordRaw[]
  username: string
  avatar: string
  buttons: string[]
  asyncRouteLoaded: boolean
}

//定义分类仓库state对象的ts类型
export interface CategoryState {
  c1Id: null | number | string
  c1Arr: CategoryObj[]
  c2Arr: CategoryObj[]
  c2Id: null | number | string
  c3Arr: CategoryObj[]
  c3Id: null | number | string
  spuId: null | number | string
}
