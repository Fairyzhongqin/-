<!--
 * @Descripttion: 弹框组件 传入type类型 从不同地方滑出
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-11-26 20:10:43
 * @LastEditors  : Mr.What
 * @LastEditTime : 2019-12-20 15:16:15
 -->
<template>
  <div class="cesium-message-box-mix-container" :class="type" :style="type==='center'?'left: calc(50vw - '+(width/2)+'px);':''">
    <transition :enter-active-class="'animated ' + animatedClass[0]" :leave-active-class="'animated ' + animatedClass[1]">
      <div v-if="value">
        <slot></slot>
        <el-button class="close-button" v-if="type!=='left-small'" type="text" icon="el-icon-close" @click="()=>{$emit('input', false)}"></el-button>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      // left left-small right right-middle bottom center 布局配置
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    },
    width: { // 只在type为center时使用
      type: [Number, String]
    }
  },
  components: {},
  data () {
    return {}
  },
  created () { },
  mounted () { },
  computed: {
    animatedClass () {
      let classs = []
      switch (this.type) {
        case 'left':
          classs[0] = 'slideInLeft'
          classs[1] = 'slideOutLeft'
          break
        case 'left-small':
          classs[0] = 'slideInDown'
          classs[1] = 'slideOutUp'
          break
        case 'right':
        case 'right-middle':
          classs[0] = 'slideInRight'
          classs[1] = 'slideOutRight'
          break
        case 'bottom':
          classs[0] = 'fadeInUp'
          classs[1] = 'fadeOutDown'
          break
        case 'center':
          classs[0] = 'zoomIn'
          classs[1] = 'zoomOut'
          break
      }

      console.log(classs)
      return classs
    }
  },
  watch: {},
  methods: {}
}
</script>

<style lang='scss'>
.cesium-message-box-mix-container {
  position: absolute;
  &.left-small {
    left: 200px;
    top: 10px;
    .close-button {
      right: 5px;
    }
  }
  &.left {
    left: 195px;
    top: 5px;
    .close-button {
      right: 5px;
    }
  }
  &.right {
    right: 5px;
    top: 45px;
    .close-button {
      left: 5px;
    }
  }
  &.right-middle {
    right: 5px;
    top: calc(50vh + 5px);
    .close-button {
      left: 5px;
    }
  }
  &.bottom {
    top: calc(100vh - 170px);
    .close-button {
      right: 5px;
    }
  }
  &.center {
    top: 80px;
    .close-button {
      right: 5px;
    }
  }
  .close-button {
    position: absolute;
    top: 0px;
    width: 30px;
    height: 30px;
    padding: 0;
    .el-icon-close {
      color: #4285f4;
    }
  }
}
</style>
