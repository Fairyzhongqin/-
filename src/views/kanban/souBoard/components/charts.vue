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
      switch (type) {
        case 'annular': // 环形图 - 重大危险源 点位分类
          let total = 105
          let clientlabels = ['生产工艺', '仓库罐区', '气体点位', '电气点位', '消防点位', '关键设备']
          let clientcounts = [12, 4, 6, 19, 53, 2]
          option = {
            tooltip: {
              show: 'false',
              trigger: 'item'

            },
            legend: {
              orient: 'vertical',
              icon: 'rect',
              left: '50%',
              top: 'center',
              align: 'left',
              itemGap: 10,   // 右边图例间隔
              itemWidth: 8,  // 右边图例大小
              itemHeight: 8,
              data: ['生产工艺', '仓库罐区', '气体点位', '电气点位', '消防点位', '关键设备'],
              formatter: function (name) {
                var index = 0
                clientlabels.forEach(function (value, i) {
                  if (value === name) {
                    index = i
                  }
                })
                return name + '  ' + clientcounts[index]
              },
              textStyle: {  // 右侧标题栏文字样式
                fontSize: 12,
                color: '#BEC3CE'  // #fff
              }
            },
            color: ['#4D81E4', '#76D3AA', '#EAC65A', '#E78F43', '#E06F6B', '#E47BD2'],
            series: [
              {
                name: '点位分布',
                type: 'pie',
                silent: false,   // 鼠标事件 true-关闭
                radius: ['55%', '65%'],
                avoidLabelOverlap: false,
                center: ['25%', '50%'],  // 环形图的位置
                hoverOffset: 4,  // 鼠标滑过环形时 弹出的大小
                label: {
                  normal: {
                    show: true,
                    position: 'center',
                    trigger: 'item',
                    formatter: [    // 环形图中间文字
                      '{value|' + total + '}',  // 外部获取total
                      '{hr|}',
                      '{name|总点位}'
                    ].join('\n'),
                    rich: {
                      value: {
                        color: '#fff',
                        fontSize: 16
                      },
                      hr: {
                        borderColor: '#CCCCCCFF',
                        width: '100%',
                        height: '0',
                        borderWidth: '1',
                        align: 'left',
                        lineHeight: 20
                      },
                      name: {
                        fontSize: 12,
                        color: '#fff',
                        lineHeight: 20
                      }
                    }
                  }

                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [
                  { value: 12, name: '生产工艺' },
                  { value: 4, name: '仓库罐区' },
                  { value: 6, name: '气体点位' },
                  { value: 19, name: '电气点位' },
                  { value: 53, name: '消防点位' },
                  { value: 2, name: '关键设备' }
                ]
              }
            ]
          }
          break
        case 'sosLine': // 折线图 - 重大危险源 近一周告警
          let dataSosLine = [
            ['11/22', 116],
            ['11/22:06', 189],
            ['11/22:12', 135],
            ['11/22:18', 86],
            ['11/23', 85],
            ['11/23:06', 73],
            ['11/23:12', 38],
            ['11/23:18', 92],
            ['11/24', 95],
            ['11/24:12', 139],
            ['11/24:16', 115],
            ['11/24:18', 111],
            ['11/25', 256],
            ['11/25:12', 137],
            ['11/25:16', 85],
            ['11/25:18', 98],
            ['11/26', 71],
            ['11/26:12', 84],
            ['11/26:16', 93],
            ['11/26:18', 85],
            ['11/27', 173],
            ['11/27:12', 83],
            ['11/27:16', 107],
            ['11/27:18', 82],
            ['11/28', 44]
          ]   // 需要获取的数据
          let dateList = dataSosLine.map(function (item) {
            return item[0]
          })
          let valueList = dataSosLine.map(function (item) {
            return item[1]
          })
          option = {
            tooltip: {
              trigger: 'axis'
            },
            xAxis: [{
              nameLocation: 'middle',
              data: dateList,
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                // show:false,
                interval: 3   // 坐标轴刻度标签的显示间隔
              }
            }],
            textStyle: {
              color: '#fff'
            },
            yAxis: [{
              splitLine: { show: false },
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false
              }
            }],
            grid: [{
              top: 0,
              left: 10,
              right: 10,
              bottom: '5%',
              containLabel: true
            }],
            series: [{
              type: 'line',
              showSymbol: false,
              data: valueList,
              smooth: 'false',
              symbol: 'circle',
              symbolSize: 10,   // 滑过时小圆点的大小
              itemStyle: {
                normal: {
                  lineStyle: {
                    width: 5,  // 线条宽度
                    color: '#EB4138'
                  }
                }
              }
            }]
          }
          break
        case 'warning': // 柱形图 - 重大危险源 各区域预警率
          let datawar = this.chartData || []
          let dataName = []
          let dataVal = []
          let dataRate = []
          datawar.map(item => {
            dataName.push(item.name)
            dataVal.push(item.value)
            dataRate.push(item.value + '%')
          })
          // let rig = 490   // 柱条右边百分比数值的X轴位置  通过计算父盒子的宽度适应
          option = {
            // color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              backgroundColor: 'rgba(255,255,255,0.8)',
              extraCssText: 'box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);',
              textStyle: {
                color: '#6a717b'
              }
            },
            grid: {
              top: '8%',
              left: '4%',
              right: '4%',
              bottom: -20,
              containLabel: true
            },
            yAxis: [{
              type: 'category',
              data: dataName,
              inverse: true,
              axisTick: {
                alignWithLabel: true

              },
              axisLabel: {
                margin: 10,
                textStyle: {
                  fontSize: 12,
                  color: '#53a8fa'
                },
                formatter: function (value, index) {
                  if (index === 0) {
                    return '{first|}' + '   ' + value
                  } else if (index === 1) {
                    return '{second|}' + '   ' + value
                  } else if (index === 2) {
                    return '{third|}' + '   ' + value
                  } else {
                    return '      ' + (index + 1) + ' ' + value
                  }
                },
                rich: {
                  value: {
                    color: 'red',
                    fontSize: 12
                  },
                  first: {
                    align: 'left',
                    width: 14,
                    height: 16,
                    backgroundColor: {
                      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAATCAMAAACuuX39AAAAY1BMVEVHcEziUz71xCLuji/0xCH1xCH0xCH1xCHqhy/qgRn0wyH0xSDiUj7iVD7iUz7pfTPumyz0xCHzxCL0xCLzmyLzpyL////1qkTzriLzvCL1rkvjVj3ztiL5yYj0ojH2tFn+9+xTDKB9AAAAE3RSTlMAxswrrfjufxsEkmBXRqD6ocHbLpS6TwAAAKxJREFUGNNVkOkSgyAMhIOK4lWPhVYEre//lA3BmY77A7LfBHIQscpu1XrtSspqO9zqWvEVEJ21LgJVIg3ANskBDZHR4o/3JxFtOCGyv64EbOSUIid8BTgUpCHvdwEWmvAEoPoJalpy0f3+Y+Eq/g88VzE1Ng7P47R2Q22IegixyaOn3LvfnNu8dJ6Gn3we1k+ygFaFMFdFUc0hqDStGV8qL0a9RiPBkC8yAx8/04YRsZPPXP0AAAAASUVORK5CYII='
                    }
                  },
                  second: {
                    align: 'left',
                    width: 14,
                    height: 16,
                    backgroundColor: {
                      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAATCAMAAACuuX39AAAAYFBMVEVHcEzm9Pzm9Pzk9Prm9PviUz7m9fvn9fvm8/vkUjzm9//iUz7iUz7kubbjj4XiUz7h8PDk9Pvm9Pvj9Pnl8/zm9PuoxujH3PHW5vWvy+q60+3v9Pvh6/X8/f6+1e7iV0OHRg80AAAAFXRSTlMA7q1g0U73hv4iHsugofrBEXPBLZbuNYVLAAAAuElEQVQY0y2QCRLDIAhFSWoTuq8fFDW5/y2L2j+jbE8RiVyfb2AO3w/9tTK6eB3xDERLySIw9zrYpMsYzpwXeKy1chLDcnYgimxVLReR6EhoQISv7IcQaHFfUhLJTgovBPQLU86eFIAmNMdqaSZhojc2d2rs3IY3vVqXWHMeXV70nKCyaZMopifRAazjpco4jLejqJkWYEx3upcxbbmfeuKy77c5hPm275cOHK+P8Q+P63Egf+Ml336NIhLfc+XfnAAAAABJRU5ErkJggg=='
                    }
                  },
                  third: {
                    align: 'left',
                    width: 14,
                    height: 16,
                    backgroundColor: {
                      image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAATCAMAAACuuX39AAAAb1BMVEVHcEz3x2r2x2v2x2r3x2v2x2r1yW32x2rkUjzqmFXiVD7iUj7iUz7iUz7iUz72xmv0x2rqfk/vnVr0xmz2x2vOgjDalkHRiDXqslngoUr05NLrzKvgr3v58ejZnl7jVj/yvWT9+/ncpmzUkUjmwJe//mnoAAAAFHRSTlMAeu6t+NEXiyIERlfLoMHBYPqhLYFNBnAAAADFSURBVBjTLZDZFoMgDESjgqitdpuguC/9/29sAp0HOJkzSbgQiT7OGmPdh5Jqh79cHesCGHzf+wEo1MkAz1EeyIhKo/X3OMZLHFOSw8A8H+c6TswDHFkNnDPzNGqTJYNe+9dpOZl7GAL4b0iKAco1sa4yd9FETg+dof1pxkOeIVuuZRmPU7dkVOYIkp3nizkgL4meUEcVgKfCCNsevA+70EXa6rUn2P1VRdr7tr0La4v3tt2VtmraLn1M1zYxQrd0UXWT4wfHwxNfYATYRwAAAABJRU5ErkJggg=='
                    }
                  }
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#2548ac'
                }
              }

            }],
            xAxis: [{
              type: 'value',
              show: false,
              axisLabel: {
                margin: 10,
                textStyle: {
                  fontSize: 12,
                  color: '#53a8fa'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#192469'
                }
              },
              splitLine: {
                lineStyle: {
                  color: '#17367c'
                }
              }

            }],
            series: [{
              name: '各区域预警率',
              type: 'bar',
              barWidth: 9,
              data: datawar,
              label: {
                normal: {
                  show: true,
                  position: 'right', // 柱条右边百分比数值的X轴位置  通过计算父盒子的宽度适应
                  textStyle: {
                    color: 'white' // color of value
                  },
                  formatter: function (params) {
                    return params.data.value + '%'
                  }
                }
              },

              itemStyle: {

                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                    offset: 0,
                    color: '#0590eb' // 0% 处的颜色
                  }, {
                    offset: 1,
                    color: '#08e3f1' // 100% 处的颜色
                  }], false),
                  // barBorderRadius: [0, 15, 15, 0],
                  shadowColor: 'rgba(0,0,0,0.1)',
                  shadowBlur: 3,
                  shadowOffsetY: 3
                }
              }
            }]
          }
          break
        case 'tankPie': // 环形图 - 重大危险源 储罐看板
          let dataT = this.chartData
          option = {
            tooltip: {
              trigger: 'item',
              position: ['33%', '3%'], // 提示框位置
              padding: ['12', '36'],  // 提示框填充
              // extraCssText:'width:18%;height:10%;', // 提示框宽高
              backgroundColor: 'rgba(255,255,255,0.7)',  // 提示框背景颜色
              alwaysShowContent: false,  // 提示框  true- 一直存在
              // formatter: "{c} <br/>{b}",  // 提示框显示数据
              formatter: function (param) {
                let temp = '<div style="text-align: center;font-size:12px;"><span style="color: #06112CFF;font-weight: bold">' + param.value + '</span> <br/> <span style="color:#8A92A6FF">' + param.name + '</span></div'
                return temp
              }
            },
            legend: {
              // orient: 'vertical',
              width: 260,
              height: 50,
              x: 'left',
              orient: 'horizontal',
              icon: 'emptyCircle',
              left: '50%',
              top: 'center',
              align: 'left',
              itemGap: 20,    // 各图例的间距
              itemWidth: 12,
              itemHeight: 12,
              zlevel: 2,
              data: [].concat(dataT.map(val => {
                return val.name
              })),

              formatter: function (name) {
                let val = ''
                dataT.map(item => {
                  if (item.name === name) {
                    val = item.value
                  }
                })
                return '{a|' + name + '    ' + val + '}'  // 右边图例的数据
              },
              textStyle: {
                rich: {
                  a: {
                    width: 70,
                    fontSize: 12,
                    color: '#BEC3CE'
                  }
                }
              }

            },
            color: ['#62A0F5', '#1678FF', '#D41A30', '#FF2C45', '#FF6678', '#FFA4AF', '#E6C248', '#61DCC3'], // 颜色分布
            series: [
              {
                name: '访问来源',
                type: 'pie',
                center: ['25%', '48%'],  // 环形图的位置
                radius: ['20%', '60%'],
                avoidLabelOverlap: false,
                hoverAnimation: false,  // 取消hover时放大效果
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '30',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: dataT
              },
              {   // 内部小白圈
                name: '',
                type: 'pie',
                z: 9999,   // 小白圈的层级
                radius: ['20%', '30%'],
                center: ['25%', '48%'],  // 环形图的位置
                avoidLabelOverlap: false,
                legendHoverLink: false,
                label: {
                  show: false
                },
                tooltip: { // 禁止鼠标悬停显示提示框
                  show: false
                },
                hoverAnimation: false, // 禁止鼠标悬停放大区域
                color: ['rgba(255,255,255,.6)'],
                data: [{
                  value: '100'
                }]
              }]
          }
          break
      }

      return option
    },
    refreshChart (val, val2) { // 刷新chart
      let option = this.chartBar.getOption()
      switch (this.type) {
        case 'lineMultiple':
          option = {
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
        case 'warning': // 柱形图 - 重大危险源 各区域预警率
          let datawar = this.chartData || []
          let dataName = []
          let dataVal = []
          let dataRate = []
          datawar.map(item => {
            dataName.push(item.name)
            dataVal.push(item.value)
            dataRate.push(item.value + '%')
          })
          option.yAxis[0].data = dataName
          option.series[0].data = datawar
          break
        case 'tankPie': // 环形图 - 重大危险源 储罐看板
          let dataT = this.chartData
          option = {
            tooltip: {
              trigger: 'item',
              position: ['33%', '3%'], // 提示框位置
              padding: ['12', '36'],  // 提示框填充
              // extraCssText:'width:18%;height:10%;', // 提示框宽高
              backgroundColor: 'rgba(255,255,255,0.7)',  // 提示框背景颜色
              alwaysShowContent: false,  // 提示框  true- 一直存在
              // formatter: "{c} <br/>{b}",  // 提示框显示数据
              formatter: function (param) {
                let temp = '<div style="text-align: center;font-size:12px;"><span style="color: #06112CFF;font-weight: bold">' + param.value + '</span> <br/> <span style="color:#8A92A6FF">' + param.name + '</span></div'
                return temp
              }
            },
            legend: {
              // orient: 'vertical',
              width: 260,
              height: 50,
              x: 'left',
              orient: 'horizontal',
              icon: 'emptyCircle',
              left: '50%',
              top: 'center',
              align: 'left',
              itemGap: 20,    // 各图例的间距
              itemWidth: 12,
              itemHeight: 12,
              zlevel: 2,
              data: [].concat(dataT.map(val => {
                return val.name
              })),

              formatter: function (name) {
                let val = ''
                dataT.map(item => {
                  if (item.name === name) {
                    val = item.value
                  }
                })
                return '{a|' + name + '    ' + val + '}'  // 右边图例的数据
              },
              textStyle: {
                rich: {
                  a: {
                    width: 70,
                    fontSize: 12,
                    color: '#BEC3CE'
                  }
                }
              }

            },
            color: ['#62A0F5', '#1678FF', '#D41A30', '#FF2C45', '#FF6678', '#FFA4AF', '#E6C248', '#61DCC3'], // 颜色分布
            series: [
              {
                name: '访问来源',
                type: 'pie',
                center: ['25%', '48%'],  // 环形图的位置
                radius: ['20%', '60%'],
                avoidLabelOverlap: false,
                hoverAnimation: false,  // 取消hover时放大效果
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  },
                  emphasis: {
                    show: true,
                    textStyle: {
                      fontSize: '30',
                      fontWeight: 'bold'
                    }
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: dataT
              },
              {   // 内部小白圈
                name: '',
                type: 'pie',
                z: 9999,   // 小白圈的层级
                radius: ['20%', '30%'],
                center: ['25%', '48%'],  // 环形图的位置
                avoidLabelOverlap: false,
                legendHoverLink: false,
                label: {
                  show: false
                },
                tooltip: { // 禁止鼠标悬停显示提示框
                  show: false
                },
                hoverAnimation: false, // 禁止鼠标悬停放大区域
                color: ['rgba(255,255,255,.6)'],
                data: [{
                  value: '100'
                }]
              }]
          }
          break
      }
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
