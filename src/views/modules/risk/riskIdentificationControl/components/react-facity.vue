<template>
  <el-dialog title="选择反应装置"
             :close-on-click-modal="false"
             class="react-facity"
             width="700px"
             :visible.sync="visible"
             append-to-body>
    <el-table :data="dataList"
              border
              ref="multipleTable"
              @cell-click="cellClick"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;"
              height="300px">

      <!-- <el-table-column type="id"
                       v-if="false"
                       :show-overflow-tooltip="true"
                       width="50"></el-table-column> -->
      <el-table-column type="selection"
                       width="50"></el-table-column>
      <el-table-column prop="code"
                       :show-overflow-tooltip="true"
                       width="100"
                       label="装置编号">
      </el-table-column>
      <el-table-column prop="name"
                       :show-overflow-tooltip="true"
                       label="装置名称"
                       width="140">
      </el-table-column>
      <el-table-column prop="zoneName"
                       :show-overflow-tooltip="true"
                       label="所属区域">
      </el-table-column>
      <el-table-column label="备注"
                       prop="remarks"
                       :show-overflow-tooltip="true">
      </el-table-column>

    </el-table>
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   :total="totalPage"
                   layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false"
                 size="mini">取消</el-button>
      <el-button type="primary"
                 :disabled="isDisabled"
                 @click="addReact()"
                 size="mini">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { reactorList } from '@/api/sou/equlpment'

export default {
  data () {
    return {
      visible: false,
      isDisabled: false,
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListSelections: {},
      dataListLoading: false
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    init (code) {
      this.visible = true
      if (code) {
        this.$nextTick(() => {
          this.$refs.multipleTable.data.map(item => {
            if (item.code === code) {
              this.$refs.multipleTable.toggleRowSelection(item, true)
            }
          })
        })
      }
      // console.log(this.$refs.multipleTable)
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取数据列表
    getDataList () {
      // this.dataList = []
      this.dataListLoading = true
      reactorList({
        page: this.pageIndex,
        limit: this.pageSize
        // // name: this.dataForm.name,
        // // 'zoneId': this.dataForm.zoneId,
        // // zoneId: this.dataForm.zoneName[this.dataForm.zoneName.length - 1],
        // name: this.dataForm.manageName
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
    // 单选
    selectionChangeHandle (val) {
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val.pop())
      } else {
        this.dataListSelections = val.pop()
      }
      console.log(this.dataListSelections)
    },
    // 全选
    // selectAll (val) {
    //   console.log(val)
    // },
    addReact () {
      this.visible = false
      this.$emit('selectEmit', this.dataListSelections)
    }
  }
}
</script>
<style lang="scss">
.react-facity {
  .el-pagination {
    text-align: right;
    margin-top: 8px;
  }
}
</style>