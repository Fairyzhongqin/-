<!--高危工艺管理-->
<template>
  <div class='highrisk-process-manage mod-config'>
    <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item width="50" label="工艺类型" prop="typeId">
        <el-select v-model="dataForm.typeId" placeholder="请选择" size="mini">
          <el-option v-for="item in highTypeList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生产区域" prop="zoneId">
        <el-popover v-model="popoverVisible" ref="departPopover" placement="bottom-start" trigger="click" width="208" popper-class="high">
          <el-tree :data="zoneList" :props="defaultProps" node-key="id" ref="departListTree" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.zoneName" v-popover:departPopover :readonly="true" size="mini" class="size-mini-pople-input menu-list__input" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList" icon="el-icon-search" v-waves>查询
        </el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" v-waves @click="
                   resetForm('dataForm')">重置
        </el-button>
        <el-button type="warning" size="mini" icon="el-icon-plus" @click="addOrUpdateHandle()" v-waves>新增
        </el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteHandle()" v-waves :disabled="dataListSelections.length <= 0">批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border ref="multipleTable" @cell-click="cellClick" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" width="50">
      </el-table-column>
      <!-- <el-table-column type="index"
                       label="序号"
                       width="50">
      </el-table-column> -->
      <el-table-column prop="name" :show-overflow-tooltip="true" label="工艺名称" width="200">
      </el-table-column>
      <el-table-column prop="typeEntity.name" :show-overflow-tooltip="true" label="工艺类型">
        <template slot-scope="scope">
          <span class="typebg">{{scope.row.typeEntity.name}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="zoneName" :show-overflow-tooltip="true" label="生产区域">
      </el-table-column>
      <el-table-column prop="riskChemicalNames" :show-overflow-tooltip="true" label="涉及危化品">
      </el-table-column>
      <el-table-column prop="status" :show-overflow-tooltip="true" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status==='0'" type="success">运行</el-tag>
          <el-tag v-if="scope.row.status==='1'" type="danger">停止</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="150" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="updateStatus(scope.row.id,scope.row.status)" :class="{enable:scope.row.status==='0'}">{{scope.row.status==='0'?'停止':'运行'}}</el-button>
          <el-button type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id)">修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @closeDialog="addOrUpdateVisible=false" @refreshDataList="getDataList">
    </add-or-update>
  </div>
</template>

<script>
import addOrUpdate from './process-manage-add-or-update'
import waves from '@/utils/waves'
import { getLabels } from '@/api/common/sys'
import { highRiskProcessList, processDelete, highRiskProcessTypeList, processUpdateStatus } from '@/api/sou/highRisk'
import { queryZoneInfo } from '@/api/pos/region'
export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        zoneId: '', //
        zoneName: '',
        typeId: ''
      },
      typeList: [], // 风险类型
      dataList: [], // 列表数据
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      highTypeList: [],
      popoverVisible: false,
      zoneList: [],
      defaultProps: {
        label: 'zoneName',
        children: 'subregion'
      }
    }
  },
  created () {
    this.getDataList() // 获取数据列表
    this.getAllZoneList() // 获得生产区域下拉框的值
    this.getHighTypeList()// 获取高危工艺类型
  },
  mounted () {
  },
  components: {
    addOrUpdate
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 加载基础数据
    getBaseData () {
      getLabels({
        'type': 'accident_type'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.typeList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 获取数据列表
    getDataList () {
      this.addOrUpdateVisible = false
      this.dataListLoading = true
      highRiskProcessList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'zoneId': this.dataForm.zoneId,
        'typeId': this.dataForm.typeId
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.count
          console.log(this.dataList, '工艺列表')
        } else {
          this.dataList = []
          this.$message.error(data.msg)
          this.totalPage = 0
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
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
    // 菜单树选中
    departListTreeCurrentChangeHandle (data, node) {
      // 当前节点的数据，对象
      this.dataForm.zoneId = data.id
      this.dataForm.zoneName = data.zoneName
      this.popoverVisible = false
    },
    // 获取数据列表
    getHighTypeList () {
      this.dataListLoading = true
      highRiskProcessTypeList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'name': ''
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.highTypeList = data.page.list
          console.log(this.highTypeList)
        } else {
          this.highTypeList = []
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id, data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        // this.from = 'person'
        this.$refs.addOrUpdate.init(id)
      })
    },
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
      this.$confirm(`确定对[风险因素名称为=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          processDelete(ids)
            .then(({ data }) => {
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
            })
            .catch(err => {
              console.log(err)
              this.$message.error('未知异常！请联系管理员')
            })
        })
        .catch(() => {
        })
    },
    // 更新状态
    updateStatus (id, status) {
      this.dataListLoading = true
      processUpdateStatus({
        'id': id,
        'status': status === '0' ? '1' : '0'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.$message.success('更新成功')
          this.getDataList()
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
      this.dataForm.zoneName = ''
      this.getDataList()
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
.highrisk-process-manage {
  .el-scrollbar__wrap {
    height: 200px;
  }
  .typebg {
    background-color: #2d334ed4;
    color: #fff;
    padding: 4px 5px;
    border-radius: 3px;
  }
  .enable {
    color: #e63031;
  }
}
</style>
