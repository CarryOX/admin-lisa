import request from "@/utils/request";

export function getSet(data) {
  return request({
    url: "/v4/common/config",
    method: "post",
    data
  });
}

export function editSet(data) {
  return request({
    url: "/v4/admin/config",
    method: "post",
    data
  });
}

//退款审核列表
export function refundCheck(data) {
  return request({
    url: "/v4/admin/refund",
    method: "get",
    params: data
  });
}

//确认退款
export function refund(id) {
  return request({
    url: `/v4/admin/refund/${id}`,
    method: "put",
  });
}

//信息列表
export function payCheck(data) {
  return request({
    url: "/v4/admin/audit",
    method: "get",
    params: data
  });
}

//修改信息审核
export function editPayCheck(data, id) {
  return request({
    url: `/v4/admin/audit/${id}`,
    method: "put",
    data
  });
}

//会员列表
export function getViplist(data) {
  return request({
    url: "/v4/admin/user",
    method: "get",
    params: data
  });
}

//修改用户信息
export function editUserInfo(data, id) {
  return request({
    url: `/v4/admin/user/${id}`,
    method: "put",
    data
  });
}

//获取用户详情信息
export function getVip(id) {
  return request({
    url: `/v4/admin/user/${id}`,
    method: "GET",
  });
}

//会员发货
export function vipputgoods(data, id) {
  return request({
    url: `/v4/admin/express/${id}`,
    method: "put",
    data
  });
}

//支付审核列表
export function getPayCheckList(data) {
  return request({
    url: "/v4/admin/payment",
    method: "get",
    params: data
  });
}

//修改支付审核
export function changePayCheck(data, id) {
  return request({
    url: `/v4/admin/payment/${id}`,
    method: "put",
    data
  });
}

//信息审核列表
export function getInfoCheckList(data) {
  return request({
    url: "/v4/admin/info",
    method: "get",
    params: data
  });
}

//支付审核
export function editInfoCheck(data, id) {
  return request({
    url: `/v4/admin/info/${id}`,
    method: "put",
    data
  });
}

export function editInfoCheckBtn(data) {
  return request({
    url: `/v4/admin/info`,
    method: "post",
    data
  });
}

//删除会员
export function delete_vip(id) {
  return request({
    url: `/v4/admin/user/${id}`,
    method: "delete"
  });
}