<!--
 * @Descripttion: 
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-11-10 19:11:05
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-11-10 19:24:08
 -->
<!--three - 地图参数管理-->
<template>
  <div class='map-config-container'>
    <slide-bar position="left" name="地图参数配置" v-model="listVisable">
      <list @handleClick="handleClick"></list>
    </slide-bar>
  </div>
</template>

<script>
import slideBar from '../../components/slideBar'
import list from './list'
export default {
  components: {
    slideBar,
    list
  },
  data () {
    return {
      resData: {},
      listVisable: false // 列表状态
    }
  },
  created () { },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    init () { // 加载
      this.resetPage()
      this.listVisable = true
    },
    handleClick (type, val) { // 列表页点击事件
      switch (type) {
        case 'init': // 初始化
          this.init()
          break
        case 'edit': // 新增/修改摄像头
          break
        default:
          this.$message.error(type + '操作错误！')
          break
      }
    },
    resetPage () { // 初始化
      this.listVisable = false
    },
    handleEditClick () {

    },
    handleToolClick () {

    }
  }
}
</script>

<style lang='scss'>
.map-config-container {
  // width: 100%;
  // height: 100%;
  overflow-y: hidden;
}
</style>
