import http from '@/utils/httpRequest'
let headerUrl = '/spring-posweb'
// ======================= 危险区域管理start ==========================
/**
 * 根据条件查询区域数据
 * safeEquipment
 */
export function regionSet (data) {
  return http.Get(headerUrl + '/zone/queryZoneInfo', data)
}
/**
 * 设置区域信息
 * setRegionInfo
 */
export function setRegionInfo (data) {
  return http.Post(headerUrl + '/zone/updateInfo', data)
}
