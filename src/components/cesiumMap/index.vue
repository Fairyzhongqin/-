/* eslint-disable no-irregular-whitespace */
<template>
  <div>
    <div id="cesiumContainer" class="cesium-container">
      <div style="position: absolute;bottom: 8px;right: 35px;z-index: 1000;color: white;">
        <div style="display:none;">
          <input id="upPt" type="button" value="更新点位" />
          <input id="track" type="button" value="目标跟踪" />
          <input id="removeTrack" type="button" value="解除跟踪" />
          <input id="pathBack" type="button" value="轨迹回放" />
          <input id="pathCance" type="button" value="轨迹取消" />
        </div>
        经度：
        <span id="longitude_show"></span>
        纬度：
        <span id="latitude_show"></span>
      </div>
    </div>
    <div id="perNumDiv" class="perNum-div" style="position: absolute">
      <gis-person :personDistributionData="personDistributionData"></gis-person>
    </div>
    <!--点击面弹出框 z-index高于perNumDiv-->
    <div id="clickPolygonDiv" class="click-polygon-div" style="position: absolute;z-index:8">
      <gis-polygon ref="gisPolygon"></gis-polygon>
    </div>
  </div>
</template>

<script>
import GisPerson from '@/views/mapPage/components/GisPerson'
import GisPolygon from '@/views/mapPage/components/GisPolygon'
var HX3D = {}
var ptArr = [] // 点物体数组
var ptLabelArr = [] // 点物体label数组
var polygonArr = [] // 面物体数组
var boxArr = [] // 面box数组
// var dataSource = null // 点数据源
export default {
  name: 'gis-map',
  components: { GisPerson, GisPolygon },
  props: {
    personDistributionData: {
      type: Object,
      default: '人员分布展示信息'
    }
  },
  data () {
    return {
      paramsObj: {
        // 三维地球场景构造函数
        HXMap3D: {
          homeButton: false, // 复位按钮
          sceneModePicker: false, // 二三维场景切换按钮
          navigationHelpButton: true, // 帮助提示按钮
          infoBox: true, // 信息窗口部件，可以重写填充其description，默认有个定位按钮
          vrButton: false, // VR按钮 需要带VR眼镜
          fullscreenButton: true, // 全屏按钮
          geocoder: false, // 地名收索按钮，因为墙的问题
          navigationInstructionsInitiallyVisible: true, // 帮助提示按钮显示设置；
          baseLayerPicker: true, // 底图选择控件
          center: {
            // 定位的位置 即飞行参数
            y: 31.935856, // 纬度
            x: 120.092679, // 经度
            z: 800, // 高程
            heading: 0, // 方位角
            pitch: -24.6, // 倾仰角
            roll: 0, // x轴
            enableFly: false, // 是否启用飞行
            flyTime: 7 // 单位秒，启用飞行时才生效
          },
          minzoom: 20, // 最小离地距离 即控制缩放级别参数,单位为米
          maxzoom: 15000000, // 最大离地距离 即控制缩放级别参数,单位为米
          mouseZoom: true, // 启用滚轮缩放
          location: {
            // 位置控件(0.1版本暂不考虑)
            crs: '', // 坐标系统
            format:
              '<div>视高：{height}米</div><div>方向：{heading}度</div><div>海拔：{z}米</div><div>纬度:{y}</div><div>经度:{x}</div>'
          },
          crs: '',
          basemaps: [
            // 底图图层数组树，默认显示第一个索引的图层
            // {
            //   'id': 10, // 父节点id;
            //   'name': '地图底图', // 地图名称
            //   'type': 'group'
            // },
            // {'pid': 10,
            //   'name': '天地图影像地图',
            //   'tip': '天地图影像地图',
            //   'icon': '../images/basemap/Tianditu_img.png',
            //   'type': 'www_tdt',
            //   'layer': 'img_h',
            //   'key': [    // 密钥
            //     '313cd4b28ed520472e8b43de00b2de56',
            //     '83b36ded6b43b9bc81fbf617c40b83b5',
            //     '0ebd57f93a114d146a954da4ecae1e67',
            //     '6c99c7793f41fccc4bd595b03711913e',
            //     '56b81006f361f6406d0e940d2f89a39c'
            //   ]}
          ]
        }
      },
      tileset: {}, // 三维模型
      tilesetOpts: {} // 构建三维模型的可选参数
    }
  },
  created () { },
  mounted () {
    let interval = setInterval(() => {
      if (window.HX3D) {
        HX3D = window.HX3D
        this.createMap()
        // 测试更新点位
        let tmp = this
        // document.getElementById('flyToD').onclick = function () {
        //   tmp.flyTo(1)
        // }
        // document.getElementById('flyToM').onclick = function () {
        //   tmp.flyTo(12)
        // }
        // tmp.isShow = false
        // tmp.amColor = 'blue'
        // document.getElementById('showSd').onclick = function () {
        //   if (tmp.amColor === 'red') {
        //     tmp.amColor = 'blue'
        //   } else {
        //     tmp.amColor = 'red'
        //   }
        //   alert(tmp.amColor)
        //   tmp.setPtAminationVisible('per', [], true, {'color': tmp.amColor, 'radius': 45})
        // }
        // document.getElementById('unShowSd').onclick = function () {
        //   tmp.setPtAminationVisible('per', [], false)
        // }
        // document.getElementById('visiblePt').onclick = function () {
        //   tmp.setObjectVisible('per', [], tmp.isShow)
        //   if (tmp.isShow) {
        //     tmp.isShow = false
        //   } else {
        //     tmp.isShow = true
        //   }
        // }
        // document.getElementById('removePt1').onclick = function () {
        //   tmp.deleteObjectLoc('per')
        // }
        document.getElementById('track').onclick = function () {
          tmp.mubiaogenzong('00024', 'per')
        }
        document.getElementById('removeTrack').onclick = function () {
          tmp.jiechugongzong()
        }
        document.getElementById('pathCance').onclick = function () {
          clearInterval(tmp.interval1)
          tmp.removeGuiJi()
        }
        document.getElementById('pathBack').onclick = function () {
          let nameStyle = {
            font: '18px 微软雅黑',
            fillColor: 'rgba(0,255,0,0.8)', // 字体颜色
            backgroundColor: 'rgba(0,255,0,0.8)', // 背景颜色
            showBackground: false, // 是否显示背景颜色
            pixelOffset: [20, -20] // x,y偏移移
          }
          let x = 120.093129
          let y = 31.935976
          let z = 0
          let locArray = []
          for (let i = 0; i < 20; i++) {
            x += 0.00001
            y += 0.00001
            z = 0
            let obj = {
              x: x,
              y: y,
              z: z
            }
            locArray.push(obj)
          }
          // let locArray = [
          //   {
          //     x: 120.093129,
          //     y: 31.935976,
          //     z: 0
          //   },
          //   {
          //     x: 120.094679,
          //     y: 31.935856,
          //     z: 0
          //   },
          //   {
          //     x: 120.094779,
          //     y: 31.935856,
          //     z: 0
          //   },
          //   {
          //     x: 120.094979,
          //     y: 31.935856,
          //     z: 0
          //   },
          //   {
          //     x: 120.095079,
          //     y: 31.935856,
          //     z: 0
          //   },
          //   {
          //     x: 120.094979,
          //     y: 31.935856,
          //     z: 0
          //   },
          //   {
          //     x: 120.094979,
          //     y: 31.935756,
          //     z: 0
          //   }
          // ]
          tmp.initGuiJiData('pers', '00025', locArray, 'src/assets/img/cesiumMap/car.png', '测试企业', nameStyle, [35, 35], false)
          tmp.guijiIndex = 0
          tmp.interval1 = setInterval(() => {
            tmp.setGuiJiDataIndex(tmp.guijiIndex++)
            if (tmp.guijiIndex === 15) {
              tmp.guijiIndex = 1
            }
            if (tmp.guijiIndex === 20) {
              clearInterval(tmp.interval1)
            }
          }, 2500)
        }
        tmp.x = 120.094679
        tmp.y = 31.935856
        document.getElementById('upPt').onclick = function () {
          // tmp.deleteObjectLoc('per', [])
          tmp.x += 0.0001
          tmp.y += 0.0001
          let nameStyle = {
            font: '18px 微软雅黑',
            fillColor: 'rgba(0,255,0,0.8)', // 字体颜色
            backgroundColor: 'rgba(0,255,0,0.8)', // 背景颜色
            showBackground: false, // 是否显示背景颜色
            pixelOffset: [20, -20] // x,y偏移移
          }
          tmp.insertOrUpdateObjectLoc(
            'per',
            '00024',
            tmp.x,
            tmp.y,
            '1',
            'src/assets/img/cesiumMap/car.png',
            '王',
            nameStyle,
            0,
            [25, 25],
            true
          )
        }
        clearInterval(interval)
      }
    }, 500)
  },
  computed: {},
  watch: {},
  methods: {
    // 隐藏弹框
    closeGisPolygon: function () {
      this.$refs.gisPolygon.cameraShowVisible = false
      if (this.$refs.gisPolygon.acmeraInterval) {
        clearInterval(this.$refs.gisPolygon.acmeraInterval)
      }
    },
    createMap: function () {
      let tmp = this
      HX3D.Util.createMap({
        id: 'cesiumContainer',
        url: tmp.paramsObj,
        success: function (viewer, gisdata, json) {
          HX3D.lonlatCenter = { lon: 120.092679, lat: 31.935856 } // 默认某个企业地图中心点
          tmp.viewer = viewer // 获取查看器
          // window.viewer = viewer // 挂载到window
          tmp.gisdata = gisdata
          tmp.tilesetOpts = {
            enableShowName: false,
            enableCenter: true, // 是否启用自定义居中，与center同时存在,设置为true时，初始化需要传值覆盖默认值，否则使用默认值
            center: {
              x: 120.093129,
              y: 31.935976,
              z: 0,
              rx: 0, // X轴（经度）方向旋转角度（单位：度）
              ry: 0, // Y轴（纬度）方向旋转角度（单位：度）
              rz: 0 // Z轴（高程）方向旋转角度（单位：度）
            },
            enableClickFeature: false
          }
          tmp.createLayer() // 创建三维图层
          HX3D.Entities.showLonLat(tmp.viewer, 'longitude_show', 'latitude_show')
          HX3D.Entities.leftClick(tmp.viewer, tmp)
          // 文字效果控制 距地多少距离时开始显示
          // HX3D.Entities.mouseWheel(tmp.viewer, ptLabelArr)
          // let points = tmp.createData(2)
          // for (var i = 0; i < points.length; i++) {
          //   let type = ''
          //   let radius = 0
          //   if (i === 0) {
          //     type = 'per'
          //     radius = 45
          //   } else {
          //     type = 'car'
          //     radius = 185
          //   }
          //   tmp.initObjectLocation(type, [
          //     {
          //       id: i, // 物体一ID
          //       x: points[i].lng, // 坐标x
          //       y: points[i].lat, // 坐标y
          //       z: '0', // 坐标z
          //       name: '',
          //       nameStyle: {
          //         font: '18px 微软雅黑',
          //         fillColor: 'rgba(255,0,0,0.8)', // 字体颜色
          //         backgroundColor: 'rgba(0,255,0,0.8)', // 背景颜色
          //         showBackground: false, // 是否显示背景颜色
          //         pixelOffset: [20, -20] // x,y偏移
          //       },
          //       icon: 'src/assets/img/cesiumMap/car.png', // 地图上显示的图标
          //       scale: [45, 45], // width,height  图标的大小 单位px
          //       amination: true, // 是否显示动画
          //       aminationObj: {
          //         color: 'red', // 颜色动画
          //         radius: radius // 动画半径
          //       }
          //     }
          //   ])
          // }
          // eslint-disable-next-line no-unused-vars
          let children = [{
            fenceID: '10',
            points: [{ // 体块顶点坐标
              x: '120.092679',
              y: '31.935856'
            }, { // 体块顶点坐标
              x: '120.093679',
              y: '31.935856'
            }, { // 体块顶点坐标
              x: '120.093679',
              y: '31.936856'
            }, { // 体块顶点坐标
              x: '120.092679',
              y: '31.936856'
            }],
            minH: '0', // 体块最低点高度
            maxH: '80', // 体块最高点高度
            color: 'rgba(255,0,0,0.4)' // 体块颜色 'rgba(123,22,30,0.8)' color和opacity合并成rgba
          }, {
            fenceID: '12',
            points: [{ // 体块顶点坐标
              x: '120.094679',
              y: '31.935856'
            }, { // 体块顶点坐标
              x: '120.095679',
              y: '31.935856'
            }, { // 体块顶点坐标
              x: '120.095679',
              y: '31.936856'
            }, { // 体块顶点坐标
              x: '120.094679',
              y: '31.936856'
            }],
            minH: '0', // 体块最低点高度
            maxH: '80', // 体块最高点高度
            color: 'rgba(255,0,0,0.4)' // 体块颜色 'rgba(123,22,30,0.8)' color和opacity合并成rgba
          }]
          // eslint-disable-next-line no-unused-vars
          let personNum = 123
          // id, type, description, children, personNum
          // tmp.initAreaObjectLoc('00023', 'type', 'description', children, personNum)
          // tmp.removeAreaObjectLoc('type')
          tmp.$emit('gisloadEnd') // 地图加载完成返回事件
        }
      })
    },
    /**
     * 添加模型
     * @param {Cesium.viewer} viewer
     * @param {Object} opts
     */
    createLayer: function () {
      let tmp = this // 用tmp接住this变量指向
      // 新模型地址
      let url = window.SITE_CONFIG['cesium3DTiles'] + '/zhongshi/b3dm2/tileset.json' // 生产打包地址
      if (tmp.viewer) {
        let test3DTiles = new HX3D.Tiles3d.QYSY(url, tmp.tilesetOpts)
        HX3D.Layer.create3dTilesLayer({
          // 在地图三维地球场景中创建
          tiles3d: test3DTiles,
          viewer: tmp.viewer,
          success: function (tileset, viewer) {
            viewer.HX3D.tileset = tileset // 设置viewer.HX3D的中tileset值
          }
        })
      }
    },
    /**
     * 移除模型
     */
    removeLayer: function () {
      if (this.viewer.HX3D.tileset) {
        HX3D.Layer.remove3dTilesLayer(this.viewer, this.viewer.HX3D.tileset)
      }
    },
    /**
     * 回复视角
     */
    resetViewer: function () {
      if (this.viewer.HX3D.tileset) {
        HX3D.Layer.reset3dTilesLayerViewer(
          this.viewer,
          this.viewer.HX3D.tileset
        )
      }
    },
    /**
     * 飞行到某实体
     * @param {Number} id  点实体的id，面实体的fenceID
     */
    flyTo: function (id) {
      HX3D.Entities.flyToEntity(this.viewer, ptLabelArr, boxArr, id)
    },
    /**
     * 设置企业坐标中心点
     * @param {Number} lon
     * @param {Number} lat
     */
    setOrigin: function (lon, lat) {
      HX3D.lonlatCenter.lon = lon
      HX3D.lonlatCenter.lon = lat
    },
    /**
     点物体位置初始加载(从无到有，如果已存在该物体则替换原有)
     type: '', // per:人员,car:车辆,kakou:卡口,cam:摄像头。。。 直接传图片路径
     locArray：[{
      id: '', //物体一ID
      x: '', //坐标x
      y: '', //坐标y
      z: '', //坐标z
      icon: '', //地图上显示的图标
      name:'', // 名称
      nameStyle：{
        font: '14pt',
        fillColor: 'rgba(33,255,33,0.8)',// 字体颜色
        backgroundColor: 'rgba(33,255,33,0.8)',// 背景颜色
        showBackground: false,// 是否显示背景颜色
        pixelOffset:[x,y] // x,y偏移
     },
     scale:[35,35] // 图片大小 width,height
     amination:true, // 是否启用动画
     aminationObj:{
        color:'red', // 动画颜色
        radius:45 // 动画大小
     }
    }, {
      id: '', //物体二ID
      .
      .
      .
    }]
     */
    initObjectLocation: function (type, locArray) {
      // 塞入数组
      ptArr.push.apply(ptArr, locArray)
      // 赋予type值
      for (var i = 0; i < ptArr.length; i++) {
        ptArr[i].type = type
      }
      // 赋值
      // dataSource = HX3D.Entities.createDataSource('pointArr')
      // 初始点物体化逻辑
      this._initObjectLocation(locArray)
    },
    /**
     * 设置点的动画
     * @param {String} type 当type值不为空时走type
     * @param {Array} ids 当type值为空时，走ids数组
     * @param {Boolean} isAmination 为true时 表示显示动画， false不启用动画
     * @param {Object} aminationObj 格式{color:'red',radius:10} radius表示闪动圆圈半径 当isAmination为false时，值可为空
     */
    setPtAminationVisible: function (type, ids, isAmination, aminationObj) {
      HX3D.Entities.setPtAmination(this.viewer, ptLabelArr, type, ids, isAmination, aminationObj)
    },
    _initObjectLocation: function (locArray, cameraType) {
      if (locArray.length > 0) {
        let tmp = this
        for (let i = 0; i < locArray.length; i++) {
          this._addPtToViewer(locArray[i])
          // 定位到bounds
          if (cameraType) {
            // tmp.viewer.flyTo(dataSource.entities, {
            //   duration: 3
            // })
            HX3D.Entities.flyTo(tmp.viewer, locArray[i].x, locArray[i].y, locArray[i].z, 2)
          }
        }
        // 查看器中添加
        // tmp.viewer.dataSources.add(dataSource)
      }
    },
    /**
     * @功能描述: 相机锁定对应的物体,物体若移动相机则跟随移动
     * @param id
     * @param type
     */
    mubiaogenzong (id, type) {
      let isExistClusterPtIndex = this._isInPtArr(ptLabelArr, '_ywId', id)
      if (isExistClusterPtIndex !== -1) {
        this.viewer.trackedEntity = ptLabelArr[isExistClusterPtIndex]
        return true
      } else {
        console.warn('确定点位是否存在')
        return false
      }
    },
    /**
     * @功能描述: 取消跟踪
     */
    jiechugongzong () {
      this.viewer.trackedEntity = null
      // clearInterval(this.interval)
    },
    /**
     * 添加某点到viewer,根据id判断是否存在
     * @param {String} type
     * @param {String} id
     * @param {String} x
     * @param {String} y
     * @param {String} z
     * @param {String} imgUrl
     * @param {String} name
     * @param {String} nameStyle
     * @param {Number} cameraType 1为启用摄像头跟踪，0为不跟踪
     * @param {Array} scale [width,height]
     * @param {Boolean} amination 启用动画
     * @param {Object} aminationObj 格式{color:'red',radius:10} radius表示闪动圆圈半径 当isAmination为false时，值可为空
     * @param {Boolean} visible 显隐状态
     */
    insertOrUpdateObjectLoc: function (type, id, x, y, z, imgUrl, name, nameStyle, cameraType, scale, amination, aminationObj, visible = true) {
      let isExist = this._isInPtArr(ptArr, 'id', id)
      let isExistClusterPtIndex = this._isInPtArr(ptLabelArr, '_ywId', id)
      if (isExistClusterPtIndex !== -1 && isExist !== -1) {
        HX3D.Entities.updatePt(this.viewer, id, x, y, z, amination, aminationObj)
        // ptArr[isExist].x = x
        // ptArr[isExist].y = y
        // ptArr[isExist].z = z
        // ptArr[isExist].scale = scale
        // this.viewer.entities.remove(ptLabelArr[isExistClusterPtIndex])
        // // 清楚label数组中此索引值
        // ptLabelArr.splice(isExistClusterPtIndex, 1)
        // 重新初始化所有
        // this._initObjectLocation(ptArr, cameraType)
        // 重新添加ptLabel
        // this._addPtToViewer({
        //   type: type,
        //   id: id,
        //   x: x,
        //   y: y,
        //   z: z,
        //   icon: imgUrl,
        //   name: name,
        //   nameStyle: nameStyle,
        //   scale: scale
        // })
      } else {
        // 在数组中添加
        let obj = {
          type: type,
          id: id,
          x: x,
          y: y,
          z: z,
          icon: imgUrl,
          name: name,
          nameStyle: nameStyle,
          scale: scale,
          amination: amination,
          aminationObj: aminationObj
        }
        ptArr.push(obj)
        // 单独渲染此点
        this._addPtToViewer(obj)

        // 新增的点物体需要注意传入的显隐性属性
        this.setObjectVisible(type, null, visible)
      }
    },
    /**
     * @功能描述: 控制点的显示和隐藏
     * @param type
     * @param ids
     * @param visible
     */
    setObjectVisible (type, ids, visible) {
      HX3D.Entities.setObjectPtVisible(ptLabelArr, type, ids, visible)
    },
    // locArray: [{x, y, z},{x, y, z}] 轨迹
    initGuiJiData (type, id, locArray, imgUrl, name, nameStyle, scale, isTrack) {
      this.guijiType = type
      this.guijiId = id
      this.guijiLocArray = locArray
      this.guijiImgUrl = imgUrl
      this.guijiName = name
      this.guijiNameStyle = nameStyle
      this.guijiScale = scale
      this.guijiLastIndex = -1
      this.guijiIsTrack = isTrack
    },
    setGuiJiDataIndex (index) {
      HX3D.Entities.drawPath(this.viewer, this.guijiLastIndex, index, this.guijiType, this.guijiId,
        this.guijiLocArray, this.guijiImgUrl, this.guijiName, this.guijiNameStyle, this.guijiScale, this.guijiIsTrack)
      this.guijiLastIndex = index
    },
    removeGuiJi () {
      if (this.guijiLocArray) {
        HX3D.Entities.removePath(this.viewer, this.guijiId, this.guijiLocArray.length)
      }
    },
    /**
     * 移除点位
     * @param {String} type 类型
     * @param {Array} ids
     */
    deleteObjectLoc: function (type, ids) {
      if (type) {
        // 存在
        this._deletPtLabel1('type', type)
      } else {
        for (let i = 0; i < ids.length; i++) {
          this._deletPtLabel1('id', ids[i])
        }
      }
    },
    /**
     * 移除label
     * @param {Array} ptLabelArr
     */
    _deletPtLabel0: function (ptLabelArr) {
      for (let i = 0; i < ptLabelArr.length; i++) {
        this.viewer.entities.remove(ptLabelArr[i])
      }
    },
    /**
     * 移除label
     * @param {Array} ptLabelArr
     */
    _deletPtLabel: function (ptLabelArr) {
      for (let i = 0; i < ptLabelArr.length; i++) {
        this.viewer.entities.remove(ptLabelArr[i])
      }
      ptLabelArr = []
    },
    _deletPtLabel1: function (key, val) {
      for (let i = 0; i < ptLabelArr.length; i++) {
        if (ptLabelArr[i][key] === val) {
          this.viewer.entities.remove(ptLabelArr[i])
          // 删除动画
          HX3D.Entities.removePtAmination(ptLabelArr[i]._id)
        }
      }
      // 新的newPtLabelArr,newPtArr
      let newPtLabelArr = []
      let newPtArr = []
      for (let i = 0; i < ptLabelArr.length; i++) {
        if (ptLabelArr[i][key] !== val) {
          newPtLabelArr.push(ptLabelArr[i])
        }
      }
      for (let i = 0; i < ptArr.length; i++) {
        if (ptArr[i][key] !== val) {
          newPtArr.push(ptArr[i])
        }
      }
      ptLabelArr = newPtLabelArr
      ptArr = newPtArr
    },
    /**
     区域物体包括：围栏、区域、人员分布、作业???作业指什么、巡检、四色区，其中人员分布需要显示人数角标
     id: ''
     type: '' // 围栏、区域、人员分布、作业、巡检、四色区
     description: '' // 描述
     children: [{
      fenceID: '',
      points: [{ // 体块顶点坐标
        x: '',
        y: ''
      }, { // 体块顶点坐标
        x: '',
        y: ''
      }],
      minH: '', // 体块最低点高度
      maxH: '', // 体块最高点高度
      color: '', // 体块颜色 'rgba(123,22,30,0.8)' color和opacity合并成rgba
      opacity: '' // 透明度
    }]
     personNum: '' // 区域人数 只在人员分布时使用
     */
    initAreaObjectLoc: function (id, type, description, children, personNum, isTrack) {
      if (personNum === -1) {
        document.getElementById('perNumDiv').style.display = 'none'
      } else {
        document.getElementById('perNumDiv').style.display = 'block'
      }
      let polygObj = {
        id: id,
        type: type,
        description: description,
        children: children,
        personNum: personNum,
        isTrack: isTrack
      }
      polygonArr.push(polygObj)
      // 初始面物体化逻辑
      this._initAreaObjectLoc(polygObj)
    },
    clickPolgyonCallBack: function (outId, id, type) {
      document.getElementById('clickPolygonDiv').style.display = 'block'
      this.$refs.gisPolygon.init(outId, id, type)
      this.$emit('clickObject', outId, id, type)
    },
    _initAreaObjectLoc: function (polygObj) {
      this._addPolygonToViewer(polygObj)
    },
    /*
    移除区域物体
    */
    removeAreaObjectLoc: function (type, ids) {
      document.getElementById('perNumDiv').style.display = 'none'
      let tmp = this
      if (type) {
        for (let i = 0; i < boxArr.length; i++) {
          if (boxArr[i].type === type) {
            tmp.viewer.entities.remove(boxArr[i])
          }
        }
      } else {
        if (ids && ids.length > 0) {
          for (let i = 0; i < ids.length; i++) {
            tmp.viewer.entities.remove(ids[i])
          }
        }
      }
    },
    /**
     * 更新体块坐标
     */
    updateAreaObjectLoc (id, locs) {
      try {
        this.viewer.entities.getById(id).polygon.hierarchy = window.Cesium.Cartesian3.fromDegreesArray(locs)
        return true
      } catch (error) {
        return false
      }
    },
    /**
     * 添加点到viewer
     * @param {String} imgUrl
     * @param {Object} ptObj
     */
    _addPtToViewer: function (ptObj) {
      // TODO 把icon 改为Z,同时修改封装脚本
      // HX3D.Entities.addPtCluster(
      //   HX3D.lonlatCenter,
      //   dataSource,
      //   ptObj.x,
      //   ptObj.y,
      //   ptObj.z,
      //   ptObj.icon,
      //   ptObj.type,
      //   ptObj.id,
      //   ptObj.scale
      // )
      // if (ptObj.name) {

      // 人、车、信标、基站 Z由楼层转实际高度(目前是直接乘系数)
      if (['person', 'car', 'beacon', 'base_station'].indexOf(ptObj.type) !== -1) {
        ptObj.z = (Number(ptObj.z) - 1) * 3.5
      }

      let label = HX3D.Entities.addPtLabel(
        HX3D.lonlatCenter,
        this.viewer,
        ptObj.x,
        ptObj.y,
        ptObj.z,
        ptObj.name,
        ptObj.nameStyle,
        // 另一种方式
        ptObj.icon,
        ptObj.type,
        ptObj.id,
        ptObj.scale,
        ptObj.amination,
        ptObj.aminationObj
      )
      ptLabelArr.push(label)
      // }
    },
    _addPolygonToViewer: function (polygonObj) {
      let tmp = this
      // 添加box
      // 因为一个区域里有多个面
      let isShowPopUp = false
      for (let i = 0; i < polygonObj.children.length; i++) {
        if (i === 0) {
          isShowPopUp = true
        }
        let box = HX3D.Entities.addBox(
          HX3D.lonlatCenter,
          tmp.viewer,
          polygonObj.children[i].fenceID,
          polygonObj.type,
          polygonObj.personNum,
          polygonObj.children[i].points,
          polygonObj.children[i].color,
          polygonObj.children[i].minH,
          polygonObj.children[i].maxH,
          isShowPopUp,
          polygonObj.id,
          tmp,
          polygonObj.isTrack
        )
        // 往box数组中添加
        boxArr.push(box)
      }
    },
    /**
     * 类eval方法
     * @param {String} 字符串
     */
    _eval: function (fn) {
      var Fn = Function
      return new Fn('return ' + fn)()
    },
    /**
     * 判断是否已经存在
     * @param {Array} ptArr
     * @param {String} id 属性key
     */
    _isInPtArr1: function (_ptArr, key, val) {
      var newPtArr = []
      for (let i = 0, l = _ptArr.length; i < l; i++) {
        if (_ptArr[i][key] !== val) {
          newPtArr.push(_ptArr[i])
        }
      }
      return newPtArr
    },
    /**
     * 判断是否已经存在
     * @param {Array} ptArr
     * @param {String} id 属性key
     */
    _isInPtArr: function (ptArr, key, val) {
      for (let i = 0, l = ptArr.length; i < l; i++) {
        if (ptArr[i][key] === val) {
          //        if (ptArr[i].id === id) {
          return i
        }
      }
      return -1
    },
    createData: function (gross) {
      let max = 0
      let points = []
      for (; gross > 0; gross--) {
        let val = Math.floor(Math.random() * 100)
        max = Math.max(max, val)
        let point = {
          'lat': Math.random() * 0.008 + 31.935756,
          'lng': Math.random() * 0.008 + 120.094579
        }
        points.push(point)
      }
      return points
    },
    resetAnyThing () { // 退出地图时清理这些 以免对insertOrUpdate方法产生影响
      ptArr = [] // 点物体数组
      ptLabelArr = [] // 点物体label数组
      polygonArr = [] // 面物体数组
      boxArr = [] // 面box数组
    }
  }
}
</script>

<style lang='scss' scoped>
.cesium-container {
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
