/**
 * Author: crain
 * Date: 2019/9/8
 * Description:
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-posweb'
// headerUrl = ''
// ============================ 车辆管理  start ======================
/**
 * 分页查询所有车辆
 * vehicleList
 */
export function vehicleList (data) {
  return http.Get(headerUrl + '/vehicle/list', data)
}
/**
 * 新增车辆
 * vehicleAdd
 */
export function vehicleAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/vehicle/update', data)
  } else {
    return http.Post(headerUrl + '/vehicle/add', data)
  }
}
/**
 * 查询单个车辆
 * vehicleInfo
 */
export function vehicleInfo (data) {
  return http.Get(headerUrl + '/vehicle/info', data)
}
/**
 * 删除车辆
 * vehicleDelete
 */
export function vehicleDelete (data) {
  return http.Post(headerUrl + '/vehicle/delete', data)
}
// ============================ 车辆管理  end =======================
