/**
 * 字体图标, 统一使用SVG Sprite矢量图标(http://www.iconfont.cn/）
 *
 * 使用:
 *  1. 在阿里矢量图标站创建一个项目, 并添加图标(这一步非必须, 创建方便项目图标管理)
 *  2-1. 添加icon, 选中新增的icon图标, 复制代码 -> 下载 -> SVG下载 -> 粘贴代码(重命名)
 *  2-2. 添加icons, 下载图标库对应[iconfont.js]文件, 替换项目[./iconfont.js]文件
 *  3. 组件模版中使用 [<IconSvg name="canyin"></IconSvg>]
 *
 * 注意:
 *  1. 通过2-2 添加icons, getNameList方法无法返回对应数据
 */
import Vue from 'vue'
import IconSvg from '@/components/IconSvg'
import './iconfont.js'

Vue.component('IconSvg', IconSvg)

// svg文件夹下所有svg文件
const svgFiles = require.context('./svg', true, /\.svg$/)
let iconList = svgFiles.keys().map(item => svgFiles(item))

// 危险标识
const alertIdentifier = require.context('./svg/alert-identifier', false, /\.svg$/)
let alertIdentifierList = alertIdentifier.keys().map(item => alertIdentifier(item))

// 菜单
const menuFiles = require.context('./svg/menu', false, /\.svg$/)
let menuList = menuFiles.keys().map(item => menuFiles(item))
export default {
  // 获取图标icon-(*).svg名称列表, 例如[shouye, xitong, zhedie, ...]
  getNameList () {
    let newIconList = []
    // 只获取'icon-'开头的SVG
    iconList.map(item => {
      if (item.default.id.indexOf('icon-') !== -1) {
        newIconList.push(item.default.id.replace('icon-', ''))
      }
    })
    return newIconList
  },
  // 获取[Menu]文件夹图标
  getMenuNameList () {
    let newIconList = []
    // 只获取'icon-'开头的SVG
    menuList.map(item => {
      if (item.default.id.indexOf('icon-') !== -1) {
        newIconList.push(item.default.id.replace('icon-', ''))
      }
    })
    return newIconList
  },
  // 获取[alertIdentifier]文件夹图标
  getAlertIdentifierNameList () {
    let newIconList = []
    // 只获取'icon-'开头的SVG
    alertIdentifierList.map(item => {
      if (item.default.id.indexOf('icon-') !== -1) {
        newIconList.push(item.default.id.replace('icon-', ''))
      }
    })
    return newIconList
  }
}
