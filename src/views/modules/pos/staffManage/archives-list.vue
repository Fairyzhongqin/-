<!--访客列表-->
<template>
  <div class="staffFileStyle mod-config">
    <el-form :inline="true" ref="dataForm" :model="dataForm" class="el-form-margin-bottom" @keyup.enter.native="getDataList()">
      <el-form-item label="工号/姓名" prop="conditions">
        <el-input v-model.trim="dataForm.conditions" size="mini" clearable placeholder="请输入工号/姓名"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" v-waves>
          <i class="el-icon-search"></i>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="
                   resetForm('dataForm')" v-waves>重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border :row-class-name="tableRowClassName" ref="multipleTable" @cell-click="cellClick" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">

      <el-table-column type="index" label="序号" width="60" align="center">
      </el-table-column>
      <el-table-column prop="gh" width="120" label="工号">
        <template slot-scope="scope">
          {{scope.row.gh || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="name" width="80" label="姓名">
        <template slot-scope="scope">
          {{scope.row.name || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="sex" width="60" align="center" label="性别">
        <template slot-scope="scope">
          <span v-if="scope.row.sex == '0'" type="danger">男</span>
          <span v-else type="success">女</span>
        </template>
      </el-table-column>
      <el-table-column prop="age" width="60" label="年龄" align="center">
        <template slot-scope="scope">
          {{scope.row.age || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="dept" :show-overflow-tooltip="true" label='部门/车间'>
        <template slot-scope="scope">
          {{scope.row.dept || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="workType" :show-overflow-tooltip="true" label='工种'>
        <template slot-scope="scope">
          {{scope.row.workType || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="professional" min-width="100" :show-overflow-tooltip="true" label='职称'>
        <template slot-scope="scope">
          {{scope.row.professional || '-'}}
        </template>
      </el-table-column>

      <el-table-column prop="entryTime" min-width="80" label="入职时间" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <div v-if="scope.row.entryTime">{{scope.row.entryTime===''?scope.row.entryTime:scope.row.entryTime.split(' ')[0]}}</div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column prop="onTheJobFlag" min-width="80" label="在职情况" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <!-- <span v-if="scope.row.onTheJobFlag === '0'">离职</span>
          <span v-else>在职</span> -->
          <el-tag type="danger" v-if="scope.row.onTheJobFlag !== null && scope.row.onTheJobFlag === '0'">离职</el-tag>
          <el-tag v-else>在职</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="maintainFlag" min-width="80" label="维护标记" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <span v-if="scope.row.maintainFlag === null || scope.row.maintainFlag==='0'" style="color:#E6A23C">
            未维护
            <el-tooltip v-if="(scope.row.maintainFlag === null || scope.row.maintainFlag === '0') && (scope.row.onTheJobFlag === null || scope.row.onTheJobFlag === '1')" class="item" effect="dark" content="还未维护，请尽快填写档案" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>

          </span>
          <span v-else style="color:#67C23A">已维护</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="addOrUpdateHandle(scope.row)">信息维护</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 档案记录 -->
    <staff-file v-if="staffVisible" ref="staffFileRef" @refreshList="getDataList"></staff-file>

  </div>

</template>

<script>
// eslint-disable-next-line no-unused-vars
import { staffFileList } from '@/api/pos/staffFile'
import staffFile from '@/components/StaffFile'

export default {
  data () {
    return {
      dataForm: {
        conditions: ''
      },
      statusList: [{
        value: '0',
        label: '离开'
      }, {
        value: '1',
        label: '未离开'
      }],
      typeList: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      staffVisible: false
    }
  },
  components: {
    staffFile
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
      staffFileList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'conditions': this.dataForm.conditions
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
    // 突出展示离职或未维护的行
    tableRowClassName ({ row, rowIndex }) {
      if (row.onTheJobFlag === '0') {
        return 'darkStyle'
      } else if (row.maintainFlag === '0') {
        return 'redStyle'
      } else {
        return ''
      }
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
    // 查看详细信息
    addOrUpdateHandle (info) {
      this.staffVisible = true
      this.$nextTick(() => {
        this.$refs.staffFileRef.init(info)
      })
    }
  }
}
</script>
<style lang="scss">
.staffFileStyle {
  .el-table .darkStyle {
    // background: rgba(119, 118, 114, 0.5);
  }
  .el-table .redStyle {
    // background-color: #f5acad;
  }
}
</style>
