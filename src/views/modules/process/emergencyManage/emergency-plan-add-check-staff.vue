<!-- 选择部门下的人员 -->
<template>
  <el-dialog class="planning-check-staff" width="600px" title="选择部门人员" :visible.sync="innerVisible" append-to-body>
    <!-- 所选人员 -->
    <el-form :inline="true" ref="dataForm" :model="dataForm" class="depart-form">
      <el-form-item prop="departId" label="部门">
        <el-popover v-model="popoverVisible" ref="departPopover" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.departName" v-popover:departPopover :readonly="true" size="mini" class="select-depart" placeholder="请选择部门" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getStaffDataList()">查询</el-button>
        <el-button type="info" size="mini" @click="resetForm('dataForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border @row-click="clickRow" row-key="id" height="204" ref="multipleTable" v-loading="dataListLoading" @selection-change="handleSelectionChange" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="姓名"></el-table-column>
      <el-table-column prop="gh" header-align="center" align="center" :show-overflow-tooltip="true" label="工号"></el-table-column>
      <el-table-column prop="description" header-align="center" align="center" label="职位"></el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <div slot="footer">
      <el-button @click="innerVisible=false">取消</el-button>
      <el-button @click="dataFormSubmit()" type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { departList, employeeList } from '@/api/sys/depart'
import waves from '@/utils/waves'
export default {
  directives: {
    waves
  },
  data () {
    return {
      popoverVisible: false,
      dataForm: {
        id: '',
        departId: '', // 部门id
        departName: ''// 部门名称
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      departList: [], // 部门树列表
      defaultProps: {
        label: 'deptName',
        children: 'child'
      }, // 树形结构展示
      current: 1,
      addOrUpdateVisible: false,
      innerVisible: true,
      selectChange: {}// 选中项
    }
  },
  props: {
    isRadio: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    init (select) {
      this.innerVisible = true
      this.$nextTick(() => {
        this.getDepartList()
        this.dataListSelections = []
        this.dataList = []
        this.dataForm.departName = ''
        this.$nextTick(() => {
          this.selectChange = select
          this.$refs.multipleTable.data.map(r => {
            if (r.gh === select.gh) {
              this.$refs.multipleTable.toggleRowSelection(r, true)
            }
          })
        })
      })
    },
    // 获取部门树
    // 获取数据列表
    getDepartList () {
      this.dataListLoading = true
      departList().then(({ data }) => {
        if (data && data.code === 0) {
          // this.dataList = treeDataTranslate2(data.data.subregion, 'id', 'parentId')
          // console.log(data)
          this.departList = [data.data[0]] || []
          this.dataForm.departId = this.departList[0].id
          this.dataForm.departName = this.departList[0].deptName
          console.log(this.dataForm.deptId, '部门树0000000')
          this.dataListLoading = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 部门菜单树选中
    departListTreeCurrentChangeHandle (data, node) {
      // 当前节点的数据，对象
      this.dataForm.departId = data.id
      this.dataForm.departName = data.deptName
      this.popoverVisible = false
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
    // 单选
    handleSelectionChange (val) {
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val.pop())
      } else {
        this.selectChange = val.pop()
      }
      console.log(this.selectChange)
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
    // 获取员工列表
    getStaffDataList () {
      this.dataListLoading = true
      employeeList({
        'page': this.current,
        'limit': '10',
        'deptId': this.dataForm.departId
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.count
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 点击行选中
    clickRow (row) {
      if (this.dataListSelections.indexOf(row) !== -1) {
        this.$refs.multipleTable.toggleRowSelection(row, false)
        this.dataListSelections.splice(this.dataListSelections.indexOf(row), 1)
      } else {
        this.$refs.multipleTable.toggleRowSelection(row)
      }
    },
    // 移除所选人员标签
    handleClose (tag) {
      this.dataList.map((vals, index) => {
        if (tag.gh === vals.gh) {
          this.$refs.multipleTable.toggleRowSelection(this.dataList[Number(index)], false)
        }
      })
      this.dataListSelections.splice(this.dataListSelections.indexOf(tag), 1)
    },
    // 单行数据选中发生变化时
    onTableSelect (rows, row) {
      if (this.isRadio) this.dataListSelections = []
      let selected = rows.length && rows.indexOf(row) !== -1
      if (selected !== true) {
        this.dataListSelections.splice(this.dataListSelections.indexOf(row), 1)
      }
    },
    // 触发全选与取消
    selectAll (selection) {
      if (selection.length <= 0) {
        this.dataList.map(val => {
          this.dataListSelections.map((vals, index) => {
            if (val.gh === vals.gh) {
              this.dataListSelections.splice(index, 1)
            }
          })
        })
      }
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
