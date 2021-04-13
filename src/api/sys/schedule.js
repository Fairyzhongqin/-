/**
 * Author: crain
 * Date: 2019/9/23
 * Description: 定时任务
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-sysweb'
// headerUrl = ''
/**
 * 定时任务 - 清空
 * scheduleClean
 * params：
 */
export function scheduleClean (data) {
  return http.Post(headerUrl + '/sys/scheduleLog/clean', data)
}
