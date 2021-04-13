<template>
  <div class='board-charts-container'
       :id="name"></div>
</template>

<script>
  import echarts from 'echarts'
  export default {
    props: {
      name: { // 图表名称 必须唯一
        type: String,
        required: true
      },
      type: { // 图标类型
        type: String,
        required: true
      },
      chartData: { // 图表数据
        type: Object
      }
    },
    components: {},
    data () {
      return {
        chartBar: null,
        colorMap: [ // echarts 调色板
          '#FA7624',
          '#8392E7',
          '#E8679F',
          '#26DBF4',
          '#20BF55',
          '#f23557',
          '#118df0',
          '#11cbd7',
          '#d3327b',
          '#ae318a',
          '#993090',
          '#6f3071'
        ]
      }
    },
    created () { },
    mounted () {
      this.initChart()
    },
    computed: {},
    watch: {},
    methods: {
      initChart () {
        this.chartBar = echarts.init(document.getElementById(this.name))
        this.chartBar.setOption(this.getOption(this.type))
        // window[this.type] = this.chartBar // 挂载到window方便调试
        window.addEventListener('resize', () => {
          this.chartBar.resize()
        })
      },
      getOption (type) { // 根据图表类型 获取图表配置
        let option = null
        // let current = 80// 当前用量
        let all = 100// 总量
        console.log(this.chartData)
        let color = this.chartData.flag === '0' ? '#F1DE22' : '#E63031'
        let bfb = this.chartData.bfb
        let upDown = this.chartData.flag === '0' ? 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAYCAYAAADzoH0MAAABOElEQVQ4T+2UQS8DURDHf7NN9KhIrQOVtxzpjbvgKyAiPgRx8AlciA8hET4D4i4uxE10qyKxbdCLBNEd6W5s7NpVZ+m7vZn3fjPzfzNPSCz1zC1CKWkP9kpNbHf0u0+6ALoa8C800LpZQLQQtbQvWwj9GbPwhKWbkU+lKeqZFYS91AudjMpq0EhaNwfAYqfzCf+hDLpLIaBZ6uM9dwkM/w0i9/R8TEqh9hy1sj44s1h6RMrTJr8MfJmXocpJ2x6bBfXMDsLar1mo7opdjc7EAdfjeXpb58BEBuSKF50SU3398qdNYxnhDMgnIG8o02K7ba2i9QMQiNow6yjbMYCyIbYbt2UJpopFwzkGnQkhckqxMieCnywtNYMgi8exEVr+RRAkZ5Vl4OYuTZdMQFiKsxzEL1b2s17mE0ZKnN9VTc/3AAAAAElFTkSuQmCC'
         : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAYCAYAAADzoH0MAAABLElEQVQ4T+2SzS4DURiGn29o1ErYCrqbn8x0x15wDRUJ90BYuAILwj1YCNeA2LNimul0V8QWOxU1n0wnVf2ZDktJz+Iszvu+T855zycMWGpZa7EsYXiSZpM0QV13hsbnLYqQGylKufzYz9sXoGBgORegi0lIrgiDZYGoG9IfYDnboPudZtmRMDjIBKhpFhHjGhjrMr+j0YJUq3c/zztuoIVCnvz4DeCmdFOm/jYvtVq9pXcCLPsQ2Bz0M8CRhJWtHoA6zhKRnseNZQAUQ1YkCC6b9cabet4kHw0fmM4It+QncqOe+P5LAjDtU4TSL8OJTTmTamVV1LbXUY7/FG4XsBEDSqhOtAGyB0ylAJ9Bd781NV57ClPLvgdmUwAPElbmUueg+bQhYNjBv5yDLwLLjG1KYeAfAAAAAElFTkSuQmCC'
        option = {
          title: {
            x: '43%',
            y: '48%',
            text: bfb + '%',
            textStyle: {
              fontSize: 12,
              color: '#ffffff'
            }
          },
          // emphasis: {
          //   show: false,
          //   textStyle: {
          //     fontSize: '12',
          //     fontWeight: 'bold'
          //   },
          //   formatter: '{d}%222'
          // },
          graphic: {
            type: 'image',
            left: '37%',
            top: '53%',
            z: 2,
            zlevel: 100,
            style: {
              image: upDown,
              width: '8',
              height: '12'
            }
          },
          series: [
            {
              type: 'pie',
              label: {
                show: false
              },
              center: ['50%', '70%'],
              radius: ['105%', '115%'],
              startAngle: 180, // 旋转角度
              hoverAnimation: false,
              data: [
                {
                  name: '用量',
                  value: bfb,
                  hoverAnimation: false, // 滑过不放大
                  itemStyle: {
                    color: color
                  }
                },
                {
                  name: 'rest', // 实际显示部分是总量-用量
                  value: all - bfb,
                  itemStyle: {
                    color: '#202E52'
                  }
                },
                {  // 下半个半圆
                  name: 'bottom',
                  value: all,
                  itemStyle: {
                    color: 'transparent'
                  }
                }
              ]
            }
          ]
        }
        return option
      },
      refreshChart (val, val2) { // 刷新chart
        let option = this.chartBar.getOption()
        this.chartBar.setOption(option)
      },
      resizeChart () {
        this.chartBar.resize()
      }
    }
  }
</script>

<style lang='scss' scoped>
  .board-charts-container {
    width: 100%;
    height: 100%;
  }
</style>
