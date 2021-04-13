<template>
  <div class="contract-static-main mod-config">
    <el-form :inline="true" class="el-form-margin-bottom" ref="dataForm" :model="dataForm" @submit.native.prevent @keyup.enter.native="getDataList()">
      <el-form-item label="承包商名称" prop="contractorName">
        <el-input v-model.trim="dataForm.contractorName" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="日期范围" prop="dateRange">
        <el-date-picker v-model="dataForm.dateRange" type="daterange" range-separator="至" start-placeholde="开始日期" end-placeholde="结束日期" :picker-options="pickerOptions1" clearable>
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" v-waves icon="el-icon-search">查询</el-button>
        <el-button type="info" size="mini" @click="resetForm('dataForm')" v-waves icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>

    </el-form>
    <el-table :data="dataList" border ref="multipleTable" @cell-click="cellClick" v-loading="dataListLoading" style="width:100%">
      <el-table-column type="index" width="62" label="序号" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="contractorName" label="承包商的名称" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <a href="javascript:;" @click="showDetail(scope.row.id)">{{scope.row.contractorName}}</a>
        </template>
      </el-table-column>
      <el-table-column prop="zyCount" label="总作业数">
        <template slot-scope="scope">
          <span v-if="scope.row.zyCount">{{scope.row.zyCount}} 次</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="wgCount" label="违规次数">
        <template slot-scope="scope">
          <span v-if="scope.row.wgCount">{{scope.row.wgCount}} 次</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="latelyDate" label="最近作业时间">
        <template slot-scope="scope">
          <span v-if="scope.row.latelyDate">{{scope.row.latelyDate}} 次</span>
          <span v-else>-</span>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10,20,50,100]" :page-size="pageSize" :total="totalPage" background layout="total,sizes,prev,pager, next, jumper">
    </el-pagination>
  </div>
</template>
<script>
import waves from '@/utils/waves'
import { contractStatic } from '@/api/pos/contractManage'
export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        contractorName: '',
        dateRange: []
      },
      dataList: [],
      dataListLoading: false,
      pageSize: 10,
      pageIndex: 1,
      totalPage: 0,
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      }
    }
  },
  activated () {
    this.getDataList()
    this.getDate()
  },
  created () {
    this.getDate()
    this.getDataList()
  },
  methods: {
    // 控制显示详情的弹出框
    showDetail (id) {
      this.$router.push({ path: '/pos/contractManage/contract-detail-dialog' })
    },
    getDate () {
      let date = new Date()
      let dateLast = new Date(date)
      dateLast.setDate(date.getDate() - 30)
      this.todayDate = date.toLocaleDateString()
      this.lastDate = dateLast.getFullYear() + '-' + (dateLast.getMonth() + 1) + '-' + dateLast.getDate()
      this.dataForm.dateRange[0] = new Date(this.lastDate).Format('yyyy-MM-dd')
      this.dataForm.dateRange[1] = new Date(this.todayDate).Format('yyyy-MM-dd')
    },
    // 获取表格内容
    getDataList () {
      this.dataListLoading = true
      contractStatic({
        'contractorName': this.dataForm.contractorName,
        'page': this.pageIndex,
        'limit': this.pageSize,
        'endTime': this.dataForm.dateRange ? new Date(this.dataForm.dateRange[1]).Format('yyyy-MM-dd') : null,
        'startTime': this.dataForm.dateRange ? new Date(this.dataForm.dateRange[0]).Format('yyyy-MM-dd') : null
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataListLoading = false
          this.dataList = data.page.list
          console.log(this.dataList)
          this.totalPage = data.page.count
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
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
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()

      this.getDataList()
    }

  }

}
</script>
<style lang="scss">
.contract-static-main {
  /deep/ .el-range-editor--medium.el-input__inner {
    height: 28px;
    // margin-top: 5px;
  }
  /deep/ .el-date-editor .el-range-separator {
    padding: 0px 0px;
  }

  /deep/ .el-range-editor.el-input__inner {
    padding: 0px 10px;
  }
}
</style>
