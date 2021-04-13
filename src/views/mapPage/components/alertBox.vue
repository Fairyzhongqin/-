<template>
  <transition enter-active-class="animated bounceIn" leave-active-class="animated bounceOut">
    <div class='alert-box-container' v-if="value" v-dialogDrag>
      <div :class="{'twinkle': twinkle}" style="height: 100%;">
        <div class="close" @click="close()">
          <i class="el-icon-close"></i>
        </div>

        <div class="content flex flex-row">
          <div class="icon enable-drag">
          </div>
          <div class="text">
            <transition-group mode="out-in" enter-active-class="animated slideInDown delay-1s" leave-active-class="animated slideOutDown">
              <div :key="index" v-for="(text, index) in data">{{(text.info)}}</div>
            </transition-group>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    twinkle: { // 边框闪烁
      type: Boolean,
      default: false
    },
    data: {
      type: Array
    }
  },
  components: {},
  data () {
    return {

    }
  },
  created () { },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    close () {
      this.$emit('input', false)
    }
  }
}
</script>

<style lang='scss'>
.alert-box-container {
  background-color: rgba(0, 0, 0, 0.7);
  height: 90px;
  min-height: 90px;
  width: 450px;
  border-radius: 10px;
  position: absolute;
  top: 15px;
  left: calc(50% - 225px);
  z-index: 2;
  .close {
    cursor: pointer;
    height: 10px;
    width: 10px;
    position: absolute;
    right: 13px;
    top: 5px;
    font-size: 18px;
    .el-icon-close {
      color: #fff;
    }
  }
  .content {
    width: 100%;
    height: 100%;
    .icon {
      width: 100px;
      height: 100%;
      line-height: 100%;
      background-image: url('~@/assets/img/sos.png');
      background-repeat: no-repeat;
      background-size: 72px 72px;
      background-position: center;
    }
    .text {
      width: 69%;
      margin: 9px;
      color: #cc232a;
      font-size: 16px;
      overflow-y: auto;
    }
  }
  .twinkle {
    border-radius: 10px;
    animation: grow 0.5s infinite alternate;
  }
  @keyframes grow {
    0% {
      box-shadow: 0 0 5px #000;
    }
    100% {
      box-shadow: 0 0 30px #cc232a;
    }
  }

}
</style>
