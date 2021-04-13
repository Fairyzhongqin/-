
<!--
 * @Descripttion: 设备监控组件
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-11-18 17:39:45
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-11-19 22:51:32
 -->
<template>
  <el-dialog title="实时监测"
             class="device-monitor-container"
             :close-on-click-modal="false"
             :visible.sync="visible"
             append-to-body
             width="620px"
             @close="handleClose">

    <el-tabs v-model="activeName"
             @tab-click="handleTabClick">
      <el-tab-pane v-for="(item, index) in parameter"
                   :key="index"
                   :label="formatType(item.type)"
                   :name="item.code">
        <el-row style="border-bottom:1px solid #DCDFE6">
          <el-col :span="10"
                  class="monitor-items">
            <div class="monitor-item">
              <div class="item-name">监测点名称：</div>
              <div class="item-value">{{monitorName}}</div>
            </div>
            <div class="monitor-item">
              <div class="item-name">设备状态：</div>
              <div class="item-value">
                <el-tag size="mini"
                        style="color:#fff;"
                        :color="statusColorList[deviceInfo.status]">{{statusNameList[deviceInfo.status]}}</el-tag>
              </div>
            </div>
            <div class="monitor-item">
              <div class="item-name">当前数值：</div>
              <div class="item-value">{{deviceInfo.value+item.unit}}</div>
            </div>
            <div class="monitor-item">
              <div class="item-name">更新时间：</div>
              <div class="item-value">{{deviceInfo.time}}</div>
            </div>
            <div class="monitor-item">
              <div class="item-name">阈值：</div>
              <div class="item-value">
                <span v-if="item.type ==='0'">
                  {{'低低位限:' + (item.lowerLowerLimit ? item.lowerLowerLimit : '0')}}
                  {{'低位限:' + (item.lowerLimit ? item.lowerLimit : '0')}}
                  {{'高位限:' + (item.highLimit ? item.highLimit : '0')}}
                  {{'高高位限:' + (item.highHighLimit ? item.highHighLimit : '0')}}
                </span>
                <span v-else>
                  {{'一级预警:' + (item.highLimit ? item.highLimit :'0')}}
                  {{'二级预警:' + (item.highHighLimit ? item.highHighLimit :'0')}}
                </span>

              </div>
            </div>
          </el-col>
          <el-col :span="14">
            <gauge-chart class="gauge-chart"
                         :chartData="chartData1"
                         :ref="'gaugeChart'+index"
                         :index="index"></gauge-chart>
          </el-col>
        </el-row>
        <el-form :model="searchForm"
                 :inline="true"
                 ref="dataForm"
                 style="margin-top:10px;">
          <el-form-item label="查询范围">
            <el-date-picker v-model="searchForm.dateTime"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right"
                            size="mini">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-row>
              <el-button type="primary"
                         size="mini"
                         icon="el-icon-search">
                查询</el-button>
              <el-button type="info"
                         size="mini"
                         icon="el-icon-refresh-right">重置</el-button>
              <el-switch v-model="realTimeType"
                         style="margin-left: 15px;"
                         active-text="实时"
                         inactive-text="">
              </el-switch>
            </el-row>
          </el-form-item>
        </el-form>
        <real-time-line-chart :chartData="realTimeType?chartData2:chartData3"
                              :ref="'realTimeChart'+index"
                              :index="index"></real-time-line-chart>
      </el-tab-pane>
    </el-tabs>

  </el-dialog>
</template>

<script>
import gaugeChart from './gaugeChart'
import { getLabels } from '@/api/common/sys'
import realTimeLineChart from './realTimeLineChart'
import { parameterList } from '@/api/sou/parameter'
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
      parameter: [],
      realTimeType: true, // 是否为实时数据
      monitorName: '', // 监测点名
      activeName: '', // tab当前所选的tab名
      activeTitleName: '', // 仪表名称
      activeCode: '', // 仪表位号
      bascicYuzhi: [], // 初始化阈值
      tabIndex: 0, // tab目录
      visible: this.value,
      panelTypeList: [],
      searchForm: {
        dateTime: []
      },
      pickerOptions: {
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
      },
      deviceInfo: {
        status: 2,
        value: '0',
        time: this.getTimeString(new Date()),
        yuzhi: []
      },
      setInterval: null,
      chartData1: {}, // 仪表盘数据
      chartData2: [], // 折线图数据
      chartData3: [], // 历史记录
      statusNameList: ['低低限警告', '低限警告', '正常', '高限警告', '高高限警告'],
      statusColorList: ['#FF5400', '#FFB820', '#02B22B', '#FFB820', '#FF5400']
    }
  },
  created () {
    this.getPanelType()
  },
  mounted () {
  },
  beforeDestroy () {
    clearInterval(this.setInterval)
  },
  computed: {},
  watch: {},
  methods: {
    // 从字典表获取仪表类型
    getPanelType () {
      getLabels({
        type: 'METER_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.panelTypeList = data.list
        }
      })
    },
    // 初始化界面信息
    init (info) {
      this.monitorName = info.name
      this.$nextTick(() => {
        parameterList({
          businessId: info.id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            if (data.list.length > 0) {
              this.parameter = data.list
              console.log(data.list)
              this.visible = true
              this.activeTitleName = this.formatType(this.parameter[0].type)
              this.activeName = this.parameter[0].code
              this.activeCode = this.parameter[0].code
              this.bascicYuzhi = [
                this.parameter[0].lowerLowerLimit ? Number(this.parameter[0].lowerLowerLimit) : 0,
                this.parameter[0].lowerLimit ? Number(this.parameter[0].lowerLimit) : 0,
                Number(this.parameter[0].highLimit),
                Number(this.parameter[0].highHighLimit)
              ]
              this.getPanelInfo(this.activeCode)
              this.refreshData()
            } else {
              this.visible = false
              this.$message.error('暂无仪表开启')
            }
          }
        })
      })
    },
    handleTabClick (event) {
      this.tabIndex = event.index // 写入当前tab的index
      this.chartData1 = []
      this.chartData2 = []
      this.activeCode = this.parameter[event.index].code
      this.activeTitleName = this.formatType(this.parameter[event.index].type)
      this.activeName = this.parameter[event.index].code
      this.bascicYuzhi = [this.parameter[event.index].lowerLowerLimit ? this.parameter[event.index].lowerLowerLimit : 0, this.parameter[event.index].lowerLimit ? this.parameter[event.index].lowerLimit : 0, this.parameter[event.index].highLimit, this.parameter[event.index].highHighLimit]

      this.getPanelInfo(this.activeCode)
      this.$nextTick(() => {
        this.$refs['gaugeChart' + event.index][0].resize()
        this.$refs['realTimeChart' + event.index][0].resize()
      })
    },
    refreshData (data) {
      this.setInterval = setInterval(() => {
        let time = this.getTimeString(new Date())
        this.getPanelInfo(this.activeCode)
        if (this.deviceInfo.value < this.deviceInfo.yuzhi[0]) {
          this.deviceInfo.status = 0
        } else if (this.deviceInfo.value < this.deviceInfo.yuzhi[1] && this.deviceInfo.value > this.deviceInfo.yuzhi[0]) {
          this.deviceInfo.status = 1
        } else if (this.deviceInfo.value < this.deviceInfo.yuzhi[2] && this.deviceInfo.value > this.deviceInfo.yuzhi[1]) {
          this.deviceInfo.status = 2
        } else if (this.deviceInfo.value < this.deviceInfo.yuzhi[3] && this.deviceInfo.value > this.deviceInfo.yuzhi[2]) {
          this.deviceInfo.status = 3
        } else if (this.deviceInfo.value > this.deviceInfo.yuzhi[3]) {
          this.deviceInfo.status = 4
        }
        this.chartData1 = {
          title: this.activeTitleName,
          value: Number(this.deviceInfo.value),
          danwei: this.parameter[this.tabIndex].unit,
          max: this.parameter[this.tabIndex].maxRange,
          min: this.parameter[this.tabIndex].minRange,
          threshold: this.deviceInfo.yuzhi // 阈值
        }
        if (this.chartData2.length > 10) {
          this.chartData2.shift()
        }
        this.chartData2.push({
          name: time,
          max: this.parameter[this.tabIndex].maxRange,
          min: this.parameter[this.tabIndex].minRange,
          value: [
            time,
            Number(this.deviceInfo.value)
          ]
        })
      }, 3000)
    },
    // 封装获取实时数据
    getPanelInfo (code) {
      realTimeData({
        code: code
      }).then(({ data }) => {
        if (data.data && data.code === 0) {
          this.deviceInfo.value = data.data.num || ''
          this.deviceInfo.time = this.getTimeString(new Date())
          this.deviceInfo.yuzhi = this.bascicYuzhi
          console.log('实时数据', data)
        }
      })
    },
    handleClose () {
      this.$emit('input', false)
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
    width: 217px;
  }
  .el-date-editor .el-range-separator {
    padding: 0 0px;
  }
  .colorStyle {
    color: #13ce66;
  }
}
</style>
