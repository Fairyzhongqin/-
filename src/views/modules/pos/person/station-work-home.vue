<template>
  <!-- 巡检任务主页默认展示的组件 -->
  <div class="station-work mod-config">
    <el-form :inline="true" ref='dataForm' :model="dataForm" @submit.native.prevent @keyup.enter.native="getStationWorkList()">
      <el-form-item label="任务名称">
        <el-input v-model.trim="dataForm.name" placeholder="任务名称" size="mini" clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getStationWorkList()" v-waves>
          <i class="
                   el-icon-search"></i>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="
                   resetForm('dataForm')" v-waves>重置</el-button>
        <el-button type="warning" size="mini" icon="el-icon-plus" @click="handleWorkInfo" v-waves>新增任务</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="dataListSelections.length<=0" @click="deleteHandle()" v-waves>批量删除</el-button>
      </el-form-item>

    </el-form>
    <!-- 巡管任务列表 -->
    <el-table :data="dataList" border v-loading='dataListLoading' ref="multipleTable"  @cell-click="cellClick" @selection-change="handleSelectionChange" style="width: 100%;">
      <el-table-column type="selection" width="40">
      </el-table-column>

      <el-table-column type="index" label="序号" width="60" align="center">
      </el-table-column>

      <el-table-column label="任务编号" prop="code" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="任务名称" prop="name" :show-overflow-tooltip="true">
      </el-table-column>
      <!-- 具体使用参照数据字典 -->
      <el-table-column label="制定状态" min-width="80" prop="status" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==='0'">
            {{scope.row.status | formatType(typeList)}}
          </el-tag>
          <el-tag v-if="scope.row.status==='1'" type='success'>
            {{scope.row.status | formatType(typeList)}}
          </el-tag>
          <el-tag v-if="scope.row.status==='2'" type='warning'>
            {{scope.row.status | formatType(typeList)}}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="巡检类型" prop="patrolType" min-width="80" align="center">
        <template slot-scope="scope">
          <!-- {{scope.row==='0'?'常规巡检':'专项巡检'}} -->
          {{scope.row.patrolType | formatType(patrolList)}}
        </template>
      </el-table-column>
      <!-- 可以点击得到巡检班组 -->
      <el-table-column label="巡检班组" min-width="80" prop="teamName" align="center" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="启用标识" min-width="80" prop="enableFlag" align="center">
        <template slot-scope="scope">
          <span :style="{color:scope.row.enableFlag === '0' ? '#67C23A' : '#e63031'}">{{scope.row.enableFlag | formatType(enableList)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="周期类型" prop="period" width="80" align="center">
        <template slot-scope="scope">
          {{scope.row.period | formatType(periodList)}}
          <el-popover placement="top-start" width="200" trigger="hover" style="color: #2C78BB;">
            <template v-if="scope.row.period==='1'">
              <el-tag v-for="(item,index) in scope.row.daysOfWeek" :key="index" type="info" style="margin-right:2px">
                <span v-if="item==='1'">
                  {{'周日'}}
                </span>
                <span v-if="item==='2'">
                  {{'周一'}}
                </span>
                <span v-if="item==='3'">
                  {{'周二'}}
                </span>
                <span v-if="item==='4'">
                  {{'周三'}}
                </span>
                <span v-if="item==='5'">
                  {{'周四'}}
                </span>
                <span v-if="item==='6'">
                  {{'周五'}}
                </span>
                <span v-if="item==='7'">
                  {{'周六'}}
                </span>
              </el-tag>
            </template>
            <template v-if="scope.row.period==='2'">
              <el-tag v-for="(item,index) in scope.row.daysOfMonth" :key="index" type="info" style="margin-right:2px">{{item+'号'+' '}}</el-tag>
            </template>
            <i v-if="scope.row.period!=='0'" class="el-icon-s-unfold" slot="reference"></i>
          </el-popover>

        </template>
      </el-table-column>
      <el-table-column label="时间段" prop="timeShow" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column label="操作" width="210">
        <template slot-scope="scope">
          <el-button type="text" :disabled="scope.row.enableFlag==='0'" size="small" @click.stop="updateHandle(scope.row.id)">编辑</el-button>
          <el-button type="text" size="small" @click.stop="deleteHandle(scope.row.id,scope.row.name)">删除</el-button>
          <el-button type="text" size="small" :disabled="scope.row.status==='0'" @click.stop="enableHandle(scope.row.id,scope.row.enableFlag)" :class="{enable:scope.row.enableFlag==='0'}">{{scope.row.enableFlag==='0'?'停用':'启用'}}</el-button>
          <!-- :class="{enable:scope.row.enableFlag==='0'}" -->
          <el-button type="text" size="small" @click.stop="enterPreview(scope.row.id)">预览巡检路线</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" background layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <station-info v-show="addOrUpdateVisible" ref="addOrUpate"></station-info>
  </div>
</template>
<script>
import { stationWorkList, stationDeleteWork, patroltaskEnable } from '@/api/pos/person'
import stationInfo from './station-work-info'
import waves from '@/utils/waves'
import { getLabels } from '@/api/common/sys'
export default {
  directives: {
    waves
  },
  components: {
    stationInfo
  },
  data () {
    return {
      dataForm: {
        code: '', // 条件，
        name: '' // 岗位名词
      },
      dataList: [],
      dataListSelections: [], // 多选的数据
      addOrUpdateVisible: false, // 信息页的显示
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      data: {},
      optionsType: '', // 制定状态
      typeList: [], // 制定类型列表
      enableList: [], // 启用状态标识
      patrolList: [], // 巡检类型
      periodList: []// 周期类型
    }
  },
  created () {
    this.getStationWorkList()
    this.getBaseData() // 加载基础数据
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取数据列表
    getStationWorkList () {
      this.dataListLoading = true
      stationWorkList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'code': this.dataForm.code,
        'name': this.dataForm.name
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.count
          console.log(this.dataList, '111111111数据列表')
          this.dataList.forEach(item => {
            if (item.period === '1') {
              item.daysOfWeek = item.daysOfWeek.split(',')
              item.daysOfWeek.sort(function (a, b) { return a - b })
            } else if (item.period === '2') {
              item.daysOfMonth = item.daysOfMonth.split(',')
              item.daysOfMonth.sort(function (a, b) { return a - b })
            }
          })
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
      this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/dict/list'),
        method: 'get',
        params: this.$http.adornParams({
          'type': 'WISDOM_PATROL_STATUS'
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.optionsType = data.page.list
          // console.log(this.optionsType)
        }
      })
    },
    // 加载基础数据
    getBaseData () {
      // 巡检任务制定状态 - 字典
      getLabels({
        'type': 'WISDOM_PATROL_STATUS'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.typeList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
      // 巡检任务启用状态 - 字典
      getLabels({
        'type': 'PATROL_TASK_ENABLE_FLAG'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.enableList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
      // 巡检类型
      getLabels({
        'type': 'PATROL_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.patrolList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
      // 周期类型
      getLabels({
        'type': 'PERIOD_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.periodList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getStationWorkList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getStationWorkList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 重置
    resetForm (formName) {
      this.dataForm.name = ''
      this.getStationWorkList()
    },
    handleSelectionChange (val) {
      this.dataListSelections = val
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
      this.$confirm(`确定对[巡检任务名称为=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          stationDeleteWork(ids)
            .then(({ data }) => {
              if (data && data.code === 0) {
                this.getStationWorkList()
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
    },
    // 跳转到巡检任务信息页面
    handleWorkInfo () {
      this.$emit('stationWorInfo', 0)
      // this.data.data1 = 'stationWorkInfo'
      // this.data.data2 =0
      // this.data.data4 = {}
      // this.$store.commit('editName', this.data)
    },
    // 编辑跳转到基本信息页
    updateHandle (id) {
      // console.log(id)
      this.$emit('stationWorkUpdate', 0, id)
      this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/dict/list'),
        method: 'get',
        params: this.$http.adornParams({
          'type': 'WISDOM_PATROL_STATUS'
        })
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.optionsType = data.page.list
          // console.log(this.optionsType)
        }
      })
    },
    // 启用和禁用巡检任务
    enableHandle (id, enableFlag) {
      patroltaskEnable({
        id: id,
        enableFlag: enableFlag === '0' ? '1' : '0'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
          this.getStationWorkList()
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
    enterPreview (id) {
      this.$emit('enterPreview', 2, id, false)
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
<style lang="scss">
.station-work {
  .enable {
    color: #e63031;
  }
}
</style>
