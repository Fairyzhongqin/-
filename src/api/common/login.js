/**
 * Author: crain
 * Date: 2018/01/23
 * Description:
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-sysweb'
// headerUrl = ''
/**
 * 登陆
 * login
 */
export function login (data) {
  return http.Post(headerUrl + '/sys/login', data)
}
/**
 * 登出
 * login
 */
export function logout (data) {
  return http.Post(headerUrl + '/sys/logout', data)
}
/**
 * 登陆信息
 * menhuAuth
 */
export function menhuAuth (data) {
  return http.Post(headerUrl + '/spz/menhuAuth', data, 'form')
}
