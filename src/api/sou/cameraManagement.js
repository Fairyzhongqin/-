/*
 * @Descripttion:
 * @version:
 * @Author: Mr.What
 * @Date: 2019-11-20 00:04:25
 * @LastEditors  : Mr.What
 * @LastEditTime : 2019-12-20 17:17:15
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-souweb'
/**
 * 摄像头管理分页查询
 * cameraList
 */
export function cameraList (data) {
  return http.Get(headerUrl + '/camera/list', data)
}
/**
 * 查询所有的摄像头
 * cameraFindAllList
 */
export function cameraFindAllList (data) {
  return http.Get(headerUrl + '/camera/findAllList', data)
}
/**
 * 摄像头管理新增
 * cameraList
 */
export function cameraAddOrUpdate (data) {
  console.log(data)
  if (data.id) {
    return http.Post(headerUrl + '/camera/update', data)
  } else {
    return http.Post(headerUrl + '/camera/add', data)
  }
}
/**
 * 摄像头单个数据
 * cameraList
 */
export function cameraInfo (data) {
  return http.Get(headerUrl + '/camera/info', data)
}
/**
 * 删除摄像头
 * cameraDelete
 */
export function cameraDelete (data) {
  return http.Post(headerUrl + '/camera/delete', data)
}
/**
 * 获取摄像头信道
 * cameraDelete
 */
export function alecateChannel (data) {
  return http.Get(headerUrl + '/camera/alecateChannel', data)
}

/**
 * 获取摄像头码流地址
 * cameraDelete
 */
export function cameraUrlTrans (data) {
  return http.Get(headerUrl + '/camera/playCamera', data)
}
