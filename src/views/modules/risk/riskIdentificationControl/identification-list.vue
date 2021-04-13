<!--风险辨识清单-->
<template>
  <div class="threshold mod-config identification">
    <el-form :inline="true" class="el-form-margin-bottom" :model="dataForm" ref="dataForm">
      <el-form-item label="风险点名称" prop="businessName">
        <el-input v-model="dataForm.businessName" size="mini" clearable placeholder="请输入风险点名称"></el-input>
      </el-form-item>
      <el-form-item label="所属区域" prop="zoneName">
        <el-popover v-model="popoverVisible" popper-class="high" placement="bottom-start" ref="zonePopover" trigger="click">

          <el-tree :data="graphList" :props="defaultProps" node-key="id" ref="zoneTree" @current-change="zoneSelectChange" default-expand-all :highlight-current="true" :expand-on-click-node="false">

          </el-tree>

        </el-popover>
        <el-input v-model="dataForm.zoneName" v-popover:zonePopover size="mini" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" v-waves>
          <i class="el-icon-search"></i>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="
                   resetForm('dataForm')" v-waves>重置</el-button>

      </el-form-item>
    </el-form>
    <el-tabs type="card" v-model="activeName" @tab-click="tabClick">
      <el-tab-pane label="LS评价表" name="first">
        <ls-table :queryConditions='{businessName:dataForm.businessName,zoneCode:dataForm.zoneCode}' ref="lsTable"></ls-table>
      </el-tab-pane>
      <el-tab-pane label="LEC评价表" name="second">
        <lec-table :queryConditions='{businessName:dataForm.businessName,zoneCode:dataForm.zoneCode}' ref="lecTable"></lec-table>
      </el-tab-pane>
      <el-tab-pane label="MES评价表" name="third">
        <mes-table :queryConditions='{businessName:dataForm.businessName,zoneCode:dataForm.zoneCode}' ref="mesTable"></mes-table>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>
<script>
import lecTable from './components/lec-table'
import mesTable from './components/mes-table'
import lsTable from './components/ls-table'

import waves from '@/utils/waves'

import { queryZoneInfo } from '@/api/pos/region'
export default {
  directives: {
    waves
  },
  data () {
    return {
      aa: { first: [], second: [] },
      activeName: 'first',
      riskZoneList: [], // 所有的风险分区
      dataForm: {
        businessName: '',
        zoneName: '',
        zoneCode: ''// 风险分区
      },
      popoverVisible: false, // 菜单树是否可见
      defaultProps: {
        label: 'zoneName',
        children: 'subregion'
      },
      dataListSelections: [], // 多选数据
      likelihoodList: [], // 事故发生的所有可能性List
      exposureList: [], // 暴露于危险环境的频繁程度所List
      criticalityList: [], // 发生事故产生的后果List
      dangerDegreeList: [], // 危险程度List
      measuresList: [], // 控制措施的状态lIst
      exposeList: [], // 暴露危险List
      consequencelist: [], // 发生事故产生的后果List
      riskList: [], // 风险
      graphList: [] // 风险分区列表

    }
  },
  components: {
    lecTable, mesTable, lsTable
  },

  created () {
    this.getAllZoneList()
  },
  methods: {
    tabClick (e, v) {

    },
    // 获取所有的区域
    getAllZoneList () {
      this.dataListLoading = true
      queryZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          this.graphList = [data.data] || []
        } else {
          this.graphList = []
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },

    // 当前菜单树选中
    zoneSelectChange (data, node) {
      // 当前节点的数据，对象
      this.dataForm.zoneCode = data.id
      this.dataForm.zoneName = data.zoneName
      this.popoverVisible = false
    },

    // 新增 / 修改
    addOrUpdateHandle (tableInfo, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(tableInfo, type)
      })
    },
    getDataList () {
      if (this.activeName === 'first') {
        this.$refs.lsTable.getDataList()
      } else if (this.activeName === 'second') {
        this.$refs.lecTable.getDataList()
      } else if (this.activeName === 'third') {
        this.$refs.mesTable.getDataList()
      }
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.dataForm.zoneCode = ''
      this.$nextTick(() => {
        this.getDataList()
      })
    }

  },
  filters: {
    match (val, list) {
      let finalVal = ''
      list.map(value => {
        if (val === value.label) {
          finalVal = value.value
        }
      })
      return finalVal
    }
  }
}
</script>
<style lang="scss">
.identification {
  .el-tabs,
  .el-tabs__content {
    height: calc(100% - 40px);
  }
  .el-tab-pane {
    height: 100%;
  }
  .lecTable {
  }
  .el-table {
    height: calc(100% - 56px);
    overflow: auto;
  }
  .el-table thead.is-group th {
    background: linear-gradient(0deg, #ced1d6, #e4e7ea);
  }
}
</style>
