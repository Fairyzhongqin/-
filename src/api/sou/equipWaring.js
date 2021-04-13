import http from '@/utils/httpRequest'
let headerUrl = '/spring-souweb'
// ============================ 参数类型 start ======================
/**
 * 分页查询所有的高危工艺类别信息
 * parameterTypeList
 */
export function parameterTypeList (data) {
  return http.Get(headerUrl + '/parametertype/list', data)
}

/**
 * 新增高危工艺类别信息
 * parameterTypeAddOrUpdate
 */
export function parameterTypeAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/parametertype/update', data)
  } else {
    return http.Post(headerUrl + '/parametertype/add', data)
  }
}
/**
 * 查询单个高危工艺类别信息
 * parameterTypeInfo
 */
export function parameterTypeInfo (data) {
  return http.Get(headerUrl + '/parametertype/info', data)
}
/**
 * 删除高危工艺类别信息
 * parameterTypeDelete
 */
export function parameterTypeDelete (data) {
  return http.Post(headerUrl + '/parametertype/delete', data)
}

// ============================ 参数类型  end ======================
// ============================ 参数管理start ======================
/**
 * 分页查询所有的参数数据
 * parameterTypeList
 */
export function parameterList (data) {
  return http.Get(headerUrl + '/parameter/list', data)
}

/**
 * 新增参数数据
 * parameterTypeAddOrUpdate
 */
export function parameterAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/parameter/update', data)
  } else {
    return http.Post(headerUrl + '/parameter/add', data)
  }
}
/**
 * 查询单个参数数据
 * parameterTypeInfo
 */
export function parameterInfo (data) {
  return http.Get(headerUrl + '/parameter/info', data)
}
/**
 * 删除参数数据
 * parameterTypeDelete
 */
export function parameterDelete (data) {
  return http.Post(headerUrl + '/parameter/delete', data)
}

// ============================ 参数管理end ======================
