<template>
  <div class="three-map-container" v-loading="loadStatus" :element-loading-text="loadText" element-loading-spinner="el-icon-loading" element-loading-background="rgb(48, 49, 51)">
    <div ref="threeShow" class="threeShow" :class="{ drawing: drawStatus, hold: !drawStatus }" style="width:100%;height:100%"></div>
    <div class="back-button flex flex-column" style="display:none">
      <el-button plain @click="handleObjectStatus()">{{mapStatus === 1 ? "进入建筑选取模式" : mapStatus === 2 ? "退出建筑选取模式" : mapStatus === 3 ? "返回建筑选取模式" : "返回楼层选取模式"}}</el-button>
      <el-button plain @click="signCamera()">记录相机</el-button>
      <el-button plain @click="test()">测试(绘制所有卡口)</el-button>
    </div>

    <bill-board ref="billboard" v-show="billboardStatus"></bill-board>

    <!-- <div class="coordinate">{{'坐标x:' + coordinate.x + ',y:' + coordinate.z}}</div> -->
  </div>
</template>

<script>
import { APP } from '@/assets/threeJsLib/threeApp'
import billBoard from './billBoard'
var player = null
export default {
  props: {
    personList: {
      type: Array,
      default: () => []
    }
  },
  components: {
    billBoard
  },
  data () {
    return {
      mountFuns: {}, // 放置挂载进来的回调函数
      floatDiv: false,
      size: 0.01,
      personDataJson: [],
      drawStatus: false, // 选点状态
      drawType: 0, // 选取类型 0：室外选取 1：室内选取
      loadStatus: true, // 模块页面加载状态
      billboardStatus: false, // 体块billboard显示状态
      loadText: '', // 加载提示文本
      cameraMode: '3D', // 相机模式
      selectPoint: [], // 地图选点数组
      selectInsiteParmas: { floor: 1, minH: 0, maxH: 0 }, // 室内选点返回的参数
      coordinate: { x: 0, y: 0, z: 0 }, // 鼠标位置
      monomerBuildingName: null, // 缓存-当前单体显示的物体名称
      monomerFloorName: null, // 缓存-当前单体显示的楼层名称
      cameraCache: [], // 缓存-相机用于重置位置
      mapStatus: 1, // 地图状态：1-全景无后处理 2-全景有后处理(此时可以选择建筑进入单体模式) 3-单体建筑 4-单体楼层
      pointsNum: [3, 100] // 地图选点个数 默认3-100个
    }
  },
  mounted () {
    this.init()
    window.onresize = () => {
      // 监视窗体大小
      return (() => {
        this.reSize()
      })()
    }
  },
  watch: {
    mapStatus (val, oldval) {
      switch (val) {
        case 1: // 全景无后处理
          player.changeRenderMode('normal')
          break
        case 2: // 全景有后处理(此时可以选择建筑进入单体模式)
          player.changeRenderMode('composer')
          break
        case 3: // 单体建筑
          player.changeRenderMode('composer')
          break
        case 4: // 单体楼层
          player.changeRenderMode('normal')
          break
      }
    }
  },
  methods: {
    init () {
      // 初始化加载
      player = new APP.Player(this)
      let loaderGltf = player.getGltfLoader()
      if (window.threeJsModel) {
        // 如果已经缓存模型了 则不加载
        this.load()
        return
      }
      loaderGltf.load(
        process.env.NODE_ENV === 'production'
          ? '3DModels/' + window.SITE_CONFIG['mapModelName'] + '.glb'
          : 'static/3DModels/' + window.SITE_CONFIG['mapModelName'] + '.glb',
        json => {
          window.threeJsModel = json
          this.load()
        },
        event => {
          // console.log(event)
          // console.log(event.srcElement.getResponseHeader('content-length'))
          this.loadText = `地图资源加载中(${event.loaded}byte)`
        },
        error => {
          console.log(error)
        }
      )
    },
    load () {
      if (
        localStorage.getItem('cameraPosition') &&
        localStorage.getItem('cameraTarget')
      ) {
        player.cp = JSON.parse(localStorage.getItem('cameraPosition'))
        player.ct = JSON.parse(localStorage.getItem('cameraTarget'))
      }
      // this.reSize()
      player.mountCallbackFun({
        // 挂载显示坐标函数
        mouseMove: this.mouseMove,
        mouseClick: this.mouseClick,
        dblClick: this.dblClick
      })
      player.load(this.formatModelData(window.threeJsModel)) // 这里处理了下模型数据
      player.play(this.$refs.threeShow)
      this.$refs.threeShow.appendChild(player.dom)
      this.$nextTick(() => {
        this.reSize()
      })
      this.$emit('loaded') // 加载完成事件
      this.loadStatus = false
      // window.scene = player.getScene()
      window.player = player
      // window.THREE = THREE
    },
    reSize () {
      // 调整尺寸
      let showDom = this.$refs.threeShow
      player.setSize(
        showDom.clientWidth,
        showDom.clientHeight,
        showDom.getBoundingClientRect().x,
        showDom.getBoundingClientRect().y
      )
    },
    moveCamera (meshName) {
      // 相机追踪
      player.moveCamera(meshName)
    },
    signCamera () {
      // 标记相机位置
      let result = player.getCameraLocation()
      localStorage.setItem('cameraPosition', JSON.stringify(result[0]))
      localStorage.setItem('cameraTarget', JSON.stringify(result[1]))
      return result
    },
    resetCamera () {
      // 重置相机
      player.resetCamera(
        JSON.parse(localStorage.getItem('cameraPosition')),
        JSON.parse(localStorage.getItem('cameraTarget'))
      )
    },
    setCameraByLocAndLen (x, y, z, len = 50) {
      // 设置相机位置 根据 坐标(threejs坐标) 和 距离
      let offset = Math.sqrt((len * len) / 2)
      player.cameraMotion(x, offset, z + offset, x, y, z)
    },
    changeCameraMode (val = '') {
      // 2D3D切换
      if (this.cameraMode === val) {
        return
      }
      let cl = player.getCameraControls()
      let cam = player.getCamera()
      if ((this.cameraMode === '2D' && val === '') || val === '3D') {
        cl.maxPolarAngle = Math.PI * 0.495
        player.cameraMotion(
          cam.position.x,
          300,
          cam.position.z + 300,
          cl.target.x,
          0,
          cl.target.z
        )
        this.cameraMode = '3D'
      } else if ((this.cameraMode === '3D' && val === '') || val === '2D') {
        player.cameraMotion(
          cl.target.x,
          500,
          cl.target.z,
          cl.target.x,
          0,
          cl.target.z - 1,
          () => {
            cl.maxPolarAngle = 0
          }
        )
        this.cameraMode = '2D'
      }
    },
    mouseMove (val, obj) {
      // 获取 实时坐标 和 鼠标所指的第一个物体
      this.coordinate = val
      if (this.mapStatus === 2) {
        const building = this.searchParent(obj)
        if (building) {
          player.showOutLine([building])
        } else {
          player.showOutLine([])
        }
      } else if (this.mapStatus === 3) {
        const floor = this.searchParent(obj, 'floor')
        if (floor) {
          player.showOutLine([floor])
        } else {
          player.showOutLine([])
        }
      }
    },
    dblClick (obj) {
      // 双击事件
      if (obj && this.mapStatus === 2 && !this.monomerBuildingName) {
        // 进入建筑单体模式
        let parentObj = this.searchParent(obj)
        let name = parentObj.name
        if (this.mountFuns.buildSelect) {
          // 如果有选择建筑物的回调 则直接返回双击的建筑名称
          this.mountFuns.buildSelect(parentObj)
          return
        }
        this.monomerBuildingName = name
        this.initMonomer(name)
        this.cameraCache.unshift(player.moveCamera(name))
        this.mapStatus = 3
        this.splitBuilding(name)
      } else if (obj && this.mapStatus === 3 && !this.monomerFloorName) {
        // 进入楼层单体模式
        let name2 = this.searchParent(obj, 'floor').name
        this.monomerFloorName = name2
        this.initMonomer(name2, 'floor')
        this.cameraCache.unshift(player.moveCamera(name2))
        this.mapStatus = 4
        if (this.mountFuns.enterFloor) {
          // 如果挂载了回调则此时执行，告诉外部已进入楼层模式
          this.mountFuns.enterFloor()
          this.mountFuns.enterFloor = undefined // 清除该回调函数
        }
      }
    },
    mouseClick (val, event, intersects) {
      // 鼠标点击事件 选点用
      // val.y = 1.5 // 防止点和线段穿模（地面上花坛之类的），高度抬高为1.5米
      if (this.drawStatus && event.buttons === 1) {
        if (this.pointsNum[0] === this.pointsNum[1]) {
          this.selectPoint.length = this.pointsNum[0]
          this.selectPoint.shift()
        }
        if (this.drawType === 0) {
          // 室外
          this.selectPoint.push(val)
        } else {
          // 室内
          let floorObj = this.searchParent(intersects.object, 'floor') // 找到所点的楼层
          let nameArr = floorObj.name.split('_')
          let floor = Number(nameArr[2].replace('f', ''))
          let heightArr = nameArr[nameArr.length - 1].split(',')
          val = intersects.point

          this.selectInsiteParmas.floor = floor
          this.selectInsiteParmas.minH = Number(heightArr[0]) / 1000
          this.selectInsiteParmas.maxH = Number(heightArr[1]) / 1000
          this.selectInsiteParmas.buildId = floorObj.parent.name

          this.selectPoint.push(val)
        }
        player.selectPoint(val, this.selectPoint.length, this.pointsNum)
        if (this.selectPoint.length > 1) {
          // 绘制路线
          player.drawLine(
            this.selectPoint[this.selectPoint.length - 2],
            this.selectPoint[this.selectPoint.length - 1]
          )
        }
      }
    },
    startClickCoordinate (val, minNum = 3, maxNum = 100, type = 0) {
      // 开始选点坐标 type:0室外,1室内
      this.changeCameraMode('2D')
      this.pointsNum = [minNum, maxNum]
      this.drawStatus = true
      this.drawType = type
    },
    stopClickCoordinate (val, minNum = 3, maxNum = 100) {
      // 停止选点坐标 最少点数 室外只返回所有点的数组 室内则返回一个对象parmas里面存储楼层的信息
      if (this.selectPoint.length >= 2) {
        player.drawLine(
          this.selectPoint[0],
          this.selectPoint[this.selectPoint.length - 1]
        )
      }
      this.drawStatus = false
      if (
        this.selectPoint.length > minNum - 1 &&
        this.selectPoint.length <= maxNum
      ) {
        this.changeCameraMode('3D')
      }
      let selectPoint = this.selectPoint.map(val => {
        return {
          x: val.x,
          y: val.z,
          z: val.y
        }
      })
      this.pointsNum = [minNum, maxNum]
      if (this.drawType === 0) {
        return selectPoint
      } else {
        this.drawType = 0
        return { selectPoint, parmas: this.selectInsiteParmas }
      }
    },
    drawCoordinates (
      arr = [
        [1, 1, 1],
        [5, 5, 5],
        [8, 8, 8]
      ]
    ) {
      // 绘制选点 并 加载体块 threejs坐标系
      // this.drawExtrudeGeometry(arr) // 绘制体块
      if (arr && arr.length > 1) {
        let cache = arr.map(p => {
          return player.createVector3(p)
        })
        cache.map((r, idx) => {
          player.selectPoint(r, idx + 1)
          if (idx + 1 > 1) {
            // 绘制路线
            player.drawLine(cache[idx - 1], cache[idx])
          }
        })
        player.drawLine(cache[arr.length - 1], cache[0])
      }
    },
    getCoordinateLoc () {
      // 获取选点坐标
      return this.selectPoint
    },
    clearCoordinate (name) {
      // 清除选点
      player.clearPoint(name || undefined)
      player.clearExtrudeGeometry() // 清除体块
      this.selectPoint = []
    },
    formatModelData (data) {
      // 给模型数据添加自定义属性
      // 遍历楼房组下的所有楼房和内部楼层 写入自定义属性
      let lfData = data.scene.getObjectByName('cj')
      if (lfData) {
        lfData.children.map(building => {
          building.snType = 'building'
          if (building.name.substring(0, 1) === '_') {
            // 防建模师命名时手抖
            building.name = building.name.substr(1, building.name.length - 1)
          }
          building.snName = building.name.split('_')[1]
          if (building.children) {
            building.children.map(floor => {
              floor.snType = 'floor'
              if (floor.name.substring(0, 1) === '_') {
                // 防建模师命名时手抖
                floor.name = floor.name.substr(1, floor.name.length - 1)
              }
              floor.snName = floor.name.split('_')[2]
            })
          }
        })
      }
      return data
    },
    searchParent (object, parentName = 'building') {
      // 递归父3d元素，找到建筑或者楼层，默认找建筑
      let callback
      const search = obj => {
        if (obj) {
          if (obj.snType === parentName) {
            callback = obj
          } else {
            search(obj.parent)
          }
        }
      }
      search(object)
      return callback
    },
    initMonomer (name, type = 'building') {
      // 单体显示 默认为建筑的单体显示
      let scene = player.getScene()
      if (type === 'building') {
        // 建筑单体显示
        scene.getObjectByName('dx').visible = false // 隐藏地形
        scene
          .getObjectByName('cj')
          .getObjectsByProperty('snType', 'building')
          .map(object => {
            if (object.name !== name) {
              object.visible = false
            }
          })
      } else {
        // 楼层单体显示
        scene.getObjectByName(this.monomerBuildingName).children.map(floor => {
          if (floor.name !== name) {
            floor.visible = false
          }
        })
      }
    },
    quitMonomer (name, type = 'building') {
      // 退出单体显示 默认退出建筑的单体显示
      let scene = player.getScene()
      if (type === 'building') {
        // 退出建筑单体显示
        scene.getObjectByName('dx').visible = true // 显示地形
        scene
          .getObjectByName('cj')
          .getObjectsByProperty('snType', 'building')
          .map(object => {
            if (object.name !== name) {
              object.visible = true
            }
          })
      } else {
        // 退出楼层单体显示
        scene.getObjectByName(this.monomerBuildingName).children.map(floor => {
          if (floor.name !== name) {
            floor.visible = true
          }
        })
      }
    },
    splitBuilding (obj) {
      // 拆分建筑
      let objects
      if (typeof obj === 'string') {
        objects = player.getScene().getObjectByName(obj).children
      } else {
        objects = obj.children
      }
      objects.map(child => {
        if (!child.snName) return // 忽略后添加的物体及对象
        child.defaultPosY = child.position.y // 将楼层初始高度缓存，用于重置高度
        if (child.name.indexOf('_d') !== -1) {
          // 如果是顶层
          child.position.y = child.position.y + (objects.length - 1) * 6
        } else {
          // 非顶层
          child.position.y =
            child.position.y +
            (parseInt(child.snName.replace('f', '')) - 1) * 6
        }
      })
    },
    resetBuilding (obj) {
      // 还原建筑
      let objects
      if (typeof obj === 'string') {
        objects = player.getScene().getObjectByName(obj).children
      } else {
        objects = obj.children
      }
      objects.map(child => {
        child.position.y = child.defaultPosY
      })
    },
    handleObjectStatus (val, type) {
      // 回退建筑选取 val: 0、从任意状态返回到初始状态,此时type必填 1、切换到建筑选择模式 2、切换到外景模式 3、退出建筑单体 4、退出楼层单体
      const func = () => {
        let status = val || this.mapStatus
        switch (status) {
          case 1:
            this.mapStatus = 2
            break
          case 2:
            this.mapStatus = 1
            break
          case 3:
            if (this.monomerBuildingName) {
              this.quitMonomer(this.monomerBuildingName)
              if (this.cameraCache.length > 0) {
                // 相机移回之前位置
                player.cameraMotion(
                  this.cameraCache[0].position.x,
                  this.cameraCache[0].position.y,
                  this.cameraCache[0].position.z,
                  this.cameraCache[0].target.x,
                  this.cameraCache[0].target.y,
                  this.cameraCache[0].target.z
                )
                this.cameraCache.shift()
              }
              this.mapStatus = 2
              this.resetBuilding(this.monomerBuildingName)
              this.monomerBuildingName = null
            }
            break
          case 4:
            if (this.monomerFloorName) {
              this.quitMonomer(this.monomerFloorName, 'floor')
              if (this.cameraCache.length > 0) {
                // 相机移回之前位置
                player.cameraMotion(
                  this.cameraCache[0].position.x,
                  this.cameraCache[0].position.y,
                  this.cameraCache[0].position.z,
                  this.cameraCache[0].target.x,
                  this.cameraCache[0].target.y,
                  this.cameraCache[0].target.z
                )
                this.cameraCache.shift()
              }
              this.mapStatus = 3
              this.monomerFloorName = null
            }
            break
        }
      }
      func()
      if (type && this.mapStatus > 1) {
        this.handleObjectStatus(this.mapStatus, type)
      }
    },
    displayObjects (arr, closeType, visType) {
      // 在地图上显示物体
      player.displayObjects(arr, closeType, visType)
    },
    mountFunction (name, fun, type = 0) {
      // 挂载回调函数
      if (type === 0) {
        // type=0 为新增
        this.mountFuns[name] = fun
      } else {
        this.mountFuns[name] = undefined
      }
    },
    drawExtrudeGeometry (
      points,
      object,
      name,
      minH,
      maxH,
      color,
      opacity,
      wire
    ) {
      // 绘制体块
      // points = [[451, 0, 323], [471, 0, 324], [473, 0, 369], [548, 0, 367], [546, 0, 403], [452, 0, 400]]
      player.drawExtrudeGeometry(
        points,
        object,
        name,
        minH,
        maxH,
        color,
        opacity,
        wire
      )
    },
    removeOpacity (obj) {
      if (typeof obj === 'string') {
        obj = player.getScene().getObjectByName(obj)
      }
      player.removeOpacity(obj)
    },
    getFloorInfo (building) { // 获取建筑各楼层高度
      let floorInfo = []
      building.children.map(child => {
        if (child.snName !== 'd') { // 排除顶盖
          floorInfo.push({
            idx: Number(child.snName.replace('f', '')),
            minH: Number(child.name.split('_').pop().split(',')[0]),
            maxH: Number(child.name.split('_').pop().split(',')[1])
          })
        }
      })
      return _.sortBy(floorInfo, 'idx').map(r => {
        return r.minH
      })
    },
    showExtrudeGeometryBillBoard (object, cb) { // 显示体块信息板
      this.removeExtrudeGeometryBillBoard(object)
      this.billboardStatus = true
      player.loadCss2dDom(object, this.$refs.billboard.$el)
      this.$refs.billboard.init([
        () => {
          if (object.opacityStatus) {
            player.removeOpacity(object)
            object.opacityStatus = false // 透明状态写入模型
            if (cb) cb(object, 'opacity', false) // 回调
          } else {
            player.setOpacity(object, 0.25, 0x003c9a, true)
            object.opacityStatus = true // 透明状态写入模型
            if (cb) cb(object, 'opacity', true) // 回调
          }
          this.removeExtrudeGeometryBillBoard(object)
        },
        () => {
          if (object.splitStatus) {
            this.resetBuilding(object)
            object.splitStatus = false // 拆分状态写入模型
            if (cb) cb(object, 'split', false) // 回调
          } else {
            this.splitBuilding(object)
            object.splitStatus = true // 拆分状态写入模型
            if (cb) cb(object, 'split', true) // 回调
          }
          this.removeExtrudeGeometryBillBoard(object)
        },
        () => {
          this.removeExtrudeGeometryBillBoard(object)
        }
      ], object, object.opacityStatus, object.splitStatus)
    },
    removeExtrudeGeometryBillBoard (object) { // 隐藏体块信息板
      this.billboardStatus = false
      this.$refs.billboard.remove(object)
    },
    initTrack (index, trackList, id, text, base64) {
      // 绘制轨迹
      player.initTrack(index, trackList, id, text, base64)
    },
    removeTrack () {
      // 移除轨迹
      player.removeTrack()
    },
    getPointInPolygon (point, vs) { // 判断点是否在面内
      var x = Number(point[0])
      var y = Number(point[1])
      var inside = false
      for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = Number(vs[i][0])
        var yi = Number(vs[i][1])
        var xj = Number(vs[j][0])
        var yj = Number(vs[j][1])
        var intersect = ((yi > y) !== (yj > y)) &&
          (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
        if (intersect) inside = !inside
      }
      return inside
    },
    getPolygonAreaCenter (points, action, len) {
      // 获取多边形重心 threejs坐标系 points:[[x,y,z],[x2,y2,z2]] action:true、移动到重心附近
      let centerPoint = player.getPolygonAreaCenter(points)
      if (action) {
        // player.cameraMotion(centerPoint[0], centerPoint[1] + 70, centerPoint[2] + 70, centerPoint[0], 0, centerPoint[2])
        this.setCameraByLocAndLen(...centerPoint, len)
      }
      return centerPoint // 返回重心
    },
    insertOrUpdatePoint (id, text, type, position, base64, fun) {
      player.insertOrUpdatePoint(id, text, type, position, base64, fun)
    },
    test () {
      // 测试按钮
      let arr = {
        typeName: 'point',
        iconBase64:
          'data:image/png;base64,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',
        point: [
          {
            x: 468,
            y: 1,
            z: 410,
            id: '123128974136591341',
            name: 'beacon',
            cnName: '信标',
            data: {
              'x:': '245.123123',
              'y:': '147.265456',
              'z:': '0',
              '电量:': '89%',
              '备注:': '这是一个信标1'
            }
          },
          {
            x: 552,
            y: 10,
            z: 409,
            id: '123128974136591342',
            name: 'beacon',
            cnName: '信标',
            data: {
              '备注:': '这是一个信标2'
            }
          },
          {
            x: 504,
            y: 1,
            z: 457,
            id: '123128974136591343',
            name: 'beacon',
            cnName: '信标',
            data: {
              '备注:': '这是一个信标3'
            }
          }
        ],
        fun: val => {
          alert(val)
        }
      }
      this.displayObjects(arr)
    }
  }
}
</script>

<style lang="scss">
.three-map-container {
  position: relative;
  height: 100%;

  .threeShow {
    #labelRenderer {
      z-index: 0;
    }

    &.drawing {
      cursor: Crosshair;
    }

    &.hold {
      cursor: url(data:image/png;base64,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),
        auto;
    }
  }

  .coordinate {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  .back-button {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
</style>

<style lang="scss">
@import '~@/assets/threeJsLib/threeApp.scss';
</style>
