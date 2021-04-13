<template>
  <div class='equlpment-tank-container mod-config'>
    <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="存储设施名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="存储设施名称" size="mini" clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" v-waves @click="getDataList()">查询
        </el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" v-waves @click="
                   resetForm('dataForm')">重置
        </el-button>

      </el-form-item>
    </el-form>
    <el-table :data="dataList" border ref="multipleTable" @cell-click="cellClick" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">

      <el-table-column type="id" v-if="false" :show-overflow-tooltip="true" width="50"></el-table-column>
      <!--<el-table-column type="selection"-->
      <!--width="50"></el-table-column>-->
      <el-table-column prop="code" :show-overflow-tooltip="true" min-width="80" label="设施编号">
      </el-table-column>
      <el-table-column prop="name" width="150" :show-overflow-tooltip="true" label="设施名称">
      </el-table-column>
      <el-table-column prop="zoneName" width="150" :show-overflow-tooltip="true" label="所属区域">
      </el-table-column>
      <el-table-column prop="storageName" min-width="120" :show-overflow-tooltip="true" label="储存物品名称">
      </el-table-column>
      <el-table-column prop="tankTypeName" width="150" :show-overflow-tooltip="true" label="存储设施类型" align="center">
        <template slot-scope="scope">
          <span class="typebg" v-if="scope.row.tankTypeName">{{scope.row.tankTypeName}}</span>
          <span v-else>暂无类型</span>
        </template>
      </el-table-column>
      <el-table-column prop="dangerAttr" :show-overflow-tooltip="true" min-width="120" label="风险属性">
      </el-table-column>
      <el-table-column prop="describe" :show-overflow-tooltip="true" min-width="110" label="描述">
      </el-table-column>
      <el-table-column prop="configFlag" width="120" :show-overflow-tooltip="true" align="center" label="监测启用状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.meterStatus" :type="scope.row.meterStatus|tagsClass">{{scope.row.meterStatus}}</el-tag>
          <el-tag type="danger" v-else>0/0</el-tag>
        </template>
      </el-table-column>
      <el-table-column min-width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="handleConfigParam(scope.row)">
            报警阈值
          </el-button>
          <el-button type="text" size="small" @click.stop="handleDataMonitor(scope.row)">
            实时监测
          </el-button>

        </template>
      </el-table-column>

    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 配置参数 -->
    <configParams-add v-if="addOrUpdateVisible" ref="addOrUpdate" @close="()=>{addOrUpdateVisible = false}" @refreshDataList="getDataList"></configParams-add>

    <!-- 实时监控 -->
    <!-- <show-config v-if="showConfigVisible"
                 ref="showConfigRef"></show-config> -->
    <device-monitor v-model="deviceMonitorVisible" v-if="deviceMonitorVisible" ref="deviceMonitor"></device-monitor>
  </div>
</template>

<script>
import waves from '@/utils/waves'
import { tankList, tankDelete } from '@/api/sou/equlpment'
import { getLabels } from '@/api/common/sys'
import configParamsAdd from './storage-monitor-add-or-update'
import deviceMonitor from '@/components/deviceMonitor'

export default {
  directives: {
    waves
  },
  components: {
    configParamsAdd,
    deviceMonitor
  },
  data () {
    return {
      dataForm: {
        name: ''
      },
      showConfigVisible: false,
      typeList: [], // 设施形状类型
      layoutList: [], // 设施形式
      configParamsList: [], // 配置参数类型
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      deviceMonitorVisible: false
    }
  },
  created () {
    this.getDataList()
    this.getFaciltyShape()
    this.getFaciltyForm()
  },
  mounted () {
  },
  activated () {
    this.getDataList()
    this.getFaciltyShape()
    this.getFaciltyForm()
    this.getConfigParams()
  },
  computed: {},
  watch: {},
  methods: {

    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取数据列表
    getDataList () {
      // this.dataList = []
      this.dataListLoading = true
      tankList({
        page: this.pageIndex,
        limit: this.pageSize,
        name: this.dataForm.name
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.dataList = data.page.list
          this.totalPage = data.page.count
          this.dataList.map(item => {
            if (item.metersDescribe !== null) {
              item.metersDescribe = item.metersDescribe.split(',')
            }
          })
          console.log(this.dataList)
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
    // 字典表查询设施形状
    getFaciltyShape () {
      getLabels({
        type: 'tank_shape_type'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.typeList = data.list
        } else {
          this.typeList = []
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 字典表查询设施形式
    getFaciltyForm () {
      getLabels({
        type: 'tank_layout_type'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.layoutList = data.list
        } else {
          this.layoutList = []
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 字典表查询配置参数
    getConfigParams () {
      getLabels({
        type: 'SOU_PARAM_CONFIG_FLAG'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.configParamsList = data.list
        } else {
          this.configParamsList = []
        }
      }).catch(err => {
        console.log(err)
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
    // addOrUpdateHandle (id) {
    //   this.addOrUpdateVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.addOrUpdate.init(id)
    //   })
    // },
    // 配置参数
    handleConfigParam (info) {
      if (info.meterStatus) {
        if (info.meterStatus.split('/')[1] === '0') {
          this.$message.error('请先配置仪表!')
          return
        }
      }
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(info)
        // if (info.meterStatus === null) {
        //   this.$message.error('暂无仪表')
        //   this.addOrUpdateVisible = false
        // } else {
        //   this.addOrUpdateVisible = true
        //   this.$nextTick(() => {
        //     this.$refs.addOrUpdate.init(info)
        //   })
        // }
      })
    },
    // 实时监测
    handleDataMonitor (info) {
      if (info.meterStatus) {
        if (info.meterStatus.split('/')[1] === '0') {
          this.$message.error('请先配置仪表!')
          return
        }
      }
      this.deviceMonitorVisible = true
      this.$nextTick(() => {
        this.$refs.deviceMonitor.init(info)
      })
    },
    // 删除
    deleteHandle (id, name) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      let nameArr = name ? [name] : this.dataListSelections.map(item => {
        return item.name
      })
      this.$confirm(`确定对[储罐=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        tankDelete(ids).then(({ data }) => {
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
      }).catch(() => {
      })
    }
  },
  filters: {
    matchType (value, map) {
      let finalType = ''
      map.map(val => {
        if (value === val.label) {
          finalType = val.value
        }
      })
      return finalType
    },
    tagsClass (val) {
      let classs = val.split('/')
      if (parseInt(classs[0]) === 0) {
        return 'info'
      } else if (parseInt(classs[0]) < parseInt(classs[1])) {
        return 'warning'
      } else if (parseInt(classs[0]) === parseInt(classs[1])) {
        return 'success'
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.equlpment-tank-container {
  .hoverConfig:hover {
    color: blue;
  }
  .typebg {
    background-color: #2d334ed4;
    color: #fff;
    padding: 4px 5px;
    border-radius: 3px;
  }
}
</style>
