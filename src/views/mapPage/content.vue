<!--
 * @Descripttion: 包罗所有弹框 集中控制展示
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-11-26 20:19:57
 * @LastEditors  : Mr.What
 * @LastEditTime : 2020-01-04 14:50:39
 -->
<template>
  <div class="cesium-content-container">

    <!--目标跟踪-->
    <message-box-mix type="left-small" v-model="comVisible.targetFollowVisible">
      <target-follow @handleEvent="handleEvent"></target-follow>
    </message-box-mix>

    <!--轨迹历史-->
    <message-box-mix type="left-small" v-model="comVisible.historyVisible">
      <history @handleEvent="handleEvent" ref="history"></history>
    </message-box-mix>

    <!--人员分布和人员点名表-->
    <message-box-mix type="left" v-model="comVisible.personSpreadVisible">
      <person-spread></person-spread>
    </message-box-mix>
    <message-box-mix type="right" v-model="comVisible.personListVisible">
      <person-list ref="personList"></person-list>
    </message-box-mix>

    <!--重大危险源-->
    <message-box-mix type="right" v-model="comVisible.hazardsListVisible">
      <hazards-list ref="hazards"></hazards-list>
    </message-box-mix>

    <!--危险化工工艺-->
    <message-box-mix type="right-middle" v-model="comVisible.highRiskTechVisible">
      <highRisk-tech></highRisk-tech>
    </message-box-mix>

    <!--存储设备设施-->
    <message-box-mix type="right" v-model="comVisible.tankListVisible">
      <tank-list></tank-list>
    </message-box-mix>

    <!--反应装置设备-->
    <message-box-mix type="right-middle" v-model="comVisible.reactorListVisible">
      <reactor-list></reactor-list>
    </message-box-mix>

    <!--四色区查看-->
    <message-box-mix type="left" v-model="comVisible.fourAreaListVisible">
      <four-area-list></four-area-list>
    </message-box-mix>

    <!--巡检任务-->
    <message-box-mix type="left" v-model="comVisible.inspectionVisible">
      <inspection></inspection>
    </message-box-mix>
    <message-box-mix type="right" v-model="comVisible.inspectionDetailVisible">
      <inspection-detail ref="inspectionDetail"></inspection-detail>
    </message-box-mix>
    <div style="position:absolute;left:25vw;">
      <message-box-mix type="bottom" v-model="comVisible.inspectionRouteVisible">
        <inspection-route ref="inspectionRoute"></inspection-route>
      </message-box-mix>
    </div>

    <!--作业管理-->
    <message-box-mix type="left" v-model="comVisible.homeWorkVisible">
      <home-work></home-work>
    </message-box-mix>

    <!--信息看板-->
    <message-box-mix type="right" v-model="comVisible.billBoardInfoVisible">
      <bill-board-info ref="billBoardInfo"></bill-board-info>
    </message-box-mix>

    <!--围栏监测-->
    <message-box-mix type="right" v-model="comVisible.fenceMonitorVisible">
      <fence-monitor ref="fenceMonitor" :dataList="comegoList"></fence-monitor>
    </message-box-mix>

    <!--坐标校准-->
    <message-box-mix type="left" v-model="comVisible.checkCoordinateVisible">
      <check-coordinate ref="checkCoordinate"></check-coordinate>
    </message-box-mix>

    <!--地图弹框-->
    <message-box-mix type="right-middle" :width="500" v-model="comVisible.mapDialogVisible" v-dialogDrag>
      <map-dialog ref="mapDialog"></map-dialog>
    </message-box-mix>

  </div>
</template>

<script>
import eventBus from '@/bus/index'

import messageBoxMix from './components/messageBoxMix'
import targetFollow from './pos/targetFollow' // 目标跟踪
import history from './pos/history' // 轨迹历史
import billBoardInfo from './pos/billBoardInfo' // 信息看板
import fenceMonitor from './pos/fenceMonitor' // 围栏监测
import personSpread from './pos/personSpread' // 人员分布
import personList from './pos/personList' // 人员点名列表
import hazardsList from './sou/hazardsList' // 重大危险源
import highRiskTech from './sou/highRiskTech' // 危险化工工艺
import tankList from './sou/tankList' // 存储设备设施
import reactorList from './sou/reactorList' // 反应装置设备
import fourAreaList from './risk/fourAreaList' // 四色区查看
import inspection from './process/inspection' // 巡检任务
import inspectionDetail from './process/inspectionDetail' // 巡检任务信息
import inspectionRoute from './process/inspectionRoute' // 巡检任务点位路径
import homeWork from './process/homeWork' // 作业管理

import checkCoordinate from './tools/checkCoordinate' // 坐标校准
import mapDialog from './tools/mapDialog' // 地图弹框

export default {
  inject: ['cesiumMap'], // 多级祖孙传值-接受方
  provide () { // 多级祖孙传值-发送方
    return {
      cesiumContent: this
    }
  },
  props: {
    comegoList: { // 围栏进出记录
      type: Array
    }
  },
  components: {
    messageBoxMix,
    targetFollow,
    history,
    fenceMonitor,
    billBoardInfo,
    personSpread,
    personList,
    hazardsList,
    highRiskTech,
    tankList,
    reactorList,
    fourAreaList,
    inspection,
    inspectionDetail,
    inspectionRoute,
    homeWork,
    checkCoordinate,
    mapDialog
  },
  data () {
    return {
      comVisible: { // 窗口显示状态
        targetFollowVisible: false, // 目标追踪
        historyVisible: false, // 轨迹历史
        billBoardInfoVisible: false, // 人员信息板
        fenceMonitorVisible: false, // 围栏监测
        personSpreadVisible: false, // 人员分布
        personListVisible: false, // 人员点名表
        hazardsListVisible: false, // 重大危险源
        highRiskTechVisible: false, // 危险化工工艺
        tankListVisible: false, // 存储设备设施
        reactorListVisible: false, // 反应装置设备
        fourAreaListVisible: false, // 四色区查看
        inspectionVisible: false, // 巡检任务
        inspectionDetailVisible: false, // 巡检任务信息
        inspectionRouteVisible: false, // 巡检点位路径
        homeWorkVisible: false, // 作业管理
        checkCoordinateVisible: false, // 坐标
        mapDialogVisible: false // 地图弹框
      },
      // 全局变量
      openedCache: null, // 缓存上次点击的菜单
      cacheVisble: {}
    }
  },
  created () {
    eventBus.$on('cesiumMenuClick', val => {
      this.menuChange(val)
    })
  },
  mounted () { },
  computed: {},
  watch: {
    comVisible: {
      handler (val, oldVal) {
        let cache = {}
        for (let i in val) {
          if (this.cacheVisble[i] && !val[i]) {
            this.clearMap(i)
          }
          if (val[i]) {
            cache[i] = true
          }
        }
        this.cacheVisble = cache
      },
      deep: true
    }
  },
  methods: {
    menuChange (target) { // 菜单点击事件
      this.handleMenuClickBefore(target)
      this.openedCache = target // 缓存点击的菜单名称
      console.log(target)
      switch (target) {
        case 'targetFollow': // 目标追踪
          this.handleReset(['targetFollowVisible', 'fenceMonitorVisible'])
          this.comVisible.targetFollowVisible = !this.comVisible.targetFollowVisible
          break
        case 'history': // 轨迹历史
          this.handleReset(['historyVisible', 'fenceMonitorVisible'])
          this.comVisible.historyVisible = !this.comVisible.historyVisible
          break
        case 'personSpread': // 人员分布
          this.handleReset(['personSpreadVisible', 'fenceMonitorVisible'])
          this.comVisible.personSpreadVisible = !this.comVisible.personSpreadVisible
          break
        case 'fenceMonitor': // 围栏监测
          this.handleReset(['fenceMonitorVisible', 'targetFollowVisible', 'historyVisible', 'personSpreadVisible'])
          this.comVisible.fenceMonitorVisible = !this.comVisible.fenceMonitorVisible
          break
        case 'hazardsList': // 重大危险源
          this.handleReset(['hazardsListVisible', 'highRiskTechVisible', 'reactorListVisible'])
          this.comVisible.hazardsListVisible = !this.comVisible.hazardsListVisible
          break
        case 'highRiskTech': // 危险化工工艺
          this.handleReset(['tankListVisible', 'hazardsListVisible', 'highRiskTechVisible'])
          this.comVisible.highRiskTechVisible = !this.comVisible.highRiskTechVisible
          break
        case 'tankList': // 存储设备设施
          this.handleReset(['tankListVisible', 'highRiskTechVisible', 'reactorListVisible'])
          this.comVisible.tankListVisible = !this.comVisible.tankListVisible
          break
        case 'reactorList': // 反应装置设备
          this.handleReset(['hazardsListVisible', 'tankListVisible', 'reactorListVisible'])
          this.comVisible.reactorListVisible = !this.comVisible.reactorListVisible
          break
        case 'fourAreaList': // 四色区查看
          this.handleReset('fourAreaListVisible')
          this.comVisible.fourAreaListVisible = !this.comVisible.fourAreaListVisible
          break
        case 'inspection': // 巡检任务
          this.handleReset('inspectionVisible')
          this.comVisible.inspectionDetailVisible = false
          this.comVisible.inspectionVisible = !this.comVisible.inspectionVisible
          break
        case 'homework': // 作业管理
          this.handleReset('homeWorkVisible')
          this.comVisible.homeWorkVisible = !this.comVisible.homeWorkVisible
          break
        case 'mapparam': // 地图参数
          this.handleReset()
          this.comVisible.checkCoordinateVisible = !this.comVisible.checkCoordinateVisible
          break
        default:
          break
      }
    },
    handleEvent (type, val1, val2) { // 所有子组件事件中心 这里就类似一个eventBus
      switch (type) {
        case 'showWorkerInfo':
          this.comVisible.billBoardInfoVisible = true
          this.$nextTick(() => {
            this.$refs.billBoardInfo.init(val1, val2)
          })
          break
        case 'hideWorkerInfo':
          this.comVisible.billBoardInfoVisible = false
          break
        default:
          break
      }
    },
    handleMenuClickBefore (target) { // 拦截菜单点击事件 做一些前置处理 比如去执行上一个打开的菜单的重置事件 类似路由守卫
      if (target) {
        if (this.openedCache === 'history' || (this.comVisible.historyVisible === true && this.comVisible.inspectionDetailVisible === true)) {
          if (this.$refs.history) {
            this.$refs.history.close()

            this.cesiumMap.$refs.mapShow.setObjectVisible('person', null, true) // 显示所有点物体
            this.cesiumMap.$refs.mapShow.setObjectVisible('car', null, true)
          }
        }
      }
    },
    handleReset (ignore) { // 重置窗口显隐 ignore:忽略重置某一项
      if (typeof (ignore) === 'string' || ignore === undefined) {
        for (let i in this.comVisible) {
          if (i !== ignore) {
            this.comVisible[i] = false
          }
        }
      } else if (typeof (ignore) === 'object') {
        for (let i in this.comVisible) {
          let bool = false
          for (let j of ignore) {
            if (i === j) {
              bool = true
            }
          }
          if (!bool) {
            this.comVisible[i] = false
          }
        }
      }
    },
    clearMap (val) { // 清除特点菜单在地图上的显示
      switch (val) {
        case 'personSpreadVisible':
          this.cesiumMap.$refs.mapShow.removeAreaObjectLoc('person_distribution')
          this.comVisible.personListVisible = false
          this.comVisible.mapDialogVisible = false
          break
        case 'historyVisible':
          break
        case 'tankListVisible':
          this.cesiumMap.$refs.mapShow.deleteObjectLoc('tank')
          break
        case 'reactorListVisible':
          this.cesiumMap.$refs.mapShow.deleteObjectLoc('device')
          break
        case 'hazardsListVisible':
          this.$refs.hazards.clearObject()
          break
        case 'fourAreaListVisible':
          this.cesiumMap.$refs.mapShow.removeAreaObjectLoc('four_area')
          break
        case 'inspectionDetailVisible':
          if (this.openedCache === 'inspection') { // 如果当前在巡检菜单 这时巡检信息框关闭 则让巡检列表显示
            this.comVisible.inspectionVisible = true
            this.comVisible.historyVisible = false
          }
          this.comVisible.inspectionRouteVisible = false
          break
      }
    }
  },
  beforeDestroy () {
    if (this.$refs.history) {
      this.$refs.history.close()
    }
  }
}
</script>

<style lang="scss">
.cesium-content-container {
  position: relative;
  .el-table {
    overflow: auto;
    background: rgba(45, 51, 78, 0);
    // 表头背景色
    th {
      height: 34px;
      background: rgba(45, 51, 78, 0.7) !important;
      font-size: 12px;
      font-weight: bold;
      color: rgba(254, 254, 254, 1);
    }
    // 表格背景色
    tr {
      background: rgba(45, 51, 78, 0);
      font-size: 12px;
      height: 34px;
      padding-top: 2px;
    }
    // 表格字体及border
    td {
      color: #fff;
      font-size: 12px;
      border-bottom: none;
    }
    // 最下层border
    th.is-leaf {
      border-bottom: none;
    }
    // 下拉图标
    .el-icon-arrow-right {
      color: #fff;
    }
    // 间距
    .el-table__placeholder {
      display: contents;
    }
    // 鼠标悬浮背景色
    .el-table__body tr:hover > td {
      background: rgba(78, 88, 120, 0.3) !important;

      // 表格高度
      .el-table__row {
        height: 34px;
        padding-top: 2px;
      }
    }

    // 选中高亮色
    .el-table--striped .el-table__body tr.el-table__row--striped.current-row td,
    .el-table__body tr.current-row > td {
      transition: 0.3s;
      color: #04b8ec !important;
      background: rgba(78, 88, 120, 0.3) !important;
    }
    .el-table--striped
      .el-table__body
      tr.el-table__row--striped.current-row
      td:hover,
    .el-table__body tr.current-row > td:hover {
      text-decoration: underline;
    }

    .el-table__body-wrapper {
      overflow-x: hidden;
    }
  }

  .el-table [class*='el-table__row--level'] .el-table__expand-icon {
    margin-right: 0px;
  }

  .left-small {
    .el-input__inner {
      background-color: #00000082;
      border: 1px solid #3365b7ad;
      &:hover {
        border-color: #3365b7ad;
      }
      color: #fff;
      input {
        background-color: rgba(0, 0, 0, 0);
      }
      .el-range-input {
        color: #fff;
      }
      .el-range-separator {
        color: #b7bac1;
      }
    }

    .el-input-group__append {
      background-color: #006ac7ed;
      color: #ffffff;
      border: 0;
    }
    .el-input-group__prepend {
      background-color: #006ac7ed;
      color: #ffffff;
      border: 0;
    }
  }

  .el-tag.el-tag--success {
    background-color: #f0f9eb00;
    border-color: #67c23a;
    color: #67c23a;
  }
  .el-tag.el-tag--danger {
    background-color: #f0f9eb00;
    border-color: rgb(245, 108, 108);
    color: rgb(245, 108, 108);
  }
  .el-tag.el-tag--info {
    background-color: #f0f9eb00;
    border-color: #909399;
    color: #909399;
  }
  .el-tag.el-tag--warning {
    background-color: #f0f9eb00;
    border-color: #e6a23c;
    color: #e6a23c;
  }
}
</style>
