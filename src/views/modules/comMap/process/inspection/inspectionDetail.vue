<template>
  <div class="cesium-process-inspection-detail-container">
    <div class="info">
      <el-form ref="form" :model="dataForm" label-width="60px">
        <el-form-item label="任务名称：" label-width="65px" class="title">
          <span>{{dataForm.patrolTaskEntity?dataForm.patrolTaskEntity.name:'查询中'}}</span>
        </el-form-item>
      </el-form>
      <el-tag class="inspection-status" size="mini" :type="dataForm.status|filterStatus(true)">{{dataForm.status|filterStatus}}</el-tag>
    </div>
    <el-table :data="areaList" highlight-current-row @row-click="rowClickTable" style="width: 100%">
      <el-table-column prop="zoneShow" label="巡检区域" :show-overflow-tooltip="true" width="170px">
        <template slot-scope="scope">
          <span class="patrol-area">{{scope.row.zoneShow}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="patrolPointEntityList" label="巡检点数" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.patrolPointEntityList.length}}
        </template>
      </el-table-column>
    </el-table>
    <!-- 查看人员轨迹 -->
    <div class="person-history">
      <el-popover placement="top" trigger="click" popper-class="history-style">
        <div class="title">请选择工人</div>
        <el-button size="mini" v-for="(item,index) in personNameList" :key="index" class="item" @click="showHistory(index)">{{item}}</el-button>
        <el-button type="text" size="mini" slot="reference">查看巡检轨迹</el-button>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { patrolzoneList, stationInfo, pGet } from '@/api/pos/person'
import { getLabels } from '@/api/common/sys'

import { translateXyToLnglat } from '@/utils/cesiumMap'

export default {
  inject: ['cesiumMap', 'cesiumContent'], // 多级祖孙传值-接受方
  data () {
    return {
      dataForm: {},
      areaList: [], // 巡检区域列表
      facilityTypeList: [], // 设备设施类型字典表
      facilityTypeZHList: { // 中英文对照
        '反应装置': 'device',
        '存储设备': 'tank',
        '安全设备': 'safe'
      },
      row: null, // 列表页传递过来的值 在init方法中
      status: '', // 巡检任务制定状态
      teamId: '', // 班组id
      pointList: [], // 巡检点列表
      taskStatusList: [], // 巡检任务制定状态列表
      personIdList: [], // 人员ID
      personNameList: [], // 人员姓名
      patrolList: [], // 巡检类型
      base64Icons: {
        device: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAErUlEQVRIS72Xa0ybVRjH/6cXaAuUQrkNB87hIBLGMhBwwywkC8gM2xj4ATWZ2YzJNLoPM1Fn4lc1Ji66mEhMdGGJOBOdF7KxS8zGBsSBoOJkwmQqsNEBpS+UXnnLMc/blvbt23bDGM63nvd5zu881/OU4T4W51wHYBeAOgDlAAoApAZU5wGMARgAcAFAJ2PMfa9jWTwBzrkZwKsADgFII1mHIMI+I8LrWpZUE/QqpGRqkGTSBI+yAWgF8D5jzBrr/Jhgzvl+AMcAmAWLF2N9DkwOu+Ba8EU9S29UY32xHgWVSTDlJJAMQY8wxk5GU1CAOefawI0POgURP58VMHHddS/Pyb7nleix9UkTDH4vfEYeY4wthQvJwAHo1wB2Tw47ce2rOSy5+aqgQWGtjqHqqXSsLzbQVgeA5nB4JPhTAAfH+hfR/60N+G/M0EUZUNGYhoKKZMlyxtjzwY8r4EBM28jS7s+tK9C8zTowBlj+9MDrjH4TTQIDUyG6dxjw+LPmoOXPBWMugQPZO+IURHPncUvoAAY0vp4lXfJquw3WcVmYpP2iagO2PJEiXe6Pbid+PW9XhIbcvutwDsWcEq6Isj0IfhvA0Z722VUlUoKBofFoFlSqUMQ6P5zF/LSogFPCVT+TQfvvMMbeZIHmcEeweNPOHb8rU9AbVdgbsLj3lIDx3+R9IdmsRsORTJnOxVYrrBNKz5BQ/eFsKjWq81wC7wNweuB7G27+uCg7hOJmMKqlPY9zGaI3FOOUDDXqXjJDm6ha0bk75sGlE7GTctNjySjfI/WhJgJ/THX23bt3FM3BmKlGVbNJOnik14HxoZDFaQ9oUPdiBlzzPvR+KUCtZZi+5QWPUwnUZPa+kUvHtRK4zyGIFR3vTSnikrlBi50vUNcEhi7aMXzZIZOhi3mcHB6Hv33ez9r92jpqr/0EtlpuutMvn5hR6OUWJWLHfsk1GO5axNCFRTyyIwnrChMVsoNnFiBMKZMqUrDmQCZyNunmCCyODznVvaeU/ZxquLrF7+qxfid+OWfHo3uMeHCLXgG+ctKGmX+8WBY5fHH421vMyC81+OKCN5brUdnkf/1mJ7z4e9CNDVt1yMiXHgHZGulxwD7rgyaRSa7/azB6fw8Hx3R14TYDyhqMEmDiuhs9Xwioak7FQ2VKi7va5jA16kWCnqFkZzJuXHHAtaCMfbirYyZXcU0SSmtTJPDUqAddbTZsbzEhfzPNBfLV3W6TLK5/2QwWaCh938zj1k9yy8OTK2Y5ldYmo7hGavBS/H74ZA41B9KQ87AyuQY6FjB3ewm1h/xVQIsSbrTXufI7spxiNpCyhhQUbkuSFG1TSzj/kRX1r5hhyqEnW75uXHVg8nd3XHBkAyG/RW2ZlU1GbCyX3lPYrSLOHJtF81tZ0OpC3SqIJyjB41ksa5mkyDmP+khUP21CXok/ni67D2c/IHC2wlraWJgWce30fEyw4pEIgCkwimcxNVuDRIPfuuVlDtvtJZjzlKUU/C5YRKTnhsJAXqLMjvksBuA03CkGgajmrWYz3iAQPIdzvvajT8Bq8tPaD3thcBrI1268DQ/dmg/0EfC1/wsTcYH//U/bvwvzdV9s5PQkAAAAAElFTkSuQmCC',
        tank: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAADHElEQVRIS8WXW0yOYRzAf49QCakvh2IzQiZNE2Ns5MacJ43MIZOxbnIhNxpXjBtccKExTA4Tc5jz3IiNRWVZakLM1sGpEyKRx/7f+7729X6n+tjnufq+9/3/n9/zPz7/V9GNpbUOA+YDc4EUIB6INFVbgRqgDLgN3FRKtfvbVvkS0Fo7gFwgG4hyyjbXwoeX8LXFUO03CAaPgagR1lbNQD6wTynV6G1/r2CtdSawH3DQUAXFJ6HyBrQ2eN4rMhYSF8D0tRA7QWQEukUpVeBJwQ2ste5jnjiLljq4sgMqrvnzXNf3SYtgyU4YNFyeHxOPKaV+uAp1AZvQC8Bint6Ewhxo/9QzqCUdNhAyDsJESQ2uAumucDv4KJDFw1NwYSvoX4FBLS3VC9L3wrQ1TsuVUhv+vLJ+mDE94bS0YP3fQ13hmccty9dZMXdabGZvNS11DvbNDty93vwjbs+9KzGXhEuQbLfAu4FtFGR5T6SIaEicB45REB4JfSMMTEcbfGuFxtdQeQvamjzjJeEyJc/Yo5TKU2ZzqKehKor9qe5KvUNhVT4kLexevCuuw5ls+PndXX5LkZSa1HmcgNOAi1zaBg8kt2xLLBSFvuHdA3d8w2mAeMC+ZmyAtD3ydJmADzk7065kaK13F45wgFidshziZ8LQBBgwBHqFGLK/OuHze3hXDTX3oey8YW2bh6YVGQfby0UrX8CPaK6dyu7Jni2ashLm5MCTK/CmxGiXXz52le0fY7TNkVNh0hK4cxBKz3reL++xtNcSATfyvCiaIyu8gzMOuL+zalxq1b4KN3sHbzwH41KbBPyT8sshnN7UM7CviPsCrz4MyUs7/ys4MFcHarGLq/0nl6cYBwp2SS7f5SRZ/a/AtnLy3UCmZBjXW0+WXKelhX4biMxT3ltmRIzRY0dP7x76VTHOnt9mq3XRdm2Z8l9r7f+SiE2EsbNg2HiQMSe0v3GQ71+McejtM3hxDxoqPR/QfkmYYBnqgn8tmnAZ7oI7CFi+0VoHf/QxrZYJM/jDngtcBvLgjbeu6Rj0gd4GD/4njO0A//yj7Te1S5VQbd9hyAAAAABJRU5ErkJggg=='
      }
    }
  },
  created () {
  },
  beforeDestroy () {
    this.clearMap()
  },
  methods: {
    async init (row) {
      await this.getBaseData()
      this.row = row // 暂存
      this.clearMap()
      if (!row.taskId) { // 无值则不执行
        return
      }
      this.dataForm = row
      this.$nextTick(() => {
        patrolzoneList({ // 巡检区域列表
          taskId: row.taskId
        }).then(({ data }) => {
          if (data.list && data.code === 0) {
            this.areaList = data.list
            let num = 0 // 巡检点计数
            this.areaList.map(res => {
              if (res.patrolPointEntityList.length > 0) {
                res.patrolPointEntityList.map(point => {
                  this.showObject(point, num++)
                })
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        }).catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
        if (row.patrolTaskEntity.teamId) {
          this.selectInfo(row.patrolTaskEntity.teamId)
        }
      })
    },
    showObject (point, index) {
      if (!point.location) { // 为空跳出
        return
      }
      let p = point.location.split(',')
      let t = translateXyToLnglat(Number(p[0]), Number(p[1]))
      this.cesiumMap.$refs.mapShow.insertOrUpdateObjectLoc(
        this.facilityTypeZHList[this.facilityTypeList[point.facilityType].value],
        point.id,
        t.x,
        t.y,
        Number(p[2]),
        this.base64Icons[this.facilityTypeZHList[this.facilityTypeList[point.facilityType].value]],
        point.name,
        {
          font: '16pt',
          fillColor: 'rgba(255,255,255,1)',
          backgroundColor: 'rgba(0,0,0,0.9)',
          showBackground: true,
          pixeLoffset: [-(index.toString().length / 2) * 16, -25]
        },
        0,
        [18, 18]
      )
    },
    // 查询单个班组信息
    selectInfo (id) {
      stationInfo({ 'id': id }).then(({ data }) => {
        if (data && data.code === 0) {
          this.personIdList = data.data.personIdList
          this.personNameList = data.data.personNameList
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    showHistory (index) { // 展示人员轨迹
      if (this.personIdList.length > 0) {
        this.cesiumContent.comVisible.historyVisible = true
        this.$nextTick(async () => {
          if (this.row) {
            let iconType = await this.pGet(this.personIdList[index]) // 获取图标类型
            this.cesiumContent.$refs.history.loadHistory(this.row.planStartTime, this.row.planEndTime, this.personIdList[index], this.personNameList[index], iconType || 0)
          }
        })
      }
    },
    async pGet (gh) { // 查询人员信息
      if (!gh) return
      await pGet({ gh }).then(({ data }) => {
        if (data && data.code === 0) {
          return data.info.icon
        }
      }).catch(err => {
        console.log(err)
      })
      return null
    },
    // 加载基础数据
    async getBaseData () {
      await getLabels({
        'type': 'FACILITY_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.facilityTypeList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
      // 巡检任务状态
      getLabels({
        'type': 'WISDOM_PATROL_STATUS'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.taskStatusList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
      // 巡检类型
      getLabels({
        'type': 'PATROL_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.patrolList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    rowClickTable (row) {
      this.cesiumContent.comVisible.inspectionRouteVisible = true
      this.$nextTick(() => {
        this.cesiumContent.$refs.inspectionRoute.init(row.patrolPointEntityList)
      })
    },
    clearMap () {
      for (let item in this.facilityTypeZHList) {
        this.cesiumMap.$refs.mapShow.deleteObjectLoc(this.facilityTypeZHList[item], null)
      }
    }
  },
  filters: {
    formatType (value, map) {
      let optionName = ''
      map.map((val) => {
        if (value === val.label) {
          optionName = val.value
        }
      })
      return optionName
    },
    filterStatus (status, type) {
      let result = ''
      switch (status) {
        case '0':
          result = type ? 'info' : '未开始'
          break
        case '1':
          result = type ? 'warning' : '进行中'
          break
        case '2':
          result = type ? 'success' : '已完成'
          break
      }
      return result
    }
  }
}
</script>

<style lang="scss">
.cesium-process-inspection-detail-container {
  .info {
    .title {
      .el-form-item__label {
        color: #b7b8b9;
      }
    }
    .el-col-12 {
      height: 30px;
    }
    .el-form-item {
      margin: 5px 0;
    }
    .inspection-status {
      position: absolute;
      top: 41px;
      right: 10px;
    }
    .el-form-item__label {
      color: #fff;
      padding: 0;
    }
    .el-form-item__content {
      color: #fff;
      font-size: 12px;
    }
  }
  .person-history {
    position: absolute;
    bottom: 15px;
    left: calc(50% - 37px);
    .el-button {
      text-decoration: underline;
    }
  }
}
.patrol-area {
  &:hover {
    color: #05b9ed;
    text-decoration: underline;
  }
}
.el-popover.history-style {
  border: 1px solid #3365b7ad;
  background-color: rgba(0, 0, 0, 0.8);
  padding-bottom: 15px;
  .popper__arrow {
    &::after {
      bottom: 0px;
      border-top-color: #4285f4;
    }
  }
  .el-button {
    background-color: #006ac7ed;
    color: #ffffff;
    border: 0;
  }
  .title {
    width: 100%;
    text-align: center;
    color: #fff;
    margin-bottom: 10px;
  }
}
</style>