<!--岗位列表-->
<template>
  <div class="station-manage mod-config">
    <el-form :inline="true"
             ref="dataForm"
             class="el-form-margin-bottom"
             :model="dataForm"
             @submit.native.prevent
             @keyup.enter.native="getDataList()">
      <el-form-item label="班组名称"
                    prop="stationName">
        <el-input v-model.trim="dataForm.stationName"
                  size="mini"
                  placeholder="班组名称"
                  clearable></el-input>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="getDataList()">查询</el-button>
        <el-button type="info"
                   size="mini"
                   @click="
                   resetForm('dataForm')">重置</el-button>
        <el-button type="warning"
                   size="mini"
                   @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger"
                   size="mini"
                   @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="getDataList()"
                   v-waves>
          <i class="el-icon-search"></i>
          查询</el-button>
        <el-button type="info"
                   size="mini"
                   icon="el-icon-refresh-right"
                   @click="
                   resetForm('dataForm')"
                   v-waves>重置</el-button>
        <el-button type="warning"
                   size="mini"
                   icon="el-icon-plus"
                   @click="addOrUpdateHandle()"
                   v-waves>新增班组</el-button>
        <el-button type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0"
                   v-waves>批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              @cell-click="cellClick"
              ref="multipleTable"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">
      <el-table-column type="gh"
                       v-if="false"
                       width="50"></el-table-column>
      <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="40">
      </el-table-column>
      <el-table-column type="index"
                       label="序号"
                       width="62">
      </el-table-column>
      <el-table-column prop="stationName"
                       label="班组名称"></el-table-column>
      <!-- <el-table-column prop="area"
                       header-align="center"
                       align="center"
                       label="岗位责任区域"></el-table-column> -->
      <el-table-column prop="stationShiftList"
                       :show-overflow-tooltip="true"
                       label="班次">
        <template slot-scope="scope">
          <span v-if="scope.row.stationShiftList.length">
            <span v-for="item of scope.row.stationShiftList"
                  :key="item.id">
              【{{item.periodName}}】
            </span>
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="zoneFencingList"
                       :show-overflow-tooltip="true"
                       label="责任区域">
        <template slot-scope="scope">
          <span v-if="scope.row.zoneFencingList.length">
            <span v-for="item of scope.row.zoneFencingList"
                  :key="item.id">
            【{{item.zoneName?item.zoneName:item.fencingName}}】
            </span>
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column width="120"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click.stop="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text"
                     size="small"
                     @click.stop="deleteHandle(scope.row.id, scope.row.stationName)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   background
                   :total="totalPage"
                   layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<script>
import AddOrUpdate from './station-manage-add-or-update'
import { stationList, stationDelete } from '@/api/pos/person'
import waves from '@/utils/waves'
export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        conditions: '', // 条件，
        stationName: '' // 岗位名词
      },
      dataList: [],
      // 弹框显示
      addOrUpdateVisible: false,
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListSelections: [] // 多选数据
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList()
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取表格内容
    getDataList () {
      this.dataListLoading = true
      stationList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'stationName': this.dataForm.stationName
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.count
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
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
    // 删除
    deleteHandle (id, name) {
      let ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      let nameArr = name
        ? [name]
        : this.dataListSelections.map(item => {
          return item.name
        })
      this.$confirm(`确定对[班组名称为=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          stationDelete(ids)
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
    }
  }
}
</script>
