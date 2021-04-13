<template>
  <div class='partition-container mod-config'>
    <el-form :inline="true" :model="dataForm" ref="dataForm">
      <el-form-item label="风险分区编号/名称" prop="code">
        <el-input v-model="dataForm.code" clearable filterable size="mini" placeholder="风险分区编号/名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList" icon="el-icon-search" v-waves>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" v-waves @click="resetForm('dataForm')">重置</el-button>
        <!-- <el-button type="warning"
                   size="mini"
                   icon="el-icon-plus"
                   @click="addOrUpdateHandle()"
                   v-waves>新增</el-button>
        <el-button type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   @click="deleteHandle()"
                   v-waves
                   :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border ref="multipleTable" @cell-click="cellClick" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column prop="code" :show-overflow-tooltip="true" label="风险分区编号" width="100">
      </el-table-column>
      <el-table-column prop="name" :show-overflow-tooltip="true" label="风险分区名称" width="120">
      </el-table-column>
      <el-table-column prop="riskTips" label="风险分区提示" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="disposalMethod" :show-overflow-tooltip="true" label="应急处置方法">
      </el-table-column>
      <el-table-column prop="carefulMatter" :show-overflow-tooltip="true" label="注意事项">
      </el-table-column>
      <el-table-column prop="insideContact" :show-overflow-tooltip="true" label="应急联系方式(内部)">
      </el-table-column>
      <el-table-column prop="externalContact" :show-overflow-tooltip="true" label="应急联系方式(外部)">
      </el-table-column>
      <el-table-column width="120" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id,scope.row.code,scope.row.name)">编辑</el-button>
          <el-button type="text" size="small" @click.stop="handlePrint(scope.row)">打印</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

  </div>
</template>

<script>
import waves from '@/utils/waves'
import { manageList } from '@/api/risk/card'
import { queryRiskZone } from '@/api/pos/region'

import addOrUpdate from './manage-add-or-update'
export default {
  directives: {
    waves
  },
  components: {
    addOrUpdate
  },
  data () {
    return {
      dataForm: {
        code: ''// 风险分区编号
      },
      riskZoneList: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  created () {
    this.getDataList()
    this.getAllRiskZone()
  },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    handlePrint (data) {
      let newWin = window.open('')// 新打开一个空窗口
      newWin.document.write(`<html><head><title></title></title></head>
                             <body>
                             <h1 style="text-align:center">处置卡</h1>
                              <table border="1" cellpadding="0" cellspacing="0" style="margin:auto; width:60%">
                                    <tr>
                                      <td>分区名称</td>
                                      <td>${data.name}</td>
                                    </tr>
                                    <tr>
                                      <td>分区编号</td>
                                      <td>${data.code}</td>
                                    </tr>
                                    <tr>
                                      <td>风险分区提示</td>
                                      <td>${data.riskTips}</td>
                                    </tr>
                                    <tr>
                                      <td>应急处置方法</td>
                                      <td>${data.disposalMethod}</td>
                                    </tr>
                                    <tr>
                                      <td>注意事项</td>
                                      <td>${data.carefulMatter}</td>
                                    </tr>
                                    <tr>
                                      <td>应急联系方式(内部)</td>
                                      <td>${data.insideContact}</td>
                                    </tr>
                                    <tr>
                                      <td>应急联系方式(外部)</td>
                                      <td>${data.externalContact}</td>
                                    </tr>
                                  </table>
                             </body><html>`)
      newWin.document.close()// 在IE浏览器中使用必须添加这一句
      newWin.focus()// 在IE浏览器中使用必须添加这一句
      newWin.print()// 打印
      newWin.close()// 关闭窗口
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      manageList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'code': this.dataForm.code
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
    // 获取分区列表
    getAllRiskZone () {
      queryRiskZone().then(({ data }) => {
        if (data && data.code === 0) {
          this.riskZoneList = data.list
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id, code, name) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        // this.from = 'person'
        this.$refs.addOrUpdate.init(id, code, name)
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

<style scoped>
</style>
