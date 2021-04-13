/**
 * Author: crain
 * Date: 2018/11/07
 * Description:
 *  常用公共方法封装
 */

/**
 * 驼峰转连字符 '_'
 * @param {*} s
 */
export function isBlank (s) {
  return s.replace(/([A-Z])/g, '_$1').toLowerCase()
}
/**
 * 格式化时间
 * @param {*} formater, t
 * eg:
 *  dateFormater('YYYY-MM-DD HH:mm', t) ==> 2019-06-26 18:30
 *  dateFormater('YYYY-MM-DD HH:mm:ss', t) ==> 2019-06-26 18:30:22
 *  dateFormater('YYYYMMDDHHmm', t) ==> 201906261830
 */
export function dateFormater (formater, t) {
  let date = t ? new Date(t) : new Date()
  let Y = date.getFullYear() + ''
  let M = date.getMonth() + 1
  let D = date.getDate()
  let H = date.getHours()
  let m = date.getMinutes()
  let s = date.getSeconds()
  let ms = date.getMilliseconds()
  return formater.replace(/YYYY|yyyy/g, Y)
    .replace(/YY|yy/g, Y.substr(2, 2))
    .replace(/MM/g, (M < 10 ? '0' : '') + M)
    .replace(/DD/g, (D < 10 ? '0' : '') + D)
    .replace(/HH|hh/g, (H < 10 ? '0' : '') + H)
    .replace(/mm/g, (m < 10 ? '0' : '') + m)
    .replace(/ss/g, (s < 10 ? '0' : '') + s)
    .replace(/ms/g, (ms.toString().padStart(3, '0')))
}
/**
 * 全屏
 * @param {*}
 *
 */
export function toFullScreen () {
  let elem = document.body
  elem.webkitRequestFullScreen
    ? elem.webkitRequestFullScreen()
    : elem.mozRequestFullScreen
    ? elem.mozRequestFullScreen()
    : elem.msRequestFullscreen
      ? elem.msRequestFullscreen()
      : elem.requestFullScreen
        ? elem.requestFullScreen()
        : alert('浏览器不支持全屏')
}
/**
 * 退出全屏
 * @param {*}
 *
 */
export function exitFullscreen () {
  let elem = parent.document
  elem.webkitCancelFullScreen
    ? elem.webkitCancelFullScreen()
    : elem.mozCancelFullScreen
    ? elem.mozCancelFullScreen()
    : elem.cancelFullScreen
      ? elem.cancelFullScreen()
      : elem.msExitFullscreen
        ? elem.msExitFullscreen()
        : elem.exitFullscreen
          ? elem.exitFullscreen()
          : alert('切换失败,可尝试Esc退出')
}
