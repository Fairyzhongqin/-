/**
 * Description:教育培训
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-processweb'
// ============================ 风险研判记录  start ======================
/**
 * 分页查询教育培训列表
 * statuteAddOrUpdate
 */
export function traintypeList (data) {
  return http.Get(headerUrl + '/traincategory/list', data)
}
/**
 * 单个培训类别信息
 * statuteAddOrUpdate
 */
export function traintypeInfo (data) {
  return http.Get(headerUrl + '/traincategory/info', data)
}
/**
 * 查询类别下子集复制
 * statuteAddOrUpdate
 */
export function traintypeChildList (data) {
  return http.Get(headerUrl + '/traincategory/findCategoryChild', data)
}
/**
 * 删除培训类别
 * statuteAddOrUpdate
 */
export function traintypeDelete (data) {
  return http.Post(headerUrl + '/traincategory/delete', data)
}
/**
 * 添加培训类别
 * statuteAddOrUpdate
 */
export function traintypeAdd (data) {
  if (data.id) {
    return http.Post(headerUrl + '/traincategory/update', data)
  } else {
    return http.Post(headerUrl + '/traincategory/add', data)
  }
}
/**
 * 分页查询所有的培训计划
 * statuteAddOrUpdate
 */
export function trainplanList (data) {
  return http.Get(headerUrl + '/trainplan/list', data)
}
/**
 * 添加培训类别
 * statuteAddOrUpdate
 */
export function trainplayAdd (data) {
  if (data.id) {
    return http.Post(headerUrl + '/trainplan/update', data)
  } else {
    return http.Post(headerUrl + '/trainplan/add', data)
  }
}
/**
 * 单个培训计划信息
 * statuteAddOrUpdate
 */
export function trainplayInfo (data) {
  return http.Get(headerUrl + '/trainplan/info', data)
}
/**
 * 删除培训类别
 * statuteAddOrUpdate
 */
export function trainPlanDelete (data) {
  return http.Post(headerUrl + '/trainplan/delete', data)
}
/**
 * 分页查询所有的培训资料
 * statuteAddOrUpdate
 */
export function trainDataList (data) {
  return http.Get(headerUrl + '/traindata/list', data)
}
/**
 * 添加培训资料
 * statuteAddOrUpdate
 */
export function trainpDataAdd (data) {
  if (data.id) {
    return http.Post(headerUrl + '/traindata/update', data)
  } else {
    return http.Post(headerUrl + '/traindata/add', data)
  }
}
/**
 * 单个培训资料信息
 * statuteAddOrUpdate
 */
export function trainDataInfo (data) {
  return http.Get(headerUrl + '/traindata/info', data)
}
/**
 * 删除培训资料
 * statuteAddOrUpdate
 */
export function trainDataDelete (data) {
  return http.Post(headerUrl + '/traindata/delete', data)
}
/**
 * 查询培训的参加人员
 * statuteAddOrUpdate
 */
export function trainPerson (data) {
  return http.Get(headerUrl + '/trainplan/findTrainPerson', data)
}
