<template>
  <!-- 图层列表 -->
  <div class="layer-top">
    <el-checkbox-group v-model="checkList">
      <el-row>
        <el-col class="layer-top-padding" :span="8">
          <el-checkbox label="person" @change="layerChange">
            人员
            <img class="layer-top-person" src="~@/assets/img/cesiumMap/person_yello.png" alt="#" />
          </el-checkbox>
        </el-col>
        <el-col class="layer-top-padding" :span="8">
          <el-checkbox label="car" @change="layerChange">
            车辆
            <img class="layer-top-img" src="~@/assets/img/cesiumMap/car.png" alt="#" />
          </el-checkbox>
        </el-col>
        <el-col class="layer-top-padding" :span="8">
          <el-checkbox label="camera" @change="layerChange">
            摄像头
            <img class="layer-top-camera" src="~@/assets/img/cesiumMap/camera.png" alt="#" />
          </el-checkbox>
        </el-col>
        <el-col class="layer-top-padding" :span="8">
          <el-checkbox label="checkpoint" @change="layerChange">
            卡口
            <img class="layer-top-checkpoint" src="~@/assets/img/cesiumMap/checkpoint.png" alt="#" />
          </el-checkbox>
        </el-col>
        <el-col class="layer-top-padding" :span="8">
          <el-checkbox label="beacon" @change="layerChange">
            信标
            <img class="layer-top-beacon" src="~@/assets/img/cesiumMap/beacon.png" alt="#" />
          </el-checkbox>
        </el-col>
        <el-col class="layer-top-padding" :span="8">
          <el-checkbox label="base_station" @change="layerChange">
            <span style="min-width:3em;display: inline-block;">基站</span>
            <img class="layer-top-base_station" style="margin-bottom: 4px;" src="~@/assets/img/cesiumMap/base_station.png" alt="#" />
          </el-checkbox>
        </el-col>
      </el-row>
    </el-checkbox-group>
  </div>
</template>

<script>
import { getDeveuiPosition } from '@/api/cesiumMap/index'
import { translateXyToLnglat } from '@/utils/cesiumMap'
export default {
  inject: ['cesiumMap'], // 多级祖孙传值-接受方
  data () {
    return {
      checkList: ['person', 'car'], // 选中图层
      dataList: [],
      dataListDelet: [], // 需删除数据
      icons: {
        person: '',
        car: '',
        camera: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAEJElEQVRIS8WXfUyVdRTHv+e5ukmNF4G8d+AaeFkUV8p1gaGbFkIuAnOEqLxMW81BNbYWGqlJjV6Ioa1WTZxZy+2iBXill0FkIDhb4+Uf4bJeZGPUkosDCSYX8D7Pab/HcblX7r08sCW//57nd875nHN+5zm/8xA0LI6KWoU1AemyQttAZCbAyECwUCXgXwb6wdytk7gZw45GGhiYWsgs+RMYT3o4LECWSiSJihhYrcoaDMCDUaCgIPWRx8eBwQFgaEh9JuCmonC1Q6ccD+r4bcSXfZ9gZ4JpL4g/BCgMxhhQVjboiRTQGr1XWzxsB7e1gq31QP814dIImF5b0WU7401hHpjN5pUyOapB9AL0ekivHgClpALkNzlztpnBrT9D+egYYLcDzF/oOKCIurtvuzvgYU2FSlP1ALbTlidBZeWgwMCFjst7BiYmwOVl4PZLYv87nbIq2x3uAXYmxJ0WkdKOLEhvvAlI0pKgLiVFgfLBu+AGqxr5iq6+F2f3XOA7Z4qvRKRS5fEFoTZbn2rDZIrz75yAl5bciZyxb/bMVbCo3vtY+h16Q5hkqdWU3pMnT6nAwsL9C2aFJyag5OcA9qGRSVJiRbWr4NvmuPdJokNSRRVoa9qChoTAYsDqZ9dyEcqhg2CFK1Z29x0m0RyUB+7/h40xq3WWbzRX72LBYIacvwvUf+2mdONWBHHSI1kyS+fpQCmknD2aol1KxEJHqT0HPlYJHSnPkTMh7gSIiqRvm0D6+c2h19aHgoLnYTSuQ17ubmRkpKO27jyOHn0bT6WloqqqAiEhIZocZrsdyrNPiwqvJmeiqQMGQ6KuodGrcmHhK/j89JeuveDgYOzMzkJqagquXx+CMWYdtmdmaAILIXlHumivnSQnmkY4KTlU98mJecrT09OIiIzG2NiYV8Nr10Yid88u5OXn4tH49ZrgcvFLoI5fR0XETkrbppPeq5ynaLU2YGdOriaD8fHr8frBEuTl7fYrrxwpBV9slv2CBVTAta7Q0FDcGP5bG9hXqh0OB8LCIyDSrXVlZj6Dhgt1fsXdU+21uGRZhjlhI3p6erVycbbmDG5NTqKzswtXr/YgPDwcF6y1Hvqu4vL3OQl4W/tl1NR8jfp6K8bFpe9jBQYGou3ST3jcnOySKCraj88+/dj17PE5aW0gU1NT+P6HRlgsZ9HU1IyZmRkPF/btLUBs7EM4fKTM9f5yews2bZpzxKOBLKVljo6Ooq7OCkvNOVy58guYGa0tP6rg5I1bMDj4F6Kjo/DnHzbQ7ABxd8sU7i3lkpgNS0CEIxs2PKa+6um1YfPmrSgufhnvlL81l+a7Lwmxs5Rr0V/Fibs6MjLC1Up9XovCyGIHAc2l7m8QmDWyLKOPgC/bsOeC3+vx1v3c7vlA7w5fll8Ydwf+j5+2/wC8WFebRNELnQAAAABJRU5ErkJggg==',
        checkpoint: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAeCAYAAAA2Lt7lAAAEPElEQVRIS62We2xUVRCHv9mlpdVtCU8tBWmgEKDRNBKaEnm0kCIoqE2IxgJR/pCSICYYQWoaqIDyEKNBSSj+AUaKiUIaDSjQUgENGOKDCMSmPKxgqUELFivSdnfHzN3ta727W6KT7GY3Z858c+b87swVYpiqjgSeBqYDWcBgQIEm4CxQA3woIpeihRG3BVXNADYB8xQ89c1w/rrS9HfIe0ASjBkgZPQDEYLAPmCliNRHxvsXQFWLgPLWAL5P6pTKOrja4p7fUB88McY+Ql8v5rVERCq6e/cAqOqLwJYff1dZdwIa/oxVwK41A5U+BFmDxMq3QkTe7FjtBKiq1briRIPK6uPQbge/A0vwQNkUmDzMgSwQkT223QGo6n12abVNmrKsCtoCdxC5m6tBthbA+EFi5coSkcsdgIq2AEWLDii/9LIs0VKwcr0/R0j0OuoqElUdAVzcW6ved76NnvnEtCCFo5UEb0+fxhbY/r2HW/6u61z6IDw5TqwOmQZYpbBhwaexs68s9DMg2T2Bbd95+KjW07mY7oOKx8QkXGKAw/XNFDyz3+4mulU95bdjc/kmDEsBTzf97TzjYdeZLoBFsTJl9KPaAI2HLum9r5+MfbEG8Aos3O8la7BSkhvshLgBXpkED4+UXw3grzin3h2n4wPsBD81w/IjXibco5RMCtLHA26A4mwoyhK/Adr3nNM+5d0AI1KVzfk9tfpClddq6thtP/zRKszNDPJSTtAVsDgb5mdJwADXPruogzd93XUCy2pQcs872ZIfwHT+VzusO+F1fr82LcCQu9xP8HIuPDJKfjPAsbrrOvW5z+OXyO5gWbWX1gC8PSNASmJoj1uJ3pvtNMRjBigLKmvmVXZ1SzdUh4qq6oWcNKVf3y6vSMDAZNhbKCaCtQYYb21i5w8qu87El6mbRyTg2fth0QPOhYW+VfVQSxsz7WG70eoO+fhxP0Pudl/b+o2HfXWh56B/EuyeK/gSqRaRgg5ANnDqZIMmlBwNjaxIGzdQmTMqiLfn88S1W8Lus0JbUJzOuSEPJqWLH5goIqe7t+tVtr63VonVk2JJYdkEmDfWCVkiIhvtR+TAKQcW1/ysmGxN772xpD5Qkgt5I5xwO0SkuGNfJMD+lwGlF26oZ+UXdM7haCBTzOZ8yOwvNqLW234RZ+g4Fm3oF9p0a2zR5OVHwFqym6X54K0ZkOYTex2YLyKVkX6ugLCyJgMHrrZo6pKD0ByhLnsOts+CoT65CTwqIl+5JREVEIZMA6q+vKIJpcd7bl8/FaYMl3agQESORSthTEAYshp4dUWNcqoxFCYnDd6Y7mxdIyJrYwmhN4Ak4EJtk6YXHwyFKp8FYwdKgzMSRW7/J0D4FEuBd1cdDYljY56T1/Misi2ejOOeIAywvnn+yk3n9YbhqXIZGC0ibf8LIAyZCXwQDrhQRA7HC27r/wByoK+ZERwUDgAAAABJRU5ErkJggg==',
        beacon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOBAMAAADtZjDiAAAAJ1BMVEX/PCxHcEz/NSz/Oyv/PCz/Oyz/PCz/gnj/////7ez/sqz/2dX/XVBNZ9n2AAAABnRSTlP4AB1fjNfddeoaAAAAUUlEQVQI12MQFHJlCFEUZBA0SEtLYxZkEE4DAUMGhfQyIM3E4FbRBaRTGMJWdAPpVAa2k9OBdAIDG1hdAkMYmE5lcAPTKQwKYJoJbg7MXKg9ALfcHnsvWLtJAAAAAElFTkSuQmCC',
        baseStation: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAeCAYAAADU8sWcAAAFEUlEQVRIS62Xe0zVZRjHPw8X8Qgqog5JhLxSZHirPFqmEJlCqWEpDs0rrbUVS/8pW5iytrZmm222Cs0rE61MTNQUJefM4zBBapQoKl5xKuIVEfBtDweEwznHcyifv875vc/7fJ/b+32fV/gPYoyZDqQD/YHjwBIRWd9WU9LWDcaYZGADFwuhfB9EjoawIWpmmohkt8Vem8CNMf5AKRVHH2fdWLhfBz5+MGMX9Bh0GhggIrXeOtBW8LnACn6cBmW7mjH6joU3Nuj/eSKy8pGDG2P8gL+5VNyP1bHO9mflQ2jMCeBJEanzxgGvIzfGzAJWsXkGHN/ubLt/AiSt0++zRWT1IwM3xvQCCqgoCmVNPGBc2BaYmQc9Bl8CnhWRs54c8Bi5MWY88A01NyNYPw6u/OPeZrcnYPpOCOh4BnhHRHY8zIEH4MaYrkCMdmzj+dUzrGeoF1WnIGceVBR5CkYjh4krILi36mr0hY1coHxQChSLyFVdlMbjswxIBbSpoK6GBkCN8mQelGyG+hrPwE0avgEQnQR94kGzoY74BTStajNmAmkKvgT4hMJVUJoLlSfg5nkw970H86QpPtCxJ4T0gwGJMGS27shQ8ApKc0P5+S1PJqD7UxD1GvR8DoIjwb8D1N2FqnK4cBhKt3lXmtfXqhOXFLwO2zJf9mkC3IjWMXYxRLzg2cHzBZC/CM4fcq87Oh2safUKfpDrZ62siYPqSucN1g9g1Efg42tf07Kc3GPvh5ob0C4IukZBnzh7fVW0ZLavYP9nzuWzhMDMvdC5l03BRwJ5XC6xkJ0Edy43O9BvHEzOsv+/XAJ70+F0vvuIwkdAXEbTRQM73ofixv26q0N3SN4M3aOrgfiGo2aMeRnI4coxC9kT4XYLB0YthKAw2LUA6u9Bu0Donwhhw8DSBWquw8Uie731t140sUvA3wI75zcTUqAC50C3KAWeKCK7W57zOGArlWWBZCU6ZqAp1iFz4MWPoX2wc/T3bsGBL6BguUbjuK4Rp+RCSN/bwAQR2asKDgxnjBkNbOecrQNZrzrSqEabtNZutLYazuyHGxcgKBQiR9lrr9I61QqRsg3CrXeABBHZ1+SZE70aY+YAK9kyG45tdYxgzGLoGAZ5Hzo2Z0AnGPMpiDimWndHTYBJq/TXXBH5vqVBV+A+QDnHfglni15kbqR3nDYOVB6Hst2NXa3mWqV80mrlhnNApIg4MJfLi8UYs5HKE1PIHO4aeWAyJC5vXtuzEA5/61o39ZAy2yYRmdpawR34eq6dSuG7Z9xHHpsBfV6CikLY/p57On77MHTpnSUiOnQ6iDvwg5Tvt5I9yT24tyvJW7QhbSIywiO4MUYdquKPzE4NjfV/Jf5zGJZ6AwgWEYeGcNVwEQ0N9+sCKPJqGnq4e4NnwStLVUcbToeMB+IKPAHIJSsBzrm5HPwD4bGhYOkK1VfhwhGoVf5wIeHDIaVh5ksUEYfhzxW4fTz+OsZ+r7eUoB4wcgE8PQ38LM0rddXw5wb4fSncqnDco/f4u8X6zWmsdgU+BshnRxoUN76AlE6taTA0VTlbHwU6pm4C1LuewBRgBrXV/hzJBNsyuFtldyJmOozXQYlYEfnNU9qVZA5Qf8/KXxvt41P0m9C+sxKEPofSRaSsdYKNMX31zQYkc/e6DyU/gI5TA6eCbzsb8Ly3JNMF+BKYDOgTSafQxSJy1FPzG2MGAYsAnXo1Sz8B80XkWuu9/wIgksaIcgGRvQAAAABJRU5ErkJggg=='
      },
      layer: {
        person: [],
        beacon: [],
        car: [],
        checkpoint: [],
        camera: [],
        base_station: []
      } // 图标管理图表展示---点击首页清空图标时作用
    }
  },
  mounted () {
  },
  methods: {
    // 图层列表选中时间
    layerChange (checked, tag) {
      if (checked) { // 开启
        switch (tag.currentTarget.value) {
          case 'person': // 人员
            console.log('人员')
            this.cesiumMap.$refs.mapShow.setObjectVisible('person', null, true)
            break
          case 'car': // 车辆
            console.log('车辆')
            this.cesiumMap.$refs.mapShow.setObjectVisible('car', null, true)
            break
          case 'camera': // 摄像头
            console.log('摄像头')
            this.getDeveuiPositionList(
              2,
              this.checkList[this.checkList.length - 1]
            )
            break
          case 'checkpoint': // 卡口
            console.log('卡口')
            this.getDeveuiPositionList(
              0,
              this.checkList[this.checkList.length - 1]
            )
            break
          case 'beacon': // 信标
            console.log('信标')
            this.getDeveuiPositionList(
              1,
              this.checkList[this.checkList.length - 1]
            )
            break
          case 'base_station': // 基站
            console.log('基站')
            this.getDeveuiPositionList(
              3,
              this.checkList[this.checkList.length - 1]
            )
            break
        }
      } else { // 关闭
        switch (tag.currentTarget.value) {
          case 'person': // 人员
            console.log('删除  人员')
            this.cesiumMap.$refs.mapShow.setObjectVisible('person', null, false)
            break
          case 'car': // 车辆
            console.log('删除  车辆')
            this.cesiumMap.$refs.mapShow.setObjectVisible('car', null, false)
            break
          case 'camera': // 摄像头
            console.log('删除  摄像头')
            this.getDeveuiPositionList(2, 'camera', 'delete')
            break
          case 'checkpoint': // 卡口
            console.log('删除  卡口')
            this.getDeveuiPositionList(0, 'checkpoint', 'delete')
            break
          case 'beacon': // 信标
            console.log('删除  信标')
            this.getDeveuiPositionList(1, 'beacon', 'delete')
            break
          case 'base_station': // 基站
            console.log('删除  基站')
            this.getDeveuiPositionList(3, 'base_station', 'delete')
            break
        }
      }
    },
    // 获取设备坐标 0-卡口，1-信标，2-监控，3-基站
    getDeveuiPositionList (type, deveuiType, deleteType) {
      if (deleteType) {
        this.deleteLayerTopData([], type, deveuiType)
      } else {
        getDeveuiPosition({ deveuiType: type }).then(({ data }) => {
          console.log(data, '===========')
          if (data && data.code === 0) {
            this.layerTopData(data.DeveuiMap.list, type, deveuiType)
          } else {
            this.$message.error('未知异常，请联系管理员！')
          }
        })
      }
    },
    // data-数据,type-(0，1，2),deveuiType-类型
    layerTopData (data, type, deveuiType) {
      let _this = this
      let children = []
      switch (deveuiType) {
        case 'person': // 人员
          children = []
          data.map(val => {
            this.layer.person.push(val.deveui)
            children.push({ id: val.deveui, // 物体一ID
              x: translateXyToLnglat(val.positionX, val.positionY).x, // 坐标x
              y: translateXyToLnglat(val.positionX, val.positionY).y, // 坐标y
              z: val.positionZ, // 坐标z
              name: val.person.name, // 人员姓名
              nameStyle: {
                font: '14px 微软雅黑',
                fillColor: 'rgba(0,255,0,0.8)', // 字体颜色
                backgroundColor: 'rgba(0,255,0,0.8)', // 背景颜色
                showBackground: false, // 是否显示背景颜色
                pixelOffset: [0, -60] // x,y偏移
              },
              icon: this.icons.person // 地图上显示的图标
            })
          })
          if (this.layer.person.length <= 0) {
            this.layer.person.push('person')
          }
          setTimeout(() => {
            _this.cesiumMap.$refs.mapShow.initObjectLocation(deveuiType, children)
          }, 10)
          break
        case 'car': // 车辆
          children = []
          data.map(val => {
            this.layer.car.push(val.deveui)
            children.push({
              id: val.deveui, // 物体一ID
              x: translateXyToLnglat(val.positionX, val.positionY).x, // 坐标x
              y: translateXyToLnglat(val.positionX, val.positionY).y, // 坐标y
              z: val.positionZ, //
              name: '',
              icon: this.icons.car // 地图上显示的图标
            })
          })
          setTimeout(() => {
            _this.cesiumMap.$refs.mapShow.initObjectLocation(deveuiType, children)
          }, 10)
          break
        case 'camera': // 摄像头
          console.log('展示摄像头')
          children = []
          data.map(val => {
            this.layer.camera.push(val.id)
            children.push({
              id: val.id, // 物体一ID
              x: translateXyToLnglat(val.x, val.y).x, // 坐标x
              y: translateXyToLnglat(val.x, val.y).y, // 坐标y
              z: val.z,
              name: ' ',
              nameStyle: {
                pixeLoffset: [0, 0]
              },
              icon: this.icons.camera, // 地图上显示的图标
              scale: [30, 30],
              amination: false
            })
          })
          setTimeout(() => {
            _this.cesiumMap.$refs.mapShow.initObjectLocation(deveuiType, children)
          }, 10)
          break
        case 'checkpoint': // 卡口
          console.log('展示卡口')
          children = []
          data.map(val => {
            this.layer.checkpoint.push(val.id)
            children.push({
              id: val.id, // 物体一ID
              x: translateXyToLnglat(val.positionX, val.positionY).x, // 坐标x
              y: translateXyToLnglat(val.positionX, val.positionY).y, // 坐标y
              z: val.positionZ, //
              name: ' ',
              nameStyle: {
                pixeLoffset: [0, 0]
              },
              icon: this.icons.checkpoint, // 地图上显示的图标
              scale: [25, 30]
            })
          })
          setTimeout(() => {
            _this.cesiumMap.$refs.mapShow.initObjectLocation(deveuiType, children)
          }, 10)
          break
        case 'beacon': // 信标
          console.log('展示信标')
          children = []
          data.map(val => {
            this.layer.beacon.push(val.deveui)
            children.push({
              id: val.deveui, // 物体一ID
              x: translateXyToLnglat(val.positionX, val.positionY).x, // 坐标x
              y: translateXyToLnglat(val.positionX, val.positionY).y, // 坐标y
              z: val.positionZ,
              name: ' ',
              nameStyle: {
                pixeLoffset: [0, 0]
              },
              icon: this.icons.beacon, // 地图上显示的图标
              scale: [8, 8]
            })
          })
          setTimeout(() => {
            this.cesiumMap.$refs.mapShow.initObjectLocation(deveuiType, children)
          }, 10)
          break
        case 'base_station': // 基站
          console.log('展示基站')
          children = []
          data.map(val => {
            children.push({
              id: val.deveui, // 物体一ID
              x: translateXyToLnglat(val.positionX, val.positionY).x, // 坐标x
              y: translateXyToLnglat(val.positionX, val.positionY).y, // 坐标y
              z: val.positionZ, //
              name: ' ',
              nameStyle: {
                pixeLoffset: [0, 0]
              },
              icon: this.icons.baseStation, // 地图上显示的图标
              scale: [30, 30],
              amination: true
            })
            this.layer.base_station.push(val.deveui)
          })
          setTimeout(() => {
            this.cesiumMap.$refs.mapShow.initObjectLocation(deveuiType, children)
          }, 10)
          break
      }
    },
    // data-数据,type-(0，1，2),deveuiType-类型
    deleteLayerTopData (data, type, deveuiType) {
      // 清除点击点与面的弹框
      this.cesiumMap.$refs.mapShow.closeGisPolygon()
      let ids = []
      switch (deveuiType) {
        case 'person': // 人员
          this.layer.person = []
          data.map(val => {
            ids.push(val.deveui)
          })
          console.log('删除人员图标', ids)
          this.cesiumMap.$refs.mapShow.deleteObjectLoc(deveuiType, [])
          break
        case 'car': // 车辆
          this.layer.car = []
          data.map(val => {
            ids.push(val.deveui)
          })
          console.log('删除车辆图标', ids)
          this.cesiumMap.$refs.mapShow.deleteObjectLoc(deveuiType, [])
          break
        case 'camera': // 摄像头
          this.layer.camera = []
          data.map(val => {
            ids.push(val.id)
          })
          console.log('删除摄像头图标', ids)
          this.cesiumMap.$refs.mapShow.deleteObjectLoc(deveuiType, [])
          break
        case 'checkpoint': // 卡口
          this.layer.checkpoint = []
          data.map(val => {
            ids.push(val.id)
          })
          console.log('删除卡口图标', ids)
          this.$nextTick(() => {
            this.cesiumMap.$refs.mapShow.deleteObjectLoc(deveuiType, [])
          })

          break
        case 'beacon': // 信标
          this.layer.beacon = []
          data.map(val => {
            ids.push(val.deveui)
          })
          this.cesiumMap.$refs.mapShow.deleteObjectLoc(deveuiType, [])
          break
        case 'base_station': // 基站
          this.layer.base_station = []

          data.map(val => {
            ids.push(val.deveui)
          })
          console.log('删除基站图标', ids)
          this.cesiumMap.$refs.mapShow.deleteObjectLoc(deveuiType, [])
          break
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.layer-top {
  background: linear-gradient(0deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.7));
  // height: 200px;
  // width: 200px;
  //   position: absolute;
  //   left: 200px;
  //   top: 20px;
  padding: 10px 20px 0px 20px;
  border-radius: 4px;
  .layer-top-padding {
    padding-bottom: 10px;
  }
  .el-checkbox {
    color: #fff;
  }
  .layer-top-img {
    width: 17px;
    margin-left: 2px;
  }
  .layer-top-camera {
    width: 17px;
    margin-right: 1px;
    // height: 20px;
  }
  .layer-top-person {
    width: 17px;
    // height: 19px;
    margin-left: 4px;
  }
  .layer-top-checkpoint {
    width: 17px;
    // height: 20px;
    margin-left: 4px;
  }
  .layer-top-base_station {
    width: 17px;
  }
  .layer-top-beacon {
    // width: 14px;
    // height: 20px;
    margin-left: 4px;
  }
}
</style>
