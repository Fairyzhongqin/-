<!--储罐管理-->
<template>
  <div class="map-tank-container">
    <slide-bar position="left" name="储罐列表" v-model="listVisable">
      <tank-list @handleClick="handleClick" ref="fenceList"></tank-list>
    </slide-bar>
    <slide-bar position="right" :name="resData.id ? '修改储罐' : '新增储罐'" @input="handleClick('init')" v-model="editVisable">
      <tank-edit @handleClick="handleClick" :resData="resData" type></tank-edit>
    </slide-bar>
    <slide-bar position="top" v-model="toolVisable">
      <tank-tool @handleClick="handleClick"></tank-tool>
    </slide-bar>
  </div>
</template>

<script>
import slideBar from '../../components/slideBar'
import tankList from './tankList'
import tankEdit from './tankEdit'
import tankTool from './tankTool'
import { tankInfo } from '@/api/sou/equlpment'
export default {
  components: {
    slideBar,
    tankList,
    tankEdit,
    tankTool
  },
  data () {
    return {
      resData: {
        id: '',
        point: []
      },
      listVisable: false, // 列表状态
      editVisable: false, // 新增/编辑页状态
      toolVisable: false, // 工具栏状态
      drawType: 0
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
        case 'create-out': // 创建储罐-室外
          if (val) this.resData = val
          this.$parent.$refs.threeMap.handleObjectStatus(0, 'reset')
          this.$parent.$refs.threeMap.clearCoordinate('tank')
          this.$parent.$refs.threeMap.changeCameraMode('2D') // 切换到2D模式
          this.listVisable = false
          this.editVisable = false
          this.toolVisable = true
          this.drawType = 0
          break
        case 'create-inside': // 创建储罐-室内
          if (val) this.resData = val
          this.$parent.$refs.threeMap.handleObjectStatus(0, 'reset')
          this.$parent.$refs.threeMap.clearCoordinate('tank')
          this.$parent.$refs.threeMap.handleObjectStatus(1) // 切换到建筑选择模式
          this.$parent.$refs.threeMap.mountFunction('enterFloor', () => { // 挂载回调函数
            this.toolVisable = true
          })
          this.listVisable = false
          this.editVisable = false
          this.toolVisable = false
          this.drawType = 1
          break
        case 'view':  // 查看
          tankInfo({
            'id': val.id || undefined
          }).then(({ data }) => {
            if (data && data.code === 0) {
              let val = data.data
              this.resData = val
              this.$parent.$refs.threeMap.displayObjects({
                typeName: 'checkPoint',
                iconBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADHElEQVRIS8WXW0yOYRzAf49QCakvh2IzQiZNE2Ns5MacJ43MIZOxbnIhNxpXjBtccKExTA4Tc5jz3IiNRWVZakLM1sGpEyKRx/7f+7729X6n+tjnufq+9/3/n9/zPz7/V9GNpbUOA+YDc4EUIB6INFVbgRqgDLgN3FRKtfvbVvkS0Fo7gFwgG4hyyjbXwoeX8LXFUO03CAaPgagR1lbNQD6wTynV6G1/r2CtdSawH3DQUAXFJ6HyBrQ2eN4rMhYSF8D0tRA7QWQEukUpVeBJwQ2ste5jnjiLljq4sgMqrvnzXNf3SYtgyU4YNFyeHxOPKaV+uAp1AZvQC8Bint6Ewhxo/9QzqCUdNhAyDsJESQ2uAumucDv4KJDFw1NwYSvoX4FBLS3VC9L3wrQ1TsuVUhv+vLJ+mDE94bS0YP3fQ13hmccty9dZMXdabGZvNS11DvbNDty93vwjbs+9KzGXhEuQbLfAu4FtFGR5T6SIaEicB45REB4JfSMMTEcbfGuFxtdQeQvamjzjJeEyJc/Yo5TKU2ZzqKehKor9qe5KvUNhVT4kLexevCuuw5ls+PndXX5LkZSa1HmcgNOAi1zaBg8kt2xLLBSFvuHdA3d8w2mAeMC+ZmyAtD3ydJmADzk7065kaK13F45wgFidshziZ8LQBBgwBHqFGLK/OuHze3hXDTX3oey8YW2bh6YVGQfby0UrX8CPaK6dyu7Jni2ashLm5MCTK/CmxGiXXz52le0fY7TNkVNh0hK4cxBKz3reL++xtNcSATfyvCiaIyu8gzMOuL+zalxq1b4KN3sHbzwH41KbBPyT8sshnN7UM7CviPsCrz4MyUs7/ys4MFcHarGLq/0nl6cYBwp2SS7f5SRZ/a/AtnLy3UCmZBjXW0+WXKelhX4biMxT3ltmRIzRY0dP7x76VTHOnt9mq3XRdm2Z8l9r7f+SiE2EsbNg2HiQMSe0v3GQ71+McejtM3hxDxoqPR/QfkmYYBnqgn8tmnAZ7oI7CFi+0VoHf/QxrZYJM/jDngtcBvLgjbeu6Rj0gd4GD/4njO0A//yj7Te1S5VQbd9hyAAAAABJRU5ErkJggg==',
                point: [{
                  x: parseFloat(val.positionX),
                  y: parseFloat(val.positionZ || 0),
                  z: parseFloat(val.positionY),
                  id: val.id,
                  name: 'beacon',
                  cnName: val.name,
                  data: {
                    '存储物品': val.storageName || '暂无',
                    '风险属性': val.dangerAttr || '暂无'
                  }
                }]
              })
              this.$parent.$refs.threeMap.setCameraByLocAndLen(parseFloat(val.positionX), parseFloat(val.positionZ || 0), parseFloat(val.positionY), 60)
            } else {
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
          })
          break
        case 'view-tank': // 查看储罐
          tankInfo({
            'id': val.id || undefined
          }).then(({ data }) => {
            if (data && data.code === 0) {
              let val = data.data
              this.resData = val
              this.$parent.$refs.threeMap.displayObjects({
                typeName: 'checkPoint',
                iconBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADHElEQVRIS8WXW0yOYRzAf49QCakvh2IzQiZNE2Ns5MacJ43MIZOxbnIhNxpXjBtccKExTA4Tc5jz3IiNRWVZakLM1sGpEyKRx/7f+7729X6n+tjnufq+9/3/n9/zPz7/V9GNpbUOA+YDc4EUIB6INFVbgRqgDLgN3FRKtfvbVvkS0Fo7gFwgG4hyyjbXwoeX8LXFUO03CAaPgagR1lbNQD6wTynV6G1/r2CtdSawH3DQUAXFJ6HyBrQ2eN4rMhYSF8D0tRA7QWQEukUpVeBJwQ2ste5jnjiLljq4sgMqrvnzXNf3SYtgyU4YNFyeHxOPKaV+uAp1AZvQC8Bint6Ewhxo/9QzqCUdNhAyDsJESQ2uAumucDv4KJDFw1NwYSvoX4FBLS3VC9L3wrQ1TsuVUhv+vLJ+mDE94bS0YP3fQ13hmccty9dZMXdabGZvNS11DvbNDty93vwjbs+9KzGXhEuQbLfAu4FtFGR5T6SIaEicB45REB4JfSMMTEcbfGuFxtdQeQvamjzjJeEyJc/Yo5TKU2ZzqKehKor9qe5KvUNhVT4kLexevCuuw5ls+PndXX5LkZSa1HmcgNOAi1zaBg8kt2xLLBSFvuHdA3d8w2mAeMC+ZmyAtD3ydJmADzk7065kaK13F45wgFidshziZ8LQBBgwBHqFGLK/OuHze3hXDTX3oey8YW2bh6YVGQfby0UrX8CPaK6dyu7Jni2ashLm5MCTK/CmxGiXXz52le0fY7TNkVNh0hK4cxBKz3reL++xtNcSATfyvCiaIyu8gzMOuL+zalxq1b4KN3sHbzwH41KbBPyT8sshnN7UM7CviPsCrz4MyUs7/ys4MFcHarGLq/0nl6cYBwp2SS7f5SRZ/a/AtnLy3UCmZBjXW0+WXKelhX4biMxT3ltmRIzRY0dP7x76VTHOnt9mq3XRdm2Z8l9r7f+SiE2EsbNg2HiQMSe0v3GQ71+McejtM3hxDxoqPR/QfkmYYBnqgn8tmnAZ7oI7CFi+0VoHf/QxrZYJM/jDngtcBvLgjbeu6Rj0gd4GD/4njO0A//yj7Te1S5VQbd9hyAAAAABJRU5ErkJggg==',
                point: [{
                  x: parseFloat(val.positionX),
                  y: parseFloat(val.positionZ || 0),
                  z: parseFloat(val.positionY),
                  id: val.id,
                  name: 'beacon',
                  cnName: val.name,
                  data: {
                    '存储物品': val.storageName || '暂无',
                    '风险属性': val.dangerAttr || '暂无'
                  }
                }]
              })
              this.$parent.$refs.threeMap.setCameraByLocAndLen(parseFloat(val.positionX), parseFloat(val.positionZ || 0), parseFloat(val.positionY), 60)
            } else {
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
          })
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
        case 'edit': // 新增/修改储罐
          this.listVisable = false
          this.editVisable = true
          this.toolVisable = false
          this.resData = val === undefined ? {
            id: '',
            point: []
          } : val
          break
        case 'start-select': // 开始选点
          this.$parent.$refs.threeMap.clearCoordinate('tank')
          this.$parent.$refs.threeMap.startClickCoordinate(null, 1, 1, this.drawType)
          break
        case 'stop-select': // 结束选点
          let point = this.$parent.$refs.threeMap.stopClickCoordinate()
          console.log('stop-select', point, point.length)
          if (this.drawType === 1) { // 室内
            this.resData.parmas = point.parmas
            this.resData.floor = point.floor
            this.resData.buildId = point.buildId
            point = point.selectPoint
            point[0].z = this.resData.parmas.minH
          }
          if (point.length) {
            this.resData.positionX = point[0].x
            this.resData.positionY = point[0].y
            this.resData.positionZ = point[0].z
            this.resData.position = point[0].x + ',' + point[0].y + ',' + point[0].z
            this.toolVisable = false
            this.editVisable = true
            this.$parent.$refs.threeMap.changeCameraMode('3D') // 切换到3D模式
          } else {
            this.$message.error('请选择一个坐标！')
          }
          break
        case 'clear-select': // 清除选点
          this.$parent.$refs.threeMap.clearCoordinate()
          this.resData = {} // 清空储罐数据
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
.map-tank-container {
  // width: 100%;
  // height: 100%;
  overflow-y: hidden;
}
</style>
