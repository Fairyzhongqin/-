/*
 * @Descripttion:
 * @version:
 * @Author: Mr.What
 * @Date: 2019-11-01 09:57:29
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-11-13 16:45:05
 */
/**
 * Author: crain
 * Date: 2019/8/29
 * Description:
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-posweb'
// headerUrl = ''

// ============================ 围栏设置  start ======================
/**
 * 查询所有电子电子围栏
 * fencingSelect
 */
export function fencingSelect (data) {
  return http.Get(headerUrl + '/fencing/select', data)
}
/**
 * 查询永久电子电子围栏
 * fencingSelect
 */
export function selectPerpetual (data) {
  return http.Get(headerUrl + '/fencing/selectPerpetual', data)
}
/**
 * 电子围栏分页查询
 * fencingList
 */
export function fencingList (data) {
  return http.Get(headerUrl + '/fencing/list', data)
}
/**
 * 单个围栏数据
 * fencingInfo
 */
export function fencingInfo (data) {
  return http.Get(headerUrl + '/fencing/info', data)
}
/**
 * 新增/修改 电子围栏
 * fencingAddOrUpdate
 */
export function fencingAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/fencing/update', data)
  } else {
    return http.Post(headerUrl + '/fencing/add', data)
  }
}
/**
 * 删除电子围栏
 * fencingDelete
 */
export function fencingDelete (data) {
  return http.Post(headerUrl + '/fencing/delete', data)
}
// ============================ 围栏设置  end ======================
// ============================ 区域设置  start ======================
/**
 * 根据code查询单条区域信息
 * queryZoneInfo
 */
export function queryZoneByCode (data) {
  return http.Get(headerUrl + '/zone/queryByCode', data)
}
/**
 * 查询全部区域（树形结构）
 * queryZoneInfo
 */
export function queryZoneInfo (data) {
  return http.Get(headerUrl + '/zone/queryZoneInfo', data)
}
/**
 * 查询全部区域（根据buildId）
 * getByBuildId
 */
export function getByBuildId (data) {
  return http.Get(headerUrl + '/zone/getByBuildId', data)
}
/**
 * 查询单个区域（树形结构）
 * queryZoneInfo
 */
export function ZoneInfo (data) {
  return http.Get(headerUrl + '/zone/info', data)
}
/**
 * 删除区域
 * zoneDelById
 */
export function zoneDelById (data) {
  return http.Post(headerUrl + '/zone/delById', data, 'form')
}
// ============================ 区域设置  end ======================
/**
 * 查询风险分区
 * queryZoneInfo
 */
export function queryRiskZone (data) {
  return http.Get(headerUrl + '/zone/queryRiskZone', data)
}
// ============================ 区域热度  start ======================
/**
 * 查询区域进入人次列表
 * getZonePersonList
 */
export function getZonePersonList (data) {
  return http.Get(headerUrl + '/zonecount/getZonePersonList', data)
}
/**
 * 查询区域统计详情
 * getZoneCountDetail
 */
export function getZoneCountDetail (data) {
  return http.Get(headerUrl + '/zonecount/getZonePersonDetail', data)
}
// ============================ 区域热度  end ========================
// ============================ 区域查询  start ======================
/**
 * 根据区级别查询列表
 * getZoneByLevelList
 */
export function getZoneByLevelList (data) {
  return http.Get(headerUrl + '/zone/findListByEntity', data)
}
/**
 * 根据区级别查询列表
 * findAllZoneMap
 */
export function findAllZoneMap (data) {
  return http.Get(headerUrl + '/zone/findAllZoneMap', data)
}
// ============================ 区域查询  end ========================
