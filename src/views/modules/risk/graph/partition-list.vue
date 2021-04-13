<!--四色区设置 -->
<template>
  <div class="fourColorZone mod-config">

    <el-table :data="dataList" row-key="id" border default-expand-all ref="multipleTable" v-loading="dataListLoading" highlight-current-row @cell-click="cellClick" :tree-props="{children:'subregion'}" style="width:100%">

      <el-table-column prop="zoneName" min-width="150" label="区域名称">

      </el-table-column>
      <el-table-column prop="code" min-width="150" label="区域编号">
        <template slot-scope="scope">
          <template v-if="scope.row.id !== '0'">
            {{scope.row.code}}
          </template>
        </template>
      </el-table-column>

      <el-table-column prop="riskLevel" label="风险等级">
        <template slot-scope="scope">
          <template v-if="scope.row.id !== '0'">
            <el-tag v-if="scope.row.riskLevel === '0'" size="mini" class="redStyle">{{scope.row.riskLevel | riskMatch(riskList)}}</el-tag>
            <el-tag v-else-if="scope.row.riskLevel === '1'" size="mini" class="orangeStyle">{{scope.row.riskLevel | riskMatch(riskList)}}</el-tag>
            <el-tag v-else-if="scope.row.riskLevel === '2'" size="mini" class="yellowStyle">{{scope.row.riskLevel | riskMatch(riskList)}}</el-tag>
            <el-tag v-else-if="scope.row.riskLevel === '3'" size="mini" class="blueStyle">{{scope.row.riskLevel | riskMatch(riskList)}}</el-tag>
            <span v-else>-</span>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { queryZoneInfo } from '@/api/pos/region'

import { getLabels } from '@/api/common/sys.js'

export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      riskList: [],
      redFlag: '',
      orangeFlag: false,
      yellowFlag: false,
      blueFlag: false
    }
  },

  activated () {
    this.getZoneList()
    this.initGetLabelRisk()
  },
  created () {
    this.getZoneList()
    this.initGetLabelRisk()
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 查询所有区域
    getZoneList () {
      this.dataListLoading = true
      queryZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = [data.data] || []

          this.dataListLoading = false
        }
      })
    },
    // 在字典表里查询事故发生的可能性
    initGetLabelRisk () {
      getLabels({
        type: 'risk_level'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.riskList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  },
  filters: {
    riskMatch (val, map) {
      let riskName = ''
      map.map(value => {
        if (val === value.label) {
          riskName = value.value
        }
      })
      return riskName
    }
  }
}
</script>
<style lang="scss">
.fourColorZone {
  .el-row {
    padding-bottom: 10px;
  }
  .redStyle {
    padding: 0px 5px;
    color: #fff;
    background-color: red;
  }
  .orangeStyle {
    padding: 0px 5px;
    color: #fff;
    background-color: orange;
  }
  .yellowStyle {
    padding: 0px 5px;
    color: gray;
    background-color: yellow;
    border-color: #d5e4f1;
  }
  .blueStyle {
    padding: 0px 5px;
    color: #fff;
    background-color: blue;
  }
}
</style>
