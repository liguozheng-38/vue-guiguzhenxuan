//账号信息的ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//代表一个账号信息的ts类型
export interface User {
  id?: number
  ID?: number
  createTime?: string
  updateTime?: string
  username?: string
  password?: string
  name?: string
  phone?: string
  roleName?: string
}

//数组包含全部的用户信息
export type Records = User[]

//获取全部用户信息接口返回的数据ts类型
export interface UserResponseData extends ResponseData {
  data: {
    records: Records
    total: number
    size: number
    current: number
    pages: number
  }
}

//代表一个角色的ts类型
export interface RoleData {
  id?: number
  ID?: number
  createTime?: string
  updateTime?: string
  roleName: string
  remark?: string
}

//全部角色的列表
export type AllRole = RoleData[]

//获取全部角色的接口返回的数据ts类型
export interface AllRoleResponseData extends ResponseData {
  data: {
    assignRoles: AllRole
    allRolesList: AllRole
  }
}

//给用户分配角色接口携带参数的ts类型
export interface SetRoleData {
  roleIdList: number[]
  userId: number
}
