<template>
  <div class="mod-config mod-log">
    <el-form :inline="true"
             :model="dataForm"
             @submit.native.prevent
             @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.key"
                  size="mini"
                  placeholder="用户名／用户操作"
                  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="getDataList()"
                   v-waves>查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              v-loading="dataListLoading"
              style="width: 100%">
      <el-table-column type="selection"
                       width="40"></el-table-column>
      <el-table-column prop="id"
                       v-if="false"
                       header-align="center"
                       align="center"
                       width="80"
                       label="ID">
      </el-table-column>
      <el-table-column prop="userName"
                       header-align="center"
                       align="center"
                       label="用户名">
      </el-table-column>
      <el-table-column prop="operation"
                       header-align="center"
                       :show-overflow-tooltip="true"
                       align="center"
                       label="用户操作">
      </el-table-column>
      <el-table-column prop="method"
                       header-align="center"
                       align="center"
                       width="150"
                       :show-overflow-tooltip="true"
                       label="请求方法">
      </el-table-column>
      <el-table-column prop="params"
                       header-align="center"
                       align="center"
                       width="150"
                       :show-overflow-tooltip="true"
                       label="请求参数">
      </el-table-column>
      <el-table-column prop="time"
                       header-align="center"
                       align="center"
                       label="执行时长(毫秒)">
      </el-table-column>
      <el-table-column prop="ip"
                       header-align="center"
                       align="center"
                       width="150"
                       label="IP地址">
      </el-table-column>
      <el-table-column prop="createDate"
                       header-align="center"
                       align="center"
                       width="180"
                       label="创建时间">
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   :total="totalPage"
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
import waves from '@/utils/waves'
export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        key: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      selectionDataList: []
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/log/list'),
        method: 'get',
        params: this.$http.adornParams({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'key': this.dataForm.key
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
    }
  }
}
</script>
<style lang="scss">
  .mod-log{
    .el-form-item{
      margin-bottom: 12px;
    }
  }
</style>
