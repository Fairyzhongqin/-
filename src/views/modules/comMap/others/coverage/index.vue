<!--
 * @Descripttion: 
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-11-07 22:06:22
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-11-10 19:02:20
 -->
<!--three - 区域管理-->
<template>
  <div class='map-coverage-container'>
    <slide-bar position="left" name="图层列表" v-model="listVisable">
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
      refData: {
        id: null
      },
      listVisable: false // 卡口列表状态
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
        case 'init':      // 初始化
          this.listVisable = true
          break
        case 'init-objects': // 加载物体们
          this.$parent.$refs.threeMap.displayObjects(val, 3, false)
          break
        case 'remove-objects': // 移除物体们
          this.$parent.$refs.threeMap.clearCoordinate(val)
          break
        default:
          this.$message.error(type + '操作错误！')
          break
      }
    },
    resetPage () { // 初始化
      this.listVisable = false
      this.$parent.$refs.threeMap.changeCameraMode('3D')
      this.$parent.$refs.threeMap.handleObjectStatus(0, 'reset')
      this.$parent.$refs.threeMap.clearCoordinate()
      this.refData = {}
    },
    handleEditClick () {

    },
    handleToolClick () {

    }
  }
}
</script>

<style lang='scss'>
.map-coverage-container {
  // width: 100%;
  // height: 100%;
  overflow-y: hidden;
}
</style>
