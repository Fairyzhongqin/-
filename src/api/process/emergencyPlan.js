/**
 * Description: 应急预案
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-processweb'
// ============================ 应急预案  start ======================
/**
 * 新增或修改应急预案
 * contingencyAddOrUpdate
 */
export function contingencyAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/contingency/update', data)
  } else {
    return http.Post(headerUrl + '/contingency/add', data)
  }
}
/**
 * 分页查询所有的应急预案
 * contingencyList
 */
export function contingencyList (data) {
  return http.Get(headerUrl + '/contingency/list', data)
}
/**
 * 应急预案-删除
 * contingencyDelete
 */
export function contingencyDelete (data) {
  return http.Post(headerUrl + '/contingency/delete', data)
}
/**
 * 获取单个预案信息
 * contingencyInfo
 */
export function contingencyInfo (data) {
  return http.Get(headerUrl + '/contingency/info', data)
}
/**
 * 应急预案-提交
 * contingencySubmit
 */
export function contingencySubmit (data) {
  return http.Post(headerUrl + '/contingency/submit', data)
}
/**
 * 应急预案-审核
 * contingencyAudit
 */
export function contingencyAudit (data) {
  return http.Post(headerUrl + '/contingency/audit', data)
}
/**
 * 应急预案-下载
 * contingencyDownload
 */
export function contingencyDownload (data) {
  return http.Post(headerUrl + '/attachment/download', data)
}
/**
 * 应急预案-查询上传的文件
 * contingencyDownloadInfo
 */
export function contingencyDownloadInfo (data) {
  return http.Get(headerUrl + '/attachment/info', data)
}
/**
 * 应急预案附件-删除
 * attachmentDelete
 */
export function attachmentDelete (data) {
  return http.Post(headerUrl + '/attachment/delete', data)
}
/****
 * 分页查询所有应急物资
 */
export function emergencyMaterial (data) {
  return http.Get(headerUrl + '/supplies/list', data)
}
/****
 * 删除应急物资
 */
export function emergencyMaterialDelete (data) {
  return http.Post(headerUrl + '/supplies/delete', data)
}
/**
 * 根据ID获取单个应急物资
 * contingencyInfo
 */
export function emergencyMaterialInfo (data) {
  return http.Get(headerUrl + '/supplies/info', data)
}
/**
 * 新增或修改新增应急物资
 * contingencyAddOrUpdate
 */
export function emergencyAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/supplies/update', data)
  } else {
    return http.Post(headerUrl + '/supplies/add', data)
  }
}
// ============================ 应急预案  end =======================
// ============================ 应急演练  start ======================
/**
 * 新增或修改演练计划
 * drillAddOrUpdate
 */
export function drillAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/drill/update', data)
  } else {
    return http.Post(headerUrl + '/drill/add', data)
  }
}
/**
 * 分页查询所有的演练计划
 * drillList
 */
export function drillList (data) {
  return http.Get(headerUrl + '/drill/list', data)
}
/**
 * 应急预案-删除
 * drillDelete
 */
export function drillDelete (data) {
  return http.Post(headerUrl + '/drill/delete', data)
}
/**
 * 获取单个演练计划信息
 * drillInfo
 */
export function drillInfo (data) {
  return http.Get(headerUrl + '/drill/info', data)
}
/**
 * 分页查询所有的演练记录
 * drillRecordList
 */
export function drillRecordList (data) {
  return http.Get(headerUrl + '/drillRecord/list', data)
}

/**
 * 获取单个演练记录信息
 * drillRecordInfo
 */
export function drillRecordInfo (data) {
  return http.Get(headerUrl + '/drillRecord/info', data)
}

/**
 * 新增或修改演练记录
 * drillRecordAddOrUpdate
 */
export function drillRecordAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/drillRecord/update', data)
  } else {
    return http.Post(headerUrl + '/drillRecord/add', data)
  }
}
/**
 * 演练记录-删除
 * drillRecordDelete
 */
export function drillRecordDelete (data) {
  return http.Post(headerUrl + '/drillRecord/delete', data)
}
// ============================ 应急演练  end =======================
// ============================ 物资申领  start =======================
/**
 * 分页查询所有申领记录
 * applyRecord
 */
export function applyRecord (data) {
  return http.Get(headerUrl + '/claim/list', data)
}
/**
 * 获取应急物资类型
 * supplyType
 */
export function supplyType (data) {
  return http.Get(headerUrl + '/supplies/getType', data)
}
