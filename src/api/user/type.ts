//定义用户相关数据的ts类型
//用户登录接口携带参数的ts类型
export interface loginFormData {
  username: string
  password: string
}

//定义全部接口返回数据都拥有ts类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//定义登录接口返回数据类型
export interface loginResponseData extends ResponseData {
  // data: string
  data: {
    token: string
  }
}

// 1. 先定义 checkUser 内部的结构（和你接口完全对应）
interface CheckUserInfo {
  userId: number
  avatar: string
  desc: string
  password: string
  roles: string[]
  routes: string[] // 纯字符串数组，只存路由名
  token: string
  username: string
}

//定义获取用户信息返回数据类型
export interface userInfoReponseData extends ResponseData {
  data: {
    checkUser: CheckUserInfo // 所有用户信息都在这个对象里
    buttons: string[]
  }
}
