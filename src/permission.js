import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken, getPermission } from '@/utils/auth'
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login']

router.beforeEach(async(to, from, next) => {
  NProgress.start()

  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      if (store.getters.addRouters.length) {
        next()
      } else {
        try {
          let roles = JSON.parse(getPermission() || store.getters.permissions)
          roles.push('vipsign','shareholdersign','authority')
          console.log('roles',roles)
          store.dispatch('GenerateRoutes', { roles }).then(() => { // 生成可访问的路由表
            router.addRoutes(store.getters.routerList) // 动态添加可访问路由表
            console.log('store.getters.routers',store.getters.addRouters)
            console.log('store.getters.routerList',store.getters.routerList)
            console.log('router',router)
            next({ ...to, replace: true })
          })
          // next()

        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
