<template>
  <div>
    <aside :class="['site-sidebar',
  'site-sidebar--' + sidebarLayoutSkin,
  $route.path === '/map-page'?'site-sidebar--map':'']">
      <!-- @click="openDialog()" -->
      <div @click="sidebarFoldBind = !sidebarFoldBind" class="site-sidebar__header" style="cursor: pointer;">
        <a class="site-navbar__brand-lg fs18" href="javascript:;">
          <span class="iconSvg">
            <icon-svg name="iconshouqi1"></icon-svg>
          </span>
          <span>
            {{$store.state.common.navFlagName}}
          </span>
        </a>
        <a @click="sidebarFoldBind = !sidebarFoldBind" class="site-navbar__brand-mini" href="javascript:;"> <span style="font-size:20px;margin-left: 10px;">
            <el-tooltip class="item" effect="light" content="展开菜单栏" placement="bottom-start">
              <i @click.stop="sidebarFoldBind = !sidebarFoldBind">
                <icon-svg name='iconzhankai1'></icon-svg>
              </i>
            </el-tooltip>
          </span></a>
      </div>

      <!-- <div class="site-navbar__body clearfix">
        <img src="~@/assets/img/navbar_switch.png"
             class="navbar-switch"
             :class="sidebarFoldBind?'navbar-switch__fold':'navbar-switch__unfold'"
             />
      </div> -->

      <div class="site-sidebar__inner">
        <el-menu :default-active="menuActiveName || 'home'" :collapse="sidebarFold" :collapseTransition="false" :unique-opened="true" class="site-sidebar__menu">
          <!-- v-show="$store.state.common.navFlag == menu.flag || menu.id == '1'" -->

          <template v-if="$store.state.common.mainmodelFlag == 1">
            <sub-menu2 v-for="menu in menuList" :key="menu.menuId" :menu="menu" v-show="$store.state.common.navFlag == menu.flag" :dynamicMenuRoutes="dynamicMenuRoutes"></sub-menu2>
          </template>
          <template v-else>
            <sub-menu v-for="menu in menuList" :key="menu.menuId" :menu="menu" v-show="($store.state.common.navFlag == menu.flag || menu.id == '1')" :dynamicMenuRoutes="dynamicMenuRoutes">
            </sub-menu>
          </template>
          <!-- <el-submenu index="demo">
            <template slot="title">
              <IconSvg name="shoucang"
                        class="site-sidebar__menu-icon"></IconSvg>
              <span>demo</span>
            </template>
            <el-menu-item index="demo-components"
                          @click="$router.push({ name: 'demo-components' })">
              <IconSvg name="tubiao"
                        class="site-sidebar__menu-icon"></IconSvg>
              <span slot="title">components</span>
            </el-menu-item>
            <el-menu-item index="demo-echarts"
                          @click="$router.push({ name: 'demo-echarts' })">
              <IconSvg name="tubiao"
                        class="site-sidebar__menu-icon"></IconSvg>
              <span slot="title">echarts</span>
            </el-menu-item>
            <el-menu-item index="demo-ueditor"
                          @click="$router.push({ name: 'demo-ueditor' })">
              <IconSvg name="editor"
                        class="site-sidebar__menu-icon"></IconSvg>
              <span slot="title">ueditor</span>
            </el-menu-item>
          </el-submenu> -->
        </el-menu>
      </div>
    </aside>

    <!-- 弹窗，切换系统 -->
    <switch-system ref="switchSystem" @switchNavBar='switchNavBar'></switch-system>
  </div>
</template>

<script>
import eventBus from '@/bus/index'
import SubMenu from './main-sidebar-sub-menu'
import SubMenu2 from './main-sidebar-sub-menu2'
import SwitchSystem from './main-navbar-switch-system'
import { isURL } from '@/utils/validate'
export default {
  data () {
    return {
      dynamicMenuRoutes: [],
      switchSystemVisible: false,
      navName: { name: '人员在岗在位', flag: 0 }
    }
  },
  components: {
    SubMenu,
    SubMenu2,
    SwitchSystem
  },
  computed: {
    sidebarLayoutSkin: {
      get () { return this.$store.state.common.sidebarLayoutSkin }
    },
    sidebarFoldBind: {
      get () { return this.$store.state.common.sidebarFold },
      set (val) { this.$store.commit('common/updateSidebarFold', val) }
    },
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold }
    },
    menuList: {
      get () {
        return this.$store.state.common.menuList
      },
      set (val) { this.$store.commit('common/updateMenuList', val) }
    },
    menuActiveName: {
      get () { return this.$store.state.common.menuActiveName },
      set (val) { this.$store.commit('common/updateMenuActiveName', val) }
    },
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    },
    mainTabsActiveName: {
      get () { return this.$store.state.common.mainTabsActiveName },
      set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
    },
    mainmodelFlag: {
      get () { return this.$store.state.common.mainmodelFlag },
      set (val) { this.$store.commit('common/updateMainmodelFlag', val) }
    }
  },
  watch: {
    $route: 'routeHandle',
    sidebarFoldBind () {
      if (this.sidebarFoldBind === true) {
        eventBus.$emit('mainSidebarCoMapReside')
      }
    }
  },
  created () {
    this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
    this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
    this.routeHandle(this.$route)
  },
  beforeRouteLeave (to, from, next) {
    if (from === '/comMap') {
      this.mainmodelFlag = 0
      this.mainmodel = '管理模式'
      this.$store.commit('common/updatedNavbarFlag', this.$cookie.get('navFlag'))
    }
    next()
  },
  methods: {
    // 路由操作
    routeHandle (route) {
      if (route.meta.isTab) {
        // tab选中, 不存在先添加
        let tab = this.mainTabs.filter(item => item.name === route.name)[0]
        if (!tab) {
          if (route.meta.isDynamic) {
            route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0]
            if (!route) {
              return console.error('未能找到可用标签页!')
            }
          }
          tab = {
            menuId: route.meta.menuId || route.name,
            name: route.name,
            title: route.meta.title,
            type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
            iframeUrl: route.meta.iframeUrl || '',
            params: route.params,
            query: route.query,
            noClose: route.meta.noClose
          }
          this.mainTabs = this.mainTabs.concat(tab)
        }
        this.menuActiveName = tab.menuId + ''
        this.mainTabsActiveName = tab.name
      }
    },
    // 打开切换系统弹窗
    openDialog () {
      this.switchSystemVisible = true
      // this.$store.commit('common/updatedNavbarFlag', '1')
      this.$nextTick(() => {
        this.$refs.switchSystem.init()
      })
    },
    // 更改系统显示菜单
    switchNavBar (flag) {
    }
  }
}
</script>

<style lang="scss">
.site-sidebar {
  .site-sidebar__header {
    width: 100%;
    line-height: 40px;
    height: 40px;
    background-color: #373940;
    box-shadow: 0px 0px 0px 0px #373940, 0px 0px 0px 0px #373940,
      -23px 0px 15px 0px #2024288f inset, 0px 0px 0px 0px #373940;
    font-weight: 400;
    transition: 0.3s;
    // background-color: #23292f;
    font-weight: bold;
    transition: 0.3s;
    &:hover {
      // background: linear-gradient(90deg, #1273eb, #0099ff);
    }
  }
  .iconSvg {
    position: relative;
    top: 2px;
    margin-left: 15px;
    margin-right: 5px;
  }

  .navbar-switch {
    position: fixed;
    top: 50%;
    -webkit-transform: translate(0, -50%);
    transform: translate(0, -50%);
    width: 14px;
    height: 71px;
    cursor: pointer;
    // 展开
    &__unfold {
      left: 200px;
      -webit-transition: left 300ms ease;
      -moz-transition: left 300ms ease;
      -o-transition: left 300ms ease;
      -ms-transition: left 300ms ease;
      transition: left 300ms ease;
    }
    // 收缩
    &__fold {
      left: 63px;
      -webit-transition: left 280ms ease;
      -moz-transition: left 280ms ease;
      -o-transition: left 280ms ease;
      -ms-transition: left 280ms ease;
      transition: left 280ms ease;
    }
  }
}

.site-sidebar--map {
  background-color: #0000009e;
  .site-sidebar__menu {
    background-color: #0000009e !important;
    .el-submenu {
      .el-submenu__title {
        color: #fff !important;
        &:hover {
          // box-shadow: inset 0px 0px 20px 0px #006392;
          background-color: #0e4d7170 !important;
        }
      }
      .el-menu {
        background-color: #00253596;
      }
    }
  }
  .el-menu-item {
    color: #fff !important;
    &.is-active {
      background-color: #0e4d71b8 !important;
    }
    &:hover {
      background-color: #0e4d7170 !important;
    }
  }

  .el-submenu__title i {
    color: #fff;
  }
}
.el-submenu__title {
  font-size: 12px;
  padding-left: 12px !important;
  border-bottom: 1px solid #292b32;
  border-top: 1px solid #3d3f46;
  box-shadow: inset 0px 1px #353842;
}
.el-menu-item {
  font-size: 12px;
  height: 50px;
  line-height: 50px;
}
// 地图展示页菜单样式
.sidebar-map-page {
  .map-pages {
    font-size: 12px;
    padding-left: 12px !important;
    border-bottom: 1px solid #292b32;
    border-top: 1px solid #3d3f46;
    box-shadow: inset 0px 1px #353842;
  }
}
.site-sidebar--dark .site-sidebar__menu.el-menu .el-menu,
.site-sidebar--dark .site-sidebar__menu.el-menu .el-submenu.is-opened,
.site-sidebar--dark > .el-menu--popup .el-menu,
.site-sidebar--dark > .el-menu--popup .el-submenu.is-opened,
.site-sidebar--dark-popper .site-sidebar__menu.el-menu .el-menu,
.site-sidebar--dark-popper .site-sidebar__menu.el-menu .el-submenu.is-opened,
.site-sidebar--dark-popper > .el-menu--popup .el-menu,
.site-sidebar--dark-popper > .el-menu--popup .el-submenu.is-opened {
  // background-color: #333c4c;
}
.site-sidebar--dark .site-sidebar__menu.el-menu {
  background-color: transparent;
}
.is-opened {
  .site-sidebar__menu-icon {
    color: white !important;
    font-size: 20px;
  }
  .el-submenu__title {
    span {
      color: white;
    }
    .el-submenu__icon-arrow {
      color: white;
    }
  }
}
.site-sidebar__menu-icon {
  // font-size: 20px;
}

.sidebar-map-page {
  .el-menu-item {
    height: 50px;
    line-height: 50px;
  }
}
</style>
