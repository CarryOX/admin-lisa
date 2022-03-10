import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/v4/admin/login',
    method: 'post',
    data
  })
}

// 权限管理
export function getAuthList_api(data) {
  return request({
    url: "/v4/admin/admin",
    method: "get",
    params: data
  });
}

export function deleteAuth_api(data) {
  return request({
    url: "/v4/admin/admin/" + data.admin_id,
    method: "delete"
    //data: data
  });
}

export function addAuth_api(data) {
  return request({
    url: "/v4/admin/admin",
    method: "post",
    data: data
  });
}

export function editAuth_api(data, id) {
  return request({
    url: `/v4/admin/admin/${id}`,
    method: "put",
    data: data
  });
}
