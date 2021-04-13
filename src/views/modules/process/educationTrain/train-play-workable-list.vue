<!--应急预案-->
<template>
  <div class="train-plan-style mod-config">
    <el-form :inline="true" ref="dataForm" class="el-form-margin-bottom" :model="dataForm" @submit.native.prevent @keyup.enter.native="getDataList()">

      <el-form-item label="培训名称" prop="statuteType">
        <el-input v-model="dataForm.trainName" size="mini" placeholder="请输入计划（培训）名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" icon="el-icon-search" v-waves>查询</el-button>
        <el-button type="info" size="mini" @click="resetForm('dataForm')" icon="el-icon-refresh-right" v-waves>重置</el-button>
        <el-button type="warning" size="mini" @click="addOrUpdateHandle()" icon="el-icon-plus" v-waves>新增培训计划</el-button>
        <!-- <el-button type="danger" size="mini" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" icon="el-icon-delete" v-waves>批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border @cell-click="cellClick" ref="multipleTable" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="min-width: 100%;">
      <!-- <el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column> -->
      <el-table-column type="index" label="序号" align="center" width="60">
      </el-table-column>
      <el-table-column prop="trainName" :show-overflow-tooltip="true" label="培训名称" width="100">
      </el-table-column>
      <el-table-column prop="trainType" :show-overflow-tooltip="true" label="培训类型" header-align="center" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.trainType === '1'">从业人员培训</span>
          <span v-if="scope.row.trainType === '2'">管理人员培训</span>
          <span v-if="scope.row.trainType === '3'">其它人员培训</span>
          <span v-if="scope.row.trainType === '4'">日常安全培训</span>
        </template>
      </el-table-column>
      <el-table-column prop="trainPlace" :show-overflow-tooltip="true" label="培训地点" min-width="100">
      </el-table-column>
      <el-table-column prop="trainContent" :show-overflow-tooltip="true" label="培训简介" min-width="100">
      </el-table-column>
      <el-table-column :show-overflow-tooltip="true" label="实到人数/应到人数" width="125">

      </el-table-column>
      <el-table-column prop="trainLecturer" :show-overflow-tooltip="true" label="培训讲师" width="100">
      </el-table-column>
      <el-table-column prop="trainDate" :show-overflow-tooltip="true" label="培训时间" width="100">
        <template slot-scope="scope">
          {{scope.row.trainDate ? scope.row.trainDate.split(' ')[0] : ''}}
        </template>
      </el-table-column>
      <el-table-column prop="trainState" :show-overflow-tooltip="true" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.trainState === '0'">未开始</el-tag>
          <el-tag type="success" v-if="scope.row.trainState === '1'">已完成</el-tag>
        </template>

      </el-table-column>
      <el-table-column label="操作" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="workableHandle(scope.row.id)" :disabled="scope.row.trainState === '1'">结果落实</el-button>
          <el-button type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id)" :disabled="scope.row.trainState === '1'">修改</el-button>
          <el-button type="text" size="small" style="color:#E63031" @click.stop="deleteHandle(scope.row.id,scope.row.trainName)" :disabled="scope.row.trainState === '1'">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <train-play-workable-add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></train-play-workable-add-or-update>
    <train-play-workable v-if="trainTypeVisible" ref="trainType" @refreshDataList="getDataList"></train-play-workable>
  </div>
</template>
<script>
// import AddOrUpdate from './layer-knowledge-add-or-update'
// eslint-disable-next-line no-unused-vars
import { statuteList, statuteDelete } from '@/api/process/statute'
import { departList } from '@/api/sys/depart'
import { getLabels } from '@/api/common/sys'
import { trainplanList, trainPlanDelete } from '@/api/process/education'
import trainPlayWorkableAddOrUpdate from './train-play-workable-add-or-update'
import trainPlayWorkable from './train-play-workable'
export default {
  data () {
    return {
      dataForm: {
        trainName: ''
      },
      dataList: [],
      statuteList: [], // 法规类型列表
      departList: [],
      trainTypeVisible: false,
      defaultProps: {
        label: 'deptName',
        children: 'child'
      }, // 树形结构展示
      // 弹框显示
      addOrUpdateVisible: false,
      popoverVisible: false,
      dataListLoading: false,
      downloadUrl: '', // 文件下载路径
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListSelections: [] // 多选数据
    }
  },
  components: {
    trainPlayWorkableAddOrUpdate,
    trainPlayWorkable
  },
  created () {
    this.getDataList()
    this.getDepartList()
    this.getBaseData()
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取表格内容
    getDataList () {
      this.dataListLoading = true
      trainplanList({
        page: this.pageIndex,
        limit: this.pageSize,
        trainName: this.dataForm.trainName
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.count
            // console.log(this.dataList, '法律法规')
          } else {
            this.$message.error(data.msg)
          }
          this.dataListLoading = false
        })
        .catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
          this.dataListLoading = false
        })
    },
    // 获取部门树
    getDepartList () {
      this.dataListLoading = true
      departList().then(({ data }) => {
        if (data && data.code === 0) {
          this.departList = [data.data[0]] || []
          this.dataListLoading = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 识别部门菜单树选中
    departListTreeCurrentChangeHandle (data, node) {
      // 当前节点的数据，对象
      this.dataForm.deptIdIdentification = data.id
      this.dataForm.deptNameIdentification = data.deptName
      this.popoverVisible = false
    },
    // 加载基础数据
    getBaseData () {
      // 法规类型
      getLabels({
        type: 'STATUTE_TYPE'
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.statuteList = data.list
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => console.log(err))
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
    // 落实
    workableHandle (id) {
      this.trainTypeVisible = true
      this.$nextTick(() => {
        this.$refs.trainType.init(id)
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
    // 下载处理
    downHandle (id) {
      let token = document.cookie.split('=')[1]
      this.downloadUrl = this.$http.adornUrl(`/spring-processweb/attachment/download?id=${id}&token=${token}`)
      window.location.href = this.downloadUrl
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
      this.$confirm(
        `确定对[计划（培训）名称为=${nameArr.join(',')}]进行[${
        id ? '删除' : '批量删除'
        }]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          trainPlanDelete(ids)
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
  },
  filters: {
    formatType (val, map) {
      let optionName = ''
      map.map(item => {
        if (val === item.label) {
          optionName = item.value
        }
      })
      return optionName
    }
  }
}
</script>
<style lang="scss">
.train-plan-style {
  .el-select {
    width: 100%;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>
