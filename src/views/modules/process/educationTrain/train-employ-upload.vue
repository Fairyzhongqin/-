<!-- 应急预案弹框 -->
<template>
  <el-dialog :title="(!dataForm.id ? '上传' : '修改') + '资料'" :close-on-click-modal="false" class="emergency-planning-dialog" width="600px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="115px">
      <el-form-item label="资料标题" prop="dataTitle">
        <el-input v-model="dataForm.dataTitle" placeholder="请输入资料标题" clearable size="mini"></el-input>
      </el-form-item>
      <!-- <el-form-item label="所属类型" prop="trainType">
        <el-select v-model="dataForm.trainType" placeholder="请选择所属类型" @change="selectTrainType">
          <el-option v-for="item in trainTypeList" :key="item.label" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="所属类别" prop="trainCategory">
        <el-popover v-model="popoverVisible" popper-class="high" placement="bottom-start" ref="trainPopover" trigger="click">

          <el-tree :data="trainData" :props="defaultProps" node-key="id" ref="zoneTree" @current-change="selectTrainTypeChange" default-expand-all :highlight-current="true" :expand-on-click-node="false">

          </el-tree>

        </el-popover>
        <el-input v-model="dataForm.trainCategory" v-popover:trainPopover size="mini" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item>
      <el-form-item label="关键词" prop="keyWord">
        <el-input v-model="dataForm.keyWord" placeholder="请输入关键词" clearable size="mini"></el-input>
      </el-form-item>
      <el-form-item label="文件类型" prop="fileType">
        <el-select v-model="dataForm.fileType" placeholder="请选择文件类型">
          <el-option v-for="item in fileTypeList" :key="item.label" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="附件上传" prop="attachmentId">
        <el-upload class="upload-demo" ref="upload" :action="uploadUrl" :headers="uploadHeaders" :data="uploadData" :on-change="uploadHandle" accept=".pdf,.doc,.docx" :auto-upload="false" :on-success="successHandle" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :on-exceed="handleExceed" :file-list="dataForm.fileList" :limit="1">
          <el-button size="mini" class="upload">点击选择上传文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传pdf/doc/docx文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item v-if="fileList.length>0 && !dataForm.attachmentId">
        <el-button size="mini" @click="uploadFile()" class="upload">确认上传</el-button>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
    <!-- <select-staff v-if="selectStaffVisible" ref="selectStaff" @selectStaffEmit="selectStaffEmit">
    </select-staff> -->
  </el-dialog>
</template>

<script>
// eslint-disable-next-line no-unused-vars
import { contingencyInfo, contingencyDownloadInfo, attachmentDelete, contingencyAddOrUpdate } from '@/api/process/emergencyPlan'
import { getLabels } from '@/api/common/sys'
import { traintypeList, traintypeChildList, trainpDataAdd, trainDataInfo } from '@/api/process/education'

// import selectStaff from './emergency-plan-add-check-staff'
export default {
  components: {
    // selectStaff
  },
  data () {
    return {
      trainData: [],
      defaultProps: {
        label: 'selectlabel',
        children: 'child'
      }, // 树形结构展示
      popoverVisible: false,
      dataForm: {
        dataTitle: '',
        trainType: '',
        trainCategory: '',
        keyWord: '',
        fileType: ''
      },
      trainTypeList: [{
        label: '1',
        value: '从业人员培训'
      }, {
        label: '2',
        value: '管理人员培训'
      }, {
        label: '3',
        value: '其它人员培训'
      }, {
        label: '4',
        value: '日常安全培训'
      }],
      fileTypeList: [{
        label: '1',
        value: '文档'
      }, {
        label: '2',
        value: '视频'
      }, {
        label: '3',
        value: '语音'
      }, {
        label: '4',
        value: '其它'
      }],

      fileList: [],
      factorTypeList: [],
      isDisabled: false,
      disabled: false,
      visible: false,
      filelListVisible: false,
      selectStaffVisible: false, // 选择人员弹框
      pageIndex: 1,
      pageSize: 20,
      uploadUrl: '',
      uploadData: {},
      uploadHeaders: {},
      filename: '', // 文件名
      selectChange: {}, // 选中项
      dataRule: {
        factorMainId: [{ required: true, message: '请选择事故类型', trigger: 'change' }],
        name: [{ required: true, message: '请输入预案概况', trigger: 'blur' }],
        // attachmentId: [{ required: true, message: '请选择文件上传', trigger: 'change' }],
        date: [{ required: true, message: '请选择日期', trigger: 'change' }],
        liablePersonId: [{ required: true, message: '请选择人员', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getDate()
    this.getBaseData()
  },
  methods: {
    // 页面初始化时加载的事件
    // 初始数据
    init (type, id) {
      console.log(type, id)
      this.isDisabled = false
      this.visible = true
      this.dataForm.id = id || ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.fileList = []
        if (type === 'cy') {
          this.dataForm.trainType = '1'
          console.log('qwqew', this.dataForm)
          this.selectTrainType('1')
        }
        if (type === 'gl') {
          this.dataForm.trainType = '2'
          this.selectTrainType('2')
        }
        if (type === 'aq') {
          this.dataForm.trainType = '3'
          this.selectTrainType('3')
        }
        if (type === 'qt') {
          this.dataForm.trainType = '4'
          this.selectTrainType('4')
        }
        if (id) {
          this.isDisabled = true
          trainDataInfo({ id: id }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm = data.entity
              console.log(this.dataForm)

              if (this.dataForm.attachmentId) {
                this.selectFileInfo(this.dataForm.attachmentId)
              }
            } else {
              this.$message.error(data.msg)
            }
          }).catch(err => {
            this.isDisabled = false
            console.log(err)
          })
        }
      })
    },
    // 根据培训类型关联培训类别
    selectTrainType (trainType) {
      this.trainData = []
      traintypeList({ trainType: trainType }).then(({ data }) => {
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
    // 识别部门菜单树选中
    selectTrainTypeChange (data, node) {
      // 当前节点的数据，对象
      console.log(data)
      this.dataForm.trainCategory = data.selectlabel
      this.popoverVisible = false
    },
    // 初始化时间
    getDate () {
      let date = new Date()
      let todayDate = date.toLocaleDateString()
      this.dataForm.date = new Date(todayDate).Format('yyyy-MM-dd')
    },
    // 加载基础数据
    getBaseData () {
      getLabels({
        'type': 'ACCIDENT_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.factorTypeList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 查询单个文件信息
    selectFileInfo (id) {
      contingencyDownloadInfo({ id: id }).then(({ data }) => {
        this.isDisabled = false
        if (data && data.code === 0) {
          // console.log(data, '1111111111111111111')
          let obj = {}
          obj.name = data.data.fileName
          obj.url = data.data.filePath
          let arr = []
          arr.push(obj)
          // this.dataForm.fileList.push()
          this.$set(this.dataForm, 'fileList', arr)
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => {
        this.isDisabled = false
        console.log(err)
      })
    },
    // 添加人员
    // selectStaffShow () {
    //   this.selectStaffVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.selectStaff.init(this.selectChange)
    //   })
    // },
    // 人员组件返回值
    selectStaffEmit (val) {
      this.selectChange = val
      this.dataForm.liablePersonId = val.gh
      this.dataForm.liablePerson = val.name
      this.selectStaffVisible = false
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      this.filename = file.name
      this.filelListVisible = true
    },
    handleExceed (files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove () {
      if (this.dataForm.attachmentId) {
        let ids = [this.dataForm.attachmentId]
        attachmentDelete(ids)
          .then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.attachmentId = ''
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
      }
    },
    // 文件状态改变时的处理函数
    uploadHandle (file, fileList) {
      this.fileList = fileList
      let token = document.cookie.split('=')[1]
      this.uploadHeaders = { token: token }
      this.uploadUrl = this.$http.adornUrl('/spring-processweb/attachment/upload')
      this.uploadData = { fileType: '1' }
    },
    // 上传文件
    uploadFile () {
      this.$refs.upload.submit()
    },
    // 表单提交成功之后的回调
    successHandle (response) {
      // console.log(response)
      if (response && response.code === 0) {
        this.dataForm.attachmentId = response.data
        this.$message({
          message: '文件上传成功',
          type: 'success',
          duration: 1500,
          onClose: () => { }
        })
      } else {
        this.$message.error(response.msg)
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          trainpDataAdd(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.dataForm.fileList = []
              this.fileList = []
              this.$message.success('保存成功!')
              this.$emit('refreshDataList')
            } else {
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
          })
        }
      })
    }

  }
}
</script>
<style lang="scss">
.emergency-planning-dialog {
  .el-select {
    width: 100%;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
  .upload {
    color: #2c78bb;
    border-color: #97c2e9;
  }
}
</style>


