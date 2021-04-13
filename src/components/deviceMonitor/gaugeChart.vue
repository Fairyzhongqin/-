<!--
 * @Descripttion: 仪表盘
 * @version:
 * @Author: Mr.What
 * @Date: 2019-11-18 17:44:04
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-11-19 17:37:50
 -->
<template>
  <div class="device-monitor-container" :id="'chartGauge'+index">

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
  created () {
  },
  mounted () {
    this.initChart()
  },
  computed: {},
  watch: {
    chartData: {
      handler (val, oldVal) {
        let max = val.max
        let min = val.min
        if (val.value >= 0 && val.threshold.length > 0) {
          this.chartBar.setOption({
            title: {
              text: val.title
            },
            series: {
              max,
              min,
              axisLine: {
                lineStyle: {
                  color: [
                    [(val.threshold[0] - min) / (max - min), '#FF5400'],
                    [(val.threshold[1] - min) / (max - min), '#FFB820'],
                    [(val.threshold[2] - min) / (max - min), '#02B22B'],
                    [(val.threshold[3] - min) / (max - min), '#FFB820'],
                    [1, '#FF5400']
                  ]
                }
              },
              axisLabel: {
                formatter: function (e) {
                  switch (e + '') {
                    case val.threshold[0] && val.type === 0:
                      return '低低位限'
                    case val.threshold[1] && val.type === 0:
                      return '低位限'
                    case val.threshold[2] && val.type === 0:
                      return '高位限'
                    case val.threshold[2] && val.type !== 0:
                      return '一级预警'
                    case val.threshold[3] && val.type === 0:
                      return '高高位限'
                    case val.threshold[3] && val.type !== 0:
                      return '二级预警'
                    default:
                      return e
                  }
                }
              },
              detail: {
                formatter: function (param) {
                  return Number(param).toFixed(2) + val.danwei
                }
              },
              data: [{
                value: val.value
              }]
            }
          })
        }
      },
      deep: true
    }
  },
  methods: {
    initChart () {
      this.chartBar = echarts.init(document.getElementById('chartGauge' + this.index))
      this.chartBar.setOption({
        title: {
          show: true,
          x: 'center',
          y: '25%',
          text: '',
          textStyle: {
            color: '#606266'
          }
        },
        series: [{
          name: '',
          center: ['50%', '57%'],
          radius: '110%', // 仪表大小
          type: 'gauge',
          startAngle: 225,
          endAngle: -45,
          min: 0,
          max: 100,
          axisLine: {
            show: true,
            lineStyle: {
              width: 15,
              shadowBlur: 0,
              color: [
                [0.1, '#FF5400'],
                [0.2, '#FFB820'],
                [0.8, '#02B22B'],
                [0.9, '#FFB820'],
                [1, '#FF5400']
              ]
            }
          },
          axisTick: {
            show: true,
            splitNumber: 5,
            lineStyle: {
              color: 'white',
              width: 1
            },
            length: 5
          },
          splitLine: {
            show: true,
            length: 15,
            lineStyle: {
              color: 'white',
              width: 1
            }
          },
          axisLabel: {
            textStyle: {
              fontSize: 12,
              fontWeight: ''

            },
            distance: 0
          },
          pointer: {
            show: true,
            width: 5,
            length: '65%'
          },
          detail: {
            offsetCenter: [0, '45%'],
            formatter: function (param) {
              return param + '°C'
            },
            textStyle: {
              fontSize: 16,
              color: 'white',
              backgroundColor: 'auto'
            }
          },
          data: [{
            name: '',
            value: 0
          }]
        }]
      })
      window.addEventListener('resize', () => {
        this.chartBar.resize()
      })
    },
    resize () {
      this.chartBar.resize()
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
