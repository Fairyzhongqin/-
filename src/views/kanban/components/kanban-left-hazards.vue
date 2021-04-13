<template>
  <div class='kanban-left-hazards-echarts'>
    <el-row style="padding-left:10px;padding-right:16px;padding-top:20px">
      <el-col align='left'
              class="kanban-left-title"
              :span="12">重大危险源驾驶舱</el-col>
      <el-col :span="12"
              class="kanban-left-title-all"
              align='right'>更多详情></el-col>
      <el-col :span="24">
        <div class="kanban-border-top"></div>
        <div class="kanban-border-bottom"></div>
      </el-col>
    </el-row>
    <div id="J_chartBarBoxhazards"
         class="chart-boxs"></div>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  components: {},
  data () {
    return {

      chartBar: null,
      chartPie: null
    }
  },
  created () { },
  mounted () {
    // this.initChartBar()
  },
  computed: {},
  watch: {},
  methods: {
    initChartBar () {
      var option = {
        title: {
          // text: '危险源报警对比图',
          // x: 'center',
          // y: '-5',
          // textStyle: {
          //   fontSize: 16,
          //   color: '#fff'
          // }
        },
        legend: {
          icon: 'line',
          top: 20,
          textStyle: {
            color: '#fff',
            data: ['危险源报警峰值', '今日危险源报警']
          },

          itemWidth: 10,  // 设置宽度
          itemHeight: 10 // 设置高度
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: { // x轴
          type: 'category',
          boundaryGap: false, // 坐标轴两边留白策略
          data: ['炸药库', '油库', '贮气柜', '辐射源', '易燃易爆物品'
          ],
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: '#fff'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        yAxis: { // y轴
          min: 0,
          type: 'value',
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLabel: {
            textStyle: {
              fontSize: 12,
              color: '#fff'
            }
          },
          axisLine: {
            'show': false,
            lineStyle: {
              color: '#fff'
            }
          }
        },
        series: [
          {
            name: '危险源报警峰值',
            data: [1, 5, 8, 3, 1, 5],
            type: 'line',
            smooth: true, // 折线是否平滑
            areaStyle: {
              opacity: 0
            },
            itemStyle: {
              normal: {
                color: '#197CD8', // 小圆点的颜色
                lineStyle: {
                  color: '#197CD8' // 折线的颜色
                }
              }
            }
          },
          {
            name: '今日危险源报警',
            data: [2, 6, 8, 1, 5],
            type: 'line',
            smooth: true, // 是否平滑
            areaStyle: {
              opacity: 0
            },
            itemStyle: {
              normal: {
                color: '#2B9F50', // 小圆点的颜色
                lineStyle: {
                  color: '#2B9F50' // 折线的颜色
                }
              }
            }
          }
        ]
      }
      this.chartBar = echarts.init(document.getElementById('J_chartBarBoxhazards'))
      this.chartBar.setOption(option)
      window.addEventListener('resize', () => {
        this.chartBar.resize()
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.kanban-left-hazards-echarts {
  .chart-boxs {
    min-height: 28vh;
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
