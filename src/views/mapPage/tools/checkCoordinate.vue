<!--
 * @Descripttion: 
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-12-27 15:24:43
 * @LastEditors  : Mr.What
 * @LastEditTime : 2019-12-31 14:50:35
 -->
<template>
  <div class="cesium-check-coordinate-container">
    <message-layout height="300px" name="坐标校准" label-position="right">
      <el-form class="content">
        <el-form-item label="偏移角度：">
          <num-input v-model="cesiumLocTransParams.angel"></num-input>
        </el-form-item>
        <el-form-item label="原点纬度：">
          <num-input v-model="cesiumLocTransParams.lat" :accuracy="0.000001"></num-input>
        </el-form-item>
        <el-form-item label="原点经度：">
          <num-input v-model="cesiumLocTransParams.lon" :accuracy="0.000001"></num-input>
        </el-form-item>
        <el-form-item label="缩放数一：">
          <num-input v-model="cesiumLocTransParams.pA" :accuracy="0.001"></num-input>
        </el-form-item>
        <el-form-item label="缩放数二：">
          <num-input v-model="cesiumLocTransParams.pB" :accuracy="0.001"></num-input>
        </el-form-item>
      </el-form>
      <div class="button-bar">
        <el-button @click="loadObjects" v-if="areaList.length === 0" size="mini" type="text">加载体块</el-button>
        <el-button @click="cancel" v-else size="mini" type="text">消除体块</el-button>
        <el-button @click="exportConfig" size="mini" type="text">导出配置</el-button>
      </div>
      <el-dialog title="导出配置" :visible.sync="dialogFormVisible" width="300px">
        <el-input type="textarea" :rows="5" :value="textarea">
        </el-input>
      </el-dialog>
    </message-layout>
  </div>
</template>

<script>
import messageLayout from '../components/messageLayout'
import numInput from '../components/numInput'

import { fencingList } from '@/api/pos/region'

export default {
  inject: ['cesiumMap'], // 多级祖孙传值-接受方
  components: {
    messageLayout,
    numInput
  },
  created () {
  },
  data () {
    return {
      param1: (2 * Math.PI * 6378137 / 360), // 经度一度对应的米
      areaList: [],
      cesiumLocTransParams: window.SITE_CONFIG['cesiumLocTransParams'],
      dialogFormVisible: false,
      textarea: ''
      // cesiumLocTransParams: {
      //   angel: 37.43, // 偏移角度
      //   lat: 31.9455795, // 原点纬度
      //   lon: 120.0929962, // 原点经度
      //   pA: 1.041, // 缩放系数一
      //   pB: 1.037 // 缩放系数二
      // }
    }
  },
  watch: {
    cesiumLocTransParams: {
      handler (val, oldVal) {
        if (this.areaList.length > 0) {
          this.showObjects(true)
        }
      },
      deep: true
    }
  },
  methods: {
    loadObjects () {
      if (this.areaList.length > 0) {
        return
      }
      fencingList({ name: '' }).then(({ data }) => {
        if (data && data.code === 0) {
          this.areaList = data.page.list
          this.showObjects()
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    cancel () {
      this.cesiumMap.$refs.mapShow.removeAreaObjectLoc('check-coordinate')
      this.areaList = []
    },
    exportConfig () {
      this.dialogFormVisible = true
      this.textarea = `    angel: ${this.cesiumLocTransParams.angel},\n    lat: ${this.cesiumLocTransParams.lat},\n    lon: ${this.cesiumLocTransParams.lon},\n    pA: ${this.cesiumLocTransParams.pA},\n    pB: ${this.cesiumLocTransParams.pB}`
    },
    showObjects (update = false) {
      this.areaList.map(res => {
        let points = []
        points.push({
          fenceID: res.id,
          points: this.getPointer(res.coordinate),
          minH: res.minHeight,
          maxH: res.maxHeight,
          color: this.rgba()
        })
        if (update) {
          this.updateObject(res.id, res.coordinate)
        } else {
          this.cesiumMap.$refs.mapShow.initAreaObjectLoc(
            res.id,
            'check-coordinate',
            'description',
            points,
            -1,
            false
          )
        }
      })
    },
    updateObject (id, points) {
      let arr = []
      this.getPointer(points).map(res => {
        arr.push(...[res.x, res.y])
      })
      this.cesiumMap.$refs.mapShow.updateAreaObjectLoc(id, arr)
    },
    translateXyToLnglat (x, y) {
      let lat = this.cesiumLocTransParams.lat - x * Math.sin(this.cesiumLocTransParams.angel / 180 * Math.PI) / this.param1 - y * Math.cos(this.cesiumLocTransParams.angel / 180 * Math.PI) / this.param1 // 纬度
      let lon = this.cesiumLocTransParams.lon + x * Math.cos(this.cesiumLocTransParams.angel / 180 * Math.PI) / (this.param1 * Math.cos(lat)) * this.cesiumLocTransParams.pA - y * Math.sin(this.cesiumLocTransParams.angel / 180 * Math.PI) / (this.param1 * Math.cos(lat)) * this.cesiumLocTransParams.pB // 经度
      return {
        x: lon,
        y: lat
      }
    },
    getPointer (val) {
      let points = []
      val.split(')||(').map((val1, index) => {
        if (index <= 0) {
          points.push(this.translateXyToLnglat(val1.split(',')[0].split('(')[1], val1.split(',')[1]))
        } else if (index >= val.split(')||(').length - 1) {
          points.push(this.translateXyToLnglat(val1.split(',')[0], val1.split(',')[1].split(')')[0]))
        } else {
          points.push(this.translateXyToLnglat(val1.split(',')[0], val1.split(',')[1]))
        }
      })
      return points
    },
    rgba () { // rgb颜色随机
      var r = Math.floor(Math.random() * 256)
      var g = Math.floor(Math.random() * 256)
      var b = Math.floor(Math.random() * 256)
      var rgb = 'rgba(' + r + ',' + g + ',' + b + ', 0.4)'
      return rgb
    }
  },
  beforeDestroy () {
    this.cancel()
  }
}
</script>

<style lang="scss">
.cesium-check-coordinate-container {
  .content {
    padding: 5px;
    .el-form-item__label {
      color: #fff;
    }
  }
  .button-bar {
    text-align: center;
  }
}
</style>