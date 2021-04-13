<template>
  <div class='sou-board-container'>
    <div class="board-content">
      <plb-header></plb-header>
      <el-row class="title-row">
        <!--title-->
        <el-col :span="16">
          <num-bar></num-bar>
        </el-col>
        <el-col :span="8">
          <num-day></num-day>
        </el-col>
      </el-row>
      <el-row class="content-row">
        <el-col :span="8" class="col-left">
          <!--告警看板-->
          <alarm></alarm>
          <!--重大危险源-->
          <major-source class="martop8"></major-source>
          <!--设备看板-->
          <equlpment class="martop8"></equlpment>
        </el-col>
        <el-col :span="8" class="col-center">
          <!--点位、告警、近一周-->
          <point-position></point-position>
          <!--各区域预警率-->
          <region-rate class="martop8"></region-rate>
        </el-col>
        <el-col :span="8" class="col-right">
          <!--安全承诺告知-->
          <securitInform></securitInform>
          <!--储罐看板-->
          <tank-board class="martop8"></tank-board>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import plbHeader from './header'
import numBar from './numBar'
import majorSource from './major-source' // 重大危险源
import alarm from './alarm'  // 告警看板
import equlpment from './equlpment' // 设备看板
import securitInform from './securit-inform' // 安全承诺告知
import tankBoard from './tank-board' // 储罐看板
import pointPosition from './point-position' // 点位、告警、近一周
import regionRate from './region-rate' // 各区域预警率
import NumDay from './numDay'
// import { alarmRecord, getdevicecount, getpersoncount, getvisitorcount, getzoneperson } from '@/api/kanban/per'
export default {
  components: {
    NumDay,
    plbHeader,
    numBar,
    alarm,
    equlpment,
    majorSource,
    securitInform,
    tankBoard,
    pointPosition,
    regionRate
  },
  data () {
    return {

    }
  },
  created () { },
  mounted () { },
  computed: {},
  watch: {},
  methods: {}
}
</script>

<style lang='scss' scoped>
.sou-board-container {
  width: 100%;
  height: 100vh;
  background-image: url('~@/assets/img/bg_safe.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  color: #fff;
  font-size: 16px;
  overflow: hidden;
  min-width: 1200px;
  min-height: 600px;
  .martop8 {
    margin-top: 8px;
  }
  .board-content {
    width: 100%;
    height: 100%;
    background-image: url('~@/assets/img/bg_gezi.png');
    background-repeat: repeat;
    .content-row {
      height: calc(100% - 118px);
      padding: 8px 8px;
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
