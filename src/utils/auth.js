import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'
const RolesKey = 'union-Admin-Roles'
const PermissionKey = 'union-permission'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getRoles() {
  return Cookies.get(RolesKey)
}

export function setRoles(Roles) {
  return Cookies.set(RolesKey, Roles)
}

export function setPermission(permission) {
  return Cookies.set(PermissionKey, permission)
}

export function getPermission() {
  return Cookies.get(PermissionKey)
}
