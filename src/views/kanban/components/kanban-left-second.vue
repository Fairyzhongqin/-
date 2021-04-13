<template>
  <div class='kanban-left-second-echarts'>
    <el-row style="padding-left:10px;padding-right:16px;padding-top:20px">
      <el-col align='left'
              class="kanban-left-title"
              :span="12">在岗在位驾驶舱</el-col>
      <el-col :span="12"
              class="kanban-left-title-all"
              align='right'>更多详情></el-col>
      <el-col :span="24">
        <div class="kanban-border-top"></div>
        <div class="kanban-border-bottom"></div>
      </el-col>
    </el-row>

    <!-- <div class="kanban-left-title"></div> -->

    <div id="J_chartBarBox"
         class="chart-box"></div>
    <!-- <div class="kanban-left-second-border"></div> -->
    <div id="J_chartPieBox"
         class="chart-box"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  components: {},
  data () {
    return {

      chartBar: null,
      chartPie: null,
      dataArr: [{ 'name': '临时人员', 'count': 14, 'lable': 0 }, { 'name': '外协人员', 'count': 16, 'lable': 1 }, { 'name': '承包商', 'count': 5, 'lable': 2 }, { 'name': '内部员工', 'count': 6, 'lable': 3 }]
    }
  },
  created () { },
  mounted () {
    this.initChartBar()
    this.initChartPie()
  },
  computed: {},
  watch: {},
  methods: {

    initChartBar () {
      // let _this = this
      let xArr = []
      let yArr = []
      this.dataArr.map(res => {
        xArr.push(res.name)
        yArr.push(res.count)
      })

      var option = {
        legend: {
          textStyle: {
            color: '#fff'
          },
          color: '#fff',
          data: ['临时人员', '外协人员', '承包商', '内部员工']
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          right: '20px',
          top: '20%',
          bottom: '0',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            show: true,
            interval: 0,
            color: '#FFF',
            fontSize: 10
          },
          axisLine: {
            lineStyle: {
              color: '#FFF'
            }
          },
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#FFF'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#FFF',
              opacity: 0.3
            }
          }
        },
        series: [{
          name: '临时人员',
          type: 'bar',
          data: [8, 6, 8, 2, 5, 4, 2],
          itemStyle: {
            normal: {
              color: '#FA8923',
              opacity: 1
            }
          }
        }, {
          name: '外协人员',
          type: 'bar',
          data: [5, 12, 5, 18, 5, 9, 7],
          itemStyle: {
            normal: {
              color: '#4cbfff',
              opacity: 1
            }
          }
        }, {
          name: '承包商',
          type: 'bar',
          data: [7, 5, 9, 10, 1, 9, 4],
          itemStyle: {
            normal: {
              color: '#53F1F2',
              opacity: 1
            }
          }
        }, {
          name: '内部员工',
          type: 'bar',
          data: [8, 5, 7, 6, 5, 8, 12],
          itemStyle: {
            normal: {
              color: '#103D76',
              opacity: 1
            }
          }
        }]
      }
      this.chartBar = echarts.init(document.getElementById('J_chartBarBox'))
      this.chartBar.setOption(option)
      window.addEventListener('resize', () => {
        this.chartBar.resize()
      })
    },
    initChartPie () {
      // let _this = this
      let arr = []
      let title = []
      let dataArr = [{ name: '生产车间1', count: 45 }, { name: '化工检测室', count: 64 }, { name: '东一区', count: 21 }, { name: '设备监控室', count: 31 }]
      dataArr.map(res => {
        title.push(res.name)
        arr.push({
          name: res.name,
          value: res.count
        })
      })
      let option = {
        // title: {
        //   text: '区域访客记录',
        //   x: 'center',
        //   textStyle: {
        //     color: '#fff',
        //     fontSize: 14,
        //     fontWeight: 0
        //   }
        // },
        // backgroundColor: '#0B1837',
        color: ['#EAEA26', '#906BF9', '#FE5656', '#01E17E'],
        grid: {
          left: '50%',
          right: '20px',
          top: '20%',
          bottom: '0',
          containLabel: true
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          type: 'scroll',
          orient: 'vartical',
          // x: "right",
          top: 'center',
          right: '15',
          // bottom: "0%",
          itemWidth: 16,
          itemHeight: 8,
          itemGap: 16,
          textStyle: {
            color: '#A3E2F4',
            fontSize: 12,
            fontWeight: 0
          },
          data: title
        },
        polar: {},
        angleAxis: {
          interval: 1,
          type: 'category',
          data: [],
          z: 10,
          axisLine: {
            show: false,
            lineStyle: {
              color: '#0B4A6B',
              width: 2,
              type: 'solid'
            }
          },
          axisLabel: {
            interval: 0,
            show: true,
            color: '#0B4A6B',
            margin: 8,
            fontSize: 16
          }
        },
        radiusAxis: {
          min: 40,
          max: 120,
          interval: 20,
          axisLine: {
            show: false,
            lineStyle: {
              color: '#0B3E5E',
              width: 1,
              type: 'solid'
            }
          },
          axisLabel: {
            formatter: '{value} %',
            show: false,
            padding: [0, 0, 20, 0],
            color: '#0B3E5E',
            fontSize: 16
          },
          splitLine: {
            lineStyle: {
              color: '#0B3E5E',
              width: 2,
              type: 'solid'
            }
          }
        },
        calculable: true,
        series: [{
          type: 'pie',
          radius: ['30%', '40%'],
          hoverAnimation: false,
          labelLine: {
            normal: {
              show: false,
              length: 30,
              length2: 55
            },
            emphasis: {
              show: false
            }
          },
          data: [{
            name: '',
            value: 0,
            itemStyle: {
              normal: {
                color: '#0B4A6B'
              }
            }
          }]
        }, {
          type: 'pie',
          radius: ['90%', '95%'],
          hoverAnimation: false,
          labelLine: {
            normal: {
              show: false,
              length: 30,
              length2: 55
            },
            emphasis: {
              show: false
            }
          },
          name: '',
          data: [{
            name: '',
            value: 0,
            itemStyle: {
              normal: {
                color: '#0B4A6B'
              }
            }
          }]
        }, {
          stack: 'a',
          type: 'pie',
          radius: ['20%', '80%'],
          roseType: 'area',
          zlevel: 10,
          label: {
            normal: {
              show: true,
              formatter: '{c}',
              textStyle: {
                fontSize: 12
              },
              position: 'outside'
            },
            emphasis: {
              show: true
            }
          },
          labelLine: {
            normal: {
              show: true,
              length: 20,
              length2: 55
            },
            emphasis: {
              show: false
            }
          },
          data: arr
        }]
      }
      this.chartPie = echarts.init(document.getElementById('J_chartPieBox'))
      this.chartPie.setOption(option)
      window.addEventListener('resize', () => {
        this.chartPie.resize()
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.kanban-left-second-echarts {
  .chart-box {
    min-height: 20vh;
  }
  .kanban-left-title {
    color: #fff;
    font-size: 14px;
    margin-bottom: 4px;
  }
  .kanban-left-title-all {
    color: #fff;
    font-size: 12px;
    margin-bottom: 4px;
  }
  // .kanban-left-second-border {
  //   background-image: linear-gradient(
  //     90deg,
  //     rgba(237, 240, 244, 0) 6%,
  //     #eef1f5 35%,
  //     #eef1f5 64%,
  //     rgba(238, 241, 243, 0) 84%
  //   );
  //   width: 34vw;
  //   height: 1px;
  //   margin-bottom: 30px;
  //   margin-top: 20px;
  // }
}
</style>
<style lang="scss">
.kanban-border-top {
  border-bottom: 2px solid #00c6ff;
  width: 100%;
}
.kanban-border-bottom {
  width: 40%;
  border-bottom: #00c6ff 2px solid;
}
</style>
