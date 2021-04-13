import http from '@/utils/httpRequest'
let headerUrl = '/spring-riskweb'
// ============================ 风险因素采集管理  start ======================
/**
 * 分页查询所有的风险复评预警
 * reviewList
 */
export function reviewList (data) {
  return http.Get(headerUrl + '/reappraisal/list', data)
}
/**
 * 分页查询所有的风险复评预警
 * reviewList
 */
export function changeList (data) {
  return http.Get(headerUrl + '/riskchange/list', data)
}
