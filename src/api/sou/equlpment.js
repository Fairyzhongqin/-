import http from '@/utils/httpRequest'
let headerUrl = '/spring-souweb'

// ============================ 仓库管理  start ======================
/**
 * 新增仓库
 * repositoryAdd
 */
export function repositoryAdd (data) {
  if (data.id) {
    return http.Post(headerUrl + '/depository/update', data)
  } else {
    return http.Post(headerUrl + '/depository/add', data)
  }
}
/**
 * 分页查询所有的仓库列表
 * repositoryList
 */
export function repositoryList (data) {
  return http.Get(headerUrl + '/depository/list', data)
}
/**
 * 删除仓库
 * repositoryDelete
 */
export function repositoryDelete (data) {
  return http.Post(headerUrl + '/depository/delete', data)
}
/**
 * 仓库信息
 * repositoryInfo
 */
export function repositoryInfo (data) {
  return http.Get(headerUrl + '/depository/info', data)
}
/**
 * 查询库区id
 * reservorId
 */
export function reservorId (data) {
  return http.Get(headerUrl + '/repositoryfield/queryAll', data)
}
// ============================ 仓库管理  end ======================

// ============================ 储罐管理  start ======================
/**
 * 新增储罐
 * tankAdd
 */
export function tankAdd (data) {
  if (data.id) {
    return http.Post(headerUrl + '/tank/update', data)
  } else {
    return http.Post(headerUrl + '/tank/add', data)
  }
}
/**
 * 分页查询所有的储罐列表
 * tankList
 */
export function tankList (data) {
  return http.Get(headerUrl + '/tank/list', data)
}
/**
 * 删除储罐
 * tankDelete
 */
export function tankDelete (data) {
  return http.Post(headerUrl + '/tank/delete', data)
}
/**
 * 储罐信息
 * tankInfo
 */
export function tankInfo (data) {
  return http.Get(headerUrl + '/tank/info', data)
}
/**
 * 查询所有的罐区
 * 罐区Id
 */
export function allTankId (data) {
  return http.Get(headerUrl + '/tankfield/queryAll', data)
}
// ============================ 储罐管理  end ======================

// ============================ 危化品管理  start ======================
/**
 * 新增危化品
 * reactorAdd
 */
export function reactorAdd (data) {
  if (data.id) {
    return http.Post(headerUrl + '/reactor/update', data)
  } else {
    return http.Post(headerUrl + '/reactor/add', data)
  }
}
/**
 * 分页查询所有的危化品列表
 * reactorList
 */
export function reactorList (data) {
  return http.Get(headerUrl + '/reactor/list', data)
}
/**
 * 删除危化品
 * reactorDelete
 */
export function reactorDelete (data) {
  return http.Post(headerUrl + '/reactor/delete', data)
}
/**
 * 查询所有生产场所
 */
export function allProduceId (data) {
  return http.Get(headerUrl + '/produceplace/queryAll', data)
}
/**
 * 单个反应装置信息
 * reactorInfo
 */
export function reactorInfo (data) {
  return http.Get(headerUrl + '/reactor/info', data)
}
/**
 * 某个储罐/生产装置的所有仪表数据
 * panelInfo
 */
export function panelInfo (data) {
  return http.Get(headerUrl + '/meter/show', data)
}
/**
 * 某个储罐/生产装置的所有仪表数据
 * panelInfo
 */
export function addPanel (data) {
  return http.Post(headerUrl + '/meter/addBatch', data)
}
/**
 * 根据仪表查询最新监测数据
 *
 */
export function realTimeData (data) {
  return http.Get(headerUrl + '/DCSData/findNewestDate', data)
}
// ============================ 危化品管理  end ======================
// ============================ 设施查询  start========================

/**
 *巡检根据区域和type，查设备list
 *getFacilityList
 */
export function getFacilityList (data) {
  return http.Get(headerUrl + '/facility/list', data)
}
// ============================ 设施查询  end ========================
