<!--反应装置-->
<template>
  <div class="map-fence-container">
    <slide-bar position="left" name="反应装置列表" v-model="listVisable">
      <device-list @handleClick="handleClick" ref="fenceList"></device-list>
    </slide-bar>
    <slide-bar position="right" :name="resData.id ? '修改反应装置' : '新增反应装置'" @input="handleClick('init')" v-model="editVisable">
      <device-edit @handleClick="handleClick" :resData="resData" type></device-edit>
    </slide-bar>
    <slide-bar position="top" v-model="toolVisable">
      <device-tool @handleClick="handleClick"></device-tool>
    </slide-bar>
  </div>
</template>

<script>
import slideBar from '../../components/slideBar'
import deviceList from './deviceList'
import deviceEdit from './deviceEdit'
import deviceTool from './deviceTool'
import { reactorInfo } from '@/api/sou/equlpment'
export default {
  components: {
    slideBar,
    deviceList,
    deviceEdit,
    deviceTool
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
        case 'create-out': // 创建反应装置-室外
          if (val) this.resData = val
          this.$parent.$refs.threeMap.clearCoordinate('device')
          this.$parent.$refs.threeMap.changeCameraMode('2D') // 切换到2D模式
          this.listVisable = false
          this.editVisable = false
          this.toolVisable = true
          this.drawType = 0
          break
        case 'create-inside': // 创建反应装置-室内
          if (val) this.resData = val
          this.$parent.$refs.threeMap.clearCoordinate('device')
          this.$parent.$refs.threeMap.handleObjectStatus(1) // 切换到建筑选择模式
          this.$parent.$refs.threeMap.mountFunction('enterFloor', () => { // 挂载回调函数
            this.toolVisable = true
          })
          this.listVisable = false
          this.editVisable = false
          this.toolVisable = false
          this.drawType = 1
          break
        case 'view': // 查看围栏
          reactorInfo({
            'id': val.id || undefined
          }).then(({ data }) => {
            if (data && data.code === 0) {
              let val = data.data
              this.resData = val
              this.$parent.$refs.threeMap.displayObjects({
                typeName: 'checkPoint',
                iconBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAErUlEQVRIS72Xa0ybVRjH/6cXaAuUQrkNB87hIBLGMhBwwywkC8gM2xj4ATWZ2YzJNLoPM1Fn4lc1Ji66mEhMdGGJOBOdF7KxS8zGBsSBoOJkwmQqsNEBpS+UXnnLMc/blvbt23bDGM63nvd5zu881/OU4T4W51wHYBeAOgDlAAoApAZU5wGMARgAcAFAJ2PMfa9jWTwBzrkZwKsADgFII1mHIMI+I8LrWpZUE/QqpGRqkGTSBI+yAWgF8D5jzBrr/Jhgzvl+AMcAmAWLF2N9DkwOu+Ba8EU9S29UY32xHgWVSTDlJJAMQY8wxk5GU1CAOefawI0POgURP58VMHHddS/Pyb7nleix9UkTDH4vfEYeY4wthQvJwAHo1wB2Tw47ce2rOSy5+aqgQWGtjqHqqXSsLzbQVgeA5nB4JPhTAAfH+hfR/60N+G/M0EUZUNGYhoKKZMlyxtjzwY8r4EBM28jS7s+tK9C8zTowBlj+9MDrjH4TTQIDUyG6dxjw+LPmoOXPBWMugQPZO+IURHPncUvoAAY0vp4lXfJquw3WcVmYpP2iagO2PJEiXe6Pbid+PW9XhIbcvutwDsWcEq6Isj0IfhvA0Z722VUlUoKBofFoFlSqUMQ6P5zF/LSogFPCVT+TQfvvMMbeZIHmcEeweNPOHb8rU9AbVdgbsLj3lIDx3+R9IdmsRsORTJnOxVYrrBNKz5BQ/eFsKjWq81wC7wNweuB7G27+uCg7hOJmMKqlPY9zGaI3FOOUDDXqXjJDm6ha0bk75sGlE7GTctNjySjfI/WhJgJ/THX23bt3FM3BmKlGVbNJOnik14HxoZDFaQ9oUPdiBlzzPvR+KUCtZZi+5QWPUwnUZPa+kUvHtRK4zyGIFR3vTSnikrlBi50vUNcEhi7aMXzZIZOhi3mcHB6Hv33ez9r92jpqr/0EtlpuutMvn5hR6OUWJWLHfsk1GO5axNCFRTyyIwnrChMVsoNnFiBMKZMqUrDmQCZyNunmCCyODznVvaeU/ZxquLrF7+qxfid+OWfHo3uMeHCLXgG+ctKGmX+8WBY5fHH421vMyC81+OKCN5brUdnkf/1mJ7z4e9CNDVt1yMiXHgHZGulxwD7rgyaRSa7/azB6fw8Hx3R14TYDyhqMEmDiuhs9Xwioak7FQ2VKi7va5jA16kWCnqFkZzJuXHHAtaCMfbirYyZXcU0SSmtTJPDUqAddbTZsbzEhfzPNBfLV3W6TLK5/2QwWaCh938zj1k9yy8OTK2Y5ldYmo7hGavBS/H74ZA41B9KQ87AyuQY6FjB3ewm1h/xVQIsSbrTXufI7spxiNpCyhhQUbkuSFG1TSzj/kRX1r5hhyqEnW75uXHVg8nd3XHBkAyG/RW2ZlU1GbCyX3lPYrSLOHJtF81tZ0OpC3SqIJyjB41ksa5mkyDmP+khUP21CXok/ni67D2c/IHC2wlraWJgWce30fEyw4pEIgCkwimcxNVuDRIPfuuVlDtvtJZjzlKUU/C5YRKTnhsJAXqLMjvksBuA03CkGgajmrWYz3iAQPIdzvvajT8Bq8tPaD3thcBrI1268DQ/dmg/0EfC1/wsTcYH//U/bvwvzdV9s5PQkAAAAAElFTkSuQmCC',
                point: [{
                  x: parseFloat(val.positionX),
                  y: parseFloat(val.positionZ || 0),
                  z: parseFloat(val.positionY),
                  id: val.id,
                  name: 'beacon',
                  cnName: val.name,
                  data: {
                    '危险化学品': val.chemical || '暂无',
                    '高危工艺': val.technology || '暂无'
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
        case 'view-device': // 查看围栏
          reactorInfo({
            'id': val.id || undefined
          }).then(({ data }) => {
            if (data && data.code === 0) {
              let val = data.data
              this.resData = val
              this.$parent.$refs.threeMap.displayObjects({
                typeName: 'checkPoint',
                iconBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAErUlEQVRIS72Xa0ybVRjH/6cXaAuUQrkNB87hIBLGMhBwwywkC8gM2xj4ATWZ2YzJNLoPM1Fn4lc1Ji66mEhMdGGJOBOdF7KxS8zGBsSBoOJkwmQqsNEBpS+UXnnLMc/blvbt23bDGM63nvd5zu881/OU4T4W51wHYBeAOgDlAAoApAZU5wGMARgAcAFAJ2PMfa9jWTwBzrkZwKsADgFII1mHIMI+I8LrWpZUE/QqpGRqkGTSBI+yAWgF8D5jzBrr/Jhgzvl+AMcAmAWLF2N9DkwOu+Ba8EU9S29UY32xHgWVSTDlJJAMQY8wxk5GU1CAOefawI0POgURP58VMHHddS/Pyb7nleix9UkTDH4vfEYeY4wthQvJwAHo1wB2Tw47ce2rOSy5+aqgQWGtjqHqqXSsLzbQVgeA5nB4JPhTAAfH+hfR/60N+G/M0EUZUNGYhoKKZMlyxtjzwY8r4EBM28jS7s+tK9C8zTowBlj+9MDrjH4TTQIDUyG6dxjw+LPmoOXPBWMugQPZO+IURHPncUvoAAY0vp4lXfJquw3WcVmYpP2iagO2PJEiXe6Pbid+PW9XhIbcvutwDsWcEq6Isj0IfhvA0Z722VUlUoKBofFoFlSqUMQ6P5zF/LSogFPCVT+TQfvvMMbeZIHmcEeweNPOHb8rU9AbVdgbsLj3lIDx3+R9IdmsRsORTJnOxVYrrBNKz5BQ/eFsKjWq81wC7wNweuB7G27+uCg7hOJmMKqlPY9zGaI3FOOUDDXqXjJDm6ha0bk75sGlE7GTctNjySjfI/WhJgJ/THX23bt3FM3BmKlGVbNJOnik14HxoZDFaQ9oUPdiBlzzPvR+KUCtZZi+5QWPUwnUZPa+kUvHtRK4zyGIFR3vTSnikrlBi50vUNcEhi7aMXzZIZOhi3mcHB6Hv33ez9r92jpqr/0EtlpuutMvn5hR6OUWJWLHfsk1GO5axNCFRTyyIwnrChMVsoNnFiBMKZMqUrDmQCZyNunmCCyODznVvaeU/ZxquLrF7+qxfid+OWfHo3uMeHCLXgG+ctKGmX+8WBY5fHH421vMyC81+OKCN5brUdnkf/1mJ7z4e9CNDVt1yMiXHgHZGulxwD7rgyaRSa7/azB6fw8Hx3R14TYDyhqMEmDiuhs9Xwioak7FQ2VKi7va5jA16kWCnqFkZzJuXHHAtaCMfbirYyZXcU0SSmtTJPDUqAddbTZsbzEhfzPNBfLV3W6TLK5/2QwWaCh938zj1k9yy8OTK2Y5ldYmo7hGavBS/H74ZA41B9KQ87AyuQY6FjB3ewm1h/xVQIsSbrTXufI7spxiNpCyhhQUbkuSFG1TSzj/kRX1r5hhyqEnW75uXHVg8nd3XHBkAyG/RW2ZlU1GbCyX3lPYrSLOHJtF81tZ0OpC3SqIJyjB41ksa5mkyDmP+khUP21CXok/ni67D2c/IHC2wlraWJgWce30fEyw4pEIgCkwimcxNVuDRIPfuuVlDtvtJZjzlKUU/C5YRKTnhsJAXqLMjvksBuA03CkGgajmrWYz3iAQPIdzvvajT8Bq8tPaD3thcBrI1268DQ/dmg/0EfC1/wsTcYH//U/bvwvzdV9s5PQkAAAAAElFTkSuQmCC',
                point: [{
                  x: parseFloat(val.positionX),
                  y: parseFloat(val.positionZ || 0),
                  z: parseFloat(val.positionY),
                  id: val.id,
                  name: 'beacon',
                  cnName: val.name,
                  data: {
                    '危险化学品': val.chemical || '暂无',
                    '高危工艺': val.technology || '暂无'
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
        case 'edit': // 新增/修改围栏
          this.listVisable = false
          this.editVisable = true
          this.toolVisable = false
          this.resData = val === undefined ? {
            id: '',
            point: []
          } : val
          break
        case 'start-select': // 开始选点
          this.$parent.$refs.threeMap.clearCoordinate()
          this.$parent.$refs.threeMap.startClickCoordinate(null, 1, 1, this.drawType)
          break
        case 'stop-select': // 结束选点
          let point = this.$parent.$refs.threeMap.stopClickCoordinate()
          console.log('stop-select', point, point.length)
          if (this.drawType === 1) { // 室内
            this.resData.parmas = point.parmas
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
