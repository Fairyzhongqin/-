<!--three - 区域管理-->
<template>
  <div class='map-zone-container'>
    <slide-bar position="left" name="区域列表" v-model="listVisable">
      <zone-list @handleClick="handleClick"></zone-list>
    </slide-bar>
    <slide-bar position="right" :name="resData.id ? '修改区域' : '新增区域'" @input="handleClick('init')" v-model="editVisable">
      <zone-edit @handleClick="handleClick" :resData="resData" type=""></zone-edit>
    </slide-bar>
    <slide-bar position="top" v-model="toolVisable">
    </slide-bar>
  </div>
</template>

<script>
import slideBar from '../../components/slideBar'
import zoneList from './zoneList'
import zoneEdit from './zoneEdit'
export default {
  components: {
    slideBar,
    zoneList,
    zoneEdit
  },
  data () {
    return {
      resData: {
        id: null
      },
      listVisable: false, // 列表状态
      editVisable: false, // 新增/编辑页状态
      toolVisable: false // 选点工具栏状态
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
          this.init()
          break
        case 'edit': // 新增/修改区域
          if (val) this.resData = val
          this.$parent.$refs.threeMap.clearCoordinate() // 删除地图上绘制的围栏
          this.listVisable = false
          this.editVisable = true
          this.toolVisable = false
          break
        case 'view-fance': // 显示/清除围栏
          this.$parent.$refs.threeMap.clearCoordinate() // 删除地图上绘制的围栏
          if (val && val.length) {
            let pointArr = []
            let points = ''
            val.map(value => {
              pointArr = []
              points = value.coordinate.replace(/\(/g, '').replace(/\)/g, '').split('||').map(res => {
                let arrs = res.split(',')
                pointArr.push({
                  x: parseFloat(arrs[0]),
                  y: parseFloat(arrs[1]),
                  z: parseFloat(arrs[2] ? arrs[2] : 0)
                })
                return [parseFloat(arrs[0]), parseFloat(arrs[2] ? arrs[2] : 0), parseFloat(arrs[1])]
              })
              this.$parent.$refs.threeMap.drawExtrudeGeometry(points, undefined, undefined, Number(value.minHeight) || undefined, Number(value.maxHeight) || undefined) // 绘制体块（回显）
              this.$parent.$refs.threeMap.getPolygonAreaCenter(points, true, 300) // 获取重心，并移到最近
            })
          }
          break
        default:
          this.$message.error(type + '操作错误！')
          break
      }
    },
    resetPage () { // 初始化
      this.listVisable = false
      this.editVisable = false
      this.toolVisable = false
      this.$parent.$refs.threeMap.changeCameraMode('3D')
      this.$parent.$refs.threeMap.handleObjectStatus(0, 'reset')
      this.$parent.$refs.threeMap.clearCoordinate()
      this.resData = {}
    },
    handleEditClick () {

    },
    handleToolClick () {

    }
  }
}
</script>

<style lang='scss'>
.map-zone-container {
  // width: 100%;
  // height: 100%;
  overflow-y: hidden;
}
</style>
