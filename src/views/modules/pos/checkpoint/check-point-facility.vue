<!--胸卡设备-->
<template>
  <div class="mod-device mod-config">
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="getDataList()">
      <el-form-item label="设备编号"
                    prop="conditions">
        <el-input v-model="dataForm.conditions"
                  placeholder="请输入设备编号"
                  size="mini"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="设备类型"
                    prop="status">
        <el-select v-model="dataForm.status"
                   placeholder="请选择"
                   size="mini"
                   clearable>
          <el-option v-for="item in statusList"
                     :key="item.value"
                     :label="item.value"
                     :value="item.label">
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
                   v-waves>新增设备</el-button>
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
      <el-table-column type="id"
                       v-if="false"
                       width="50">
      </el-table-column>
      <el-table-column type="selection"
                       width="40"></el-table-column>
      <el-table-column prop="deveui"
                       :show-overflow-tooltip="true"
                       label="设备编号">
      </el-table-column>
      <el-table-column prop="type"
                       label="设备类型">
        <template slot-scope="scope">
          {{scope.row.type | formatType(typeList)}}
        </template>
      </el-table-column>
      <el-table-column prop="type"
                       label="所属卡口">
        <template slot-scope="scope">
          {{scope.row.type | formatType(typeList)}}
        </template>
      </el-table-column>
      <el-table-column width="120"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     v-if="scope.row.type == null"
                     @click.stop="bindingStaffHandle(scope.row.deveui)">绑定</el-button>
          <el-button type="text"
                     size="small"
                     v-else
                     @click.stop="bindingStaffJiebang(scope.row.deveui)">解绑</el-button>
          <!-- <el-button type="text"
                     size="small"
                     @click="deleteHandle(scope.row.deveui, scope.row.deveui)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="pageIndex"
                   background
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   :total="totalPage"
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <!-- <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update> -->
    <!-- 弹窗, 人员信息 -->
    <!-- <person-info v-if="personInfoVisible"
                 ref="personInfo"></person-info> -->
    <!-- 弹窗, 车辆信息 -->
    <!-- <vehicle-info v-if="vehicleInfoVisible"
                  ref="vehicleInfo"></vehicle-info> -->
    <!-- 弹窗, 绑定人员 -->
    <!-- <bindingStaff v-if="bindingStaffVisible"
                  ref="bindingStaff"
                  @refreshDataList="getDataList"></bindingStaff> -->
  </div>
</template>

<script>
// import AddOrUpdate from './device-add'
// import PersonInfo from './dialog-person-info'
// import VehicleInfo from './dialog-vehicle-info'
// import BindingStaff from './device-binding-staff'
import { deveuiList, deveuiDeleteDev, deveuiJiebang } from '@/api/pos/device'
import { getLabels } from '@/api/common/sys'
import waves from '@/utils/waves'
// import Battery from '@/components/Battery'
export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        conditions: '', // 设备号/姓名
        status: '' // 设备状态
      },
      // 绑定类型 0:人员 1:车辆
      typeList: [{
        label: '0',
        value: '人员'
      }, {
        label: '1',
        value: '车辆'
      }],
      locdevtypeList: [], // 设备类型list
      statusList: [], // 设备状态list
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      personInfoVisible: false,
      bindingStaffVisible: false,
      vehicleInfoVisible: false
    }
  },
  components: {
    // AddOrUpdate, PersonInfo, BindingStaff, VehicleInfo, Battery
  },
  activated () {
    this.getDataList() // 获取数据列表
  },
  created () {
    this.getBaseData() // 加载基础数据
  },
  methods: {
    // 对象信息
    personInfoHandle (info, type) {
      if (type === '0') {
        // 人员信息
        this.personInfoVisible = true
        this.$nextTick(() => {
          this.$refs.personInfo.init(info)
        })
      } else {
        // 车辆信息
        this.vehicleInfoVisible = true
        this.$nextTick(() => {
          this.$refs.vehicleInfo.init(info)
        })
      }
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      deveuiList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'conditions': this.dataForm.conditions,
        'status': this.dataForm.status
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
    // 加载基础数据
    getBaseData () {
      // 设备类型 - 字典
      getLabels({
        'type': 'zxkl_device_type'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.locdevtypeList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
      // 设备状态 - 字典
      getLabels({
        'type': 'device_status'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.statusList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
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
    // 绑定人员
    bindingStaffHandle (id) {
      this.bindingStaffVisible = true
      this.$nextTick(() => {
        this.$refs.bindingStaff.init(id)
      })
    },
    // 删除
    deleteHandle (id, deveui) {
      let deveuiArr = deveui ? [deveui] : this.dataListSelections.map(item => {
        return item.deveui
      })
      this.$confirm(`确定对[设备编码SN=${deveuiArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deveuiDeleteDev(deveuiArr).then(({ data }) => {
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
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
    },
    // 解除绑定人员
    bindingStaffJiebang (deveui) {
      deveuiJiebang({ 'deveui': deveui }).then(({ data }) => {
        if (data && data.code === 0) {
          this.$message.success('操作成功')
          this.getDataList()
        } else {
          this.$message.error(data.msg)
        }
      })
    }
  },
  filters: {
    formatLocdevtype (value, map) {
      let optionName = ''
      map.map((val) => {
        if (value === val.label) {
          optionName = val.value
        }
      })
      return optionName
    },
    formatType (value, map) {
      let optionName = ''
      map.map((val) => {
        if (value === val.label) {
          optionName = val.value
        }
      })
      return optionName
    }
  }
}
</script>
<style lang="scss">
.mod-device {
  .vehicle {
    cursor: pointer;
    display: inline-block;
    border-radius: 3px;
  }
}
</style>
