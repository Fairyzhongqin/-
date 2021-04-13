<!--常规作业活动-->
<template>
  <div class="mod-config mod-private-routine">
    <el-form :inline="true" ref="dataForm" @submit.native.prevent :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="作业活动名称" prop="operationName">
        <el-input v-model.trim="dataForm.operationName" placeholder="作业活动名称" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="实施单位名称" prop="deptName">
        <el-input v-model.trim="dataForm.deptName" placeholder="实施单位名称" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="地点名称" prop="zoneName">
        <el-input v-model.trim="dataForm.zoneName" placeholder="地点名称" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" v-waves><i class="el-icon-search"></i>查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="resetForm('dataForm')"v-waves>重置</el-button>
        <el-button type="warning" size="mini" icon="el-icon-plus" @click="addOrUpdateHandle()" v-waves>新增常规作业活动</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" v-waves>批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      ref="multipleTable"
      @cell-click="cellClick"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;">
      <el-table-column
        type="id"
        v-if="false"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column
        type="selection"
        width="40">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        width="62">
      </el-table-column>
      <el-table-column
        prop="operationName"
        show-overflow-tooltip
        label="作业活动名称">
      </el-table-column>
      <el-table-column
        prop="content"
        show-overflow-tooltip
        label="作业活动内容">
      </el-table-column>
      <el-table-column
        prop="zoneName"
        show-overflow-tooltip
        label="岗位/地点">
      </el-table-column>
      <el-table-column
        prop="deptName"
        show-overflow-tooltip
        label="实施单位">
      </el-table-column>
      <el-table-column
        prop="frequency"
        label="活动频率">
        <template slot-scope="scope">
          {{scope.row.frequency | formatFrequency(frequencyList)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="remarks"
        show-overflow-tooltip
        label="备注">
        <template slot-scope="scope">
          {{scope.row.remarks || '-'}}
        </template>
      </el-table-column>
      <el-table-column
        width="120"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click.stop="deleteHandle(scope.row.id, scope.row.name)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      background
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update  v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './private-routine-add-or-update'
import { rList, rDelete } from '@/api/pos/private'
import waves from '@/utils/waves'
export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        operationName: '',  // 作业活动名称
        deptName: '',       // 实施单位名称
        zoneName: ''        // 地点名称
      },
      frequencyList: [], // 活动频率list
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  computed: {

  },
  activated () {
    this.getDataList() // 获取数据列表
    this.getDictList() // 获取字典数据
  },
  created () {
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取字典数据列表，系统选项
    getDictList () {
      this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/dict/list'),
        method: 'get',
        params: this.$http.adornParams({
          'type': 'ACTIVITY_TYPE'
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data.page.list)
          this.frequencyList = data.page.list
        }
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      rList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'operationName': this.dataForm.operationName,  // 作业活动名称
        'deptName': this.dataForm.deptName,       // 实施单位名称
        'zoneName': this.dataForm.zoneName       // 地点名称
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          console.log(data.page.list)

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
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      let nameArr = name ? [name] : this.dataListSelections.map(item => {
        return item.name
      })
      this.$confirm(`确定对[报警描述=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rDelete(ids).then(({ data }) => {
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
        }).catch((err) => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
      }).catch(() => { })
    }
  },
  filters: {
    formatFrequency (value, map) {
      let optionName = ''
      map.map((val) => {
        if (value === val.label) {
          optionName = val.value
        }
      })
      return optionName
    }
  }
}
</script>
