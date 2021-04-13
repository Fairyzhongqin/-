<!--人员类型-->
<template>
  <div class="mod-config">
    <el-form :inline="true"
             :model="dataForm"
             class="el-form-margin-bottom"
             @submit.native.prevent
             ref="dataForm"
             @keyup.enter.native="getDataList()">
      <el-form-item label="人员类型"
                    prop="cgformName">
        <el-input v-model.trim="dataForm.cgformName"
                  placeholder="人员类型"
                  size="mini"
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
                   @click="addOrUpdateHandle()">新增人员类型</el-button>
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
                   v-waves>新增人员类型</el-button>
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
      <el-table-column type="cgformId"
                       v-if="false"
                       header-align="center"
                       align="center"
                       width="50">
      </el-table-column>
      <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="40">
      </el-table-column>
      <el-table-column type="index"
                       label="序号"
                       width="62">
      </el-table-column>
      <el-table-column prop="cgformName"
                       header-align="center"
                       align="center"
                       label="人员类型">
      </el-table-column>
      <el-table-column prop="cgformName"
                       header-align="center"
                       align="center"
                       label="人员图标">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.icon"
                      trigger="click"
                      placement="right"
                      title="">
            <img :src="$store.state.common.personTypeIcon[scope.row.icon].value"
                 :alt="scope.row.name + '人员图标'"
                 style="max-height: 140px">
            <img slot="reference"
                 :src="$store.state.common.personTypeIcon[scope.row.icon].value"
                 :alt="$store.state.common.personTypeIcon[scope.row.icon].name + '人员图标'"
                 style="width: 20px; height: 20px;border-radius: 50%;cursor: pointer">
          </el-popover>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column prop="remarks"
                       :show-overflow-tooltip="true"
                       label="包含字段">
      </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       width="120"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="addOrUpdateHandle(scope.row.cgformId)">修改</el-button>
          <el-button type="text"
                     size="small"
                     :disabled="scope.row.cgformId === '713273001' || scope.row.cgformId === '713273002'"
                     @click="deleteHandle(scope.row.cgformId, scope.row.cgformName)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   :total="totalPage"
                   background
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './person-type-add-or-update'
import { personTypeList, personTypeDelete } from '@/api/pos/person'
import waves from '@/utils/waves'
export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        cgformName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate
  },
  activated () {
    this.getDataList() // 获取数据列表
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      personTypeList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'cgformName': this.dataForm.cgformName
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // 临时人员与外协人员 【姓名】【性别】【证件号】【到期时间】
          // 其余人员  【姓名】【性别】【工号】
          this.dataList = data.page.list.map((value) => {
            value.remarks = (value.cgformId === '713273002' ? '【姓名】【性别】【工号/证件号】【到期时间】' : '【姓名】【性别】【工号/证件号】') + value.remarks
            return value
          })
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
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
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
    // 删除
    deleteHandle (id, name) {
      let bool = false
      let noDelNames = []
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.cgformId
      })
      // TODO 0:外协人员 1:临时人员 不能删除
      ids.map(item => {
        if (item === '0' || item === '1') {
          noDelNames.push(item === '0' ? '外协人员' : '临时人员')
          bool = true
        }
      })
      let nameArr = name ? [name] : this.dataListSelections.map(item => {
        return item.deveui
      })
      if (bool) {
        this.$message.error(`不能删除[${noDelNames.join(',')}]`)
        return false
      }
      this.$confirm(`确定对[人员类型=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        personTypeDelete(ids).then(({ data }) => {
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
        }).catch((err) => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
      }).catch(() => { })
    }
  }
}
</script>
<style lang="scss">
.el-progress {
  line-height: 36px;
}
</style>
