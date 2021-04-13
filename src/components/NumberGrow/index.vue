<template>
  <div class="number-grow-warp">
    <span ref="numberGrow" :data-time="time" :style="{fontSize:fonts + 'px',color: fontc,lineHeight: lineH + 'px'}" class="number-grow" :data-value="value">0</span>
  </div>
</template>

<script>
  export default {
    props: {
      time: {
        type: Number,
        default: 2
      },
      value: {
        type: Number,
        default: 0
      },
      fonts: {   // 字体大小
        type: Number,
        default: 18
      },
      fontc: {   // 字体颜色
        type: String,
        default: '#00c6ff'
      },
      lineH: {    // 行高
        type: Number,
        default: 30
      }
    },
    methods: {
      numberGrow (ele) {
        let _this = this
        let step = (Number(_this.value) * 10) / (_this.time * 1000)
        let current = 0
        let start = 0
        let t = setInterval(function () {
          start += step
          if (start > _this.value) {
            clearInterval(t)
            start = _this.value
            t = null
          }
          if (current === start) {
            return
          }
          current = start
          ele.innerHTML = current < 1000 ? current.toFixed(0).toString() : current.toFixed(0).toString().replace(/(\d)(?=(?:\d{3}[+]?)+$)/g, '$1,')
        }, 10)
      }
    },
    mounted () {
      this.numberGrow(this.$refs.numberGrow)
    },
    watch: {
      value () {
        this.numberGrow(this.$refs.numberGrow)
      }
    }
  }
</script>

<style lang="scss">
  .number-grow-warp{
    transform: translateZ(0);
    .number-grow {
      font-family: Arial-BoldMT;
      font-size: 64px;
      letter-spacing: 2.67px;
      display: block;
      line-height:40px;
    }
  }
</style>
