<template>
  <div class='person-location-board-container'>
    <div class="board-content">
      <plb-header></plb-header>
      <el-row class="content-row">
        <el-col :span="8"
                class="col-left">
          <num-bar></num-bar>
          <inspection class="martop9"></inspection>
          <equlpment class="martop9"></equlpment>
        </el-col>
        <el-col :span="8"
                class="col-center">
          <staff></staff>
        </el-col>
        <el-col :span="8"
                class="col-right">
          <alert style="height: 40%;"></alert>
          <work style="height: calc(60% - 9px);margin-top:9px;"
                ref="work"></work>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import plbHeader from './header'
import numBar from './numBar'
import inspection from './inspection'
import equlpment from './equlpment'
import staff from './staff'
import alert from './alert'
import work from './work'
// import { alarmRecord, getdevicecount, getpersoncount, getvisitorcount, getzoneperson } from '@/api/kanban/per'
export default {
  components: {
    plbHeader,
    numBar,
    inspection,
    equlpment,
    staff,
    alert,
    work
  },
  data () {
    return {

    }
  },
  created () { },
  mounted () { },
  beforeRouteLeave (to, from, next) {
    // 离开当前路由页面时调用
    this.$refs.work.clearTimer()
    next()
  },
  computed: {},
  watch: {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.person-location-board-container {
  width: 100%;
  height: 100vh;
  background-image: url("~@/assets/img/bg_safe.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: #fff;
  font-size: 16px;
  overflow: hidden;
  min-width: 1200px;
  min-height: 600px;
  .board-content {
    width: 100%;
    height: 100%;
    background-image: url("~@/assets/img/bg_gezi.png");
    background-repeat: repeat;
    .content-row {
      height: calc(100% - 60px);
      padding: 0 8px;
      .col-left {
        height: 100%;
        padding-right: 4px;
      }
      .col-center {
        height: 100%;
        padding: 0 4px;
      }
      .col-right {
        height: 100%;
        padding-left: 4px;
      }
    }
  }

  ::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 5px;
  }

  ::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    background: #00c6ff;
  }

  ::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    border-radius: 10px;
    background: #fff0;
  }
}
</style>

<style>
.h100 {
  height: 100%;
}
</style>