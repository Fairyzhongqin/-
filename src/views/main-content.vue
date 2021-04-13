<template>
  <main class="site-content"
        :class="{ 'site-content--tabs': $route.meta.isTab && $route.path !== '/map-page',
        'site-content--map': $route.path === '/map-page',
        'site-content--threemap': $route.path === '/comMap'}"
        :style="$route.path === '/comMap' ? 'padding:40px 0 0 ' : ''">
    <!-- 主入口标签页 s -->
    <el-tabs v-if="$route.meta.isTab  && $route.path !== '/map-page'"
             v-model="mainTabsActiveName"
             class="site-content-tabs"
             type="border-card"
             @tab-click="selectedTabHandle"
             @tab-remove="removeTabHandle">

      <!-- <el-dropdown class="site-tabs__tools"
                   :show-timeout="0">
        <i class="el-icon-arrow-down el-icon--right"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="tabsCloseCurrentHandle">关闭当前标签页</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseOtherHandle">关闭其它标签页</el-dropdown-item>
          <el-dropdown-item @click.native="tabsCloseAllHandle">关闭全部标签页</el-dropdown-item>
          <el-dropdown-item @click.native="refresh()">刷新当前标签页</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown> -->
      <el-tab-pane v-for="item in mainTabs"
                   :key="item.name"
                   :label="item.title"
                   :name="item.name"
                   :closable="!item.noClose">
        <el-card id="icard-body-all"
                 :body-style="siteContentViewHeight"
                 v-if="$route.path !== '/comMap'">
          <iframe v-if="item.type === 'iframe'"
                  :src="item.iframeUrl"
                  width="100%"
                  height="100%"
                  frameborder="0"
                  scrolling="yes">
          </iframe>
          <keep-alive v-else>
            <router-view v-if="item.name === mainTabsActiveName" />
          </keep-alive>
        </el-card>
      </el-tab-pane>
    </el-tabs>
    <!-- 主入口标签页 e -->
    <el-card v-if="(!$route.meta.isTab) && ($route.path !== '/map-page')"
             :body-style="siteContentViewHeight"
             :class="{'el-card-map': $route.path === '/comMap'}">
      <keep-alive>
        <router-view />
      </keep-alive>
    </el-card>
    <!-- 主入口标签页 倾斜摄影地图 -->
    <el-row v-if="$route.path === '/map-page'"
            class="map-content">
      <router-view />
    </el-row>

    <div class="el-drown-right-one"
         v-if="$route.name != 'map-page'">
      <!--<el-menu-->
        <!--class="site-navbar__menu el-dropdwn-one "-->
        <!--mode="horizontal">-->
        <!--<el-menu-item index="2">-->
          <!--<IconSvg name="shezhi" class="el-icon-setting"></IconSvg>-->
          <!--<a href="javascript:;" @click.native="routerPathName('2')">驾驶舱模式</a>-->
        <!--</el-menu-item>-->
      <!--</el-menu>-->
      <el-dropdown trigger="click" class="el-dropdwn-one">
        <span class="el-dropdown-link-indexOne" style="color:#fff;padding: 10px 8px 11px 10px;margin:0;">
          <icon-svg name='iconxccc' style="font-size:16px;position: relative;top: 2px;"></icon-svg>
          {{$store.state.common.mainmodelFlag == 0 ? '管理模式' : $store.state.common.mainmodelFlag == 1 ? '视图模式' : '驾驶舱模式'}}<i class="el-icon-caret-bottom el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="el-dropdwn-list">
          <el-dropdown-item @click.native="routerPath('0')">管理模式</el-dropdown-item>
          <el-dropdown-item @click.native="routerPath('1')">视图模式</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-dropdown trigger="click" class="el-dropdwn-two">
        <span class="el-dropdown-link">
          <img style="width:28px" src="~@/assets/img/avatar.png" alt="#">
          <span style="color:#fff;position: relative;top: 2px;">{{userName}}</span>
          <i class="el-icon-caret-bottom el-icon--right" style="font-size: 12px;color: #fff;margin-left: -2px;position: relative;top: 2px;"></i>
        </span>
        <el-dropdown-menu slot="dropdown" class="el-dropdwn-list">
          <el-dropdown-item @click.native="routerPathName('0')">我的消息</el-dropdown-item>
          <el-dropdown-item @click.native="routerPathName('1')">修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="routerPathName('2')">驾驶舱模式</el-dropdown-item>
          <el-dropdown-item class="el-dropdwon-login"
                            @click.native="routerPathName('3')">退出登录</el-dropdown-item>
          <!-- <el-dropdown-item @click.native="routerPath('2')">驾驶舱模式</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <el-popover placement="bottom"
                  width="100"
                  class="imgTouxiang">
        <div>

        </div>
        <span slot="reference"
              class="el-dropdown-link">
          <img style="width:28px"
               src="~@/assets/img/avatar.png"
               alt="#">
          <span style="color:#fff;position: relative;top: 2px;">张辰辰</span>
          <i class="el-icon-caret-bottom el-icon--right"
             style="font-size: 12px;color: #fff;margin-left: -2px;position: relative;top: 2px;"></i>
        </span>
      </el-popover> -->
      <div>

      </div>
      <!-- <el-popover class="site-navbar__menu site-navbar__menu--right"
                  placement="bottom"
                  style="margin-right: 12px;"
                  trigger="click">
        <span slot="reference"> <span class="el-dropdown-link">
            <img style="width:28px"
                 src="~@/assets/img/avatar.png"
                 alt="#">
            <span style="color:#fff;position: relative;top: 2px;">张辰辰</span>
            <i class="el-icon-caret-bottom el-icon--right"
               style="font-size: 12px;color: #fff;margin-left: -2px;position: relative;top: 2px;"></i>
          </span></span>
      </el-popover> -->
    </div>

    <!-- 主入口标签页 threejs地图 -->
    <el-row v-if="$route.path === '/comMap'"
            class="map-content">
      <router-view />
    </el-row>
  </main>
</template>

<script>
import { isURL } from '@/utils/validate'
import { logout } from '@/api/common/login'
import { clearLoginInfo } from '@/utils'
export default {
  inject: ['refresh'],
  data () {
    return {
      mainmodel: '管理模式'
      // visible：false
    }
  },
  mounted () {
    if (sessionStorage.getItem('updatedNavbarFlag')) {
      if (sessionStorage.getItem('updatedNavbarFlag') === '4') { // 全景地图 TODO 系统切换时，全景记录NavbarFlag为4
        this.$store.commit('common/updatedNavbarFlag', this.$cookie.get('navFlag') || '0')
      } else {
        this.$store.commit('common/updatedNavbarFlag', sessionStorage.getItem('updatedNavbarFlag'))
      }
    }
    if (this.$route.name === 'comMap') { // 3D地图
      this.$store.commit('common/updateMainmodelFlag', 1)
      this.$store.commit('common/updatedNavbarFlag', '4')
      if (!this.$cookie.get('navFlag')) this.$cookie.set('navFlag', '0')
      this.$store.commit('common/updateMainTabs', [{
        iframeUrl: '',
        menuId: 'comMap',
        name: 'comMap',
        noClose: true,
        title: '视图模式',
        type: 'module'
      }])
    } else {
      this.$store.commit('common/updateMainmodelFlag', 0)
      let flag = false
      this.mainTabs.map(val => {
        if (val.name === 'home') {
          flag = true
        }
      })
      if (flag === false) {
        this.$store.commit('common/updateMainTabs', [{
          iframeUrl: '',
          menuId: 'home',
          name: 'home',
          noClose: true,
          title: '首页',
          type: 'module'
        }, this.mainTabs[0]])
      }
    }
  },
  computed: {
    documentClientHeight: {
      get () { return this.$store.state.common.documentClientHeight }
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
    userName: {
      get () { return this.$store.state.user.name }
    },
    siteContentViewHeight () {
      var height = this.documentClientHeight - 30 - 2
      if (this.$route.meta.isTab) {
        height -= 40
        return isURL(this.$route.meta.iframeUrl) ? { height: height + 'px' } : { minHeight: height + 'px' }
      }
      return { minHeight: height + 'px' }
    }
  },
  methods: {
    // 头像
    routerPathName (number) {
      if (number === '0' || number === '1') {
        this.$message('程序员开发中!')
      } else if (number === '2') {
        // 驾驶舱，默认-人员在岗在位驾驶舱
        let updatedNavbarFlag = sessionStorage.getItem('updatedNavbarFlag')
        if (updatedNavbarFlag) {
          if (updatedNavbarFlag === '0') {
            this.$router.push('/personLocationBoard') // 在岗在位驾驶舱
          } else if (updatedNavbarFlag === '1') {
            this.$router.push('/souBoard') // 重大危险源驾驶舱
          } else if (updatedNavbarFlag === '2') {
            this.$router.push('/riskBoard') // 安全风险分区驾驶舱
          } else {
            this.$router.push('/personLocationBoard') // 在岗在位驾驶舱
          }
        } else {
          this.$router.push('/personLocationBoard') // 在岗在位驾驶舱
        }
      } else if (number === '3') {
        // 退出登录
        logout().then(({data}) => {
          if (data && data.code === 0) {
            clearLoginInfo()
            this.$router.push('/login')
          } else {
            // this.getCaptcha()
            this.$message.error(data.msg)
          }
          this.loading = false
        }).catch((err) => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
          this.loading = false
        })
      }
    },
    // 看板展示
    routerPath (number) {
      this.$store.commit('common/updateMainmodelFlag', Number(number))
      if (number === '0') {
        this.mainmodel = '管理模式'
        this.$router.push('/home')
        this.$store.commit('common/updateMainTabs', [{
          iframeUrl: '',
          menuId: 'home',
          name: 'home',
          noClose: true,
          title: '首页',
          type: 'module'
        }])
        // $store.state.common.mainmodelFlag == 1
        // this.$store.commit('common/updatedNavbarFlag', '4')
      } else if (number === '1') {
        this.mainmodel = '视图模式'
        this.$router.push('/comMap')
        this.$store.commit('common/updateMainTabs', [{
          iframeUrl: '',
          menuId: 'comMap',
          name: 'comMap',
          noClose: true,
          title: '视图模式',
          type: 'module'
        }])
      }
      this.updateNavbarFlag(number) // 更新系统标识
    },
    // 更新系统标识
    updateNavbarFlag (number) {
      if (number === '0') { // 管理模式-切换
        this.$store.commit('common/updatedNavbarFlag', this.$cookie.get('navFlag'))
      } else { // 3D地图-切换
        // 记录当前navBarFlag
        if (this.$store.state.common.navFlag !== '4' && this.$store.state.common.navFlag !== '5') {
          this.$cookie.set('navFlag', this.$store.state.common.navFlag)
        }
        this.$store.commit('common/updatedNavbarFlag', '4')
      }
    },
    // tabs, 选中tab
    selectedTabHandle (tab) {
      tab = this.mainTabs.filter(item => item.name === tab.name)
      if (tab.length >= 1) {
        this.$router.push({ name: tab[0].name, query: tab[0].query, params: tab[0].params })
      }
    },
    // tabs, 删除tab
    removeTabHandle (tabName) {
      this.mainTabs = this.mainTabs.filter(item => item.name !== tabName)
      if (this.mainTabs.length >= 1) {
        // 当前选中tab被删除
        if (tabName === this.mainTabsActiveName) {
          var tab = this.mainTabs[this.mainTabs.length - 1]
          this.$router.push({ name: tab.name, query: tab.query, params: tab.params }, () => {
            this.mainTabsActiveName = this.$route.name
          })
        }
      } else {
        this.menuActiveName = ''
        this.$router.push({ name: 'home' })
      }
    },
    // tabs, 关闭当前
    tabsCloseCurrentHandle () {
      this.removeTabHandle(this.mainTabsActiveName)
    },
    // tabs, 关闭其它
    tabsCloseOtherHandle () {
      this.mainTabs = this.mainTabs.filter(item => item.name === this.mainTabsActiveName)
    },
    // tabs, 关闭全部
    tabsCloseAllHandle () {
      this.mainTabs = []
      this.menuActiveName = ''
      this.$router.push({ name: 'home' })
    },
    // tabs, 刷新当前
    tabsRefreshCurrentHandle () {
      var tab = this.$route
      this.removeTabHandle(tab.name)
      this.$nextTick(() => {
        this.$router.push({ name: tab.name, query: tab.query, params: tab.params })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.site-content--map {
  height: 100%;
  height: 100vh;
  padding: 0 !important;
}
/deep/ .el-tabs__content {
  padding: 0;
}
.el-card-map {
  .el-card__body {
    padding: 0;
  }
}

.site-content--tabs {
  // z-index: 10;
  padding-top: 40px;
  position: relative;
}
</style>
<style lang="scss">
#icard-body-all > .el-card__body {
  padding: 12px 8px 0px 8px;
  background: #fff;
  height: calc(100vh - 41px) !important;
}
/* site-nav el-tabs */
.site-content-tabs.el-tabs{
  & > .el-tabs__header {
    .el-tabs__item {
      margin-top: 8px;
      margin-right: 4px;
      color: #fff;
      .el-icon-close {
        color: #fff;
      }
      &.is-active {
        background: #fff;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        color: #222222;
        border: solid rgba(235, 238, 240, 1) 1px;
        border-bottom: none;
        .el-icon-close {
          color: #222222;
        }
      }
    }
    .is-active.is-closable:hover{
      .el-icon-close {
        color: #3E8EF7;
      }
    }
    .el-tabs__item:not(.is-active):hover {
      color: #fff;
      background: #625c5c;
      border-radius: 4px 4px 0px 0px;
      .el-icon-close:hover {
        background: #777777;
        color: #ffffff !important;
      }
    }
    .el-tabs__nav-wrap{
      padding-left: 20px;
    }
    .el-tabs__nav-wrap.is-scrollable {
      padding: 0 20px;
      .el-tabs__nav-prev {
        left: 4px;
      }
      .el-tabs__nav-next {
        right: 6px;
      }
    }
    .el-tabs__nav-next,
    .el-tabs__nav-prev {
      padding-top: 2px;
    }
  }
}
.el-tabs__item {
  height: 32px;
  line-height: 32px;
  font-size: 12px;
  padding-left: 10px !important;
  padding-right: 10px !important;
}
.el-icon-close {
  color: #222;
}
.el-drown-right-one {
  position: fixed;
  top: 0;
  z-index: 2001;
  height: 40px;
  // border-left: 1px solid rgba(220, 223, 230, 1);
  color: #fff;
  cursor: pointer;
  right: 0;
  .el-dropdown-link-indexOne {
    // margin: 0;
    font-size: 12px !important;
    display: inline-block;
    margin-top: 8px;
    transition: 0.3s;
    &:hover {
      background: rgba(44, 120, 187, 0.6);
    }
  }
  .el-dropdown-link {
    font-size: 12px !important;
    img {
      border-radius: 50%;
      margin-right: 7px;
    }
  }
  // .el-menu.el-menu--horizontal {
  //   border-bottom: none;
  //   .site-navbar__avatar {
  //     height: 28px;
  //     .el-dropdown {
  //       height: 28px;
  //     }
  //     .el-dropdown-link > img {
  //       margin-bottom: 22px;
  //     }
  //   }
  // }
}
.el-dropdwn-one {
  height: 40px;
  display: inline-block;
  position: relative;
  color: #606266;
  font-size: 14px;
  margin-right: 20px;
  // right: 98px;
}
.el-dropdwn-list{
  min-width: 102.34px;
  text-align: center;
  .el-dropdown-menu__item{
    font-size: 12px;
  }
}
.el-dropdwn-two {
  height: 40px;
  top: -2px;
  line-height: 40px;
  margin-right: 24px;
}
.el-dropdwon-login {
  color: #fa3b3c;
}
// .imgTouxiang {
//   position: absolute;
//   top: -4px;
//   right: 30px;
//   height: 40px;
//   line-height: 40px;
// }
</style>

