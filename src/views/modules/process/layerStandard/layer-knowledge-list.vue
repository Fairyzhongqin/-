<!--应急预案-->
<template>
  <div class="emergency-plan-container mod-config">
    <el-form :inline="true" ref="dataForm" class="el-form-margin-bottom" :model="dataForm" @submit.native.prevent @keyup.enter.native="getDataList()">
      <el-form-item label="识别部门" prop="deptNameIdentification">
        <el-popover v-model="popoverVisible" ref="departPopover" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree2" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptNameIdentification" v-popover:departPopover :readonly="true" size="mini" class="select-depart" placeholder="请选择" clearable></el-input>
      </el-form-item>
      <el-form-item label="法规类型" prop="statuteType">
        <el-select v-model="dataForm.statuteType" placeholder="请选择">
          <el-option v-for="item in statuteList" :key="item.label" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" icon="el-icon-search" v-waves>查询</el-button>
        <el-button type="info" size="mini" @click="resetForm('dataForm')" icon="el-icon-refresh-right" v-waves>重置</el-button>
        <el-button type="warning" size="mini" @click="addOrUpdateHandle()" icon="el-icon-plus" v-waves>新增法律法规知识库</el-button>
        <el-button type="danger" size="mini" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" icon="el-icon-delete" v-waves>批量删除</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border @cell-click="cellClick" ref="multipleTable" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="min-width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="40">
      </el-table-column>
      <el-table-column type="index" label="序号" align="center" width="60">
      </el-table-column>
      <el-table-column prop="statuteType" :show-overflow-tooltip="true" label="法规类型">
        <template slot-scope="scope">
          {{scope.row.statuteType|formatType(statuteList)}}
        </template>
      </el-table-column>
      <el-table-column prop="codeNumber" :show-overflow-tooltip="true" label="法规编号" min-width="100">
      </el-table-column>
      <el-table-column prop="moduleType" :show-overflow-tooltip="true" label="适用制度类型" min-width="100">
        <template slot-scope="scope">
          {{scope.row.moduleType==='1'? '风险评价制度':'-'}}
        </template>
      </el-table-column>
      <el-table-column prop="forceDegree" :show-overflow-tooltip="true" label="强制程度" width="100" align="center">
        <template slot-scope="scope">
          <!-- {{scope.row.forceDegree==='1'?'强制性':'推荐性'}} -->
          <el-tag v-if="scope.row.forceDegree==='1'" type="success">强制性</el-tag>
          <el-tag v-else>推荐性</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="existingLaws" :show-overflow-tooltip="true" label="现行法规" width="80" align="center">
        <template slot-scope="scope">
          {{scope.row.existingLaws===true?'是':'否'}}
        </template>
      </el-table-column>
      <el-table-column prop="issueName" :show-overflow-tooltip="true" label="颁布部门">
      </el-table-column>
      <el-table-column prop="revisionDate" :show-overflow-tooltip="true" label="修订日期" min-width="80">
      </el-table-column>
      <el-table-column prop="effectiveDate" :show-overflow-tooltip="true" label="发布日期" min-width="80">
      </el-table-column>
      <el-table-column prop="effectiveDate" :show-overflow-tooltip="true" label="生效日期" min-width="80">
      </el-table-column>
      <!-- <el-table-column prop="description" :show-overflow-tooltip="true" label="相关条款说明" min-width="110">
      </el-table-column>
      <el-table-column prop="updateRecord" :show-overflow-tooltip="true" label="更新记录">
      </el-table-column> -->
      <el-table-column prop="deptName" :show-overflow-tooltip="true" label="适用部门" min-width="80">
      </el-table-column>
      <el-table-column prop="deptNameIdentification" :show-overflow-tooltip="true" label="识别部门" min-width="80">
      </el-table-column>
      <el-table-column prop="identificationDate" :show-overflow-tooltip="true" label="识别日期" min-width="80">
      </el-table-column>
      <!-- <el-table-column prop="reviewDate" :show-overflow-tooltip="true" label="复查日期">
      </el-table-column>
      <el-table-column prop="repealDate" :show-overflow-tooltip="true" label="废止日期"> -->
      <!-- </el-table-column> -->
      <el-table-column prop="matters" :show-overflow-tooltip="true" label="事项" min-width="100">
      </el-table-column>
      <el-table-column prop="fileName" :show-overflow-tooltip="true" label="附件" min-width="100">
        <template slot-scope="scope">
          <a @click.stop="downHandle(scope.row.attachmentId)" title="下载">{{scope.row.fileName}}</a>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" style="color:#E63031" @click.stop="deleteHandle(scope.row.id,scope.row.codeNumber)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>
<script>
import AddOrUpdate from './layer-knowledge-add-or-update'
import { statuteList, statuteDelete } from '@/api/process/statute'
import { departList } from '@/api/sys/depart'
import { getLabels } from '@/api/common/sys'
export default {
  data () {
    return {
      dataForm: {
        deptIdIdentification: '', // 识别部门ID
        statuteType: '', // 法规类型
        deptNameIdentification: ''
      },
      dataList: [],
      statuteList: [], // 法规类型列表
      departList: [],
      defaultProps: {
        label: 'deptName',
        children: 'child'
      }, // 树形结构展示
      // 弹框显示
      addOrUpdateVisible: false,
      popoverVisible: false,
      dataListLoading: false,
      downloadUrl: '', // 文件下载路径
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListSelections: [] // 多选数据
    }
  },
  components: {
    AddOrUpdate
  },
  created () {
    this.getDataList()
    this.getDepartList()
    this.getBaseData()
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取表格内容
    getDataList () {
      this.dataListLoading = true
      statuteList({
        page: this.pageIndex,
        limit: this.pageSize,
        deptIdIdentification: this.dataForm.deptIdIdentification,
        statuteType: this.dataForm.statuteType
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.count
            // console.log(this.dataList, '法律法规')
          } else {
            this.$message.error(data.msg)
          }
          this.dataListLoading = false
        })
        .catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
          this.dataListLoading = false
        })
    },
    // 获取部门树
    getDepartList () {
      this.dataListLoading = true
      departList().then(({ data }) => {
        if (data && data.code === 0) {
          this.departList = [data.data[0]] || []
          this.dataListLoading = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 识别部门菜单树选中
    departListTreeCurrentChangeHandle (data, node) {
      // 当前节点的数据，对象
      this.dataForm.deptIdIdentification = data.id
      this.dataForm.deptNameIdentification = data.deptName
      this.popoverVisible = false
    },
    // 加载基础数据
    getBaseData () {
      // 法规类型
      getLabels({
        type: 'STATUTE_TYPE'
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.statuteList = data.list
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => console.log(err))
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.dataForm.deptIdIdentification = ''
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
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
    // 下载处理
    downHandle (id) {
      let token = document.cookie.split('=')[1]
      this.downloadUrl = this.$http.adornUrl(`/spring-processweb/attachment/download?id=${id}&token=${token}`)
      window.location.href = this.downloadUrl
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
      this.$confirm(
        `确定对[法律编号为=${nameArr.join(',')}]进行[${
        id ? '删除' : '批量删除'
        }]操作?`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          statuteDelete(ids)
            .then(({ data }) => {
              if (data && data.code === 0) {
                this.getDataList()
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
    }
  },
  filters: {
    formatType (val, map) {
      let optionName = ''
      map.map(item => {
        if (val === item.label) {
          optionName = item.value
        }
      })
      return optionName
    }
  }
}
</script>
<style lang="scss">
.emergency-plan-container {
  .el-input--medium .el-input__icon {
    line-height: 28px;
  }
  .tijiao {
    margin-right: 5px;
    vertical-align: top;
    margin-top: 1px;
  }
}
</style>
