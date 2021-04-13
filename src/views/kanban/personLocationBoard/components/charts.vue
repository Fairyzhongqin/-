<template>
  <div class='board-charts-container' :id="name"></div>
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
      type: Array
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
      let _this = this
      switch (type) {
        case 'line': // 折线
          let xData = this.chartData.map(res => {
            return res.name
          })
          let yData = this.chartData.map(res => {
            return res.value
          })
          option = {
            tooltip: {
              trigger: 'axis',
              axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
              },
              formatter: function (params) {
                var tar = params[0]
                return tar.name + '<br/>' + tar.name + ' : ' + tar.value
              }
            },
            grid: {
              top: 20,
              left: '1%',
              right: '1%',
              bottom: '10',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: xData,
              axisTick: {
                show: false
              },
              axisLabel: {
                show: true,
                color: 'rgba(254,254,254,1)'
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(254,254,254,0.5)'
                }
              }
            },
            yAxis: {
              type: 'value',
              splitNumber: 3,
              axisLine: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(255,255,255,0.15)'
                }
              },
              axisLabel: {
                show: true,
                color: 'rgba(254,254,254,0.5)'
              }
            },
            series: [{
              data: yData,
              type: 'line',
              smooth: true,
              showSymbol: false,
              lineStyle: {
                color: '#00C6FF'
              },
              areaStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                    offset: 0,
                    color: 'rgba(0,198,255,1)'
                  },
                  {
                    offset: 1,
                    color: 'rgba(0,198,255,0)'
                  }
                  ])
                }
              }
            }]
          }
          break
        case 'bar': //  柱状
          option = {
            grid: {
              left: 40,
              right: 10,
              top: 20,
              bottom: 30
            },
            xAxis: {
              type: 'category',
              data: ['承包商', '厂长', '内部员工', '访客'],
              axisTick: {
                show: false
              },
              axisLabel: {
                show: true,
                color: 'rgba(254,254,254,1)'
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(254,254,254,0.5)'
                }
              }
            },
            yAxis: {
              type: 'value',
              splitNumber: 3,
              axisLine: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(255,255,255,0.15)'
                }
              },
              axisLabel: {
                show: true,
                color: 'rgba(254,254,254,0.5)'
              }
            },
            series: [{
              data: _this.chartData,
              type: 'bar',
              barWidth: '35%',
              itemStyle: {
                normal: {
                  show: true,
                  color: function (params) {
                    return _this.colorMap[params.dataIndex]
                  }
                }
              },
              label: {
                normal: {
                  show: true,
                  position: 'top',
                  formatter: function (param) {
                    return param.value + '人'
                  }
                }
              }
            }]
          }
          break
        case 'bar2': //  柱状 形状2 柱子横向
          option = {
            grid: {
              left: 25,
              right: 25,
              top: 10,
              bottom: 10,
              containLabel: true
            },
            xAxis: {
              type: 'value',
              splitNumber: 3,
              axisLine: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(255,255,255,0.15)'
                }
              },
              axisLabel: {
                show: true,
                color: 'rgba(254,254,254,0.5)'
              }
            },
            yAxis: {
              type: 'category',
              data: [],
              axisTick: {
                show: false
              },
              axisLabel: {
                show: true,
                color: 'rgba(254,254,254,1)'
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(254,254,254,0.5)'
                }
              }
            },
            series: [{
              data: [],
              type: 'bar',
              barMaxWidth: '80%',
              itemStyle: {
                normal: {
                  show: true,
                  color: function (params) {
                    return _this.colorMap[params.dataIndex]
                  }
                }
              }
            }]
          }
          break
        case 'pie': // 饼图
          option = {
            grid: {
              top: '1%',
              left: '15%',
              right: '15%',
              bottom: '1%',
              containLabel: true
            },
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            series: [
              {
                type: 'pie',
                radius: ['84%', '85%'],
                data: [100],
                label: {
                  show: false
                },
                itemStyle: {
                  color: '#4E5878'
                }
              },
              {
                type: 'pie',
                radius: ['30%', '31%'],
                data: [100],
                label: {
                  show: false
                },
                itemStyle: {
                  color: '#4E5878'
                }
              },
              {
                name: '类型',
                type: 'pie',
                radius: ['35%', '78%'],
                center: ['50%', '50%'],
                data: _this.chartData,
                color: ['#0898BE', '#0EBFC7', '#226AA4', '#0FC79F'],
                roseType: 'radius',
                label: {
                  normal: {
                    textStyle: {
                      fontSize: 12
                    },
                    formatter: function (param) {
                      return param.name + '：' + Math.round(param.percent) + '%'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    lineStyle: {
                    },
                    length: 20,
                    length2: 25
                  }
                },
                animationType: 'scale',
                animationEasing: 'elasticOut',
                animationDelay: function () {
                  return Math.random() * 200
                }
              }
            ]
          }
          break
        case 'lineMultiple': // 多重折线
          option = {
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              textStyle: {
                fontSize: '12px',
                color: '#fff'
              },
              icon: 'path://M53.584,20.304c1.754,0,2.916,0.992,2.916,2.233v3.23c0,1.24-1.162,2.232-2.916,2.232H6.082c-1.748,0-2.915-0.992-2.915-2.232V22.29c0-1.241,1.678-1.957,3.425-1.957L53.584,20.304L53.584,20.304z',
              data: []
            },
            grid: {
              left: '1%',
              right: '1%',
              bottom: '10',
              containLabel: true
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              axisTick: {
                show: false
              },
              axisLabel: {
                show: true,
                color: 'rgba(254,254,254,1)'
              },
              axisLine: {
                lineStyle: {
                  color: 'rgba(254,254,254,0.5)'
                }
              }
            },
            yAxis: {
              type: 'value',
              splitNumber: 3,
              axisLine: {
                show: false
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: 'rgba(255,255,255,0.15)'
                }
              },
              axisLabel: {
                show: true,
                color: 'rgba(254,254,254,0.5)'
              }
            },
            series: []
          }

          break
      }
      return option
    },
    refreshChart (val, val2) { // 刷新chart
      let op = this.chartBar.getOption()
      switch (this.type) {
        case 'line':
          op = {
            xAxis: {
              data: val.map(res => {
                return res.name
              })
            },
            series: [{
              data: val.map(res => {
                return res.value
              })
            }]
          }
          break
        case 'bar':
          op = {
            xAxis: {
              data: val.map(res => {
                return res.name
              })
            },
            series: [{
              data: val.map(res => {
                return res.value
              })
            }]
          }
          op.series[0].data = val
          break
        case 'bar2':
          val = val.reverse()
          var num = parseInt(val.length)
          for (var b = 0; b < 10 - num; b++) {
            val.push({})
          };
          console.log(val, 'val')
          op = {
            yAxis: {
              inverse: true,
              data: val.map((res, index) => {
                return [res.name, index]
              }),
              axisLabel: {
                interval: 0,
                rich: {
                  fir: {
                    align: 'right',
                    width: 14,
                    height: 16,
                    backgroundColor: {
                      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAATCAMAAACuuX39AAAAY1BMVEVHcEziUz71xCLuji/0xCH1xCH0xCH1xCHqhy/qgRn0wyH0xSDiUj7iVD7iUz7pfTPumyz0xCHzxCL0xCLzmyLzpyL////1qkTzriLzvCL1rkvjVj3ztiL5yYj0ojH2tFn+9+xTDKB9AAAAE3RSTlMAxswrrfjufxsEkmBXRqD6ocHbLpS6TwAAAKxJREFUGNNVkOkSgyAMhIOK4lWPhVYEre//lA3BmY77A7LfBHIQscpu1XrtSspqO9zqWvEVEJ21LgJVIg3ANskBDZHR4o/3JxFtOCGyv64EbOSUIid8BTgUpCHvdwEWmvAEoPoJalpy0f3+Y+Eq/g88VzE1Ng7P47R2Q22IegixyaOn3LvfnNu8dJ6Gn3we1k+ygFaFMFdFUc0hqDStGV8qL0a9RiPBkC8yAx8/04YRsZPPXP0AAAAASUVORK5CYII='
                    }
                  },
                  sec: {
                    align: 'center',
                    width: 14,
                    height: 16,
                    backgroundColor: {
                      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAATCAMAAACuuX39AAAAYFBMVEVHcEzm9Pzm9Pzk9Prm9PviUz7m9fvn9fvm8/vkUjzm9//iUz7iUz7kubbjj4XiUz7h8PDk9Pvm9Pvj9Pnl8/zm9PuoxujH3PHW5vWvy+q60+3v9Pvh6/X8/f6+1e7iV0OHRg80AAAAFXRSTlMA7q1g0U73hv4iHsugofrBEXPBLZbuNYVLAAAAuElEQVQY0y2QCRLDIAhFSWoTuq8fFDW5/y2L2j+jbE8RiVyfb2AO3w/9tTK6eB3xDERLySIw9zrYpMsYzpwXeKy1chLDcnYgimxVLReR6EhoQISv7IcQaHFfUhLJTgovBPQLU86eFIAmNMdqaSZhojc2d2rs3IY3vVqXWHMeXV70nKCyaZMopifRAazjpco4jLejqJkWYEx3upcxbbmfeuKy77c5hPm275cOHK+P8Q+P63Egf+Ml336NIhLfc+XfnAAAAABJRU5ErkJggg=='
                    }
                  },
                  thr: {
                    align: 'left',
                    width: 14,
                    height: 16,
                    backgroundColor: {
                      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAATCAMAAACuuX39AAAAb1BMVEVHcEz3x2r2x2v2x2r3x2v2x2r1yW32x2rkUjzqmFXiVD7iUj7iUz7iUz7iUz72xmv0x2rqfk/vnVr0xmz2x2vOgjDalkHRiDXqslngoUr05NLrzKvgr3v58ejZnl7jVj/yvWT9+/ncpmzUkUjmwJe//mnoAAAAFHRSTlMAeu6t+NEXiyIERlfLoMHBYPqhLYFNBnAAAADFSURBVBjTLZDZFoMgDESjgqitdpuguC/9/29sAp0HOJkzSbgQiT7OGmPdh5Jqh79cHesCGHzf+wEo1MkAz1EeyIhKo/X3OMZLHFOSw8A8H+c6TswDHFkNnDPzNGqTJYNe+9dpOZl7GAL4b0iKAco1sa4yd9FETg+dof1pxkOeIVuuZRmPU7dkVOYIkp3nizkgL4meUEcVgKfCCNsevA+70EXa6rUn2P1VRdr7tr0La4v3tt2VtmraLn1M1zYxQrd0UXWT4wfHwxNfYATYRwAAAABJRU5ErkJggg=='
                    }
                  },
                  num: {

                  }
                },
                formatter: function (params) {
                  let pL = params.split(',')
                  var name = pL[0]
                  var index = parseInt(pL[1]) + 1
                  if (index === 1) {
                    return '{fir|}' + name
                  } else if (index === 2) {
                    return '{sec|}' + name
                  } else if (index === 3) {
                    return '{thr|}' + name
                  } else {
                    return '{num|' + index + '}' + name
                  }
                },
                textStyle: {
                  fontSize: 10
                }
              }
            },
            series: [{
              data: val.map(res => {
                return {
                  name: res.name,
                  value: res.value
                }
              }),
              label: {
                normal: {
                  show: true,
                  textStyle: {
                    fontSize: 12
                  },
                  position: 'right',
                  offset: [0, 0],
                  formatter: function (params) {
                    var value = parseFloat(params.data['value'])
                    return value + '人'
                  }
                }
              }
            }]
          }
          op.series[0].data = val
          break
        case 'pie':
          op.series[2].data = val
          break
        case 'lineMultiple':
          op = {
            legend: {
              data: val.map(res => {
                return res.name
              })
            },
            xAxis: {
              data: val2.map(r => {
                return r.split('-')[2]
              })
            },
            series:
              val.map(res => {
                return {
                  name: res.name,
                  type: 'line',
                  data: res.data,
                  showSymbol: false
                }
              })
          }
          break
      }
      this.chartBar.setOption(op)
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
