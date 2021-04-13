<template>
  <div class="cesium-process-inspection-task-container">
    <message-layout name="巡检任务" width="400px">
      <el-form :inline="true" :rules="rules" :model="formData" ref="form" class="date-search">
        <el-form-item prop="date" label="巡检日期">
          <el-date-picker v-model="formData.date" :picker-options="pickerOptions1" size="mini" type="date" :clearable="false" value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" class="search-botton" @click="searchData" size="mini"></el-button>
        </el-form-item>
      </el-form>
      <el-table style="height: calc(100vh - 50px);overflow: auto;" :data="dataList" row-key="id" :expand-row-keys="expands" highlight-current-row :tree-props="{ children: 'subregion' }" @row-click="rowClickTable">
        <el-table-column prop="name" :show-overflow-tooltip="true" label="任务名称">
          <template slot-scope="scope">
            {{ scope.row.patrolTaskEntity.name }}
          </template>
        </el-table-column>
        <el-table-column prop="planStartTime" :show-overflow-tooltip="true" label="开始时间">
          <template slot-scope="scope">
            {{ scope.row.planStartTime.split(" ")[1] }}
          </template>
        </el-table-column>
        <el-table-column prop="planEndTime" :show-overflow-tooltip="true" label="结束时间">
          <template slot-scope="scope">
            {{ scope.row.planEndTime.split(" ")[1] }}
          </template>
        </el-table-column>
        <el-table-column prop="planEndTime" :show-overflow-tooltip="true" label="巡检班组">
          <template slot-scope="scope">
            {{ scope.row.patrolTaskEntity.teamName }}
          </template>
        </el-table-column>
        <el-table-column prop="status" :show-overflow-tooltip="true" label="巡检状态">
          <template slot-scope="scope">
            <el-tag size="mini" :type="scope.row.status | filterStatus(true)">{{
              scope.row.status | filterStatus
            }}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </message-layout>
  </div>
</template>

<script>
import messageLayout from '../components/messageLayout'

import { patrolRecordList } from '@/api/pos/person'

export default {
  inject: ['cesiumMap', 'cesiumContent'], // 多级祖孙传值-接受方
  components: {
    messageLayout
  },
  data () {
    return {
      formData: {
        date: ''
      },
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      name: '',
      current: 1,
      totalPage: 0,
      dataListLoading: false,
      expands: [],
      dataList: [], // 数据展示
      cacheID: null, // 缓存点击的菜单id
      rules: {
        date: [{ require: true, message: '请选择查询日期', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getDateNow()
    this.getDataList()
  },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    // 初始化时间
    getDateNow () {
      var date = new Date()
      this.formData.date = new Date(date.toLocaleDateString()).Format(
        'yyyy-MM-dd'
      )
    },
    // 点击区域table单行
    rowClickTable (row) {
      console.log(row)
      this.cesiumContent.comVisible.inspectionVisible = false
      this.cesiumContent.comVisible.inspectionDetailVisible = true
      this.$nextTick(() => {
        this.cesiumContent.$refs.inspectionDetail.init(row)
      })
      // this.cesiumMap.$refs.mapShow.insertOrUpdateObjectLoc('inspection')
    },
    // 获取数据列表
    async getDataList () {
      this.dataListLoading = true
      patrolRecordList({
        startTime: this.formData.date
      })
        .then(({ data }) => {
          if (data.page && data.code === 0) {
            this.dataList = data.page.list
          } else {
            this.dataList = []
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    //
    searchData () {
      this.getDataList()
    }
  },
  filters: {
    filterStatus (status, type) {
      let result = ''
      switch (status) {
        case '0':
          result = type ? 'info' : '未开始'
          break
        case '1':
          result = type ? 'warning' : '进行中'
          break
        case '2':
          result = type ? 'success' : '已完成'
          break
      }
      return result
    }
  }
}
</script>

<style lang="scss">
.cesium-process-inspection-task-container {
  .date-search {
    padding: 10px 0 0;
    text-align: center;
    .el-form-item {
      margin-right: -5px;
      margin-bottom: 10px;
      .el-form-item__label {
        color: #fff;
      }
      .el-date-editor {
        color: #fff;
      }
      .el-date-editor.el-input {
        width: 270px;
        .el-input__inner {
          background-color: #00000082;
          color: #ffffff;
          border: 1px solid #3365b7ad;
          border-radius: 4px 0 0 4px;
        }
      }
      .el-button {
        background-color: #006ac7ed;
        color: #ffffff;
        border: 0;
        width: 54px;
        border-radius: 0 3px 3px 0;
      }
    }
  }
}
</style>
