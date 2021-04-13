/**
 * Author: crain
 * Date: 2019/8/25
 * Description: 报警查看
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-posweb'
// headerUrl = ''
// ============================ 卡口管理  start ======================
/**
 * 新增卡口
 * checkpointAdd
 */
export function checkpointAdd (data) {
  if (data.id) {
    return http.Post(headerUrl + '/checkpoint/update', data)
  } else {
    return http.Post(headerUrl + '/checkpoint/add', data)
  }
}
/**
 * 分页查询所有的卡口列表
 * checkpointList
 */
export function checkpointList (data) {
  return http.Get(headerUrl + '/checkpoint/list', data)
}
/**
 * 修改卡口
 * checkpointUpload
 */
export function checkpointUpload (data) {
  return http.Post(headerUrl + '/checkpoint/update', data)
}
/**
 * 删除卡口
 * checkpointDelete
 */
export function checkpointDelete (data) {
  return http.Post(headerUrl + '/checkpoint/delete', data)
}
/**
 * 卡口信息
 * checkpointInfo
 */
export function checkpointInfo (data) {
  return http.Get(headerUrl + '/checkpoint/info', data)
}
// ============================ 卡口管理  end =======================
// ============================ 胸卡管理  start ======================
/**
 * 胸卡详细信息
 * IcardIssueInfo
 */
export function IcardIssueInfo (data) {
  return http.Get(headerUrl + '/deveui/info', data)
}
/**
 * 胸卡绑定临时人员/临时车辆
 * IcardIssueInfo
 */
export function IcardIssueSendcard (data) {
  return http.Post(headerUrl + '/sendrevcard/sendcard', data)
}
// ============================ 胸卡管理  end =======================
// ============================ 进出记录  start ======================
/**
 * 查询所有的卡口列表
 * getAllSelectList
 */
export function getAllSelectList (data) {
  return http.Get(headerUrl + '/checkpoint/getAllSect', data)
}
/**
 * 分页查询所有的卡口列表
 * entryRecordList
 */
export function entryRecordList (data) {
  return http.Get(headerUrl + '/turnover/list', data)
}
// ============================ 进出记录  end =======================
