<template >
  <div class='highrisk-type mod-config'>
    <el-table :data="dataList"
              border
              ref="multipleTable"
              @cell-click="cellClick"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">
      <el-table-column type="selection"
                       width="50"></el-table-column>
      <el-table-column prop="id"
                       label="ID"
                       :show-overflow-tooltip="true"
                       v-if="false"
                       width="60"></el-table-column>
      <el-table-column type="index"
                       label="序号"
                       align="center"
                       :show-overflow-tooltip="true"
                       width="60"></el-table-column>
      <el-table-column prop="reportTitle"
                       :show-overflow-tooltip="true"
                       label="报告标题">
      </el-table-column>
      <el-table-column prop="reportName"
                       :show-overflow-tooltip="true"
                       label="报告名称">
      </el-table-column>
      <el-table-column prop="msg"
                       :show-overflow-tooltip="true"
                       label="报告内容">
        <template slot-scope="scope">
          {{scope.row.msg | replaceVariable}}
        </template>
      </el-table-column>
      <el-table-column prop="sort"
                       :show-overflow-tooltip="true"
                       label="报告顺序">
      </el-table-column>
      <el-table-column prop="reportLevel"
                       :show-overflow-tooltip="true"
                       label="模板等级">
        <template slot-scope="scope">
          {{scope.row.reportLevel | formatType(typeList)}}
        </template>
      </el-table-column>
      <el-table-column prop="reportType"
                       :show-overflow-tooltip="true"
                       label="模板类型">
        <template slot-scope="scope">
          {{scope.row.reportType === '0' ? '状态':'承诺'}}
        </template>
      </el-table-column>
      <el-table-column prop="status"
                       :show-overflow-tooltip="true"
                       label="报告状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==='0'"
                  type="danger">失效</el-tag>
          <el-tag v-if="scope.row.status==='1'"
                  type="success">生效</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="100"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click.stop="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text"
                     size="small"
                     @click.stop="deleteHandle(scope.row.id,scope.row.reportName)">删除</el-button>
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
  import addOrUpdate from './production-safety-add-update'
  import { reportTemplateList, reportTemplateDel } from '@/api/sou/productionSafety'
  import { getLabels } from '@/api/common/sys'
  export default {
    data () {
      return {
        dataForm: {
          status: ''// 报告状态
        },
        dataList: [], // 列表数据
        typeList: [], // 模板等级
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
    },
    activated () {
      this.getDataList()
    },
    mounted () { },

    components: {
      addOrUpdate
    },
    methods: {
      // 点击一行选中
      cellClick (row) {
        this.$refs.multipleTable.toggleRowSelection(row)
      },
      // 获取数据列表
      getDataList (status) {
        this.dataForm.status = status
        this.dataListLoading = true
        this.getBaseData()
        reportTemplateList({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'status': this.dataForm.status,
          'reportLevel': '0'
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
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
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
            return item.reportName
          })
        this.$confirm(`确定对[安全生产报告名称为=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            reportTemplateDel(ids)
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
      // 加载基础数据
      getBaseData () {
        // 风险研判模板等级 - 字典
        getLabels({
          'type': 'REPORT_LEVEL'
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.typeList = data.list
          } else {
            this.$message.error(data.msg)
          }
        }).catch(err => console.log(err))
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
      replaceVariable (value) {
        value = value.replace(/\$#|#\$/g, '')
        return value
      },
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
  .highrisk-type {
    .el-scrollbar__wrap {
      height: 200px;
    }
    /deep/ .select {
      .el-input {
        .el-select__caret {
          line-height: 0;
        }
      }
    }
  }
</style>
