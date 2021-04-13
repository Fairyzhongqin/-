import http from '@/utils/httpRequest'
let headerUrl = '/spring-processweb'
// ============================ 企业生产全流程  start ======================
/**
 * 分页查询所有事故快报
 * accidentBulletin
 */
export function accidentBulletin (data) {
  return http.Get(headerUrl + '/accident/quickNotification/list', data)
}
/****
 * 查询单个事故快报
 */
export function accidentBulletinInfo (data) {
  return http.Get(headerUrl + '/accident/quickNotification/info', data)
}
/****
 * 新增或修改事故快报
 */
export function accidentBulletinAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/accident/quickNotification/update', data)
  } else {
    return http.Post(headerUrl + '/accident/quickNotification/add', data)
  }
}
/****
 * 删除事故快报
 */
export function accidentBulletinDelete (data) {
  return http.Post(headerUrl + '/accident/quickNotification/delete', data)
}
/****
 * 分页查询所有事故报告
 */
export function accidentReport (data) {
  return http.Get(headerUrl + '/accident/report/list', data)
}
/****
 * 查询单个事故报告
 */
export function accidentReportInfo (data) {
  return http.Get(headerUrl + '/accident/report/info', data)
}
/****
 * 新增或修改事故报告
 */
export function accidentReportAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/accident/report/update', data)
  } else {
    return http.Post(headerUrl + '/accident/report/add', data)
  }
}
/****
 * 删除事故快报
 */
export function accidentReportDelete (data) {
  return http.Post(headerUrl + '/accident/report/delete', data)
}
/****
 * 归档事故快报
 */
export function accidentReportField (data) {
  return http.Post(headerUrl + '/accident/report/filed', data, 'form')
}
