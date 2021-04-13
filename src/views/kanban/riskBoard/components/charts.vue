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
              left: '0%',
              right: '4%',
              bottom: '0',
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
        // 环形图 - 安全风险分区 风险类型占比
        case 'annular':
          let data = [
            {value: 12, name: '物体打击'},
            {value: 12, name: '火灾'},
            {value: 14, name: '车辆伤害'},
            {value: 20, name: '高处坠落'},
            {value: 16, name: '机械伤害'},
            {value: 8, name: '坍塌'},
            {value: 19, name: '起重伤害'},
            {value: 19, name: '容器爆炸'},
            {value: 15, name: '触电'},
            {value: 13, name: '其他爆炸'},
            {value: 12, name: '淹溺'},
            {value: 22, name: '中毒和窒息'},
            {value: 30, name: '灼烫'},
            {value: 5, name: '其他伤害'}
          ]
          let sum = 101
          option = {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)'
            },
            legend: {
              width: 240,
              x: 'left',
              orient: 'horizontal',
              icon: 'rect ',
              left: '43%',
              top: 'center',
              align: 'left',
              itemGap: 11,    // 各图例的间距
              itemWidth: 8,
              itemHeight: 8,
              zlevel: 2,
              data: ['物体打击', '火灾', '车辆伤害', '高处坠落', '机械伤害', '坍塌', '起重伤害', '容器爆炸', '触电', '其他爆炸', '淹溺', '中毒和窒息', '灼烫', '其他伤害'],
              formatter: function (name) {
                let val = ''
                data.map(item => {
                  if (item.name === name) {
                    val = (item.value / sum * 100).toFixed(0)
                  }
                })
                return '{a|' + name + '  ' + val + '%}'  // 右边图例的数据
              },
              textStyle: {
                rich: {
                  a: {
                    width: 85,
                    fontSize: 12,
                    color: '#ffffff'
                  }
                }
              }
            },
            color: ['#BD4BFF', '#F0C540', '#5160F1', '#F58A2B', '#3E80EB', '#F06666', '#3EEBFF', '#FA3B3C', '#4DD6A7', '#F471D7', '#97DF57', '#B094FF', '#FFFD3B', '#F6F6F6'],
            series: [
              {
                name: '风险类型',
                type: 'pie',
                radius: ['20%', '70%'],
                center: ['22%', '40%'],
                roseType: 'radius',
                label: {
                  show: false
                },
                emphasis: {
                  label: {
                    show: false
                  }
                },
                data: [
                  {value: 12, name: '物体打击'},
                  {value: 18, name: '火灾'},
                  {value: 14, name: '车辆伤害'},
                  {value: 28, name: '高处坠落'},
                  {value: 16, name: '机械伤害'},
                  {value: 8, name: '坍塌'},
                  {value: 19, name: '起重伤害'},
                  {value: 21, name: '容器爆炸'},
                  {value: 15, name: '触电'},
                  {value: 13, name: '其他爆炸'},
                  {value: 12, name: '淹溺'},
                  {value: 22, name: '中毒和窒息'},
                  {value: 30, name: '灼烫'},
                  {value: 5, name: '其他伤害'}
                ]
              }
            ]
          }

          break
        // 环形图 - 安全风险分区 隐患/风评/风控
        case 'tankPie':
          let total = 100
          let show = 30
          option = {
            // 标题组件，包含主标题和副标题
            title: {
              show: true,
              text: '风险评价',
              x: 'center',
              y: 'bottom',
              textStyle: {
                fontSize: '12',
                color: '#ffffff',
                fontWeight: 'bold'
              }
            },
            //  提示框组件
            tooltip: {
              show: true,
              trigger: 'item',
              formatter: '{a} <br/>{b}: {d}%'
            },
            color: ['#00C6FF', 'transparent'],
            series: [
              {
                name: '风险评价',
                type: 'pie',
                radius: ['60%', '70%'],
                avoidLabelOverlap: false,
                hoverAnimation: true,
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [
                  {
                    value: show,  //
                    name: '评价率',
                    selected: false,
                    // 单个扇区的标签配置
                    label: {
                      normal: {
                        // 是显示标签
                        show: true,
                        position: 'center',
                        fontSize: 60,   // 环中文字大小
                        // 标签内容格式器，支持字符串模板和回调函数两种形式，字符串模板与回调函数返回的字符串均支持用 \n 换行
                        //  formatter:'{d}%\n{b}',
                        formatter: [    // 环形图中间文字
                          '{value|' + (show / total * 100).toFixed(0) + '%}',  // 外部获取total
                          '{name|评价率}'
                        ].join('\n'),
                        rich: {
                          value: {
                            color: '#00C6FF',
                            fontSize: 18
                          },
                          name: {
                            fontSize: 12,
                            color: '#fff',
                            lineHeight: 20
                          }
                        }
                      }

                    }

                  },
                  {
                    value: total - show,
                    label: {
                      normal: {
                        show: false

                      }
                    }

                  }

                ]
              },
              {   // 一圈的线
                name: '',
                type: 'pie',
                z: 1,   // 圈线的层级
                radius: ['69%', '70%'],
                avoidLabelOverlap: false,
                legendHoverLink: false,
                label: {
                  show: false
                },
                tooltip: { // 禁止鼠标悬停显示提示框
                  show: false
                },
                hoverAnimation: false, // 禁止鼠标悬停放大区域
                color: ['rgba(255,255,255,.2)'],
                data: [{
                  value: '100'
                }]
              }
            ]
          }
          break
        case 'tankPie2':
          let total2 = 100
          let show2 = 70
          option = {
            // 标题组件，包含主标题和副标题
            title: {
              show: true,
              text: '风险管控',
              x: 'center',
              y: 'bottom',
              textStyle: {
                fontSize: '12',
                color: '#ffffff',
                fontWeight: 'bold'
              }
            },
            //  提示框组件
            tooltip: {
              show: true,
              trigger: 'item',
              formatter: '{a} <br/>{b}: {d}%'
            },
            color: ['#00C6FF', 'transparent'],
            series: [
              {
                name: '风险管控',
                type: 'pie',
                radius: ['60%', '70%'],
                avoidLabelOverlap: false,
                hoverAnimation: true,
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [
                  {
                    value: show2,  //
                    name: '管控率',
                    selected: false,
                    // 单个扇区的标签配置
                    label: {
                      normal: {
                        // 是显示标签
                        show: true,
                        position: 'center',
                        fontSize: 60,   // 环中文字大小
                        // 标签内容格式器，支持字符串模板和回调函数两种形式，字符串模板与回调函数返回的字符串均支持用 \n 换行
                        //  formatter:'{d}%\n{b}',
                        formatter: [    // 环形图中间文字
                          '{value|' + (show2 / total2 * 100).toFixed(0) + '%}',  // 外部获取total
                          '{name|管控率}'
                        ].join('\n'),
                        rich: {
                          value: {
                            color: '#00C6FF',
                            fontSize: 18
                          },
                          name: {
                            fontSize: 12,
                            color: '#fff',
                            lineHeight: 20
                          }
                        }
                      }

                    }

                  },
                  {
                    value: total2 - show2,
                    label: {
                      normal: {
                        show: false

                      }
                    }

                  }

                ]
              },
              {   // 一圈的线
                name: '',
                type: 'pie',
                z: 1,   // 圈线的层级
                radius: ['69%', '70%'],
                avoidLabelOverlap: false,
                legendHoverLink: false,
                label: {
                  show: false
                },
                tooltip: { // 禁止鼠标悬停显示提示框
                  show: false
                },
                hoverAnimation: false, // 禁止鼠标悬停放大区域
                color: ['rgba(255,255,255,.2)'],
                data: [{
                  value: '100'
                }]
              }
            ]
          }
          break
        // 环形图 - 安全风险分区 风险治理
        case 'government':
          let total3 = 15
          let notrectification = 6
          option = {
            title: {
              text: ((total3 - notrectification) / total3 * 100).toFixed(0) + '%',
              subtext: '整改率',
              left: 'center',
              top: '40%',
              textStyle: {
                color: '#ffffff'
              },
              subtextStyle: {
                color: '#ffffff'
              }
            },
            //  提示框组件
            // tooltip: {
            //     show:false,
            //     trigger: 'item',
            //     formatter: "{a} <br/>{b}: {c} ({d}%)"
            // },
            color: ['#E63031', '#4DD6A7'],
            series: [
              {
                name: '任务进度',
                type: 'pie',
                radius: ['60%', '70%'],
                avoidLabelOverlap: false,
                hoverAnimation: false,
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                data: [
                  {
                    value: notrectification,  //
                    name: '完成率',
                    selected: false,
                    // 单个扇区的标签配置
                    label: {
                      normal: {
                        // 是显示标签
                        show: true,
                        position: 'outside',
                        fontSize: 60,   // 环中文字大小
                        // 标签内容格式器，支持字符串模板和回调函数两种形式，字符串模板与回调函数返回的字符串均支持用 \n 换行
                        //  formatter:'{d}%\n{b}',
                        formatter: [    // 环形图中间文字
                          '{value|' + notrectification + '}',  // 外部获取total
                          '{name|未整改}'
                        ].join('\n'),
                        rich: {
                          value: {
                            color: '#E63031',
                            fontSize: 18,
                            align: 'center'
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
                        show: true
                      }
                    }

                  },
                  {
                    value: total3 - notrectification,
                    label: {
                      normal: {
                        show: true,
                        position: 'outside',
                        fontSize: 60,   // 环中文字大小
                        formatter: [    // 环形图中间文字
                          '{value|' + (total3 - notrectification) + '}',
                          '{name|已整改}'
                        ].join('\n'),
                        rich: {
                          value: {
                            color: '#4DD6A7',
                            fontSize: 18,
                            align: 'center'
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
                        show: true
                      }
                    }

                  }

                ]
              }
            ]
          }
          break
        // 环形图 - 安全风险分区 风险情况
        case 'situation':
          let current = 80// 当前用量
          let all = 100// 总量
          let color = '#F1DE22'
          option = {
            emphasis: {
              show: false,
              textStyle: {
                fontSize: '12',
                fontWeight: 'bold'
              },
              formatter: '{d}%'
            },
            graphic: {
              type: 'text',
              left: '43%',
              top: '37%',
              z: 2,
              zlevel: 100,
              style: {
                text: (current / all * 100).toFixed(0) + '%',
                fill: '#ffffff',
                fontSize: 12
              }
            },
            series: [
              {
                type: 'pie',
                label: {
                  show: false
                },
                center: ['50%', '50%'],
                radius: ['90%', '100%'],
                startAngle: 180, // 旋转角度
                hoverAnimation: false,
                data: [
                  {
                    name: '用量',
                    value: current,
                    hoverAnimation: false, // 滑过不放大
                    itemStyle: {
                      color: color
                    }
                  },
                  {
                    name: 'rest', // 实际显示部分是总量-用量
                    value: all - current,
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
          break
        // 雷达图 - 安全风险分区 风险措施一览
        case 'measures':
          option = {
            backgroundColor: '',
            title: {
              text: ''
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              left: 'center',
              data: '某软件'
            },
            radar: {
              indicator: [
                {text: '工程技术类', max: 30},
                {text: '应急处置类', max: 30},
                {text: '个体防护类', max: 30},
                {text: '培训教育类', max: 30},
                {text: '管理类', max: 30}
              ],
              name: {
                textStyle: {
                  color: '#ffffff'
                }
              },
              axisLine: {
                lineStyle: {
                  color: '#304970'
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  width: 1,
                  color: '#304970' // 设置网格的颜色
                }
              },
              center: ['50%', '55%'],
              radius: '80%',
              splitArea: {
                show: false
              }
            },
            series:
            {
              type: 'radar',
              tooltip: {
                trigger: 'item'
              },
              color: '#304970',
              areaStyle: {
                color: {
                  type: 'linear',
                  x: 0,
                  y: 0,
                  r: 30,
                  colorStops: [{
                    offset: 0, color: '#00C6FF'
                  },
                  {
                    offset: 1, color: '#0685FB'
                  }]
                }
              },
              lineStyle: {
                color: 'none'
              },
              data: [
                {
                  value: [25, 15, 19, 22, 28],
                  name: '管控措施一览',
                  symbol: 'none'
                }
              ]
            }

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
        // case 'tankPie': // 环形图 - 重大危险源 储罐看板
        //   let dataT = this.chartData
        //   option = {
        //     tooltip: {
        //       trigger: 'item',
        //       position: ['33%', '3%'], // 提示框位置
        //       padding: ['12', '36'],  // 提示框填充
        //       // extraCssText:'width:18%;height:10%;', // 提示框宽高
        //       backgroundColor: 'rgba(255,255,255,0.7)',  // 提示框背景颜色
        //       alwaysShowContent: false,  // 提示框  true- 一直存在
        //       // formatter: "{c} <br/>{b}",  // 提示框显示数据
        //       formatter: function (param) {
        //         let temp = '<div style="text-align: center;font-size:12px;"><span style="color: #06112CFF;font-weight: bold">' + param.value + '</span> <br/> <span style="color:#8A92A6FF">' + param.name + '</span></div'
        //         return temp
        //       }
        //     },
        //     legend: {
        //       // orient: 'vertical',
        //       width: 260,
        //       height: 50,
        //       x: 'left',
        //       orient: 'horizontal',
        //       icon: 'emptyCircle',
        //       left: '50%',
        //       top: 'center',
        //       align: 'left',
        //       itemGap: 20,    // 各图例的间距
        //       itemWidth: 12,
        //       itemHeight: 12,
        //       zlevel: 2,
        //       data: [].concat(dataT.map(val => {
        //         return val.name
        //       })),
        //
        //       formatter: function (name) {
        //         let val = ''
        //         dataT.map(item => {
        //           if (item.name === name) {
        //             val = item.value
        //           }
        //         })
        //         return '{a|' + name + '    ' + val + '}'  // 右边图例的数据
        //       },
        //       textStyle: {
        //         rich: {
        //           a: {
        //             width: 70,
        //             fontSize: 12,
        //             color: '#BEC3CE'
        //           }
        //         }
        //       }
        //
        //     },
        //     color: ['#62A0F5', '#1678FF', '#D41A30', '#FF2C45', '#FF6678', '#FFA4AF', '#E6C248', '#61DCC3'], // 颜色分布
        //     series: [
        //       {
        //         name: '访问来源',
        //         type: 'pie',
        //         center: ['25%', '48%'],  // 环形图的位置
        //         radius: ['20%', '60%'],
        //         avoidLabelOverlap: false,
        //         hoverAnimation: false,  // 取消hover时放大效果
        //         label: {
        //           normal: {
        //             show: false,
        //             position: 'center'
        //           },
        //           emphasis: {
        //             show: true,
        //             textStyle: {
        //               fontSize: '30',
        //               fontWeight: 'bold'
        //             }
        //           }
        //         },
        //         labelLine: {
        //           normal: {
        //             show: false
        //           }
        //         },
        //         data: dataT
        //       },
        //       {   // 内部小白圈
        //         name: '',
        //         type: 'pie',
        //         z: 9999,   // 小白圈的层级
        //         radius: ['20%', '30%'],
        //         center: ['25%', '48%'],  // 环形图的位置
        //         avoidLabelOverlap: false,
        //         legendHoverLink: false,
        //         label: {
        //           show: false
        //         },
        //         tooltip: { // 禁止鼠标悬停显示提示框
        //           show: false
        //         },
        //         hoverAnimation: false, // 禁止鼠标悬停放大区域
        //         color: ['rgba(255,255,255,.6)'],
        //         data: [{
        //           value: '100'
        //         }]
        //       }]
        //   }
        //   break
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
