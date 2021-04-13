/**
 * Description:风险研判记录
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-processweb'
// ============================ 风险研判记录  start ======================
/**
 * 新增报告模板
 * statuteAddOrUpdate
 */
export function reportRecordAdd (data) {
  return http.Post(headerUrl + '/reportRecord/add', data)
}
/**
 * 分页查询风险研判记录
 * statuteList
 */
export function reportRecordList (data) {
  return http.Get(headerUrl + '/reportRecord/list', data)
}
/**
 * 获取报告模板内容
 * statuteInfo
 */
export function reportRecordInfo (data) {
  return http.Get(headerUrl + '/reportRecord/info', data)
}
// ============================ 风险研判记录  end =======================
