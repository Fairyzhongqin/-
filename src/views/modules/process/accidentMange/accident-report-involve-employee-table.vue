<template>
  <el-dialog title="选择涉及人员" :visible.sync="visible" width="650px" append-to-body class="involve-employ">
    <el-table :data="dataList" border ref="multipleTable" @cell-click="cellClick" v-loading="dataListLoading" style="width: 100%;" max-height="300px" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column type="id" v-if="false" width="50">
      </el-table-column>
      <el-table-column prop="gh" label="工号" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="name" label="姓名" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="description" label="职位" :show-overflow-tooltip="true">
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancle()">取 消</el-button>
      <el-button type="primary" @click="close()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { employeeList } from '@/api/sys/depart'

export default {
  data () {
    return {
      visible: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataList: [],
      selectData: []
    }
  },
  methods: {
    async init (deptId, selected) {
      this.visible = true
      // 获取员工列表
      this.selectData = selected
      console.log(this.selectData)
      await this.getDataList(deptId)
      this.$nextTick(() => {
        if (selected.length > 0) {
          console.log('111111111111', this.$refs.multipleTable.data, selected)
          this.selectData = selected
          this.$refs.multipleTable.data.map(item => {
            selected.map(res => {
              if (res.employeeGh === item.gh) {
                this.$refs.multipleTable.toggleRowSelection(item, true)
              }
            })
          })
        }
      })
    },
    async getDataList (deptId) {
      // this.dataListLoading = true
      this.dataList = []
      await employeeList({
        page: this.pageIndex,
        limit: this.pageSize,
        'deptId': deptId
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.count
        } else {
          this.dataList = []
          this.totalPage = 0
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 选中某一行
    cellClick (raw) {
      this.$refs.multipleTable.toggleRowSelection(raw)
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
    handleSelectionChange (val) {
      this.selectData = val
      console.log(this.selectData)
    },
    // 关闭弹窗 触发回显事件
    close () {
      this.$emit('refreshSelect', this.selectData)
      this.selectData = []
      this.visible = false
    },
    cancle () {
      this.visible = false
      this.selectData = []
      console.log(this.selectData)
    }
  }
}
</script>
<style lang="scss">
.involve-employ {
  .el-pagination {
    text-align: right;
    margin-top: 8px;
  }
}
</style>