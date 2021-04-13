/**
 * Author: crain
 * Date: 2019/8/25
 * Description: 报警查看
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-posweb'
// headerUrl = ''
// ============================ 临时人员管理  start ======================
/**
 * 新增/修改临时人员
 * temporaryPersonAdd
 */
export function temporaryPersonAdd (data) {
  if (data.ghs) {
    return http.Post(headerUrl + '/tempworker/update', data)
  } else {
    return http.Post(headerUrl + '/tempworker/add', data)
  }
}
/**
 * 分页查询临时人员
 * temporaryPersonAdd
 */
export function temporaryPersonList (data) {
  return http.Get(headerUrl + '/tempworker/list', data)
}
/**
 * 删除临时人员
 * checkpointDelete
 */
export function temporaryPersonDelete (data) {
  return http.Post(headerUrl + '/tempworker/delete', data)
}
/**
 * 临时人员详细信息
 * checkpointDelete
 */
export function temporaryPersonGet (data) {
  return http.Get(headerUrl + '/tempworker/get', data)
}
// ============================ 临时人员管理  end =======================
