/* eslint-disable no-unused-vars */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { MapControls } from 'three/examples/jsm/controls/MapControls'
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Sky } from 'three/examples/jsm/objects/Sky'
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'

import { Line2 } from 'three/examples/jsm/lines/Line2'
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial'
import { LineGeometry } from 'three/examples/jsm/lines/LineGeometry'

import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'

import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter'

import TWEEN from '@tweenjs/tween.js'

export const APP = {

  Player: function (vue) {
    var camera, scene, renderer, labelRenderer
    var sky, sunSphere
    let _w, _h
    const clock = new THREE.Clock() // ##
    var cameraControls // ##
    // 选取物体效果: https://blog.csdn.net/qq_30100043/article/details/79054862
    var MeshObjects
    var Mixers = []
    var raycaster = new THREE.Raycaster() // 声明raycaster和mouse变量
    var mouse = new THREE.Vector2()
    var composer, effectFXAA, outlinePass // 效果器 渲染 描边

    var keyboard = {} // 收集wsad键
    var events = {} // 收集键盘鼠标各种事件

    let offsetX = 0
    let offsetY = 0

    var dom = document.createElement('div')

    this.dom = dom

    this.width = _w = 500
    this.height = _w = 500

    this.cp = {
      x: 350,
      y: 350,
      z: 350
    } // 相机位置
    this.ct = {
      x: 150,
      y: 0,
      z: 0
    } // 相机中心点

    let renderMode = 'normal' // 渲染器模式 normal:正常模式，composer:后处理模式

    let loaderGltf = new GLTFLoader()
    let exporterGLTF = new GLTFExporter()

    function initSky () { // 加载天空背景
      // Add Sky
      sky = new Sky()
      sky.scale.setScalar(450000)
      scene.add(sky)

      // Add Sun Helper
      sunSphere = new THREE.Mesh(
        new THREE.SphereBufferGeometry(20000, 16, 8),
        new THREE.MeshBasicMaterial({
          color: 0xffffff
        })
      )
      sunSphere.position.y = -700000
      sunSphere.visible = false
      scene.add(sunSphere)

      /// GUI

      var effectController = {
        turbidity: 10,
        rayleigh: 2,
        mieCoefficient: 0.005,
        mieDirectionalG: 0.8,
        luminance: 1,
        inclination: 0.8, // elevation / inclination
        azimuth: 0.77, // Facing front,
        sun: !true
      }

      var distance = 400000

      function guiChanged () {
        var uniforms = sky.material.uniforms
        uniforms['turbidity'].value = effectController.turbidity
        uniforms['rayleigh'].value = effectController.rayleigh
        uniforms['luminance'].value = effectController.luminance
        uniforms['mieCoefficient'].value = effectController.mieCoefficient
        uniforms['mieDirectionalG'].value = effectController.mieDirectionalG

        var theta = Math.PI * (effectController.inclination - 0.5)
        var phi = 2 * Math.PI * (effectController.azimuth - 0.5)

        sunSphere.position.x = distance * Math.cos(phi)
        sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta)
        sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta)

        sunSphere.visible = effectController.sun

        uniforms['sunPosition'].value.copy(sunSphere.position)

        renderer.render(scene, camera)
      }

      guiChanged()
    }

    var time, prevTime

    function animate () {
      time = performance.now()

      try {
        if (Mixers.length > 0) {
          for (var i = 0; i < Mixers.length; ++i) {
            Mixers[i].update(clock.getDelta()) // clock.getDelta()
          }
        }
        dispatch(events.update, {
          time: time,
          delta: time - prevTime
        })
      } catch (e) {
        console.error((e.message || e), (e.stack || ''))
      }

      cameraControls.update(clock.getDelta()) // ##
      // cameraControls.enabled = false
      // firstPersonControl()
      TWEEN.update()

      if (renderMode === 'normal') {
        renderer.render(scene, camera) // 普通渲染模式
      } else {
        composer.render(scene, camera) // 后处理渲染模式
      }

      if (labelRenderer) {
        labelRenderer.render(scene, camera)
      }

      prevTime = time
    }

    function dispatch (array, event) {
      for (var i = 0, l = array.length; i < l; i++) {
        array[i](event)
      }
    }

    function firstPersonControl (speed = 0.5, turnSpeed = Math.PI * 0.02) { // 第一人称控制 请先将视角朝向z轴负方向 // https://github.com/saucecode/threejs-demos
      if (keyboard[87]) { // W key
        camera.position.x -= Math.sin(camera.rotation.y) * speed
        camera.position.z -= -Math.cos(camera.rotation.y) * speed
      }
      if (keyboard[83]) { // S key
        camera.position.x += Math.sin(camera.rotation.y) * speed
        camera.position.z += -Math.cos(camera.rotation.y) * speed
      }
      if (keyboard[65]) { // A key
        camera.position.x += Math.sin(camera.rotation.y + Math.PI / 2) * speed
        camera.position.z += -Math.cos(camera.rotation.y + Math.PI / 2) * speed
      }
      if (keyboard[68]) { // D key4
        camera.position.x += Math.sin(camera.rotation.y - Math.PI / 2) * speed
        camera.position.z += -Math.cos(camera.rotation.y - Math.PI / 2) * speed
      }

      if (keyboard[81]) { // q key
        camera.rotation.y -= turnSpeed
      }
      if (keyboard[69]) { // e key
        camera.rotation.y += turnSpeed
      }
    }

    function clearCache (obj) { // 清除缓存
      if (obj.type === 'Mesh' || obj.type === 'Object') {
        obj.geometry.dispose()
        obj.material.dispose()
      } else if (obj.type === 'Group') {
        obj.children.map(res => {
          if (res.type === 'Mesh' || obj.type === 'Object') {
            res.geometry.dispose()
            res.material.dispose()
          } else {
            clearCache(res) // 多层递归
          }
        })
      }
    }

    this.load = function (json) { // 加载模型数据
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        logarithmicDepthBuffer: true
      })
      renderer.gammaOutput = true
      renderer.setClearColor(0x000000)
      renderer.setPixelRatio(window.devicePixelRatio)

      dom.appendChild(renderer.domElement)

      labelRenderer = new CSS2DRenderer()
      labelRenderer.setSize(_w, _h)
      labelRenderer.domElement.style.position = 'absolute'
      labelRenderer.domElement.style.top = 0
      labelRenderer.domElement.id = 'labelRenderer'
      dom.appendChild(labelRenderer.domElement)

      this.setScene(json.type === 'Object3D' ? json : json.scene, 'gltf')
      camera = new THREE.PerspectiveCamera(45, _w / _h, 0.25, 10000)
      camera.position.set(this.cp.x, this.cp.y, this.cp.z)
      this.setCamera()
      cameraControls.target.set(this.ct.x, this.ct.y, this.ct.z)

      this.setpostprocess() // 初始化后处理模式

      events = {
        init: [],
        start: [],
        stop: [],
        keydown: [],
        keyup: [],
        mousedown: [],
        dblclick: [],
        mouseup: [],
        mousemove: [],
        touchstart: [],
        touchend: [],
        touchmove: [],
        update: []
      }

      dispatch(events.init, arguments)

      initSky()
    }

    this.reLoad = function (json) { // 重新加载模型
      scene.remove(scene.getObjectByName('worldScene'))
      scene.remove(scene.getObjectByName('realTimePerson'))
      json.name = 'worldScene'
      scene.add(json.type === 'Object3D' ? json : json.scene)
    }

    this.exporter = function (json, name = 'scene') { // 导出模型方法
      if (json && json.name) {
        name = json.name
      } else {
        return
      }
      let link = document.createElement('a')
      link.style.display = 'none'
      document.body.appendChild(link)
      const save = (blob, filename) => {
        link.href = URL.createObjectURL(blob)
        link.download = filename
        link.click()
      }
      const saveArrayBuffer = (buffer, filename) => {
        save(new Blob([buffer], { type: 'application/octet-stream' }), filename)
      }
      const saveString = (text, filename) => {
        save(new Blob([text], { type: 'text/plain' }), filename)
      }
      exporterGLTF.parse(json, (result) => {
        if (result instanceof ArrayBuffer) {
          saveArrayBuffer(result, name + '.glb')
        } else {
          let output = JSON.stringify(result, null, 2)
          saveString(output, name + '.gltf')
        }
      })
    }

    var cacheMaterialList = {} // 缓存材质 用于恢复透明
    /**
     * 设置物体透明
     * @param object {Object3D} 物体
     * @param op {Number} 透明度
     * @param col {Number} 透明度
     * @param ignore {Boolean} 是否忽略楼板
     */
    this.setOpacity = function (object, op = 0.4, col = 0x003c9a, ignore) { // 设置透明
      var opacityM = new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: op
      }) // 创建透明材质
      const setOp = (obj) => {
        if (obj.type === 'Object3D' || obj.type === 'Group') {
          if (obj.children.length > 0) {
            obj.children.map(child => {
              setOp(child)
            })
          }
        } else if (obj.type === 'Mesh') {
          if (ignore) {
            if (!obj.name.endsWith('_lb') && obj.name.indexOf('_lb_') === -1) {
              cacheMaterialList[obj.uuid] = obj.material // 缓存材质
              obj.material = opacityM
            }
          } else {
            cacheMaterialList[obj.uuid] = obj.material // 缓存材质
            obj.material = opacityM
          }
        }
      }
      setOp(object)
    }

    this.removeOpacity = function (object) { // 移除透明
      const removeOp = (obj) => {
        if (obj.type === 'Object3D' || obj.type === 'Group') {
          if (obj.children.length > 0) {
            obj.children.map(child => {
              removeOp(child)
            })
          }
        } else if (obj.type === 'Mesh') {
          if (cacheMaterialList[obj.uuid]) {
            obj.material = cacheMaterialList[obj.uuid] // 恢复材质
            cacheMaterialList[obj.uuid] = undefined
          }
        }
      }
      removeOp(object)
    }

    this.getGltfLoader = () => { // 获取GltfLoader实例
      return loaderGltf
    }
    this.getGLTFExporter = () => { // 获取GLTFExporter实例
      return exporterGLTF
    }

    this.createVector3 = (arr) => { // 创建Vector3
      if (arr) {
        return new THREE.Vector3(...arr)
      } else {
        return new THREE.Vector3()
      }
    }

    this.setCamera = function (value) { // 设置相机
      if (value) {
        camera = value
        camera.aspect = this.width / this.height
        camera.updateProjectionMatrix()
      }
      cameraControls = new MapControls(camera, labelRenderer.domElement) // ##

      // 使动画循环使用时阻尼或自转 意思是否有惯性
      cameraControls.enableDamping = false
      // 使动画循环使用时阻尼或自转 意思是否有惯性
      cameraControls.enableDamping = false
      // 动态阻尼系数 就是鼠标拖拽旋转灵敏度
      cameraControls.dampingFactor = 0.25
      // 是否可以缩放
      cameraControls.enableZoom = true
      // 是否自动旋转
      cameraControls.autoRotate = false
      // 设置相机距离原点的最近距离
      cameraControls.minDistance = 10
      // 设置相机距离原点的最远距离
      cameraControls.maxDistance = 600
      // 是否开启右键拖拽
      cameraControls.enablePan = true
      // 限制旋转角度 Math.PI * 0.495
      cameraControls.maxPolarAngle = Math.PI * 0.495
    }

    this.moveCamera = function (val, distance = 40) { // 移动相机（根据物体名称或者直接传入物体）
      let p = null
      if (typeof val === 'string') {
        p = scene.getObjectByName(val).getWorldPosition()
      } else if (typeof val === 'object') {
        p = val
      } else {
        return
      }
      return this.cameraMotion(p.x, p.y + distance, p.z + distance, p.x, p.y, p.z) // 返回上一位置
    }

    this.cameraMotion = function (x, y, z, tarx = 0, tary = 0, tarz = 0, fun) { // 相机缓动
      let cache = {
        position: camera.position.clone(),
        target: cameraControls.target.clone()
      } // 缓存位置
      var tween = new TWEEN.Tween({
        x1: camera.position.x, // 相机当前位置x
        y1: camera.position.y, // 相机当前位置y
        z1: camera.position.z, // 相机当前位置z
        x2: cameraControls.target.x, // 控制当前的中心点x
        y2: cameraControls.target.y, // 控制当前的中心点y
        z2: cameraControls.target.z // 控制当前的中心点z
      })
      tween.to({
        x1: x,
        y1: y,
        z1: z,
        x2: tarx,
        y2: tary,
        z2: tarz
      }, 1000)
      tween.onUpdate(function (object) {
        camera.position.x = object.x1
        camera.position.y = object.y1
        camera.position.z = object.z1
        cameraControls.target.x = object.x2
        cameraControls.target.y = object.y2
        cameraControls.target.z = object.z2
        cameraControls.update()
      })
      tween.onComplete(function () {
        cameraControls.enabled = true
        if (fun) {
          fun()
        }
      })
      tween.easing(TWEEN.Easing.Exponential.InOut)
      tween.start()
      return cache // 返回上一位置
    }

    this.getCameraLocation = function () { // 获取相机位置
      this.cp = JSON.parse(JSON.stringify(camera.position))
      this.ct = JSON.parse(JSON.stringify(cameraControls.target))
      return [camera.position, cameraControls.target]
    }

    this.getCameraControls = function () { // 获取相机控制器实例
      return cameraControls
    }

    this.getCamera = function () { // 获取相机实例
      return camera
    }

    this.resetCamera = function (cp = {
      x: 350,
      y: 350,
      z: 350
    }, ct = {
      x: 350,
      y: 0,
      z: 0
    }) { // 重置相机位置
      var tween = new TWEEN.Tween({
        x1: camera.position.x, // 相机当前位置x
        y1: camera.position.y, // 相机当前位置y
        z1: camera.position.z, // 相机当前位置z
        x2: cameraControls.target.x, // 控制当前的中心点x
        y2: cameraControls.target.y, // 控制当前的中心点y
        z2: cameraControls.target.z // 控制当前的中心点z
      })
      tween.to({
        x1: this.cp.x,
        y1: this.cp.y,
        z1: this.cp.z,
        x2: this.ct.x,
        y2: 0,
        z2: this.ct.z
      }, 1000)
      tween.onUpdate(function (object) {
        camera.position.x = object.x1
        camera.position.y = object.y1
        camera.position.z = object.z1
        cameraControls.target.x = object.x2
        cameraControls.target.y = object.y2
        cameraControls.target.z = object.z2
        cameraControls.update()
      })
      tween.onComplete(function () {
        cameraControls.enabled = true
      })
      tween.easing(TWEEN.Easing.Exponential.InOut)
      tween.start()
    }

    this.setScene = function (value, type) { // 设置场景
      if (type !== undefined || type != null || type === 'gltf') {
        scene = new THREE.Scene()
        value.name = 'worldScene'
        scene.add(value)

        // eslint-disable-next-line camelcase
        var d_light = new THREE.DirectionalLight('#797979')
        d_light.position.set(5, 10, 7)
        scene.add(d_light)

        var ambientLight = new THREE.AmbientLight('#797979')
        scene.add(ambientLight)

        var pointLight = new THREE.PointLight('#eec97b')
        pointLight.position.set(0, 460, 0)
        scene.add(pointLight)
      } else {
        scene = value
      }
      // scene.background = new THREE.Color(0x263238)
      // 将地面放入需要选点的模型数组中
      MeshObjects = []
      let dx = scene.getObjectByName('dx')
      if (dx) {
        MeshObjects = (dx.children.concat(scene.getObjectByName('cj').children))
      }
      // MeshObjects.push(scene.getObjectByName('dm'))
    }

    this.getScene = function () { // 获取场景实例
      return scene
    }

    this.setpostprocess = function () { // 设置后处理
      composer = new EffectComposer(renderer)

      var renderPass = new RenderPass(scene, camera)
      composer.addPass(renderPass)

      outlinePass = new OutlinePass(new THREE.Vector2(this.width, this.height), scene, camera)
      outlinePass.edgeStrength = 3.0
      outlinePass.edgeGlow = 1
      outlinePass.edgeThickness = 3.0
      outlinePass.pulsePeriod = 3
      outlinePass.visibleEdgeColor.set('#dcd241')
      outlinePass.hiddenEdgeColor.set('#25230b')
      composer.addPass(outlinePass)

      effectFXAA = new ShaderPass(FXAAShader)
      effectFXAA.uniforms['resolution'].value.set(1 / this.width, 1 / this.height)
      effectFXAA.renderToScreen = true

      // let pass = new SMAAPass(this.width * renderer.getPixelRatio(), this.height * renderer.getPixelRatio())
      composer.addPass(effectFXAA)
    }

    this.showOutLine = function (object) { // 设置物体描边
      outlinePass.selectedObjects = object
    }

    this.changeRenderMode = function (mode = 'normal') { // 切换渲染器模式 normal:正常模式，composer:后处理模式
      renderMode = mode
    }

    this.setSize = function (width, height, offX, offY) { // 设置显示区域大小
      this.width = _w = width
      this.height = _h = height

      offsetX = offX
      offsetY = offY

      if (camera) {
        camera.aspect = this.width / this.height
        camera.updateProjectionMatrix()
      }

      if (renderer) {
        renderer.setSize(width, height)
        labelRenderer.setSize(width, height)
        composer.setSize(width, height)
        composer.passes[2].uniforms['resolution'].value.set(1 / width, 1 / height)
      }
    }

    this.play = function (document) { // 开始动画渲染
      prevTime = performance.now()

      window.addEventListener('keydown', onDocumentKeyDown)
      window.addEventListener('keyup', onDocumentKeyUp)
      document.addEventListener('mousedown', onDocumentMouseDown)
      document.addEventListener('dblclick', onDocumentDblClick)
      document.addEventListener('mouseup', onDocumentMouseUp)
      document.addEventListener('mousemove', onDocumentMouseMove)
      document.addEventListener('touchstart', onDocumentTouchStart)
      document.addEventListener('touchend', onDocumentTouchEnd)
      document.addEventListener('touchmove', onDocumentTouchMove)

      dispatch(events.start, arguments)

      renderer.setAnimationLoop(animate)
    }

    this.stop = function () { // 停止动画渲染
      window.removeEventListener('keydown', onDocumentKeyDown)
      window.removeEventListener('keyup', onDocumentKeyUp)
      document.removeEventListener('mousedown', onDocumentMouseDown)
      document.removeEventListener('dblclick', onDocumentDblClick)
      document.removeEventListener('mouseup', onDocumentMouseUp)
      document.removeEventListener('mousemove', onDocumentMouseMove)
      document.removeEventListener('touchstart', onDocumentTouchStart)
      document.removeEventListener('touchend', onDocumentTouchEnd)
      document.removeEventListener('touchmove', onDocumentTouchMove)

      dispatch(events.stop, arguments)

      renderer.setAnimationLoop(null)
    }

    this.dispose = function () {
      while (dom.children.length) {
        dom.removeChild(dom.firstChild)
      }

      renderer.dispose()

      camera = undefined
      scene = undefined
      renderer = undefined
    }

    var CallbackFuns = {}
    this.mountCallbackFun = function (val) { // 挂载回调函数
      CallbackFuns = val
    }

    this.selectPoint = function (location, index = 1, pointNum = [3, 100]) { // 选点阵
      var group = scene.getObjectByName('latticeInEdit') // 获取点阵存放的组
      if (!group) {
        group = new THREE.Group() // 创建组
        group.name = 'latticeInEdit'
      } else {
        if (pointNum[0] === pointNum[1] && group.children.length === pointNum[0]) {
          let num = parseInt(group.children[0].children.length)
          for (let i = 0; i < num; i++) {
            group.children[0].remove(group.children[0].children[0])
          }
          group.remove(group.children[0]) // 当选择的点超出限制后 移除第一位
        }
      }
      var objectStart = new THREE.Mesh(new THREE.BoxBufferGeometry(10, 10, 10), new THREE.MeshLambertMaterial({
        // color: Math.random() * 0xffffff
      })) // 起始点模型 Math.random() * 0xffffff
      objectStart.name = 'pointNode_' + index
      objectStart.target = 'pointMesh'
      objectStart.material.transparent = true
      objectStart.material.opacity = 0
      objectStart.position.set(location.x, location.y, location.z)
      this.loadCss2dImg(objectStart, 'data:image/png;base64,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')
      group.add(objectStart)
      group.type = 'points'
      scene.add(group)
    }

    this.clearPoint = function (name) { // 清除点阵
      let groups = []
      let object
      if (name) { // 精准删除
        object = scene.getObjectByName(name)
      } else {
        groups = scene.getObjectsByProperty('type', 'points') // 获取点阵存放的组
        object = scene.getObjectByName('latticeInEdit')
      }
      if (object) {
        groups.push(object)
      }
      groups.map(group => {
        if (group) {
          group.children.map(mesh => {
            mesh.children.map(res => {
              let num = mesh.children.length
              for (let i = 0; i < num; i++) {
                mesh.remove(mesh.children[0])
              }
            })
          })
          scene.remove(group)
        }
      })
    }

    this.drawLine = function (p1, p2) { // 绘制线条
      var group = scene.getObjectByName('latticeInEdit') // 获取点阵存放的组
      let positions = []
      let colors = []
      let points = []
      points.push(p1)
      points.push(p2)
      var spline = new THREE.CatmullRomCurve3(points)
      var divisions = Math.round(12 * points.length)
      var color = new THREE.Color()
      for (var i = 0, l = divisions; i < l; i++) {
        var point = spline.getPoint(i / l)
        positions.push(point.x, point.y, point.z)
        color.setHSL(0.5, 1.0, 0.5)
        colors.push(color.r, color.g, color.b)
      }
      var geometry = new LineGeometry()
      geometry.setPositions(positions)
      geometry.setColors(colors)

      let matLine = new LineMaterial({
        color: 0x4080ff,
        linewidth: 0.0035, // in pixels
        vertexColors: THREE.VertexColors,
        // resolution:  // to be set by renderer, eventually
        dashed: false
      })

      let line = new Line2(geometry, matLine)
      line.computeLineDistances()
      line.scale.set(1, 1, 1)
      line.target = 'pointMesh'
      group.add(line)
      scene.add(group)
    }

    this.displayObjects = function (arr, closeType, visType) { // 加载多个物体(若存在则替换)
      let object = scene.getObjectByName(arr.typeName)
      if (object) { // 如果物体集合已存在 则先删除
        this.displayShowOrHideObjects(arr.typeName, false)
        clearCache(object) // 清除缓存
        scene.remove(object) // 移除物体
      }
      let group = new THREE.Group()
      group.name = arr.typeName
      arr.point.map(r => {
        let object = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshLambertMaterial({}))
        object.material.transparent = true
        object.material.opacity = 0
        object.position.set(Number(r.x) || 0, Number(r.y) || 0, Number(r.z) || 0)
        this.loadCss2dImg(object, arr.iconBase64, () => {
          object.children.map(css2d => {
            css2d.visible = true
          })
        }, arr.iconSize, arr.iconOffset)
        // object.children.map(m => {
        //   m.visible = visType // 默认 隐藏/显示 图标
        // })
        this.loadCss2dHtml(object, r.data, r.name, r.cnName, r.id, arr.fun, closeType, undefined, visType)
        group.add(object)
      })
      group.type = 'points'
      scene.add(group)
    }

    this.displayShowOrHideObjects = function (name) { // 控制 隐藏/显示 的多个物体
      let object = scene.getObjectByName(name)
      object.children.map(obj => {
        let num = parseInt(obj.children.length)
        for (let i = 0; i < num; i++) {
          obj.remove(obj.children[0])
        }
      })
    }

    /**
     * 插入或更新点物体 2020/01/03
     * @param id {String} 物体id
     * @param text {String} 物体名称
     * @param type {String} 物体类型
     * @param position {Array} 图标承载的3d对象 这里传入前无需转换成threejs坐标顺序（即 x, z, y） 此后新增的接口也按照（x, y, z） 旧接口酌情修改
     * @param base64 {String} 图标的Base64数据流
     * @param fun {Function} 点击图标的回调函数
     * @param size {Number} 图片大小
     * @param offset {Number} 图片偏移度 正向上 负向下
     * @return void
     */
    this.insertOrUpdatePoint = (id, text, type, position, base64, fun) => {
      if (!scene) return
      let object = scene.getObjectByName(id)
      if (object) { // 已存在物体 执行更新操作
        object.position.set(...position.toThree())
      } else {
        let group = scene.getObjectByName(type)
        if (!group) { // 没有该类型分组 则新建一个
          group = new THREE.Group()
          group.name = type
          scene.add(group)
        }
        object = new THREE.Mesh(new THREE.BoxBufferGeometry(0.01, 0.01, 0.01), new THREE.MeshLambertMaterial({}))
        object.name = id
        object.position.set(...position.toThree())
        this.loadCss2dImg(object, base64, fun)
        this.loadCss2dText(object, text, 14, 36)
        group.add(object)
      }
    }

    /**
     * 根据ids或者type类型删除点物体
     */
    this.removePoint = (ids, type) => {
      if (ids) {
        if (typeof (ids) === 'string') {
          this.removeObject(ids)
        } else if (typeof (ids) === 'object') {
          ids.map(id => {
            this.removeObject(id)
          })
        }
      }
      if (type) {
        let group = scene.getObjectByName(type)
        if (group) {
          let length = group.children.length
          for (let i = 0; i < length; i++) {
            this.removeObject(group.children[0])
          }
        }
      }
    }

    /**
     * 删除物体具体实现
     */
    this.removeObject = (object) => {
      if (!object) return false
      if (typeof (object) === 'string') {
        object = scene.getObjectByName(object)
      }
      if (!object) return false
      object.children.map(res => {
        let num = object.children.length
        for (let i = 0; i < num; i++) {
          object.remove(object.children[0])
        }
      })
      if (object.parent) {
        object.parent.remove(object)
      } else {
        scene.remove(object)
      }
      return true
    }

    /**
     * 加载css2d型的图标
     * @param obj {Object3D} 图标承载的3d对象
     * @param base64 {String} 图标的Base64数据流
     * @param fun {Function} 点击图标的回调函数
     * @param size {Number} 图片大小
     * @param offset {Number} 图片偏移度 正向上 负向下
     * @return void
     */
    this.loadCss2dImg = function (obj, base64, fun, size = 18, offset = 0) {
      let labelEle
      let labelImg
      if (obj) {
        labelEle = document.createElement('div')
        labelImg = document.createElement('img')
        labelEle.append(labelImg)
        labelImg.src = base64
        labelImg.style.cursor = 'pointer'
        labelImg.style.height = size + 'px'
        if (offset) {
          labelImg.style.transform = 'translate(0, -' + offset + '%)'
        }
        if (fun) {
          labelImg.onclick = fun
        }
      }
      let css2dEle = new CSS2DObject(labelEle)
      css2dEle.name = 'img'
      obj.add(css2dEle)
    }

    /**
     * 加载css2d型的文字
     * @param obj {Object3D} 文字承载的3d对象
     * @param text {String} 文字内容
     * @param fontSize {Number} 文字大小
     * @param fontOffset {Number} 文字偏移度 正向上 负向下
     * @return void
     */
    this.loadCss2dText = function (obj, text, fontSize = 14, fontOffset = 0) {
      let labelEleOut
      let labelEle
      if (obj) {
        labelEleOut = document.createElement('div')
        labelEle = document.createElement('div')
        labelEle.append(text)
        if (fontSize) {
          labelEle.style.fontSize = fontSize + 'px'
          labelEle.style.color = '#000'
          labelEle.style.textShadow = '0 0 10px #fff'
        }
        if (fontOffset) {
          labelEle.style.marginBottom = fontOffset + 'px'
        }
      }
      labelEleOut.append(labelEle)
      let css2dEle = new CSS2DObject(labelEleOut)
      css2dEle.name = 'text'
      obj.add(css2dEle)
    }

    /**
     * 加载css2d型的dom
     * @param obj {Object3D} 文字承载的3d对象
     * @param dom dom对象
     */
    this.loadCss2dDom = function (obj, dom) {
      let labelEleOut = document.createElement('div')
      labelEleOut.append(dom)
      let css2dEle = new CSS2DObject(labelEleOut)
      css2dEle.name = 'billboard'
      obj.add(css2dEle)
    }

    /**
     * 加载css2d型的html信息板
     * @param obj {Object3D} 信息板承载的3d对象
     * @param data {Object} 信息板信息数据
     * @param name {String} 信息板唯一样式 英文
     * @param cnName {String} 信息板标题
     * @param id {String} 唯一标识 也是信息板的id
     * @param fun {Function} 信息板下方的按钮的回调事件 不写则没有按钮
     * @param closeType {Int} 关闭按钮的操作类型 0:不显示关闭按钮||1(默认):销毁整个3d对象||2:仅关闭/销毁信息板自身||3:仅隐藏信息板自身
     * @param animateName {String} 信息板加载动画 从后方网站寻找动画类型 https://daneden.github.io/animate.css/
     * @return void
     * @author Mr.What 2019-11-08
     */
    this.loadCss2dHtml = function (obj, data, name, cnName, id, fun, closeType = 1, animateName = 'bounceIn', visType = true) {
      let labelEle
      if (obj) {
        labelEle = document.createElement('div') // 创建外框容器
        labelEle.className = 'css2d-div-container ' + name

        let labelInner = document.createElement('div') // 创建内框容器 在这一级别做css偏移
        labelInner.className = 'css2d-inner-content'
        labelEle.append(labelInner)

        let labelAnimate = document.createElement('div') // 创建主容器 动画、内容放置在这里
        labelAnimate.className = 'css2d-main-content animated ' + animateName
        labelInner.append(labelAnimate)

        let divTitle = document.createElement('div') // 创建名称div容器
        divTitle.className = 'css2d-title'
        divTitle.innerText = cnName
        labelAnimate.append(divTitle)

        if (closeType !== 0) {
          let divClose = document.createElement('div') // 创建关闭按钮
          divClose.className = 'css2d-close'
          divClose.innerText = '×'
          divClose.onclick = () => {
            // obj.getObjectByName('div').visible = false
            let num = parseInt(obj.children.length)
            let parent = obj.parent

            switch (closeType) {
              case 1: // 销毁整个3d对象
                for (let j1 = 0; j1 < num; j1++) {
                  obj.remove(obj.children[0])
                }
                parent.remove(obj)
                break
              case 2: // 仅关闭/销毁信息板自身
                let divHtml = obj.getObjectByName('div')
                if (divHtml) {
                  obj.remove(divHtml)
                }
                break
              case 3: // 仅隐藏信息板自身
                obj.getObjectByName('div').visible = false
                break
            }
            if (parent.children.length === 0) { // 如果承载对象不存在兄弟元素了 则销毁其父级
              scene.remove(parent)
            }
          }
          divTitle.append(divClose)
        }

        if (data) {
          for (let i in data) {
            let divEle = document.createElement('div')
            divEle.className = 'css2d-item'
            divEle.innerHTML = '<div>' + i + ':</div><div>' + data[i] + '</div>'
            labelAnimate.append(divEle)
          }
        }

        if (typeof (fun) === 'function') {
          let divButton = document.createElement('div') // 创建底部按钮
          divButton.className = 'css2d-button'
          divButton.innerText = '修改'
          divButton.onclick = () => {
            fun(id)
          }
          labelAnimate.append(divButton)
        }
      }
      let css2dEle = new CSS2DObject(labelEle)
      css2dEle.name = 'div'
      css2dEle.up.set(0, 30, 0)
      css2dEle.visible = visType
      obj.add(css2dEle)
    }

    /**
     * 绘制多边形体块 采用挤压几何体的方式
     * @param points {Array} 多边形点阵数组 [[1,0,3],[2,0,4],[4,0,6]] threejs坐标系y轴向上 注意转换
     * @param object {Object3D} 承载物体 若空则创建
     * @param name {String} 体块名称
     * @param minH {FLOAT} 体块底部位置
     * @param maxH {FLOAT} 体块顶部位置
     * @param color {String} 体块颜色
     * @param opacity {FLOAT} 体块透明度
     * @param wire {Boolean} 是否显示线框
     * @return 体块名称
     */
    this.drawExtrudeGeometry = function (points, object, name, minH = 0, maxH = 100, color = 0x00ff00, opacity = 0.5, wire = false) {
      let shape = new THREE.Shape()
      shape.moveTo(points[0][0], points[0][2])
      if (points.length > 0) {
        for (let i = 1; i < points.length; i++) {
          if (points[i].toArray) {
            points[i] = points[i].toArray()
          }
          shape.lineTo(points[i][0], points[i][2])
        }
      }
      shape.lineTo(points[0][0], points[0][2])
      var extrudeSettings = {
        steps: 2,
        depth: -(maxH - minH), // 体块高度
        bevelEnabled: false,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1
      }
      var geometry = new THREE.ExtrudeBufferGeometry(shape, extrudeSettings)
      var material = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide
      })
      material.transparent = true
      material.opacity = opacity

      var mesh
      if (wire) {
        //  创建一个线框纹理
        var wireFrameMat = new THREE.MeshBasicMaterial()
        wireFrameMat.wireframe = true
        mesh = SceneUtils.createMultiMaterialObject(geometry, [material, wireFrameMat])
      } else {
        mesh = new THREE.Mesh(geometry, material)
      }
      mesh.position.y = minH + 0.1 // 防止叠面现象 高度稍微抬高
      mesh.rotation.x = Math.PI / 2

      let group // 新建一个组
      if (!object) {
        group = new THREE.Group()
      } else {
        group = object
      }
      group.add(mesh)
      group.name = name || group.uuid
      group.type = 'ExtrudeGeometry'

      // 创建一个billboard 暂时不实现 勿删 2019-11-14
      // let centerPoint = this.getPolygonAreaCenter(points) // 获取体块重心
      // let centerMesh = new THREE.Mesh()
      // centerMesh.name = 'centerMesh'
      // centerMesh.position.set(...centerPoint)
      // this.loadCss2dHtml(centerMesh, {}, 'billboard', '信息板', null, null, 0)
      // group.add(centerMesh)

      scene.add(group)
    }

    this.clearExtrudeGeometry = function (name) { // 清除体块
      let objects
      if (name) {
        objects = [scene.getObjectByName(name)]
      } else {
        objects = scene.getObjectsByProperty('type', 'ExtrudeGeometry')
      }
      if (objects) {
        objects.map(res => {
          if (res) {
            scene.remove(res)
          }
        })
      }
    }

    /**
     * 绘制轨迹
     * Date: 2020-01-07 23:20
     * @param trackList {Array} 轨迹数组
     * @param index {Int}} 绘制到的节点
     */
    let trackListChache = []
    this.initTrack = function (index, trackList, id, text, base64) {
      if (trackList) {
        trackListChache = trackList
      } else if (trackListChache) {
        trackList = trackListChache
      } else {
        return
      }
      let positions = []
      let colors = []
      for (let i = 0; i <= index; i++) {
        positions.push(...trackList[i].toThree())
        colors.push(1, 1, 0)
      }
      let group = scene.getObjectByName('trackLineGroup')
      if (!group) {
        group = new THREE.Group()
        group.name = 'trackLineGroup'
        scene.add(group)
      }
      let geometry = new LineGeometry()
      geometry.setPositions(positions)
      geometry.setColors(colors)
      let line = group.getObjectByName('trackLine')
      if (!line) {
        let matLine = new LineMaterial({
          color: 0xffffff,
          linewidth: 0.003, // in pixels
          vertexColors: THREE.VertexColors,
          // resolution:  // to be set by renderer, eventually
          dashed: true
        })
        line = new Line2(geometry, matLine)
        line.name = 'trackLine'
        line.computeLineDistances()
        line.scale.set(1, 1, 1)
        group.add(line)
      } else {
        line.geometry = geometry
      }
      let point = group.getObjectByName('trackPoint')
      if (!point) {
        point = new THREE.Mesh(new THREE.BoxBufferGeometry(0.01, 0.01, 0.01), new THREE.MeshLambertMaterial({}))
        point.name = 'trackPoint'
        this.loadCss2dImg(point, base64, null)
        this.loadCss2dText(point, text, 14, 36)
        group.add(point)
      }
      point.position.set(...trackList[index].toThree())
    }
    this.removeTrack = function () { // 移除轨迹
      trackListChache = []
      let group = scene.getObjectByName('trackLineGroup')
      if (group) {
        let point = group.getObjectByName('trackPoint')
        if (point) {
          let num = point.children.length
          for (let i = 0; i < num; i++) {
            point.remove(point.children[0])
          }
        }
        scene.remove(group)
      }
    }

    this.getPolygonAreaCenter = function (points) { // 获取多边形重心 threejs坐标系
      var sumX = 0
      var sumZ = 0
      var sumArea = 0
      var p1 = points[1]
      var sumY = points[0][1] + points[1][1] // z周总和
      for (var i = 2; i < points.length; i++) {
        let p2 = points[i]
        let area = Area(points[0], p1, p2)
        sumArea += area
        sumX += (points[0][0] + p1[0] + p2[0]) * area
        sumZ += (points[0][2] + p1[2] + p2[2]) * area
        p1 = p2
        sumY = sumY + p2[1]
      }
      var xx = sumX / sumArea / 3
      var zz = sumZ / sumArea / 3
      var centerPoint = [xx, sumY / points.length, zz]
      return centerPoint // 返回重心
      function Area (p0, p1, p2) {
        var area = 0.0
        area = p0[0] * p1[2] + p1[0] * p2[2] + p2[0] * p0[2] - p1[0] * p0[2] - p2[0] * p1[2] - p0[0] * p2[2]
        return area / 2
      }
    }

    function getPoint (event) { // 获取坐标
      // 通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
      mouse.x = ((event.clientX - offsetX) / _w) * 2 - 1
      mouse.y = -((event.clientY - offsetY) / _h) * 2 + 1

      // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
      raycaster.setFromCamera(mouse, camera)

      // 获取raycaster直线和所有模型相交的数组集合
      let intersects = raycaster.intersectObjects(MeshObjects, true)
      return intersects
    }

    function onDocumentKeyDown (event) {
      // dispatch(events.keydown, event)
      keyboard[event.keyCode] = true
    }

    function onDocumentKeyUp (event) {
      // dispatch(events.keyup, event)
      keyboard[event.keyCode] = false
    }

    function onDocumentMouseDown (event) { // 鼠标点击事件
      dispatch(events.mousedown, event)

      var intersects = getPoint(event) // 射线击中的物体集合

      if (intersects.length > 0) {
        let point = intersects[intersects.length - 1].point
        if (CallbackFuns.mouseClick) {
          CallbackFuns.mouseClick(point, event, intersects[0]) // intersects[0] 射线最初接触到的
        }
      } else { }
    }

    function onDocumentDblClick (event) {
      dispatch(events.dblclick, event)

      var intersects = getPoint(event) // 射线击中的物体集合

      if (intersects.length > 0) {
        if (CallbackFuns.mouseClick) {
          CallbackFuns.dblClick(intersects[0].object)
        }
      } else { }
    }

    function onDocumentMouseUp (event) {
      dispatch(events.mouseup, event)
    }

    function onDocumentMouseMove (event) {
      dispatch(events.mousemove, event)

      var intersects = getPoint(event) // 射线击中的物体集合
      if (intersects.length > 0) {
        let point = intersects[intersects.length - 1].point
        if (CallbackFuns.mouseMove) {
          CallbackFuns.mouseMove(point, intersects[0].object) // point：鼠标在地面上的实时坐标，intersects[0]：鼠标所指的第一个物体
        }
      } else { }
    }

    function onDocumentTouchStart (event) {
      dispatch(events.touchstart, event)
    }

    function onDocumentTouchEnd (event) {
      dispatch(events.touchend, event)
    }

    function onDocumentTouchMove (event) {
      dispatch(events.touchmove, event)
    }
  }

}

THREE.Object3D.prototype.getObjectsByProperty = function (name, value) {
  var objects = []
  if (this[name] === value) return this

  for (var i = 0, l = this.children.length; i < l; i++) {
    var child = this.children[i]
    var object = child.getObjectByProperty(name, value)

    if (object !== undefined) {
      objects.push(object)
    }
  }

  return objects
}

// eslint-disable-next-line no-extend-native
Array.prototype.toThree = function () {
  if (this == null) {
    throw new TypeError()
  }
  var t = Object(this)
  if (t.length !== 3) {
    throw new TypeError()
  }
  let result = [Number(t[0]), Number(t[2]), Number(t[1])]
  return result
}
