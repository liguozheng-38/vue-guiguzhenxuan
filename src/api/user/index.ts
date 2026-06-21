// src/api/user/index.ts
import request from '@/utils/request'
import type {
  loginFormData,
  loginResponseData,
  userInfoReponseData,
} from './type'

const API = {
  LOGIN_URL: '/admin/acl/index/login',
  USERINFO_URL: '/admin/acl/index/info',
  LOGOUT_URL: '/admin/acl/index/logout',
} as const

// 登录接口
export const reqLogin = (data: loginFormData) =>
  request.post<loginResponseData, loginResponseData>(API.LOGIN_URL, data)

// 获取用户信息
export const reqUserInfo = () =>
  request.get<userInfoReponseData, userInfoReponseData>(API.USERINFO_URL)

// 退出登录
import type { ResponseData } from './type'

export const reqLogout = (): Promise<ResponseData> =>
  request.post(API.LOGOUT_URL) as unknown as Promise<ResponseData>
