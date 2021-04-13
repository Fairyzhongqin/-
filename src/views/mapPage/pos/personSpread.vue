<!--
 * @Descripttion: 人员分布页
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-11-27 11:44:11
 * @LastEditors  : Mr.What
 * @LastEditTime : 2020-01-04 12:26:01
 -->
<template>
  <div class="cesium-person-spread-container">
    <message-layout name="人员分布" width="250px">
      <el-table class="personDistribution-table" ref="singleTable" :data="dataList2" highlight-current-row row-key="id" @cell-click="cellTableClick" :tree-props="{ children: 'subregion' }" style="width: 100%; ">
        <el-table-column prop="zoneName" :show-overflow-tooltip="true" label="区域名称/编号" width="130">
          <template slot-scope="scope">
            <span class="zonename-hover">{{ scope.row.zoneName }}/{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="code" label="区域人数" width="80">
          <template slot-scope="scope">{{
            scope.row.id === "0" ? "" : scope.row.personList.length + "人"
          }}</template>
        </el-table-column>
        <el-table-column width="0">
          <template slot-scope="scope">
            <icon-svg name="tuceng" v-if="scope.row.buildId" class="show-inside-button"></icon-svg>
            <!-- <el-button size="mini" type="text" @click="showInside(scope.row)" class="show-inside-button" v-if="scope.row.buildId">分层展示</el-button> -->
          </template>
        </el-table-column>
      </el-table>
      <el-row class="bottom-online">
        <el-col :span="24" align="left" style="color:#2C78BB;font-size:14px;cursor: pointer;text-align:center">
          总人数:{{ total }}人
        </el-col>
      </el-row>
      <el-row class="bottom-online">
        <el-col :span="12" align="left" style="color:#e6a23c;font-size:12px;cursor: pointer;text-align:center">
          离线人数:{{ leave }}人
        </el-col>
        <el-col :span="12" align="left" style="color:#67c23a;font-size:12px;cursor: pointer;text-align:center">
          在线人数:{{ online }}人
        </el-col>
      </el-row>
    </message-layout>
  </div>
</template>

<script>
import messageLayout from '../components/messageLayout'

import { getPointer } from '@/utils/cesiumMap'

import { getZonePerson } from '@/api/cesiumMap/index'
import { getpersoncount } from '@/api/kanban/per'
export default {
  inject: ['cesiumMap', 'cesiumContent'], // 多级祖孙传值-接受方
  components: {
    messageLayout
  },
  data () {
    return {
      dataList2: [], // 二级区域
      dataList3: [],
      dataList4: [],
      online: '', // 在线人数
      leave: '', // 离线人数
      total: '', // 总人数
      personDistributionClickId: '', // 记录选择的区域id
      timer: null // 定时器
    }
  },
  created () {
    this.getDataList()
  },
  mounted () {
    this.timer = setInterval(() => {
      this._getDataList()
    }, 5000)
  },
  beforeDestroy () {
    clearInterval(this.timer)
  },
  computed: {},
  watch: {},
  methods: {
    // 获取初始数据列表
    async getDataList () {
      await getZonePerson()
        .then(({ data }) => {
          this.dataList2 = []
          this.dataList3 = []
          this.dataList4 = []
          if (data && data.code === 0) {
            this.dataListInitial = []
            data.zpeList.map(val => {
              val.wisdomZoneEntity.personList = val.personList
              if (val.wisdomZoneEntity.level === 2) {
                val.wisdomZoneEntity.subregion = []
                this.dataList2.push(val.wisdomZoneEntity)
              }
              if (val.wisdomZoneEntity.level === 3) {
                val.wisdomZoneEntity.subregion = []
                this.dataList3.push(val.wisdomZoneEntity)
              }
              if (val.wisdomZoneEntity.level === 4) {
                val.wisdomZoneEntity.subregion = []
                this.dataList4.push(val.wisdomZoneEntity)
              }
              this.dataListInitial.push(val.wisdomZoneEntity)
            })
            this.dataList2.map(val => {
              this.dataList3.map(val1 => {
                if (val1.parentId === val.id) {
                  val.subregion.push(val1)
                }
                this.dataList4.map(val2 => {
                  if (val2.parentId === val1.id) {
                    val1.subregion.push(val2)
                  }
                })
              })
            })
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
      getpersoncount({}).then(res => { // 临时修改
        if (res.data.code === 0) {
          this.online = res.data.personMap.onLine
          this.leave = res.data.personMap.leave + res.data.personMap.sleep
          this.total = res.data.personMap.sleep + res.data.personMap.onLine + res.data.personMap.leave
        }
      })
    },
    // 数据更新
    async _getDataList () {
      await getZonePerson().then(({ data }) => {
        this.dataListInitials = []
        if (data && data.code === 0) {
          data.zpeList.map(val => {
            val.wisdomZoneEntity.personList = val.personList
            this.dataListInitials.push(val.wisdomZoneEntity)
          })
          this.dataListInitial.map(val => {
            this.dataListInitials.map(val1 => {
              if (val.id === val1.id && val.personList !== val1.personList) {
                if (val1.level === 2) {
                  this.dataList2.map(item => {
                    if (val1.id === item.id) {
                      // 传递人员与区域信息数据
                      if (this.dataOne !== null) {
                        if (item.id === this.personDistributionClickId) {
                          this.showBillBoard(item)
                        }
                      }
                      item.personList = val1.personList
                      if (this.personDistributionClickId === val1.id && this.cesiumContent.comVisible.personListVisible === true) { // 实时更新人员点名表
                        this.cesiumContent.$refs.personList.dataList = val1.personList
                      }
                      if (this.personDistributionClickId === val1.id && this.cesiumContent.comVisible.mapDialogVisible === true) {
                        this.cesiumContent.$refs.mapDialog.dataList = val1.personList
                      }
                    }
                  })
                }
                if (val1.level === 3) {
                  this.dataList2.map(item => {
                    item.subregion.map(item1 => {
                      if (item1.id === val1.id) {
                        // 传递人员与区域信息数据
                        if (this.dataOne !== null) {
                          if (item1.id === this.personDistributionClickId) {
                            this.showBillBoard(item1)
                          }
                        }
                        item1.personList = val1.personList
                        if (this.personDistributionClickId === val1.id && this.cesiumContent.comVisible.personListVisible === true) { // 实时更新人员点名表
                          this.cesiumContent.$refs.personList.dataList = val1.personList
                        }
                        if (this.personDistributionClickId === val1.id && this.cesiumContent.comVisible.mapDialogVisible === true) {
                          this.cesiumContent.$refs.mapDialog.dataList = val1.personList
                        }
                      }
                    })
                  })
                }
                if (val1.level === 4) {
                  this.dataList2.map(item => {
                    item.subregion.map(item1 => {
                      item1.subregion.map(item2 => {
                        if (item2.id === val1.id) {
                          // 传递人员与区域信息数据
                          if (this.dataOne !== null) {
                            if (item2.id === this.personDistributionClickId) {
                              this.showBillBoard(item2)
                            }
                          }
                          item2.personList = val1.personList
                          if (this.personDistributionClickId === val1.id && this.cesiumContent.comVisible.personListVisible === true) { // 实时更新人员点名表
                            this.cesiumContent.$refs.personList.dataList = val1.personList
                          }
                          if (this.personDistributionClickId === val1.id && this.cesiumContent.comVisible.mapDialogVisible === true) {
                            this.cesiumContent.$refs.mapDialog.dataList = val1.personList
                          }
                        }
                      })
                    })
                  })
                }
              }
            })
          })
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })

      getpersoncount({}).then(res => { // 临时修改
        if (res.data.code === 0) {
          this.online = res.data.personMap.onLine
          this.leave = res.data.personMap.leave + res.data.personMap.sleep
          this.total = res.data.personMap.sleep + res.data.personMap.onLine + res.data.personMap.leave
        }
      })
    },
    // 点击表格一行展示信息
    cellTableClick (val, ignore) {
      this.dataOne = val
      this.personDistributionClick(val)

      if (val.buildId) { // 如果有建筑id 则显示分层页面
        this.showInside(val)
      } else { // 隐藏分层页面
        this.cesiumContent.comVisible.mapDialogVisible = false
      }

      // 显示人员点名表
      this.cesiumContent.comVisible.personListVisible = true
      this.cesiumContent.handleReset(['personSpreadVisible', 'personListVisible', 'mapDialogVisible'])
      this.$nextTick(() => {
        this.cesiumContent.$refs.personList.dataList = val.personList
        this.cesiumContent.$refs.mapDialog.dataList = val.personList
      })
    },
    // 点击人员分布的其中一行 显示体块
    personDistributionClick (val) {
      let children = []
      val.fencingList.map((value, index) => {
        let points = getPointer(value.coordinate)
        children.push({
          fenceID: value.id + ',' + new Date().getTime(),
          points: points,
          minH: value.minHeight ? value.minHeight : '10',
          maxH: value.maxHeight ? value.maxHeight : '200',
          color: 'rgba(0,198,255,0.5)'
        })
      })
      if (children.length <= 0) {
        this.$message.error('此区域暂未关联围栏！')
      } else {
        if (this.personDistributionClickId !== val.id) {
          // 如果有体块在显示 则先移除之前的
          this.cesiumMap.$refs.mapShow.removeAreaObjectLoc(
            'person_distribution',
            this.personDistributionClickId
          )
          this.personDistributionClickId = val.id
          this.cesiumMap.$refs.mapShow.initAreaObjectLoc(
            // 显示体块
            val.id,
            'person_distribution',
            'description',
            children,
            1,
            true
          )
          this.showBillBoard(val)
        }
      }
    },
    // 人员分布体块billboard
    showBillBoard (val) {
      console.log(val)
      this.cesiumMap.personDistributionData = {
        personNum: val.personList.length,
        code: val.code,
        zoneName: val.zoneName,
        show: true
      }
    },
    // 分层展示
    showInside (row) {
      this.cesiumContent.comVisible.mapDialogVisible = true
      this.$nextTick(() => {
        this.cesiumContent.$refs.mapDialog.init(row.buildId)
      })
    }
  }
}
</script>

<style lang="scss">
.cesium-person-spread-container {
  .personDistribution-table {
    height: calc(100vh - 95px);
    overflow: auto;
    background: rgba(45, 51, 78, 0);
    .show-inside-button {
      position: absolute;
      left: -10px;
      top: 7px;
      color: #4285f4;
      font-size: 18px;
    }
  }
  .bottom-online {
    padding: 3px;
  }
}
</style>
