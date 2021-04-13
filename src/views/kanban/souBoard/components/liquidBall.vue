<template>
  <div class='liquid-ball-container'
       :style="'width:'+size+'px;height:'+size+'px'">
    <div :id="name"
         class="liquid">
    </div>
    <div class="text"
         :style="'width:'+size+'px;height:'+size+'px;'">
      <div style="font-size:18px;">{{parseFloat((this.value[Object.keys(this.value)[0]]*100).toPrecision(12)) + '%'}}</div>
      <div>{{Object.keys(this.value)[0]}}</div>
    </div>
  </div>
</template>

<script>
// https://github.com/ecomfe/echarts-liquidfill#api Echarts水波球api
import echarts from 'echarts'
export default {
  props: {
    size: { // 大小 即为宽高的像素尺寸
      type: String,
      default: '80'
    },
    value: {
      type: Object,
      default: () => {
        return { '达标率': 0.6 }
      }
    },
    name: {
      type: String,
      required: true
    }
  },
  components: {},
  data () {
    return {
      chartBar: null,
      option: {
        series: [{
          type: 'liquidFill',
          radius: '97%',
          amplitude: 2.5,
          data: [this.value[Object.keys(this.value)[0]], this.value[Object.keys(this.value)[0]]],
          color: ['rgba(0,198,255,0.8)', 'rgba(0,198,255,0.6)'],
          label: {
            normal: {
              fontSize: 12,
              color: '#fff',
              insideColor: 'transparent',
              formatter: function (param) {
                return ''
              }
            }
          },
          outline: {
            show: true,
            borderDistance: 0,
            itemStyle: {
              borderColor: '#414d67',
              borderWidth: 2
            }
          },
          backgroundStyle: {
            color: 'rgba(103,184,255,0)'
          }
        }]
      }
    }
  },
  created () { },
  mounted () {
    this.initLiquidRoute()
  },
  computed: {
  },
  watch: {
    value: {
      handler (val) {
        this.option.series[0].data = [this.value[Object.keys(this.value)[0]], this.value[Object.keys(this.value)[0]]]
        // val[Object.keys(val)[0]]
        this.chartBar.setOption(this.option, true)
      },
      deep: true
    }
  },
  methods: {
    initLiquidRoute () {
      this.chartBar = echarts.init(document.getElementById(this.name))
      this.chartBar.setOption(this.option)
      window.aa = this.chartBar
      window.addEventListener('resize', () => {
        this.chartBar.resize()
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.liquid-ball-container {
  position: relative;
  .liquid {
    width: 100%;
    height: 100%;
  }
  .text {
    position: absolute;
    font-size: 12px;
    text-align: center;
    color: #fff;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
}
</style>
