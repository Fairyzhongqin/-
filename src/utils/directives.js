/*
 * @Descripttion:
 * @version:
 * @Author: Mr.What
 * @Date: 2019-12-27 15:24:43
 * @LastEditors  : Mr.What
 * @LastEditTime : 2020-01-03 10:26:58
 */
/* eslint-disable no-useless-escape */
import Vue from 'vue'
import waves from './waves/waves'

// v-dialogDrag: 弹窗拖拽属性
Vue.directive('dialogDrag', {
  bind (el) {
    handle(el, 'bind')
  },
  componentUpdated (el) {
    if (loadDialogDragStatus) return
    setTimeout(() => { // 延迟几秒等子节点加载完再执行 这里用不了nextTick 用setTimeOut代替
      handle(el, 'componentUpdated')
    }, 2000)
  }
})
let loadDialogDragStatus = false // 如果bind时已经绑定上指令则为true 让componentUpdated失效
const handle = (el, type) => {
  const dialogHeaderEl = el.querySelector('.el-dialog__header') || el.querySelector('.enable-drag')
  const dragDom = el.querySelector('.el-dialog') || el.querySelector('.drag-window') || el

  if (!dialogHeaderEl) {
    return
  } else if (type === 'bind') {
    loadDialogDragStatus = true
  }

  dialogHeaderEl.style.cssText += ';cursor:move;'
  // dragDom.style.cssText += ';top:0px;'

  // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
  const sty = (() => {
    if (window.document.currentStyle) {
      return (dom, attr) => dom.currentStyle[attr]
    } else {
      return (dom, attr) => getComputedStyle(dom, false)[attr]
    }
  })()

  dialogHeaderEl.onmousedown = e => {
    // 鼠标按下，计算当前元素距离可视区的距离
    const disX = e.clientX - dialogHeaderEl.offsetLeft
    const disY = e.clientY - dialogHeaderEl.offsetTop

    const screenWidth = document.body.clientWidth // body当前宽度
    const screenHeight = document.documentElement.clientHeight // 可见区域高度(应为body高度，可某些环境下无法获取)

    const dragDomWidth = dragDom.offsetWidth // 对话框宽度
    const dragDomheight = dragDom.offsetHeight // 对话框高度

    const minDragDomLeft = dragDom.offsetLeft
    const maxDragDomLeft = screenWidth - dragDom.offsetLeft - dragDomWidth

    const minDragDomTop = dragDom.offsetTop
    const maxDragDomTop = screenHeight - dragDom.offsetTop - dragDomheight

    // 获取到的值带px 正则匹配替换
    let styL = sty(dragDom, 'left')
    let styT = sty(dragDom, 'top')

    // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
    if (styL.includes('%')) {
      styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
      styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
    } else {
      styL = +styL.replace(/\px/g, '')
      styT = +styT.replace(/\px/g, '')
    }

    document.onmousemove = function (e) {
      // 通过事件委托，计算移动的距离
      let left = e.clientX - disX
      let top = e.clientY - disY

      // 边界处理
      if (-left > minDragDomLeft) {
        left = -minDragDomLeft
      } else if (left > maxDragDomLeft) {
        left = maxDragDomLeft
      }

      if (-top > minDragDomTop) {
        top = -minDragDomTop
      } else if (top > maxDragDomTop) {
        top = maxDragDomTop
      }

      // 移动当前元素
      dragDom.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
    }

    document.onmouseup = function (e) {
      document.onmousemove = null
      document.onmouseup = null
    }
  }
}

// 按钮水波纹
Vue.directive('waves', waves)
