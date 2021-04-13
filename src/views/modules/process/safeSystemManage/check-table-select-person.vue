<template>
  <el-dialog class="select-staff" width="750px" title="选择人员" :visible.sync="innerVisible" append-to-body>
    <!-- 所选人员 -->
    <el-form :inline="true" ref="dataForm" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-row>
        <el-col :span="9">
          <el-form-item label="姓名/工号" size="mini" prop="conditions">
            <el-input v-model="dataForm.conditions" placeholder="姓名/工号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-button type="primary" size="mini" @click="getDataList()">
              <i class="el-icon-search"></i>
              查询
            </el-button>
            <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="
                   resetForm('dataForm')">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-table :data="dataList" border :class="isRadio?'radio-table':''" @row-click="clickRow" height="204" @select="onTableSelect" ref="multipleTable" v-loading="dataListLoading" @select-all="selectAll" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="gh" v-if="false" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column>
      <el-table-column prop="name" header-align="center" align="center" label="姓名"></el-table-column>
      <el-table-column prop="gh" header-align="center" align="center" :show-overflow-tooltip="true" label="工号"></el-table-column>
      <el-table-column prop="cgformName" header-align="center" align="center" label="人员类型"></el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <div slot="footer">
      <el-button @click="innerVisible=false">取消</el-button>
      <el-button @click="addStaff()" type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { pList, pTypeList } from '@/api/pos/person'
import staffIcon from '@/assets/img/staffIcon.png'
import waves from '@/utils/waves'

export default {
  directives: {
    waves
  },
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
      selectChange: {},
      dataListLoading: false,
      dataListSelections: [],
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
  methods: {
    init (personIds) {
      this.innerVisible = true
      this.$nextTick(() => {
        this.dataListSelections = []
        this.getDataList(personIds) // 获取数据列表
        this.getBaseData() // 加载基础数据
      })
    },
    // 获取数据列表
    getDataList (personIds) {
      this.dataListLoading = true
      pList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'cgformId': this.dataForm.cgformId, // 人员类型
        'conditions': this.dataForm.conditions // 姓名或工号
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list.map(value => {
            if (value.photo) value['photoList'] = [value.photo]
            value.photoNew = staffIcon
            return value
          })
          this.tagChanged(personIds)
          this.totalPage = data.page.count
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
    // 多选
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
      this.$emit('selectStaffEmit', this.selectChange)
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
