<template>
  <div class="mod-dict mod-config">
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="getDataList()"
             @submit.native.prevent>
      <el-form-item prop="type">
        <el-input v-model="dataForm.type"
                  placeholder="类型"
                  size="mini"
                  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="getDataList()"
                   size="mini"
                   v-waves> <i class="el-icon-search"></i>查询</el-button>
        <el-button @click="resetForm('dataForm')"
                   size="mini"
                   icon="el-icon-refresh-right"
                   v-waves>重置</el-button>
        <el-button type="primary"
                   @click="addOrUpdateHandle()"
                   size="mini"
                   icon="el-icon-plus"
                   v-waves>新增</el-button>
        <el-button type="danger"
                   icon="el-icon-delete"
                   size="mini"
                   @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0"
                   v-waves>批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              ref="dataList"
              border
              @cell-click="cellClick"
              @sort-change="sortChange"
              @row-click="clickRow"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">
      <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="50">
      </el-table-column>
      <el-table-column prop="id"
                       header-align="center"
                       align="center"
                       width="80"
                       v-if="false"
                       label="ID">
      </el-table-column>
      <el-table-column prop="label"
                       header-align="center"
                       align="center"
                       label="key键">
      </el-table-column>
      <el-table-column prop="value"
                       header-align="center"
                       align="center"
                       label="value值">
      </el-table-column>
      <el-table-column prop="type"
                       header-align="center"
                       :show-overflow-tooltip="true"
                       align="center"
                       label="类型">
      </el-table-column>
      <el-table-column prop="sort"
                       header-align="center"
                       align="center"
                       label="排序">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.sort"
                           size="mini"
                           @blur="updateSorting(scope.row.id,scope.row.sort)"
                           @change="updateSorting(scope.row.id,scope.row.sort)"
                           :min="0"
                           label="排序"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="remarks"
                       header-align="center"
                       align="center"
                       label="描述">
      </el-table-column>
      <el-table-column
                       header-align="center"
                       align="center"
                       width="100"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text"
                     size="small"
                     @click="deleteHandle(scope.row.id,scope.row.label)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background
                   v-if="paginationShow"
                   @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page.sync="pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   :total="totalPage"
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './dict-add-or-update'
import { updateSort } from '@/api/common/sys'
import waves from '@/utils/waves'
export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        type: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      sidx: '', // 排序名
      sord: '', // 排序方式：升序ASE，降序DESC
      paginationShow: true, // 初始化分页器
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      tableHeight: 0
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    // table高度固定
    this.$nextTick(() => {
      let manHeight = document.documentElement['clientHeight']
      this.tableHeight = manHeight - 105 - this.$refs.dataForm.$el.clientHeight - 75 - 32
    })
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.dataList.toggleRowSelection(row)
    },
    // 更新排序值
    updateSorting (id, sort) {
      updateSort({
        'id': id,
        'sort': sort
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // 成功后刷新table
          this.getDataList()
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/dict/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'type': this.dataForm.type,
          'sidx': this.sidx,
          'sord': this.sord
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.count
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      })
    },
    // 排序
    sortChange (data) {
      // 排序方式：升序ASE，降序DESC
      if (data.order) {
        this.sord = (data.order === 'ascending' ? 'ASC' : 'DESC')
        this.sidx = data.prop
      } else {
        this.sord = ''
        this.sidx = ''
      }
      this.paginationShow = false
      this.pageIndex = 1
      this.$nextTick(function () {
        this.paginationShow = true
      })
      this.getDataList()
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
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
    },
    // 删除
    deleteHandle (id, name) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      var labels = name ? [name] : this.dataListSelections.map(item => {
        return item.label
      })
      this.$confirm(`确定对[label=${labels}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/spring-sysweb/sys/dict/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        })
      }).catch(() => {
      })
    },
    // 选中行
    clickRow (row) {
      // this.$refs.dataList.toggleRowSelection(row)
    }
  }
}
</script>
<style lang="scss">
  .mod-dict{
    .el-form-item{
      margin-bottom: 12px;
    }
  }
</style>
