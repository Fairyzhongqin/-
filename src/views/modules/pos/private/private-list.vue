<!--报警设置-->
<template>
  <div class="mod-config">
    <el-form :inline="true"
             ref="dataForm"
             @submit.native.prevent
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-form-item label="申请单位"
                    prop="name">
        <el-input v-model.trim="dataForm.name"
                  placeholder="申请单位"
                  size="mini"
                  clearable></el-input>
      </el-form-item>
      <!-- <el-form-item label="负责人"
                    prop="name">
        <el-input v-model="dataForm.responsibilityUser"
                  placeholder="负责人"
                  clearable></el-input>
      </el-form-item> -->
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
                   @click="resetForm('dataForm')"
                   v-waves>重置</el-button>
        <el-button type="warning"
                   size="mini"
                   icon="el-icon-plus"
                   @click="addOrUpdateHandle()"
                   v-waves>新增作业</el-button>
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
              ref="multipleTable"
              @cell-click="cellClick"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">
      <el-table-column type="id"
                       v-if="false"
                       header-align="center"
                       align="center"
                       width="50">
      </el-table-column>
      <el-table-column type="selection"
                       width="40"></el-table-column>
      <el-table-column type="index"
                       label="序号"
                       width="62">
      </el-table-column>
      <el-table-column prop="applyUnit"
                       show-overflow-tooltip
                       label="申请单位">
      </el-table-column>
      <el-table-column label="申请人">
        <template slot-scope="scope">
          {{scope.row.person ?scope.row.person.name:'-'}}
        </template>
      </el-table-column>
      <el-table-column prop=""
                       label="作业类型">
        <template slot-scope="scope">
          <!-- {{computedType(scope.row.workType)}} -->
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip
                       label="作业地点">
        <template slot-scope="scope">
          {{scope.row.fencing?scope.row.fencing.fencingName:'-'}}
        </template>
      </el-table-column>
      <el-table-column prop=""
                       label="作业票">
      </el-table-column>
      <el-table-column prop='workStartTime'
                       width="130"
                       :show-overflow-tooltip="true"
                       label="作业开始时间">

      </el-table-column>
      <el-table-column prop='workEndTime'
                       width="130"
                       :show-overflow-tooltip="true"
                       label="作业结束时间">

      </el-table-column>
      <!-- <el-table-column prop="time"
                       show-overflow-tooltip
                       label="作业时间">
        <template slot-scope="scope">
          {{scope.row.workStartTime + ' ~ ' +scope.row.workEndTime}}
        </template>
      </el-table-column> -->
      <el-table-column prop="workStatus"
                       label="作业状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.workStatus === '0'" type="danger">未开始</el-tag>
          <el-tag v-if="scope.row.workStatus === '1'" type="success">已开始</el-tag>
          <!--{{computedStatus(scope.row.workStatus)}}-->
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
import AddOrUpdate from './private-add-or-update'
import { privateList, privateDelete } from '@/api/pos/security'
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
      addOrUpdateVisible: false,
      optionsType: [],
      options: []
    }
  },
  components: {
    AddOrUpdate
  },
  computed: {

  },
  activated () {
    this.getDataList() // 获取数据列表
    this.getDictList() // 获取字典数据
  },
  created () {
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    computedType (type) {
      let workType = ''
      this.optionsType.map(val => {
        if (val.label === type) {
          workType = val.value
        }
      })
      return workType
    },
    computedStatus (type) {
      let workStatus = ''
      this.options.map(val => {
        if (val.label === type) {
          workStatus = val.value
        }
      })
      return workStatus
    },
    // 获取字典数据列表，系统选项
    getDictList () {
      this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/dict/list'),
        method: 'get',
        params: this.$http.adornParams({
          'type': 'work_status'
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.options = data.page.list
        }
      })
      this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/dict/list'),
        method: 'get',
        params: this.$http.adornParams({
          'type': 'work_type'
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.optionsType = data.page.list
        }
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      privateList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'applyUnit': this.dataForm.name, // 申请单位
        'responsibilityUser': this.dataForm.responsibilityUser // 负责人
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          console.log(data.page.list)

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
        privateDelete(ids).then(({ data }) => {
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
