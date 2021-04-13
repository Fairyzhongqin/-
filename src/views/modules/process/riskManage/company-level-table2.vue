<template >
  <div class='highrisk-type mod-config'>
    <el-table :data="dataList"
              border
              ref="multipleTable"
              @cell-click="cellClick"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">
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
      <el-table-column prop="createDate"
                       :show-overflow-tooltip="true"
                       label="创建时间">
      </el-table-column>
      <el-table-column prop="judgedCompany"
                       :show-overflow-tooltip="true"
                       label="公司名称">
      </el-table-column>
      <el-table-column prop="auditor"
                       :show-overflow-tooltip="true"
                       label="负责人">
        <template slot-scope="scope">
          {{scope.row.auditor === null ? '暂无' : scope.row.auditor}}
        </template>
      </el-table-column>
      <el-table-column width="100"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click.stop="viewRecord(scope.row.id)">查看记录</el-button>
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
  </div>
</template>

<script>
  // import addOrUpdate from './safety-risk-assessment-add-or-update'
  import { reportRecordList } from '@/api/process/riskJudgment'
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
      // addOrUpdate
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
        reportRecordList({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'status': this.dataForm.status,
          'judgedObject': '0'
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
      // 查看记录
      viewRecord (id) {
        this.$router.push({ path: '/process/riskManage/safety-risk-assessment-detailed', query: {id: id, preview: '3', level: '0'} })
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
