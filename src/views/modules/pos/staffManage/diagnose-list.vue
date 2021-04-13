<!--区域热度统计-->
<template>
  <div class="person-diagnose mod-config">
    <!--搜索条件-->
    <el-form :inline="true" ref="dataForm" :model="dataForm" class="el-form-margin-bottom" @keyup.enter.native="getDataList()">
      <el-form-item label="员工姓名" prop="name">
        <el-input v-model="dataForm.name" size="mini" placeholder="员工姓名" clearable></el-input>
      </el-form-item>
      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" v-waves>
          <i class="el-icon-search"></i>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="
                   resetForm('dataForm')" v-waves>重置</el-button>
      </el-form-item>

    </el-form>
    <div class="top clearfix">
      <div class="personName">
        <div class="personImg">
          <img src="~@/assets/img/staffIcon.png" alt="">
        </div>
        <div class="personStatus">
          <span>{{userName || '-'}}</span>
          <span :class="{on:dataForm.status==='0',off:dataForm.status==='1'}">{{dataForm.status==='0'?'在线':'离线'}}</span>
        </div>
        <div class="workDays">
          <span>本月出勤天数</span>
          <span>{{dataForm.workDays}}</span>
        </div>
        <div class="workHours">
          <span>本月出勤时长</span>
          <span>{{dataForm.workHours}}</span>
        </div>
        <div class="touchWarning">
          <span>本月触发报警</span>
          <span>{{dataForm.warningNum}}</span>
        </div>
      </div>
      <div class="dateTime">
        <el-tooltip class="item" effect="dark" content="出勤情况" :visible-arrow="false" placement="top">
          <icon-svg name="wenhao">
          </icon-svg>
        </el-tooltip>
        <Calendar ref="Calendar" v-on:choseDay="clickDay" v-on:changeMonth="changeDate" :futureDayHide="disabledTime" class="calenderStyle"></Calendar>
        <el-divider></el-divider>
        <div class="detail">
          <span>
            {{month+'月'+day+'日，工时共计8小时'}}
          </span>
          <div class="enterTime">
            <i>入</i>
            <span>上班时间:08:52</span>
          </div>
          <div class="outTime">
            <i class="ernter">出</i>
            <span>下班时间:17:52</span>
          </div>
        </div>
      </div>
      <div class="nowMonth">
        <div class="timeRatio">
          <p class="title">
            本月各区域停留时间比
          </p>
          <!-- 饼状图 -->
          <div id="main1" style="width: 100%;height: 156px;">
          </div>
        </div>
        <div class="times">
          <div class="clearfix">
            <div class="timesLeft clearfix">
              <p class="title">
                本月各区域停留时长
              </p>
              <span class="unit">
                单位：分钟
              </span>
            </div>
            <div class="timesRight clearfix">
              <el-radio-group v-model="radio3" size="mini" @change="handleChange">
                <el-radio-button label="层级二"></el-radio-button>
                <el-radio-button label="层级三"></el-radio-button>
              </el-radio-group>
              <!-- <el-button type="primary"
                       size="mini">层级二</el-button>
            <el-button size="mini">层级三</el-button> -->
            </div>
          </div>
          <!-- 柱状图 -->
          <el-scrollbar style="height: 140px; width: 100%;overflow-y:hidden;margin-top: 10px;">
            <div id="main2" style="height: 140px;width: 100%;overflow-x:auto;overflow-y:hidden;">
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="bottom clearfix">
      <div class="dateStay">
        <p class="title">
          某日在各区域的停留情况
        </p>
        <span class="unit">
          单位：分钟
        </span>
        <div id="main3" style="height:calc(100% - 47px); width:100%;">
        </div>
      </div>
      <div class="workNum">
        <p class="title">
          特殊作业次数
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import waves from '@/utils/waves'
import Calendar from 'vue-calendar-component'
// import { getLabels } from '@/api/common/sys'
// import addOrUpdate from './zone-statics-add-or-update'
export default {
  directives: {
    waves
  },
  data () {
    return {
      arr2: ['2019/4/2', '2019/4/3', '2019/4/4'],
      dataForm: {
        name: '郭小果',
        status: '1',
        workDays: '8',
        workHours: '65时10分',
        warningNum: '2'
      },
      userName: '',
      radio3: '层级三',
      disabledTime: '',
      month: '',
      day: '',
      // 本月各区域停留时间的饼状图
      option1: {
        title: {
          x: 'center',
          y: 'center',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 22
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params, ticket, callback) {
            var res = params.seriesName
            res += '<br/>' + params.name + ' : ' + params.percent + '%'
            return res
          }
        },
        legend: {
          orient: 'vertical',
          left: '50%',
          bottom: '11%',
          icon: 'circle',
          itemWidth: 5,
          // itemHeight: 14,
          itemGap: 30, // 图例每项之间的间隔
          formatter: function (name) {
            var data = [{
              value: 11,
              name: '区域一'
            }, {
              value: 22,
              name: '区域二'
            }, {
              value: 33,
              name: '区域三'
            }, {
              value: 22,
              name: '区域四'
            }, {
              value: 33,
              name: '其他'
            }]
            var total = 0
            var target
            for (var i = 0, l = data.length; i < l; i++) {
              total += data[i].value
              if (data[i].name === name) {
                target = data[i].value
              }
            }
            var arr = [
              '{a|' + ((target / total) * 100).toFixed(2) + '%}',
              '{b|' + name + '}'
            ]
            return arr.join('\n')
          },
          textStyle: {
            rich: {
              a: {
                fontSize: 12,
                fontFamily: 'Source Han Sans CN',
                fontWeight: ' bold',
                color: '#222222'
              },
              b: {
                fontSize: 12,
                fontFamily: 'Source Han Sans CN',
                fontWeight: 500,
                color: '#767676'
              }
            }

          }
        },
        series: [{
          name: '停留时长',
          type: 'pie',
          selectedMode: 'single',
          radius: ['20%', '80%'],
          center: ['30%', '53%'],
          // label: {
          //   normal: {
          //     position: 'inner',
          //     textStyle: {
          //       color: '#fff',
          //       fontSize: 14
          //     }
          //   }
          // },
          // labelLine: {
          //   normal: {
          //     show: false
          //   }
          // },
          data: [{
            value: 11,
            name: '区域一'
          }, {
            value: 22,
            name: '区域二'
          }, {
            value: 33,
            name: '区域三'
          }, {
            value: 22,
            name: '区域四'
          }, {
            value: 33,
            name: '其他'
          }]
        }],
        color: ['rgba(62,128,235,1)', 'rgba(77,214,167,1)', 'rgba(240,197,64,1)', 'rgba(245,138,43,1)', 'rgba(240,102,102,1)']
      },
      // 本月各区域停留时长的柱状图
      option2: {
        color: ['#3E80EB'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        grid: {
          left: '0',
          right: '4%',
          bottom: '27%',
          containLabel: true,
          height: 95
        },
        xAxis: [
          {
            type: 'category',
            data: ['甲苯车间', '储罐12区', '办公楼4栋', '其他', '储罐13区', '后库房', '办公楼5栋', '测试区域1', '测试区域2', '测试区域3', '测试区域4'],
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed'
              }

            }
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            realtime: true, // 拖动滚动条时是否动态的更新图表数据
            height: 15, // 滚动条高度
            start: 30, // 滚动条开始位置（共100等份）
            end: 60 // 结束位置（共100等份）
          }
        ],
        series: [
          {
            // name: ['甲苯车间', '储罐12区', '办公楼4栋', '其他', '储罐13区', '后库房', '办公楼5栋'],
            type: 'bar',
            barWidth: '15%',
            data: [10, 52, 200, 334, 390, 330, 220, 234, 445, 555, 333]
          }
        ]
      },
      // 根据选择的日期查看各区域的停留情况
      option3: {
        color: ['#3E80EB', '#4DD6A7', '#F0C540'],
        legend: {
          show: false
        },
        tooltip: {
          trigger: 'item',
          formatter: function (params, ticket, callback) {
            var res = params.seriesName
            res += '<br/>' + params.name + ' : ' + params.value[1]
            return res
          }
        },
        grid: {
          left: '0',
          right: '4%',
          bottom: '15%',
          containLabel: true,
          height: 200
        },
        dataset: {
          source: [
            ['product', '甲苯车间', '苯乙烯车间', '苯丙烯车间'],
            ['8:30', 5, 10, 15],
            ['9:00', 6, 7, 44],
            ['9:30', 72, 53, 39],
            ['10:00', 86, 65, 82],
            ['10.30', 20, 53, 44],
            ['11:00', 16, 33, 20]
          ]
        },
        xAxis: [{
          type: 'category',
          data: ['8:30', '9:00', '9:30', '10:00', '10.30', '11:00'],
          axisLabel: {
            interval: 0// 代表显示所有x轴标签
          }
        }],
        yAxis: [{
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          }
        }],
        // Declare several bar series, each will be mapped
        // to a column of dataset.source by default.
        series: [
          {
            type: 'bar',
            barWidth: '20%'
          },
          {
            type: 'bar',
            barWidth: '25%'
          },
          {
            type: 'bar',
            barWidth: '30%'
          }
        ]
      }
    }
  },
  components: {
    Calendar
  },
  // 初始化方法
  mounted () {
    this.getDate()
    // this.getDate()  // 初始化时间
    // this.getAllZoneList() // 获得上级区域下拉框的值
    // this.getBaseData()  // 获取字典数据
  },
  // 声明所有的方法
  methods: {
    // 初始化时间
    getDate () {
      this.userName = this.dataForm.name
      // 禁止选中今天以后的时间
      this.disabledTime = Math.round(new Date().getTime() / 1000).toString()
      var date = new Date()
      this.month = date.getMonth() + 1// 获取当前月
      this.day = date.getDate() // 获取当前天
      // console.log(this.dataForm.dataRange)
      // 本月各区域停留时间的饼状图
      var myChart = echarts.init(document.getElementById('main1'))
      myChart.setOption(this.option1)
      // 本月各区域停留时长的柱状图
      var myChart1 = echarts.init(document.getElementById('main2'))
      myChart1.setOption(this.option2)
      // 根据选择的日期查看各区域的停留情况
      var myChart2 = echarts.init(document.getElementById('main3'))
      myChart2.setOption(this.option3)
      window.onresize = function () {
        myChart.resize()
        myChart1.resize()
        myChart2.resize()
      }
    },
    clickDay (data) {
      console.log(data) // 选中某天
      this.month = data.split('/')[1]
      this.day = data.split('/')[2]
    },
    changeDate (data) {
      console.log(data) // 左右点击切换月份
    },
    handleChange () {
      console.log(1111)
    },
    // 获得上级区域下拉框的值，并在加载结束后初始化table的list
    // getAllZoneList () {
    //   this.dataListLoading = true
    //   queryZoneInfo().then(({ data }) => {
    //     if (data && data.code === 0) {
    //       // console.log(data)
    //       this.zoneList = [data.data] || []
    //       this.dataForm.parentId = this.zoneList[0].id
    //       this.dataForm.zoneName = this.zoneList[0].zoneName
    //       this.getDataList()
    //     } else {
    //       this.zoneList = []
    //     }
    //     this.dataListLoading = false
    //   }).catch((err) => {
    //     console.log(err)
    //     this.$message.error('未知异常！请联系管理员')
    //     this.dataListLoading = false
    //   })
    // },
    // // 加载基础数据
    // getBaseData () {
    //   // 风险等级 - 字典
    //   getLabels({
    //     'type': 'risk_level'
    //   }).then(({ data }) => {
    //     if (data && data.code === 0) {
    //       this.typeList = data.list
    //     } else {
    //       this.$message.error(data.msg)
    //     }
    //   }).catch(err => console.log(err))
    //   // 区域类型
    //   getLabels({
    //     'type': 'SOUR_TYPE'
    //   }).then(({ data }) => {
    //     if (data && data.code === 0) {
    //       this.sourList = data.list
    //     } else {
    //       this.$message.error(data.msg)
    //     }
    //   }).catch(err => console.log(err))
    // },
    // // 获取数据列表
    getDataList () {
      this.userName = this.dataForm.name
      //   this.dataListLoading = true
      //   getZonePersonList({
      //     'parentId': this.dataForm.parentId,
      //     'endTime': this.dataForm.dataRange[1] ? new Date(this.dataForm.dataRange[1]).Format('yyyy-MM-dd') : '',
      //     'startTime': this.dataForm.dataRange[0] ? new Date(this.dataForm.dataRange[0]).Format('yyyy-MM-dd') : ''
      //   }).then(({ data }) => {
      //     if (data && data.code === 0) {
      //       this.dataList = data.list
      //       // this.totalPage = data.page.count
      //       // console.log(data)
      //     } else {
      //       this.dataList = []
      //       this.totalPage = 0
      //     }
      //     this.dataListLoading = false
      //   }).catch((err) => {
      //     console.log(err)
      //     this.$message.error('未知异常！请联系管理员')
      //     this.dataListLoading = false
      //   })
    },
    // // 菜单树选中
    // departListTreeCurrentChangeHandle (data, node) {
    //   // 当前节点的数据，对象
    //   this.dataForm.parentId = data.id
    //   this.dataForm.zoneName = data.zoneName
    //   this.popoverVisible = false
    // },
    // detailShow (data) {
    //   this.addOrUpdateVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.addOrUpdate.init(data, this.dataForm.dataRange)
    //   })
    // },
    // // 每页数
    // sizeChangeHandle (val) {
    //   this.pageSize = val
    //   this.pageIndex = 1
    //   this.getDataList()
    // },
    // // 当前页
    // currentChangeHandle (val) {
    //   this.pageIndex = val
    //   this.getDataList()
    // },
    // // 多选
    // selectionChangeHandle (val) {
    //   this.dataListSelections = val
    // },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
    }
  }
}
</script>
<style lang="scss">
.person-diagnose {
  .top {
    height: 380px;
    width: 100%;
    // background-color: orange;
    // overflow: hidden;
    .personName {
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      float: left;
      height: 100%;
      width: 210px;
      border: 1px solid #dcdfe6;
      margin-right: 8px;
      padding: 8px 0;
      font-family: PingFang SC;
      .personImg {
        height: 88px;
        width: 88px;
        text-align: center;
        line-height: 88px;
        background-color: #ccc;
        border-radius: 50%;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          vertical-align: top;
        }
      }
      .personStatus {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: -12px;
        span:first-child {
          font-size: 16px;
          font-weight: bold;
          color: rgba(34, 34, 34, 1);
        }
        span:last-child {
          font-size: 12px;
          line-height: 20px;
          font-weight: 500;
        }
        .on {
          color: rgba(52, 194, 170, 1);
        }
        .off {
          color: #ff4444;
        }
      }
      .workDays {
        display: flex;
        flex-direction: column;
        align-items: center;
        span:first-child {
          font-size: 12px;
          font-weight: 500;
          color: rgba(34, 34, 34, 1);
          line-height: 24px;
          opacity: 0.7;
        }
        span:last-child {
          font-size: 14px;
          font-weight: bold;
          color: rgba(34, 34, 34, 1);
          line-height: 20px;
        }
      }
      .workHours {
        display: flex;
        flex-direction: column;
        align-items: center;
        span:first-child {
          font-size: 12px;
          font-weight: 500;
          color: rgba(34, 34, 34, 1);
          line-height: 20px;
          opacity: 0.7;
        }
        span:last-child {
          font-size: 14px;
          font-weight: bold;
          color: rgba(42, 138, 255, 1);
          line-height: 30px;
        }
      }
      .touchWarning {
        display: flex;
        flex-direction: column;
        align-items: center;
        span:first-child {
          font-size: 12px;
          font-weight: 500;
          color: rgba(34, 34, 34, 1);
          line-height: 20px;
          opacity: 0.7;
        }
        span:last-child {
          font-size: 14px;
          font-weight: bold;
          color: rgba(42, 138, 255, 1);
          line-height: 20px;
          &:hover {
            cursor: pointer;
            text-decoration: underline;
          }
        }
      }
    }
    .dateTime {
      position: relative;
      float: left;
      height: 100%;
      width: 358px;
      border: 1px solid #dcdfe6;
      margin-right: 8px;
      padding: 20px 20px;
      .icon-svg {
        position: absolute;
        right: 5px;
        top: 5px;
        color: #2c78bb;
      }
      .wh_content_all[data-v-2ebcbc83] {
        width: 326px;
        height: 250px;
        background: #fff;
      }
      .wh_content[data-v-2ebcbc83] {
        padding: 0;
        width: 107%;
      }
      .wh_content_item {
        height: 28px;
        font-size: 12px;
        color: #222222;
      }
      .wh_content_item .wh_other_dayhide[data-v-2ebcbc83] {
        color: #c5c7ca;
      }
      .wh_jiantou1[data-v-2ebcbc83],
      .wh_jiantou2[data-v-2ebcbc83] {
        width: 9px;
        height: 9px;
        border-top: 2px solid #222222;
      }
      .wh_jiantou1[data-v-2ebcbc83] {
        border-left: 2px solid #222222;
      }
      .wh_jiantou2[data-v-2ebcbc83] {
        border-right: 2px solid #222222;
      }
      .wh_top_changge li[data-v-2ebcbc83] {
        font-size: 14px;
        font-weight: bold;
        color: #222222;
      }
      .wh_item_date[data-v-2ebcbc83]:hover {
        background: #2a8aff;
        color: #fff;
        border-radius: 2px;
      }
      .wh_content_item .wh_chose_day[data-v-2ebcbc83] {
        background-color: #2a8aff;
        color: #fff;
        border-radius: 3px;
      }
      .wh_item_date[data-v-2ebcbc83] {
        width: 28px;
        height: 28px;
        line-height: 28px;
      }
      .el-divider--horizontal {
        margin: 4px 0;
      }
      .detail {
        padding-left: 10px;
        span {
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(34, 34, 34, 1);
          line-height: 30px;
          opacity: 0.7;
        }
        .enterTime,
        .outTime {
          i {
            display: inline-block;
            height: 18px;
            width: 18px;
            line-height: 17px;
            text-align: center;
            border-radius: 50%;
            background-color: #ffcb2e;
            font-family: PingFang SC;
            font-style: normal;
            font-size: 12px;
            color: #fff;
          }
        }
        .outTime {
          i {
            background-color: #2c78bb;
          }
        }
      }
    }
    .nowMonth {
      float: left;
      height: 100%;
      width: calc(100% - 210px - 358px - 16px);
      /*min-width: 576px;*/
      padding: 7px 11px;
      border: 1px solid #dcdfe6;
      p {
        margin: 0;
      }
      .timeRatio {
        height: 197px;
      }
      .times {
        height: 187px;
        .timesLeft {
          float: left;
          .unit {
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: 500;
            color: rgba(34, 34, 34, 1);
            opacity: 0.5;
          }
        }
        .timesRight {
          float: right;
          .el-button + .el-button {
            margin-left: -5px;
          }
        }
        .el-scrollbar__bar.is-vertical > div {
          width: 0;
        }
      }
      .title {
        margin: 0;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(34, 34, 34, 1);
        line-height: 20px;
      }
      .el-scrollbar__wrap {
        overflow: hidden;
      }
    }
  }
  .bottom {
    height: calc(100% - 41px - 380px - 26px);
    width: 100%;
    margin-top: 8px;
    .dateStay {
      float: left;
      height: 100%;
      width: 576px;
      padding: 10px;
      border: 1px solid #dcdfe6;
      .title {
        margin: 0;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(34, 34, 34, 1);
        line-height: 30px;
      }
      .unit {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(34, 34, 34, 1);
        opacity: 0.5;
      }
    }
    .workNum {
      float: left;
      height: 100%;
      width: calc(100% - 576px - 8px);
      margin-left: 8px;
      border: 1px solid #dcdfe6;
      padding: 10px;
      .title {
        margin: 0;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(34, 34, 34, 1);
        line-height: 30px;
      }
    }
  }
  .clearfix:after {
    content: ''; /*设置内容为空*/
    height: 0; /*高度为0*/
    line-height: 0; /*行高为0*/
    display: block; /*将文本转为块级元素*/
    visibility: hidden; /*将元素隐藏*/
    clear: both; /*清除浮动*/
  }
  .clearfix {
    zoom: 1; /*为了兼容IE*/
  }
  ::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 5px;
  }
}
</style>
