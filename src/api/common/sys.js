/**
 * Author: crain
 * Date: 2019/8/31
 * Description:
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-sysweb'
// headerUrl = ''

// ============================ 字典管理  start ======================
/**
 * 字典管理 - 修改排序值
 * updateSort
 * @param id 、sort
 */
export function updateSort (data) {
  return http.Post(headerUrl + '/sys/dict/updateSort', data, 'form')
}

// ============================ 字典管理  start ======================

/**
 * 获取码值
 * getLabels
 * type：活动类型
 */
export function getLabels (data) {
  return http.Get(headerUrl + '/sys/dict/getLabels', data)
}

/**
 * 新增标签管理 - 列表信息
 * mngList
 */
export function mngList (data) {
  return http.Get(headerUrl + '/ssz/label/mng', data)
}

/**
 * 新增标签管理 - 修改标签状态
 * newChangeStatus
 * @param id 、type
 */
export function newChangeStatus (data) {
  return http.Post(headerUrl + '/ssz/label/changeStatus', data, 'form')
}

/**
 * 新增标签管理 - 弹出框回显
 * mngList
 */
export function getById (data) {
  return http.Get(headerUrl + '/ssz/label/getById', data)
}
