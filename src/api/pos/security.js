/**
 * Author: crain
 * Date: 2019/8/25
 * Description:
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-posweb'
// headerUrl = ''
// ============================ 报警设置  start ======================
/**
 * 分页查询所有的报警设置
 * alermSettingList
 */
export function alermSettingList (data) {
  return http.Get(headerUrl + '/alermSetting/list', data)
}
/**
 * 新增/修改 报警设置
 * alermSettingAddOrUpdate
 */
export function alermSettingAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/alermSetting/update', data)
  } else {
    return http.Post(headerUrl + '/alermSetting/add', data)
  }
}
/**
 * 单个报警设置信息，编辑时回显
 * alermSettingInfo
 */
export function alermSettingInfo (data) {
  return http.Get(headerUrl + '/alermSetting/info', data)
}
/**
 * 删除电子围栏
 * alermSettingDelete
 */
export function alermSettingDelete (data) {
  return http.Post(headerUrl + '/alermSetting/delete', data)
}
/**
 * 分页查询所有作业列表
 * privateList
 */
export function privateList (data) {
  return http.Get(headerUrl + '/operation/list', data)
}
/**
 * 新增/修改作业
 * privateAdd
 */
export function privateAdd (data) {
  if (data.id) {
    return http.Post(headerUrl + '/operation/update', data)
  } else {
    return http.Post(headerUrl + '/operation/add', data)
  }
}
/**
 * 删除作业
 * privateDelete
 */
export function privateDelete (data) {
  return http.Post(headerUrl + '/operation/delete', data)
}
/**
 * 查询单个作业数据
 * privateInfo
 */
export function privateInfo (data) {
  return http.Get(headerUrl + '/operation/info', data)
}
/**
 * 分页查询所有的作业记录
 * privateInfo
 */
export function privateStatic (data) {
  return http.Get(headerUrl + '/operation/getRecordList', data)
}
// ============================ 报警设置  end =======================
