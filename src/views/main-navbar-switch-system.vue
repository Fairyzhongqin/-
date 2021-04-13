<template>
  <div>
    <transition name="switch-system">
      <el-row class="switch-system-container" v-show="visible">
        <!--<el-col :span="7"-->
        <!--align='center'-->
        <!--class="transtion-4"-->
        <!--v-if="index === 1"-->
        <!--v-show="visible">-->
        <!--<p @click.stop="switchSystem()"-->
        <!--class="switch-menu switch-system-title-color">地图</p>-->
        <!--</el-col>-->
        <el-col :span="24"
                style="padding-left:16%"
                align="center">
          <el-col style="width:200px"
                  v-for="item in dataLists.arrone"
                  :key="item.id"
                  align="center">
            <div @click.stop="switchSysFlag(item.label)"
                 class="switch-system-title-color switch-menu">
              <img :class="'system-img' + item.label"
                   :src="item.imgUrl"
                   :alt="'图标' + item.label">
              <p class="stytem-text">{{item.value}}</p>
            </div>
          </el-col>
        </el-col>
        <el-col :span="24"
                style="padding-left:16%"
                align="center">
          <el-col style="width:200px"
                  v-for="(item,index) in dataLists.arrTwo"
                  :key="item.id"
                  align="center"
                  :class="index===0 ? 'iconLeft' + (' transtion-' + index):'transtion-' + index">
            <div @click.stop="switchSysFlag(item.label)"
                 class="switch-system-title-color switch-menu">
              <img :class="'system-img' + item.label"
                   :src="'src/assets/img/system/system' + item.label + '.png'"
                   alt="#" />
              <p class="stytem-text">{{item.value}}</p>
            </div>
          </el-col>
        </el-col>
      </el-row>
    </transition>
    <div class="maskLayer"
         v-show="visibles"></div>
    <!-- </el-dialog> -->
  </div>
</template>

<script>
import systemImg0 from '@/assets/img/system/system0.png'
import systemImg1 from '@/assets/img/system/system1.png'
import systemImg2 from '@/assets/img/system/system2.png'
import systemImg3 from '@/assets/img/system/system3.png'
import systemImg4 from '@/assets/img/system/system4.png'
// import { stringify } from 'querystring'
export default {
  components: {},
  data () {
    return {
      visible: false,
      dataList: [],
      visibles: false,
      dataLists: { arrone: [], arrTwo: [] }
    }
  },
  created () {
    this.getDictList()
    let self = this
    document.addEventListener('click', function (e) {
      self.visible = false
      self.visibles = false
    })
  },
  mounted () { },
  computed: {},
  methods: {
    // 初始化
    init () {
      this.visible = true
      this.visibles = true
    },
    // 切换系统
    switchSysFlag (flag) {
      this.visible = false
      this.visibles = false
      if (flag === '4') {
        this.$router.push({ path: '/map-page' })
        this.$emit('switchNavBar', flag)
        this.$store.commit('common/updatedNavbarFlag', flag)
      } else {
        this.$store.commit('common/updateMainTabs', [{ iframeUrl: '',
          menuId: 'home',
          name: 'home',
          noClose: true,
          title: '首页',
          type: 'module' }])
        this.$router.push({ name: 'home' })
        this.$emit('switchNavBar', flag)
        this.$store.commit('common/updatedNavbarFlag', flag)
      }
    },
    // switchSystem () {
    //   this.visible = false
    //   this.visibles = false
    //   this.$router.push({ path: '/map-page' })
    // },

    getDictList () { // 获取字典数据列表，系统选项
      this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/dict/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'type': 'sys_flag'
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          let map = { id: '7234uigjrhfgae', label: '4', value: '全景视图' }
          this.dataList.splice(1, 0, map)
        }
        this.dataLists.arrone = this.dataList.splice(0, 3)
        this.dataLists.arrTwo = this.dataList
        this.dataLists.arrTwo.map(value => {
          if (value.label === '0') value.imgUrl = systemImg0
          if (value.label === '1') value.imgUrl = systemImg1
          if (value.label === '2') value.imgUrl = systemImg2
          if (value.label === '3') value.imgUrl = systemImg3
          if (value.label === '4') value.imgUrl = systemImg4
        })
        console.log(this.dataLists)
      })
    }
  },
  watch: {
    // 监听,当路由发生变化的时候执行
    $route (to, from) {
      if (to.path !== '/home') {
        this.visible = false
        setTimeout(() => {
          this.visibles = false
        }, 500)
      }
      if (to.path === '/map-page') {
        this.$store.commit('common/updatedNavbarFlag', '4')
      }
    }
  }
}
</script>

<style lang='scss'>
.switch-system-container {
  z-index: 100000;
  width: 70%;
  position: absolute;
  margin-left: 20%;
  margin-top: 16%;
  .switch-item {
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
    color: #ffffff;
    cursor: pointer;
    border-radius: 4px;
  }
  .switch-menu {
    width: 150px;
    height: 170px;
    text-align: center;
    margin-right: 20px;
    margin-top: 0px;
    margin-bottom: 0;
    border-radius: 4px;
    background-image: url("~@/assets/img/switch.png");
    background-size: cover;
    color: white;
    cursor: pointer;
  }
  .switch-item:hover {
    font-size: 18px;
  }
  .iconLeft {
    margin-left: 98px;
  }
  .switch-system-title-color {
    opacity: 0.6;
    transition: all 0.6s;
  }
  // .switch-system-title-color1 {
  //   background: #fe8906;
  //   opacity: 1;
  // }
  // .switch-system-title-color2 {
  //   background: #bdf1af;
  //   opacity: 1;
  // }
  // .switch-system-title-color3 {
  //   background: #3e8ef7;
  //   opacity: 1;
  // }
  .switch-system-title-color:hover {
    opacity: 1;
    transform: scale(1.2);
    -ms-transform: scale(1.2); /* IE 9 */
    -moz-transform: scale(1.2); /* Firefox */
    -webkit-transform: scale(1.2); /* Safari 和 Chrome */
    -o-transform: scale(1.2);
  }

  &.dark {
    /deep/ .el-dialog {
      background-color: #000000a6;
      box-shadow: 0 0 0 #0000;
      /deep/ .el-dialog__header {
        display: none;
      }
    }
  }
}
.maskLayer {
  position: absolute;
  width: 100vw;
  height: 100vh;
  top: 0px;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10000;
}
.switch-system-enter-active {
  transition: all 0.5s;
}
.switch-system-leave-active {
  transition: all 0.2s;
}
.switch-system-enter {
  transform: translateY(-500px);
}
.switch-system-leave-to {
  transform: translateY(-500px);
}
.system-img0,
.system-img1 {
  width: 56px;
  height: 56px;
  margin-top: 13px;
}
// .system-img1 {
//   width: 54px;
//   height: 54px;
//   margin-top: 38px;
// }
.system-img2 {
  width: 52px;
  height: 52px;
  margin-top: 13px;
  margin-left: 8px;
}
.system-img4,
.system-img3 {
  width: 50px;
  height: 50px;
  margin-top: 13px;
  color: #00c6ff;
}

.stytem-text {
  width: 75%;
  text-align: center;
  margin-top: 6px;
  color: #dbdbdd;
  font-size: 12px;
  /*margin-left: 10%;*/
}
</style>
