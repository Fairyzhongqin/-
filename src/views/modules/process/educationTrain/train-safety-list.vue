<!--从业人员培训-->
<template>
  <div class="train-safety-style mod-config">
    <el-form :inline="true" ref="dataForm" class="el-form-margin-bottom" :model="dataForm" @submit.native.prevent @keyup.enter.native="getDataList()">

      <el-form-item label="资料名称" prop="trainName">
        <el-input v-model="dataForm.trainName" size="mini" placeholder="请输入资料名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" icon="el-icon-search" v-waves>查询</el-button>
        <el-button type="info" size="mini" @click="resetForm('dataForm')" icon="el-icon-refresh-right" v-waves>重置</el-button>
        <el-button type="warning" size="mini" @click="addOrUpdateHandle('aq')" icon="el-icon-plus" v-waves>上传资料</el-button>
        <!-- <el-button type="danger" size="mini" @click="deleteHandle()" :disabled="dataListSelections.length <= 0" icon="el-icon-delete" v-waves>批量删除</el-button> -->
      </el-form-item>
    </el-form>
    <div style="height:100%">
      <div class="catalogue">
        <p>日常安全培训</p>
        <el-input placeholder="输入关键字进行过滤" v-model="filterText">
        </el-input>
        <el-tree :data="trainData" :props="defaultProps" ref="treeTrain" @node-click="handleNodeClick" :highlight-current="true" :default-expand-all="true" :filter-node-method="filterNode"></el-tree>
      </div>
      <el-table :data="dataList" border @cell-click="cellClick" ref="multipleTable" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="min-width: 100%;">
        <el-table-column type="selection" header-align="center" align="center" width="40">
        </el-table-column>
        <el-table-column type="index" label="序号" align="center" width="60">
        </el-table-column>
        <el-table-column prop="dataTitle" :show-overflow-tooltip="true" label="资料标题" width="100">
        </el-table-column>
        <el-table-column prop="courseMsg" :show-overflow-tooltip="true" label="教程简介" min-width="120">
        </el-table-column>
        <el-table-column prop="keyWord" :show-overflow-tooltip="true" label="关键词" width="100">
        </el-table-column>
        <el-table-column prop="fileType" :show-overflow-tooltip="true" label="文件类型" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.fileType === '1'">文档</span>
            <span v-if="scope.row.fileType === '2'">视频</span>
            <span v-if="scope.row.fileType === '3'">语音</span>
            <span v-if="scope.row.fileType === '4'">其它</span>
          </template>
        </el-table-column>
        <el-table-column prop="uploadPerson" :show-overflow-tooltip="true" label="上传人" width="100">
        </el-table-column>
        <el-table-column prop="uploadDate" :show-overflow-tooltip="true" label="上传日期" width="100">
          <template slot-scope="scope">
            {{scope.row.uploadDate ? scope.row.uploadDate.split(' ')[0] : '-'}}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click.stop="workableHandle(scope.row.id)">查看</el-button>
            <el-button type="text" size="small" @click.stop="workableHandle(scope.row.id)">下载</el-button>
            <el-button type="text" size="small" @click.stop="addOrUpdateHandle('aq',scope.row.id)">修改</el-button>
            <el-button type="text" size="small" style="color:#E63031" @click.stop="deleteHandle(scope.row.id,scope.row.dataTitle)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" background :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      <!-- 弹窗, 新增 / 修改 -->
    </div>
    <train-employ-upload v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></train-employ-upload>
    <!-- <train-play-workable v-if="trainTypeVisible" ref="trainType" @refreshDataList="getDataList"></train-play-workable> -->
  </div>
</template>
<script>
// import AddOrUpdate from './layer-knowledge-add-or-update'
// eslint-disable-next-line no-unused-vars
import { statuteList, statuteDelete } from '@/api/process/statute'
import { departList } from '@/api/sys/depart'
import { getLabels } from '@/api/common/sys'
import trainPlayWorkableAddOrUpdate from './train-play-workable-add-or-update'
// import trainPlayWorkable from './train-play-workable'
import trainEmployUpload from './train-employ-upload'
import { traintypeList, traintypeChildList, trainDataList, trainDataDelete } from '@/api/process/education'

export default {
  data () {
    return {
      dataForm: {
        trainName: ''
      },
      filterText: '',

      dataList: [],
      trainCategoryName: '',
      statuteList: [], // 法规类型列表
      departList: [],
      trainTypeVisible: false,
      trainData: [],
      selectlabel: '', // 点击目录时选中的
      defaultProps: {
        label: 'selectlabel',
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
    trainPlayWorkableAddOrUpdate,
    // trainPlayWorkable,
    trainEmployUpload
  },
  watch: {
    filterText (val) {
      this.$refs.treeTrain.filter(val)
    }
  },
  created () {
    this.getDataList()
    this.getDepartList()
    this.getBaseData()
    this.selectTrainType()
  },
  methods: {
    filterNode (value, data) {
      console.log(value, data)
      if (!value) return true
      return data.selectlabel.indexOf(value) !== -1
    },
    // 点击目录
    handleNodeClick (data) {
      console.log(data)
      this.selectlabel = data.selectlabel
      this.getDataList()
    },
    // 根据培训类型关联培训类别
    selectTrainType () {
      this.trainData = []
      traintypeList({ trainType: '3' }).then(({ data }) => {
        if (data && data.code === 0) {
          if (data.page.list.length > 0) {
            data.page.list.map(async item => {
              await traintypeChildList({ id: item.id }).then(data2 => {
                if (data2.data && data2.data.code === 0) {
                  data2.data.list.map((val, index) => {
                    val.id = index + item.id
                    val.selectlabel = val.trainCategoryLevel + item.trainCategoryName
                  })
                }
                item.selectlabel = item.trainCategoryName
                item.child = data2.data.list || []
              })
              this.trainData.push(item)
            })
            console.log(this.trainData)
          }
        }
      })
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取表格内容
    getDataList () {
      this.dataListLoading = true
      trainDataList({
        page: this.pageIndex,
        limit: this.pageSize,
        trainCategory: this.selectlabel || '',
        trainType: '3'
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

      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle (type, id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(type, id)
      })
    },
    // 落实
    workableHandle (id) {
      this.trainTypeVisible = true
      this.$nextTick(() => {
        this.$refs.trainType.init(id)
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
        `确定对[资料标题为=${nameArr.join(',')}]进行[${
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
          trainDataDelete(ids)
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
.train-safety-style {
  .catalogue {
    float: left;
    width: 200px;
    border: 1px solid #ced1d6;
    height: 100%;
    overflow: auto;
    padding: 0 10px;
  }
  .el-table {
    width: calc(100% - 200px);
    min-width: calc(100% - 200px) !important;
  }
}
</style>
