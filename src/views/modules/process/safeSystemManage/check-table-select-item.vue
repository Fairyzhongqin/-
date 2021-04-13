<template>
  <el-dialog class="select-check-item" width="680px" title="选择检查项" :visible.sync="visible" append-to-body>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="检查项类型" prop="itemType">
        <el-select v-model="dataForm.itemType" clearable size="mini" placeholder="请选择">
          <el-option v-for="item in checkTypeList" :key="item.id" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList" icon="el-icon-search" v-waves>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" v-waves @click="resetForm('dataForm')">重置</el-button>
        <el-button type="primary" size="mini" @click="addOrUpdateHandle()" icon="el-icon-plus" v-waves>
          新增检查项</el-button>
        <el-button type="danger" size="mini" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" icon="el-icon-delete" v-waves>批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border ref="multipleTable" @cell-click="cellClick" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column type="index" width="60" label="序号" header-align="center" align="center"></el-table-column>
      <el-table-column label="检查项名称" prop="itemName" :show-overflow-tooltip="true" with="120">
      </el-table-column>
      <el-table-column label="检查项类型" prop="itemType" :show-overflow-tooltip="true" with="80" header-align="center" align="center">
        <template slot-scope="scope">
          <!-- <el-tag v-if="scope.row.itemType === '0'">{{ scope.row.itemType | formatType(checkTypeList)}}</el-tag>
          <el-tag v-if="scope.row.itemType === '1'" type="warning">{{scope.row.itemType | formatType(checkTypeList)}}</el-tag>
          <el-tag v-if="scope.row.itemType === '2'" type="success">{{scope.row.itemType | formatType(checkTypeList)}}</el-tag>
          <el-tag v-if="scope.row.itemType === '3'" type="info">{{scope.row.itemType | formatType(checkTypeList) }}</el-tag>
          <el-tag v-if="scope.row.itemType === '4'" type="danger">{{scope.row.itemType | formatType(checkTypeList)}}</el-tag>
          <el-tag v-if="scope.row.itemType === '5'" class="tag-style">{{scope.row.itemType | formatType(checkTypeList)}}</el-tag> -->
          {{scope.row.itemType | formatType(checkTypeList)}}
        </template>
      </el-table-column>
      <el-table-column label="检查方法" prop="method" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="检查标准" prop="standard" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" style="color:#E63031" @click.stop="deleteHandle(scope.row.id, scope.row.itemName)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <div slot="footer">
      <el-button @click="visible=false">取消</el-button>
      <el-button @click="addStaff()" type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getCheckItemList, checkItemsDelete } from '@/api/process/safeSystemManage'
import { getLabels } from '@/api/common/sys'

export default {
  data () {
    return {
      riskZoneList: [], // 所有的风险分区
      dataForm: {
        itemName: '', // 检查项名称
        itemType: '' // 检查项类型
      },
      checkTypeList: [], // 检查项类型列表
      dataList: [], // 列表数据
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      visible: false,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  created () {
    this.getDataList() // 获取数据列表
    this.getBaseData() // 获取字典表里的基础数据
  },
  mounted () { },
  activated () { },
  methods: {
    init () {
      this.visible = true
      this.isDisabled = false
      this.$nextTick(() => {
        this.$refs.multipleTable.clearSelection()
      })
    },
    // 从字典表获取规程状态类型
    getBaseData () {
      getLabels({
        type: 'CHECK_TABLE_TYPE'
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.checkTypeList = data.list
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => console.log(err))
    },
    // 获取所有的检查项
    getDataList () {
      this.dataListLoading = true
      getCheckItemList({
        page: this.pageIndex,
        limit: this.pageSize,
        itemName: this.dataForm.itemName,
        itemType: this.dataForm.itemType
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.count
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
        .catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
          this.dataListLoading = false
        })
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, '1')
      })
      // this.$router.push({ path: '/process/safeSystemManage/check-table-add-or-update', query: { id: id, preview: '1' } })
    },
    // 删除检查项
    deleteHandle (id, name) {
      let ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      let nameArr = name
        ? [name]
        : this.dataListSelections.map(item => {
          return item.itemName
        })
      this.$confirm(
        `确定对[检查项名称为=${nameArr.join(',')}]进行[${
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
          checkItemsDelete(ids)
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
    // 点击确定按钮，触发事件
    addStaff () {
      this.$emit('selectCheckItem', this.dataListSelections)
      this.visible = false
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
    }
  },
  filters: {
    formatType (value, map) {
      let optionName = ''
      map.map(val => {
        if (value === val.label) {
          optionName = val.value
        }
      })
      return optionName
    }
  }
}
</script>
<style lang="scss">
.select-check-item {
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
