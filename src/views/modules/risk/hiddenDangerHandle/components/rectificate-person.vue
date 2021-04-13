<template>
  <el-dialog
    title="选择整改人"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="600px"
    class="selectPerson"
  >
    <el-table
      v-loading="dataListLoading"
      :data="personList"
      @selection-change="handleSelectionChange"
      @row-click="clickRow"
      style="width: 100%;cursor:pointer"
      row-key="id"
      border
      lazy
      default-expand-all
      highlight-current-row
      ref="multipleTable"
      tooltip-effect="dark"
    >
      <el-table-column type="selection" width="70"> </el-table-column>
      <el-table-column type="id" v-if="false" width="50"> </el-table-column>
      <el-table-column prop="gh" label="工号" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="name" label="姓名" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column
        prop="description"
        label="职位"
        :show-overflow-tooltip="true"
      >
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="10"
      :pager-count="5"
      layout="prev, pager, next"
      :total="totalPage"
      :current-page.sync="current"
      @current-change="handleBuyerCurrentChange"
    >
    </el-pagination>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { employeeList } from '@/api/sys/depart'

export default {
  data () {
    return {
      visible: false,
      personList: [],
      dataListLoading: false,
      current: 1,
      totalPage: 0,
      selectChange: {} // 选中项的值
    }
  },
  methods: {
    async init (deptId, selectedPersongh) {
      this.visible = true
      await this.getPersonList(deptId)
      this.$nextTick(() => {
        if (selectedPersongh) {
          this.$refs.multipleTable.data.map(r => {
            if (r.gh === selectedPersongh) {
              this.$refs.multipleTable.toggleRowSelection(r, true)
              this.selectChange = r
            }
          })
        }
      })
    },
    // 获取整改人
    async getPersonList (deptId) {
      this.dataListLoading = true
      employeeList({
        page: this.current,
        limit: '10',
        deptId: deptId
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.personList = data.page.list
            console.log(this.personList)
            this.totalPage = data.page.count
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
        .catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
    },
    // 分页
    handleBuyerCurrentChange (val) {
      this.current = val
      this.getPersonList()
    },
    // 点击行选中
    clickRow (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 选择整改人
    handleSelectionChange (val) {
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val.pop())
      } else {
        this.selectChange = val.pop()
      }
    },
    dataFormSubmit () {
      this.visible = false
      console.log(this.selectChange)
      this.$emit('selectChange', this.selectChange)
    }
  }
}
</script>
<style lang="scss">
.selectPerson {
  .el-pagination {
    text-align: right;
  }
}
</style>
