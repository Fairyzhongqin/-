<!--进出记录-->
<template>
  <div class="real-time-camera mod-config">
    <el-row class="record">
      <el-col :span="7" class="one">
        <el-card>
          <div slot="header" class="clearfix">
            <span>摄像头列表</span>
          </div>
          <el-scrollbar style="height: calc(100vh - 172px)">
            <div class="lis" v-for="(item,index) in dataList" :key="item.id" @click="getInfo(index,item)" :class="{active:selectedIndex===index}">
              <span>{{index+1}}/{{dataList.length}}</span>
              <span>摄像头名称：{{item.name?item.name:'暂无'}}</span>
              <p style="margin-bottom: 0">
                <span>所属区域：{{item.zoneName? item.zoneName:'暂无'}}</span>
              </p>
              <!--<p style="margin-top: 0"><span>备注：{{item.remarks? item.remarks:'暂无'}}</span></p>-->
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="17" class="two">
        <el-card>
          <div slot="header" class="clearfix">
            <span>摄像头实时视频</span>
          </div>
          <div class="two-content">
            <template v-if="dataList.length">
              <div class="two-content-video" v-loading="dataListLoading" element-loading-text="视频加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
                <template v-if="videoStatus">
                  <camera-show style="width:100%;height:100%;" ref="camera"></camera-show>
                </template>
              </div>
              <div class="two-content-info">
                <p>
                  <span>摄像头编号：</span>
                  <span style="font-weight: normal;">{{cameraInfo.code}}</span>
                </p>
                <p>
                  <span>摄像头名称：</span>
                  <span style="font-weight: normal;">{{cameraInfo.name}}</span>
                </p>
                <p>
                  <span>摄像头类型：</span>
                  <span style="font-weight: normal;">
                    <template v-if="cameraInfo.type!==''">
                      {{cameraInfo.type == 0 ? ' 海康威视' : '大华'}}
                    </template>
                    <template v-else>暂无</template>
                  </span>
                </p>
                <p>
                  <span>所属区域：</span>
                  <span style="font-weight: normal;">{{cameraInfo.zoneName}}</span>
                </p>
                <p>
                  <span>地图位置：</span>
                  <el-tooltip class="item" effect="dark" content="点击查看" placement="right">
                    <a href="javascript:;" @click="addOrUpdateHandle" style="text-decoration: underline;"><i class="el-icon-location-outline" style="cursor: pointer;color: #3E8EF7;"></i> {{cameraInfo.x}} , {{cameraInfo.y}} , {{cameraInfo.z}} </a>
                  </el-tooltip>
                </p>
              </div>
            </template>
            <template v-else>

            </template>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { cameraFindAllList, alecateChannel, cameraUrlTrans } from '@/api/sou/cameraManagement'

import cameraShow from '@/views/demo/cameraTest2'

import waves from '@/utils/waves'
import eventBus from '@/bus/index'
export default {
  directives: {
    waves
  },
  data () {
    return {
      cameraInfo: {
        name: '',
        code: '',
        type: '',
        zoneName: '',
        positionX: '',
        positionY: '',
        positionZ: ''
      },
      selectedIndex: 0,
      dataList: [],
      dataListLoading: false,
      videoStatus: false,
      setInterval: null // 定时器
    }
  },
  components: {
    cameraShow
  },
  created () {
    this.getDataList() // 获取数据列表
  },
  activated () {
    if (this.dataList.length > 0) {
      this.getInfo(this.selectedIndex, this.dataList[this.selectedIndex])
    }
  },
  deactivated () {
    this.videoStatus = false
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      cameraFindAllList().then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.DeveuiMap.list
          if (this.dataList.length > 0) {
            this.getInfo(0, this.dataList[0])
          }
        } else {
          this.dataList = []
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 点击左侧部分，查询右侧对应的卡口信息
    getInfo (index, item) {
      clearInterval(this.setInterval)
      this.dataListLoading = true
      this.videoStatus = false
      this.selectedIndex = index
      this.cameraInfo = item

      this.getChannel(item.id)
      this.setInterval = setInterval(() => { // 轮询续费 50s
        this.getChannel(item.id)
      }, 50000)
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.$router.push({
        name: 'comMap',
        params: {
          name: 'camera',
          callBackFn: () => {
            eventBus.$emit('mainSidebarCoMap', {
              name: 'cameraFun',
              info: this.cameraInfo
            }) // 摄像头管理
          }
        }
      })
      this.$store.commit('common/updateMainTabs', [{
        iframeUrl: '',
        menuId: 'comMap',
        name: 'comMap',
        noClose: true,
        title: '视图模式',
        type: 'module'
      }])
      this.$store.commit('common/updateMainmodelFlag', 1)
      this.$cookie.set('navFlag', this.$store.state.common.navFlag)
      this.$store.commit('common/updatedNavbarFlag', '4')
    },
    getChannel (id) { // 获取信道
      alecateChannel({
        id
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.playCamera(id)
          this.videoStatus = true
          this.$nextTick(() => {
            this.$refs.camera.init(data.rtmpPath + '/')
          })
        } else {
          this.$message.error(data.msg)
          this.videoStatus = false
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.videoStatus = false
      })
      this.dataListLoading = false
    },
    playCamera (id) { // 续费信道
      cameraUrlTrans({
        id
      })
    }
  },
  beforeDestroy () {
    clearInterval(this.setInterval)
  }
}
</script>
<style lang="scss">
.real-time-camera {
  padding: 25px 30px;
  // height: calc(100% - 30px - 34px - 55px);
  .record {
    width: 100%;
    height: calc(100vh - 18px - 115px);
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .alermicon {
      padding-left: 10px;
      color: red;
    }
    .el-range-editor--medium .el-range-separator,
    .el-range-editor--medium .el-range-input {
      font-size: 12px;
    }
    .el-range-editor--medium.el-input__inner {
      height: 28px;
      // margin-top: 5px;
    }
    .el-date-editor .el-range-separator {
      padding: 0px 0px;
    }

    .el-range-editor.el-input__inner {
      padding: 0px 10px;
    }
    .el-card__header {
      // background-color: #9ac5f2;
      background-color: #5b96d2;
      color: #fff;
      font-size: 12px;
      padding: 8px;
      border-bottom: none;
    }
    .el-card__body {
      border: 1px solid #ccc;
      border-top: 0;
      height: calc(100vh - 165px);
    }
    .one {
      padding-right: 7px;
      height: calc(100vh - 135px);
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
      .el-card__body {
        padding: 0px;
      }
      .lis {
        padding: 10px;
        margin: 0 10px 10px 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        background-color: #fff;
        position: relative;
        font-size: 12px;
        &:nth-child(1) {
          margin-top: 10px;
        }
        &:hover {
          border: 1px solid #5693c9;
          box-shadow: 0px 0px 2px 0px #5693c9;
        }
        span {
          line-height: 20px;
          text-align: center;
          color: #fff;
        }
        span:nth-of-type(1) {
          background-color: #76b8ee;
          padding: 3px 8px;
        }
        span:nth-of-type(2),
        span:nth-of-type(3) {
          color: #333333;
        }
        p {
          span {
            background-color: #fff !important;
            color: #333333;
          }
        }
      }
      .active {
        border: 1px solid #2c78bb;
      }
    }
    .two {
      position: relative;
      height: 100%;
      .el-card__body {
        padding: 10px;
      }
      &-content {
        height: 100%;
        &-video {
          text-align: center;
          background-color: #262d38;
          height: 60%;
          position: relative;
          video {
            margin: 0 auto;
            height: 100%;
            width: auto;
            max-width: 100%;
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
        &-info {
          padding: 10px;
          p {
            span:nth-child(1) {
              display: inline-block;
              min-width: 6em;
              text-align: right;
            }
          }
        }
      }
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
      .el-table::before {
        background-color: #ebeef5;
      }
      .el-table .el-table__header-wrapper thead tr .is-leaf {
        color: #222;
      }
      .el-button:nth-child(1) {
        background-color: #5b96d2;
        border-color: #5b96d2;
        &:hover {
          background-color: #6fa9e4;
          border-color: #6fa9e4;
        }
      }
      .el-form-item__label {
        color: #333;
      }
    }
  }
}
</style>
