import http from '@/utils/httpRequest'
let headerUrl = '/spring-souweb'

/** 统计接口**/
export function staticData (data) {
  return http.Get(headerUrl + '/signboard/count', data)
}
/** 告警看板 */
export function alermPlane (data) {
  return http.Get(headerUrl + '/signboard/alarm', data)
}
/** 重大危险源 */
export function hazards (data) {
  return http.Get(headerUrl + '/signboard/hazards', data)
}
/** 储罐看板 */
export function storageTank (data) {
  return http.Get(headerUrl + '/signboard/storageTank', data)
}
/** 各区域预警率 */
export function earlyWarningRate (data) {
  return http.Get(headerUrl + '/signboard/earlyWarningRate', data)
}
/** 近一周预警 */
export function alarmNearlyWeek (data) {
  return http.Get(headerUrl + '/signboard/alarmNearlyWeek', data)
}
/** 点位分类及告警 */
export function parameter (data) {
  return http.Get(headerUrl + '/signboard/parameter', data)
}
/** 安全承诺报告 */
export function signboardReport (data) {
  return http.Get(headerUrl + '/signboard/report', data)
}
