<template>
  <div class="promise-container mod-config">

    <el-table :data="dataList" row-key="id" border default-expand-all ref="multipleTable" v-loading="dataListLoading" highlight-current-row @cell-click="cellClick" :tree-props="{children:'subregion'}" style="width:100%">
      <el-table-column prop="zoneName" min-width="150" label="区域名称">
        <template slot-scope="scope">
          {{scope.row.zoneName}}
        </template>
      </el-table-column>
      <el-table-column prop="code" min-width="150" label="区域编号">
        <template slot-scope="scope">
          <template v-iif="scope.row.id !== '0'">
            {{scope.row.code}}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="riskLevel" label="风险等级" width="200px">
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
          <el-button type="text" v-if="scope.row.riskLevel && !scope.row.promiseId" @click="addOrUpdate(scope.row.code)" :disabled="scope.row.promiseId ? true:false">新增</el-button>
          <el-button type="text" v-if="scope.row.riskLevel && scope.row.promiseId" @click="addOrUpdate(null,scope.row.promiseId)" :disabled="!scope.row.promiseId ? true:false">修改</el-button>
          <el-button type="text" v-if="scope.row.riskLevel" @click="examineHandle(null,scope.row.promiseId)" :disabled="!scope.row.promiseId ? true:false">查看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <add-or-update v-if="editorVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <examine v-if="examineVisible" ref="examine"></examine>
  </div>
</template>
<script>
import { promiseList } from '@/api/risk/card'
import { queryRiskZone } from '@/api/pos/region'
import addOrUpdate from './promise-add-or-update'
import examine from './promise-examine'
import http from '@/utils/httpRequest'
import { getLabels } from '@/api/common/sys.js'
export default {

  components: {
    addOrUpdate,
    examine
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
      dataListSelections: [],
      dataList: [],
      srcList: [],
      riskList: [],
      imgForm: '',
      image: '',
      editorVisible: false,
      examineVisible: false,
      dialogVisible: false,
      riskZoneList: [], // 风险分区列表
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      isDisabled: false,
      dataListLoading: false,
      addOrUpdateVisible: false,
      uploadUrl: '',
      uploadData: {},
      uploadHeaders: {}
    }
  },

  created () {
    this.getDataList()
    this.getAllRiskZone()
    this.initGetLabelRisk()
  },
  activated () {
  },
  methods: {
    handlePrint (content) {
      let newWin = window.open('')// 新打开一个空窗口
      newWin.document.write(`<html><head><title></title></title></head>
                             <body>
                             <h1 style="text-align:center">承诺卡</h1>
                             <p>${content}</p>
                              <div style="position:absolute;right:20px;bottom:15px">
                                <p>承诺人：&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;年&nbsp;&nbsp;&nbsp;&nbsp;月&nbsp;&nbsp;&nbsp;&nbsp;日</p>
                              </div>
                             </body><html>`)
      newWin.document.close()// 在IE浏览器中使用必须添加这一句
      newWin.focus()// 在IE浏览器中使用必须添加这一句
      newWin.print()// 打印
      newWin.close()// 关闭窗口
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      promiseList().then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = [data.data] || []
        } else {
          this.dataList = []
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
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
    // 新增或编辑承诺卡内容
    addOrUpdate (code, id) {
      this.editorVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(code, id)
      })
    },
    // 查看
    examineHandle (code, id) {
      this.examineVisible = true
      this.$nextTick(() => {
        this.$refs.examine.init(code, id)
      })
    },
    // 查看上传图片
    showImgHandle () {
      this.dialogVisible = true
    },
    // 删除上传图片
    delImgHandle () {
      this.addForm.photo = ''
      this.srcList = []
    },
    // 文件状态改变时的钩子
    getFile (file) {
      // if (this.beforeUpload(file)) {
      //   console.log(file, '=============')

      //   this.imgForm = file
      //   this.getBase64(file.raw).then(res => {
      //     this.addForm.photo = res
      //     this.srcList = []
      //     this.srcList.push(res)
      //   })
      // } else {
      //   this.addForm.photo = ''
      // }
    },
    // 上传文件之前的钩子
    beforeUpload (file) {
      let token = document.cookie.split('=')[1]
      this.uploadHeaders = { token: token }
      this.uploadUrl = http.adornUrl('/spring-riskweb/promise/upload')
      this.uploadData = { id: this.id }
      const isJPG = /^image\/(jpeg|png|jpg)$/.test(file.raw.type)
      const isLt10M = Number(file.size) / 1024 / 1024 < 10
      if (!isJPG) {
        this.$message.error('上传图片只能上传jpeg/jpg/png文件!')
      }
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      return isJPG && isLt10M
    },
    // 文件列表移除文件时的钩子
    handleRemove (file, fileList) {
      this.isDisabled = false
    },

    // 上传图片的文本框
    imgUpload (id) {
      this.id = id
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        // this.from = 'person'
        this.$refs.addOrUpdate.init(id)
      })
    },
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
      }).catch(err => {
        console.log(err)
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

<style lang="scss" scoped>
.promise-container {
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
}
</style>
