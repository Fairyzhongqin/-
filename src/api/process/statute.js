/**
 * Description:法律法规知识库
 */
import http from '@/utils/httpRequest' // api: https://github.com/axios/axios
let headerUrl = '/spring-processweb'
// ============================ 法律法规知识库  start ======================
/**
 * 新增或修改法律法规知识库
 * statuteAddOrUpdate
 */
export function statuteAddOrUpdate (data) {
  if (data.id) {
    return http.Post(headerUrl + '/processSatute/update', data)
  } else {
    return http.Post(headerUrl + '/processSatute/add', data)
  }
}
/**
 * 分页查询所有的法律法规知识库
 * statuteList
 */
export function statuteList (data) {
  return http.Get(headerUrl + '/processSatute/list', data)
}
/**
 * 法律法规知识库-删除
 * statuteDelete
 */
export function statuteDelete (data) {
  return http.Post(headerUrl + '/processSatute/delete', data)
}
/**
 * 获取单个法律法规知识库
 * statuteInfo
 */
export function statuteInfo (data) {
  return http.Get(headerUrl + '/processSatute/info', data)
}
// ============================ 法律法规知识库  end =======================
