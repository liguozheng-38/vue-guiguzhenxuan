import request from '@/utils/request'
import type {
  PermissionResponseData,
  RolePermissionResponseData,
  AddMenuParams,
  UpdateMenuParams,
  ResponseData,
} from './type'

//枚举地址
const API = {
  //获取全部菜单与按钮的标识数据
  ALL_PERMISSION_URL: '/admin/acl/permission',
  //给某一级菜单新增一个子菜单
  ADD_MENU_URL: '/admin/acl/permission/save',
  //更新某一个已有的菜单
  UPDATE_MENU_URL: '/admin/acl/permission/update',
  //删除已有的菜单
  DELETE_MENU_URL: '/admin/acl/permission/remove/',
  //根据角色获取菜单
  ROLE_PERMISSION_URL: '/admin/acl/permission/toAssign/',
  //给角色分配权限
  ASSIGN_PERMISSION_URL: '/admin/acl/permission/doAssign',
}

//获取所有菜单数据
export const reqAllPermission = () =>
  request.get<unknown, PermissionResponseData>(API.ALL_PERMISSION_URL)

//添加菜单
export const reqAddMenu = (data: AddMenuParams) =>
  request.post<unknown, ResponseData>(API.ADD_MENU_URL, data)

//更新菜单
export const reqUpdateMenu = (data: UpdateMenuParams) =>
  request.put<unknown, ResponseData>(API.UPDATE_MENU_URL, data)

//删除菜单
export const reqRemoveMenu = (id: number) =>
  request.delete<unknown, ResponseData>(API.DELETE_MENU_URL + id)

//根据角色获取菜单
export const reqRolePermission = (roleId: number) =>
  request.get<unknown, RolePermissionResponseData>(
    API.ROLE_PERMISSION_URL + roleId,
  )

//给角色分配权限
export const reqAssignPermission = (roleId: number, permissionId: number[]) => {
  return request.post<unknown, ResponseData>(
    `${API.ASSIGN_PERMISSION_URL}?roleId=${roleId}&permissionId=${permissionId}`,
  )
}
