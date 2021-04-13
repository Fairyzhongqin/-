/**
 * Author: crain
 * Date: 2019/11/22
 * Description: 部门管理
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-sysweb'
// ============================ 部门管理  start ======================
/**
 * 新增部门
 * departAddOrUpdate
 */
export function departAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/sys/dept/update', data)
  } else {
    return http.Post(headerUrl + '/sys/dept/add', data)
  }
}
/**
 * 查询部门树
 * departList
 */
export function departList (data) {
  return http.Get(headerUrl + '/sys/dept/tree', data)
}
/**
 * 删除部门
 * departDelete
 */
export function departDelete (data) {
  return http.Post(headerUrl + '/sys/dept/delete', data)
}
/**
 * 查询部门信息
 * departInfo
 */
export function departInfo (data) {
  return http.Get(headerUrl + '/sys/dept/info', data)
}
/**
 * 分页查询所有人员
 * employeeList
 */
export function employeeList (data) {
  return http.Get(headerUrl + '/employee/list', data)
}
/**
 * 配置部门员工
 * updateDeptEmployee
 */
export function updateDeptEmployee (data) {
  return http.Post(headerUrl + '/sys/dept/updateDeptEmployee', data)
}
/**
 * 删除此部门下该员工
 * deleteDeptEmployee
 */
export function deleteDeptEmployee (data) {
  return http.Post(headerUrl + '/sys/dept/deleteDeptEmployee', data, 'form')
}
/**
 * 查询某个部门人员
 * getByDeptList
 */
export function getByDeptList (data) {
  return http.Get(headerUrl + '/employee/getByDept', data)
}
// ============================ 部门管理  end =======================
