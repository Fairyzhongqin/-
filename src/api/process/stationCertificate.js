/**
 * Description:岗位证书管理
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-processweb'
// ============================ 岗位证书  start ======================
/**
 * 新增或修改岗位证书
 * stationCertAddOrUpdate
 */
export function stationCertAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/stationCertificate/update', data)
  } else {
    return http.Post(headerUrl + '/stationCertificate/add', data)
  }
}
/**
 * 分页查询所有证书
 * stationCertList
 */
export function stationCertList (data) {
  return http.Get(headerUrl + '/stationCertificate/list', data)
}
/**
 * 证书-删除
 * stationCertDelete
 */
export function stationCertDelete (data) {
  return http.Post(headerUrl + '/stationCertificate/delete', data)
}
/**
 * 获取单个证书
 * stationCertInfo
 */
export function stationCertInfo (data) {
  return http.Get(headerUrl + '/stationCertificate/info', data)
}
// ============================ 岗位证书  end =======================
