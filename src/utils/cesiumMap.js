/*
 * @Descripttion:
 * @version:
 * @Author: Mr.What
 * @Date: 2019-12-27 15:24:43
 * @LastEditors  : Mr.What
 * @LastEditTime : 2019-12-31 12:06:24
 */
// ----------------------------------ðððç»çº¬åº¦è½¬æ¢ððð--------------------------------
export function translateXyToLnglat (x, y) {
  // wgs84åæ ä¸
  let param1 = (2 * Math.PI * 6378137 / 360) // ç»åº¦ä¸åº¦å¯¹åºçç±³

  let cesiumLocTransParams = window.SITE_CONFIG['cesiumLocTransParams']

  var angel = cesiumLocTransParams.angel // æµéçæ­£ä¸æ¹éæ¶éæè½¬angelè§åº¦è¾¾å°æ­£åæ¹å
  let lat = cesiumLocTransParams.lat - x * Math.sin(angel / 180 * Math.PI) / param1 - y * Math.cos(angel / 180 * Math.PI) / param1 // çº¬åº¦
  let lon = cesiumLocTransParams.lon + x * Math.cos(angel / 180 * Math.PI) / (param1 * Math.cos(lat)) * cesiumLocTransParams.pA - y * Math.sin(angel / 180 * Math.PI) / (param1 * Math.cos(lat)) * cesiumLocTransParams.pB // ç»åº¦

  return {
    x: lon,
    y: lat
  }
}

// ----------------------------------ðððå´æ åæ è½¬æ¢ððð----------------------------------
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
