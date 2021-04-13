<template>
  <div class="cesium-four-area-list-container">
    <message-layout name="四色区查看">
      <el-table style="height: calc(100vh - 50px);overflow: auto;" :data="dataList" row-key="id" :expand-row-keys="expands" highlight-current-row :tree-props="{children: 'subregion'}" @row-click="rowClickTable">
        <el-table-column prop="zoneName" :show-overflow-tooltip="true" label="[编号]名称">
          <template slot-scope="scope">
            <template v-if="scope.row.id != '0'">
              [{{scope.row.code}}]{{scope.row.zoneName}}
            </template>
            <template v-else>
              {{scope.row.zoneName}}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="riskLevel" label="危险等级" width="70px">
          <template slot-scope="scope">
            <div :style="'color:'+(scope.row.riskLevel === '0' ? '#ff0202' : scope.row.riskLevel === '1' ? '#ff5200' : scope.row.riskLevel === '2' ? '#d2b800' : scope.row.riskLevel === '3' ? '#0250ff' : '')">
              {{scope.row.riskLevel === '0' ? '重大风险' : scope.row.riskLevel === '1' ? '较大风险' : scope.row.riskLevel === '2' ? '一般风险' : scope.row.riskLevel === '3' ? '低风险' : '--'}}
            </div>
          </template>
        </el-table-column>
      </el-table>
    </message-layout>
  </div>
</template>

<script>
import messageLayout from '../components/messageLayout'

import { getPointer } from '@/utils/cesiumMap'

import { queryZoneInfo } from '@/api/pos/region'
import { getZonePerson } from '@/api/cesiumMap/index'

import waves from '@/utils/waves'
export default {
  inject: ['cesiumMap'], // 多级祖孙传值-接受方
  directives: {
    waves
  },
  components: {
    messageLayout
  },
  data () {
    return {
      name: '',
      current: 1,
      totalPage: 0,
      dataListLoading: false,
      expands: [],
      dataList: [], // 数据展示
      cacheID: null // 缓存点击的菜单id
    }
  },
  created () { },
  async mounted () {
    await this.getDataList()
    this.showFourColorArea()
  },
  computed: {},
  watch: {},
  methods: {
    // 点击区域table单行
    rowClickTable (row) {
      if (this.cacheID === row.id) { // 点击相同节点，不做任何处理
        return
      }
      this.cacheID = row.id
      this.clearFourColorArea()
      if (row.subregion && row.subregion.length > 0) {
        this.showFourColorArea(row)
      } else if (row.riskLevel) {
        this.showObject(row, true)
      }

      if (row.id !== '0') {
        this.$emit('handleClick', 'view-fance', row.fencingList, row)
      } else {
        // 获取全场同级区域
        getZonePerson().then(({ data }) => {
          let arr = []
          data.zpeList.map(val => {
            // 过滤1级、2级区域
            if (val.wisdomZoneEntity.level !== 1 && val.wisdomZoneEntity.level !== 2) {
              val.wisdomZoneEntity.fencingList.map(value => {
                value.riskLevel = val.wisdomZoneEntity.riskLevel
                arr.push(value)
              })
            }
          })
          // this.$emit('handleClick', 'view-fanceList', arr)
        })
      }
    },
    // 获取数据列表
    async getDataList () {
      this.dataListLoading = true
      await queryZoneInfo({
        name: this.name
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = [data.data] || []
          // 展开二级层级
          this.$nextTick(() => {
            let els = this.$el.getElementsByClassName('el-table__expand-icon')
            els[0].click()
          })
          this.dataListLoading = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    showFourColorArea (val) { // 显示四色区体块
      const formatArray = (array) => { // 递归所有色块
        if (array && array.subregion) {
          array.subregion.map(res => {
            if (res.riskLevel && res.fencingList) {
              this.showObject(res)
            }
            if (res.subregion) {
              formatArray(res)
            }
          })
        }
      }
      if (val) {
        formatArray(val)
      } else {
        formatArray(this.dataList[0])
      }
    },
    showObject (res, isTrack = false) { // 实现坐标转换并绘制体块
      let colors = ['rgba(250,0,0,0.5)', 'rgba(255,125,0,0.5)', 'rgba(255,255,0,0.5)', 'rgba(0,0,255,0.5)']
      let area = []
      res.fencingList.map((r, index) => {
        area.push({
          fenceID: res.id + ',' + index,
          points: getPointer(r.coordinate),
          minH: r.minHeight || '2',
          maxH: r.maxHeight || '30',
          color: colors[Number(res.riskLevel)]
        })
      })
      this.cesiumMap.$refs.mapShow.initAreaObjectLoc(
        res.code,
        'four_area',
        'description',
        area,
        -1,
        isTrack
      )
    },
    clearFourColorArea () { // 清除四色区体块
      this.cesiumMap.$refs.mapShow.removeAreaObjectLoc('four_area')
    }
  }
}
</script>

<style lang='scss'>
.cesium-four-area-list-container {
}
</style>
