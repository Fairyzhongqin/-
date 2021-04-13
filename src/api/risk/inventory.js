import http from '@/utils/httpRequest'
let headerUrl = '/spring-riskweb'

// ============================ 风险辨识清单管理  start ======================
/**
 * 分页查询所有的风险辨识清单
 * identificationList
 */
export function identificationList (data) {
  return http.Get(headerUrl + '/identification/list', data)
}

/**
 * 查询单条风险辨识清单
 * identificationInfo
 */
export function identificationInfo (data) {
  return http.Get(headerUrl + '/identification/info')
}

/**
 * 添加修改所有的风险辨识清单
 * collectionAdd
 */
export function identificationAdd (data) {
  if (data.id) {
    return http.Post(headerUrl + '/identification/update', data)
  } else {
    return http.Post(headerUrl + '/identification/add', data)
  }
}

/**
 * 删除风险辨识清单
 * identificationDelete
 */
export function identificationDelete (data) {
  return http.Get(headerUrl + '/identification/delete')
}
// ============================ 风险辨识清单管理  end ======================

// ============================ 风险管控清单管理  start ======================
/**
 * 分页查询所有的风险辨识清单
 */
export function riskIdentificationList (data) {
  return http.Get(headerUrl + '/identification/list', data)
}

/**
 * 分页查询所有的风险管控清单
 */
export function riskControlList (data) {
  return http.Get(headerUrl + '/control/list', data)
}
/**
 * 新增/更新风险管控清单
 */
export function facilitiesUpdate (data) {
  return http.Post(headerUrl + '/facilities/updateControl', data)
}
// ============================ 风险辨识管控管理  end ======================
// ============================ 风险评价制度管理  start ======================
/**
 * 查询所有的风险制度关联部门的树结构
 */
export function getAssessmentList (data) {
  return http.Get(headerUrl + '/institution/queryZoneRiskDeptAndAssessment', data)
}

/**
 * 新增/更新新增部门职责和任务
 */
export function institutionAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/institution/update', data)
  } else {
    return http.Post(headerUrl + '/institution/add', data)
  }
}
/**
 * 批量新增/更新新增部门职责和任务
 */
export function bulkOpertionAddOrUpdate (data) {
  return http.Post(headerUrl + '/institution/restBatch', data)
}
/**
 * 查询单个部门职责和任务关联实体
 * institutionInfo
 */
export function institutionInfo (data) {
  return http.Get(headerUrl + '/institution/info', data)
}

/**
 * 删除风险辨识清单
 * institutionDelete
 */
export function institutionDelete (data) {
  return http.Post(headerUrl + '/institution/delete', data)
}
/****
 * 变更管控风险点
 */
export function riskChangeControl (data) {
  return http.Post(headerUrl + '/riskchange/changeControl', data)
}
// ============================  风险评价制度管理  start ======================
