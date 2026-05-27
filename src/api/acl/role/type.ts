//服务器全部接口返回的数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//角色数据类型
export interface RoleData {
  ID?: number
  id?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark?: string
}

//全部角色的数组的ts类型
export type Records = RoleData[]

//全部角色数据的响应的ts类型
export interface RoleResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
    searchCount: boolean
  }
}

//菜单与按钮数据的ts类型
export interface MenuData {
  id: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: string
  toCode: string
  type: number
  status: null | number
  level: number
  children?: MenuList
  select: boolean
}
export type MenuList = MenuData[]

//菜单权限与按钮权限数据的ts类型
export interface MenuResponseData extends ResponseData {
  data: MenuList
}