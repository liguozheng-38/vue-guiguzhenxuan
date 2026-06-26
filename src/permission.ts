//路由鉴权:鉴权,项目当中路由能不能被的权限的设置(某一个路由什么条件下可以访问、什么条件下不可以访问)
import router from '@/router'
import setting from './setting'
//@ts-ignore
import nprogress from 'nprogress'
//引入进度条样式
import 'nprogress/nprogress.css'
import type { RouteLocationNormalized } from 'vue-router'
nprogress.configure({ showSpinner: false })
//获取用户相关的小仓库内部token数据,去判断用户是否登录成功
import useUserStore from './store/modules/user'
import pinia from './store'
const userStore = useUserStore(pinia)
//全局守卫:项目当中任意路由切换都会触发的钩子
//全局前置守卫
router.beforeEach(async (to: RouteLocationNormalized) => {
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
      // 有用户信息且异步路由已加载
      if (username && userStore.asyncRouteLoaded) {
        // 异步路由已加载，若匹配到 anyRoute，说明路径不存在，跳转 404
        if (to.name === 'Any') {
          return { path: '/404', replace: true }
        }
        //放行
        return true
      } else {
        //如果没有用户信息或异步路由未加载,在守卫这里发请求获取到了用户信息再放行
        try {
          await userStore.userInfo()
          // 只传 path，让路由器按路径重新匹配（避免 name: 'Any' 导致再次匹配 anyRoute）
          return { path: to.path, replace: true }
        } catch (_error) {
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
router.afterEach((to: RouteLocationNormalized) => {
  document.title = `${setting.title} - ${to.meta.title}`
  nprogress.done()
})

//第一个问题:任意路由切换实现进度条业务 ---nprogress
//第二个问题:路由鉴权(路由组件访问权限的设置)
//全部路由组件:登录|404|任意路由|首页|数据大屏|权限管理(三个子路由)|商品管理(四个子路由)

//用户未登录:可以访问login,其余六个路由不能访问(指向login)
//用户登录成功:不可以访问login[指向首页],其余的路由可以访问
