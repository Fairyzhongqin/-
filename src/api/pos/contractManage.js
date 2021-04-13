import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-posweb'
// ============================ 承包商列表  start ======================
/**
 * 分页查询所有承包商
 * contractList
 */
export function contractList (data) {
  return http.Get(headerUrl + '/contractor/findLCardList', data)
}
/**
 * 删除承包商
 * contractDelete
 */
export function contractDelete (data) {
  return http.Post(headerUrl + '/contractor/delete', data)
}
/**
 * 查询单个承包商信息
 * contractInfo
 */
export function contractInfo (data) {
  return http.Get(headerUrl + '/contractor/getLCardDetail', data)
}
/**
 * 分页查询统计承包商详细信息
 */
export function contractStatic (data) {
  return http.Get(headerUrl + '/contractor/getDetailList', data)
}
/**
 * 新增/修改 人员列表
 * cAddOrUpdate
 */
export function cAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/contractor/update', data)
  } else {
    return http.Post(headerUrl + '/contractor/add', data)
  }
}
