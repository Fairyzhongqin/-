<template>
  <div class='plb-header-container'>
    <span class="header-title">安全风险分区驾驶舱</span>
    <el-popover placement="bottom" width="190" trigger="click" content="">
      <div class="drop-button" slot="reference"><i class="el-icon-caret-bottom"></i></div>
      <div class="jump-link" @click="$router.push('/personLocationBoard')">在岗在位驾驶舱</div>
      <div class="jump-link" @click="$router.push('/souBoard')">重大危险源驾驶舱</div>
    </el-popover>
    <div class="header-line"></div>
    <div class="header-time">{{timeNow}}</div>
    <div class="user-bar">
      <el-dropdown trigger="click">
        <div>
          <img src="~@/assets/img/avatar.png" alt="" class="user-icon">
          <span class="user-name">{{userName}}<i class="el-icon-caret-bottom"></i></span>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="changeMode()">前往后台</el-dropdown-item>
          <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
          <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </div>
</template>

<script>
import UpdatePassword from '@/views/main-navbar-update-password'
import { clearLoginInfo } from '@/utils'
const time = new Date()
export default {
  components: {
    UpdatePassword
  },
  data () {
    return {
      timeNow: this.getTimeString(time),
      updatePassowrdVisible: false
    }
  },
  created () {
    this.getUserInfo()
  },
  mounted () {
    setInterval(() => {
      let timeR = new Date()   // 程序计时的月从0开始取值后+1
      this.timeNow = this.getTimeString(timeR)
    }, 1000)
  },
  computed: {
    userName: {
      get () { return this.$store.state.user.name },
      set (val) { this.$store.commit('user/updateName', val) }
    }
  },
  watch: {},
  methods: {
    getTimeString (t) {
      let m = t.getMonth() + 1
      return t.getFullYear() + '年' + m.toString().padStart(2, '0') + '月' +
        t.getDate().toString().padStart(2, '0') + '日 ' + t.getHours().toString().padStart(2, '0') + ':' +
        t.getMinutes().toString().padStart(2, '0') + ':' + t.getSeconds().toString().padStart(2, '0')
    },
    changeMode () {
      this.$router.push('/home')
      this.$store.commit('common/updateMainTabs', [{
        iframeUrl: '',
        menuId: 'home',
        name: 'home',
        noClose: true,
        title: '首页',
        type: 'module'
      }])
    },
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
          url: this.$http.adornUrl('/spring-sysweb/sys/logout'),
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
    // 获取当前管理员信息
    getUserInfo () {
      this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/user/info'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.loading = false
          this.userId = data.user.id
          this.userName = data.user.realName
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
/deep/ .jump-link {
  font-size: 18px;
  cursor: pointer;
  &:hover {
    color: #0075ff;
  }
}
.plb-header-container {
  height: 60px;
  padding: 0 20px;
  display: flex;
  flex-direction: row;
  .header-title {
    font-size: 26px;
    line-height: 60px;
    color: rgba(254, 254, 254, 1);
    text-shadow: 0px 0px 6px rgba(0, 198, 255, 1);
  }
  .header-line {
    height: 30px;
    flex: 1;
    font-size: 12px;
    line-height: 22px;
    color: #fff;
    text-align: right;
    border-bottom: 2px solid rgba(0, 198, 255, 1);
    margin: 0 16px;
  }
  .header-time {
    height: 60px;
    line-height: 60px;
    font-size: 12px;
    color: #fff;
    margin-right: 21px;
  }
  .user-bar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    /deep/ .el-dropdown {
      height: 30px;
      margin-right: 0;
      color: #fff;
      cursor: pointer;
      .user-icon {
        width: 28px;
        height: 28px;
        border-radius: 50%;
      }
      .user-name {
        margin-left: 5px;
        font-size: 13px;
      }
    }
  }
  .drop-button {
    width: 32px;
    height: 32px;
    margin-top: 14px;
    color: #00c6ff;
    text-align: center;
    line-height: 32px;
    background: rgba(199, 199, 204, 0.08);
    box-shadow: inset 0 0 10px 0px #0075ff;
    margin-left: 12px;
    i {
      line-height: 32px;
      font-size: 24px;
      cursor: pointer;
    }
  }
}
</style>
