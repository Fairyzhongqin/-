import yellomao from '@/assets/img/iconMaoChe/yellomao.png'
import redmao from '@/assets/img/iconMaoChe/redmao.png'
import bluemao from '@/assets/img/iconMaoChe/bluemao.png'
import whitemao from '@/assets/img/iconMaoChe/whitemao.png'
import car from '@/assets/img/iconMaoChe/car.png'
import van from '@/assets/img/iconMaoChe/van.png'
export default {
  namespaced: true,
  state: {
    // 页面文档可视高度(随窗口改变大小)
    documentClientHeight: 0,
    // 导航条, 布局风格, defalut(默认) / inverse(反向)
    navbarLayoutType: 'inverse',
    // 侧边栏, 布局皮肤, light(浅色) / dark(黑色)
    sidebarLayoutSkin: 'dark',
    // 侧边栏, 折叠状态
    sidebarFold: false,
    // 侧边栏, 菜单
    menuList: [],
    menuActiveName: '',
    // 内容, 是否需要刷新
    contentIsNeedRefresh: false,
    // 主入口标签页
    mainTabs: [],
    // 系统切换弹出毛玻璃效果
    siteWrapperFilter: false, // site-wrapper-filter
    mainTabsActiveName: '',
    navFlag: '0', // 系统flag值, 0:人员在岗在位系统, 1:重大危险源监测预警系统, 2:安全风险分区管理系统, 3:企业生产全流程管理系统, 4:3D地图,  5:全景地图
    navFlagName: '人员在岗在位',
    personTypeIcon: [{
      value: yellomao,
      icon: '0',
      name: '小黄帽'
    }, {
      value: redmao,
      icon: '1',
      name: '小红帽'
    }, {
      value: bluemao,
      icon: '2',
      name: '小蓝帽'
    }, {
      value: whitemao,
      icon: '3',
      name: '小白帽'
    }], // 人员图标
    vehiceIcon: [{
      value: car,
      icon: '0',
      name: '小轿车'
    }, {
      value: van,
      icon: '1',
      name: '小货车'
    }], // 车辆图标
    mainmodelFlag: 0 // 模式 0：管理模式 1：视图模式 2：驾驶舱模式
  },
  mutations: {
    UploadsiteWrapperFilter (state, blooen) {
      state.siteWrapperFilter = blooen
    },
    updateMainmodelFlag (state, flag) {
      state.mainmodelFlag = Number(flag)
    },
    updatedNavbarFlag (state, flag) {
      state.navFlag = flag
      switch (flag) {
        case '0':
          state.navFlagName = '人员在岗在位'
          break
        case '1':
          state.navFlagName = '重大危险源监测'
          break
        case '2':
          state.navFlagName = '安全风险分区'
          break
        case '3':
          state.navFlagName = '企业生产全流程'
          break
        case '4':
          state.navFlagName = '3D地图'
          break
        case '5':
          state.navFlagName = '全景地图'
          break
      }
    },
    updateDocumentClientHeight (state, height) {
      state.documentClientHeight = height
    },
    updateNavbarLayoutType (state, type) {
      state.navbarLayoutType = type
    },
    updateSidebarLayoutSkin (state, skin) {
      state.sidebarLayoutSkin = skin
    },
    updateSidebarFold (state, fold) {
      state.sidebarFold = fold
    },
    updateMenuList (state, list) {
      state.menuList = list
    },
    updateMenuActiveName (state, name) {
      state.menuActiveName = name
    },
    updateContentIsNeedRefresh (state, status) {
      state.contentIsNeedRefresh = status
    },
    updateMainTabs (state, tabs) {
      state.mainTabs = tabs
    },
    updateMainTabsActiveName (state, name) {
      state.mainTabsActiveName = name
    }
  }
}
