import { login } from '@/api/user'
import { getToken, setToken, removeToken, setPermission } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    avatar: '',
    permissions: [],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_PERMISSION: (state, permissions) => {
    state.permissions = permissions
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ admin_account: username.trim(), admin_password: password }).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.access_token)
        commit('SET_PERMISSION', data.admin_auth)
        setPermission(data.admin_auth)
        setToken(data.access_token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      removeToken() // must remove  token  first
      resetRouter()
      commit('RESET_STATE')
      resolve()
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

