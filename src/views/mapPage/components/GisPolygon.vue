<template>
  <!-- 重大危险源右侧弹框 -->
  <!-- //危险源类型（0-库区、1-库房、2-生产场所、3-罐区）-->
  <div>
    <!-- 图层图标/点物体信息板 -->
    <div class="laye-left" v-show="layerShow&&!cameraShowVisible">
      <el-row>
        <div class="bounced-title">
          <el-col :span="24" align="center">{{layerData.type | filterType1}}</el-col>
        </div>
      </el-row>
      <el-form label-width="90px">
        <div v-if="layerData.type === 'person'">
          <el-form-item label="人员姓名">{{layerData.person.name}}</el-form-item>
          <el-form-item label="人员工号">{{layerData.person.gh}}</el-form-item>
          <el-form-item label="人员性别">{{['男', '女'][layerData.person.sex] || ''}}</el-form-item>
        </div>
        <div v-if="layerData.type === 'car'">
          <el-form-item label="车牌号">{{layerData.vehicle.numberPlates}}</el-form-item>
          <el-form-item label="车辆类型">{{layerData.vehicle.type === '0' ? '普通车辆':'临时车辆'}}</el-form-item>
          <el-form-item label="驾驶员信息">{{layerData.vehicle.driverId}}</el-form-item>
          <el-form-item label="押运员信息">{{layerData.vehicle.supercargoId}}</el-form-item>
        </div>
        <div v-if="layerData.type === 'checkpoint'">
          <el-form-item label="卡口名称">{{layerData.checkpoint.name}}</el-form-item>
          <el-form-item label="值班人员">{{layerData.checkpoint.personShow}}</el-form-item>
        </div>
        <div v-if="layerData.type === 'camera'">
          <template v-if="!cameraShowVisible">
            <el-form-item label="摄像头编号">{{layerData.camera.code}}</el-form-item>
            <el-form-item label="摄像头名称">{{layerData.camera.name}}</el-form-item>
            <el-form-item label="摄像头类型">{{layerData.camera.type == 0 ? ' 海康威视' : '大华'}}</el-form-item>
            <el-form-item label="监控区域">{{layerData.camera.zoneIdList}}</el-form-item>
            <el-row>
              <el-col :span="24" align="center">
                <el-button @click="showCamera(layerData.camera.id)" type="text" size="mini">播放</el-button>
              </el-col>
            </el-row>
          </template>
        </div>
        <div v-if="layerData.type === 'beacon'">
          <el-form-item label="设备编号">{{layerData.beacon.deveui}}</el-form-item>
          <el-form-item label="设备类型">{{layerData.beacon.locdevtype | formatLocdevtype(locdevtypeList)}}</el-form-item>
          <el-form-item label="设备电量">
            <battery :num="layerData.beacon.rate"></battery>
          </el-form-item>
        </div>
        <div v-if="layerData.type === 'base_station'">
          <el-form-item label="设备编号">{{layerData.base_station.deveui}}</el-form-item>
          <el-form-item label="设备类型">{{layerData.base_station.locdevtype | formatLocdevtype(locdevtypeList)}}</el-form-item>
        </div>

        <div v-if="layerData.type === 'tank'">
          <el-form-item label="储罐编号">{{layerData.tank.code}}</el-form-item>
          <el-form-item label="储罐名称">{{layerData.tank.name}}</el-form-item>
          <el-form-item label="储罐类型">{{layerData.tank.tankTypeName}}</el-form-item>
          <el-form-item label="存储物品名称">{{layerData.tank.storageName}}</el-form-item>
          <el-form-item label="所属区域">{{layerData.tank.zoneName}}</el-form-item>
          <el-form-item label="备注">{{layerData.tank.content}}</el-form-item>
          <div style="width:100%;text-align:center;">
            <el-button type="text" size="mini" @click="handleDataMonitor(layerData.tank)">查看仪表数据</el-button>
          </div>
        </div>

        <div v-if="layerData.type === 'device'">
          <el-form-item label="反应装置编号">{{layerData.device.code}}</el-form-item>
          <el-form-item label="反应装置名称">{{layerData.device.name}}</el-form-item>
          <el-form-item label="所属区域">{{layerData.device.zoneName}}</el-form-item>
          <el-form-item label="备注">{{layerData.device.remarks}}</el-form-item>
          <div style="width:100%;text-align:center;">
            <el-button type="text" size="mini" @click="handleDataMonitor(layerData.device)">查看仪表数据</el-button>
          </div>
        </div>

      </el-form>
    </div>
    <!-- 重大危险安源 -->
    <div class="hazards-left" v-show="shazardShow">
      <el-row>
        <div class="bounced-title">
          <el-col :span="24" align="center">{{hazards.zoneName}}/{{hazards.sourType | filterType}}</el-col>
        </div>
      </el-row>
      <el-form label-width="110px">
        <div v-if="hazards.sourType === '0'">
          <el-form-item label="风险属性">{{hazards.dangerAttr}}</el-form-item>
          <el-form-item label="风险描述">{{hazards.describe}}</el-form-item>
        </div>
        <div v-if="hazards.sourType === '1'">
          <el-form-item label="存储化学物品名称">{{hazards.storageGood}}</el-form-item>
          <el-form-item label="风险属性">{{hazards.dangerAttr}}</el-form-item>
          <el-form-item label="风险描述">{{hazards.describe}}</el-form-item>
        </div>
        <div v-if="hazards.sourType === '2'">
          <el-form-item label="固定资产总值/万元">{{hazards.assets}}</el-form-item>
          <el-form-item label="危险化学品">{{hazards.dangerThings}}</el-form-item>
          <el-form-item label="目标产物">{{hazards.targetProduct}}</el-form-item>
          <el-form-item label="风险属性">{{hazards.dangerAttr}}</el-form-item>
          <el-form-item label="风险描述">{{hazards.describe}}</el-form-item>
        </div>
        <div v-if="hazards.sourType === '3'">
          <el-form-item label="防护堤数据">{{data.dyke}}</el-form-item>
          <el-form-item label="风险属性">{{hazards.dangerAttr}}</el-form-item>
          <el-form-item label="风险描述">{{hazards.describe}}</el-form-item>
        </div>
      </el-form>
    </div>
    <!-- 四色区 -->
    <div class="four_area" v-show="fourAreaShow">
      <el-row>
        <div class="bounced-title">
          <el-col :span="24" align="center">{{four_area.zoneName}}/{{four_area.riskLevel | filterType2}}</el-col>
        </div>
      </el-row>
      <el-row style="padding:0 10px 0 10px">
        <el-col :span="14" class="table-left">风险辨识清单</el-col>
        <el-col :span="10" class="table-right">
          <a @click="getInfo('identificationShow')" href="javascript:;">查看详情>></a>
        </el-col>
        <el-col :span="14" class="table-left">风险管控清单</el-col>
        <el-col :span="10" class="table-right">
          <a @click="getInfo('controlShow')" href="javascript:;">查看详情>></a>
        </el-col>
        <el-col :span="14" class="table-left">承诺卡</el-col>
        <el-col :span="10" class="table-right">
          <a @click="getInfo('promiseShow')" href="javascript:;">查看详情>></a>
        </el-col>
        <el-col :span="14" class="table-left">告知卡</el-col>
        <el-col :span="10" class="table-right">
          <a @click="getInfo('manageShow')" href="javascript:;">查看详情>></a>
        </el-col>
        <el-col :span="14" class="table-left">应急卡</el-col>
        <el-col :span="10" class="table-right">
          <a @click="getInfo('shouldknowShow')" href="javascript:;">查看详情>></a>
        </el-col>
      </el-row>
    </div>

    <template v-if="cameraShowVisible">
      <camera-show :width="340" :height="240" ref="cameraShow" v-if="cameraComStatus"></camera-show>
      <div :width="340" :height="240" v-else>
        <p class="video-err"><span></span></p>
      </div>
    </template>

    <!--风险辨识清单 - 弹窗-->
    <identification-map-table v-if="identificationTableVisible" :queryConditions="{businessName:four_area.zoneName,zoneCode:four_area.id}" ref="identificationTable"></identification-map-table>
    <!--风险管控清单 - 弹窗-->
    <control-map-table v-if="controlMapTableVisible" :queryConditions="{businessName:four_area.zoneName,zoneCode:four_area.id}" ref="controlMapTable"></control-map-table>
    <!--承诺卡 - 弹窗-->
    <promise-examine v-if="examineVisible" ref="examine"></promise-examine>
    <!--告知卡 - 弹窗-->
    <preview v-if="previewVisible" ref="preview"></preview>
    <!-- 监测仪表 -->
    <device-monitor v-model="deviceMonitorVisible" v-if="deviceMonitorVisible" ref="deviceMonitor"></device-monitor>
  </div>
</template>
<script>
import { checkpointInfo, IcardIssueInfo } from '@/api/pos/checkpoint'
import { queryZoneByCode } from '@/api/pos/region'
import { getLabels } from '@/api/common/sys'
import { storageInfo, zoneQueryProm } from '@/api/cesiumMap/index'
import { cameraInfo, alecateChannel, cameraUrlTrans } from '@/api/sou/cameraManagement'
import { reactorInfo } from '@/api/sou/equlpment'
import battery from '@/components/Battery'

import controlMapTable from '@/views/modules/risk/riskIdentificationControl/control-map-table'
import identificationMapTable from '@/views/modules/risk/riskIdentificationControl/identification-map-table'
import promiseExamine from '@/views/modules/risk/card/promise-examine'
import preview from '@/views/modules/risk/card/shouldknow-preview'

import cameraShow from '@/views/demo/cameraTest2' // 摄像头监控

import deviceMonitor from '@/components/deviceMonitor'
export default {
  name: 'hazards-right',
  data () {
    return {
      locdevtypeList: [], // 设备类型list
      shazardShow: false,
      layerShow: false,
      fourAreaShow: false,
      identificationTableVisible: false,
      controlMapTableVisible: false,
      examineVisible: false,
      previewVisible: false,
      hazards: {
        sourName: '',
        sourType: '',
        dangerAttr: '',
        describe: '',
        storageGood: '',
        storageNum: '',
        assets: '',
        dangerThings: '',
        targetProduct: '',
        tankNum: ''
      },
      layerData: {
        type: '',
        person: { cgformName: '', name: '', gh: '' },
        vehicle: { numberPlates: '' },
        checkpoint: { personShow: '', name: '' },
        camera: { username: '', code: '' },
        beacon: {},
        base_station: {},
        tank: {}
      },
      four_area: {
        riskLevel: '0',
        zoneName: ''
      },
      deviceMonitorVisible: false,
      cameraShowVisible: false, // 摄像头监控
      cameraComStatus: true, // 摄像头监控是否正常播放
      acmeraInterval: null // 摄像头接口轮询
    }
  },
  components: {
    battery,
    deviceMonitor,
    cameraShow,
    identificationMapTable,
    controlMapTable,
    promiseExamine,
    preview
  },
  methods: {
    init (zoneId, fenceId, type) {
      this.cameraShowVisible = false // 销毁摄像头组件 现在缺少弹框隐藏事件 只能先写在这边了
      this.shazardShow = false
      this.fourAreaShow = false
      this.layerShow = false
      this.hazards = {
        sourName: '',
        sourType: '',
        dangerAttr: '',
        describe: '',
        storageGood: '',
        storageNum: '',
        assets: '',
        dangerThings: '',
        targetProduct: '',
        tankNum: ''
      }
      this.layerData = {
        type: '',
        person: { cgformName: '', name: '', gh: '' },
        vehicle: { numberPlates: '' },
        checkpoint: { personShow: '', name: '' },
        camera: { username: '', code: '' },
        beacon: {},
        base_station: {},
        tank: {},
        device: {}
      }
      this.four_area = {
        riskLevel: '',
        zoneName: ''
      }
      switch (type) {
        case 'person': // 人员
          this.fourAreaShow = false
          this.shazardShow = false
          this.layerShow = true
          this.getLayer(zoneId, fenceId, type)
          break
        case 'car': // 车辆
          this.fourAreaShow = false
          this.shazardShow = false
          this.layerShow = true
          this.getLayer(zoneId, fenceId, type)
          break
        case 'camera': // 摄像头
          this.fourAreaShow = false
          this.shazardShow = false
          this.layerShow = true
          this.getLayer(zoneId, fenceId, type)
          break
        case 'checkpoint': // 卡口
          this.fourAreaShow = false
          this.shazardShow = false
          this.layerShow = true
          this.getLayer(zoneId, fenceId, type)
          break
        case 'beacon': // 信标
          this.fourAreaShow = false
          this.shazardShow = false
          this.layerShow = true
          this.getLayer(zoneId, fenceId, type)
          break
        case 'base_station': // 基站
          this.fourAreaShow = false
          this.shazardShow = false
          this.layerShow = true
          this.getLayer(zoneId, fenceId, type)
          break
        case 'hazards': // 重大危险源数据
          this.shazardShow = true
          this.fourAreaShow = false
          this.layerShow = false
          this.gethazards(zoneId, fenceId, type)
          break
        case 'tank': // 储罐
          this.fourAreaShow = false
          this.shazardShow = false
          this.layerShow = true
          this.getTankInfo(zoneId, fenceId, type)
          break
        case 'device': // 反应装置
          this.fourAreaShow = false
          this.shazardShow = false
          this.layerShow = true
          this.getDeviceInfo(zoneId, fenceId, type)
          break
        case 'four_area': // 四色区
          this.fourAreaShow = true
          this.shazardShow = false
          this.layerShow = false
          this.getfourArea(zoneId, fenceId, type)
          break
      }

      console.log(zoneId, '=========', fenceId, '-------------', type)
    },
    // 图层类的信息展示
    getLayer (zoneId, fenceId, type) {
      this.layerData.type = type
      console.log(type, '====================')
      switch (type) {
        case 'checkpoint': // 卡口
          checkpointInfo({
            'id': fenceId
          }).then(({ data }) => {
            if (data && data.code === 0) {
              console.log(data, '============')
              this.layerData.checkpoint = data.data
            } else {
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
          })
          break
        case 'person':
          IcardIssueInfo({
            deveui: fenceId
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.layerData.person = data.entity.person
              console.log(data, '=============')
            }
          })
          break
        case 'car':
          IcardIssueInfo({
            deveui: fenceId
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.layerData.vehicle = data.entity.vehicle
              console.log(data, '=============')
            }
          })
          break
        case 'beacon':
          // 设备类型 - 字典
          getLabels({
            'type': 'zxkl_device_type'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.locdevtypeList = data.list
            } else {
              this.$message.error(data.msg)
            }
          }).then(() => {
            IcardIssueInfo({
              deveui: fenceId
            }).then(({ data }) => {
              if (data && data.code === 0) {
                console.log(data, '============')
                this.layerData.beacon = data.entity
                console.log(data, '=============')
              }
            })
          })
          break
        case 'base_station':
          // 设备类型 - 字典
          getLabels({
            'type': 'zxkl_device_type'
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.locdevtypeList = data.list
            } else {
              this.$message.error(data.msg)
            }
          }).then(() => {
            IcardIssueInfo({
              deveui: fenceId
            }).then(({ data }) => {
              if (data && data.code === 0) {
                this.layerData.base_station = data.entity
              }
            })
          })
          break
        case 'camera':
          cameraInfo({
            id: fenceId
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.layerData.camera = data.data
            }
          })
          break
      }
    },
    // ***************** 重大危险源 *****************
    // 重大危险源的展示
    gethazards (zoneId, fenceId, type) {
      console.log(zoneId)
      queryZoneByCode({
        'code': zoneId
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data, '=================')
          this.hazards = data.data
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 储罐信息
    getTankInfo (zoneId, tankId, type) {
      this.layerData.type = type
      storageInfo({
        id: tankId
      }).then(({ data }) => {
        this.layerData.tank = data.data
      })
    },
    // 反应装置
    getDeviceInfo (zoneId, deviceId, type) {
      this.layerData.type = type
      reactorInfo({
        id: deviceId
      }).then(({ data }) => {
        this.layerData.device = data.data
      })
    },
    // ***************** 风险分区 *****************
    // 四色区展示
    getfourArea (zoneId, fenceId, type) {
      queryZoneByCode({
        'code': zoneId
      }).then(({ data }) => {
        console.log(data, '====ss')
        if (data && data.code === 0) {
          console.log(data, '=============')
          this.four_area = data.data
          this.loading = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 两单三卡的详情点击事件
    getInfo (type) {
      switch (type) {
        case 'identificationShow': // 风险辨识清单
          this.identificationTableVisible = true
          this.$nextTick(() => {
            this.$refs.identificationTable.getDataList()
          })
          break
        case 'controlShow':
          this.controlMapTableVisible = true
          this.$nextTick(() => {
            this.$refs.controlMapTable.getDataList()
          })
          break
        case 'manageShow': // 告知卡
          this.previewVisible = true
          this.$nextTick(() => {
            this.$refs.preview.init(this.four_area)
          })
          break
        case 'shouldknowShow': // 应急卡
          this.$message('程序员开发中!')
          break
        case 'promiseShow': // 承诺卡
          this.examineVisible = true
          console.log(this.four_area)
          zoneQueryProm({ zoneId: this.four_area.id }).then(({ data }) => {
            if (data.data.promiseId) {
              this.$nextTick(() => {
                this.$refs.examine.init(this.four_area.code, data.data.promiseId)
              })
            } else {
              this.$message.info('暂未上传承诺卡!')
            }
          })
          break
      }
    },
    // 实时监测
    handleDataMonitor (info) {
      this.deviceMonitorVisible = true
      this.$nextTick(() => {
        this.$refs.deviceMonitor.init(info)
      })
    },
    // 实时展示摄像头
    showCamera (id) {
      clearInterval(this.setInterval)
      this.cameraShowVisible = true
      this.cameraComStatus = true
      this.refreshCameraUrl(id)
      this.acmeraInterval = setInterval(() => { // 轮询续费
        this.refreshCameraUrl(id)
      }, 50000)
    },
    // 刷新摄像头地址
    refreshCameraUrl (id) {
      const playCamera = () => {
        cameraUrlTrans({ // 续费信道
          id
        })
      }
      this.$nextTick(() => {
        alecateChannel({ // 获取信道
          id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            if (!this.$refs.cameraShow) {
              clearInterval(this.acmeraInterval)
              return
            }
            this.$refs.cameraShow.init(data.rtmpPath + '/')
            playCamera()
          } else {
            this.$message.error(data.msg)
            this.cameraComStatus = false
            this.cameraShowVisible = false
          }
        }).catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员123')
          this.cameraComStatus = false
          this.cameraShowVisible = false
        })
      })
    }
  },
  filters: {
    // 0-库区、1-库房、2-生产场所、3-罐区、4-储罐）
    filterType (val) {
      switch (val) {
        case '0':
          return '库区'
        case '1':
          return '库房'
        case '2':
          return '生产场所'
        case '3':
          return '罐区'
        case '4':
          return '其他'
      }
    },
    filterType1 (val) {
      switch (val) {
        case 'person':
          return '人员信息'
        case 'checkpoint':
          return '卡口信息'
        case 'camera':
          return '摄像头信息'
        case 'beacon':
          return '信标信息'
        case 'base_station':
          return '基站信息'
        case 'car':
          return '车辆信息'
        case 'tank':
          return '储罐信息'
        case 'device':
          return '反应装置'
      }
    },
    // 0-重大风险、1=较大风险、2- 一般风险、3-低风险
    filterType2 (val) {
      switch (val) {
        case '0':
          return '重大风险'
        case '1':
          return '较大风险'
        case '2':
          return '一般风险'
        case '3':
          return '低风险'
      }
    },
    formatLocdevtype (value, map) {
      let optionName = ''
      map.map((val) => {
        if (value === val.label) {
          optionName = val.value
        }
      })
      return optionName
    }
  },
  beforeDestroy () {
    clearInterval(this.setInterval)
  }
}
</script>
<style lang="scss" scoped>
.hazards-left,
.laye-left,
.four_area {
  width: 200px;
  background-color: rgba(0, 0, 0, 0.8);
  box-shadow: 0px 0px 4px 0px rgba(37, 39, 50, 0.5);
  border-radius: 6px;
  padding: 5px;
  margin-bottom: 10px;
  border: 1px solid #3365b7ad;
  .bounced-title {
    width: 100%;
    height: 26px;
    line-height: 24px;
    border-bottom: 1px solid #3365b7ad;
    font-size: 14px;
    font-weight: bold;
    color: rgba(254, 254, 254, 1);
    text-shadow: 0px 0px 6px rgba(0, 198, 255, 1);
    margin-bottom: 8px;
    .close-left {
      padding-top: 9px;
    }
    .bounced-title-right {
      cursor: pointer;
      width: 24px;
      padding: 0px 1px 0px 1px;
      height: 16px;
      background: rgba(199, 199, 204, 0.08);
      border-radius: 2px;
      background-image: radial-gradient(#313130 55%, #1c72c3);
      .el-icon-caret-right {
        color: #00c6ff;
        font-size: 12px;
        width: 4px;
        height: 8px;
        position: relative;
        bottom: 8px;
      }
    }
  }
  /deep/ .el-form-item {
    margin-bottom: 10px;
  }

  /deep/ .el-form-item__label {
    color: rgb(207, 207, 207);
    font-size: 12px;
  }
  /deep/ .el-form-item__content {
    color: #fff;
    font-size: 12px;
  }
  .table-left {
    color: #fff;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }
  .table-right {
    color: #fff;
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }

  .video-err {
    display: inline-block;
    position: absolute;
    left: 50%;
    top: 40%;
    transform: translate(-50%);
    margin: 0;
    span {
      display: inline-block;
      position: relative;
      width: 50px;
      height: 50px;
      border-radius: 50px;
      border: 5px solid #e63031;
      &:before {
        content: '暂无数据';
        position: absolute;
        bottom: -60%;
        color: #909399;
        width: 200%;
        left: -50%;
      }
      &:after {
        top: 18px;
        content: '';
        width: 46px;
        height: 5px;
        position: absolute;
        background-color: #e63031;
        left: -3px;
        transform: rotate(-58deg);
      }
    }
  }
}
</style>
