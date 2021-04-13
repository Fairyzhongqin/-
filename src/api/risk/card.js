import http from '@/utils/httpRequest'
let headerUrl = '/spring-riskweb'
// ============================ 承诺卡管理  start ======================
/**
 * 查询所有的风险区域的承诺卡的树结构
 * promiseList
 */
export function promiseList (data) {
  return http.Get(headerUrl + '/promise/queryZoneRiskPromise', data)
}

/**
 * 查询单个承诺卡信息
 * promiseInfo
 */
export function promiseInfo (data) {
  return http.Get(headerUrl + '/promise/info', data)
}

/**
 * 添加修改承诺卡信息
 * promiseAdd
 */
export function promiseAddOrUpDate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/promise/update', data)
  } else {
    return http.Post(headerUrl + '/promise/add', data)
  }
}

/**
 * 删除承诺卡
 * promiseDelete
 */
export function promiseDelete (data) {
  return http.Get(headerUrl + '/promise/delete', data)
}
/**
 * 上传承诺卡照片
 * promiseUpload
 */
export function promiseUpload (data) {
  return http.Post(headerUrl + '/promise/upload', data, 'form')
}

// ============================ 承诺卡管理  end ======================

// ============================ 处置卡管理  start ======================
/**
 * 分页查询处置卡
 * manageList
 */
export function manageList (data) {
  return http.Get(headerUrl + '/manage/list', data)
}

/**
 * 查询处置卡
 * manageInfo
 */
export function manageInfo (data) {
  return http.Get(headerUrl + '/manage/info', data)
}

/**
 * 添加修改所有的处置卡
 * manageAdd
 */
export function manageAdd (data) {
  if (data.id) {
    return http.Post(headerUrl + '/manage/update', data)
  } else {
    return http.Post(headerUrl + '/manage/add', data)
  }
}

/**
 * 删除处置卡
 * manageDelete
 */
export function manageDelete (data) {
  return http.Post(headerUrl + '/manage/delete', data)
}
// ============================ 处置卡管理  end ======================
// ============================ 应知卡管理  start ======================
/**
 * 分页查询应知卡
 * shouldknowList
 */
export function shouldknowList (data) {
  return http.Get(headerUrl + '/shouldknow/list', data)
}

/**
 * 查询单个应知卡信息
 * shouldknowInfo
 */
export function shouldknowInfo (data) {
  return http.Get(headerUrl + '/shouldknow/info', data)
}

/**
 * 添加修改应知卡
 * shouldknowAddOrUpdate
 */
export function shouldknowAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/shouldknow/update', data)
  } else {
    return http.Post(headerUrl + '/shouldknow/add', data)
  }
}

/**
 * 删除应知卡
 * shouldknowDelete
 */
export function shouldknowDelete (data) {
  return http.Get(headerUrl + '/shouldknow/delete', data)
}
// ============================ 应知卡管理  end ======================
