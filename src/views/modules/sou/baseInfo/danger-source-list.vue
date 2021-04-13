<!--重大危险源列表-->
<template>
  <div class="danger-source mod-config">
    <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()">
      <!-- <el-form-item label="重大危险源级别"
                    prop="zoneName">
        <el-input v-model="dataForm.level"
                  placeholder="重大危险源级别"
                  size="mini"
                  clearable>
        </el-input>
      </el-form-item> -->
      <el-form-item label="危险源级别" prop="level">
        <el-select v-model="dataForm.level" size="mini" clearable>
          <el-option v-for="item in levelList" :key="item.value" :label="item.label" :value="item.value" placeholder="请选择">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" icon="el-icon-search" v-waves @click="getDataList()">查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" v-waves @click="
                   resetForm('dataForm')">重置</el-button>
        <el-button type="warning" size="mini" icon="el-icon-plus" v-waves @click="addHandle()">新增重大危险源</el-button>
        <el-button type="danger" size="mini" icon="el-icon-delete" v-waves @click="deleteHandle()" :disabled="dataListSelections.length <= 0">批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border ref="multipleTable" @cell-click="cellClick" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="id" v-if="false" :show-overflow-tooltip="true" width="50">
      </el-table-column>
      <el-table-column type="selection" width="50">
      </el-table-column>
      <el-table-column prop="businessName" label="危险源名称">
      </el-table-column>
      <el-table-column prop="type" label="危险源类型">
        <template slot-scope="scope">
          {{scope.row.type | formatType(typeList)}}
        </template>
      </el-table-column>
      <el-table-column prop="level" label="危险源级别">
        <template slot-scope="scope">
          <!-- {{scope.row.level | formatType(levelList)}} -->
          <el-tag type="danger" v-if="scope.row.level==='0'">一级</el-tag>
          <el-tag type="warning" v-if="scope.row.level==='1'">二级</el-tag>
          <el-tag v-if="scope.row.level==='2'">三级</el-tag>
          <el-tag type="success" v-if="scope.row.level==='3'">四级</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="address" :show-overflow-tooltip="true" label="具体位置">
      </el-table-column>
      <el-table-column width="120" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="showHandle(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <edit-page v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList">
    </edit-page>
    <!-- 弹窗, 查看库房 -->
    <depository-check-page v-if="depositoryCheckVisible" ref="depository" @refreshDataList="getDataList"></depository-check-page>
    <!-- 弹窗, 查看生产场所 -->
    <produceplace-check-page v-if="produceplaceCheckVisible" ref="produceplace" @refreshDataList="getDataList"></produceplace-check-page>
    <!-- 弹窗, 查看库区 -->
    <repository-check-page v-if="repositoryCheckVisible" ref="repository" @refreshDataList="getDataList"></repository-check-page>
    <!-- 弹窗, 查看罐区 -->
    <tankfield-check-page v-if="tankfieldCheckVisible" ref="tankfield" @refreshDataList="getDataList"></tankfield-check-page>
    <!-- 弹窗, 查看储罐 -->
    <tank-check-page v-if="tankCheckVisible" ref="tank" @refreshDataList="getDataList"></tank-check-page>
    <!-- 弹窗, 查看反应装置 -->
    <reactor-check-page v-if="reactorCheckVisible" ref="reactor" @refreshDataList="getDataList"></reactor-check-page>
  </div>
</template>

<script>
import waves from '@/utils/waves'
import editPage from './danger-source-add-or-update'
import depositoryCheckPage from '@/views/modules/pos/region/depository-add-or-update'
import produceplaceCheckPage from '@/views/modules/pos/region/produceplace-add-or-update'
import repositoryCheckPage from '@/views/modules/pos/region/repository-add-or-update'
import tankfieldCheckPage from '@/views/modules/pos/region/tankfield-add-or-update'
import tankCheckPage from './danger-source-tank'
import reactorCheckPage from './danger-source-reactor'

// eslint-disable-next-line no-unused-vars
import { dangerSourceList, dangerSourceDelete } from '@/api/sou/baseInfo'
export default {
  directives: {
    waves
  },
  components: {
    editPage,
    depositoryCheckPage,
    produceplaceCheckPage,
    repositoryCheckPage,
    tankfieldCheckPage,
    tankCheckPage,
    reactorCheckPage
  },
  data () {
    return {
      dataForm: {
        level: '' // 危险源级别
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      typeList: [{
        value: '0',
        typeName: 'repository',
        label: '库区'
      }, {
        value: '1',
        typeName: 'depository',
        label: '库房'
      }, {
        value: '2',
        typeName: 'produceplace',
        label: '生产场所'
      }, {
        value: '3',
        typeName: 'tankfield',
        label: '罐区'
      }, {
        value: '4',
        typeName: 'tank',
        label: '储罐'
      }, {
        value: '5',
        typeName: 'reactor',
        label: '反应装置'
      }],
      levelList: [{
        value: '0',
        label: '一级'
      }, {
        value: '1',
        label: '二级'
      }, {
        value: '2',
        label: '三级'
      }, {
        value: '3',
        label: '四级'
      }],
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      depositoryCheckVisible: false, // 查看仓库
      produceplaceCheckVisible: false, // 查看生产场所
      repositoryCheckVisible: false, // 查看库区
      tankfieldCheckVisible: false, // 查看罐区
      tankCheckVisible: false, // 查看储罐
      reactorCheckVisible: false // 查看反应装置
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
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取数据列表
    getDataList () {
      // this.dataList = []
      this.dataListLoading = true
      dangerSourceList({
        page: this.pageIndex,
        limit: this.pageSize,
        level: this.dataForm.level
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
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
    addHandle (row) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(row)
      })
    },
    // 查看
    showHandle (row) {
      let typeName = ''
      this.typeList.map(value => {
        if (value.value === row.type) typeName = value.typeName
      })
      this[`${typeName}CheckVisible`] = true
      console.log(row)
      this.$nextTick(() => {
        this.$refs[typeName].init(row.businessId)
      })
    },
    // 删除
    deleteHandle (id) {
      let ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.businessId
        })
      let nameArr = name
        ? [name]
        : this.dataListSelections.map(item => {
          return item.businessName
        })
      this.$confirm(`确定对[危险源名称=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        dangerSourceDelete(ids).then(({ data }) => {
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
    formatType (value, map) {
      let optionName = ''
      map.map((val) => {
        if (value === val.value) {
          optionName = val.label
        }
      })
      return optionName
    }
  }
}
</script>

<style lang="scss">
.danger-source {
  .reactNum {
    color: #2c78bb;
  }
  .reactNum:hover {
    text-decoration: underline;
  }
}
</style>
