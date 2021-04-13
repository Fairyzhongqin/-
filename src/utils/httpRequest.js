import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import merge from 'lodash/merge'
import '@/element-ui' // api: https://github.com/ElemeFE/element
import '@/element-ui-theme'

import {
  clearLoginInfo
} from '@/utils'
import {
  diff
} from '@/utils/validate'

// 获取匹对缓存数据
function getCache (url, data) {
  // 获取缓存数据
  let requestCache = JSON.parse(sessionStorage.getItem('requestCache') || '[]')
  let list = []
  requestCache.map((value) => {
    if (value.api === url && diff(value.echartsRequestDate, data)) list.push(value.data)
  })
  return list
}

const http = axios.create({
  timeout: 1000 * 60,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json; charset=utf-8'
  }
})
/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  config.headers['token'] = Vue.cookie.get('token') // 请求头带上token
  return config
}, err => {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '错误请求'
        break
      case 401:
        err.message = '未授权，请重新登录'
        break
      case 403:
        err.message = '拒绝访问'
        break
      case 404:
        err.message = '请求错误,未找到该资源'
        break
      case 405:
        err.message = '请求方法未允许'
        break
      case 408:
        err.message = '请求超时'
        break
      case 413:
        err.message = '请求实体太大'
        break
      case 500:
        err.message = '服务器端出错'
        break
      case 501:
        err.message = '网络未实现'
        break
      case 502:
        err.message = '网络错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网络超时'
        break
      case 505:
        err.message = 'http版本不支持该请求'
        break
      default:
        err.message = `连接错误${err.response.status}`
    }
  } else {
    err.message = '连接到服务器失败'
  }
  return Promise.reject(err)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, token失效
    clearLoginInfo() // 清空登录信息
    router.push({
      name: 'login'
    })
  }
  return response
}, error => {
  // token无效 跳转登录页面
  if (error.response && error.response.data && error.response.data.message === 'token无效') {
    clearLoginInfo() // 清空登录信息
    // Vue.prototype.$message.error('会话超时！请重新登陆')
    router.push({
      name: 'login'
    })
    return Promise.resolve({
      code: 401
    })
  } else {
    return Promise.reject(error)
  }
})

/**
 * 请求地址处理
 * @param {*} actionName action方法名称
 */
http.adornUrl = (actionName) => {
  // 非生产环境 && 开启代理, 接口前缀统一使用[/proxyApi/]前缀做代理拦截!
  return (process.env.NODE_ENV !== 'production' && process.env.OPEN_PROXY ? '/proxyApi/' : window.SITE_CONFIG.baseUrl) + actionName
}

/**
 * get请求参数处理
 * @param {*} params 参数对象
 * @param {*} openDefultParams 是否开启默认参数?
 */
http.adornParams = (params = {}, openDefultParams = true) => {
  var defaults = {
    't': new Date().getTime()
  }
  return openDefultParams ? merge(defaults, params) : params
}

/**
 * post请求数据处理
 * @param {*} data 数据对象
 * @param {*} openDefultdata 是否开启默认数据?
 * @param {*} contentType 数据格式
 *  json: 'application/json; charset=utf-8'
 *  form: 'application/x-www-form-urlencoded; charset=utf-8'
 */
http.adornData = (data = {}, openDefultdata = true, contentType = 'json') => {
  var defaults = {
    't': new Date().getTime()
  }
  data = openDefultdata ? merge(defaults, data) : data
  return contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
}

/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

http.Get = (url, params = {}) => {
  let list = getCache(url, params) // 获取匹对缓存list
  if (list.length && list[0] !== undefined) {
    return new Promise((resolve, reject) => {
      resolve({
        data: list[0]
      })
    })
  } else {
    return new Promise((resolve, reject) => {
      http.get(http.adornUrl(url), {
        params: params
      })
        .then(response => {
          response.data['url'] = url
          resolve(response)
        })
        .catch(err => {
          reject(err)
        })
    })
  }
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

http.Post = (url, data = {}, contentType = 'json') => {
  return new Promise((resolve, reject) => {
    data = contentType === 'json' ? JSON.stringify(data) : qs.stringify(data)
    let contentTypes = contentType === 'json' ? 'application/json; charset=utf-8' : 'application/x-www-form-urlencoded; charset=utf-8'
    http.post(http.adornUrl(url), data, {
      headers: {
        'Content-Type': contentTypes
      }
    }).then(response => {
      resolve(response)
    }, err => {
      reject(err)
    })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

http.Patch = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    http.patch(http.adornUrl(url), data)
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

http.Put = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    http.put(http.adornUrl(url), data)
      .then(response => {
        resolve(response)
      }, err => {
        reject(err)
      })
  })
}

export default http
