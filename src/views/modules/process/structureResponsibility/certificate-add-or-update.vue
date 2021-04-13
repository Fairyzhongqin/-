<template>
  <el-dialog title="新增证书" :close-on-click-modal="false" class="private-dialog" width="600px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
      <el-form-item label="证书名称" prop="name">
        <el-input v-model="dataForm.name" size="mini" placeholder="证书名称" clearable></el-input>
      </el-form-item>
      <!--<el-form-item label="有效期" prop="validityTerm">-->
      <!--<el-input v-model="dataForm.validityTerm" size="mini" placeholder="有效期" clearable></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="获取途径" prop="accessWay">
        <el-input v-model="dataForm.accessWay" size="mini" placeholder="获取途径" clearable></el-input>
      </el-form-item>
      <!--<el-form-item label="持证人量" prop="certificatesNumber">-->
      <!--<el-input v-model="dataForm.certificatesNumber" size="mini" placeholder="持证人量" clearable></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label='附件' prop='attachmentId'>-->
      <!--<el-upload class="upload-demo" ref="upload" :action="uploadUrl" :headers="uploadHeaders" :data="uploadData" :on-change="uploadHandle" accept=".pdf,.doc,.docx" :auto-upload="false" :on-success="successHandle" :before-remove="beforeRemove" multiple :on-exceed="handleExceed" :file-list="dataForm.fileList" :limit="1">-->
      <!--<el-button size="mini" class="upload">点击选择上传文件</el-button>-->
      <!--<div slot="tip" class="el-upload__tip">只能上传pdf/doc/docx文件，且不超过500kb</div>-->
      <!--</el-upload>-->
      <!--</el-form-item>-->
      <!--<el-form-item v-if="fileList.length>0 && !dataForm.attachmentId">-->
      <!--<el-button size="mini" @click="uploadFile()" class="upload">确认上传</el-button>-->
      <!--</el-form-item>-->
      <el-form-item label="证书类型" prop="type">
        <el-select v-model="dataForm.type" placeholder="请选择证书类型">
          <el-option v-for="item in certificateTypeList" :key="item.label" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { certificateAddOrUpdate, certificateInfo, attachmentInfo, attachmentDelete } from '@/api/process/certificate'
import { getLabels } from '@/api/common/sys'
export default {
  data () {
    return {
      dataForm: {
        id: '',
        name: '', // 证书名称
        type: '', // 证书类型
        validityTerm: '', // 有效期
        accessWay: '', // 获取途径
        // certificatesNumber: '',
        attachmentId: '', // 附件id
        fileList: [] // 文件列表
      },
      visible: false,
      isDisabled: false,
      uploadUrl: '',
      uploadData: {},
      uploadHeaders: {},
      fileList: [], // 文件列表
      certificateTypeList: [], // 证书类型数据
      dataRule: {
        name: [{ required: true, message: '请输入证书名称', trigger: 'blur' }],
        validityTerm: [{ required: true, message: '请选择有效期', trigger: 'blur' }],
        accessWay: [{ required: true, message: '获取途径', trigger: 'blur' }],
        type: [{ required: true, message: '请选择证书类型', trigger: 'change' }],
        attachmentId: [{ required: true, message: '请上传附件', trigger: 'change' }]
      }
    }
  },
  created () {
    this.getCertificateType() // 获取证书类型数据
  },
  methods: {
    init (id) {
      this.dataForm.id = id || ''
      this.visible = true
      this.isDisabled = false
      this.dataForm.fileList = []
      this.fileList = []
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (id) {
          this.isDisabled = true
          certificateInfo({
            'id': this.dataForm.id || undefined
          }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm = data.entity
              if (this.dataForm.attachmentId) {
                this.selectFileInfo(this.dataForm.attachmentId)
              }
            } else {
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.isDisabled = false
            this.$message.error('未知异常！请联系管理员')
          })
        }
      })
    },
    // 得到证书类型
    getCertificateType () {
      getLabels({
        type: 'CERTIFICATE_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.certificateTypeList = data.list
        }
      })
    },
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          certificateAddOrUpdate(this.dataForm).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.$emit('refreshDataList')
              this.$message.success('操作成功')
            } else {
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
          })
        }
      })
    },
    // 查询单个文件信息
    selectFileInfo (id) {
      attachmentInfo({ id: id }).then(({ data }) => {
        this.isDisabled = false
        if (data && data.code === 0) {
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
    // 文件状态改变时的处理函数
    uploadHandle (file, fileList) {
      this.dataForm.fileList = fileList
      this.fileList = fileList
      let token = document.cookie.split('=')[1]
      this.uploadHeaders = { token: token }
      this.uploadUrl = this.$http.adornUrl('/spring-processweb/attachment/upload')
      this.uploadData = { fileType: '3' }
    },
    // 上传文件
    uploadFile () {
      this.$refs.upload.submit()
    },
    // 超出限制
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
              // this.list = []
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
    // 表单提交成功之后的回调
    successHandle (response) {
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
    }
  }
}
</script>

<style scoped>
</style>
