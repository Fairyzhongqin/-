/**
 * Author: crain
 * Date: 2019/11/7
 * Description:
 */
import http from '@/utils/httpRequest'
let headerUrl = '/spring-riskweb'

// ============================ 风险因素采集管理  start ======================
/**
 * 分页查询所有的风险因素
 * factorList
 */
export function factorList (data) {
  return http.Get(headerUrl + '/factor/list', data)
}
/**
 * 新增风险因素
 * factorAddOrUpdate
 */
export function factorAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/factor/update', data)
  } else {
    return http.Post(headerUrl + '/factor/add', data)
  }
}
/**
 * 删除风险因素
 * factorDelete
 */
export function factorDelete (data) {
  return http.Post(headerUrl + '/factor/delete', data)
}
/**
 * 根据事故类型查询所有的事故模型因素
 * factorDelete
 */
export function queryFactorByType (data) {
  return http.Get(headerUrl + '/factories/queryAll', data)
}

/**
 * 查询单个风险因素
 * factorInfo
 */
export function factorInfo (data) {
  return http.Get(headerUrl + '/factor/info', data)
}
/**
 * 查询所有风险因素
 * factorAll
 */
export function factorAll (data) {
  return http.Get(headerUrl + '/factor/queryAll')
}
/**
 * 新增子项或修改子项事故模型
 * factorAddOrUpdate
 */
export function subFactorAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/factories/update', data)
  } else {
    return http.Post(headerUrl + '/factories/add', data)
  }
}
/**
 * 单个事故模型因素
 */
export function accidentInfo (data) {
  return http.Get(headerUrl + '/factories/info', data)
}
/****
 * 删除某个事故模型
 */
export function accidentDelete (data) {
  return http.Post(headerUrl + '/factories/delete', data)
}
// ============================ 风险因素采集管理  end ======================
