/**
 * Description: 目标责任管理
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-processweb'
// ============================ 企业方针和目标 start ======================
/**
 * 新增或修改企业方针和目标
 * policiesAddOrUpdate
 */
export function policiesAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/policies/update', data)
  } else {
    return http.Post(headerUrl + '/policies/add', data)
  }
}
/**
 * 分页查询所有的企业方针和目标
 * policiesList
 */
export function policiesList (data) {
  return http.Get(headerUrl + '/policies/list', data)
}
/**
 * 企业方针和目标-删除
 * policiesDelete
 */
export function policiesDelete (data) {
  return http.Post(headerUrl + '/policies/delete', data)
}
/**
 * 获取单个企业方针和目标
 * policiesInfo
 */
export function policiesInfo (data) {
  return http.Get(headerUrl + '/policies/info', data)
}
/**
 * 分页查询所有的目标
 * objectivesList
 */
export function objectivesList (data) {
  return http.Get(headerUrl + '/objectives/list', data)
}
/**
 * 新增或修改企业目标
 * objectivesAddOrUpdate
 */
export function objectivesAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/objectives/update', data)
  } else {
    return http.Post(headerUrl + '/objectives/add', data)
  }
}
/**
 * 获取单个企业目标
 * objectivesInfo
 */
export function objectivesInfo (data) {
  return http.Get(headerUrl + '/objectives/info', data)
}

/**
 * 企业目标-删除
 * objectivesDelete
 */
export function objectivesDelete (data) {
  return http.Post(headerUrl + '/objectives/delete', data)
}

/**
 * 企业目标-发布
 * policiesRGelease
 */
export function policiesRelease (data) {
  return http.Get(headerUrl + '/policies/release', data)
}
// ============================ 企业方针和目标  end =======================
// ============================ 部门目标 start ======================
/**
 * 分页查所有的部门目标
 * organizationList
 */
export function organizationList (data) {
  return http.Get(headerUrl + '/organization/list', data)
}
/**
 * 新增或修改部门目标
 * organizationAddOrUpdate
 */
export function organizationAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/organization/update', data)
  } else {
    return http.Post(headerUrl + '/organization/add', data)
  }
}
/**
 * 获取单个部门目标
 * organizationInfo
 */
export function organizationInfo (data) {
  return http.Get(headerUrl + '/organization/info', data)
}

/**
 * 部门目标-删除
 * organizationDelete
 */
export function organizationDelete (data) {
  return http.Post(headerUrl + '/organization/delete', data)
}
/**
 * 部门目标-考核
 * organizationAssessment
 */
export function organizationAssessment (data) {
  return http.Post(headerUrl + '/organization/assessment', data)
}
// ============================ 部门目标 start ======================
// ============================ 目标计划start ======================
/**
 * 分页查询所有月度目标
 * deptMonthlyList
 */
export function deptMonthlyList (data) {
  return http.Get(headerUrl + '/deptMonthlyObjectives/list', data)
}
/**
 * 新增或修改月度目标
 * deptMonthlyAddOrUpdate
 */
export function deptMonthlyAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/deptMonthlyObjectives/update', data)
  } else {
    return http.Post(headerUrl + '/deptMonthlyObjectives/add', data)
  }
}
/**
 * 获取获取单个月度目标
 * deptMonthlyInfo
 */
export function deptMonthlyInfo (data) {
  return http.Get(headerUrl + '/deptMonthlyObjectives/info', data)
}

/**
 * 部门目标-删除
 * deptMonthlDelete
 */
export function deptMonthlDelete (data) {
  return http.Post(headerUrl + '/deptMonthlyObjectives/delete', data)
}
/**
 * 执行月度目标
 * deptMonthlyexecution
 */
export function deptMonthlyexecution (data) {
  return http.Post(headerUrl + '/deptMonthlyObjectives/execution', data, 'form')
}
// ============================ 目标计划 start ======================
// ============================ start ==============================
// ============================ 目标达标统计 start ==================
/**
 * 目标达标
 * targetReaching
 */
export function targetReaching (data) {
  return http.Get(headerUrl + '/objectivesReachingSituation/findTargetRateByMonthly', data)
}
/**
 * 根据月份和部门查询目标计划达标情况
 * targetReachingDetail
 */
export function targetReachingDetail (data) {
  return http.Get(headerUrl + '/objectivesReachingSituation/findTargetRateByMonthlyDetail', data)
}
// ============================ 目标达标统计 end ====================
