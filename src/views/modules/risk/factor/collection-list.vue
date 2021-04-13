<template xmlns="">
  <div class='partition-container mod-config'>
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="getDataList()">

      <el-form-item label="危险类型"
                    prop="type">
        <el-select v-model="dataForm.type"
                   clearable
                   size="mini"
                   placeholder="请选择风险类型">
          <el-option v-for="item in typeList"
                     :key="item.label"
                     :label="item.value"
                     :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item width="50"
                    label="危险因素"
                    prop="riskFactor">
        <el-input v-model="dataForm.riskFactor"
                  size="mini"
                  placeholder="危险因素"
                  clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="getDataList"
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
                   @click="addOrUpdateHandle()"
                   v-waves>新增</el-button>
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

      <el-table-column type="selection"
                       width="50"></el-table-column>
      <el-table-column type="index"
                       width="50"
                       label="序号"></el-table-column>
      <el-table-column prop="type"
                       :show-overflow-tooltip="true"
                       label="风险类型"
                       width="200">
        <template slot-scope="scope">
          {{scope.row.type | formatType(typeList)}}
        </template>
      </el-table-column>
      <el-table-column prop="riskFactor"
                       :show-overflow-tooltip="true"
                       label="风险因素">
      </el-table-column>
      <el-table-column prop="danger"
                       label="可能导致的危险">
      </el-table-column>
      <el-table-column width="100"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click.stop="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text"
                     size="small"
                     @click.stop="deleteHandle(scope.row.id,scope.row.riskFactor)">删除</el-button>
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
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import addOrUpdate from './collection-add-or-update'
import waves from '@/utils/waves'
import { getLabels } from '@/api/common/sys'
import { factorList, factorDelete } from '@/api/risk/factor'
export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        type: '', // 风险类型
        riskFactor: '' // 危险因素
      },
      // 危险类型0:危险1 1:危险2
      typeList: [], // 风险类型
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
    this.getBaseData()// 获取字典表里的基础数据
  },
  mounted () { },
  // activated () {
  //   this.getDataList() // 获取数据列表
  // },
  components: {
    addOrUpdate
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },

    // 加载基础数据
    getBaseData () {
      getLabels({
        'type': 'accident_type'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.typeList = data.list
          // console.log(this.optionList)
          // console.log(data)
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      factorList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'riskFactor': this.dataForm.riskFactor,
        'type': this.dataForm.type
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
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
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      console.log(id)
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        // this.from = 'person'
        this.$refs.addOrUpdate.init(id)
      })
    },
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
      this.$confirm(`确定对[风险因素名称为=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          factorDelete(ids)
            .then(({ data }) => {
              if (data && data.code === 0) {
                console.log(data)
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

<style lang="scss" scoped>
.partition-container {
  .el-scrollbar__wrap {
    height: 200px;
  }
}
</style>
