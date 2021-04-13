/**
 * Description: 岗位管理
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-sysweb'
// ============================ 岗位管理  start ======================
/**
 * 新增或修改岗位信息
 * stationAddOrUpdate
 */
export function stationAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/station/update', data)
  } else {
    return http.Post(headerUrl + '/station/add', data)
  }
}
/**
 * 查询岗位
 * stationList
 */
export function stationList (data) {
  return http.Get(headerUrl + '/station/list', data)
}
/**
 * 删除岗位
 * stationDelete
 */
export function stationDelete (data) {
  return http.Post(headerUrl + '/station/delete', data)
}
/**
 * 查询岗位信息
 * stationInfo
 */
export function stationInfo (data) {
  return http.Get(headerUrl + '/station/info', data)
}
// ============================ 岗位管理  end =======================
