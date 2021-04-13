<!--电池-->
<!--&gt;50%>25%  <25%红色 0%-->
<template>
  <div class="batterys">
    <div class="battery">
      <div class="battery-outer"
           :class="batteryClass">
        <div class="battery-inner">
          <div class="battery-content">
            <div ref="power"
                 class="battery-content-power">
            </div>
          </div>
        </div>
      </div>
    </div>
    <span class="bat-number">
      <template v-if="num">
        {{num}}%
      </template>
      <template v-else>
        <span style="color: gray">未知</span>
      </template>
    </span>
  </div>
</template>

<script>
export default {
  name: 'battery',
  data () {
    return {
      batteryClass: 'Battery-gray'
    }
  },
  props: {
    num: {
      type: String,
      default: '0'
    }
  },
  methods: {
    // 获取电池电量
    getBatteryNum (val) {
      if (val) {
        if (Number(val) > 50) {
          this.batteryClass = 'Battery-green' // 绿色
        } else if (Number(val) > 25) {
          this.batteryClass = 'Battery-orange' // 橘色
        } else {
          this.batteryClass = 'Battery-red' // 红色
        }
      }
      this.$refs.power.style.width = 'calc(' + val + '% - 2px)'
    }
  },
  created () {
    this.$nextTick(() => {
      this.getBatteryNum(this.num) // 获取电池电量
    })
  }
}
</script>

<style scoped lang="scss">
.batterys {
  overflow: hidden;
  line-height: 1;
  .bat-number {
    float: left;
    color: #222222;
    display: inline-block;
    margin-left: 8px;
    height: 18px;
    line-height: 18px;
  }
  .battery {
    float: left;
    &-gray {
      .battery-content {
        border: 1px solid #3f4a5433;
        &:after {
          background-color: #3f4a5433;
        }
        &:before {
          background-color: transparent;
        }
      }
      .battery-content-power {
        background-color: transparent;
      }
    }
    &-red {
      .battery-content-power {
        background: #ff4444;
      }
    }
    &-green {
      .battery-content-power {
        background: #34c2aa;
      }
    }
    &-orange {
      .battery-content-power {
        background: orange;
      }
    }
    display: inline-block;
    *,
    *:before,
    *:after {
      box-sizing: border-box;
    }
    &-outer {
      display: table;
      height: 100%;
      width: 100%;
    }
    &-inner {
      height: 18px;
      display: table-cell;
      vertical-align: middle;
      text-align: center;
    }
    &-content {
      position: relative;
      display: inline-block;
      height: 18px;
      width: 40px;
      padding: 1px;
      border: 1px solid #3f4a54;
      border-radius: 3px;
      &:before {
        content: "";
        position: absolute;
        top: 1px;
        right: 1px;
        width: 12%;
        height: calc(100% - 2px);
        bottom: 0;
        background: transparent;
        z-index: 2;
      }
      &:after {
        content: "";
        position: absolute;
        top: calc(50% - 4px);
        right: -3px;
        height: 8px;
        width: 2px;
        border-radius: 0 2px 2px 0;
        background-color: #3f4a54;
      }
      &-power {
        position: absolute;
        width: calc(100% - 2px);
        height: calc(100% - 2px);
        border-radius: 2px;
        background: #ff4444;
      }
    }
  }
}
</style>
