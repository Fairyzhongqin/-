<template>
  <div class="cesium-process-home-work-container">
    <message-layout name="作业管理">
      <el-table style="height: calc(100vh - 50px);overflow: auto;" :data="dataList" row-key="id" :expand-row-keys="expands" highlight-current-row :tree-props="{children: 'subregion'}" @row-click="rowClickTable">
        <el-table-column prop="zoneName" :show-overflow-tooltip="true" label="申请单位">
        </el-table-column>
        <el-table-column prop="riskLevel" label="作业状态" width="70px">
          <template slot-scope="scope">
            <div>完成</div>
          </template>
        </el-table-column>
      </el-table>
    </message-layout>
  </div>
</template>

<script>
import messageLayout from '../components/messageLayout'

import { privateList } from '@/api/pos/security'

export default {
  inject: ['cesiumMap'], // 多级祖孙传值-接受方
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
  created () {
    this.getDataList()
  },
  mounted () {
  },
  computed: {},
  watch: {},
  methods: {
    // 点击区域table单行
    rowClickTable (row) {
      console.log(row)
    },
    // 获取数据列表
    async getDataList () {
      this.dataListLoading = true
      privateList({
        page: 1,
        limit: 10
      }).then(({ data }) => {

      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang='scss'>
.cesium-process-home-work-container {
}
</style>
