<template>
  <div class="contratChart mod-config">
    <!-- <div class="workTime">作业时间top10</div> -->
    <el-form :inline="true" ref="dataForm" :model="dataForm" class="el-form-margin-bottom formStyle" @keyup.enter.native="getChartData()">
      <el-form-item label="日期范围" prop="dateRange">
        <el-date-picker v-model="dataForm.dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions1" clearable>
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getChartData()" v-waves>
          <i class="el-icon-search"></i>
          查询</el-button>

      </el-form-item>
    </el-form>
    <div class="workTime">作业时长top10</div>
    <div class="workHas">
      <div class="selectType">
        <span>作业类型:</span>
        <el-select v-model="workType" @change="handleWorkSelect">
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">

          </el-option>
        </el-select>
      </div>
      <div class="orderStyle">
        <el-radio v-model="workOrder" @change='handleWork()' label="0">正序</el-radio>
        <el-radio v-model="workOrder" @change='handleWork()' label="1">倒序</el-radio>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="outline">
          <p class="cbsTitle">承包商作业总时长</p>
          <div id="workStaticChartone" v-loading="dataListLoading" class="chart-boxs">
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="outline">
          <p class="cbsTitle">承包商作业平均时长</p>
          <div id="workStaticChartwo" v-loading="dataListLoading" class="chart-boxs"></div>
        </div>
      </el-col>
    </el-row>
    <div class="workTime">违规次数top10</div>
    <div class="weiguiHas">
      <div class="orderStyle">
        <el-radio v-model="weiguiOrder" @change='handleWeigui()' label="0">正序</el-radio>
        <el-radio v-model="weiguiOrder" @change='handleWeigui()' label="1">倒序</el-radio>
      </div>
    </div>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="outline">
          <p class="cbsTitle">承包商违规总次数</p>
          <div id="workStaticCharthree" v-loading="dataWeiguiLoading" class="chart-boxs"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="outline">
          <p class="cbsTitle">承包商违规平均次数</p>
            <div id="workStaticCharfour" v-loading="dataWeiguiLoading" class="chart-boxs"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import echarts from 'echarts'
import waves from '@/utils/waves'
import { contractorWorkTime, contractorWeigui } from '@/api/pos/person'

export default {
  directives: {
    waves
  },
  data () {
    return {
      chartOne: null,
      chartTwo: null,
      chartThree: null,
      chartFour: null,
      workOrder: '0', // 作业排序
      weiguiOrder: '0', // 违规排序
      workType: 'dhWork', // 作业类型
      todayDate: '', // 今日日期
      lastDate: '', // 上个月日期
      dataForm: {
        dateRange: [],
        type: ''
      },
      typeList: [
        {
          value: 'dhWork',
          label: '动火作业'
        },
        {
          value: 'sxkjWork',
          label: '受限空间作业'
        },
        {
          value: 'mbczWork',
          label: '盲板抽堵作业'
        },
        {
          value: 'dtWork',
          label: '动土作业'
        },
        {
          value: 'dlWork',
          label: '断路作业'
        },
        {
          value: 'gcWork',
          label: '高处作业'
        },
        {
          value: 'lsydWork',
          label: '临时用电作业'
        },
        {
          value: 'dzWork',
          label: '吊装作业'
        }
      ], // 八大类型
      workTotalData: [], // 作业总时长chart数据
      workAverage: [], // 作业平均时长chart数据
      weiguiTotalData: [], // 违规总时长chart数据
      weiguiAverageData: [], // 违规平均chart数据
      dataListLoading: false,
      dataWeiguiLoading: false,
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      }
    }
  },
  created () {
    this.getChartData()
  },
  activated () {
    this.getChartData()
  },

  methods: {
    initWorkTotalChart () {
      let workTotalDataX = []
      let workTotalDataY = []
      if (this.workTotalData.length > 0) {
        // eslint-disable-next-line no-unused-vars
        this.workTotalData.map((val) => {
          workTotalDataX.push(val.CONTRACTORNAME)
          workTotalDataY.push((val.SUMHOUR).toFixed(1))
        })
      }
      let optionTotal = {
        tooltip: {

        },
        grid: {
          left: 30,
          right: 12,
          bottom: 40
        },
        xAxis: {

          type: 'category',
          data: workTotalDataX,
          axisLabel: {
            interval: 0,
            rotate: -40
          }
          // 设置坐标轴字体颜色和宽度

        },
        yAxis: {
          name: '单位/小时',

          type: 'value',

          axisLine: {
            lineStyle: {
              color: '#DCDFE6'
            }
          },

          axisTick: {
            show: false
          }

        },
        series: [
          {
            color: '#2C78BB',
            data: workTotalDataY,
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            barWidth: 20
          }
        ]
      }
      this.chartOne = echarts.init(
        document.getElementById('workStaticChartone')
      )
      this.chartOne.setOption(optionTotal)
      window.addEventListener('resize', () => {
        this.chartOne.resize()
      })
      this.dataListLoading = false
    },
    initWorkAverageChart () {
      let workAverageX = []
      let workAverageY = []
      if (this.workAverage.length > 0) {
        this.workAverage.map((val) => {
          workAverageX.push(val.CONTRACTORNAME)
          workAverageY.push((val.AVGHOUR).toFixed(1))
        })
      }

      var optionAverage = {
        tooltip: {},
        xAxis: {

          type: 'category',
          data: workAverageX,
          axisLabel: {
            interval: 0,
            rotate: -40
          }
        },
        grid: {
          left: 30,
          right: 18,
          bottom: 40
        },
        yAxis: {
          name: '单位/小时',
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#DCDFE6'
            }
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            color: '#E63031',
            data: workAverageY,
            type: 'bar',

            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            barWidth: 20

          }
        ]
      }
      this.chartTwo = echarts.init(
        document.getElementById('workStaticChartwo')
      )
      this.chartTwo.setOption(optionAverage)
      window.addEventListener('resize', () => {
        this.chartTwo.resize()
      })
      this.dataListLoading = false
    },
    initWeiguiTotalChart () {
      let weiguiTotalDataX = []
      let weiguiTotalDataY = []
      if (this.weiguiTotalData.length > 0) {
        this.weiguiTotalData.map((val) => {
          weiguiTotalDataX.push(val.CONTRACTORNAME)
          weiguiTotalDataY.push((val.SUMCOUNT).toFixed(1))
        })
      }
      var optionWeigui = {
        tooltip: {},
        grid: {
          left: 30,
          right: 18,
          bottom: 40
        },
        xAxis: {

          type: 'category',
          data: weiguiTotalDataX,
          axisLabel: {
            interval: 0,
            rotate: -40
          }
        },
        yAxis: {
          name: '单位/次',
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#DCDFE6'
            }
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            color: '#E6A23C',
            data: weiguiTotalDataY,
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            barWidth: 20

          }
        ]
      }
      this.chartThree = echarts.init(
        document.getElementById('workStaticCharthree')
      )
      this.chartThree.setOption(optionWeigui)
      window.addEventListener('resize', () => {
        this.chartThree.resize()
      })
      this.dataWeiguiLoading = false
    },
    initWeiguiAverageChart () {
      let weiguiAverageDataX = []
      let weiguiAverageDataY = []
      if (this.weiguiAverageData.length > 0) {
        this.weiguiAverageData.map((val) => {
          weiguiAverageDataX.push(val.CONTRACTORNAME)
          weiguiAverageDataY.push((val.AVGCOUNT).toFixed(1))
        })
      }
      var optionweiguiAverage = {
        tooltip: {},
        grid: {
          left: 30,
          right: 18,
          bottom: 40
        },
        xAxis: {

          type: 'category',
          data: weiguiAverageDataX,
          axisLabel: {
            interval: 0,
            rotate: -40
          }
        },
        yAxis: {
          name: '单位/次',
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#DCDFE6'
            }
          },
          axisTick: {
            show: false
          }
        },
        series: [
          {
            color: 'purple',
            data: weiguiAverageDataY,
            type: 'bar',
            label: {
              normal: {
                show: true,
                position: 'top'
              }
            },
            barWidth: 20

          }
        ]
      }
      this.chartFour = echarts.init(
        document.getElementById('workStaticCharfour')
      )
      this.chartFour.setOption(optionweiguiAverage)
      window.addEventListener('resize', () => {
        this.chartFour.resize()
      })
      this.dataWeiguiLoading = false
    },
    getDateMehod () {
      let date = new Date()
      let dateLast = new Date(date)
      dateLast.setDate(date.getDate() - 30)
      this.todayDate = date.toLocaleDateString()
      this.lastDate = dateLast.getFullYear() + '-' + (dateLast.getMonth() + 1) + '-' + dateLast.getDate()
      this.dataForm.dateRange[0] = new Date(this.lastDate).Format('yyyy-MM-dd')
      this.dataForm.dateRange[1] = new Date(this.todayDate).Format('yyyy-MM-dd')
    },
    // 作业总时长接口
    getWorkTotal () {
      this.dataListLoading = true

      contractorWorkTime({
        'endTime': new Date(this.dataForm.dateRange[1]).Format('yyyy-MM-dd'),
        'startTime': new Date(this.dataForm.dateRange[0]).Format('yyyy-MM-dd'),
        orderType: 'sumhour',
        sortType: this.workOrder ? this.workOrder : '1',
        workType: this.workType
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.workTotalData = data.contractorMap.contraMap
          this.initWorkTotalChart()
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('未知异常，请联系管理员')
      })
    },
    // 作业平均时长
    getWorkAverage () {
      this.dataListLoading = true

      contractorWorkTime({
        'endTime': new Date(this.dataForm.dateRange[1]).Format('yyyy-MM-dd'),
        'startTime': new Date(this.dataForm.dateRange[0]).Format('yyyy-MM-dd'),
        orderType: 'avghour',
        sortType: this.workOrder ? this.workOrder : '1',
        workType: this.workType

      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.workAverage = data.contractorMap.contraMap

          this.initWorkAverageChart()
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('未知异常，请联系管理员')
      })
    },
    // 违规总次数
    getWeiguiTotal () {
      this.dataWeiguiLoading = true
      contractorWeigui({
        'endTime': new Date(this.dataForm.dateRange[1]).Format('yyyy-MM-dd'),
        'startTime': new Date(this.dataForm.dateRange[0]).Format('yyyy-MM-dd'),
        orderType: 'sumcount',
        sortType: this.weiguiOrder ? this.weiguiOrder : '1'

      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.weiguiTotalData = data.contractorMap.contraMap
          this.initWeiguiTotalChart()
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('未知异常，请联系管理员')
      })
    },
    // 违规平均次数
    getWeiguiAverage () {
      this.dataWeiguiLoading = true
      contractorWeigui({
        'endTime': new Date(this.dataForm.dateRange[1]).Format('yyyy-MM-dd'),
        'startTime': new Date(this.dataForm.dateRange[0]).Format('yyyy-MM-dd'),
        orderType: 'avgcount',
        sortType: this.weiguiOrder ? this.weiguiOrder : '1'

      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.weiguiAverageData = data.contractorMap.contraMap
          this.initWeiguiAverageChart()
        }
      })
    },
    // 总的实现全部地图展示
    async getChartData () {
      await this.getDateMehod()
      this.handleWork()
      this.handleWeigui()
      this.handleWeigui()
      this.handleWorkSelect()
    },
    // 作业排序变化时
    handleWork () {
      this.getWorkTotal()
      this.getWorkAverage()
    },
    // 违规排序变化时
    handleWeigui () {
      this.getWeiguiTotal()
      this.getWeiguiAverage()
    },
    // 作业类型变化时
    handleWorkSelect () {
      this.dataListLoading = true
      this.getWorkTotal()
      this.getWorkAverage()
    }

  }
}
</script>
<style lang="scss">
.contratChart {
  .chart-boxs {
    width: 100%;
    min-height: 300px;
    margin-bottom: 5px;
  }
  .workTime {
    padding: 5px 0;
    text-align: center;
    width: 130px;
    font-size: 16px;
    font-weight: 700;
    border-bottom: 1px solid #2c78bb;
    margin-top: 10px;
  }

  .formStyle {
    /deep/ .el-range-editor--medium.el-input__inner {
      height: 28px;
      // margin-top: 5px;
    }
    /deep/ .el-date-editor .el-range-separator {
      padding: 0px 0px;
    }

    /deep/ .el-range-editor.el-input__inner {
      padding: 0px 10px;
    }
  }
  .workHas {
    display: flex;
    justify-content: space-between;
    .selectType {
      margin-left: 211px;
      margin-left: 27px;
      margin-top: 30px;

      .el-input--medium .el-input__inner {
        height: 28px;
        line-height: 28px;
      }
      /deep/ .el-input__prefix,
      .el-input__suffix {
        position: absolute;
        top: 5px;
      }
    }
    .orderStyle {
      margin-top: 30px;
      margin-right: 56px;
    }
  }
  .weiguiHas {
    display: flex;
    justify-content: flex-end;
    .orderStyle {
      margin-top: 20px;
      margin-right: 56px;
    }
  }
  .cbsTitle {
    width: 100%;
    height: 32px;
    line-height: 32px;
    padding-left: 10px;
    background-color: #d3d7de;
    margin-bottom: -24px;
    margin-top: 0;
  }
  .outline {
    margin-left: 17px;
    margin-top: 10px;
    width: 90%;
    border: 1px solid #dcdfe6;
  }
}
</style>
