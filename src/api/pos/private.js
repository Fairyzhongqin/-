/**
 * Author: crain
 * Date: 2019/8/25
 * Description:
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-posweb'
// headerUrl = ''

// ============================ 人员列表  start ======================
/**
 * 分页查询所有的常规作业活动
 * rList
 */
export function rList (data) {
  return http.Get(headerUrl + '/routineoperation/list', data)
}
/**
 * 单个常规作业活动
 * rInfo
 */
export function rInfo (data) {
  return http.Get(headerUrl + '/routineoperation/info', data)
}
/**
 * 新增/修改常规作业活动
 * rAddOrUpdata
 */
export function rAddOrUpdata (data) {
  if (data.id) {
    return http.Post(headerUrl + '/routineoperation/update', data)
  } else {
    return http.Post(headerUrl + '/routineoperation/add', data)
  }
}
/**
 * 删除常规作业活动
 * rDelete
 */
export function rDelete (data) {
  return http.Post(headerUrl + '/routineoperation/delete', data)
}
