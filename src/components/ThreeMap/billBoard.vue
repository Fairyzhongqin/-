<!--
 * @Descripttion: 
 * @version: threemap billboard
 * @Author: Mr.What
 * @Date: 2020-01-15 10:38:11
 * @LastEditors  : Mr.What
 * @LastEditTime : 2020-01-16 09:57:46
 -->
<template>
  <div class="three-map-billboard-container">
    <div class="billboard-left" @click="callbacks ? callbacks[0]() : null">{{opacityStatus?'取消透明':'建筑透明'}}</div>
    <div class="billboard-right" @click="callbacks ? callbacks[1]() : null">{{splitStatus?'取消分层':'分层展示'}}</div>
    <div class="billboard-close" @click="callbacks ? callbacks[2]() : null">取消</div>
  </div>
</template>

<script>
export default {
  components: {},
  data () {
    return {
      visible: false,
      callbacks: null,
      opacityStatus: false, // 透明状态
      splitStatus: false // 分层状态
    }
  },
  created () { },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    init (callbacks, object, opacityStatus, splitStatus) {
      this.visible = true
      this.callbacks = callbacks
      this.opacityStatus = opacityStatus
      this.splitStatus = splitStatus
    },
    remove (object) {
      this.visible = false
      this.objectNameCache = null
      this.callbacks = null
      if (object) {
        let bb = object.getObjectByName('billboard')
        if (bb) {
          object.remove(bb)
        }
      }
    }
  },
  beforeDestroy () {
    this.remove()
  }
}
</script>

<style lang="scss">
.three-map-billboard-container {
  display: flex;
  position: relative;
  font-size: 12px;
  .billboard-left {
    position: absolute;
    bottom: -10px;
    right: -5px;
    width: 65px;
    height: 65px;
    text-align: center;
    line-height: 65px;
    border-radius: 50%;
    background-color: #006dfc85;
    color: #fff;
    cursor: pointer;
    &:hover {
      background-color: #006dfcbf;
      box-shadow: 0px 0px 20px 0px #006dfcbf;
    }
    transition: all 1s;
  }
  .billboard-right {
    position: absolute;
    bottom: -10px;
    left: -5px;
    width: 65px;
    height: 65px;
    text-align: center;
    line-height: 65px;
    border-radius: 50%;
    background-color: #fcdd0085;
    color: #fff;
    cursor: pointer;
    &:hover {
      background-color: #fcdd00bf;
      box-shadow: 0px 0px 20px 0px #fcdd00bf;
    }
    transition: all 1s;
  }
  .billboard-close {
    position: absolute;
    top: -6px;
    right: -31px;
    width: 65px;
    height: 65px;
    text-align: center;
    line-height: 65px;
    border-radius: 50%;
    background-color: #fc000085;
    color: #fff;
    cursor: pointer;
    &:hover {
      background-color: #fc0000bf;
      box-shadow: 0px 0px 20px 0px #fc0000bf;
    }
    transition: all 0.5s;
  }
}
</style>
