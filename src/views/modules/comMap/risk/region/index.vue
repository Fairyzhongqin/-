<!--three - 四色区-->
<template>
  <div class='map-zone-container'>
    <slide-bar position="left" name="区域列表" v-model="listVisable">
      <region-list @handleClick="handleClick"></region-list>
    </slide-bar>
    <slide-bar position="right" :name="resData.id ? '修改区域' : '新增区域'" @input="handleClick('init')" v-model="editVisable">
      <region-edit @handleClick="handleClick" :resData="resData" type=""></region-edit>
    </slide-bar>
    <slide-bar position="top" v-model="toolVisable">
      <!--<check-point-tool @handleClick="handleClick"></check-point-tool>-->
    </slide-bar>
  </div>
</template>

<script>
import slideBar from '../../components/slideBar'
import regionList from './regionList'
import regionEdit from './regionEdit'
// import zoneTool from './zoneTool'
export default {
  components: {
    slideBar,
    regionList,
    regionEdit
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
    handleClick (type, val, val2) { // 列表页点击事件
      switch (type) {
        case 'init':      // 初始化
          this.init()
          break
        case 'edit': // 新增/修改区域
          if (val) this.resData = val
          if (val && val.fencingList && val.fencingList.length) {
            console.log(val.fencingList[0].coordinate)
            let pointArr = []
            let points = ''
            val.fencingList.map(value => {
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
              // this.$parent.$refs.ThreeMap.drawCoordinates(points) // 绘制围栏点（回显）
              // this.$parent.$refs.ThreeMap.getPolygonAreaCenter(points, true, parseInt(val.fencingList[0].maxHeight || 0) * 6) // 获取多边形重心 是否移动至附近 相机距离多少
            })
          }
          this.listVisable = false
          this.editVisable = true
          this.toolVisable = false
          break
        case 'view-fance': // 显示/清除围栏
          console.log(val2)
          this.$parent.$refs.threeMap.clearCoordinate() // 删除地图上绘制
          if (val2 && val2.subregion && val2.subregion.length && val2.riskLevel === null) { // 多个围栏
            val2.subregion.map(subVal2 => {
              if (subVal2.fencingList && subVal2.fencingList.length) {
                let pointArr = []
                let points = ''
                subVal2.fencingList.map(value => {
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
                  let color // 风险风区颜色
                  switch (subVal2.riskLevel) {
                    case '0':
                      color = 0xff0202
                      break
                    case '1':
                      color = 0xff5200
                      break
                    case '2':
                      color = 0xd2b800
                      break
                    case '3':
                      color = 0x0250ff
                      break
                    default:
                      break
                  }
                  this.$parent.$refs.threeMap.drawExtrudeGeometry(points, undefined, undefined, Number(value.minHeight) || undefined, Number(value.maxHeight) || undefined, color, 0.65) // 绘制体块（回显）
                  this.$parent.$refs.threeMap.getPolygonAreaCenter(points, true, 300) // 获取重心，并移到最近
                })
              }
            })
          } else { // 单个围栏
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
                let color // 风险风区颜色
                switch (val2.riskLevel) {
                  case '0':
                    color = 0xff0202
                    break
                  case '1':
                    color = 0xff5200
                    break
                  case '2':
                    color = 0xd2b800
                    break
                  case '3':
                    color = 0x0250ff
                    break
                  default:
                    break
                }
                this.$parent.$refs.threeMap.drawExtrudeGeometry(points, undefined, undefined, Number(value.minHeight) || undefined, Number(value.maxHeight) || undefined, color, 0.65) // 绘制体块（回显）
                this.$parent.$refs.threeMap.getPolygonAreaCenter(points, true, 300) // 获取重心，并移到最近
                // this.$parent.$refs.ThreeMap.drawCoordinates(points) // 绘制围栏点（回显）
                // this.$parent.$refs.ThreeMap.getPolygonAreaCenter(points, true, parseInt(val.fencingList[0].maxHeight || 0) * 6) // 获取多边形重心 是否移动至附近 相机距离多少
              })
            }
          }
          break
        case 'view-fanceList': // 显示/清除围栏list
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
              let color // 风险风区颜色
              switch (value.riskLevel) {
                case '0':
                  color = 0xff0202
                  break
                case '1':
                  color = 0xff5200
                  break
                case '2':
                  color = 0xd2b800
                  break
                case '3':
                  color = 0x0250ff
                  break
                default:
                  break
              }
              this.$parent.$refs.threeMap.drawExtrudeGeometry(points, undefined, undefined, Number(value.minHeight) || undefined, Number(value.maxHeight) || undefined, color, 0.65) // 绘制体块（回显）
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
