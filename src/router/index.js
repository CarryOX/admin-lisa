import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  // 去往模板官网的链接
  // {
  //   path: 'external-link',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'https://panjiachen.github.io/vue-element-admin-site/#/',
  //       meta: { title: 'External Link', icon: 'link' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export const asyncRouters = [
  // {
  //   path: '/page',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'pageA',
  //       name: 'pageA',
  //       component: () => import('@/views/pageA/index'),
  //       meta: { title: 'pageA', icon: 'link' }
  //     }
  //   ]
  // },

  {
    path: "/vipsign", 
    component: Layout,
    redirect: "/vipsign/infoCheck",
    meta: { title: "会员报名", icon: 'el-icon-s-grid', roles: "vipsign", desc: '会员报名'},
    children: [
      {
        path: "vipList", 
        component: () => import("@/views/vipsign/vipList/index.vue"),
        name: "vipList",
        meta: { roles: 'vipList', title: "会员列表", noCache: true, icon: 'el-icon-s-promotion', desc: '会员列表' }
      },
      {
        path: "payCheck", 
        component: () => import("@/views/vipsign/payCheck/index.vue"),
        name: "payCheck",
        meta: { roles: 'payCheck', title: "支付审核", noCache: true, icon: 'el-icon-s-promotion', desc: '支付审核' }
      },
      {
        path: "infoCheck", 
        component: () => import("@/views/vipsign/infoCheck/index.vue"),
        name: "infoCheck",
        meta: { roles: 'infoCheck', title: "信息审核", noCache: true, icon: 'el-icon-s-promotion', desc: '信息审核' }
      },
      {
        path: "confirm", 
        component: () => import("@/views/vipsign/confirm/index.vue"),
        name: "confirm",
        meta: { roles: 'confirm', title: "信息确认", noCache: true, icon: 'el-icon-s-promotion', desc: '信息确认' }
      },
      {
        path: "drawbackCheck", 
        component: () => import("@/views/vipsign/drawbackCheck/index.vue"),
        name: "drawbackCheck",
        meta: { roles: 'drawbackCheck', title: "退款审核", noCache: true, icon: 'el-icon-s-promotion', desc: '退款审核' }
      },
      {
        path: "baseSetting", 
        component: () => import("@/views/vipsign/baseSetting/index.vue"),
        name: "baseSetting",
        meta: { roles: 'baseSetting', title: "基础设置", noCache: true, icon: 'el-icon-s-promotion', desc: '基础设置' }
      },
    ]
  },

  {
    path: "/authority", //权限管理
    component: Layout,
    redirect: "/authority/index.vue",
    meta: { roles: "authorityManagement", desc: '权限', },
    children: [
      {
        path: "index",
        component: () => import("@/views/authority/index.vue"),
        name: "authorityManagement",
        meta: { roles: 'auth_list', title: "权限列表", icon: "dashboard", noCache: true, desc: '权限列表', }
      }
    ]
  },

  // { path: '*', redirect: '/404', hidden: true }
]

export let routeList = JSON.parse(JSON.stringify(asyncRouters));

export default router
