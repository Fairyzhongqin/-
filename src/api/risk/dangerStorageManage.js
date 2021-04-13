import http from '@/utils/httpRequest'
let headerUrl = '/spring-souweb'

// ============================ 存储设施类型管理  start ======================
/**
 * 分页查询所有的参数信息
 * storageFaciltyTypeList
 */
export function storageFaciltyTypeList (data) {
  return http.Get(headerUrl + '/storageFacilityType/list', data)
}
/**
 * 添加修改所有的风险辨识清单
 * collectionAdd
 */
export function storageTypeAdd (data) {
  if (data.id) {
    return http.Post(headerUrl + '/storageFacilityType/update', data)
  } else {
    return http.Post(headerUrl + '/storageFacilityType/add', data)
  }
}
/**
 * 单个存储设施类型数据
 * storageTypeInfo
 */
export function storageTypeInfo (data) {
  return http.Get(headerUrl + '/storageFacilityType/info', data)
}
/**
 * 删除单个存储设施类型数据
 * storageTypeDelete
 */
export function storageTypeDelete (data) {
  return http.Post(headerUrl + '/storageFacilityType/delete', data)
}
