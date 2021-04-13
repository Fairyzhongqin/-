<!--报警设置-->
<template>
  <div class="mod-config">
    <el-form :inline="true"
             ref="dataForm"
             @submit.native.prevent
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-form-item label="报警描述"
                    prop="name">
        <el-input v-model.trim="dataForm.name"
                  size="mini"
                  placeholder="报警描述"
                  clearable></el-input>
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
                   v-waves>新增报警</el-button>
        <el-button type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0"
                   v-waves>批量删除</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary"
                   @click="getDataList()">查询</el-button>
        <el-button type="info"
                   @click="
                   resetForm('dataForm')">重置</el-button>
        <el-button type="warning"
                   @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="danger"
                   @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item> -->
    </el-form>
    <el-table :data="dataList"
              border
                ref="multipleTable"
                @cell-click="cellClick"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">
      <el-table-column type="id"
                       v-if="false"
                       width="50">
      </el-table-column>
      <el-table-column type="selection"
                       width="40"></el-table-column>
      <el-table-column type="index"
                       label="序号"
                       width="62">
      </el-table-column>
      <el-table-column prop="alarmAreaName"
                       label="报警区域名称">
      </el-table-column>
      <el-table-column prop="name"
                       label="报警描述">
      </el-table-column>
      <el-table-column prop="type"
                       label="报警类型">
        <template slot-scope="scope">
          {{scope.row.type === '0' ? '区域报警' : '作业报警'}}
        </template>
      </el-table-column>
      <el-table-column prop="overNum"
                       label="超员报警">
        <template slot-scope="scope">
          {{scope.row.overNum? Number(scope.row.overNum).toFixed(0)+'人' : '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="lessNum"
                       label="缺员报警">
        <template slot-scope="scope">
          {{scope.row.lessNum? Number(scope.row.lessNum).toFixed(0)+'人 ' : '-'}}
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
                     @click.stop="deleteHandle(scope.row.id, scope.row.name)">删除</el-button>
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
import AddOrUpdate from './zonesecurity-add-or-update'
import { alermSettingList, alermSettingDelete } from '@/api/pos/security'
import waves from '@/utils/waves'
export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        name: '' // 报警描述
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
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      alermSettingList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'name': this.dataForm.name // 报警描述
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
        this.$refs.addOrUpdate.init(id)
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
        return item.id
      })
      let nameArr = name ? [name] : this.dataListSelections.map(item => {
        return item.name
      })
      this.$confirm(`确定对[报警描述=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        alermSettingDelete(ids).then(({ data }) => {
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
