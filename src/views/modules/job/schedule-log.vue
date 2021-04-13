<template>
  <el-dialog
    title="日志列表"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.jobName" size="mini" placeholder="任务ID" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()">查询</el-button>
        <el-button @click="empty()" size="mini" type="danger">清空</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      height="360"
      style="width: 100%;">
      <el-table-column
        prop="jobName"
        header-align="center"
        align="center"
        label="任务ID">
      </el-table-column>
      <el-table-column
        prop="groupName"
        header-align="center"
        align="center"
        width="85"
        label="任务组名">
      </el-table-column>
      <el-table-column
        prop="executeDate"
        header-align="center"
        align="center"
        width="160"
        label="起始时间">
      </el-table-column>
      <el-table-column
        prop="timeConsuming"
        header-align="center"
        align="center"
        width="160"
        label="执行时间">
        <template slot-scope="scope">
          <div>{{scope.row.timeConsuming | formatDate}}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" size="small">成功</el-tag>
          <el-tag v-else @click.native="showErrorInfo(scope.row.logId)" size="small" type="danger"
                  style="cursor: pointer;">失败
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="information"
        header-align="center"
        align="center"
        label="日志">
      </el-table-column>
    </el-table>
    <el-pagination
    background
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </el-dialog>
</template>

<script>
  import {scheduleClean} from '@/api/sys/schedule'

  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          id: '',
          jobName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false
      }
    },
    methods: {
      init () {
        this.visible = true
        this.getDataList()
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        this.$http({
          url: this.$http.adornUrl('/spring-sysweb/sys/scheduleLog/list'),
          method: 'get',
          params: this.$http.adornParams({
            'page': this.pageIndex,
            'limit': this.pageSize,
            'id': this.dataForm.id,
            'jobName': this.dataForm.jobName
          })
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.count
          } else {
            this.dataList = []
            this.totalPage = 0
          }
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
      // 失败信息
      showErrorInfo (id) {
        this.$http({
          url: this.$http.adornUrl(`/spring-sysweb/sys/scheduleLog/info/${id}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.$alert(data.log.error)
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      // 清空
      empty () {
        this.$confirm('确定清空吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          scheduleClean().then(({data}) => {
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
          })
        }).catch(() => {
        })
      }
    },
    filters: {
      formatDate (value) {
        let h = Math.floor(value / (1000 * 60 * 60))
        let m = Math.floor((value % (1000 * 60 * 60)) / (1000 * 60))
        let s = Math.round((value % (1000 * 60)) / 1000)
        return h + '时' + m + '分' + s + '秒'
      }
    }
  }
</script>
