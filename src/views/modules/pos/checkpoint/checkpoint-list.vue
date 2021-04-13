<!--卡口管理-->
<template>
  <div class="mod-config">
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             class="el-form-margin-bottom"
             @keyup.enter.native="getDataList()">
      <!-- <el-form-item label="值班室人员"
                    prop="manageName">
        <el-input v-model="dataForm.manageName"
                  size="mini"
                  placeholder="值班室人员"
                  clearable>
        </el-input>
      </el-form-item> -->
      <el-form-item label="卡口名称"
                    prop="name">
        <el-input v-model.trim="dataForm.name"
                  size="mini"
                  placeholder="卡口名称"
                  clearable></el-input>
      </el-form-item>
      <el-form-item>

        <el-button type="primary"
                   size="mini"
                   v-waves
                   @click="getDataList()">
          <i class="el-icon-search"></i>
          查询</el-button>
        <el-button type="info"
                   size="mini"
                   v-waves
                   icon="el-icon-refresh-right"
                   @click="
                   resetForm('dataForm')">重置</el-button>
        <el-button type="primary"
                   size="mini"
                   class="switch-sys"
                   @click="getRoutComMap()">卡口维护</el-button>
        <!-- <el-button type="warning"
                   size="mini"
                   icon="el-icon-plus"
                   v-waves
                   @click="addOrUpdateHandle(scope.row.id)">新增卡口</el-button>
        <el-button type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   v-waves
                   @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
        <!-- <elButtons @getDataList='getDataList'
                   @resetForm="resetForm('dataForm')"
                   @addOrUpdateHandle='addOrUpdateHandle'
                   @deleteHandle='deleteHandle'
                   :dataListSelections='dataListSelections' /> -->
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              ref="multipleTable"
              @cell-click='cellClick'
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">

      <!-- <template slot-scope="scope">{{scope.row.name || '-'}}</template> -->

      <!-- <el-table-column type="id"
                       v-if="false"
                       width="50"></el-table-column> -->
      <el-table-column type="selection"
                       width="40"></el-table-column>
      <el-table-column type="index"
                       label="序号"
                       width="62">
      </el-table-column>
      <el-table-column prop="name"
                       label="卡口名称">
      </el-table-column>
      <el-table-column prop="type"
                       label="卡口类型">
        <template slot-scope="scope">
          {{scope.row.type == '0' ?'物理一道门':'物理二道门'}}
        </template>
      </el-table-column>
      <el-table-column prop="personShow"
                       label="值班室人员">
        <template slot-scope="scope">
          {{scope.row.personShow || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="contact"
                       label="值班室电话">
        <template slot-scope="scope">{{scope.row.contact || '-'}}</template>
      </el-table-column>
      <el-table-column prop="location"
                       :show-overflow-tooltip="true"
                       label="X轴坐标">
        <template slot-scope="scope">
          <span v-if="scope.row.positionX">
            {{scope.row.positionX }}
          </span>
          <span v-else>-</span>
        </template></el-table-column>
      <el-table-column prop="location"
                       :show-overflow-tooltip="true"
                       label="Y轴坐标">
        <template slot-scope="scope">
          <span v-if="scope.row.positionY">
            {{scope.row.positionY}}
          </span>
          <span v-else>-</span>
        </template></el-table-column>
      <el-table-column prop="location"
                       :show-overflow-tooltip="true"
                       label="Z轴坐标">
        <template slot-scope="scope">
          <span v-if="scope.row.positionZ">
            {{scope.row.positionZ}}
          </span>
          <span v-else>-</span>
        </template></el-table-column>

      <el-table-column width="120"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click.stop="addOrUpdateHandle(scope.row.id)">
            查看
          </el-button>
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
                   layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import elButtons from '@/components/el-button/button'
import AddOrUpdate from './check-point-add-or-update'
import { checkpointList, checkpointDelete } from '@/api/pos/checkpoint'
import waves from '@/utils/waves'
import eventBus from '@/bus/index'

export default {
  directives: {
    waves
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
  components: {
    AddOrUpdate, elButtons
  },
  computed: {
  },
  activated () {
    this.getDataList()
  },
  methods: {
    // 地图跳转
    getRoutComMap () {
      this.$router.push({
        name: 'comMap',
        params: {
          name: 'checkpoint',
          callBackFn: () => {
            eventBus.$emit('mainSidebarCoMap', {
              name: 'checkpointFun'
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
      checkpointList({
        page: this.pageIndex,
        limit: this.pageSize,
        name: this.dataForm.name,
        manageName: this.dataForm.manageName
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
    addOrUpdateHandle (id, type) {
      if (!type) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      } else {
        this.$router.push({ path: '/comMap', name: 'comMap', params: { name: 'checkpoint', val: id } })
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
      }
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 删除
    deleteHandle (id, name) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      let nameArr = name ? [name] : this.dataListSelections.map(item => {
        return item.name
      })
      this.$confirm(`确定对[姓名=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        checkpointDelete(ids).then(({ data }) => {
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
  }
}
</script>
