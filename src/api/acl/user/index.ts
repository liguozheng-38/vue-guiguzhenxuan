//用户管理模块的接口
import request from '@/utils/request'
import type { UserResponseData, User, AllRoleResponseData, SetRoleData, ResponseData } from './type'

//枚举地址
const API = {
  //获取全部已有用户账号信息
  ALLUSER_URL: '/admin/acl/user/',
  //添加一个新的用户账号
  ADDUSER_URL: '/admin/acl/user/save',
  //更新已有的用户账号
  UPDATEUSER_URL: '/admin/acl/user/update',
  //获取全部角色,当前账号拥有的角色接口
  ALLROLEURL: '/admin/acl/user/toAssign/',
  //给已有的用户分配角色接口
  SETROLE_URL: '/admin/acl/user/doAssignRole',
  //删除某一个账号
  DELETEUSER_URL: '/admin/acl/user/remove/',
  //批量删除的接口
  DELETEALLUSER_URL: '/admin/acl/user/batchRemove',
}

//获取用户账号信息的接口
export const reqUserInfo = (page: number, limit: number, username?: string) => {
  const params = username ? { username } : {}
  return request.get<any, UserResponseData>(`${API.ALLUSER_URL}${page}/${limit}`, { params })
}

//添加用户与更新已有用户的接口
export const reqAddOrUpdateUser = (data: User) => {
  if (data.id || data.ID) {
    return request.put<any, ResponseData>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, ResponseData>(API.ADDUSER_URL, data)
  }
}

//获取全部角色以及包含当前用户的已有的角色
export const reqAllRole = (userId: number) => request.get<any, AllRoleResponseData>(API.ALLROLEURL + userId)

//分配角色
export const reqSetUserRole = (data: SetRoleData) => request.post<any, ResponseData>(API.SETROLE_URL, data)

//删除某一个账号的信息
export const reqRemoveUser = (userId: number) => request.delete<any, ResponseData>(API.DELETEUSER_URL + userId)

//批量删除的接口
export const reqSelectUser = (idList: number[]) => request.delete<any, ResponseData>(API.DELETEALLUSER_URL, { data: idList })
