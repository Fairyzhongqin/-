<!--应急演练记录-->
<template>
  <div class="emergency-drill-record-container mod-config">
    <el-form :inline="true" ref="dataForm" class="el-form-margin-bottom" :model="dataForm" @submit.native.prevent @keyup.enter.native="getDataList()">
      <el-form-item label="演练计划" prop="drillId">
        <el-select v-model="dataForm.drillId" placeholder="请选择">
          <el-option v-for="item in drillList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" v-waves>查询</el-button>
        <el-button type="info" size="mini" @click="
                   resetForm('dataForm')" v-waves>重置</el-button>
        <el-button type="warning" size="mini" @click="addOrUpdateHandle()" icon="el-icon-plus" v-waves>新增应急演练记录</el-button>
        <el-button type="danger" size="mini" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" icon="el-icon-delete" v-waves>批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border @cell-click="cellClick" ref="multipleTable" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column type="index" label="序号" width="60" align="center">
      </el-table-column>
      <el-table-column prop="name" label="演练计划名称" :show-overflow-tooltip="true" min-width="120"></el-table-column>
      <el-table-column prop="contingencyPlanName" label="应急预案名称" min-width="120"></el-table-column>
      <el-table-column prop="drillTime" :show-overflow-tooltip="true" label="计划演练时间" width="140">
      </el-table-column>
      <el-table-column prop="mode" :show-overflow-tooltip="true" label="演练方式" width="95" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.mode==='0'">{{scope.row.mode|formatType(drillModeList)}}</el-tag>
          <el-tag v-if="scope.row.mode==='1'" type="warning">{{scope.row.mode|formatType(drillModeList)}}</el-tag>
          <el-tag v-if="scope.row.mode==='2'" type="success">{{scope.row.mode|formatType(drillModeList)}}</el-tag>
          <el-tag v-if="scope.row.mode==='3'" type="danger">{{scope.row.mode|formatType(drillModeList)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="aim" :show-overflow-tooltip="true" label="演练目的" min-width="80">
      </el-table-column>
      <el-table-column prop="organzizationDeptName" label="组织部门" :show-overflow-tooltip="true" width="80" align="center">
      </el-table-column>
      <el-table-column prop="coordinationDeptName" :show-overflow-tooltip="true" label="配合部门" align="center" width="80">
      </el-table-column>
      <el-table-column prop="compilingPerson" :show-overflow-tooltip="true" label="编制人" align="center" width="80">
      </el-table-column>
      <el-table-column prop="drillProcess" :show-overflow-tooltip="true" label="演练过程描述" min-width="110">
      </el-table-column>
      <el-table-column prop="existImproved" :show-overflow-tooltip="true" label="存在问题和改进措施" min-width="130">
      </el-table-column>
      <el-table-column prop="noticeProblem" :show-overflow-tooltip="true" label="注意问题" min-width="80">
      </el-table-column>
      <el-table-column prop="summary" :show-overflow-tooltip="true" label="演练小结" min-width="80">
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click.stop="deleteHandle(scope.row.id,scope.row.name)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<script>
import AddOrUpdate from './emergency-drill-record-add-or-update'
import { drillRecordList, drillRecordDelete, drillList } from '@/api/process/emergencyPlan'
import { getLabels } from '@/api/common/sys'
export default {
  data () {
    return {
      dataForm: {
        drillId: '' // 演练计划id
      },
      dataList: [],
      drillList: [],
      drillModeList: [], // 演练方式列表
      contingencyPlanList: [], // 应急预案列表
      // 弹框显示
      addOrUpdateVisible: false,
      detailViewVisible: false,
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
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
    this.getDrillList()
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取表格内容
    getDataList () {
      this.dataListLoading = true
      drillRecordList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'drillId': this.dataForm.drillId
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data, '演练记录1111111111111111111111')
          this.dataList = data.page.list
          this.totalPage = data.page.count
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 获取演练计划列表
    getDrillList () {
      this.dataListLoading = true
      drillList({
        'page': this.pageIndex,
        'limit': this.pageSize
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.drillList = data.page.list
          this.totalPage = data.page.count
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 加载基础数据
    getBaseData () {
      // 获取演练方式
      getLabels({
        'type': 'DRILL_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.drillModeList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
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
      this.$confirm(`确定对[演练计划名称为=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          drillRecordDelete(ids)
            .then(({ data }) => {
              if (data && data.code === 0) {
                this.getDataList()
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
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
.emergency-drill-record-container {
  .el-input--medium .el-input__icon {
    line-height: 28px;
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
