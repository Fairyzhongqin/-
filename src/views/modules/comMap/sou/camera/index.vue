<!--three - 摄像头管理-->
<template>
  <div class='map-camera-container'>
    <slide-bar position="left" name="摄像头列表" v-model="listVisable">
      <camera-list @handleClick="handleClick"></camera-list>
    </slide-bar>
    <slide-bar position="right" :name="resData.id ? '修改摄像头' : '新增摄像头'" @input="handleClick('init')" v-model="editVisable">
      <camera-edit @handleClick="handleClick" :resData="resData" type=""></camera-edit>
    </slide-bar>
    <slide-bar position="top" v-model="toolVisable">
      <camera-tool @handleClick="handleClick"></camera-tool>
    </slide-bar>
  </div>
</template>

<script>
import slideBar from '../../components/slideBar'
import cameraList from './cameraList'
import cameraEdit from './cameraEdit'
import cameraTool from './cameraTool'
export default {
  components: {
    slideBar,
    cameraList,
    cameraEdit,
    cameraTool
  },
  data () {
    return {
      resData: {},
      listVisable: false, // 列表状态
      editVisable: false, // 新增/编辑页状态
      toolVisable: false, // 选点工具栏状态
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
    handleClick (type, val) { // 列表页点击事件
      switch (type) {
        case 'init': // 初始化
          this.init()
          break
        case 'edit': // 新增/修改摄像头
          this.$parent.$refs.threeMap.clearCoordinate('cameraPoint') // 清除地图显示
          this.resData = {}
          if (val) { // 修改状态
            this.resData = val
            this.resData.position = val.x + ',' + val.y + ',' + val.z
            this.handleClick('view', val)
          }
          this.listVisable = false
          this.editVisable = true
          this.toolVisable = false
          // this.resData.type = '1'
          break
        case 'view': // 查看
          this.$parent.$refs.threeMap.displayObjects({
            typeName: 'cameraPoint',
            iconBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAEJElEQVRIS8WXfUyVdRTHv+e5ukmNF4G8d+AaeFkUV8p1gaGbFkIuAnOEqLxMW81BNbYWGqlJjV6Ioa1WTZxZy+2iBXill0FkIDhb4+Uf4bJeZGPUkosDCSYX8D7Pab/HcblX7r08sCW//57nd875nHN+5zm/8xA0LI6KWoU1AemyQttAZCbAyECwUCXgXwb6wdytk7gZw45GGhiYWsgs+RMYT3o4LECWSiSJihhYrcoaDMCDUaCgIPWRx8eBwQFgaEh9JuCmonC1Q6ccD+r4bcSXfZ9gZ4JpL4g/BCgMxhhQVjboiRTQGr1XWzxsB7e1gq31QP814dIImF5b0WU7401hHpjN5pUyOapB9AL0ekivHgClpALkNzlztpnBrT9D+egYYLcDzF/oOKCIurtvuzvgYU2FSlP1ALbTlidBZeWgwMCFjst7BiYmwOVl4PZLYv87nbIq2x3uAXYmxJ0WkdKOLEhvvAlI0pKgLiVFgfLBu+AGqxr5iq6+F2f3XOA7Z4qvRKRS5fEFoTZbn2rDZIrz75yAl5bciZyxb/bMVbCo3vtY+h16Q5hkqdWU3pMnT6nAwsL9C2aFJyag5OcA9qGRSVJiRbWr4NvmuPdJokNSRRVoa9qChoTAYsDqZ9dyEcqhg2CFK1Z29x0m0RyUB+7/h40xq3WWbzRX72LBYIacvwvUf+2mdONWBHHSI1kyS+fpQCmknD2aol1KxEJHqT0HPlYJHSnPkTMh7gSIiqRvm0D6+c2h19aHgoLnYTSuQ17ubmRkpKO27jyOHn0bT6WloqqqAiEhIZocZrsdyrNPiwqvJmeiqQMGQ6KuodGrcmHhK/j89JeuveDgYOzMzkJqagquXx+CMWYdtmdmaAILIXlHumivnSQnmkY4KTlU98mJecrT09OIiIzG2NiYV8Nr10Yid88u5OXn4tH49ZrgcvFLoI5fR0XETkrbppPeq5ynaLU2YGdOriaD8fHr8frBEuTl7fYrrxwpBV9slv2CBVTAta7Q0FDcGP5bG9hXqh0OB8LCIyDSrXVlZj6Dhgt1fsXdU+21uGRZhjlhI3p6erVycbbmDG5NTqKzswtXr/YgPDwcF6y1Hvqu4vL3OQl4W/tl1NR8jfp6K8bFpe9jBQYGou3ST3jcnOySKCraj88+/dj17PE5aW0gU1NT+P6HRlgsZ9HU1IyZmRkPF/btLUBs7EM4fKTM9f5yews2bZpzxKOBLKVljo6Ooq7OCkvNOVy58guYGa0tP6rg5I1bMDj4F6Kjo/DnHzbQ7ABxd8sU7i3lkpgNS0CEIxs2PKa+6um1YfPmrSgufhnvlL81l+a7Lwmxs5Rr0V/Fibs6MjLC1Up9XovCyGIHAc2l7m8QmDWyLKOPgC/bsOeC3+vx1v3c7vlA7w5fll8Ydwf+j5+2/wC8WFebRNELnQAAAABJRU5ErkJggg==',
            iconSize: 24,
            iconOffset: 0,
            point: [{
              x: parseFloat(val.x),
              y: parseFloat(val.z),
              z: parseFloat(val.y),
              id: val.id,
              name: 'beacon',
              cnName: val.name,
              data: {
                '摄像头编号': val.code,
                '播放视频': val.remarks
              }
            }]
          })
          this.$parent.$refs.threeMap.setCameraByLocAndLen(parseFloat(val.x), parseFloat(val.z), parseFloat(val.y), 30)
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
        case 'create-out': // 开始选择坐标(室外)
          if (val) this.resData = val
          this.$parent.$refs.threeMap.handleObjectStatus(0, 'reset')
          this.$parent.$refs.threeMap.clearCoordinate('cameraPoint') // 清除地图显示
          this.$parent.$refs.threeMap.changeCameraMode('2D') // 切换到2D模式
          this.listVisable = false
          this.editVisable = false
          this.toolVisable = true
          this.drawType = 0
          break
        case 'create-inside': // 开始选择坐标(室内)
          if (val) this.resData = val
          this.$parent.$refs.threeMap.handleObjectStatus(0, 'reset')
          this.$parent.$refs.threeMap.clearCoordinate('cameraPoint') // 清除地图显示
          this.$parent.$refs.threeMap.handleObjectStatus(1) // 切换到建筑选择模式
          this.$parent.$refs.threeMap.mountFunction('enterFloor', () => { // 挂载回调函数
            this.toolVisable = true
          })
          this.listVisable = false
          this.editVisable = false
          this.drawType = 1
          break
        case 'start-select': // 开始选点
          this.$parent.$refs.threeMap.clearCoordinate('cameraPoint') // 清除地图显示
          this.$parent.$refs.threeMap.startClickCoordinate(null, 1, 1, this.drawType)
          break
        case 'stop-select': // 结束选点
          let point = this.$parent.$refs.threeMap.stopClickCoordinate()
          this.$parent.$refs.threeMap.changeCameraMode('3D')
          if (this.drawType === 1) { // 室内
            this.resData.parmas = point.parmas
            point = point.selectPoint
            point[0].z = this.resData.parmas.minH
          }
          if (point.length) {
            this.resData.x = point[0].x
            this.resData.y = point[0].y
            this.resData.z = point[0].z
            this.resData.position = point[0].x + ',' + point[0].y + ',' + point[0].z
            this.toolVisable = false
            this.editVisable = true
          } else {
            this.$message.error('请选择一个坐标！')
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
      this.drawType = 0
      this.$parent.$refs.threeMap.changeCameraMode('3D')
      this.$parent.$refs.threeMap.clearCoordinate('cameraPoint') // 清除地图显示
      this.$parent.$refs.threeMap.handleObjectStatus(0, 'reset')
      this.$parent.$refs.threeMap.stopClickCoordinate()
      this.$parent.$refs.threeMap.clearCoordinate()
      this.cameraData = {}
    },
    handleEditClick () {

    },
    handleToolClick () {

    }
  }
}
</script>

<style lang='scss'>
.map-camera-container {
  // width: 100%;
  // height: 100%;
  overflow-y: hidden;
}
</style>
