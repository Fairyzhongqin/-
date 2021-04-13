/**
 * 生产环境
 */
;
(function () {
  window.SITE_CONFIG = {}
  window.SITE_CONFIG['mapModelName'] = 'jylsdAll' // 地图模型名称
  window.SITE_CONFIG['cesium3DTiles'] = 'http://192.168.0.215:8080' // 倾斜摄影瓦片地址
  window.SITE_CONFIG['cesiumLocTransParams'] = {
    angel: 37.43, // 偏移角度
    lat: 31.9455795, // 纬度偏移量
    lon: 120.09299622, // 经度偏移量
    pA: 1.041,
    pB: 1.037
  }

  // api接口请求地址
  window.SITE_CONFIG['baseUrl'] = 'http://192.168.0.193:9003'

  // cdn地址 = 域名 + 版本号
  window.SITE_CONFIG['domain'] = './' // 域名
  window.SITE_CONFIG['version'] = '' // 版本号(年月日时分)
  window.SITE_CONFIG['cdnUrl'] = window.SITE_CONFIG.domain + window.SITE_CONFIG.version
})()
