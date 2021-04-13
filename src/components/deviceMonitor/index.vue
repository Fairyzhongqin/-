<!--
 * @Descripttion: 设备监控组件
 * @version:
 * @Author: Mr.What
 * @Date: 2019-11-18 17:39:45
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-12-12 09:51:32
 -->
<template>
  <el-dialog :title="'实时监测-'+objectInfo.name" class="device-monitor-container" :close-on-click-modal="false" :visible.sync="visible" append-to-body width="620px" @close="handleClose">

    <el-tabs v-model="activeIndex" @tab-click="handleTabClick">
      <el-tab-pane :label="item.describe" :name="index.toString()" v-for="(item, index) in parameter" :key="index"></el-tab-pane>
    </el-tabs>

    <el-row style="border-bottom:1px solid #DCDFE6">
      <el-col :span="10" class="monitor-items">
        <div class="monitor-item">
          <div class="item-name">仪表类型：</div>
          <div class="item-value">{{deviceInfo.type}}</div>
        </div>
        <div class="monitor-item">
          <div class="item-name">设备状态：</div>
          <div class="item-value">
            <el-tag size="mini" style="color:#fff;" :color="statusColorList[deviceInfo.colorIndex]">{{deviceInfo.status}}</el-tag>
          </div>
        </div>
        <div class="monitor-item">
          <div class="item-name">当前数值：</div>
          <div class="item-value">{{deviceInfo.value+deviceInfo.danwei}}</div>
        </div>
        <div class="monitor-item">
          <div class="item-name">更新时间：</div>
          <div class="item-value">{{deviceInfo.time}}</div>
        </div>
        <div class="monitor-item">
          <div class="item-name">阈值：</div>
          <div class="item-value" v-if="!deviceInfo.hasYuzhi">暂无</div>
          <div class="item-value" v-if="deviceInfo.bascicYuzhi.length===4 && deviceInfo.hasYuzhi">{{'低低限:'+deviceInfo.bascicYuzhi[0]+',低限:'+deviceInfo.bascicYuzhi[1]+',高限:'+deviceInfo.bascicYuzhi[2]+',高高限:'+deviceInfo.bascicYuzhi[3]}}</div>
          <div class="item-value" v-if="deviceInfo.bascicYuzhi.length===2 && deviceInfo.hasYuzhi">{{'第一级预警:'+deviceInfo.bascicYuzhi[0]+',第二级预警:'+deviceInfo.bascicYuzhi[1]}}</div>
        </div>
      </el-col>
      <el-col :span="14">
        <gauge-chart class="gauge-chart" :chartData="chartData1" :name="activeName"></gauge-chart>
      </el-col>
    </el-row>
    <el-form :model="searchForm" :inline="true" ref="dataForm" style="margin-top:10px;">
      <el-form-item label="查询范围">
        <el-date-picker v-model="searchForm.dateTime" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" :picker-options="pickerOptions" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="center" size="mini">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" @click="searchHistory">
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right">重置</el-button>
        <el-switch v-model="realTimeType" style="margin-left: 15px;" active-text="实时" inactive-text="" @change="switchHandle">
        </el-switch>
      </el-form-item>
    </el-form>
    <real-time-line-chart :chartData="realTimeType?chartData2:chartData3"></real-time-line-chart>
  </el-dialog>
</template>

<script>
import gaugeChart from './gaugeChart'
import realTimeLineChart from './realTimeLineChart'

import { getLabels } from '@/api/common/sys'
import { meterShow, historyData } from '@/api/sou/parameter'
import { realTimeData } from '@/api/sou/equlpment'

export default {
  props: {
    value: {
      type: Boolean
    }
  },
  components: {
    gaugeChart,
    realTimeLineChart
  },
  data () {
    return {
      objectInfo: '', // 当前设备信息
      parameter: [], // 仪表列表
      panelTypeList: [], // 仪表类型 字典表查询
      activeName: '液位', // 当前选中tab
      activeIndex: 0, // 当前选中tab
      visible: this.value,
      realTimeType: true, // 是否为实时数据
      searchForm: {
        dateTime: []
      },
      deviceInfo: {
        type: '查询中',
        status: '正常',
        value: '0',
        colorIndex: 2,
        danwei: '',
        time: '查询中',
        hasYuzhi: true,
        bascicYuzhi: [0, 0, 0, 0]
      },
      setInterval: null,
      chartData1: {}, // 仪表盘数据
      chartData2: [], // 折线图数据 实时
      chartData3: [], // 折线图数据 历史
      statusColorList: ['#FF5400', '#FFB820', '#02B22B', '#FFB820', '#FF5400'], // 颜色类型枚举
      pickerOptions: { // elementui快捷时间段
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  async created () {
    await this.getPanelType()
  },
  mounted () {
  },
  computed: {},
  watch: {},
  methods: {
    init (info) {
      this.objectInfo = info
      this.$nextTick(() => {
        meterShow({
          id: info.id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            if (data.list.length > 0) {
              this.parameter = data.list
              console.log(data.list)
              this.handleTabClick()
            } else {
              this.$message.error('暂无仪表开启')
            }
          }
        })
      })
    },
    refreshData () {
      this.setInterval = setInterval(() => {
        this.getPanelInfo()
      }, 3000)
    },
    // 封装获取实时数据
    getPanelInfo () {
      let activeParameter = this.parameter[this.activeIndex] // 当前tab点击的仪表
      realTimeData({
        code: activeParameter.code
      }).then(({ data }) => {
        if (data.data && data.code === 0) {
          this.deviceInfo.value = data.data.num || '0'
          this.deviceInfo.time = this.getTimeString(new Date())
          if (data.data.num >= 0) { // 判断状态
            let value = Number(data.data.num)
            console.log(this.deviceInfo.bascicYuzhi)
            if (this.deviceInfo.bascicYuzhi.length === 2) {
              if (value < this.deviceInfo.bascicYuzhi[0]) {
                this.deviceInfo.status = '正常'
                this.deviceInfo.colorIndex = 2
              } else if (value >= this.deviceInfo.bascicYuzhi[0] && value < this.deviceInfo.bascicYuzhi[1]) {
                this.deviceInfo.status = '一级预警'
                this.deviceInfo.colorIndex = 3
              } else if (value >= this.deviceInfo.bascicYuzhi[1]) {
                this.deviceInfo.status = '二级预警'
                this.deviceInfo.colorIndex = 4
              }
            } else if (this.deviceInfo.bascicYuzhi.length === 4) {
              if (value < this.deviceInfo.bascicYuzhi[0]) {
                this.deviceInfo.status = '低低限预警'
                this.deviceInfo.colorIndex = 0
              } else if (value >= this.deviceInfo.bascicYuzhi[0] && value < this.deviceInfo.bascicYuzhi[1]) {
                this.deviceInfo.status = '低限预警'
                this.deviceInfo.colorIndex = 1
              } else if (value >= this.deviceInfo.bascicYuzhi[1] && value < this.deviceInfo.bascicYuzhi[2]) {
                this.deviceInfo.status = '正常'
                this.deviceInfo.colorIndex = 2
              } else if (value >= this.deviceInfo.bascicYuzhi[2] && value < this.deviceInfo.bascicYuzhi[3]) {
                this.deviceInfo.status = '高限预警'
                this.deviceInfo.colorIndex = 3
              } else if (value >= this.deviceInfo.bascicYuzhi[3]) {
                this.deviceInfo.status = '高高限预警'
                this.deviceInfo.colorIndex = 4
              }
            }
          }

          let yuzhi = this.deviceInfo.bascicYuzhi
          if (this.deviceInfo.bascicYuzhi.length === 2) { // 填充阈值数组为4位
            yuzhi = [0, 0].concat(yuzhi)
          }
          this.chartData1 = { // 仪表盘
            title: this.deviceInfo.type,
            value: Number(this.deviceInfo.value),
            max: activeParameter.maxRange,
            min: activeParameter.minRange,
            threshold: yuzhi, // 阈值
            danwei: this.deviceInfo.danwei
          }
          if (this.chartData2.length > 10) {
            this.chartData2.shift()
          }
          this.chartData2.push({ // 实时折线图
            name: this.deviceInfo.time.split(' ')[1],
            value: [
              this.deviceInfo.time.split(' ')[1],
              this.deviceInfo.value
            ],
            max: activeParameter.maxRange,
            min: activeParameter.minRange,
            threshold: yuzhi
          })
        }
      })
    },
    handleTabClick () { // 切换tab事件,
      clearInterval(this.setInterval)
      this.chartData1 = [] // 清空仪表数据
      this.chartData2 = []

      let activeParameter = this.parameter[this.activeIndex] // 当前tab点击的仪表
      this.deviceInfo = { // 重置仪表信息
        type: this.formatType(activeParameter.type),
        status: '正常',
        value: '0',
        colorIndex: 2,
        danwei: activeParameter.unit,
        time: '查询中',
        hasYuzhi: true,
        bascicYuzhi: []
      }
      // 填充阈值数组
      if (activeParameter.parameter) {
        if (activeParameter.parameter.lowerLowerLimit) {
          this.deviceInfo.bascicYuzhi.push(Number(activeParameter.parameter.lowerLowerLimit))
        }
        if (activeParameter.parameter.lowerLimit) {
          this.deviceInfo.bascicYuzhi.push(Number(activeParameter.parameter.lowerLimit))
        }
        this.deviceInfo.bascicYuzhi.push(Number(activeParameter.parameter.highLimit))
        this.deviceInfo.bascicYuzhi.push(Number(activeParameter.parameter.highHighLimit))
      } else {
        this.deviceInfo.hasYuzhi = false
        this.deviceInfo.bascicYuzhi = [activeParameter.minRange, activeParameter.minRange, activeParameter.maxRange, activeParameter.maxRange]
      }

      this.getPanelInfo() // 获取实时数据
      this.refreshData()
    },
    searchHistory () { //  查询历史仪表数据
      this.realTimeType = false
      let activeParameter = this.parameter[this.activeIndex] // 当前tab点击的仪表
      let yuzhi = this.deviceInfo.bascicYuzhi
      if (this.deviceInfo.bascicYuzhi.length === 2) { // 填充阈值数组为4位
        yuzhi = [0, 0].concat(yuzhi)
      }
      historyData({
        startTime: this.searchForm.dateTime[0],
        endTime: this.searchForm.dateTime[1],
        code: this.objectInfo.code
      }).then(({ data }) => {
        if (data.code === 0 && data.page.list.length > 0) {
          data.page.list.map(r => {
            this.chartData3.push({ // 实时折线图
              name: r.createDate.split(' ')[1],
              value: [
                r.createDate.split(' ')[1],
                r.num
              ],
              max: activeParameter.maxRange,
              min: activeParameter.minRange,
              threshold: yuzhi
            })
          })
        } else {
          this.chartData3 = []
        }
      }).catch(err => {
        console.log(err)
      })
    },
    switchHandle () {
      if (this.realTimeType === true) {
        this.searchForm.dateTime = []
        this.chartData3 = []
      }
    },
    handleClose () {
      this.$emit('input', false)
    },
    // 从字典表获取仪表类型
    async getPanelType () {
      await getLabels({
        type: 'METER_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.panelTypeList = data.list
        }
      })
    },
    getTimeString (t) {
      let m = t.getMonth() + 1
      return t.getFullYear() + '年' + m.toString().padStart(2, '0') + '月' +
        t.getDate().toString().padStart(2, '0') + '日 ' + t.getHours().toString().padStart(2, '0') + ':' +
        t.getMinutes().toString().padStart(2, '0') + ':' + t.getSeconds().toString().padStart(2, '0')
    },
    formatType (val) {
      let name = ''
      this.panelTypeList.map(value => {
        if (val === value.label) {
          name = value.value
        }
      })
      return name
    }
  },
  beforeDestroy () {
    clearInterval(this.setInterval)
  }
}
</script>

<style lang='scss'>
.device-monitor-container {
  .gauge-chart {
    width: 100%;
    height: 200px;
  }
  .el-dialog__body {
    padding: 0px 20px 20px 20px;
  }
  .monitor-items {
    font-size: 12px;
    height: 200px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    line-height: 20px;
    .monitor-item {
      display: flex;
      flex-direction: row;
      .item-name {
        white-space: nowrap;
      }
      .item-value {
        color: #000;
      }
    }
  }
  .el-date-editor {
    width: 219px;
  }
  .el-date-editor .el-range-separator {
    padding: 0 0px;
  }
}
</style>
