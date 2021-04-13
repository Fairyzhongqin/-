<template>
  <div class='equlpment-tank-reactor mod-config'>
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="getDataList()">
      <el-form-item label="装置名称/编号"
                    prop="manageName">
        <el-input v-model="dataForm.manageName"
                  placeholder="装置名称/编号"
                  size="mini"
                  clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="所属区域"
                    prop="zoneName">
        <!-- <el-cascader v-model="dataForm.zoneName"
                     :options="options"
                     :props="cascaderProps"
                     size="mini"
                     clearable
                     placeholder="试试搜索：EPS事业部"
                     filterable
                     :show-all-levels="false"
                     popper-class="cascaTree"></el-cascader> -->
        <el-popover v-model="popoverVisible"
                    ref="departPopover"
                    placement="bottom-start"
                    width="208"
                    popper-class="high"
                    trigger="click">
          <el-tree :data="zoneList"
                   :props="defaultProps"
                   node-key="id"
                   ref="departListTree"
                   :default-expanded-keys="[]"
                   @current-change="departListTreeCurrentChangeHandle"
                   default-expand-all
                   :highlight-current="true"
                   :expand-on-click-node="false">
          </el-tree>

        </el-popover>
        <el-input v-model="dataForm.zoneName"
                  v-popover:departPopover
                  :readonly="true"
                  size="mini"
                  class="size-mini-pople-input menu-list__input"
                  placeholder="请选择所属区域"
                  clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="mini"
                   icon="el-icon-search"
                   v-waves
                   @click="getDataList()">查询</el-button>
        <el-button type="info"
                   size="mini"
                   icon="el-icon-refresh-right"
                   v-waves
                   @click="
                   resetForm('dataForm')">重置</el-button>
        <el-button type="primary"
                   size="mini"
                   class="switch-sys"
                   @click="getRoutComMap()">反应装置维护</el-button>
        <!-- <el-button type="warning"
                   size="mini"
                   icon="el-icon-plus"
                   v-waves
                   @click="addOrUpdateHandle()">新增反应装置</el-button>
        <el-button type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   v-waves
                   @click="deleteHandle()"
                   :disabled="dataListSelections.length <= 0">批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              ref="multipleTable"
              @cell-click="cellClick"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">

      <!-- <el-table-column type="id"
                       v-if="false"
                       :show-overflow-tooltip="true"
                       width="50"></el-table-column> -->
      <!-- <el-table-column type="selection"
                       width="50"></el-table-column> -->
      <el-table-column prop="code"
                       :show-overflow-tooltip="true"
                       label="装置编号">
      </el-table-column>
      <el-table-column prop="name"
                       :show-overflow-tooltip="true"
                       label="装置名称">
      </el-table-column>
      <el-table-column prop="zoneName"
                       :show-overflow-tooltip="true"
                       label="所属区域">
      </el-table-column>
      <el-table-column prop="remarks"
                       :show-overflow-tooltip="true"
                       label="备注">
      </el-table-column>
      <el-table-column width="150"
                       label="操作">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click.stop="addOrUpdateHandle(scope.row)">
            配置仪表
          </el-button>
          <!-- <el-tooltip class="item"
                      effect="dark"
                      content="点击查看"
                      placement="right"> -->
          <el-button type="text"
                     size="small"
                     @click.stop="getRoutComMap(scope.row)">
            <i class="el-icon-location-outline"
               style="cursor: pointer;color: #3E8EF7;"></i>地图查看
          </el-button>
          <!-- </el-tooltip> -->
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
               @close="closeDialog()"
               ref="addOrUpdate"
               @refreshDataList="getDataList"></edit-page>
  </div>
</template>

<script>
import waves from '@/utils/waves'
import eventBus from '@/bus/index'
import editPage from './reactor-add-or-update'
import { queryZoneInfo } from '@/api/pos/region.js'
import { treeDataTranslate2 } from '@/utils'
import { reactorList, reactorDelete } from '@/api/sou/equlpment'
export default {
  directives: {
    waves
  },
  components: {
    editPage
  },
  data () {
    return {
      dataForm: {
        name: '',
        manageName: '',
        zoneName: '',
        zoneId: ''
      },
      options: [],
      // cascaderProps: {
      //   label: 'zoneName',
      //   value: 'id',
      //   children: 'subregion'
      // },
      zoneList: [],
      popoverVisible: false,
      // options: [],
      defaultProps: {
        label: 'zoneName',
        children: 'subregion'
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
  created () {
    this.getDataList()
    this.getAllZone()
    this.getAllZoneList()
  },
  mounted () { },
  activated () {
    this.getDataList()
    this.getAllZone()
  },
  computed: {},
  watch: {},
  methods: {
    // 菜单树选中
    departListTreeCurrentChangeHandle (data, node) {
      // 当前节点的数据，对象
      this.dataForm.zoneId = data.id
      this.dataForm.zoneName = data.zoneName
      this.popoverVisible = false
    },
    // 获得上级区域下拉框的值，并在加载结束后初始化table的list
    getAllZoneList () {
      this.dataListLoading = true
      queryZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.zoneList = data.data.subregion
        } else {
          this.zoneList = []
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 关闭弹框
    closeDialog () {
      this.addOrUpdateVisible = false
    },
    // 获取所有区域
    getAllZone () {
      queryZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data.data)
          this.options = treeDataTranslate2(data.data || [], 'id', 'parentId')[0].subregion
          console.log(treeDataTranslate2(data.data || [], 'id', 'parentId'))

          console.log(this.options)
        } else {
          this.options = []
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 地图跳转
    getRoutComMap (val) {
      this.$router.push({
        name: 'comMap',
        params: {
          name: 'device',
          callBackFn: () => {
            eventBus.$emit('mainSidebarCoMap', {
              name: 'deviceFun',
              info: val
            }) // 卡口管理
          }
        }
      })
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
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取数据列表
    getDataList () {
      // this.dataList = []
      this.dataListLoading = true
      reactorList({
        page: this.pageIndex,
        limit: this.pageSize,
        // name: this.dataForm.name,
        'zoneId': this.dataForm.zoneId,
        // zoneId: this.dataForm.zoneName[this.dataForm.zoneName.length - 1],
        name: this.dataForm.manageName
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
      this.dataForm.zoneId = ''
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle (info) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(info)
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
      this.$confirm(`确定对[反应装置名=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        reactorDelete(ids).then(({ data }) => {
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

<style lang='scss'>
.cascaTree {
  .el-cascader-panel {
    max-height: 200px;
  }
}
</style>
