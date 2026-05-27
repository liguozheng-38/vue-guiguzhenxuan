//路由鉴权:鉴权,项目当中路由能不能被的权限的设置(某一个路由什么条件下可以访问、什么条件下不可以访问)
import router from '@/router'
import setting from './setting'
//@ts-ignore
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
nprogress.configure({ showSpinner: false })
//获取用户相关的小仓库内部token数据,去判断用户是否登录成功
import useUserStore from './store/modules/user'
import pinia from './store'
const userStore = useUserStore(pinia)
//全局守卫:项目当中任意路由切换都会触发的钩子
//全局前置守卫
router.beforeEach(async (to: any) => {
  // document.title = `${setting.title} - ${to.meta.title}`
  //to:你将要访问那个路由
  //from:你从来个路由而来
  nprogress.start()
  // 获取token,去判断用户是否登录
  const token = userStore.token
  //获取用户名字
  const username = userStore.username

  //用户登录判断
  if (token) {
    //登录成功,访问login,不能访问,指向首页
    if (to.path == '/login') {
      return { path: '/' }
    } else {
      // 登录成功访问其余路由(登录排除)
      // 有用户信息且异步路由已加载
      if (username && userStore.asyncRouteLoaded) {
        //放行
        return true
      } else {
        //如果没有用户信息或异步路由未加载,在守卫这里发请求获取到了用户信息再放行
        try {
          //获取用户信息(会自动加载异步路由)
          await userStore.userInfo()
          //路由已添加完成,使用nextTick确保路由完全注册后再放行
          await new Promise((resolve) => setTimeout(resolve, 0))
          //放行
          return { ...to, replace: true }
        } catch (error) {
          // token过期:获取不到用户信息了
          // 用户手动修改本地存储token
          // 退出登录->用户相关的数据清空
          await userStore.userLogout()
          return { path: '/login', query: { redirect: to.path } }
        }
      }
    }
  } else {
    //用户未登录判断
    if (to.path == '/login') {
      return true
    } else {
      return { path: '/login', query: { redirect: to.path } }
    }
  }
})

//全局后置守卫
router.afterEach((to: any) => {
  document.title = `${setting.title} - ${to.meta.title}`
  nprogress.done()
})

//第一个问题:任意路由切换实现进度条业务 ---nprogress
//第二个问题:路由鉴权(路由组件访问权限的设置)
//全部路由组件:登录|404|任意路由|首页|数据大屏|权限管理(三个子路由)|商品管理(四个子路由)

//用户未登录:可以访问login,其余六个路由不能访问(指向login)
//用户登录成功:不可以访问login[指向首页],其余的路由可以访问
