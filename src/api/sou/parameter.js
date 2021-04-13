import http from '@/utils/httpRequest'
let headerUrl = '/spring-souweb'
// =======================储罐配置信息 start ==========================
/**
 * 根据装置/储罐查询所有的参数
 * @param data
 * parameterList
 */
export function parameterList (data) {
  return http.Get(headerUrl + '/parameter/show', data)
}

/**
 * 根据仪表code查询最新监测数据
 * @param data
 * findNewestDate
 */
export function findNewestDate (data) {
  return http.Get(headerUrl + '/DCSData/findNewestDate', data)
}

/**
 * 根据仪表code查询历史监测数据
 * @param data
 * historyData
 */
export function historyData (data) {
  return http.Get(headerUrl + '/DCSData/list', data)
}

/**
 * 批量新增参数数据
 * @param data
 * addBatch
 */
export function parameterAddBatch (data) {
  return http.Post(headerUrl + '/parameter/addBatch', data)
}
/**
 * 某个储罐/生产装置的所有仪表数据
 * @param data
 * meterShow
 */
export function meterShow (data) {
  return http.Get(headerUrl + '/meter/show', data)
}
