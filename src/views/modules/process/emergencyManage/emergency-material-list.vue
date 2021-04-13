<!--应急物资管理-->
<template>
  <div class="emergency-plan-container mod-config">
    <el-form :inline="true" ref="dataForm" class="el-form-margin-bottom" :model="dataForm" @submit.native.prevent @keyup.enter.native="getDataList()">
      <el-form-item label="物资名称" prop="suppliesName">
        <el-input v-model="dataForm.suppliesName" size="mini" clearable placeholder="请输入物资名称"></el-input>
      </el-form-item>
      <el-form-item label="物资类型" prop="suppliesType">
        <el-select v-model="dataForm.suppliesType" size="mini" clearable>
          <el-option v-for="item in suppliesTypeList" :key="item" :value="item" :label="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" icon="el-icon-search" v-waves>查询</el-button>
        <el-button type="info" size="mini" @click="resetForm('dataForm')" icon="el-icon-refresh-right" v-waves>重置</el-button>
        <el-button type="warning" size="mini" @click="addOrUpdateHandle()" icon="el-icon-plus" v-waves>新增物资管理</el-button>
        <el-button type="danger" size="mini" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" icon="el-icon-delete" v-waves>批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border @cell-click="cellClick" ref="multipleTable" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column type="index" label="序号" width="60" align="center">
      </el-table-column>
      <el-table-column prop="suppliesName" label="物资名称" width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="suppliesType" label="物资类型" width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="model" label="型号" width="80" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="specification" label="规格" width="120" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="purpose" label="主要用途" min-width="120" :show-overflow-tooltip="true"></el-table-column>

      <el-table-column prop="num" label="数量" width="70" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="unit" label="单位" width="60" :show-overflow-tooltip="true"></el-table-column>

      <el-table-column prop="remarks" label="备注" min-width="120" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id)">修改</el-button>

          <el-button type="text" style="color:#E63031" size="small" @click.stop="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" @backSupplyType="backSupplyType"></add-or-update>
  </div>
</template>
<script>
// import AddOrUpdate from './planning-add-or-update'
// eslint-disable-next-line no-unused-vars
import { emergencyMaterial, emergencyMaterialDelete, supplyType } from '@/api/process/emergencyPlan'
import { getLabels } from '@/api/common/sys'
import addOrUpdate from './emergency-material-add-or-update'
export default {
  data () {
    return {
      dataForm: {
        suppliesType: '',
        suppliesName: ''
      },
      suppliesTypeList: [], // 物资类型
      dataList: [],
      stateList: [], // 提交状态列表
      factorTypeList: [], // 风险类型列表
      // 弹框显示
      addOrUpdateVisible: false,
      dataListLoading: false,
      downloadUrl: '', // 文件下载路径
      pageIndex: 1,
      pageSize: 20,
      totalPage: 0,
      dataListSelections: [] // 多选数据
    }
  },
  components: {
    addOrUpdate
  },
  created () {
    this.getDataList()
    this.getBaseData()
    this.getEmengercyType()
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    backSupplyType (type) {
      // console.log('12131', type)
      if (this.suppliesTypeList.indexOf(type) === -1) {
        this.suppliesTypeList.push(type)
      }
    },
    // 获取应急物资类型
    getEmengercyType () {
      supplyType().then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)

          this.suppliesTypeList = data.list
        }
      })
    },
    // 获取表格内容
    getDataList () {
      this.dataListLoading = true
      emergencyMaterial({
        page: this.pageIndex,
        limit: this.pageSize,
        suppliesName: this.dataForm.suppliesName,
        suppliesType: this.dataForm.suppliesType
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
      // let nameArr = name
      //   ? [name]
      //   : this.dataListSelections.map(item => {
      //     return item.name
      //   })
      this.$confirm(`确定进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          emergencyMaterialDelete(ids)
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
