import http from '@/utils/httpRequest'
let headerUrl = '/spring-riskweb'
// ============================ 隐患排查治理  start ======================
/**
 * 分页查询所有的隐患信息
 * hiddenDangerList
 */
export function hiddenDangerList (data) {
  return http.Get(headerUrl + '/hiddendanger/list', data)
}

/**
 * 删除隐患信息
 */
export function hiddenDangerDelete (data) {
  return http.Post(headerUrl + '/hiddendanger/delete', data)
}

/**
 * 单个隐患信息
 */
export function hiddenDangerInfo (data) {
  return http.Get(headerUrl + '/hiddendanger/info', data)
}

/**
 * 新增或修改隐患上报
 */
export function hiddenDangerAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/hiddendanger/update', data)
  } else {
    return http.Post(headerUrl + '/hiddendanger/add', data)
  }
}
/**
 * 隐患操作（分析、整改验收）
 */
export function hiddendangerOperate (data) {
  return http.Post(headerUrl + '/hiddendanger/updateOther', data)
}
/**
 * 验收接口
 */
export function hiddendangerCheck (data) {
  return http.Post(headerUrl + '/hiddendanger/updateCheck', data)
}
/**
 * 忽略隐患
 */
export function ignoreDanger (data) {
  return http.Post(headerUrl + '/hiddendanger/ignor', data, 'form')
}
// ============================ 隐患排查治理  end ======================
