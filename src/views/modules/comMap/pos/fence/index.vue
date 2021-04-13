<template>
  <div class="map-fence-container">
    <slide-bar position="left" name="围栏列表" v-model="listVisable">
      <fence-list @handleClick="handleClick" ref="fenceList"></fence-list>
    </slide-bar>
    <slide-bar position="right" :name="resData.id ? '修改围栏' : '新增围栏'" @input="handleClick('init')" v-model="editVisable">
      <fence-edit @handleClick="handleClick" :resData="resData" type></fence-edit>
    </slide-bar>
    <slide-bar position="top" v-model="toolVisable">
      <fence-tool @handleClick="handleClick"></fence-tool>
    </slide-bar>
  </div>
</template>

<script>
import slideBar from '../../components/slideBar'
import fenceList from './fenceList'
import fenceEdit from './fenceEdit'
import fenceTool from './fenceTool'
export default {
  components: {
    slideBar,
    fenceList,
    fenceEdit,
    fenceTool
  },
  data () {
    return {
      resData: {
        id: '',
        point: []
      },
      listVisable: false, // 围栏列表状态
      editVisable: false, // 围栏编辑页状态
      toolVisable: false, // 围栏选点工具栏状态
      drawType: 0 // 选取类型 0：室外选取 1：室内选取
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
    handleClick (type, val, val2) { // 列表页点击事件 val2为备用传参
      switch (type) {
        case 'init': // 初始化
          this.init()
          break
        case 'create-out': // 创建室外围栏
          if (val) {
            this.resData = val
          }
          this.$parent.$refs.threeMap.handleObjectStatus(0, 'reset')
          console.log(this.resData)
          this.$parent.$refs.threeMap.clearCoordinate() // 删除地图上绘制的围栏
          this.$parent.$refs.threeMap.changeCameraMode('2D') // 切换到2D模式
          this.listVisable = false
          this.editVisable = false
          this.toolVisable = true
          this.resData.type = '1'
          this.drawType = 0
          break
        case 'create-inside': // 创建室内围栏
          if (val) {
            this.resData = val
          }
          this.$parent.$refs.threeMap.handleObjectStatus(0, 'reset')
          this.$parent.$refs.threeMap.clearCoordinate() // 删除地图上绘制的围栏
          this.$parent.$refs.threeMap.handleObjectStatus(1) // 切换到建筑选择模式
          this.$parent.$refs.threeMap.mountFunction('enterFloor', () => { // 挂载回调函数
            this.toolVisable = true
          })
          this.listVisable = false
          this.editVisable = false
          this.resData.type = '0'
          this.drawType = 1
          break
        case 'view-fence': // 查看围栏
          this.$parent.$refs.threeMap.clearCoordinate() // 删除地图上绘制的围栏
          this.resData = val
          let pointArr = []
          let points = val.coordinate.replace(/\(/g, '').replace(/\)/g, '').split('||').map(res => {
            let arrs = res.split(',')
            pointArr.push({
              x: parseFloat(arrs[0]),
              y: parseFloat(arrs[1]),
              z: parseFloat(arrs[2] ? arrs[2] : 0)
            })
            return [parseFloat(arrs[0]), parseFloat(arrs[2] ? arrs[2] : 0), parseFloat(arrs[1])]
          })
          this.resData.point = pointArr
          this.$parent.$refs.threeMap.drawExtrudeGeometry(points, undefined, undefined, Number(val.minHeight), Number(val.maxHeight)) // 绘制体块（回显）
          // this.$parent.$refs.ThreeMap.drawCoordinates(points) // 绘制围栏点（回显）
          this.$parent.$refs.threeMap.getPolygonAreaCenter(points, true, parseInt(val.maxHeight) * 6) // 获取多边形重心 是否移动至附近 相机距离多少
          break
        case 'edit': // 新增/修改围栏
          this.$parent.$refs.threeMap.clearCoordinate() // 删除地图上绘制的围栏
          if (val) {
            this.handleClick('view-fence', val)
          }
          this.listVisable = false
          this.editVisable = true
          this.toolVisable = false
          this.resData = val === undefined ? {
            id: '',
            point: []
          } : val
          break
        case 'start-select': // 开始选点
          this.$parent.$refs.threeMap.clearCoordinate() // 清除地图显示
          this.$parent.$refs.threeMap.startClickCoordinate(null, 3, 100, this.drawType)
          break
        case 'stop-select': // 结束选点
          let point = this.$parent.$refs.threeMap.stopClickCoordinate()
          if (this.drawType === 1) { // 室内
            this.resData.parmas = point.parmas
            point = point.selectPoint
          }
          if (point.length > 2) {
            this.resData.point = this.$parent.$refs.threeMap.stopClickCoordinate()
            this.toolVisable = false
            this.editVisable = true
          } else {
            this.$message.error('至少选择三个点！')
          }
          break
        case 'clear-select': // 清除选点
          this.$parent.$refs.threeMap.clearCoordinate()
          this.resData = {} // 清空围栏数据
          this.$parent.$refs.threeMap.handleObjectStatus(0, 'reset')
          this.listVisable = true
          this.editVisable = false
          break
      }
    },
    resetPage () { // 初始化
      this.listVisable = false
      this.editVisable = false
      this.toolVisable = false
      this.drawType = 0
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

<style lang='scss' scoped>
.map-fence-container {
  // width: 100%;
  // height: 100%;
  overflow-y: hidden;
}
</style>
