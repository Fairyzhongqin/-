<template>
  <transition enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
    <div class="message-box-container" v-show="value">
      <div class="bounced-title">
        <el-row>
          <el-col :span="4" class="close-left" align="left">
            <div class="bounced-title-right" @click="close">
              <i class="el-icon-caret-right"></i>
              <i class="el-icon-caret-right"></i>
            </div>
          </el-col>
          <el-col :span="16" align="center">{{title}}</el-col>
        </el-row>
      </div>
      <div class="main">
        <slot></slot>
        <div class="show-more flex flex-row-r" v-show="showMore">
          <div class="more-button">>> 查看详情</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '信息悬浮框'
    },
    value: {
      type: Boolean,
      default: false
    },
    showMore: {
      type: Boolean,
      default: false
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

<style lang='scss' scoped>
.message-box-container {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7));
  width: 340px;
  position: relative;
  border-radius: 4px;
  // .title {
  //   width: 100%;
  //   height: 35px;
  //   line-height: 35px;
  //   color: #fff;
  //   padding: 0 15px;
  //   border-bottom: 1px solid #5a5a5a;
  //   font-size: 14px;
  //   font-weight: bold;
  //   color: rgba(254, 254, 254, 1);
  //   text-shadow: 0px 0px 6px rgba(0, 198, 255, 1);
  // }
  .bounced-title {
    width: 100%;
    height: 35px;
    line-height: 35px;
    padding: 0 15px;
    border-bottom: 1px solid #5a5a5a;
    font-size: 14px;
    font-weight: bold;
    color: rgba(254, 254, 254, 1);
    text-shadow: 0px 0px 6px rgba(0, 198, 255, 1);
    .close-left {
      padding-top: 9px;
    }
    .bounced-title-right {
      cursor: pointer;
      width: 24px;
      padding: 0px 1px 0px 1px;
      height: 16px;
      background: rgba(199, 199, 204, 0.08);
      border-radius: 2px;
      background-image: radial-gradient(#313130 55%, #1c72c3);
      .el-icon-caret-right {
        color: #00c6ff;
        font-size: 12px;
        width: 4px;
        height: 8px;
        position: relative;
        bottom: 10px;
      }
    }
  }
  .main {
    min-height: 245px;
    padding: 10px 15px;
  }
  .show-more {
    position: absolute;
    bottom: 10px;
    right: 10px;
    .more-button {
      margin-right: 0px;
      color: #fff;
      cursor: pointer;
      /*text-decoration: underline;*/
      transition: 0.3s;
      &:hover {
        color: #2c78bb;
      }
    }
  }
}
</style>
