<!-- 法律法规知识库弹框 -->
<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '法律法规知识库'" :close-on-click-modal="false" class="emergency-planning-dialog" width="750px" :visible.sync="visible">
    <!-- <div style="height: 400px;">
      <el-scrollbar style="height:100%" class="default-scrollbar" wrap-class="default-scrollbar__wrap" view-class="p20-scrollbar__view"> -->
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="100px">
      <el-row :gutter="5">
        <el-col :span="12">
          <el-form-item label="法规类型" prop="statuteType">
            <el-select v-model="dataForm.statuteType" placeholder="请选择">
              <el-option v-for="item in layerTypeList" :key="item.label" :label="item.value" :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="法规编号" prop="codeNumber">
            <el-input v-model="dataForm.codeNumber" placeholder="法规编号" clearable>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="强制程度" prop="forceDegree">
            <el-radio v-model="dataForm.forceDegree" label="1">强制性</el-radio>
            <el-radio v-model="dataForm.forceDegree" label="2">推荐性</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="现行法规" prop="existingLaws">
            <el-radio v-model="dataForm.existingLaws" label="1">是</el-radio>
            <el-radio v-model="dataForm.existingLaws" label="0">否</el-radio>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="适用制度类型" prop="moduleType">
            <el-select v-model="dataForm.moduleType" placeholder="请选择">
              <el-option v-for="item in moduleTypeList" :key="item.label" :label="item.value" :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="颁布部门" prop="issueName">
            <el-input v-model="dataForm.issueName" size="mini" placeholder="国家政府机构" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="修定日期" prop="revisionDate">
            <el-date-picker v-model="dataForm.revisionDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发布日期" prop="releaseDate">
            <el-date-picker v-model="dataForm.releaseDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="生效日期" prop="effectiveDate">
            <el-date-picker v-model="dataForm.effectiveDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="适用部门" prop="deptName">
            <el-popover v-model="popoverVisible1" ref="departPopover1" placement="bottom-start" trigger="click" popper-class="high">
              <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree1" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle1" default-expand-all :highlight-current="true" :expand-on-click-node="false">
              </el-tree>
            </el-popover>
            <el-input v-model="dataForm.deptName" v-popover:departPopover1 :readonly="true" size="mini" class="select-depart" placeholder="请选择部门" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <el-form-item label="复查日期" prop="reviewDate">
            <el-date-picker v-model="dataForm.reviewDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="废止日期" prop="repealDate">
            <el-date-picker v-model="dataForm.repealDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item> -->
      <el-row>
        <el-col :span="12">
          <el-form-item label="识别部门" prop="deptNameIdentification">
            <el-popover v-model="popoverVisible2" ref="departPopover2" placement="bottom-start" trigger="click" popper-class="high">
              <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree2" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle2" default-expand-all :highlight-current="true" :expand-on-click-node="false">
              </el-tree>
            </el-popover>
            <el-input v-model="dataForm.deptNameIdentification" v-popover:departPopover2 :readonly="true" size="mini" class="select-depart" placeholder="请选择部门" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="识别日期" prop="identificationDate">
            <el-date-picker v-model="dataForm.identificationDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="事项" prop="matters">
            <el-input v-model="dataForm.matters" type="textarea" drag rows="4" placeholder="法律法规及其他要求事项" maxlength="500" clearable size="mini" show-word-limit></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- <el-form-item label="相关条款说明" prop="description">
            <el-input v-model="dataForm.description" type="textarea" :autosize="{ minRows: 2}" placeholder="相关条款说明" clearable maxlength="150" size="mini"></el-input>
          </el-form-item>
          <el-form-item label="更新记录" prop="updateRecord">
            <el-input v-model="dataForm.updateRecord" type="textarea" :autosize="{ minRows: 2}" placeholder="更新记录" clearable maxlength="150" size="mini"></el-input>
          </el-form-item> -->
      <el-form-item label="附件" prop="attachmentId">
        <el-upload class="upload-demo" ref="upload" :action="uploadUrl" :headers="uploadHeaders" :data="uploadData" :on-change="uploadHandle" accept=".pdf,.doc,.docx" :auto-upload="false" :on-success="successHandle" :on-preview="handlePreview" :on-remove="handleRemove" :before-remove="beforeRemove" multiple :on-exceed="handleExceed" :file-list="dataForm.fileList" :limit="1">
          <el-button size="mini" class="upload">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">
            只能上传pdf/doc/docx文件，且不超过500kb
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item v-if="fileList.length > 0 && !dataForm.attachmentId">
        <el-button size="mini" @click="uploadFile()" class="upload">确认上传</el-button>
      </el-form-item>
    </el-form>
    <!-- </el-scrollbar>
    </div> -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {
  contingencyDownloadInfo,
  attachmentDelete
} from '@/api/process/emergencyPlan'
import { statuteInfo, statuteAddOrUpdate } from '@/api/process/statute'
import { departList } from '@/api/sys/depart'
import { getLabels } from '@/api/common/sys'
export default {
  data () {
    return {
      dataForm: {
        statuteType: '', // 法规类型
        codeNumber: '', // 法规编号
        matters: '', // 事项
        // description: '', // 相关条款说明-摘要
        existingLaws: '1', // 是否现行法规
        forceDegree: '1', // 强制程度
        // updateRecord: '', // 更新记录
        releaseDate: '', // 发布日期
        revisionDate: '', // 修订日期
        effectiveDate: '', // 生效日期
        // reviewDate: '', // 复查日期
        // repealDate: '', // 废止日期
        identificationDate: '', // 识别日期
        issueName: '', // 颁布部门
        deptNameIdentification: '', // 识别部门名称
        deptIdIdentification: '', // 识别部门id
        attachmentId: '', // 附件id
        fileList: [], // 文件列表
        deptId: '', // 适用部门id
        deptName: '', // 适用部门名称
        moduleType: '' // 模块类型名称
      },
      fileList: [],
      layerTypeList: [],
      moduleTypeList: [], // 模块类型列表
      isDisabled: false,
      disabled: false,
      visible: false,
      filelListVisible: false,
      isFlag: false,
      departList: [],
      defaultProps: {
        label: 'deptName',
        children: 'child'
      }, // 树形结构展示
      popoverVisible1: false,
      popoverVisible2: false,
      popoverVisible3: false,
      pageIndex: 1,
      pageSize: 20,
      uploadUrl: '',
      uploadData: {},
      uploadHeaders: {},
      filename: '', // 文件名
      selectChange: {}, // 选中项
      dataRule: {
        statuteType: [
          { required: true, message: '请选择法规类型', trigger: 'change' }
        ],
        codeNumber: [
          { required: true, message: '请输入法规编号', trigger: 'blur' }
        ],
        forceDegree: [
          { required: true, message: '请选择强制程度', trigger: 'change' }
        ],
        releaseDate: [
          { required: true, message: '请选择发布日期', trigger: 'change' }
        ],
        revisionDate: [
          { required: true, message: '请选择修订日期', trigger: 'change' }
        ],
        effectiveDate: [
          { required: true, message: '请选择生效日期', trigger: 'change' }
        ],
        identificationDate: [
          { required: true, message: '请选择生效日期', trigger: 'change' }
        ],
        existingLaws: [
          { required: true, message: '请选择现行法规', trigger: 'change' }
        ],
        attachmentId: [
          { required: true, message: '请选择文件上传', trigger: 'change' }
        ],
        issueName: [
          { required: true, message: '请输入国家政府机构', trigger: 'blur' }
        ],
        deptName: [
          { required: true, message: '请选择适用部门', trigger: 'change' }
        ],
        deptNameIdentification: [
          { required: true, message: '请选择识别部门', trigger: 'change' }
        ],
        matters: [
          {
            required: true,
            message: '请输入法律法规及其他要求事项',
            trigger: 'blur'
          }
        ],
        moduleType: [
          { required: true, message: '请选择模块类型名称', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getBaseData()
    this.getDepartList()
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
        this.dataForm.statuteType = ''
        this.dataForm.fileList = []
        this.dataForm.attachmentId = ''
        this.fileList = []
        if (id) {
          this.isDisabled = true
          statuteInfo({ id: id })
            .then(({ data }) => {
              this.isDisabled = false
              if (data && data.code === 0) {
                this.dataForm = data.entity
                this.dataForm.existingLaws =
                  this.dataForm.existingLaws === true ? '1' : '0'
                if (this.dataForm.attachmentId) {
                  this.selectFileInfo(this.dataForm.attachmentId)
                }
              } else {
                this.$message.error(data.msg)
              }
            })
            .catch(err => {
              this.isDisabled = false
              console.log(err)
            })
        }
      })
    },
    // 加载基础数据
    getBaseData () {
      // 获取法规类型列表
      getLabels({
        type: 'STATUTE_TYPE'
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.layerTypeList = data.list
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => console.log(err))
      // 获取适用法规类型列表
      getLabels({
        type: 'APPLICABLE_SYSTEM_TYPE'
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.moduleTypeList = data.list
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => console.log(err))
    },
    // 获取部门树
    getDepartList () {
      this.dataListLoading = true
      departList()
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.departList = [data.data[0]] || []
            this.dataListLoading = false
          } else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
    },
    // 适用部门菜单树选中
    departListTreeCurrentChangeHandle1 (data, node) {
      // 当前节点的数据，对象
      this.dataForm.deptId = data.id
      this.dataForm.deptName = data.deptName
      this.popoverVisible1 = false
    },
    // 识别部门菜单树选中
    departListTreeCurrentChangeHandle2 (data, node) {
      // 当前节点的数据，对象
      this.dataForm.deptIdIdentification = data.id
      this.dataForm.deptNameIdentification = data.deptName
      this.popoverVisible2 = false
    },
    // 文件状态改变时的处理函数
    uploadHandle (file, fileList) {
      this.fileList = fileList
      let token = document.cookie.split('=')[1]
      this.uploadHeaders = { token: token }
      this.uploadData = { fileType: '2' }
      this.uploadUrl = this.$http.adornUrl(
        '/spring-processweb/attachment/upload'
      )
    },
    // 查询单个文件信息
    selectFileInfo (id) {
      contingencyDownloadInfo({ id: id })
        .then(({ data }) => {
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
        })
        .catch(err => {
          this.isDisabled = false
          console.log(err)
        })
    },
    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePreview (file) {
      this.filename = file.name
      this.filelListVisible = true
    },
    handleExceed (files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
        files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
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
          if (this.dataForm.existingLaws === '0') {
            this.dataForm.existingLaws = false
          } else {
            this.dataForm.existingLaws = true
          }
          statuteAddOrUpdate(this.dataForm)
            .then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.dataForm.fileList = []
                this.fileList = []
                this.$message.success('操作成功!')
                this.$emit('refreshDataList')
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
