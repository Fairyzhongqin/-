/*
 * @Descripttion:
 * @version:
 * @Author: Mr.What
 * @Date: 2019-08-31 19:07:13
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-11-11 20:52:25
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios

/**
 * 登陆信息
 * configList
 */
export function configList (data) {
  return http.Get('/sys/config/list', data)
}

/**
 * 查询地图参数
 */
export function getMapConfig (data) {
  return http.Get('/spring-sysweb/sys/config/list', data)
}

/**
 * 保存地图参数
 */
export function saveMapConfig (data) {
  return http.Post('/spring-sysweb/sys/config/save', data)
}
