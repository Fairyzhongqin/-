<!--
 * @Descripttion: 
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-12-20 14:56:11
 * @LastEditors  : Mr.What
 * @LastEditTime : 2019-12-20 16:02:48
 -->
<template>
  <div class="cesium-inspection-route-container">
    <message-layout height="100px" width="50vw" name="巡检点位路径">
      <div style="width:100%;height:100%;overflow-x:auto;overflow-y: hidden" ref="contentLine">
        <div :style="'width:'+(patrolpointList.length*142)+'px;min-width:100%;'" class="patrolPint">
          <el-steps v-if="patrolpointList.length>0" finish-status="success" :space="142">
            <el-step :title="index < 10 ?'0'+(index+1)+item.name:index+1+item.name" v-for="(item,index) in patrolpointList" :class="{'actived' : actived === index}" :key="item.id" @click.native="flyTo(item);actived=index">
            </el-step>
          </el-steps>
          <div v-else style="color:#fff;font-size:12px;width:100%;text-align:center;line-height:40px;color: #b7b8b9;">
            暂无巡检点
          </div>
        </div>
      </div>
    </message-layout>
  </div>
</template>

<script>
import messageLayout from '../components/messageLayout'
import { WheelDirective } from '@/utils/wheelDirective'

export default {
  inject: ['cesiumMap', 'cesiumContent'], // 多级祖孙传值-接受方
  components: {
    messageLayout
  },
  data () {
    return {
      actived: null,
      patrolpointList: [], // 巡检点列表
      cacheID: null // 缓存id 用来清除动画效果
    }
  },
  created () { },
  mounted () {
    this.$nextTick(() => {
      // eslint-disable-next-line no-new
      new WheelDirective(this.$refs['contentLine']) // 横向滚动
    })
  },
  updated () {
  },
  computed: {},
  watch: {},
  methods: {
    init (val) {
      this.patrolpointList = val
    },
    flyTo (item) { // 相机移动到点击物体
      if (item.facilityType === '100') { // 如果为其他设备则没有坐标信息
        this.$message.onfo('该点位[设备设施类型]为[其他]，没有坐标信息')
      } else {
        if (item.id) {
          this.cesiumMap.$refs.mapShow.flyTo(item.id)
          this.cesiumMap.$refs.mapShow.setPtAminationVisible(null, [this.cacheID], false, null) // 先关闭上一个动画
          this.cesiumMap.$refs.mapShow.setPtAminationVisible(null, [item.id], true, { color: '#00d400', radius: 50 }) // 开启动画
          this.cacheID = item.id
        }
      }
    }
  },
  beforeDestroy () {
    if (this.cacheID) {
      this.cesiumMap.$refs.mapShow.setPtAminationVisible(null, [this.cacheID], false, null)
    }
  }
}
</script>

<style lang="scss">
.cesium-inspection-route-container {
  .patrolPint {
    position: absolute;
    left: 0;
    height: 100%;
    // background-color: rgba(0, 0, 0, 0.7);
    // border: 1px solid #3365b7ad;
    position: relative;
    padding: 5px;
    // border-radius: 10px;
    .el-step {
      &:hover {
        cursor: pointer;
        background: linear-gradient(
          0deg,
          rgba(18, 20, 26, 0.9),
          rgba(7, 9, 16, 0.6)
        );
        box-shadow: 0px 0px 4px 0px rgba(7, 7, 8, 0.5);
        .el-step__line {
          background-color: red;
        }
      }
      &.actived {
        cursor: pointer;
        background: linear-gradient(
          0deg,
          rgba(18, 20, 26, 0.9),
          rgba(7, 9, 16, 0.6)
        );
        box-shadow: 0px 0px 4px 0px rgba(7, 7, 8, 0.5);
        .el-step__line {
          background-color: red;
        }
      }
      .el-step__title {
        font-size: 12px;
      }
      .is-horizontal {
        margin-right: 10px;
      }
      .el-step__line {
        position: absolute;
        top: 9px;
        background-color: #ffff00;
        height: 1px;
        margin: 0 15px;
        margin-right: 10px !important;
      }
    }
    .el-step__icon {
      height: 8px;
      width: 8px;
      background: #fb0e0f;
    }
    .el-step__icon.is-text {
      border: 0;
      border-radius: 0;
    }
    .el-step__icon-inner {
      display: none;
    }
  }
}
</style>
