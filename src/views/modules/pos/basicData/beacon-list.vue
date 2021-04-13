<!--蓝牙标签-->
<template>
  <div class="mod-bluetooth mod-config">
    <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="设备号" prop="deveui">
        <el-input v-model.trim="dataForm.deveui" placeholder="设备号" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="设备状态" prop="status">
        <el-select v-model="dataForm.status" placeholder="请选择" size="mini" clearable>
          <el-option
            v-for="item in statusList"
            :key="item.label"
            :label="item.value"
            :value="item.label"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" v-waves>
          <i class="el-icon-search"></i>
          查询
        </el-button>
        <el-button
          type="info"
          size="mini"
          icon="el-icon-refresh-right"
          @click="
                   resetForm('dataForm')"
          v-waves
        >重置</el-button>
        <el-button
          type="warning"
          size="mini"
          icon="el-icon-plus"
          @click="addOrUpdateHandle()"
          v-waves
        >新增设备</el-button>
        <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
          v-waves
        >批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      ref="multipleTable"
      @cell-click="cellClick"
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column type="id" v-if="false" width="50"></el-table-column>
      <el-table-column type="selection" width="40"></el-table-column>
      <!-- <el-table-column type="index"
                       label="序号"
                       width="62">
      </el-table-column>-->
      <el-table-column prop="deveui" :show-overflow-tooltip="true" label="设备编号SN"></el-table-column>
      <el-table-column prop="locdevtype" label="设备类型">
        <template slot-scope="scope">{{scope.row.locdevtype | formatLocdevtype(locdevtypeList)}}</template>
      </el-table-column>
      <el-table-column prop="location" :show-overflow-tooltip="true" label="X轴坐标">
        <template slot-scope="scope">
          <span v-if="scope.row.positionX">{{scope.row.positionX }}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="location" :show-overflow-tooltip="true" label="Y轴坐标">
        <template slot-scope="scope">
          <span v-if="scope.row.positionY">{{scope.row.positionY}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="location" :show-overflow-tooltip="true" label="Z轴坐标">
        <template slot-scope="scope">
          <span v-if="scope.row.positionZ">{{scope.row.positionZ}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="buildId" label="buildId">
        <template slot-scope="scope">
          <span v-if="scope.row.buildId">{{scope.row.buildId}}</span>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="设备状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == '0'" type="success">在线</el-tag>
          <el-tag v-else type="info">离线</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="电量">
        <template slot-scope="scope">
          <battery v-if="batteryShow"  :num="scope.row.rate"></battery>
        </template>
      </el-table-column>
      <el-table-column width="120" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandles()">
            <el-tooltip class="item" effect="dark" content="点击查看" placement="right">
              <i class="el-icon-location-outline" style="cursor: pointer;color: #3E8EF7;">地图查看</i>
            </el-tooltip>
          </el-button>
          <!-- <el-button type="text"
                     size="small"
          @click="deleteHandle(scope.row.deveui, scope.row.deveui)">删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      background
      layout="total, sizes, prev, pager, next, jumper"
    ></el-pagination>
    <!-- 弹窗, 新增-->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './beacon-add-or-update'
import { beaconList, beaconDeleteDev } from '@/api/pos/device'
import { getLabels } from '@/api/common/sys'
import waves from '@/utils/waves'
import battery from '@/components/Battery'
import eventBus from '@/bus/index'
export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        deveui: '', // 设备号
        status: '' // 设备状态
      },
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
      batteryShow: false
    }
  },
  components: {
    AddOrUpdate, battery
  },
  activated () {
    this.getDataList() // 获取数据列表
  },
  created () {
    this.getBaseData() // 加载基础数据
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 查看
    addOrUpdateHandles () {
      this.$router.push({
        name: 'comMap',
        params: {
          name: 'coverage',
          callBackFn: () => {
            eventBus.$emit('mainSidebarCoMap', {
              name: 'coverageFun'
            }) // 图层列表
          }
        }})
      this.$store.commit('common/updateMainTabs', [{
        iframeUrl: '',
        menuId: 'comMap',
        name: 'comMap',
        noClose: true,
        title: '视图模式',
        type: 'module'
      }])
      this.$store.commit('common/updateMainmodelFlag', 1)
      this.$cookie.set('navFlag', this.$store.state.common.navFlag)
      this.$store.commit('common/updatedNavbarFlag', '4')
    },
    // 展示地图
    showMap () {
      this.$message.info('程序猿正在建设。。。')
    },
    // 获取数据列表
    getDataList () {
      this.batteryShow = false
      this.dataListLoading = true
      beaconList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'deveui': this.dataForm.deveui,
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
        this.batteryShow = true
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
        this.batteryShow = true
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
        this.getDataList()
        this.dataListLoading = false
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
        this.getDataList()
        this.dataListLoading = false
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
        beaconDeleteDev(deveuiArr).then(({ data }) => {
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
    }
  }
}
</script>
