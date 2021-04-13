<!--
 * @Descripttion:
 * @version:
 * @Author: Mr.What
 * @Date: 2019-11-27 19:55:57
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-12-03 10:20:27
 -->
<template>
  <div class="cesium-billboard-info-container">
    <message-layout height="200px" :name="(type==='0'?'人员':'车辆')+'信息'">
      <div class="head-image-content flex flex-row" v-if="type==='0'">
        <img :src="img?img:require('@/assets/img/personDefault.jpg')" alt="暂无照片" />
        <div class="info flex flex-column">
          <div>姓名：{{info.person?info.person.name:''}}</div>
          <div>工号：{{info.person?info.person.gh:''}}</div>
          <div>性别：{{info.person?(info.person.sex === '0'?'男':'女'):''}}</div>
          <div>工种：{{info.person?info.person.cgformName:''}}</div>
          <div>在线状态：{{info.status?'在线':'离线'}}</div>
          <el-button type="text" @click="addOrUpdateHandle(info.person)">>>档案详情</el-button>
        </div>
      </div>
      <div class="head-image-content" v-else>
        <div class="info flex flex-column">
          <div>车牌号：{{info.vehicle.numberPlates}}</div>
          <div>车辆类型：{{info.vehicle.type==='0'?'普通车辆':'临时车辆'}}</div>
          <div>车型：{{info.vehicle.vehicleType}}</div>
          <div>在线状态：{{info.status?'在线':'离线'}}</div>
        </div>
      </div>
    </message-layout>

    <staff-file v-if="staffVisible" ref="staffFileRef"></staff-file>
  </div>
</template>

<script>
import messageLayout from '../components/messageLayout'
import staffFile from '@/components/StaffFile'

import { staffFileInfo } from '@/api/pos/staffFile'

export default {
  inject: ['cesiumMap'], // 多级祖孙传值-接受方
  components: {
    messageLayout,
    staffFile
  },
  data () {
    return {
      info: {},
      img: '',
      type: '0', // 类型 0：人、1：车
      staffVisible: false
    }
  },
  created () { },
  mounted () { },
  beforeDestroy () {
    !this.cesiumMap.$refs.mapShow || this.cesiumMap.$refs.mapShow.jiechugongzong()
  },
  computed: {},
  watch: {},
  methods: {
    init (val, val1) {
      this.type = val1
      this.info = val
      staffFileInfo({
        gh: this.info.person.gh
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.img = data.info.photo
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 查看详细信息
    addOrUpdateHandle (info) {
      this.staffVisible = true
      this.$nextTick(() => {
        this.$refs.staffFileRef.init(info)
      })
    }
  }
}
</script>

<style lang="scss">
.cesium-billboard-info-container {
  .head-image-content {
    img {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      margin: 20px 3px;
    }
    .info {
      width: 70%;
      color: #fff;
      padding: 0 15px;
      line-height: 25px;
      .detail {
        position: absolute;
        right: 0;
        bottom: 0;
      }
      .el-button {
        text-align: right;
      }
    }
  }
  .staffFile-dialog {
    .el-table {
      td {
        color: #222;
      }
    }
  }
}
</style>
