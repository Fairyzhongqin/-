<template>
  <div class="shouldknow-container mod-config">
    <el-table :data="dataList" row-key="id" border default-expand-all ref="multipleTable" v-loading="dataListLoading" highlight-current-row @cell-click="cellClick" :tree-props="{children:'subregion'}" style="width:100%">

      <el-table-column prop="zoneName" min-width="150" label="区域名称">

      </el-table-column>
      <el-table-column prop="code" min-width="150" label="区域编号">
        <template slot-scope="scope">
          <template v-if="scope.row.id !== '0'">
            {{scope.row.code}}
          </template>
        </template>
      </el-table-column>

      <el-table-column prop="riskLevel" label="风险等级" width="200">
        <template slot-scope="scope">
          <template v-if="scope.row.id !== '0'">
            <el-tag v-if="scope.row.riskLevel === '0'" size="mini" class="redStyle">{{scope.row.riskLevel | riskMatch(riskList)}}</el-tag>
            <el-tag v-else-if="scope.row.riskLevel === '1'" size="mini" class="orangeStyle">{{scope.row.riskLevel | riskMatch(riskList)}}</el-tag>
            <el-tag v-else-if="scope.row.riskLevel === '2'" size="mini" class="yellowStyle">{{scope.row.riskLevel | riskMatch(riskList)}}</el-tag>
            <el-tag v-else-if="scope.row.riskLevel === '3'" size="mini" class="blueStyle">{{scope.row.riskLevel | riskMatch(riskList)}}</el-tag>
            <span v-else>-</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <el-button type="text" v-if="scope.row.riskLevel" @click.stop="edit(scope.row,false)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <add-or-update v-if="editorVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <preview v-if="previewVisible" ref="preview"></preview>
  </div>
</template>
<script>
import waves from '@/utils/waves'
import { treeDataTranslate2 } from '@/utils'
import { getLabels } from '@/api/common/sys.js'
import { queryRiskZone, queryZoneInfo } from '@/api/pos/region'
import addOrUpdate from './shouldknow-add-or-update'
import preview from './shouldknow-preview'
export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        code: ''// 风险分区id
      },
      id: '',
      addForm: {
        photo: ''
      },
      editForm: {
        content: ''
      },
      content: '13123',
      dataListSelections: [],
      dataList: [],
      srcList: [],
      imgForm: '',
      image: '',
      inputVisible: false,
      photoVisible: false,
      dialogVisible: false,
      editorVisible: false,
      riskZoneList: [], // 风险分区列表
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      isDisabled: false,
      dataListLoading: false,
      addOrUpdateVisible: false,
      previewVisible: true
    }
  },
  components: {
    addOrUpdate,
    preview
  },
  created () {
    this.initGetLabelRisk()
    this.getAllRiskZone()
  },
  activated () {
  },
  methods: {
    // 在字典表里查询事故发生的可能性
    initGetLabelRisk () {
      getLabels({
        type: 'risk_level'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.riskList = data.list
        } else {
          this.$message.error(data.msg)
        }
        this.getDataList()
      }).catch(err => {
        console.log(err)
      })
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      queryZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = treeDataTranslate2(data.data || [], 'id', 'parentId')
          this.dataListLoading = false
        }
      })
    },
    getAllRiskZone () {
      queryRiskZone().then(({ data }) => {
        if (data && data.code === 0) {
          this.riskZoneList = data.list
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    handlePrint (content) {
      let newWin = window.open('')// 新打开一个空窗口
      newWin.document.write(`<html><head><title></title></title></head>
                             <body>
                             <h1 style="text-align:center">应知卡</h1>
                             <p>${content}</p>
                             </body><html>`)
      newWin.document.close()// 在IE浏览器中使用必须添加这一句
      newWin.focus()// 在IE浏览器中使用必须添加这一句
      newWin.print()// 打印
      newWin.close()// 关闭窗口
    },
    // 编辑框
    edit (info, code) {
      this.editorVisible = true
      this.$nextTick(() => {
        // this.$refs.addOrUpdate.init(id, code)
        this.$refs.preview.init(info)
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
    riskMatch (val, map) {
      let riskName = ''
      map.map(value => {
        if (val === value.label) {
          riskName = value.value
        }
      })
      return riskName
    }
  }
}
</script>
<style lang="scss">
.redStyle {
  padding: 0px 5px;
  color: #fff;
  background-color: red;
}
.orangeStyle {
  padding: 0px 5px;
  color: #fff;
  background-color: orange;
}
.yellowStyle {
  padding: 0px 5px;
  color: gray;
  background-color: yellow;
  border-color: #d5e4f1;
}
.blueStyle {
  padding: 0px 5px;
  color: #fff;
  background-color: blue;
}
</style>
<style lang="scss" scoped>
.shouldknow-container {
  // 使用deep深度穿透
  /deep/ .el-table .cell {
    display: flex;
    line-height: 32px;
  }
  .el-dialog {
    height: 400px;
  }
  /deep/ .ql-toolbar.ql-snow {
    display: none;
  }
  /deep/ .ql-editor {
    border-top: 1px solid #ccc;
  }
}
</style>
