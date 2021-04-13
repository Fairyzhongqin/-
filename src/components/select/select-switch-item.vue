<template>
  <div class="switch">
    <!-- 玻璃蒙层 -->
    <div v-if="filtersBlur" @click="yuanAnmain(true)" class="switch-filter"></div>
    <div @click="yuanAnmainS" v-show="filtersBlurs" class="switch-item-select">
      <!-- 系统切换 -->
      <el-row>
        <div class="anmaitionsscal"
             :class="anmaitionName">
          <div v-for="item in dataList"
               class="switch-item-content"
               :key="item.id"
               :class="'switch-item-poistion' + item.label">
            <el-col class="switch-item-border"
                    @click.native="switchSysFlag(item.label)">
              <el-col class="switch-system-img"
                      align='center'>
                <div class="switch-system-title-color switch-menu">
                  <img :class="'system-img' + item.label"
                       :src="item.imgUrl"
                       :alt="'图标' + item.label">
                  <p class="stytem-text">{{item.value}}</p>
                </div>
              </el-col>
            </el-col>
          </div>
        </div>

      </el-row>
    </div>
    <div class="wrapper" :class="anmationYuan">
      <div class="border-circle" id="one"></div>
      <div class="border-circle" id="two"></div>
      <div class="background-circle" @click="yuanAnmain()"></div>
    </div>
    <!--<div @mouseover="selectStyle() "-->
    <!--@mouseout="selectStyleLeave()"-->
    <!--class="switch-item-selects">-->
    <!--<div class="switch-item-yuan"-->
    <!--:class="anmationYuan"-->
    <!--@click="yuanAnmain()"></div>-->
    <!--</div>-->
  </div>
</template>
<script>
import systemImg0 from '@/assets/img/system/system0.png'
import systemImg1 from '@/assets/img/system/system1.png'
import systemImg2 from '@/assets/img/system/system2.png'
import systemImg3 from '@/assets/img/system/system3.png'
import systemImg4 from '@/assets/img/system/system4.png'
var setTime = null
export default {
  data () {
    return {
      dataList: [],
      anmaitionName: '',
      filtersBlur: false,
      filtersBlurs: false,
      anmaitionShow: false, // 动画结束状态
      anmationYuan: 'anmationYuanNameLeave',
      setTimeBool: false
    }
  },
  created () {
    this.getDictList()
  },
  methods: {
    // 鼠标hover移入
    // 鼠标离开
    selectStyleLeave () {
      if (this.filtersBlur === false) {
        this.anmationYuan = 'anmationYuanNameLeave'
      }
    },
    // 鼠标hover事件
    selectStyle () {
      this.anmationYuan = 'anmationYuanName'
    },
    // 鼠标hover移出
    mouseLeave () {
      if (!this.filtersBlur) this.anmationYuan = ''
    },
    // 点击遮罩层隐藏动画
    yuanAnmainS () {
      if (this.anmaitionShow === false) {
        this.anmaitionName = 'animationShows'
        this.anmationYuan = 'anmationYuanNameLeave'
        clearTimeout(setTime)
        setTime = setTimeout(() => {
          this.filtersBlur = false
          this.filtersBlurs = false
          this.anmaitionShow = true
          // this.anmationYuan = ''
        }, 1000)
      }
    },
    // 点击圆展示隐藏动画
    yuanAnmain (isShowAnmationYuan = false) {
      if (this.setTimeBool) return false
      if (this.anmaitionName === 'animationShow') {
        if (this.anmaitionShow === false) {
          this.anmaitionName = 'animationShows'
          this.anmationYuan = 'anmationYuanNameLeave'
          clearTimeout(setTime)
          this.setTimeBool = true
          setTimeout(() => {
            this.filtersBlurs = false
            this.filtersBlur = false
            this.anmaitionShow = true
            if (isShowAnmationYuan) this.anmationYuan = ''
            this.setTimeBool = false
          }, 1000)
        }
      } else {
        this.anmationYuan = 'anmationYuanName'
        if (this.anmaitionName === '') {
          this.anmaitionName = 'animationShow'
          this.filtersBlur = true
          this.filtersBlurs = true
        } else {
          if (this.anmaitionShow === true) {
            this.anmaitionName = 'animationShow'
            this.filtersBlur = true
            this.filtersBlurs = true
            this.anmaitionShow = false
          }
        }
      }
    },
    // 切换系统
    switchSysFlag (flag) {
      this.$store.commit('common/updateMainmodelFlag', 0)
      if (this.anmaitionName === 'animationShow') {
        this.anmaitionName = 'animationShows'
        this.filtersBlur = false
      } else {
        this.anmaitionName = 'animationShow'
        this.filtersBlur = true
      }
      if (flag === '4') {
        this.$cookie.set('navFlag', this.$store.state.common.navFlag)
        this.$router.push({ path: '/map-page' })
        this.$emit('switchNavBar', flag)
        this.$store.commit('common/updatedNavbarFlag', flag)
      } else {
        this.$store.commit('common/updateMainTabs', [{
          iframeUrl: '',
          menuId: 'home',
          name: 'home',
          noClose: true,
          title: '首页',
          type: 'module'
        }])
        this.$router.push({ name: 'home' })
        this.$emit('switchNavBar', flag)
        this.$store.commit('common/updatedNavbarFlag', flag)
      }
      sessionStorage.setItem('updatedNavbarFlag', flag)
    },
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
          this.dataList.splice(2, 0, map)
          this.dataList.map(value => {
            if (value.label === '0') value.imgUrl = systemImg0
            if (value.label === '1') value.imgUrl = systemImg1
            if (value.label === '2') value.imgUrl = systemImg2
            if (value.label === '3') value.imgUrl = systemImg3
            if (value.label === '4') value.imgUrl = systemImg4
          })
        }
        // this.dataLists.arrone = this.dataList.splice(0, 3)
        // this.dataLists.arrTwo = this.dataList
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.switch {
  // 玻璃蒙层
  .switch-filter {
    position: fixed;
    z-index: 2001;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .switch-item-select {
    position: fixed;
    bottom: 0px;
    width: 100vw;
    padding-top: 176px;
    overflow: hidden;
    z-index: 2001;
    .el-row {
      .anmaitionsscal {
        padding-top: 176px;
        display: flex;
        // justify-content: content;
        width: 100%;
        padding-left: calc(50% - 310px);
        transform: rotate(180deg);
        transform-origin: 47.5% 100%;
        z-index: 2001;
        .switch-item-border {
          cursor: pointer;
          background: #030923;
          border-radius: 50%;
          width: 117px;
          height: 117px;
          border: 3px solid #00c6ff;
          animation: 2s;
        }
      }
    }
    .switch-item-content {
      // width: 117px;
      border: 9px solid rgba(0, 198, 255, 0.1);
      border-radius: 50%;
      z-index: 2001;
      transition: all 0.5s;
      &:hover {
        /*transform: scale(1.1);*/
        animation: scale 0.4s 0s linear both infinite alternate;
        .switch-item-border {
          /*animation: 2s;*/
          /*border-color: #d46b2a;*/
        }
      }
    }
    .switch-item-poistion0 {
      position: relative;
      bottom: 8px;
    }
    .switch-item-poistion1 {
      position: relative;
      bottom: 120px;
      right: 24px;
    }
    .switch-item-poistion2 {
      position: relative;
      bottom: 120px;
      right: 6px;
    }
    .switch-item-poistion3 {
      // margin-bottom: 141px;
      position: relative;
      right: 26px;
      bottom: 8px;
    }
    .switch-item-poistion4 {
      position: relative;
      bottom: 173px;
      right: 15px;
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

    .animationShow {
      animation: grow 1s 1 alternate forwards;
    }
    .animationShows {
      animation: grows 1s 1 alternate forwards;
    }
    @keyframes grows {
      to {
        transform-origin: 47.5% 100%;
        transform: rotate(180deg);
      }
      from {
        transform-origin: 47.5% 100%;
        transform: rotate(360deg);
      }
    }
    @keyframes grow {
      0% {
        transform-origin: 47.5% 100%;
        transform: rotate(180deg);
      }
      70% {
        transform-origin: 47.5% 100%;
        transform: rotate(365deg);
      }
      100% {
        transform-origin: 47.5% 100%;
        transform: rotate(360deg);
      }
    }
  }
  .switch-item-selects {
    bottom: 0px;
    // width: 100vw;
    height: 50px;
    overflow: hidden;
    z-index: 2001;
    width: 109px;
    left: calc(50% - 47px);
    .switch-item-yuan {
      border-radius: 50%;
      width: 106px;
      height: 106px;
      background: #b6b9c2;
      border: 7px solid rgba($color: #d8dbdf, $alpha: 1);
      position: absolute;
      left: calc(50% - 61px);
      bottom: -92px;
      z-index: 5000;
      cursor: pointer;
      transition: 0.3s linear;
    }
  }
  .wrapper {
    position: fixed;
    bottom: -90px;
    z-index: 2002;
    width: 109px;
    left: calc(50% - 50px);
    .background-circle {
      cursor: pointer;
      width: 100px;
      height: 100px;
      border-radius: 100%;
      overflow: hidden;
      margin: 0 auto;
      background: #2d334e;
      position: relative;
      transform-origin: center;
    }
    .border-circle {
      width: 100px;
      height: 100px;
      border-radius: 100%;
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -50px;
      margin-top: -50px;
      border: 1px solid #2d334e;
      transform: scale(0);
      transform-origin: center;
    }
    &.anmationYuanName {
      animation: top-border-pulse 1s 1 alternate forwards;
    }
    &.anmationYuanNameLeave {
      animation: bottom-border-pulse 1s 1 alternate forwards;
      .border-circle#one {
        animation: border-pulse 1.5s 3.1s infinite linear;
        animation-direction: normal;
        /* animation-fill-mode: forwards; */
        /* -webkit-animation:border-pulse 1s 3.1s 1 ease;
          -webkit-animation-fill-mode: forwards; */
      }
      .border-circle#two {
        animation: border-pulse 1.5s 3.3s infinite linear;
        animation-direction: normal;
        /* animation-fill-mode: forwards; */
        /* -webkit-animation:border-pulse 1s 3.3s 1 ease;
          -webkit-animation-fill-mode: forwards; */
      }
      .background-circle {
        /*animation: bottom-border-pulse 1s 1 alternate forwards;*/
      }
    }
    @keyframes top-border-pulse {
      0% {
        bottom: -90px;
      }
      100% {
        bottom: -75px;
      }
    }
    @keyframes bottom-border-pulse {
      0% {
        bottom: -75px;
      }
      100% {
        bottom: -90px;
      }
    }
    @keyframes border-pulse {
      0% {
        -webkit-transform: scale(0);
        transform: scale(0);
        border-width: 2px;
        opacity: 1;
      }
      60% {
        -webkit-transform: scale(1);
        transform: scale(1);
        border-width: 2px;
        opacity: 0.6;
        margin-left: -50px;
        margin-top: -50px;
      }
      100% {
        -webkit-transform: scale(1.2);
        transform: scale(1.2);
        border-width: 0px;
        opacity: 0.4;
        border-style: double;
        margin-left: -50px;
        margin-top: -50px;
      }
    }
  }
}
</style>
