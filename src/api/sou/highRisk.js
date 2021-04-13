import http from '@/utils/httpRequest'
let headerUrl = '/spring-souweb'
// ============================ 高危工艺类别 start ======================
/**
 * 分页查询所有的高危工艺类别信息
 * repositoryList
 */
export function highRiskProcessTypeList (data) {
  return http.Get(headerUrl + '/highriskprocesstype/list', data)
}

/**
 * 新增高危工艺类别信息
 * processTypeAddOrUpdate
 */
export function processTypeAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/highriskprocesstype/update', data)
  } else {
    return http.Post(headerUrl + '/highriskprocesstype/add', data)
  }
}
/**
 * 查询单个高危工艺类别信息
 * processTypeInfo
 */
export function processTypeInfo (data) {
  return http.Get(headerUrl + '/highriskprocesstype/info', data)
}
/**
 * 删除高危工艺类别信息
 * processTypeDelete
 */
export function processTypeDelete (data) {
  return http.Post(headerUrl + '/highriskprocesstype/delete', data)
}

// ============================ 高危工艺类别  end ======================
// ============================ 高危工艺管理 start ======================
/**
 * 分页查询所有的高危工艺数据
 * highRiskProcessList
 */
export function highRiskProcessList (data) {
  return http.Get(headerUrl + '/highriskprocess/list', data)
}

/**
 * 新增高危工艺数据
 * processAddOrUpdate
 */
export function processAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/highriskprocess/update', data)
  } else {
    return http.Post(headerUrl + '/highriskprocess/add', data)
  }
}
/**
 * 查询单个高危工艺数据
 * processInfo
 */
export function processInfo (data) {
  return http.Get(headerUrl + '/highriskprocess/info', data)
}
/**
 * 删除高危工艺数据
 * processDelete
 */
export function processDelete (data) {
  return http.Post(headerUrl + '/highriskprocess/delete', data)
}

/**
 * 更新状态
 * processUpdateStatus
 */
export function processUpdateStatus (data) {
  return http.Post(headerUrl + '/highriskprocess/updateStatus', data, 'form')
}
// ============================ 高危工艺管理 start ======================
// ============================ 危险化学品 start ======================
/**
 * 分页查询所有的危险化学品数据
 * dangerChemicalsList
 */
export function dangerChemicalsList (data) {
  return http.Get(headerUrl + '/dangerchemicals/list', data)
}

/**
 * 危险化学品工艺数据
 * dangerChemicalsAddOrUpdate
 */
export function dangerChemicalsAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/dangerchemicals/update', data)
  } else {
    return http.Post(headerUrl + '/dangerchemicals/add', data)
  }
}
/**
 * 查询单个高危工艺数据
 * dangerChemicalsInfo
 */
export function dangerChemicalsInfo (data) {
  return http.Get(headerUrl + '/dangerchemicals/info', data)
}
/**
 * 删除高危工艺数据
 * dangerChemicalsDelete
 */
export function dangerChemicalsDelete (data) {
  return http.Post(headerUrl + '/dangerchemicals/delete', data)
}

// ============================ 危险化学品管理 end ======================

// ============================ 高危工艺监测 start ======================
/**
 * 获取反应装置的参数
 * getParamByReactor
 */
export function getParamByReactor (data) {
  return http.Get(headerUrl + '/highriskmonitor/getParamByReactor', data)
}
// ============================ 高危工艺监测 end ======================
