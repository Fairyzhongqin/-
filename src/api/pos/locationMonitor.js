import http from '@/utils/httpRequest'

// 人员实时位置
export function curPerInfo (data) {
  return http.Get('/wisdom_gate/monitoring/curPerInfo', data)
}

// 获取人员基本信息
export function queryPerInfo (data) {
  return http.Post('/wisdom_gate/person/queryPerInfo', data)
}

// 获取班组列表（下拉框用）
export function queryDept (data) {
  return http.Post('/wisdom_gate/dept/queryDept', data)
}

// 获取人员列表信息
export function getPersonList (data) {
  return http.Post('/wisdom_gate/person/list', data)
}

// 获取逗留时长
export function getStayTime (data) {
  return http.Post('/wisdom_gate/behavior/stayTime', data)
}
