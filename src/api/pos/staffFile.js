/**
 * Description: 人员档案
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-sysweb'
// headerUrl = ''
// ============================ 员工档案 start ======================
/**
 * 分页查询员工
 * temporaryPersonAdd
 */
export function staffFileList (data) {
  return http.Get(headerUrl + '/employee/list', data)
}
/**
 * 修改员工信息
 * temporaryPersonAdd
 */
export function saveStaffInfo (data) {
  return http.Post(headerUrl + '/employee/save', data)
}

/**
 * 完善员工信息
 * perfectStaffInfo
 */
export function perfectStaffInfo (data) {
  return http.Post(headerUrl + '/employee/perfectInfo', data)
}
/**
 * 查单个员工的详细信息
 * temporaryPersonAdd
 */
export function staffFileInfo (data) {
  return http.Get(headerUrl + '/employee/info', data)
}
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
