<!--应急演练-->
<template>
  <div class="emergency-drill-container mod-config">
    <el-form :inline="true" ref="dataForm" class="el-form-margin-bottom" :model="dataForm" @submit.native.prevent @keyup.enter.native="getDataList()">
      <el-form-item label="应急预案" prop="contingencyPlanId">
        <el-select v-model="dataForm.contingencyPlanId" placeholder="请选择">
          <el-option v-for="item in contingencyPlanList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" icon="el-icon-search" v-waves>查询</el-button>
        <el-button type="info" size="mini" @click="resetForm('dataForm')" icon="el-icon-refresh-right" v-waves>重置</el-button>
        <el-button type="warning" size="mini" @click="addOrUpdateHandle()" icon="el-icon-plus" v-waves>新增应急演练</el-button>
        <el-button type="danger" size="mini" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" icon="el-icon-delete" v-waves>批量删除</el-button>
        <el-button type="primary" size="mini" @click="submitHandle()" :disabled="dataListSelections.length <= 0" v-waves>
          <icon-svg name="tijiao" class="tijiao"></icon-svg>批量提交
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border @cell-click="cellClick" ref="multipleTable" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column type="index" label="序号" width="60" align="center">
      </el-table-column>
      <el-table-column prop="name" label="演练计划名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="contingencyPlanName" label="应急预案名称" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="drillTime" label="计划演练时间" width="150">
      </el-table-column>
      <el-table-column prop="mode" :show-overflow-tooltip="true" label="演练方式" width="120" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.mode === '0'">{{scope.row.mode | formatType(drillModeList)}}</el-tag>
          <el-tag v-if="scope.row.mode === '1'" type="warning">{{scope.row.mode | formatType(drillModeList)}}</el-tag>
          <el-tag v-if="scope.row.mode === '2'" type="success">{{ scope.row.mode | formatType(drillModeList)}}</el-tag>
          <el-tag v-if="scope.row.mode === '3'" type="danger">{{scope.row.mode | formatType(drillModeList)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="aim" :show-overflow-tooltip="true" label="演练目的">
      </el-table-column>
      <el-table-column label="组织部门" prop="organzizationDeptName" :show-overflow-tooltip="true" width="100" align="center">
      </el-table-column>
      <el-table-column prop="coordinationDeptName" :show-overflow-tooltip="true" label="配合部门" align="center" width="100">
      </el-table-column>
      <el-table-column prop="arr" :show-overflow-tooltip="true" label="应急物资准备" align="center" width="100">
        <template slot-scope="scope">
          <el-popover placement="bottom" width="300" trigger="click" popper-class="emergencyMaterial">
            <el-table :data="scope.row.arr" border>
              <el-table-column prop="suppliesName" :show-overflow-tooltip="true" label="应急物资名称" align="center">
              </el-table-column>
              <el-table-column prop="num" :show-overflow-tooltip="true" label="应急物资数量" align="center">
              </el-table-column>
            </el-table>
            <el-button type="text" slot="reference">查看明细</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label=" 操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click.stop="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <detail-view v-if="detailViewVisible" ref="detailView"></detail-view>
  </div>
</template>
<script>
import AddOrUpdate from './emergency-drill-add-or-update'
import { drillList, drillDelete, contingencyList } from '@/api/process/emergencyPlan'
import { getLabels } from '@/api/common/sys'
export default {
  data () {
    return {
      dataForm: {
        state: '', // 状态
        contingencyPlanId: '' // 应急预案id
      },
      dataList: [],
      factorTypeList: [], // 风险类型列表
      stateList: [],
      drillModeList: [], // 演练方式列表
      contingencyPlanList: [], // 应急预案列表
      // 弹框显示
      addOrUpdateVisible: false,
      detailViewVisible: false,
      dataListLoading: false,
      downloadUrl: '', // 文件下载路径
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      dataListSelections: [] // 多选数据
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList()
    this.getBaseData()
    this.getContingencyList()
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取表格内容
    getDataList () {
      this.dataListLoading = true
      drillList({
        page: this.pageIndex,
        limit: this.pageSize,
        factorMainId: this.dataForm.factorMainId,
        contingencyPlanId: this.dataForm.contingencyPlanId
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.count
          } else {
            this.$message.error(data.msg)
          }
          this.dataListLoading = false
        })
        .catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
          this.dataListLoading = false
        })
    },
    // 获取表格内容
    getContingencyList () {
      this.dataListLoading = true
      contingencyList({
        page: 1,
        limit: 50,
        state: '2'
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.contingencyPlanList = data.page.list
            this.totalPage = data.page.count
          } else {
            this.$message.error(data.msg)
          }
          this.dataListLoading = false
        })
        .catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
          this.dataListLoading = false
        })
    },
    // 加载基础数据
    getBaseData () {
      // 获取数据类型
      getLabels({
        type: 'ACCIDENT_TYPE'
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.factorTypeList = data.list
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => console.log(err))
      // 获取演练方式
      getLabels({
        type: 'DRILL_TYPE'
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.drillModeList = data.list
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => console.log(err))
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 删除
    deleteHandle (id, name) {
      let ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      let nameArr = name
        ? [name]
        : this.dataListSelections.map(item => {
          return item.name
        })
      this.$confirm(
        `确定对[演练计划名称为=${nameArr.join(',')}]进行[${
        id ? '删除' : '批量删除'
        }]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          drillDelete(ids)
            .then(({ data }) => {
              if (data && data.code === 0) {
                this.getDataList()
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1200,
                  onClose: () => { }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
            .catch(err => {
              console.log(err)
              this.$message.error('未知异常！请联系管理员')
            })
        })
        .catch(() => { })
    }
  },
  filters: {
    formatType (val, map) {
      let optionName = ''
      map.map(item => {
        if (val === item.label) {
          optionName = item.value
        }
      })
      return optionName
    }
  }
}
</script>
<style lang="scss">
.emergency-drill-container {
  .el-input--medium .el-input__icon {
    line-height: 28px;
  }
  .tijiao {
    margin-right: 5px;
    vertical-align: top;
  }
}
.emergencyMaterial {
  min-height: 200px;
  // 表格样式
  .el-table {
    .el-table__header-wrapper {
      thead {
        tr {
          .is-leaf {
            padding: 4px 0;
            background: #fff !important;
          }
        }
      }
    }
  }
}
</style>
