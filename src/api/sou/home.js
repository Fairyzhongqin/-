/**
 * Author: crain
 * Date: 2018/01/23
 * Description:
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios

/**
 * 企业基本信息
 * homeInfo
 */
export function homeInfo (data) {
  return http.Get('/spring-souweb/baseInfo/info', data)
}
/**
 * 企业基本信息更改
 * homeUpdate
 */
export function homeUpdate (data) {
  return http.Post('/spring-souweb/baseInfo/update', data)
}
