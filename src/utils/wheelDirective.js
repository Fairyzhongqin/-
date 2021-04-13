/*
 * @Descripttion: 横向滚动
 * @version:
 * @Author: Mr.What
 * @Date: 2019-11-20 11:32:50
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-11-21 10:25:59
 */
'use strict'
exports.__esModule = true
var WheelDirective = /** @class */ (function () {
  function WheelDirective (nativeElement) {
    var _this = this
    this.scroll = function (event) {
      if (_this.el.clientWidth >= _this.el.scrollWidth) {
        return
      }
      event.preventDefault()
      _this.el.scrollLeft +=
        event.deltaY / 5
        ? event.deltaY / 5
        : event.detail && event.detail !== 0
        ? event.detail
        : -event.wheelDelta
    }
    this.el = nativeElement
    this.handleWheelEvent()
  }
  WheelDirective.prototype.handleWheelEvent = function () {
    var event = window.addEventListener ? 'addEventListener' : 'attachEvent'
    var wheel = ''
    if ('onmousewheel' in this.el) {
      wheel = 'mousewheel'
    } else if ('onwheel' in this.el) {
      wheel = 'wheel'
    } else if ('attachEvent' in window) {
      wheel = 'onmousewheel'
    } else {
      wheel = 'DOMMouseScroll'
    }
    this.el[event](wheel, this.scroll)
  }
  return WheelDirective
})()
exports.WheelDirective = WheelDirective
