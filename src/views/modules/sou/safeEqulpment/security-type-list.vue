<template>
  <div class='repository-container mod-config'>
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="getDataList()">
      <el-form-item label="类型名称"
                    prop="name">
        <el-input v-model="dataForm.name"
                  size="mini"
                  placeholder="类型名称"
                  clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="getDataList()"
                   icon="el-icon-search"
                   v-waves>

          查询</el-button>
        <el-button type="info"
                   size="mini"
                   icon="el-icon-refresh-right"
                   v-waves
                   @click="
                   resetForm('dataForm')">重置</el-button>
        <el-button type="warning"
                   size="mini"
                   icon="el-icon-plus"
                   v-waves
                   @click="addOrUpdateHandle()">新增设备</el-button>
        <el-button type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   @click="deleteHandle()"
                   v-waves
                   :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              ref="multipleTable"
              @cell-click="cellClick"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">

      <!-- <template slot-scope="scope">{{scope.row.name || '-'}}</template> -->

      <el-table-column type="id"
                       v-if="false"
                       :show-overflow-tooltip="true"
                       width="50"></el-table-column>
      <el-table-column type="selection"
                       width="50"></el-table-column>
<!--      <el-table-column prop="code"-->
<!--                       width="120"-->
<!--                       :show-overflow-tooltip="true"-->
<!--                       label="类型编号">-->
<!--      </el-table-column>-->
      <el-table-column prop="name"
                       width="120"
                       :show-overflow-tooltip="true"
                       label="类型名称">
      </el-table-column>
      <el-table-column prop="vaule"
                       width="120"
                       :show-overflow-tooltip="true"
                       label="设备分类">
        <template slot-scope="scope">{{filterType(scope.row.type)}}</template>
      </el-table-column>
      <el-table-column prop="model"
                       width="120"
                       label="型号">
      </el-table-column>
      <el-table-column prop="scopeApplication"
                       label="适用范围">
      </el-table-column>

      <el-table-column width="300"
                       prop="specifications"
                       :show-overflow-tooltip="true"
                       label="规格">
      </el-table-column>

      <el-table-column width="100"
                       label="操作">
        <template slot-scope="scope">

          <el-button type="text"
                     size="small"
                     @click.stop="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <!--          <el-button type="text"-->
          <!--                     size="small"-->
          <!--                     @click.stop="deleteHandle(scope.row.id,scope.row.name)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   :total="totalPage"
                   layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <edit-page v-if="addOrUpdateVisible"
               ref="addOrUpdate"
               @refreshDataList="getDataList"></edit-page>

  </div>
</template>

<script>
import waves from '@/utils/waves'
// eslint-disable-next-line no-unused-vars
import { safeEquipment, typeOfEquipment, safeTypedel } from '@/api/sou/safeEqument'
import { getLabels } from '@/api/common/sys'
import editPage from './security-type-add-or-update'

export default {
  directives: {
    waves
  },
  components: {
    editPage
  },
  data () {
    return {
      dataForm: {
        name: '',
        manageName: ''
      },
      codeType: [], // 字典表码值

      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      reservorListVisible: false// 库区列表

    }
  },

  mounted () { },
  activated () {
    this.getDataList()
  },
  created () {
    // this.getDataList()
  },
  watch: {},
  filters: {

  },
  methods: {
    filterType (val) {
      let codeAndType = ''
      this.codeType.map(vals => {
        if (Number(val) === Number(vals.sort)) {
          codeAndType = vals.value
        }
      })
      return codeAndType
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取数据列表
    getDataList () {
      // this.dataList = []
      this.codeType = []
      this.dataListLoading = true
      // 获取对应码值  getCodeOfType () {
      getLabels({
        type: 'safety_equipment_type'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.codeType = data.list
        }
      }).then(() => {
        safeEquipment({
          page: this.pageIndex,
          limit: this.pageSize,
          name: this.dataForm.name
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
          this.dataListLoading = false
        })
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
    // 查看库房列表
    reservorListHandle (id) {
      this.reservorListVisible = true
      this.$nextTick(() => {
        this.$refs.reservorList.init(id)
      })
    },
    // 删除
    deleteHandle (id, name) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      let nameArr = name ? [name] : this.dataListSelections.map(item => {
        return item.name
      })
      this.$confirm(`确定对[设备=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        safeTypedel(ids).then(({ data }) => {
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
  }
}
</script>

<style lang='scss' scoped>
.repository-container {
  .kufangNum {
    color: #2c78bb;
  }
  .kufangNum:hover {
    text-decoration: underline;
  }
}
</style>
