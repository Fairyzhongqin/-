import http from '@/utils/httpRequest'
let headerUrl = '/spring-souweb'
// =======================安全设备设施 start ==========================
/**
 * 分页查询所有的安全设备类型
 * safeEquipment
 */
export function safeEquipment (data) {
  return http.Get(headerUrl + '/safetyequipmenttype/list', data)
}

/**
 * 查询所有的安全设备类型
 * typeOfEquipment
 */
export function typeOfEquipment (data) {
  return http.Get(headerUrl + '/safetyequipmenttype/queryAll', data)
}
/**
 * 单个安全设备类型
 * safeTYpeInfo
 */
export function safeTYpeInfo (data) {
  return http.Get(headerUrl + '/safetyequipmenttype/info', data)
}
/**
 * 新增或修改安全类型
 * safeTypeAdd
 */
export function safeTypeAdd (data) {
  if (data.id) {
    return http.Post(headerUrl + '/safetyequipmenttype/update', data)
  } else {
    return http.Post(headerUrl + '/safetyequipmenttype/add', data)
  }
}
/**
 * 删除安全类型
 * safeTypedel
 */
export function safeTypedel (data) {
  return http.Post(headerUrl + '/safetyequipmenttype/delete', data)
}
/**
 * 分页查询所有的安全设备
 * allSafeEqu
 */
export function allSafeEqu (data) {
  return http.Get(headerUrl + '/safetyequipment/list', data)
}
/**
 * 单个安全设备类型
 * listSafeInfo
 */
export function listSafeInfo (data) {
  return http.Get(headerUrl + '/safetyequipment/info', data)
}
/**
 * 新增或修改安全设备
 * safeTypeAdd
 */
export function safeEquAdd (data) {
  if (data.id) {
    return http.Post(headerUrl + '/safetyequipment/update', data)
  } else {
    return http.Post(headerUrl + '/safetyequipment/add', data)
  }
}
/**
 * 删除安全设备
 * safeEqudel
 */
export function safeEqudel (data) {
  return http.Post(headerUrl + '/safetyequipment/delete', data)
}
