import http from '@/utils/httpRequest'
let headerUrl = '/spring-processweb'
// ============================ 证书库配置  start ======================
/**
 * 新增或修改
 * certificateAddOrUpdate
 */
export function certificateAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/certificate/update', data)
  } else {
    return http.Post(headerUrl + '/certificate/add', data)
  }
}
/**
 * 分页查询所有证书
 * certificateList
 */
export function certificateList (data) {
  return http.Get(headerUrl + '/certificate/list', data)
}
/**
 * 单个信息
 * certificateInfo
 */
export function certificateInfo (data) {
  return http.Get(headerUrl + '/certificate/info', data)
}
/**
 * 删除
 * certificateDelete
 */
export function certificateDelete (data) {
  return http.Post(headerUrl + '/certificate/delete', data)
}

/**
 * 根据ID获取单个附件信息
 * attachmentInfo
 */
export function attachmentInfo (data) {
  return http.Get(headerUrl + '/attachment/info', data)
}
/**
 * 附件-删除
 * attachmentDelete
 */
export function attachmentDelete (data) {
  return http.Post(headerUrl + '/attachment/delete', data)
}
// ============================ 证书库配置  end ======================

// ============================ 证书库子项  start ======================
/**
/**
 * 新增或修改
 * employeeCertificateAddOrUpdate
 */
export function employeeCertificateAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/employeeCertificate/update', data)
  } else {
    return http.Post(headerUrl + '/employeeCertificate/add', data)
  }
}
/**
 * 分页查询所有证书
 * employeeCertificateList
 */
export function employeeCertificateList (data) {
  return http.Get(headerUrl + '/employeeCertificate/list', data)
}
/**
 * 单个信息
 * employeeCertificateInfo
 */
export function employeeCertificateInfo (data) {
  return http.Get(headerUrl + '/employeeCertificate/info', data)
}
/**
 * 删除
 * employeeCertificateDelete
 */
export function employeeCertificateDelete (data) {
  return http.Post(headerUrl + '/employeeCertificate/delete', data)
}
// ============================ 证书库子项  end ======================
