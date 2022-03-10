import request from '@/utils/request'

var uploadUrl = 'https://up-z2.qiniup.com';
var cdnUrl = 'https://cdn.health.healthplatform.xyz';

export function upFileToken_api(data) {
  return request({
    url: '/api/v2/admin/imgkey',
    method: 'get',
    params: data
  })
}
//获取阿里云参数
export function getPolicy_api(data) {
  return request({
    url: '/api/v2/admin/imgkeyali',
    method: 'get',
    params: data
  })
}
export function changePasswordForAdmin_api(data) {
  return request({
    url: '/api/v2/admin/password',
    method: 'post',
    data
  })
}
export function changePasswordForSeller_api(data) {
  return request({
    url: '/api/v2/seller/password',
    method: 'post',
    data
  })
}

// 获取七牛上传token
async function getUploadToken(data) {
	let res = await request({
				url: '/v4/common/uploadToken',
				method: 'get',
				params: data
			});

	return res;
}

// 获取行政区
function getArea(data) {
  let param = {
				url: '/api/v2/common/area',
				method: 'get',
				params: data
      };

	return request(param);
}

// 获取快递列表
export function getExpressage_api(data){
  return request({
    url:'/v4/admin/express',
    method:'get',
    params: data
  })
}



// export 
export default {

  getUploadToken,
  getArea,
  uploadUrl,
  cdnUrl,
  getExpressage_api
}