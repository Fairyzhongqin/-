/**
 * Author: crain
 * Date: 2019/8/25
 * Description: 报警查看
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-posweb'

// *************************pos*******************************
/**
 * 分页查询所有的区域报警记录
 * getZonePerson
 */
export function getZonePerson (data) {
  return http.Get(headerUrl + '/hologrmap/getZonePerson', data)
}
/**
 * 目标跟踪
 * getPersonPosition
 */
export function getPersonPosition (data) {
  return http.Get(headerUrl + '/hologrmap/getPersonPosition', data)
}
/**
 * 获取设备坐标 0-卡口，1-信标，2-监控，3-基站
 * getDeveuiPosition
 */
export function getDeveuiPosition (data) {
  return http.Get(headerUrl + '/hologrmap/getDeveuiPosition', data)
}
/**
 * 获取人员/车辆坐标 0-人员，1-车辆
 * positionInit
 */
export function positionInit (data) {
  return http.Get(headerUrl + '/hologrmap/positionInit', data)
}
/**
 * 获取人员轨迹历史
 * getPersonTrail
 */
export function getPersonTrail (data) {
  return http.Get(headerUrl + '/hologrmap/getPersonTrail', data)
}

/**
 * 获取单个摄像头数据
 * hologrmapCamera
 */
export function hologrmapCamera (data) {
  return http.Get(headerUrl + '/hologrmap/info', data)
}

// *************************sou*******************************

/**
 * 获取储罐信息
 * storageInfo
 */
export function storageInfo (data) {
  return http.Get('/spring-souweb/tank/info', data)
}

export function dangerSource (data) {
  return http.Get('/spring-souweb/dangerSource/info', data)
}

// *************************risk*******************************

/**
 * 风险管控清单
 * controlShow
 */
export function controlShow (data) {
  return http.Get('/spring-riskweb/control/show', data)
}
/**
 * 风险辨识清单
 * identificationShow
 */
export function identificationShow (data) {
  return http.Get('/spring-riskweb/identification/show', data)
}
/**
 * 处置卡
 * /manageShow
 */
export function manageShow (data) {
  return http.Get('/spring-riskweb/manage/show', data)
}
/**
 * 应知卡
 * shouldknowShow
 */
export function shouldknowShow (data) {
  return http.Get('/spring-riskweb/shouldknow/show', data)
}
/**
 * 承诺卡
 * promiseShow
 */
export function promiseShow (data) {
  return http.Get('/spring-riskweb/promise/show', data)
}
/**
 * 查询区域承诺卡
 * zoneQueryProm
 */
export function zoneQueryProm (data) {
  return http.Get(headerUrl + '/zone/queryPromiseById', data)
}
