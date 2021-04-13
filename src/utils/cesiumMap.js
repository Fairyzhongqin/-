/*
 * @Descripttion:
 * @version:
 * @Author: Mr.What
 * @Date: 2019-12-27 15:24:43
 * @LastEditors  : Mr.What
 * @LastEditTime : 2019-12-31 12:06:24
 */
// ----------------------------------👇👇👇经纬度转换👇👇👇--------------------------------
export function translateXyToLnglat (x, y) {
  // wgs84坐标下
  let param1 = (2 * Math.PI * 6378137 / 360) // 经度一度对应的米

  let cesiumLocTransParams = window.SITE_CONFIG['cesiumLocTransParams']

  var angel = cesiumLocTransParams.angel // 测量的正上方逆时针旋转angel角度达到正北方向
  let lat = cesiumLocTransParams.lat - x * Math.sin(angel / 180 * Math.PI) / param1 - y * Math.cos(angel / 180 * Math.PI) / param1 // 纬度
  let lon = cesiumLocTransParams.lon + x * Math.cos(angel / 180 * Math.PI) / (param1 * Math.cos(lat)) * cesiumLocTransParams.pA - y * Math.sin(angel / 180 * Math.PI) / (param1 * Math.cos(lat)) * cesiumLocTransParams.pB // 经度

  return {
    x: lon,
    y: lat
  }
}

// ----------------------------------👇👇👇围栏坐标转换👇👇👇----------------------------------
export function getPointer (val) {
  let points = []
  val.split(')||(').map((val1, index) => {
    if (index <= 0) {
      points.push(translateXyToLnglat(val1.split(',')[0].split('(')[1], val1.split(',')[1]))
    } else if (index >= val.split(')||(').length - 1) {
      points.push(translateXyToLnglat(val1.split(',')[0], val1.split(',')[1].split(')')[0]))
    } else {
      points.push(translateXyToLnglat(val1.split(',')[0], val1.split(',')[1]))
    }
  })
  return points
}
