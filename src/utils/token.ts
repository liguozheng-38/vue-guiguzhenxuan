//封装本地存储存储数据与读取数据方法
//存储数据
export const SET_TOKEN = (token: string) => {
  localStorage.setItem('TOKEN', token)
}
//本地存储获取数据
export const GET_TOKEN = () => {
  // return localStorage.getItem('TOKEN')
  return localStorage.getItem('TOKEN') || ''
}
//本地存储删除数据方法
export const REMOVE_TOKEN = () => {
  localStorage.removeItem('TOKEN')
}

//  主题颜色本地存储
export const SET_THEME_COLOR = (color: string) => {
  localStorage.setItem('THEME_COLOR', color)
}
export const GET_THEME_COLOR = () => {
  return localStorage.getItem('THEME_COLOR') || '#409EFF'
}
