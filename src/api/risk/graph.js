import http from '@/utils/httpRequest'
let headerUrl = '/spring-riskweb'

// ============================ 安全四色区管理  start ======================
/**
 * 分页查询所有的风险分区
 * graphList
 */
export function graphList (data) {
  return http.Get(headerUrl + '/graph/list', data)
}
// ============================ 安全四色区管理  end ======================
