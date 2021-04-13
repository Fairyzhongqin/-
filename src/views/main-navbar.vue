<template>
  <nav class="site-navbar"
       :class="'site-navbar--' + navbarLayoutType">
    <div class="site-navbar__header">
      <h1 class="site-navbar__brand"
          @click="$router.push({ name: 'home' })">
        <!-- <i class="el-icon-s-unfold"
           style="margin-right: 40px;
    margin-left: 20px;"></i> -->
        <a class="site-navbar__brand-lg fs17"
           style="font-weight: 400;"
           href="javascript:;"
           @click="openDialog()">
          <!-- <img src="~@/assets/img/favicon.png"
               alt="#"
               style="width:32px;height:38px"> -->
          {{navName.name}}</a>
        <a class="site-navbar__brand-mini"
           href="javascript:;">中石</a>
      </h1>
    </div>
    <div class="site-navbar__body clearfix">
      <img src="~@/assets/img/navbar_switch.png"
           class="navbar-switch"
           :class="sidebarFold?'navbar-switch__fold':'navbar-switch__unfold'"
           @click="sidebarFold = !sidebarFold" />
      <el-menu class="site-navbar__menu site-navbar__menu--right"
               mode="horizontal">
        <el-menu-item index="1"
                      @click="$message.info('程序猿正在建设。。。')">
          <template slot="title">
            <el-badge value="2">
              <icon-svg name="tixing"
                        class="el-icon-setting"></icon-svg>
            </el-badge>
          </template>
        </el-menu-item>
        <el-menu-item class="site-navbar__avatar"
                      index="3">
          <el-dropdown :show-timeout="0"
                       placement="bottom">
            <span class="el-dropdown-link">
              <img src="~@/assets/img/avatar.png"
                   :alt="userName">{{ userName }}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
              <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu-item>
      </el-menu>
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible"
                     ref="updatePassowrd"></update-password>
    <!-- 弹窗，切换系统 -->
    <switch-system v-if="switchSystemVisible"
                   ref="switchSystem"
                   @switchNavBar='switchNavBar'></switch-system>
  </nav>
</template>

<script>
import UpdatePassword from './main-navbar-update-password'
import SwitchSystem from './main-navbar-switch-system'
import { clearLoginInfo } from '@/utils'
export default {
  data () {
    return {
      updatePassowrdVisible: false,
      switchSystemVisible: false,
      navName: { name: '在岗在位管理系统', flag: 0 }
    }
  },
  components: {
    UpdatePassword,
    SwitchSystem
  },
  created () {
  },
  computed: {
    navbarLayoutType: {
      get () { return this.$store.state.common.navbarLayoutType }
    },
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold },
      set (val) { this.$store.commit('common/updateSidebarFold', val) }
    },
    mainTabs: {
      get () { return this.$store.state.common.mainTabs },
      set (val) { this.$store.commit('common/updateMainTabs', val) }
    },
    userName: {
      get () { return this.$store.state.user.name }
    }
  },
  methods: {
    // 修改密码
    updatePasswordHandle () {
      this.updatePassowrdVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassowrd.init()
      })
    },
    // 退出
    logoutHandle () {
      this.$confirm(`确定进行[退出]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/logout'),
          method: 'post',
          data: this.$http.adornData()
        }).then(({ data }) => {
          if (data && data.code === 0) {
            clearLoginInfo()
            this.$router.push({ name: 'login' })
          }
        })
      }).catch(() => { })
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
      this.navName.flag = flag
      let navName = flag === '0' ? '在岗在位管理系统' : flag === '1' ? '重大危险源监测预警系统' : flag === '2' ? '安全风险分区管理系统' : flag === '3' ? '企业生产全流程管理系统' : '地图'
      this.navName.name = navName
      // this.$forceUpdate()
    }
  }
}
</script>
<style lang="scss">
.site-navbar {
  // 切换收缩菜单的图标样式
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
</style>
