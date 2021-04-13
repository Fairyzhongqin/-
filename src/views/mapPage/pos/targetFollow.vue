<!--
 * @Descripttion: 目标跟踪
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-11-26 15:07:15
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-12-03 09:30:32
 -->
<template>
  <div class="cesium-target-follow-container">
    <el-autocomplete class="inline-input" v-model="name" :fetch-suggestions="querySearch" :placeholder="searchType==='0'?'请输入姓名或工号':'请输入车牌号'" @select="handleSearch">
      <el-select v-model="searchType" slot="prepend" size="mini" placeholder="请选择">
        <el-option label="人员" value="0"></el-option>
        <el-option label="车辆" value="1"></el-option>
      </el-select>
    </el-autocomplete>
  </div>
</template>

<script>
import { pList } from '@/api/pos/person'
import { vehicleList } from '@/api/pos/vehicle'
import { getPersonPosition } from '@/api/cesiumMap/index'

export default {
  inject: ['cesiumMap', 'cesiumContent'], // 多级祖孙传值-接受方
  components: {
  },
  data () {
    return {
      name: '', // 员工姓名
      searchType: '0', // 查询类型 0：人、1：车
      personCache: null // 缓存锁定的人的id
    }
  },
  created () { },
  mounted () {
  },
  computed: {},
  watch: {},
  methods: {
    querySearch (queryString, cb) {  // 调用 callback 返回建议列表的数据
      queryString = queryString.split(' [')[0]
      let dataList = []
      if (queryString === '') {
        cb(dataList)
      } else {
        if (this.searchType === '0') { // 查询人
          pList({
            'conditions': queryString // 姓名或工号
          }).then(({ data }) => {
            if (data && data.code === 0) {
              dataList = data.page.list
              if (dataList.length <= 0) {
                dataList = [{ value: '暂无数据' }]
              } else {
                dataList.map(val => {
                  val.value = val.name + ' [' + val.gh + '] '
                })
              }
              cb(dataList)
            } else {
              dataList = [{ value: '暂无数据' }]
            }
          }).catch((err) => {
            console.log(err)
            cb(dataList)
            this.$message.error('未知异常！请联系管理员')
          })
        } else { // 查询车
          vehicleList({
            'numberPlates': queryString // 车牌号
          }).then(({ data }) => {
            if (data && data.code === 0) {
              dataList = data.page.list
              if (dataList.length <= 0) {
                dataList = [{ value: '暂无数据' }]
              } else {
                dataList.map(val => {
                  val.value = val.numberPlates
                })
              }
              cb(dataList)
            } else {
              dataList = [{ value: '暂无数据' }]
            }
          }).catch((err) => {
            console.log(err)
            cb(dataList)
            this.$message.error('未知异常！请联系管理员')
          })
        }
      }
    },
    // 目标跟踪
    handleSearch (val) {
      if (this.personCache) {
        this.cesiumMap.$refs.mapShow.setPtAminationVisible(null, [this.personCache], false, null) // 关闭之前的闪动效果
        this.cesiumMap.personLockCache = null
      }
      if (val.value === '暂无数据') {
        this.cesiumContent.comVisible.billBoardInfoVisible = false
        return
      }
      getPersonPosition({ bindId: (this.searchType === '0' ? val.gh : val.numberPlates) }).then(({ data }) => {
        if (data && data.code === 0) {
          if (data.cardEntity) {
            this.personCache = data.cardEntity.deveui // 缓存锁定的人
            this.cesiumMap.personLockCache = data.cardEntity.deveui

            data.cardEntity.status = this.cesiumMap.$refs.mapShow.mubiaogenzong(data.cardEntity.deveui, 'person')
            !data.cardEntity.status || this.cesiumMap.$refs.mapShow.setPtAminationVisible(null, [data.cardEntity.deveui], true, { color: '#00d400', radius: 50 }) // 闪动效果
            this.$emit('handleEvent', 'showWorkerInfo', data.cardEntity, this.searchType) // 显示人员信息看板
          } else {
            this.$emit('handleEvent', 'hideWorkerInfo')
            this.$message.error('该人员/车辆尚未绑定胸卡')
            this.personCache = null
          }
        } else if (this.searchType) {
          this.$message.error(data.msg)
          this.personCache = null
        }
      })
    }
  },
  beforeDestroy () {
    this.cesiumMap.$refs.mapShow.setPtAminationVisible(null, [this.personCache], false, null) // 关闭之前的闪动效果
    this.cesiumMap.personLockCache = null
  }
}
</script>

<style lang='scss'>
.cesium-target-follow-container {
  .el-autocomplete {
    .el-input-group__prepend {
      border: 0px;
      width: 60px;
      .el-input__inner {
        padding: 0 8px;
      }
      .el-input__suffix {
        right: 2px;
      }
    }
  }
}
</style>
