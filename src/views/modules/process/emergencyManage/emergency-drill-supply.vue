<!-- 选择应急物资 -->
<template>
  <el-dialog class="planning-check-staff" width="600px" title="选择应急物资" :visible.sync="innerVisible" append-to-body v-dialogDrag>
    <el-table :data="dataList" border @row-click="clickRow" row-key="id" height="204" ref="multipleTable" v-loading="dataListLoading" @selection-change="handleSelectionChange" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="suppliesName" label="物资名称" width="120" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="suppliesType" label="物资类型" width="120" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="purpose" label="主要用途" width="120" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="num" label="数量" :show-overflow-tooltip="true"></el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <div slot="footer">
      <el-button @click="innerVisible=false">取消</el-button>
      <el-button @click="dataFormSubmit()" type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { emergencyMaterial } from '@/api/process/emergencyPlan'
import waves from '@/utils/waves'
export default {
  directives: {
    waves
  },
  data () {
    return {
      popoverVisible: false,
      dataForm: {
        suppliesName: '', // 物资名称
        suppliesType: ''// 物资类型
      },
      dataList: [], // 物资列表数据
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      innerVisible: true,
      selectChange: {}// 选中项
    }
  },
  created () {

  },
  methods: {
    async init (select) {
      this.innerVisible = true
      this.dataListSelections = []
      this.dataList = []
      await this.getDataList()
      this.$nextTick(() => {
        this.selectChange = select
        console.log(this.selectChange, '1111111111111111111111111')
        if (select) {
          this.$refs.multipleTable.data.forEach(res => {
            select.forEach(r => {
              if (res.id === r.suppliesId) {
                this.$refs.multipleTable.toggleRowSelection(res, true)
              }
            })
          })
        }
      })
    },
    // 获取部门树
    // 获取表格内容
    async getDataList () {
      this.dataListLoading = true
      await emergencyMaterial({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'suppliesName': this.dataForm.suppliesName,
        'suppliesType': this.dataForm.suppliesType
      }).then(({ data }) => {
        if (data && data.code === 0) {
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
    handleSelectionChange (val) {
      this.selectChange = val
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.dataForm.departName = ''
      this.dataList = []
    },
    // 返回选中人员
    dataFormSubmit () {
      this.innerVisible = false
      this.$emit('selectStaffEmit', this.selectChange)
      this.dataListSelections = []
    },
    // 点击行选中
    clickRow (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 移除所选人员标签
    handleClose (tag) {
      this.dataList.map((vals, index) => {
        if (tag.gh === vals.gh) {
          this.$refs.multipleTable.toggleRowSelection(this.dataList[Number(index)], false)
        }
      })
      this.dataListSelections.splice(this.dataListSelections.indexOf(tag), 1)
    }
  }
}
</script>
<style lang="scss">
.planning-check-staff {
  .depart-form.el-form {
    padding-right: 0;
  }
  .select-depart .el-input__inner {
    // width: 517px;
  }
  .personAdd {
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    min-height: 39px;
    max-height: 90px;
    overflow-y: hidden;
    padding: 5px;
    width: 100%;
    overflow-x: hidden;
    .personAddover {
      width: 104%;
      min-height: 20px;
      max-height: 80px;
      overflow-y: auto;
      .el-tag {
        margin-left: 10px;
      }
    }
  }
  .el-pagination {
    text-align: right;
    margin-top: 8px;
  }
  .radio-table {
    thead {
      .el-table-column--selection {
        .cell {
          display: none;
        }
      }
    }
  }
}
</style>
