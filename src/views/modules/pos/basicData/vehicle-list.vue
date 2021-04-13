<!--车辆管理-->
<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="车牌号" prop="numberPlates">
        <el-input v-model.trim="dataForm.numberPlates" size="mini" placeholder="车牌号" clearable></el-input>
      </el-form-item>
      <el-form-item label="车辆类型" prop="type">
        <el-select v-model="dataForm.type" clearable size="mini" placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in typeList" :key="item.label" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()">
          <i class="el-icon-search"></i>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="
                   resetForm('dataForm')">重置</el-button>
        <el-button type="warning" size="mini" icon="el-icon-plus" @click="addOrUpdateHandle()">新增车辆</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
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
                   @click="addOrUpdateHandle()">新增车辆</el-button>
        <el-button type="danger"
                   size="mini"
                   @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item> -->
    </el-form>
    <el-table :data="dataList" border @cell-click="cellClick" ref="multipleTable" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="id" v-if="false" header-align="center" align="center" width="62">
      </el-table-column>
      <el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column prop="numberPlates" header-align="center" align="center" label="车牌号">
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center" label="车辆类型">
        <template slot-scope="scope">
          {{scope.row.type | formatType(typeList)}}
        </template>
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center" label="车辆图标">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.icon" trigger="click" placement="right" title="">
            <img :src="$store.state.common.vehiceIcon[scope.row.icon].value" :alt="scope.row.name + '车辆图标'" style="max-height: 140px">
            <img slot="reference" :src="$store.state.common.vehiceIcon[scope.row.icon].value" :alt="$store.state.common.vehiceIcon[scope.row.icon].name + '车辆图标'" style="width: 20px; height: 20px;cursor: pointer">
          </el-popover>
          <span v-else>暂无</span>
          <!-- <img :src="scope.row.icon != null ? $store.state.common.personTypeIcon[scope.row.icon].value :''"
               alt=""> -->

        </template>
      </el-table-column>
      <el-table-column prop="driverId" header-align="center" align="center" label="驾驶员信息">
        <template slot-scope="scope">
          {{scope.row.driverId || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="supercargoId" header-align="center" align="center" label="押运员信息">
        <template slot-scope="scope">
          {{scope.row.supercargoId || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="remarks" label="在线状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.cardStatus === '0'" type="success">在线</el-tag>
          <el-tag v-if="scope.row.cardStatus === '1'" type="danger">离线</el-tag>
          <el-tag v-if="!scope.row.cardStatus" type="info">未绑卡</el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="120" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.id, scope.row.numberPlates)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './vehicle-add-or-update'
import { vehicleList, vehicleDelete } from '@/api/pos/vehicle'
export default {
  data () {
    return {
      dataForm: {
        type: '',        // 车辆类型
        numberPlates: '' // 车牌号
      },
      // 车辆类型0:普通车辆 1:临时车辆
      typeList: [{
        label: '0',
        value: '普通车辆'
      }, {
        label: '1',
        value: '临时车辆'
      }],
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
      vehicleList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'type': this.dataForm.type,
        'numberPlates': this.dataForm.numberPlates
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
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      let nameArr = name ? [name] : this.dataListSelections.map(item => {
        return item.numberPlates
      })
      this.$confirm(`确定对[车牌号=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        vehicleDelete(ids).then(({ data }) => {
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
  },
  filters: {
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
