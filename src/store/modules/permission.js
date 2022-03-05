import { asyncRouters, constantRoutes } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.indexOf(route.meta.roles) !== -1;
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouters
 * @param roles
 */
function filterAsyncRouter(asyncRouters, roles) {
  const accessedRouters = asyncRouters.filter((route) => {
    if (hasPermission(roles, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
        if(!route.children.length) return false;
      }
      return true
    }
    return false
  });
  return accessedRouters;
}

const permission = {
  state: {
    constantRoutes: constantRoutes,
    addRouters: [],
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.constantRoutes = constantRoutes.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        let accessedRouters = []
        accessedRouters = filterAsyncRouter(asyncRouters, roles);
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
