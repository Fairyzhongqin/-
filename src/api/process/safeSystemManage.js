/**
 * Description:安全制度管理
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-processweb'
// ============================ 操作规程  start ======================
/**
 * 分页查询所有的操作规程
 * operateList
 */
export function operateList (data) {
  return http.Get(headerUrl + '/procedures/list', data)
}
/**
 * 获取单个操作规程
 * operateList
 */
export function operateInfo (data) {
  return http.Get(headerUrl + '/procedures/info', data)
}
/**
 * 新增操作规程
 * operateList
 */
export function operateAdd (data) {
  if (data.id) {
    return http.Post(headerUrl + '/procedures/update', data)
  } else {
    return http.Post(headerUrl + '/procedures/add', data)
  }
}
/**
 * 提交操作规程
 * operateList
 */
export function operateSub (data) {
  return http.Post(headerUrl + '/procedures/submit', data)
}
/**
 * 提交操作规程
 * operateList
 */
export function operateVerify (data) {
  return http.Post(headerUrl + '/procedures/audit', data)
}
/**
 * 修改 delete
 */
export function operateListDelete (data) {
  return http.Post(headerUrl + '/procedures/delete', data)
}
// ============================ 操作规程  end ======================
// ============================ 检查项  start ======================
/**
 * 分页查询所有检查项
 * getCheckItemList
 */
export function getCheckItemList (data) {
  return http.Get(headerUrl + '/checkItems/list', data)
}
/** 获取单个检查项信息
 * checkItemsInfo
 */
export function checkItemsInfo (data) {
  return http.Get(headerUrl + '/checkItems/info', data)
}
/**
 * 新增修改检查项
 * checkItemsAddOrUpdate
 */
export function checkItemsAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/checkItems/update', data)
  } else {
    return http.Post(headerUrl + '/checkItems/add', data)
  }
}
/**
 * 删除检查项
 * checkItemsDelete
 */
export function checkItemsDelete (data) {
  return http.Post(headerUrl + '/checkItems/delete', data)
}
// ============================ 检查项  end ======================
// ============================ 检查表 start ======================
/**
 * 分页查询所有检查表
 * getcheckTableList
 */
export function getcheckTableList (data) {
  return http.Get(headerUrl + '/checkTable/list', data)
}
/** 获取单个检查表信息
 * checkTableInfo
 */
export function checkTableInfo (data) {
  return http.Get(headerUrl + '/checkTable/info', data)
}
/**
 * 新增修改检查表
 * checkTableAddOrUpdate
 */
export function checkTableAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/checkTable/update', data)
  } else {
    return http.Post(headerUrl + '/checkTable/add', data)
  }
}
/**
 * 删除检查表
 * checkTableDelete
 */
export function checkTableDelete (data) {
  return http.Post(headerUrl + '/checkTable/delete', data)
}
// ============================ 检查表  end ======================
