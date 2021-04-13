import http from '@/utils/httpRequest'
let headerUrl = '/spring-posweb'

export function alarmRecord (data) { // 按照类型分别统计报警数
  return http.Get(headerUrl + '/kanban/alarmRecord', data)
}

export function getdevicecount (data) { // 统计（各类设备数量）设备
  return http.Get(headerUrl + '/kanban/getdevicecount', data)
}

export function getpersoncount (data) { // 统计个类型实时人数（缓存获取）
  return http.Get(headerUrl + '/kanban/getpersoncount', data)
}

export function getvisitorcount (data) { // 按月统计访客次数（月内每天）
  return http.Get(headerUrl + '/kanban/getvisitorcount', data)
}

export function getzoneperson (data) { // 统计区域进入人次
  return http.Get(headerUrl + '/kanban/getzoneperson', data)
}

export function getOperationLcon (data) { // 统计每日的作业数
  return http.Get(headerUrl + '/kanban/getOperationLcon', data)
}

export function getOperationCount (data) { // 统计作业个类型数量（作业次数、违规数、时长）
  return http.Get(headerUrl + '/kanban/getOperationCount', data)
}
