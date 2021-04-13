<!--
 * @Descripttion: 实时折线图
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-11-19 11:32:11
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-11-19 22:52:41
 -->
<template>
  <div class="real-time-line-chart-container" :id="'realTimeChart'+index">

  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    chartData: {
      type: [Object, Array]
    },
    index: {
      type: [String, Number]
    }
  },
  components: {},
  data () {
    return {
      chartBar: null
    }
  },
  created () { },
  mounted () {
    this.initChart()
  },
  computed: {},
  watch: {
    chartData: {
      handler (val, oldVal) {
        if (val.length > 0) {
          let visualMap = {
            pieces: [{
              gt: Number(val[0].min),
              lte: val[0].threshold[0],
              color: '#FF5400',
              label: '低低限'
            }, {
              gt: val[0].threshold[0],
              lte: val[0].threshold[1],
              color: '#FFB820',
              label: '低限'
            }, {
              gt: val[0].threshold[1],
              lte: val[0].threshold[2],
              color: '#02B22B',
              label: '正常'
            }, {
              gt: val[0].threshold[2],
              lte: val[0].threshold[3],
              color: '#FFB820',
              label: '高限'
            }, {
              gt: val[0].threshold[3],
              lte: Number(val[0].max),
              color: '#FF5400',
              label: '高高限'
            }]
          }
          this.chartBar.setOption({
            visualMap,
            xAxis: {
              data: this.chartData.map(rX => {
                return rX.name
              })
            },
            yAxis: {
              max: val[0].max || 100,
              min: val[0].min || 0
            },
            series: [{
              data: this.chartData.map(rY => {
                return rY.value
              })
            }]
          })
        }
      },
      deep: true
    }
  },
  methods: {
    initChart () {
      this.chartBar = echarts.init(document.getElementById('realTimeChart' + this.index))
      this.chartBar.setOption({
        grid: {
          top: 5,
          left: 5,
          bottom: 5,
          right: 0,
          containLabel: true
        },
        visualMap: {
          show: false,
          top: 40,
          right: 10,
          pieces: [{
            gt: 0,
            lte: 10,
            color: '#FF5400',
            label: '低低限'
          }, {
            gt: 10,
            lte: 20,
            color: '#FFB820',
            label: '低限'
          }, {
            gt: 20,
            lte: 80,
            color: '#02B22B',
            label: '正常'
          }, {
            gt: 80,
            lte: 90,
            color: '#FFB820',
            label: '高限'
          }, {
            gt: 90,
            lte: 100,
            color: '#FF5400',
            label: '高高限'
          }]
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params) {
            return params[0].name.replace('年', '-').replace('月', '-').replace('日', '') + ' : ' + params[0].value[1]
          },
          axisPointer: {
            animation: false
          }
        },
        xAxis: {
          name: '',
          type: 'category',
          boundaryGap: false,
          splitLine: {
            show: false
          },
          data: this.chartData
        },
        yAxis: {
          type: 'value',
          boundaryGap: [0, '100%'],
          splitLine: {
            show: false
          },
          max: 100
        },
        series: [{
          name: '模拟数据',
          type: 'line',
          smooth: true,
          showSymbol: true,
          hoverAnimation: true,
          data: this.chartData
        }]
      })
      window.addEventListener('resize', () => {
        this.chartBar.resize()
      })
      window.aaa = this.chartBar
    },
    resize () {
      this.chartBar.resize()
    }
  }
}
</script>

<style lang='scss' scoped>
.real-time-line-chart-container {
  width: 100%;
  height: 220px;
}
</style>
