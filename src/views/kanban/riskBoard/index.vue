<template>
  <div class='sou-board-container'>
    <div class="board-content">
      <plb-header></plb-header>
      <el-row class="content-row">
        <el-col :span="16">
          <el-col :span="12" class="col-left">
            <!--风险数据-->
            <num-bar></num-bar>
            <!--风险类型占比-->
            <risk-type class="martop8"></risk-type>
          </el-col>
          <el-col :span="12" class="col-center">
            <!--各区域风险点个数-->
            <region-rate></region-rate>
          </el-col>
          <el-col :span="24" class="col-left">
            <!--风险情况-->
            <risk-situation class="martop8"></risk-situation>
          </el-col>
        </el-col>
        <el-col :span="8" class="col-right">
          <!--隐患/风评/风控-->
          <tank-board></tank-board>
          <!--管控措施一览-->
          <measures-board class="martop8"></measures-board>
          <!--隐患治理-->
          <risk-run class="martop8"></risk-run>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import plbHeader from './header'
import numBar from './numBar'
import riskSituation from './risk-situation'
import riskRun from './risk-run'
import majorSource from './major-source' // 重大危险源
import inspection from './inspection'  // 巡检看板
import equlpment from './equlpment' // 设备看板
import securitInform from './securit-inform' // 安全承诺告知
import tankBoard from './tank-board' // 储罐看板
import measuresBoard from './measures-board' // 储罐看板
import riskType from './risk-type' // 储罐看板
import pointPosition from './point-position' // 点位、告警、近一周
import regionRate from './region-rate' // 各区域预警率
import NumDay from './numDay'
// import { alarmRecord, getdevicecount, getpersoncount, getvisitorcount, getzoneperson } from '@/api/kanban/per'
export default {
  components: {
    NumDay,
    plbHeader,
    numBar,
    inspection,
    equlpment,
    majorSource,
    securitInform,
    tankBoard,
    pointPosition,
    regionRate,
    measuresBoard,
    riskType,
    riskSituation,
    riskRun
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
      height: calc(100vh - 190px);
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
    .content-row-tow{
      .col-left {
        height: 100%;
        padding: 0 8px 0 4px;
      }
      .col-right {
        height: 100%;
        padding-right: 4px;
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
