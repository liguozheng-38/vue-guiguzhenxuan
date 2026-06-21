//数据类型定义
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//菜单数据与按钮数据的ts类型
export interface Permission {
  ID?: number
  id?: number
  createTime?: string
  updateTime?: string
  pid: number
  name: string
  code: string
  toCode: string
  type: number
  status: string
  level: number
  children?: PermissionList
  select: boolean
}

export type PermissionList = Permission[]

//菜单接口返回的数据类型（获取所有菜单）
export interface PermissionResponseData extends ResponseData {
  data: Permission
}

//根据角色获取菜单接口返回的数据类型
export interface RolePermissionResponseData extends ResponseData {
  data: PermissionList
}

//添加菜单携带的参数的ts类型
export interface AddMenuParams {
  code: string //权限值
  level: number //几级菜单
  name: string //菜单的名字
  pid: number //父菜单的ID
  type: number //类型
}

//更新菜单携带的参数的ts类型
export interface UpdateMenuParams {
  id: number //菜单ID
  code: string //权限值
  level: number //几级菜单
  name: string //菜单的名字
  pid: number //父菜单的ID
}
