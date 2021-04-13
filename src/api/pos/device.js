/**
 * Author: crain
 * Date: 2019/8/25
 * Description:
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-posweb'
// headerUrl = ''
// ============================ 胸卡管理  start ======================
/**
 * 查询已有的上报地址
 * deveuiList
 */
export function deveuiList (data) {
  return http.Get(headerUrl + '/deveui/list', data)
}
/**
 * 删除胸卡设备
 * deveuiDeleteDev
 */
export function deveuiDeleteDev (data) {
  return http.Post(headerUrl + '/deveui/deleteDev', data)
}
/**
 * 新增胸卡设备
 * deveuiAddDev
 */
export function deveuiAddDev (data) {
  return http.Post(headerUrl + '/deveui/addDev', data)
}
/**
 * 删除胸卡设备
 * deleteDev
 */
export function deleteDev (data) {
  return http.Post(headerUrl + '/deveui/deleteDev', data)
}
/**
 * 胸卡绑定人员
 * deveuiBangding
 */
export function deveuiBangding (data) {
  return http.Post(headerUrl + '/deveui/bangding', data)
}
/**
 * 胸卡解绑
 * deveuiBangding
 */
export function deveuiJiebang (data) {
  return http.Post(headerUrl + '/deveui/jiebang', data, 'form')
}
/**
 * 胸卡解绑
 * deveuiBangding
 */
export function deveuiSendcard (data) {
  return http.Post(headerUrl + '/sendrevcard/receiveCard', data)
}
// ============================ 胸卡管理  end ======================

// ============================ 蓝牙标签  start ======================
/**
 * 分页查询所有的信标设备
 * beaconList
 */
export function beaconList (data) {
  return http.Get(headerUrl + '/beacon/list', data)
}
/**
 * 删除信标设备
 * beaconDeleteDev
 */
export function beaconDeleteDev (data) {
  return http.Post(headerUrl + '/beacon/deleteDev', data)
}
/**
 * 新增信标设备
 * beaconAddDev
 */
export function beaconAddDev (data) {
  return http.Post(headerUrl + '/beacon/addDev', data)
}
// ============================ 蓝牙标签  end =======================

// ============================ 基站管理 start ======================
/**
 * 分页查询所有的基站设备
 * List
 */
export function baseStationList (data) {
  return http.Get(headerUrl + '/basestation/list', data)
}
/**
 * 新增设备基站
 * addDev
 */
export function addBaseStation (data) {
  return http.Post(headerUrl + '/basestation/addDev', data)
}
/**
 * 删除基站设备
 * deleteDev
 */
export function deleteBaseStation (data) {
  return http.Post(headerUrl + '/basestation/deleteDev', data)
}
// ============================ 基站管理  end ===================
