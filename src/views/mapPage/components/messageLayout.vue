<!--
 * @Descripttion: 信息框布局
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-11-27 11:52:32
 * @LastEditors  : Mr.What
 * @LastEditTime : 2020-01-03 09:55:30
 -->
<template>
  <div class="cesium-message-layout-container" :style="'height:'+((height?height:'calc(100vh - 10px)') + ';width:'+width+';')">
    <div class="header enable-drag">
      {{name}}
    </div>
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    height: {
      type: String
    },
    width: {
      type: [String, Number],
      default: '250px'
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
  methods: {}
}
</script>

<style lang="scss">
.cesium-message-layout-container {
  background-color: rgba(0, 0, 0, 0.7);
  border: 1px solid #3365b7ad;
  position: relative;
  padding: 5px;
  border-radius: 10px;
  .header {
    width: 100%;
    height: 28px;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
    color: #fefefe;
    text-shadow: 0px 0px 6px #00c6ff;
    border-bottom: 1px solid #3365b7ad;
  }
  .content {
    width: 100%;
    height: calc(100% - 29px);
    overflow: hidden;
    position: relative;
    .el-table {
      /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
      &::-webkit-scrollbar {
        width: 6px;
        /*滚动条宽度*/
        height: 6px;
        /*滚动条高度*/
        background-color: transparent;
      }
      /*定义滑块 内阴影+圆角*/
      &::-webkit-scrollbar-thumb {
        margin-right: 1px;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        background-color: hsla(220, 4%, 58%, 0.5);
        /*滚动条的背景颜色*/
        border-radius: 6px;
      }
    }
  }
}
</style>
