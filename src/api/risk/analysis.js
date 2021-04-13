import http from '@/utils/httpRequest'
let headerUrl = '/spring-riskweb'
// ============================ 风险因素采集管理  start ======================
/**
 * 分页查询所有的风险因素
 * facilitiesList
 */
export function facilitiesList (data) {
  return http.Get(headerUrl + '/facilities/list', data)
}
/**
 * 新增风险因素
 * facilitiesAddOrUpdate
 */
export function facilitiesAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/facilities/update', data)
  } else {
    return http.Post(headerUrl + '/facilities/add', data)
  }
}

/**
 * 查询单个风险因素
 * facilitiesInfo
 */
export function facilitiesInfo (data) {
  return http.Get(headerUrl + '/facilities/info', data)
}
/**
 * 删除风险因素
 * facilitiesDelete
 */
export function facilitiesDelete (data) {
  return http.Post(headerUrl + '/facilities/delete', data)
}
/**
 * 风险点辨识（评价）
 * facilitiesDelete
 */
export function riskPointEvaluate (data) {
  return http.Post(headerUrl + '/facilities/updateOther', data)
}
/****
 * 风险点提交
 */
export function riskPointSubmit (data) {
  return http.Post(headerUrl + '/facilities/updateEntry', data)
}
/****
 * 管控措施落实
 */
export function practicableControl (data) {
  return http.Post(headerUrl + '/facilities/practicableControl', data)
}

// ============================ 风险因素采集管理  end ======================
