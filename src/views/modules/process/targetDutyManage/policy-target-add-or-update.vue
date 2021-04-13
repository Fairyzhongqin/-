<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '企业方针'" :close-on-click-modal="false" class="policy-target-dialog" width="650px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="110px">
      <el-form-item label='公司名称' prop='companyName'>
        <el-input v-model="dataForm.companyName" placeholder="请输入公司名称" clearable maxlength="20" size="mini"></el-input>
      </el-form-item>
      <el-form-item label='指标年度' prop='year'>
        <el-date-picker v-model="dataForm.year" type="year" placeholder="年度" value-format="yyyy" @change="selectYearHandle"> </el-date-picker>
      </el-form-item>
      <el-form-item label='方针描述' prop='policies'>
        <el-input v-model="dataForm.policies" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入企业方针" clearable maxlength="500" size="mini" show-word-limit></el-input>
      </el-form-item>
      <!-- <el-form-item label='指标级别' prop='level'>
        <el-select v-model="dataForm.level" placeholder="请选择" disabled>
          <el-option v-for="item in targetLevelList" :key="item.label" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label='目标文件' prop='attachmentId'>
        <el-upload class="upload-demo" ref="upload" :action="uploadUrl" :headers="uploadHeaders" :data="uploadData" :on-change="uploadHandle" accept=".pdf,.doc,.docx" :auto-upload="false" :on-success="successHandle" :before-remove="beforeRemove" multiple :on-exceed="handleExceed" :file-list="dataForm.fileList" :limit="1">
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
  </el-dialog>
</template>
<script>
import { policiesAddOrUpdate, policiesInfo, policiesList } from '@/api/process/targetDuty'
import { contingencyDownloadInfo, attachmentDelete } from '@/api/process/emergencyPlan'
import { getLabels } from '@/api/common/sys'
export default {
  data () {
    // 选择年度
    // let validateYear = (rule, value, callback) => {
    //   if (this.getDataList(value)) {
    //     callback(new Error('重复请重新选择年份'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      dataForm: {
        id: '',
        companyName: '',
        year: '',
        level: '1',
        limitDate: '',
        policies: '',
        attachmentId: '',
        remarks: '',
        fileList: [] // 文件列表
      },
      uploadUrl: '',
      uploadData: {},
      uploadHeaders: {},
      fileList: [], // 文件列表
      targetLevelList: [], // 企业目标指标级别列表
      dataList: [], // 数据列表
      isDisabled: false,
      disabled: false,
      visible: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataRule: {
        companyName: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        year: [{ required: true, message: '请选择年度', trigger: 'change' }],
        level: [{ required: true, message: '请选择指标等级', trigger: 'change' }],
        limitDate: [{ required: true, message: '请选择完成期限', trigger: 'change' }],
        policies: [{ required: true, message: '请输入企业方针', trigger: 'blur' }],
        attachmentId: [{ required: true, message: '请选择文件上传', trigger: 'change' }]
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
        this.dataForm.fileList = []
        this.dataForm.attachmentId = ''
        this.fileList = []
        if (id) {
          this.isDisabled = true
          policiesInfo({ id: id }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm = data.data
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
    // 加载基础数据
    getBaseData () {
      getLabels({
        'type': 'TARGET_LEVEL'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.targetLevelList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 获取企业方针和目标数据列表
    async getDataList (year) {
      this.dataListLoading = true
      await policiesList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'year': year
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.dataList = data.page.list
          this.totalPage = data.page.count
          if (this.dataList.length > 0) {
            this.$message.warning('该年度企业指标已存在！请重新选择年度')
            this.dataForm.year = ''
          }
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
    // 选择年份变化的处理函数
    async selectYearHandle (val) {
      await this.getDataList(val)
    },
    // 文件状态改变时的处理函数
    uploadHandle (file, fileList) {
      this.fileList = fileList
      let token = document.cookie.split('=')[1]
      this.uploadHeaders = { token: token }
      this.uploadUrl = this.$http.adornUrl('/spring-processweb/attachment/upload')
      this.uploadData = { fileType: '3' }// 企业年度安全生产目标文件
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
              this.list = []
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
      // console.log(response)
      if (response && response.code === 0) {
        this.dataForm.attachmentId = response.data
        // this.$set(this.dataForm, 'attachmentId', response.data)
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
          policiesAddOrUpdate(
            this.dataForm
          ).then(({ data }) => {
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
    }
  }
}
</script>

<style lang="scss">
.policy-target-dialog {
  .el-input--medium .el-input__icon {
    line-height: 28px;
  }
  .el-select {
    width: 100%;
  }
  .el-row {
    margin-left: -60.5px;
  }
  .upload {
    color: #2c78bb;
    border-color: #97c2e9;
  }
  .el-date-editor {
    width: 100%;
  }
}
</style>


