//角色管理模块的接口
import request from '@/utils/request'
import type { RoleResponseData, RoleData, MenuResponseData } from './type'

const API = {
  //获取角色分页列表
  ROLE_LIST_URL: '/admin/acl/role/',
  //新增角色接口
  ADD_ROLE_URL: '/admin/acl/role/save',
  //更新角色接口
  UPDATE_ROLE_URL: '/admin/acl/role/update',
  //获取全部菜单与按钮数据(用于权限分配)
  ALL_PERMISSION_URL: '/admin/acl/permission/toAssign/',
  //给角色分配权限
  SET_PERMISSION_URL: '/admin/acl/permission/doAssign',
  //删除角色接口
  REMOVE_ROLE_URL: '/admin/acl/role/remove/',
}

//获取角色分页列表
export const reqRoleList = (page: number, limit: number, roleName?: string) => {
  const params = roleName ? `?roleName=${roleName}` : ''
  return request.get<any, RoleResponseData>(API.ROLE_LIST_URL + `${page}/${limit}` + params)
}

//添加角色与更新已有角色接口
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_ROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADD_ROLE_URL, data)
  }
}

//获取全部菜单与按钮权限数据
export const reqAllMenuList = (roleId: number) => request.get<any, MenuResponseData>(API.ALL_PERMISSION_URL + roleId)

//给角色分配权限
export const reqSetPermission = (roleId: number, permissionId: number[]) => {
  const params = new URLSearchParams()
  params.append('roleId', String(roleId))
  permissionId.forEach((id) => params.append('permissionId', String(id)))
  return request.post(`${API.SET_PERMISSION_URL}?${params.toString()}`)
}

//删除角色
export const reqRemoveRole = (roleId: number) => request.delete<any, any>(API.REMOVE_ROLE_URL + roleId)
