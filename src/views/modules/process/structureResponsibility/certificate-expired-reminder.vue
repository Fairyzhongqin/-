<template>
  <el-dialog title="人员证书过期信息" :close-on-click-modal="false" width="600px" :visible.sync="visible">
    <el-table :data="dataList" border ref="multipleTable" v-loading="dataListLoading" style="width: 100%;height: 200px">
      <el-table-column type="index" label="序号" width="62">
      </el-table-column>
      <el-table-column prop="employeeName" show-overflow-tooltip label="员工姓名" width="120">
      </el-table-column>
      <el-table-column prop="employeeId" show-overflow-tooltip label="员工工号" width="120">
      </el-table-column>
      <el-table-column prop="fileName" show-overflow-tooltip label="证书名称">
        <template slot-scope="scope">
          {{scope.row.fileName.split('.')[0]}}
        </template>
      </el-table-column>
      <el-table-column prop="overdueDate" show-overflow-tooltip label="过期时间">
        <template slot-scope="scope">
          <span style="color: #ff0000">{{scope.row.overdueDate}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
    export default {
      data () {
        return {
          dataList: [],
          visible: false,
          dataListLoading: false,
          pageIndex: 1,
          pageSize: 10,
          totalPage: 0
        }
      },
      created () {
      },
      methods: {
        init (data) {
          this.visible = true
          this.dataList = data
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
        }
      }
    }
</script>

<style lang="scss">
  .nodata {
    width: 100%;
    height: 200px;
    text-align: center;
    line-height: 200px;
    font-size: 24px;
    font-family: PingFang SC;
  }
</style>
