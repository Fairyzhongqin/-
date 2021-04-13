<template>
  <div class='highrisk-type mod-config'>
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="getDataList()">
      <el-form-item width="50"
                    label="危险化学品名称"
                    prop="name">
        <el-input v-model="dataForm.name"
                  size="mini"
                  placeholder="请输入危险化学品名称"
                  clearable>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="getDataList"
                   icon="el-icon-search"
                   v-waves>查询
        </el-button>
        <el-button type="info"
                   size="mini"
                   icon="el-icon-refresh-right"
                   v-waves
                   @click="
                   resetForm('dataForm')">重置
        </el-button>
        <el-button type="warning"
                   size="mini"
                   icon="el-icon-plus"
                   @click="addOrUpdateHandle()"
                   v-waves>新增
        </el-button>
        <el-button type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   @click="deleteHandle()"
                   v-waves
                   :disabled="dataListSelections.length <= 0">批量删除
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              ref="multipleTable"
              @cell-click="cellClick"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">
      <el-table-column type="selection"
                       width="50">
      </el-table-column>
      <el-table-column type="index"
                       label="序号"
                       width="50">
      </el-table-column>
      <el-table-column prop="name"
                       :show-overflow-tooltip="true"
                       label="名称">
      </el-table-column>
      <el-table-column prop="casNum"
                       label="cas号"
                       width="90"
                       :show-overflow-tooltip="true"
                       align="center">
      </el-table-column>
      <el-table-column prop="riskContent"
                       :show-overflow-tooltip="true"
                       label="危险特性">
      </el-table-column>
      <el-table-column prop="type"
                       label="物理形态"
                       width="90"
                       align="center">
        <template slot-scope="scope">
          {{scope.row.type | formatType(typeList)}}
        </template>
      </el-table-column>
      <el-table-column prop="fireHazardous"
                       label="火灾危险等级"
                       width="100"
                       align="center">
        <template slot-scope="scope">
          {{scope.row.fireHazardous | formatType(fireLevelList)}}
        </template>
      </el-table-column>
      <el-table-column prop="organicFlag"
                       label="有机性"
                       width="90"
                       align="center">
        <template slot-scope="scope">
          {{scope.row.organicFlag | formatType(organicList)}}
        </template>
      </el-table-column>
      <el-table-column prop="toxicProperties"
                       label="毒害性"
                       width="90"
                       align="center">
        <template slot-scope="scope">
          {{scope.row.toxicProperties | formatType(levelList)}}
        </template>
      </el-table-column>
      <el-table-column prop="corrosive"
                       label="腐蚀性"
                       width="90"
                       align="center">
        <template slot-scope="scope">
          {{scope.row.corrosive | formatType(corrosiveList)}}
        </template>
      </el-table-column>
      <el-table-column width="120"
                       label="操作"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     size="small"
                     @click.stop="addOrUpdateHandle(scope.row.id)">修改
          </el-button>
          <el-button type="text"
                     size="small"
                     @click.stop="deleteHandle(scope.row.id,scope.row.name)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   :total="totalPage"
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList">
    </add-or-update>
  </div>
</template>

<script>
import addOrUpdate from './danger-add-or-update'
import waves from '@/utils/waves'
import { getLabels } from '@/api/common/sys'
import { dangerChemicalsList, dangerChemicalsDelete } from '@/api/sou/highRisk'

export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        name: '',
        symbol: '',
        riskContent: '',
        type: '', // 化学品形态
        organicFlag: '0',
        fireHazardous: '',
        toxicProperties: '0',
        corrosive: '0',
        remarks: '',
        cas号: ''
      },
      typeList: [], // 化学品形态
      fireLevelList: [], // 火灾风险等级
      organicList: [], // 有机性列表
      dataList: [], // 列表数据
      levelList: [], // 毒害性列表
      corrosiveList: [], // 腐蚀性列表
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  created () {
    this.getDataList() // 获取数据列表
    this.getBaseData()// 获取基础数据
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
      // 获取化学品形态的列表
      getLabels({
        'type': 'DANGER_MATERIAL_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.typeList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
      // 获取火灾风险等级的列表
      getLabels({
        'type': 'FIREHAZARDOUS_LEVEL'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.fireLevelList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
      // 获取有机性的数据类别
      getLabels({
        'type': 'OGANICFLAG'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.organicList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
      getLabels({
        'type': 'TOXIC_PROPERTIES'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.levelList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
      // 获取腐蚀性等级的数据列表
      getLabels({
        'type': 'corrosive_level'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.corrosiveList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      dangerChemicalsList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'name': this.dataForm.name
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
    // 新增 / 修改
    addOrUpdateHandle (id) {
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
      this.$confirm(`确定对[危险工艺品名称为=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          dangerChemicalsDelete(ids)
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

<style lang="scss" scoped>
.highrisk-type {
  .el-scrollbar__wrap {
    height: 200px;
  }
}
</style>
