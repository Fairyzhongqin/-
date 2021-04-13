<template>
  <div class='map-check-point-container'>
    <slide-bar position="left" name="卡口列表" v-model="listVisable">
      <check-point-list @handleClick="handleClick"></check-point-list>
    </slide-bar>
    <slide-bar position="right" @input="handleClick('init')" :name="resData.id ? '修改卡口' : '新增卡口'" v-model="editVisable">
      <check-point-edit @handleClick="handleClick" :resData="resData"></check-point-edit>
    </slide-bar>
    <slide-bar position="top" v-model="toolVisable">
      <check-point-tool @handleClick="handleClick"></check-point-tool>
    </slide-bar>
  </div>
</template>

<script>
import slideBar from '../../components/slideBar'
import checkPointList from './checkPointList'
import checkPointEdit from './checkPointEdit'
import checkPointTool from './checkPointTool'
import { checkpointInfo } from '@/api/pos/checkpoint'
export default {
  components: {
    slideBar,
    checkPointList,
    checkPointEdit,
    checkPointTool
  },
  data () {
    return {
      resData: {},
      listVisable: false, // 卡口列表状态
      editVisable: false, // 卡口编辑页状态
      toolVisable: false // 卡口选点工具栏状态
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
        case 'create': // 创建卡口
          if (val) this.resData = val
          this.$parent.$refs.threeMap.clearCoordinate()
          this.$parent.$refs.threeMap.changeCameraMode('2D') // 切换到2D模式
          this.listVisable = false
          this.editVisable = false
          this.toolVisable = true
          break
        case 'view-checkPoint': // 查看卡口
          checkpointInfo({
            'id': val.id || undefined
          }).then(({ data }) => {
            if (data && data.code === 0) {
              let val = data.data
              let personName = this.selectStaffEmit(data.data.personList)
              val.personName = personName
              this.$parent.$refs.threeMap.displayObjects({
                typeName: 'checkPoint',
                iconBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAeCAYAAAA2Lt7lAAAEPElEQVRIS62We2xUVRCHv9mlpdVtCU8tBWmgEKDRNBKaEnm0kCIoqE2IxgJR/pCSICYYQWoaqIDyEKNBSSj+AUaKiUIaDSjQUgENGOKDCMSmPKxgqUELFivSdnfHzN3ta727W6KT7GY3Z858c+b87swVYpiqjgSeBqYDWcBgQIEm4CxQA3woIpeihRG3BVXNADYB8xQ89c1w/rrS9HfIe0ASjBkgZPQDEYLAPmCliNRHxvsXQFWLgPLWAL5P6pTKOrja4p7fUB88McY+Ql8v5rVERCq6e/cAqOqLwJYff1dZdwIa/oxVwK41A5U+BFmDxMq3QkTe7FjtBKiq1briRIPK6uPQbge/A0vwQNkUmDzMgSwQkT223QGo6n12abVNmrKsCtoCdxC5m6tBthbA+EFi5coSkcsdgIq2AEWLDii/9LIs0VKwcr0/R0j0OuoqElUdAVzcW6ved76NnvnEtCCFo5UEb0+fxhbY/r2HW/6u61z6IDw5TqwOmQZYpbBhwaexs68s9DMg2T2Bbd95+KjW07mY7oOKx8QkXGKAw/XNFDyz3+4mulU95bdjc/kmDEsBTzf97TzjYdeZLoBFsTJl9KPaAI2HLum9r5+MfbEG8Aos3O8la7BSkhvshLgBXpkED4+UXw3grzin3h2n4wPsBD81w/IjXibco5RMCtLHA26A4mwoyhK/Adr3nNM+5d0AI1KVzfk9tfpClddq6thtP/zRKszNDPJSTtAVsDgb5mdJwADXPruogzd93XUCy2pQcs872ZIfwHT+VzusO+F1fr82LcCQu9xP8HIuPDJKfjPAsbrrOvW5z+OXyO5gWbWX1gC8PSNASmJoj1uJ3pvtNMRjBigLKmvmVXZ1SzdUh4qq6oWcNKVf3y6vSMDAZNhbKCaCtQYYb21i5w8qu87El6mbRyTg2fth0QPOhYW+VfVQSxsz7WG70eoO+fhxP0Pudl/b+o2HfXWh56B/EuyeK/gSqRaRgg5ANnDqZIMmlBwNjaxIGzdQmTMqiLfn88S1W8Lus0JbUJzOuSEPJqWLH5goIqe7t+tVtr63VonVk2JJYdkEmDfWCVkiIhvtR+TAKQcW1/ysmGxN772xpD5Qkgt5I5xwO0SkuGNfJMD+lwGlF26oZ+UXdM7haCBTzOZ8yOwvNqLW234RZ+g4Fm3oF9p0a2zR5OVHwFqym6X54K0ZkOYTex2YLyKVkX6ugLCyJgMHrrZo6pKD0ByhLnsOts+CoT65CTwqIl+5JREVEIZMA6q+vKIJpcd7bl8/FaYMl3agQESORSthTEAYshp4dUWNcqoxFCYnDd6Y7mxdIyJrYwmhN4Ak4EJtk6YXHwyFKp8FYwdKgzMSRW7/J0D4FEuBd1cdDYljY56T1/Misi2ejOOeIAywvnn+yk3n9YbhqXIZGC0ibf8LIAyZCXwQDrhQRA7HC27r/wByoK+ZERwUDgAAAABJRU5ErkJggg==',
                iconSize: 24,
                iconOffset: 50,
                point: [{
                  x: parseFloat(val.positionX),
                  y: parseFloat(val.positionZ || 0),
                  z: parseFloat(val.positionY),
                  id: val.id,
                  name: 'beacon',
                  cnName: val.name,
                  data: {
                    '值班室人员': val.personName || '暂无',
                    '值班室电话': val.contact || '暂无'
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
        case 'edit': // 新增/修改改卡口
          this.$parent.$refs.threeMap.clearCoordinate()
          this.resData = {}
          console.log(val)
          if (val) { // 修改状态
            this.resData = val
            this.handleClick('view-checkPoint', val)
          }
          this.listVisable = false
          this.editVisable = true
          this.toolVisable = false
          break
        case 'start-select': // 开始选点
          this.$parent.$refs.threeMap.clearCoordinate()
          this.$parent.$refs.threeMap.startClickCoordinate(null, 1, 1)
          break
        case 'stop-select': // 结束选点
          let point = this.$parent.$refs.threeMap.stopClickCoordinate()
          console.log('stop-select', point, point.length)
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
          this.resData = {} // 清空row数据
          this.$parent.$refs.threeMap.handleObjectStatus(0, 'reset')
          this.listVisable = true
          this.editVisable = false
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
      this.$parent.$refs.threeMap.clearCoordinate() // 清空卡口点位
      this.$parent.$refs.threeMap.clearCoordinate() // 清空所有点位
      this.resData = {}
    },
    handleEditClick () {
    },
    handleToolClick () {
    },
    // 人员组件返回值
    selectStaffEmit (val) {
      let personName = ''
      val.map((values, index) => {
        if (Number(index) !== Number(val.length - 1)) {
          personName += values.name + ', '
        } else {
          personName += values.name
        }
      })
      return personName
    }
  }
}
</script>

<style lang='scss' scoped>
.map-check-point-container {
  // width: 100%;
  // height: 100%;
  overflow-y: hidden;
}
</style>
