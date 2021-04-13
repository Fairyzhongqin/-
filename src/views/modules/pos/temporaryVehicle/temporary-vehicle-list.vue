<!--临时车辆管理-->
<template>
  <div class="mod-config">
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="getDataList()">
      <el-form-item label="车牌号"
                    prop="numberPlates">
        <el-input v-model="dataForm.numberPlates"
                  placeholder="车牌号"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="驾驶员信息"
                    prop="numberPlates">
        <el-input v-model="dataForm.numberPlates"
                  placeholder="驾驶员信息"
                  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   @click="getDataList()">查询</el-button>
        <el-button type="info"
                   @click="resetForm('dataForm')"
                   plain>重置</el-button>
        <el-button type="warning"
                   @click="addOrUpdateHandle()">新增临时车辆</el-button>
        <el-button type="danger"
                   @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">
      <el-table-column type="id"
                       v-if="false"
                       header-align="center"
                       align="center"
                       width="50"></el-table-column>
      <el-table-column type="selection"
                       header-align="center"
                       align="center"
                       width="50"></el-table-column>
      <el-table-column prop="numberPlates"
                       header-align="center"
                       align="center"
                       label="车牌号"></el-table-column>
      <el-table-column prop="type"
                       header-align="center"
                       align="center"
                       label="驾驶员信息">
        <template slot-scope="scope">{{scope.row.type}}</template>
      </el-table-column>
      <el-table-column prop="driverId"
                       header-align="center"
                       align="center"
                       label="联系方式">
        <template slot-scope="scope">{{scope.row.driverId || '-'}}</template>
      </el-table-column>
      <el-table-column prop="supercargoId"
                       header-align="center"
                       align="center"
                       label="车型">
        <template slot-scope="scope">{{scope.row.supercargoId || '-'}}</template>
      </el-table-column>
      <el-table-column prop="supercargoId"
                       header-align="center"
                       align="center"
                       label="到期时间">
        <template slot-scope="scope">{{scope.row.supercargoId || '-'}}</template>
      </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       width="220"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text"
                     size="small"
                     @click="deleteHandle(scope.row.id, scope.row.numberPlates)">删除</el-button>
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
                   layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './temporary-vehicle-add-or-update'
// import {vehicleList, vehicleDelete} from '@/api/pos/vehicle'
export default {
  data () {
    return {
      dataForm: {
        type: '', // 车辆类型
        numberPlates: '' // 车牌号
      },
      // 车辆类型0:普通车辆 1:临时车辆
      typeList: [
        {
          label: '0',
          value: '普通车辆'
        },
        {
          label: '1',
          value: '临时车辆'
        }
      ],
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
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
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
    deleteHandle (id, name) { }
  }
}
</script>
