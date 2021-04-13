/**
 * Author: crain
 * Date: 2019/8/25
 * Description: 报警查看
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-posweb'
// headerUrl = ''
// ============================ 报警查看  start ======================
/**
 * 分页查询所有的区域报警记录
 * zoneAlermRecordList
 */
export function zoneAlermRecordList (data) {
  return http.Get(headerUrl + '/zoneAlermRecord/list', data)
}
/**
 * 忽略
 * ignore
 */
export function ignore (data) {
  return http.Post(headerUrl + '/zoneAlermRecord/ignore', data)
}
/**
 * 处理
 * handleAlerm
 */
export function handleAlerm (data) {
  return http.Post(headerUrl + '/zoneAlermRecord/handleAlerm', data)
}
// ============================ 报警设置  end =======================
