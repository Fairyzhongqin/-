<template>
  <el-scrollbar>
    <div class="site-wrapper" :class="{ 'site-sidebar--fold': sidebarFold , 'site-wrapper-filter' : siteWrapperFilter}" v-loading.fullscreen.lock="loading" element-loading-text="拼命加载中">
      <template v-if="!loading">
        <!-- <main-navbar /> -->
        <main-sidebar />
        <div :class="$route.path !== '/map-page'?'site-content__wrapper':'site-content__wrapper-map'" :style="{ 'min-height': documentClientHeight + 'px' }">
          <main-content v-if="!$store.state.common.contentIsNeedRefresh" />
        </div>
      </template>
    </div>
    <selectSwitch v-if="$store.state.common.navFlag !== '4' && $store.state.common.navFlag !== '5'" />
  </el-scrollbar>

</template>

<script>
import MainNavbar from './main-navbar'
import MainSidebar from './main-sidebar'
import MainContent from './main-content'
import selectSwitch from '@/components/select/select-switch-item'
export default {
  provide () {
    return {
      // 刷新
      refresh () {
        this.$store.commit('common/updateContentIsNeedRefresh', true)
        this.$nextTick(() => {
          this.$store.commit('common/updateContentIsNeedRefresh', false)
        })
      }
    }
  },
  data () {
    return {
      loading: true
    }
  },
  components: {
    MainNavbar,
    MainSidebar,
    MainContent,
    selectSwitch
  },
  computed: {
    documentClientHeight: {
      get () { return this.$store.state.common.documentClientHeight },
      set (val) { this.$store.commit('common/updateDocumentClientHeight', val) }
    },
    sidebarFold: {
      get () { return this.$store.state.common.sidebarFold }
    },
    siteWrapperFilter: {
      get () { return this.$store.state.common.siteWrapperFilter }
    },
    userId: {
      get () { return this.$store.state.user.id },
      set (val) { this.$store.commit('user/updateId', val) }
    },
    userName: {
      // get是返回需要计算的那个值，而set是那个值发生变化时会执行的函数
      get () { return this.$store.state.user.name },
      set (val) { this.$store.commit('user/updateName', val) }
    }
  },
  created () {
    this.getUserInfo()
  },
  mounted () {
    this.resetDocumentClientHeight()
  },
  methods: {
    // 重置窗口可视高度
    resetDocumentClientHeight () {
      this.documentClientHeight = document.documentElement['clientHeight']
      window.onresize = () => {
        this.documentClientHeight = document.documentElement['clientHeight']
      }
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

<style lang="scss" scoped>
.site-content__wrapper-map {
  margin-left: 0;
  position: relative;
}
.site-wrapper-filter {
  filter: blur(2px);
  -webkit-filter: blur(2px); /* Chrome, Opera */
  -moz-filter: blur(2px);
  -ms-filter: blur(2px);
}
</style>
