<template>
  <!-- 摄像头管理 -->
  <div class='repository-container mod-config'>
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="getDataList()">
      <el-form-item label="摄像头名称"
                    prop="name">
        <el-input v-model="dataForm.name"
                  placeholder="摄像头名称"
                  clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-search"
                   @click="getDataList()">查询</el-button>
        <el-button type="info"
                   size="mini"
                   icon="el-icon-refresh-right"
                   @click="resetForm('dataForm')">重置</el-button>
        <el-button type="primary"
                   size="mini"
                   class="switch-sys"
                   @click="getRoutComMap()">摄像头维护</el-button>
        <!--<el-button type="warning"-->
        <!--size="mini"-->
        <!--icon="el-icon-plus"-->
        <!--@click="addOrUpdateHandle()">新增摄像头</el-button>-->
        <!--<el-button type="danger"-->
        <!--size="mini"-->
        <!--@click="deleteHandle()"-->
        <!--:disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">

      <!-- <template slot-scope="scope">{{scope.row.name || '-'}}</template> -->

      <el-table-column type="id"
                       v-if="false"
                       width="50"></el-table-column>
      <!--<el-table-column type="selection"-->
      <!--width="50"></el-table-column>-->
      <el-table-column prop="code"
                       width="100"
                       label="摄像头编号">
      </el-table-column>
      <el-table-column prop="name"
                       :show-overflow-tooltip="true"
                       label="摄像头名称">
      </el-table-column>
      <el-table-column prop="type"
                       label="摄像头类型">
        <template slot-scope="scope">
          {{scope.row.type == 0 ? ' 海康威视' : '大华'}}
        </template>
      </el-table-column>
      <el-table-column prop="x"
                       :show-overflow-tooltip="true"
                       label="X轴坐标">
      </el-table-column>
      <el-table-column prop="y"
                       :show-overflow-tooltip="true"
                       label="Y坐标">
      </el-table-column>
      <el-table-column prop="z"
                       :show-overflow-tooltip="true"
                       label="z轴坐标">
      </el-table-column>
      <el-table-column prop="zoneName"
                       :show-overflow-tooltip="true"
                       label="所属区域">
      </el-table-column>
      <el-table-column header-align="center"
                       align="center"
                       label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item"
                      effect="dark"
                      content="点击查看"
                      placement="right">
            <el-button type="text"
                       size="small"
                       @click="getRoutComMap(scope.row)">
              <i class="el-icon-location-outline"
                 style="cursor: pointer;color: #3E8EF7;"></i>地图查看
            </el-button>
          </el-tooltip>
          <!--<el-button type="text"-->
          <!--size="small"-->
          <!--@click="deleteHandle(scope.row.id,scope.row.name)">播放</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   :total="totalPage"
                   layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <edit-page v-if="addOrUpdateVisible"
               ref="addOrUpdate"
               @refreshDataList="getDataList"></edit-page>
  </div>
</template>

<script>
import editPage from './camera-add-or-update'
import { cameraList } from '@/api/sou/cameraManagement'
import eventBus from '@/bus/index'

export default {
  components: {
    editPage
  },
  data () {
    return {
      dataForm: {
        name: '',
        manageName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  created () { },
  mounted () { },
  activated () {
    this.getDataList()
  },
  computed: {},
  watch: {},
  methods: {
    // 摄像头维护
    getRoutComMap (val) {
      this.$router.push({
        name: 'comMap',
        params: {
          name: 'camera',
          callBackFn: () => {
            eventBus.$emit('mainSidebarCoMap', {
              name: 'cameraFun',
              info: val
            }) // 卡口管理
          }
        } })
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
    // 获取数据列表
    getDataList () {
      // this.dataList = []
      this.dataListLoading = true
      cameraList({
        conditions: this.dataForm.name,
        page: this.pageIndex,
        limit: this.pageSize
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
    deleteHandle (id, name) { }
  }
}
</script>

<style lang='scss' scoped>
.repository-container {
}
</style>
