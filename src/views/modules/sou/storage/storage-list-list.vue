<template>
  <div class='equlpment-tank-container mod-config'>
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="getDataList()">
      <el-form-item label="名称/编号"
                    prop="name">
        <el-input v-model="dataForm.name"
                  placeholder="名称/编号"
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
                     :show-all-levels="false"></el-cascader> -->
        <el-popover v-model="popoverVisible"
                    ref="departPopover"
                    placement="bottom-start"
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
      <el-form-item label="存储设施类型"
                    prop="tankTypeId">
        <el-select size="mini"
                   v-model="dataForm.tankTypeId"
                   placeholder="请选择储罐类型"
                   clearable>
          <el-option v-for="item in tanTypeList"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"
                     popper-class="tankCacsa"></el-option>
        </el-select>
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
                   @click="getRoutComMap()">储罐维护</el-button>

      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              ref="multipleTable"
              @cell-click="cellClick"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">

      <el-table-column type="id"
                       v-if="false"
                       :show-overflow-tooltip="true"
                       width="50"></el-table-column>

      <el-table-column prop="code"
                       :show-overflow-tooltip="true"
                       width="100"
                       label="设施编号">
      </el-table-column>
      <el-table-column prop="name"
                       width="170"
                       :show-overflow-tooltip="true"
                       label="设施名称">
      </el-table-column>
      <el-table-column prop="tankTypeName"
                       width="120"
                       :show-overflow-tooltip="true"
                       label="设施类型"
                       align="center">
        <template slot-scope="scope">
          <span class="typebg"
                v-if="scope.row.tankTypeName">{{scope.row.tankTypeName}}</span>
          <span v-else>暂无类型</span>
        </template>
      </el-table-column>
      <el-table-column prop="zoneName"
                       width="140"
                       label="所属区域">
      </el-table-column>
      <el-table-column prop="storageName"
                       width="150"
                       label="储存物品名称">
      </el-table-column>

      <el-table-column prop="dangerAttr"
                       :show-overflow-tooltip="true"
                       width="180"
                       label="风险属性">
      </el-table-column>
      <el-table-column prop="describe"
                       :show-overflow-tooltip="true"
                       width="180"
                       label="描述">
      </el-table-column>
      <el-table-column prop="metersDescribe"
                       :show-overflow-tooltip="true"
                       label="已配置仪表">
        <template slot-scope="scope">
          <template v-for="(item,index) in scope.row.metersDescribe">
            <el-tag :key="storage">{{item}}</el-tag>
          </template>
        </template>
      </el-table-column>
      <el-table-column width="170"
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
                     @click.stop="getRoutComMap(scope.row,'comMap')">
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
               @refreshDataList="getDataList"
               @close="() =>{addOrUpdateVisible= false}"
               ref="addOrUpdate"></edit-page>
  </div>
</template>

<script>
import waves from '@/utils/waves'
import editPage from './storage-list-add-or-update'
// eslint-disable-next-line no-unused-vars
import { tankList, tankDelete } from '@/api/sou/equlpment'
import { storageFaciltyTypeList } from '@/api/risk/dangerStorageManage'

// import { repositoryList } from '@/api/sou/baseInfo'
import eventBus from '@/bus/index'
// eslint-disable-next-line no-unused-vars
import { treeDataTranslate2 } from '@/utils'
import { getLabels } from '@/api/common/sys'
import { queryZoneInfo } from '@/api/pos/region.js'

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
        tankTypeId: '',
        zoneName: ''
      },
      tanTypeList: [], // 存储类型
      // 设施形状类型
      typeList: [],
      zoneList: [],
      popoverVisible: false,
      // options: [],
      defaultProps: {
        label: 'zoneName',
        children: 'subregion'
      },
      // cascaderProps: {
      //   label: 'zoneName',
      //   value: 'id',
      //   children: 'subregion'
      // },
      // 设施形式
      layoutList: [],
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
    this.getFaciltyShape()
    this.getFaciltyForm()
    this.getAllType()
    this.getAllZoneList()
  },
  mounted () {
    this.getFaciltyShape()
    this.getFaciltyForm()
  },
  activated () {
    this.getDataList()
    this.getFaciltyShape()
    this.getFaciltyForm()
    // this.getAllZone()
    this.getAllType()
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
    // 地图跳转
    getRoutComMap (val) {
      this.$router.push({
        name: 'comMap',
        params: {
          name: 'tank',
          callBackFn: () => {
            eventBus.$emit('mainSidebarCoMap', {
              name: 'tankFun',
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
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // // 获取所有区域
    // getAllZone () {
    //   queryZoneInfo().then(({ data }) => {
    //     if (data && data.code === 0) {
    //       console.log(data.data)
    //       this.options = treeDataTranslate2(data.data || [], 'id', 'parentId')[0].subregion
    //       console.log(this.options)
    //     } else {
    //       this.options = []
    //     }
    //   }).catch(err => {
    //     console.log(err)
    //     this.$message.error('未知异常！请联系管理员')
    //   })
    // },
    // 获取所有类型
    getAllType () {
      storageFaciltyTypeList().then(({ data }) => {
        console.log(data, '================')
        if (data && data.code === 0) {
          this.tanTypeList = data.page.list
        }
      })
    },
    // 获取数据列表
    getDataList () {
      // this.dataList = []
      this.dataListLoading = true
      tankList({
        page: this.pageIndex,
        limit: this.pageSize,
        sourType: '4',
        name: this.dataForm.name,
        zoneId: this.dataForm.zoneId,
        // zoneId: this.dataForm.zoneName[this.dataForm.zoneName.length - 1],
        tankTypeId: this.dataForm.tankTypeId
      }).then(({ data }) => {
        if (data && data.code === 0) {
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
      this.dataForm.zoneId = ''
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
      }).catch(() => { })
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

<style lang='scss'>
.equlpment-tank-container {
  .typebg {
    background-color: #2d334ed4;
    color: #fff;
    padding: 4px 5px;
    border-radius: 3px;
  }
  .el-tag + .el-tag {
    margin-left: 5px;
  }
}
</style>
