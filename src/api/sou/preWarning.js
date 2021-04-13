import http from '@/utils/httpRequest'
let headerUrl = '/spring-souweb'
// ============================ 预警信息 start ======================
/**
 * 分页查询所有预警信息
 * preWarningInfoList
 */
export function preWarningInfoList (data) {
  return http.Get(headerUrl + '/alarmManage/list', data)
}
/**
 * 处理忽略此报警
 */
export function handleOrIngore (data) {
  return http.Post(headerUrl + '/alarmManage/ignore', data, 'form')
}
// ============================ 预警信息 end======================
