<template>
  <div class="map-template-container">
    <!--nav-->
    <div class="map-navbar">
      <div class="map-navbar-left">
        <a href="javascript:;">安全生产信息管理化平台</a>
      </div>
      <div class="map-navbar-conter">
        <template v-for="(item,index) in navList">
          <a href="javascript:;" :class="{'active':index=='0'}">{{item.name}}</a>
        </template>
      </div>
      <div class="map-navbar-right">
        <el-dropdown trigger="click" class="el-dropdwn">
        <span class="el-dropdown-link">
          <img style="width:28px" src="~@/assets/img/avatar.png" alt="#">
          <span style="color:#fff;position: relative;top: 2px;">{{userName}}</span>
          <i class="el-icon-caret-bottom el-icon--right" style="font-size: 12px;color: #fff;margin-left: -2px;position: relative;top: 2px;"></i>
        </span>
          <el-dropdown-menu slot="dropdown" class="el-dropdwn-list">
            <el-dropdown-item @click.native="routerPathName('0')">我的消息</el-dropdown-item>
            <el-dropdown-item @click.native="routerPathName('1')">修改密码</el-dropdown-item>
            <el-dropdown-item @click.native="routerPathName('2')" class="el-dropdwon-login">退出登录</el-dropdown-item>
            <!-- <el-dropdown-item @click.native="routerPath('2')">驾驶舱模式</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <!--content-->
    <div class="map-content">
      <com-map v-if="false"></com-map>
      <map-page></map-page>
    </div>
    <!--footer-->
    <div class="map-footer">
      <span>copyright©中石科技</span>
    </div>
  </div>
</template>

<script>
  import comMap from '@/views/modules/comMap/index'
  import mapPage from '@/views/mapPage/indexNew'

  import { logout } from '@/api/common/login'
  import { clearLoginInfo } from '@/utils'
  export default {
    name: 'map-template',
    components: {mapPage, comMap},
    props: {},
    data () {
      return {
        navList: [{
          name: '地图'
        }, {
          name: '人员定位'
        }, {
          name: '重大危险源'
        }, {
          name: '安全生产分区'
        }, {
          name: '企业生产全流程'
        }
        ]
      }
    },
    created () {
      console.log(this.$route.name)
      if (this.$route.name === 'map3D') {
        this.$store.commit('common/updatedNavbarFlag', '4')
      } else {
      }
    },
    activated () {
    },
    mounted () {
      console.log(this.userName)
    },
    methods: {
      // 头像
      routerPathName (number) {
        if (number === '0' || number === '1') {
          this.$message('程序员开发中!')
        } else if (number === '2') {
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
      }
    },
    watch: {},
    computed: {
      userName: {
        get () { return this.$store.state.user.name }
      }
    },
    filters: {},
    destroyed: {}
  }
</script>

<style lang="scss">
.map-template-container{
  position: relative;
  height: 100vh;
  .map-navbar{
    width: 100%;
    height: 40px;
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    background:rgba(0,0,0,.5);
    a:hover{
      text-decoration: none;
    }
    &-left {
      position: absolute;
      left: 0;
      top: 0;
      margin-left: 20px;
      a{
        line-height: 40px;
        color: #ffffff;
        font-size:16px;
        font-weight:bold;
      }
    }
    &-conter{
      width: 100%;
      text-align: center;
      a{
        font-size:14px;
        color: #9A9EAF;
        display: inline-block;
        padding: 0 40px;
        height: 40px;
        line-height: 40px;
        transition: .3s;
        &:hover{
          color: #ffffff;
        }
      }
      .active{
        color: #ffffff;
      }
    }
    &-right{
      position: absolute;
      right: 0;
      top: 0;
      margin-right: 24px;
      line-height: 40px;
      .el-dropdwn .el-dropdown-link img {
        border-radius: 50%;
        margin-right: 7px;
        cursor: pointer;
      }
      .el-icon--right{
        cursor: pointer;
      }
    }
  }
  .map-content{
    /*padding-top: 40px;*/
  }
  .map-footer{
    position: absolute;
    z-index: 2;
    left: 0;
    bottom: 0;
    color: #5C5F6A;
    font-size:10px;
    margin: 6px 10px;
  }
}
</style>
