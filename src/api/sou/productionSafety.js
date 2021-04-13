import http from '@/utils/httpRequest'
let headerUrl = '/spring-processweb'
// ============================ 生产报告 模板 start ======================
/**
 * 分页查询所有生产报告模板
 * reportTemplateList
 */
export function reportTemplateList (data) {
  return http.Get(headerUrl + '/reportTemplate/list', data)
}
/**
 * 查询单个生产报告模板
 * reportTemplateInfo
 */
export function reportTemplateInfo (data) {
  return http.Get(headerUrl + '/reportTemplate/info', data)
}
/**
 * 新增或修改生产报告模板
 * reportTemplateAddOrUpdate
 */
export function reportTemplateAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/reportTemplate/update', data)
  } else {
    return http.Post(headerUrl + '/reportTemplate/add', data)
  }
}
/**
 * 删除生产报告模板
 * reportTemplateDel
 */
export function reportTemplateDel (data) {
  return http.Post(headerUrl + '/reportTemplate/delete', data)
}
/**
 * 根据模板ID查询模板变量
 * findVariablesByTemplateId
 */
export function findVariablesByTemplateId (data) {
  return http.Get(headerUrl + '/reportVariables/findByTemplateId', data)
}
/**
 * 新增模板变量
 * reportVariablesAdd
 */
export function reportVariablesAdd (data) {
  return http.Post(headerUrl + '/reportVariables/add', data)
}
/**
 * 删除模板变量
 * reportTemplateDel
 */
export function reportVariablesDel (data) {
  return http.Post(headerUrl + '/reportVariables/delete', data)
}
// ============================ 生产报告 模板 end======================
