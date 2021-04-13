<!--检查项列表  -->
<template>
  <div class="check-table-list-container mod-config">
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="检查表名称" prop="name">
        <el-input v-model="dataForm.name" class="check" placeholder="检查表名称" clearable></el-input>
      </el-form-item>
      <!-- <el-form-item label="检查表" prop="type">
        <el-select v-model="dataForm.itemType" clearable size="mini" placeholder="请选择">
          <el-option v-for="item in checkTypeList" :key="item.id" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList" icon="el-icon-search" v-waves>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" v-waves @click="resetForm('dataForm')">重置</el-button>
        <el-button type="primary" size="mini" @click="addOrUpdateHandle()" icon="el-icon-plus" v-waves>
          新增检查表</el-button>
        <el-button type="danger" size="mini" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" icon="el-icon-delete" v-waves>批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border ref="multipleTable" @cell-click="cellClick" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column type="index" width="60" label="序号" header-align="center" align="center"></el-table-column>
      <el-table-column label="检查表名称" prop="name" :show-overflow-tooltip="true" with="250">
      </el-table-column>
      <!-- <el-table-column label="检查表类型" prop="type" :show-overflow-tooltip="true" with="200" header-align="center" align="center">
        <template slot-scope="scope">
          {{scope.row.type||'-'}}
        </template>
      </el-table-column> -->
      <el-table-column label="检查人" prop="checkPerson" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="检查时间" prop="checkDate" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="检查计划" prop="plan" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="检查目的" prop="aim" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="检查要求" prop="requirement" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="检查记录" prop="hookRecord" :show-overflow-tooltip="true"></el-table-column>

      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" style="color:#E63031" @click.stop="deleteHandle(scope.row.id, scope.row.name)">删除</el-button>
          <el-button type="text" size="small" @click.stop="detailHandle(scope.row.id)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import { getcheckTableList, checkTableDelete } from '@/api/process/safeSystemManage'
import { getLabels } from '@/api/common/sys'

import addOrUpdate from './check-table-add-or-update'
export default {
  components: {
    addOrUpdate
  },
  data () {
    return {
      riskZoneList: [], // 所有的风险分区
      dataForm: {
        name: ''// 检查表名称
      },
      checkTypeList: [], // 检查项类型列表
      dataList: [], // 列表数据
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
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
  activated () {
    this.getDataList() // 获取数据列表
    this.getBaseData() // 获取字典表里的基础数据
  },
  methods: {
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
      getcheckTableList({
        page: this.pageIndex,
        limit: this.pageSize,
        name: this.dataForm.name,
        type: this.dataForm.type
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.count
            // console.log(this.dataList, '111111')
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
    // 查看检查表
    detailHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id, '2')
      })
    },
    // 删除检查表
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
        `确定对[检查表名称为=${nameArr.join(',')}]进行[${
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
          checkTableDelete(ids)
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
.check-table-list-container {
  .check {
    .el-input__suffix {
      top: -4px;
    }
  }
  .tag-style {
    background-color: #efebf7;
    border-color: #d5c6f4;
    color: #7f6f9a;
  }
}
</style>
