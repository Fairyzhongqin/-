<!--应急预案-->
<template>
  <div class="emergency-plan-container mod-config">
    <el-form :inline="true" ref="dataForm" class="el-form-margin-bottom" :model="dataForm" @submit.native.prevent @keyup.enter.native="getDataList()">
      <el-form-item label="事故类型" prop="factorMainId">
        <el-select v-model="dataForm.factorMainId" placeholder="请选择">
          <el-option v-for="item in factorTypeList" :key="item.label" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预案状态" prop="state">
        <el-select v-model="dataForm.state" placeholder="请选择">
          <el-option v-for="item in stateList" :key="item.label" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" icon="el-icon-search" v-waves>查询</el-button>
        <el-button type="info" size="mini" @click="resetForm('dataForm')" icon="el-icon-refresh-right" v-waves>重置</el-button>
        <el-button type="warning" size="mini" @click="addOrUpdateHandle()" icon="el-icon-plus" v-waves>新增应急预案</el-button>
        <el-button type="danger" size="mini" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" icon="el-icon-delete" v-waves>批量删除</el-button>
        <el-button type="primary" size="mini" @click="submitHandle()" :disabled="dataListSelections.length <= 0" v-waves>
          <icon-svg name="tijiao" class="piliang"></icon-svg>批量提交
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border @cell-click="cellClick" ref="multipleTable" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="60">
      </el-table-column>
      <el-table-column prop="name" :show-overflow-tooltip="true" label="预案名称"></el-table-column>
      <el-table-column prop="factorMainName" label="事故类型"></el-table-column>
      <el-table-column prop="date" :show-overflow-tooltip="true" label="提交日期" width="160" align="center">
      </el-table-column>
      <el-table-column prop="state" :show-overflow-tooltip="true" label="状态" width="160" align="center">
        <template slot-scope="scope">
          <template v-if="scope.row.state">
            <el-tag v-if="scope.row.state === '0'">{{scope.row.state | formatType(stateList)}}</el-tag>
            <el-tag v-if="scope.row.state === '1'" type="warning">{{scope.row.state | formatType(stateList)}}</el-tag>
            <el-tag v-if="scope.row.state === '2'" type="success">{{scope.row.state | formatType(stateList)}}</el-tag>
            <el-tag v-if="scope.row.state === '3'" type="danger">{{scope.row.state | formatType(stateList)}}</el-tag>
          </template>
          <template v-else>
            <span>-</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="附件" prop="fileName" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <a @click.stop="downHandle(scope.row.attachmentId)" title="下载">{{scope.row.fileName}}</a>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id)" :disabled=" scope.row.state === '0' || scope.row.state === '3' ? false : true">编辑</el-button>
          <el-button type="text" size="small" @click.stop="submitHandle(scope.row.id, scope.row.name)" :disabled="scope.row.state === '0' || scope.row.state === '3' ? false : true">提交</el-button>
          <el-button type="text" size="small" @click.stop="deleteHandle(scope.row.id)" :disabled="scope.row.state === '0' ? false : true">删除</el-button>
          <el-button type="text" size="small" @click.stop="detailViewHandle(scope.row.id, scope.row.opinion, scope.row.state) " :disabled="scope.row.state === '2' || scope.row.state === '3' ? false : true">查看</el-button>
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
import AddOrUpdate from './emergency-plan-add-or-update'
import detailView from './emergency-plan-detail-view'
import { contingencyList, contingencyDelete, contingencySubmit } from '@/api/process/emergencyPlan'
import { getLabels } from '@/api/common/sys'
export default {
  data () {
    return {
      dataForm: {
        factorMainId: '', // 风险类型
        state: '' // 状态
      },
      dataList: [],
      stateList: [], // 提交状态列表
      factorTypeList: [], // 风险类型列表
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
    AddOrUpdate,
    detailView
  },
  created () {
    this.getDataList()
    this.getBaseData()
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取表格内容
    getDataList () {
      this.dataListLoading = true
      contingencyList({
        page: this.pageIndex,
        limit: this.pageSize,
        factorMainId: this.dataForm.factorMainId,
        state: this.dataForm.state
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
    // 加载基础数据
    getBaseData () {
      // 应急预案状态
      getLabels({
        type: 'EMERGENCY_PLAN_TYPE'
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.stateList = data.list
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => console.log(err))
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
    selectionHanle () { },
    // 下载处理
    downHandle (id) {
      let token = document.cookie.split('=')[1]
      this.downloadUrl = this.$http.adornUrl(`/spring-processweb/attachment/download?id=${id}&token=${token}`)
      window.location.href = this.downloadUrl
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
        `确定对[事故类型名称为=${nameArr.join(',')}]进行[${
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
          contingencyDelete(ids)
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
    // 提交
    submitHandle (id, name) {
      let ids = id
        ? [{ id: id, state: '1' }]
        : this.dataListSelections.map(item => {
          let obj = {}
          obj.id = item.id
          obj.state = '1'
          return obj
        })
      let nameArr = name
        ? [name]
        : this.dataListSelections.map(item => {
          return item.name
        })
      this.$confirm(
        `确定对[预案名称为=${nameArr.join(',')}]进行[${
        id ? '提交' : '批量提交'
        }]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          contingencySubmit(ids)
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
    // 查看
    detailViewHandle (id, opinion, state) {
      this.detailViewVisible = true
      this.$nextTick(() => {
        this.$refs.detailView.init(id, opinion, state)
      })
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
.emergency-plan-container {
  .el-input--medium .el-input__icon {
    line-height: 28px;
  }
  .tijiao {
    margin-right: 5px;
    vertical-align: top;
    margin-top: 1px;
  }
}
</style>
