 <!--审核页面 -->
<template>
  <el-dialog title="审核应急预案" :close-on-click-modal="false" class="emergency-planning-dialog" width="600px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="115px">
      <el-form-item label="事故类型" prop="factorMainId">
        <el-select v-model="dataForm.factorMainId" placeholder="请选择" disabled>
          <el-option v-for="item in factorTypeList" :key="item.label" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="预案名称" prop="name">
        <el-input v-model="dataForm.name" :autosize="{ minRows: 2}" placeholder="预案名称" maxlength="150" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="责任人" prop="liablePersonId">
        <el-input v-model="dataForm.liablePerson" disabled size="mini" class="size-mini-pople-input">
        </el-input>
      </el-form-item>
      <el-form-item label="附件" prop="file">
        <el-input v-model="dataForm.fileName" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="提交人" prop="submitPerson">
        <el-input v-model="dataForm.submitPerson" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="提交日期" prop="date">
        <el-input v-model="dataForm.date" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item prop="state" label="审核">
        <el-radio v-model="dataForm.state" label="2">通过</el-radio>
        <el-radio v-model="dataForm.state" label="3">不通过</el-radio>
      </el-form-item>
      <el-form-item v-if="dataForm.state==='3'" prop="opinion" label='审核意见'>
        <el-input v-model="dataForm.opinion" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
    <select-staff v-if="selectStaffVisible" ref="selectStaff" @selectStaffEmit='selectStaffEmit'>
    </select-staff>
  </el-dialog>
</template>

<script>
import http from '@/utils/httpRequest'
import { contingencyInfo, contingencyAudit } from '@/api/process/emergencyPlan'
import { getLabels } from '@/api/common/sys'
import selectStaff from './emergency-plan-add-check-staff'
export default {
  components: {
    selectStaff
  },
  data () {
    return {
      dataForm: {
        date: '',
        name: '',
        factorMainId: '',
        attachmentId: '',
        fileName: '',
        liablePersonId: '', // 负责人Id
        liablePerson: '', // 负责人名称
        submitPerson: '',
        submitPersonId: '',
        entryPerson: '',
        entryPersonId: '',
        auditPerson: '',
        auditPersonId: '',
        state: '2', // 预案状态
        opinion: '' // 审核意见
      },
      factorTypeList: [],
      fileList: [], // 文件列表
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
        // factorMainId: [{ required: true, message: '请选择事故类型', trigger: 'change' }],
        // name: [{ required: true, message: '请输入预案概况', trigger: 'blur' }],
        // // file: [{ required: true, message: '请选择文件上传', trigger: 'change' }],
        state: [{ required: true, message: '请进行审核', trigger: 'change' }],
        opinion: [{ required: true, message: '请填写审核意见', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getBaseData()
  },
  methods: {
    // 页面初始化时加载的事件
    // 初始数据
    init (id) {
      this.isDisabled = false
      this.visible = true
      this.dataForm.id = id || ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.liablePerson = ''
        this.fileList = []
        if (id) {
          this.isDisabled = true
          contingencyInfo({ id: id }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm = data.data
              this.dataForm.state = '2'
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
    beforeRemove (file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    beforeUploadFunction (file) {
      console.log('beforeUploadFunction')
      let token = document.cookie.split('=')[1]
      this.uploadHeaders = { token: token }
      this.uploadUrl = this.dataForm.id ? http.adornUrl('/spring-processweb/contingency/update') : http.adornUrl('/spring-processweb/contingency/add')
      this.uploadData = this.dataForm
    },
    beforeUploadFunction1 () {
      console.log('beforeUploadFunction1')
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let list = []
          let obj = {}
          obj.state = this.dataForm.state
          obj.id = this.dataForm.id
          obj.opinion = this.dataForm.opinion
          list.push(obj)
          contingencyAudit(list)
            .then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList')
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
}
</style>


