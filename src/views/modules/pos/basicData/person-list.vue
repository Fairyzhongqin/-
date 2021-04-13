<!--人员列表-->
<template>
  <div class="mod-config">
    <el-form :inline="true"
             ref="dataForm"
             :model="dataForm"
             class="el-form-margin-bottom"
             @keyup.enter.native="getDataList()">
      <el-form-item label="姓名/工号"
                    prop="conditions">
        <el-input v-model.trim="dataForm.conditions"
                  placeholder="姓名/工号"
                  size="mini"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="人员类型"
                    prop="cgformId">
        <el-select v-model="dataForm.cgformId"
                   clearable
                   size="mini"
                   placeholder="请选择">
          <el-option label="全部"
                     value=""></el-option>
          <el-option v-for="item in cgformIdList"
                     :key="item.cgformId"
                     :label="item.cgformName"
                     :value="item.cgformId">
          </el-option>
        </el-select>
      </el-form-item>
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
                   v-waves>新增人员信息</el-button>
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
                       width="50">
      </el-table-column>
      <el-table-column type="selection"
                       width="40"></el-table-column>
      <el-table-column prop="gh"
                       :show-overflow-tooltip="true"
                       label="工号">
      </el-table-column>
      <el-table-column prop="name"
                       label="姓名">
      </el-table-column>
      <el-table-column prop="sex"
                       label="性别">
        <template slot-scope="scope">
          {{scope.row.sex === '0' ? '男' : '女'}}
        </template>
      </el-table-column>
      <el-table-column prop="remarks"
                       label="证件照">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.photo"
                      trigger="click"
                      placement="right"
                      title="">
            <img :src="scope.row.photo"
                 :alt="scope.row.name + '证件照'"
                 style="max-height: 160px">
            <img slot="reference"
                 :src="scope.row.photoNew"
                 :alt="scope.row.name + '证件照'"
                 style="width: 20px; height: 20px;border-radius: 50%;cursor: pointer">
          </el-popover>
          <span v-else>暂无</span>
        </template>
      </el-table-column>
      <el-table-column prop="cgformName"
                       label="人员类型">
      </el-table-column>
      <el-table-column prop="cgformName"
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
                       label="在线状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.cardStatus === '0'"
                  type="success">在线</el-tag>
          <el-tag v-if="scope.row.cardStatus === '1'"
                  type="danger">离线</el-tag>
          <el-tag v-if="!scope.row.cardStatus"
                  type="info">未绑卡</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="120"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="addOrUpdateHandle(scope.row.gh)">修改</el-button>
          <el-button type="text"
                     size="small"
                     @click="deleteHandle(scope.row.gh, scope.row.name)">删除</el-button>
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
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './person-add-or-update'
import { pList, pTypeList, pDelete } from '@/api/pos/person'
import staffIcon from '@/assets/img/staffIcon.png'
import waves from '@/utils/waves'
export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        cgformId: '', // 人员类型
        conditions: '' // 姓名或工号
      },
      cgformIdList: [], // 人员类型列表
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
  created () {
    this.getBaseData() // 加载基础数据
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      pList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'cgformId': this.dataForm.cgformId, // 人员类型
        'conditions': this.dataForm.conditions // 姓名或工号
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list.map(value => {
            if (value.photo) value['photoList'] = [value.photo]
            value.photoNew = staffIcon
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
    // 加载基础数据
    getBaseData () {
      // 查询共有哪些人员类型 - 初始数据
      pTypeList().then(({ data }) => {
        if (data && data.code === 0) {
          this.cgformIdList = data.list
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
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
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.from = 'person'
        this.$refs.addOrUpdate.init(id, this.from)
      })
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
    },
    // 删除
    deleteHandle (id, name) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.gh
      })
      let nameArr = name ? [name] : this.dataListSelections.map(item => {
        return item.name
      })
      this.$confirm(`确定对[姓名=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        pDelete(ids).then(({ data }) => {
          if (data && data.code === 0) {
            if (!id && !name) {
              this.pageIndex = 1
              this.pageSize = 10
            }
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
