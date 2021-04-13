<template>
  <el-dialog class="select-staff" width="650px" title="选择人员" :visible.sync="innerVisible" append-to-body>
    <el-table :data="dataList" border :class="isRadio?'radio-table':''" @row-click="clickRow" height="250" @select="onTableSelect" ref="multipleTable" v-loading="dataListLoading" @select-all="selectAll" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="gh" v-if="false" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="姓名"></el-table-column>
      <el-table-column prop="gh" header-align="center" align="center" :show-overflow-tooltip="true" label="工号"></el-table-column>
      <!-- <el-table-column prop="cgformName" header-align="center" align="center" label="人员类型"></el-table-column> -->
    </el-table>
    <div slot="footer">
      <el-button @click="innerVisible=false">取消</el-button>
      <el-button @click="addStaff()" type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { pTypeList } from '@/api/pos/person'
import { getByDeptList } from '@/api/sys/depart'
export default {
  data () {
    return {
      dataForm: {
        cgformId: '', // 人员类型
        conditions: '' // 姓名或工号
      },
      cgformIdList: [], // 人员类型列表
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      selectChange: {}, // 选中项的值
      addOrUpdateVisible: false,
      innerVisible: true
    }
  },
  props: {
    isRadio: {
      type: Boolean,
      default: false
    }
  },
  created () {
    this.getBaseData()
  },
  methods: {
    init (deptId, select) {
      console.log(select, '11111111111111111111111')
      this.innerVisible = true
      this.$nextTick(() => {
        this.dataListSelections = []
        this.getDataList(deptId) // 获取数据列表
        this.selectChange = select
        this.$refs.multipleTable.data.map(r => {
          if (r.gh === select.gh) {
            this.$refs.multipleTable.toggleRowSelection(r, true)
          }
        })
      })
    },
    // 获取数据列表
    getDataList (deptId) {
      this.dataListLoading = true
      getByDeptList({
        // 'page': this.pageIndex,
        // 'limit': this.pageSize,
        'deptId': deptId
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.list
        } else {
          this.dataList = []
          this.totalPage = 0
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
      // 查询共有哪些人员类型 - 初始数据
      pTypeList().then(({ data }) => {
        if (data && data.code === 0) {
          this.cgformIdList = data.list
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
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
    // 单选
    selectionChangeHandle (val) {
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val.pop())
      } else {
        this.selectChange = val.pop()
      }
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
    },
    // 返回选中人员
    addStaff () {
      this.innerVisible = false
      this.$emit('refreshment', this.selectChange)
      this.dataListSelections = []
    },
    // 请求选中标签
    tagChanged (personIds) {
      if (personIds && personIds.length >= 1) {
        this.dataListSelections = []
        personIds.map(val => {
          this.dataList.map(vals => {
            if (val === vals.gh) {
              this.dataListSelections.push(vals)
            }
          })
        })
      }
      this.$nextTick(function () {
        this.dataListSelections.map((val, index) => {
          this.dataList.map((vals, indexs) => {
            if (val.gh === vals.gh) {
              this.$refs.multipleTable.toggleRowSelection(this.dataList[indexs], true)
            }
          })
        })
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
.select-staff {
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
