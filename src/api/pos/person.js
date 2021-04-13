/**
 * Author: crain
 * Date: 2019/8/25
 * Description:
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-posweb'
// headerUrl = ''

// ============================ 人员列表  start ======================
/**
 * 分页查询所有人员
 * pList
 */
export function pList (data) {
  return http.Get(headerUrl + '/person/list', data)
}
/**
 * 删除人员信息
 * pDelete
 */
export function pDelete (data) {
  return http.Post(headerUrl + '/person/delete', data)
}
/**
 * 查询共有哪些人员类型
 * pTypeList
 */
export function pTypeList (data) {
  return http.Get(headerUrl + '/person/typeList', data)
}
/**
 * 查对应人员类型id下有哪些特有属性
 * pGetAttrs
 */
export function pGetAttrs (data) {
  return http.Get(headerUrl + '/person/getAttrs', data)
}
/**
 * 新增/修改 人员列表
 * pAddOrUpdate
 */
export function pAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/person/update', data)
  } else {
    return http.Post(headerUrl + '/person/add', data)
  }
}
/**
 * 查询单个人员类型
 * pGet
 */
export function pGet (data) {
  return http.Get(headerUrl + '/person/get', data)
}
// ============================ 人员列表  end ======================

// ============================ 人员类型  start ======================
/**
 * 分页查询所有人员类型
 * personTypeList
 */
export function personTypeList (data) {
  return http.Get(headerUrl + '/personType/list', data)
}
/**
 * 分页查询所有访客人员
 * visitorList
 */
export function visitorList (data) {
  return http.Get(headerUrl + '/visitor/list', data)
}
/**
 * 访客拉黑
 * visitorBlacken
 */
export function visitorBlacken (data) {
  return http.Post(headerUrl + '/visitor/update', data, 'form')
}
/**
 * 分页查询所有访客记录
 * visitorRecord
 */
export function visitorRecord (data) {
  return http.Get(headerUrl + '/visitor/recordList', data)
}
/**
 * 获取访客报警信息内容
 * visitorRecord
 */
export function alearInfomation (data) {
  return http.Get(headerUrl + '/visitor/getalerlist', data)
}
/**
 * 访客时间线
 */
export function visitTimeLine (data) {
  return http.Get(headerUrl + '/visitor/recordlistbyid', data)
}
/**
 * 删除人员类型
 * personTypeDelete
 */
export function personTypeDelete (data) {
  return http.Post(headerUrl + '/personType/delete', data)
}
/**
 * 新增/修改 人员类型
 * personTypeAddOrUpdate
 */
export function personTypeAddOrUpdate (data) {
  if (data.cgformId) {
    return http.Post(headerUrl + '/personType/update', data)
  } else {
    return http.Post(headerUrl + '/personType/add', data)
  }
}
/**
 * 查询单个人员类型
 * personTypeInfo
 */
export function personTypeInfo (data) {
  return http.Get(headerUrl + '/personType/info', data)
}
// ============================ 人员类型  end ======================
// ============================ 岗位管理  start ======================
/**
 * 分页查询所有岗位信息
 * postList
 */
export function stationList (data) {
  return http.Get(headerUrl + '/station/list', data)
}
/**
 * 新增岗位数据
 * postAdd
 */
export function stationAddOrUpdate (data) {
  console.log(data)
  if (data.id) {
    return http.Post(headerUrl + '/station/update', data)
  } else {
    return http.Post(headerUrl + '/station/add', data)
  }
}
/**
 * 查询单个岗位信息
 * personTypeInfo
 */
export function stationInfo (data) {
  return http.Get(headerUrl + '/station/info', data)
}
/**
 * 删除岗位
 * personTypeInfo
 */
export function stationDelete (data) {
  return http.Post(headerUrl + '/station/delete', data)
}
/**
 * 查询该承包商以及无承包商的所有人员
 * personInfo
 */
export function personInfo (data) {
  return http.Get(headerUrl + '/person/info', data)
}
/**
 * 统计承包商各类型作业时间（总时长，均时）
 * contractorWorkTime
 */
export function contractorWorkTime (data) {
  return http.Get(headerUrl + '/contractor/getContraTime', data)
}
/**
 * 统计承包商违规次数（总违规，均次违规）
 */
export function contractorWeigui (data) {
  return http.Get(headerUrl + '/contractor/getViolatCount', data)
}
/**
 * 新增时间段
 * stationAdd
 */
export function stationAdd (data) {
  return http.Post(headerUrl + '/station/period/add', data)
}
/**
 * 分页查询所有时间段
 * stationListTime
 */
export function stationListTime (data) {
  return http.Get(headerUrl + '/station/period/list', data)
}
/**
 *删除时间段
 * stationDeleteTime
 */
export function stationDeleteTime (data) {
  return http.Post(headerUrl + '/station/period/delete', data)
}
// ============================ 岗位管理  end ======================

// ==========================巡检管理 start========================
/**
 *分页查询所有巡检任务
 *stationWorkList
 */
export function stationWorkList (data) {
  return http.Get(headerUrl + '/patroltask/list', data)
}

/**
 *某日所有巡检任务
 *stationWorkList
 */
export function patrolRecordList (data) {
  return http.Get(headerUrl + '/patrolrecord/list', data)
}

/**
 *删除巡检任务
 * stationDeleteTime
 */
export function stationDeleteWork (data) {
  return http.Post(headerUrl + '/patroltask/delete', data)
}
/**
 *保存巡检任务数据
 * stationSaveWork
 */
export function stationSaveWork (data) {
  return http.Post(headerUrl + '/patroltask/save', data)
}
/**
 *查询巡检任务数据
 * patrolTaskInfo
 */
export function patrolTaskInfo (data) {
  return http.Get(headerUrl + '/patroltask/info', data)
}
/**
 *查询所有巡检区域数据
 *patrolzoneList
 */
export function patrolzoneList (data) {
  return http.Get(headerUrl + '/patrolzone/list', data)
}
/**
 *启用禁用巡检任务
 * patroltaskEnable
 */
export function patroltaskEnable (data) {
  return http.Post(headerUrl + '/patroltask/enableOrNot', data)
}
/**
 *查询单个巡检区域数据
 *patrolzoneList
 */
export function patrolzoneInfo (data) {
  return http.Get(headerUrl + '/patrolzone/info', data)
}

/**
 *删除巡检任务
 * patrolzoneDelete
 */
export function patrolzoneDelete (data) {
  return http.Post(headerUrl + '/patrolzone/delete', data)
}
/**
 *巡检区域重排序
 * patrolzoneReorder
 */
export function patrolzoneReorder (data) {
  return http.Post(headerUrl + '/patrolzone/reorder', data)
}
/**
 *新增或者修改巡检区域
 *addOrUpdatepatrolzone
 */
export function addOrUpdatepatrolzone (data) {
  return http.Post(headerUrl + '/patrolzone/save', data)
}
/**
 *分页查询所有巡检点
 *patrolpointList
 */
export function patrolpointList (data) {
  return http.Get(headerUrl + '/patrolpoint/list', data)
}
/**
 *新增或者修改巡检巡检点
 *addOrUpdatepatrolPoint
 */
export function addOrUpdatepatrolPoint (data) {
  return http.Post(headerUrl + '/patrolpoint/save', data)
}

/**
 *查询单个巡检点数据
 *patrolpointInfo
 */
export function patrolpointInfo (data) {
  return http.Get(headerUrl + '/patrolpoint/info', data)
}
/**
 *删除巡检点
 * patrolPointDelete
 */
export function patrolPointDelete (data) {
  return http.Post(headerUrl + '/patrolpoint/delete', data)
}
/**
 *巡检点重排序
 * patrolpointReorder
 */
export function patrolpointReorder (data) {
  return http.Post(headerUrl + '/patrolpoint/reorder', data)
}
/**
 *获取任务全部信息
 *patroltaskInfoAll
 */
export function patroltaskInfoAll (data) {
  return http.Get(headerUrl + '/patroltask/infoAll', data)
}

/**
 *巡检任务发起通过审批,变为已发布
 *patroltaskPublish
 */
export function patroltaskPublish (data) {
  return http.Post(headerUrl + '/patroltask/publish', data)
}
/**
 *巡检任务发起通过审批,变为已发布
 *patroltaskAudit
 */
export function patroltaskAudit (data) {
  return http.Post(headerUrl + '/patroltask/audit', data)
}
// ==========================巡检管理 end========================
