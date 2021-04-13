<!--
 * @Descripttion: 
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-10-25 09:13:12
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-11-05 11:56:47
 -->
<template>
  <div class='tabs-card-container'>
    <div class="tab-control-bar">
      <div class="tab-control-item"
           v-for="(tab, index) in tabData"
           :key="index"
           @click="changeIndex(index)"
           :class="{'active': index === value}">
        <div class="tab-control-num">{{tab.value}}</div>
        <div class="tab-control-text">{{tab.name}}</div>
      </div>
    </div>

    <div class="split-line"></div>
    <!-- <div style="font-size:14px;color:#FFF;line-height:22px;">每日作业</div> -->
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    tabData: {
      type: Array
    },
    value: {
      type: Number,
      default: 0
    }
  },
  components: {},
  data () {
    return {
    }
  },
  created () { },
  mounted () { },
  computed: {
    activeIndex () {
      return this.value
    }
  },
  watch: {},
  methods: {
    changeIndex (val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  }
}
</script>

<style lang='scss' scoped>
.tabs-card-container {
  .tab-control-bar {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    .tab-control-item {
      width: 72px;
      height: 48px;
      position: relative;
      // background: rgba(0, 198, 255, 0.2);
      text-align: center;
      cursor: pointer;
      .tab-control-num {
        font-size: 18px;
        color: rgba(255, 255, 255, 1);
        margin-top: 6px;
      }
      .tab-control-text {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
        margin-top: 3px;
      }
      &.active {
        background: rgba(0, 198, 255, 0.2);
        &::after {
          content: "";
          width: 10px;
          height: 10px;
          position: absolute;
          bottom: -15px;
          left: calc(50% - 5px);
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          border-left: 1px solid rgba(255, 255, 255, 0.15);
          transform: rotate(45deg);
        }
      }
    }
  }

  .split-line {
    width: 100%;
    margin-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }
}
</style>
