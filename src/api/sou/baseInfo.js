import http from '@/utils/httpRequest'
let headerUrl = '/spring-souweb'
let headerUrlPos = '/spring-posweb'

// ============================ 罐区管理  start ======================
/**
 * 查询全部区域（树形结构）
 * queryZoneInfo
 */
export function getZoneInfo (data) {
  return http.Get(headerUrl + '/zone/getZoneInfo')
}

// ============================ 罐区管理  start ======================
/**
 * 新增罐区
 * tankfieldAdd
 */
export function tankfieldAdd (data) {
  if (data.id) {
    return http.Post(headerUrl + '/tankfield/update', data)
  } else {
    return http.Post(headerUrl + '/tankfield/add', data)
  }
}
/**
 * 分页查询所有的罐区列表
 * tankfieldList
 */
export function tankfieldList (data) {
  return http.Get(headerUrl + '/tankfield/list', data)
}
/**
 * 查看罐区储罐列表数据
 */
export function viewTankList (data) {
  return http.Get(headerUrl + '/tank/get', data)
}
/**
 * 删除罐区
 * tankfieldDelete
 */
export function tankfieldDelete (data) {
  return http.Post(headerUrl + '/tankfield/delete', data)
}
/**
 * 罐区信息
 * tankfieldInfo
 */
export function tankfieldInfo (data) {
  return http.Get(headerUrl + '/tankfield/info', data)
}
/**
 * 查询所有罐区code
 * tankFieldCodeList
 */
export function queryTankFieldCode (data) {
  return http.Get(headerUrl + '/tankfield/queryCode', data)
}
// ============================ 罐区管理  end ======================

// ============================ 仓库区管理  start ======================
/**
 * 新增仓库
 * repositoryAdd
 */
export function repositoryAdd (data) {
  if (data.id) {
    return http.Post(headerUrl + '/repositoryfield/update', data)
  } else {
    return http.Post(headerUrl + '/repositoryfield/add', data)
  }
}
/**
 * 分页查询所有的仓库列表
 * repositoryList
 */
export function repositoryList (data) {
  return http.Get(headerUrlPos + '/zone/findListByCon', data)
}
/**
 * 库区
 * 查询全部区域（树形结构）
 */
export function allRepositCate (data) {
  return http.Get(headerUrl + '/zone/getZoneInfo', data)
}
/**
 * 查看库区仓库列表数据
 */
export function getReservorList (data) {
  return http.Get(headerUrl + '/depository/get', data)
}
/**
 * 删除仓库
 * repositoryDelete
 */
export function repositoryDelete (data) {
  return http.Post(headerUrl + '/repositoryfield/delete', data)
}
/**
 * 仓库信息
 * repositoryInfo
 */
export function repositoryInfo (data) {
  return http.Get(headerUrl + '/repositoryfield/info', data)
}
/**
 * 查询所有库区code
 * repositoryCodeList
 */
export function queryRepositoryCode (data) {
  return http.Get(headerUrl + '/repositoryfield/queryCode', data)
}
// ============================ 仓库管理  end ======================

// ============================ 生产场所管理  start ======================
/**
 * 新增生产场所
 * produceplaceAdd
 */
export function produceplaceAdd (data) {
  if (data.id) {
    return http.Post(headerUrl + '/produceplace/update', data)
  } else {
    return http.Post(headerUrl + '/produceplace/add', data)
  }
}
/**
 * 分页查询所有的生产场所列表
 * produceplaceList
 */
export function produceplaceList (data) {
  return http.Get(headerUrl + '/produceplace/list', data)
}
/**
 * 删除生产场所
 * produceplaceDelete
 */
export function produceplaceDelete (data) {
  return http.Post(headerUrl + '/produceplace/delete', data)
}
/**
 * 查看反应装置列表
 * viewReactList
 */
export function viewReactList (data) {
  return http.Get(headerUrl + '/reactor/get', data)
}
/**
 * 生产场所信息
 * produceplaceInfo
 */
export function produceplaceInfo (data) {
  return http.Get(headerUrl + '/produceplace/info', data)
}
/**
 * 查询所有生产场所code
 * repositoryList
 */
export function queryProducePlaceCode (data) {
  return http.Get(headerUrl + '/produceplace/queryCode', data)
}

// ============================ 生产场所管理  end ======================

// ============================ 重大危险源  start ======================
/**
 * 分页查询所有的重大危险源
 * dangerSourceList
 */
export function dangerSourceList (data) {
  return http.Get(headerUrl + '/dangerSource/list', data)
}
/**
 * 删除重大危险源（真删除）
 * dangerSourceDelete
 */
export function dangerSourceDelete (data) {
  return http.Post(headerUrl + '/dangerSource/delete', data)
}
/**
 * 新增/修改重大危险源
 * dangerSourceAddOrUpdate
 */
export function dangerSourceAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/dangerSource/update', data)
  } else {
    return http.Post(headerUrl + '/dangerSource/add', data)
  }
}
/**
 * 查询该重大危险源的详细信息
 * dangerSourceInfo
 */
export function dangerSourceInfo (data) {
  return http.Get(headerUrl + '/dangerSource/info', data)
}
// ============================ 重大危险源   end  ======================
