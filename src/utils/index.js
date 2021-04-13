import Vue from 'vue'
import router from '@/router'
import store from '@/store'

/**
 * 获取uuid
 */
export function getUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    return (c === 'x' ? (Math.random() * 16 | 0) : ('r&0x3' | '0x8')).toString(16)
  })
}

/**
 * 是否有权限
 * @param {*} key
 */
export function isAuth (key) {
  return JSON.parse(sessionStorage.getItem('permissions') || '[]').indexOf(key) !== -1 || false
}

/**
 * 树形数据转换
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate (data, id = 'id', pid = 'parentId') {
  let res = []
  let temp = {}
  // console.log(data)
  for (let i = 0; i < data.length; i++) {
    // console.log(data[i])
    temp[data[i][id]] = data[i]
  }
  // console.log(temp)
  for (let k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['children']) {
        temp[data[k][pid]]['children'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['children'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  console.log(res)
  return res
}
/**
 * 树形数据转换2 - zone
 * @param {*} data
 * @param {*} id
 * @param {*} pid
 */
export function treeDataTranslate2 (data, id = 'id', pid = 'parentId') {
  var res = []
  var temp = {}
  data = [data]
  for (var i = 0; i < data.length; i++) {
    temp[data[i][id]] = data[i]
  }
  console.log(data)
  for (var k = 0; k < data.length; k++) {
    if (temp[data[k][pid]] && data[k][id] !== data[k][pid]) {
      if (!temp[data[k][pid]]['subregion']) {
        temp[data[k][pid]]['subregion'] = []
      }
      if (!temp[data[k][pid]]['_level']) {
        temp[data[k][pid]]['_level'] = 1
      }
      data[k]['_level'] = temp[data[k][pid]]._level + 1
      temp[data[k][pid]]['subregion'].push(data[k])
    } else {
      res.push(data[k])
    }
  }
  console.log(res)
  return res
}

/**
 * 清除登录信息
 */
export function clearLoginInfo () {
  Vue.cookie.delete('token')
  store.commit('resetStore')
  router.options.isAddDynamicMenuRoutes = false
}

/**
 * 全屏事件
 */
export function handleFullScreen () {
  let element = document.documentElement
  if (this.fullscreen) {
    if (document.exitFullscreen) {
      document.exitFullscreen()
    } else if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen()
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen()
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen()
    }
  } else {
    if (element.requestFullscreen) {
      element.requestFullscreen()
    } else if (element.webkitRequestFullScreen) {
      element.webkitRequestFullScreen()
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen()
    } else if (element.msRequestFullscreen) {
      // IE11
      element.msRequestFullscreen()
    }
  }
}
/**
 * 获得时间差,时间格式为 年-月-日 小时:分钟:秒 或者 年/月/日 小时：分钟：秒
 * 其中，年月日为全格式，例如 ： 2010-10-12 01:00:00
 * 返回精度为：秒，分，小时，天
 * eg:
 * var testDate = new Date()
 * var testStr = testDate.format("yyyy-MM-dd hh:mm:ss")
 * var result = GetDateDiff("2010-02-26 16:00:00", testStr, "day");
 * document.write("两者时间差为：" + result + "天了。");
 */
export function getDateDiff (startTime, endTime, diffType) {
  // 将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
  // not eslint
  startTime = startTime.replace(/-/g, '/')
  endTime = endTime.replace(/-/g, '/')

  // 将计算间隔类性字符转换为小写
  diffType = diffType.toLowerCase()
  let sTime = new Date(startTime)      // 开始时间
  let eTime = new Date(endTime)  // 结束时间
  // 作为除数的数字
  let divNum = 1
  switch (diffType) {
    case 'second':
      divNum = 1000
      break
    case 'minute':
      divNum = 1000 * 60
      break
    case 'hour':
      divNum = 1000 * 3600
      break
    case 'day':
      divNum = 1000 * 3600 * 24
      break
    default:
      break
  }
  return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum))
}
