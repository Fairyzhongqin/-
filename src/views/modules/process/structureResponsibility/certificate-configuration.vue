<!--岗位管理 新增/修改-->
<template>
  <el-dialog title="人员证书配置" :close-on-click-modal="false" class="private-dialog" width="600px" :visible.sync="visible" append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="员工姓名" prop="employeeName">
        <el-input v-model="dataForm.employeeName" placeholder="请选择员工姓名" @focus="selectStaffShow" size="mini" class="size-mini-pople-input" :readonly="true">
          <el-button slot="append" @click="selectStaffShow">选择</el-button>
        </el-input>
      </el-form-item>
      <!--<el-form-item label="员工姓名" prop="employeeName">-->
        <!--<el-input v-model="dataForm.employeeName" size="mini" placeholder="员工姓名" clearable :disabled="true"></el-input>-->
      <!--</el-form-item>-->
      <!--<el-form-item label="员工性别" prop="sex">-->
        <!--<el-radio v-model="dataForm.sex" label="0" :disabled="true">男</el-radio>-->
        <!--<el-radio v-model="dataForm.sex" label="1" :disabled="true">女</el-radio>-->
      <!--</el-form-item>-->
      <el-form-item label="证书编号" prop="certificateCode">
        <el-input v-model="dataForm.certificateCode" size="mini" placeholder="请输入证书编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="有效期" prop="validityTerm">
        <el-input v-model="dataForm.validityTerm" size="mini" placeholder="请输入有效期" clearable></el-input>
      </el-form-item>
      <!--<el-form-item label="所属部门" prop="deptName">-->
        <!--<el-popover v-model="popoverVisible" ref="departPopover" placement="bottom-start" trigger="click" popper-class="high">-->
          <!--<el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree1" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle1" default-expand-all :highlight-current="true" :expand-on-click-node="false">-->
          <!--</el-tree>-->
        <!--</el-popover>-->
        <!--<el-input v-model="dataForm.deptName" v-popover:departPopover :readonly="true" size="mini" class="size-mini-pople-input menu-list__input" placeholder="请选择所属部门" clearable></el-input>-->
      <!--</el-form-item>-->
      <el-form-item label="取证日期" prop="obtainDate">
        <el-date-picker v-model="dataForm.obtainDate" type="date" placeholder="请选择取证日期" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="换证日期" prop="replaceDate">
        <el-date-picker v-model="dataForm.replaceDate" type="date" placeholder="请选择换证日期" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label="过期日期" prop="overdueDate">
        <el-date-picker v-model="dataForm.overdueDate" type="date" placeholder="请选择过期日期" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item label='附件' prop='attachmentId'>
        <el-upload class="upload-demo" ref="upload" :action="uploadUrl" :headers="uploadHeaders" :data="uploadData" :on-change="uploadHandle" accept=".pdf,.doc,.docx" :auto-upload="false" :on-success="successHandle" :before-remove="beforeRemove" multiple :on-exceed="handleExceed" :file-list="dataForm.fileList" :limit="1">
          <el-button size="mini" icon="el-icon-upload2" class="upload">点击选择上传文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传pdf/doc/docx文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item v-if="fileList.length>0 && !dataForm.attachmentId">
        <el-button size="mini" @click="uploadFile()" class="upload">确认上传</el-button>
      </el-form-item>
    </el-form>
    <!-- 弹框，选择地区 -->
    <!-- <enclosure-or-area v-if="enclosureVisible"
                       @selectChange='selectChange'
    ref="enclosureOrAreas"></enclosure-or-area>-->
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
    <certificate-select-staff v-if="selectStaffVisible" :isRadio="true" ref="selectStaff" @selectStaffEmit='selectStaffEmit'></certificate-select-staff>
  </el-dialog>
</template>

<script>
  import {employeeCertificateAddOrUpdate, employeeCertificateInfo, attachmentInfo, attachmentDelete} from '@/api/process/certificate'
  import { departList } from '@/api/sys/depart'
  import certificateSelectStaff from './certificate-select-staff'
  export default {
    data () {
      return {
        dataForm: {
          employeeName: '', // 员工姓名
          employeeId: '', // 员工id
          sex: '', // 员工性别
          certificateCode: '', // 证书编号
          certificateId: '', // 证书id
          deptName: '', // 所属部门
          obtainDate: '', // 取证日期
          overdueDate: '', // 过期日期
          replaceDate: '', // 换证日期
          reviewDate: '', // 复审日期
          fileName: '', // 文件名称
          validityTerm: '', // 有效期
          remarks: '', // 备注
          attachmentId: '', // 附件id
          fileList: [] // 文件列表
        },
        departList: [], // 部门列表
        popoverVisible: false,
        defaultProps: {
          label: 'deptName',
          children: 'child'
        },
        isDisabled: false,
        visible: false,
        selectStaffVisible: false,
        uploadUrl: '',
        uploadData: {},
        uploadHeaders: {},
        fileList: [], // 文件列表
        dataRule: {
          employeeName: [
            { required: true, message: '员工姓名不能为空', trigger: 'change' }
          ],
          // employeeId: [
          //   { required: true, message: '员工id不能为空', trigger: 'change' }
          // ],
          // sex: [
          //   { required: true, message: '员工性别不能为空', trigger: 'change' }
          // ],
          certificateCode: [
            { required: true, message: '证书编号不能为空', trigger: 'blur' }
          ],
          validityTerm: [
            { required: true, message: '有效期不能为空', trigger: 'blur' }
          ],
          obtainDate: [
            { required: true, message: '取证日期不能为空', trigger: 'change' }
          ],
          overdueDate: [
            { required: true, message: '过期日期不能为空', trigger: 'change' }
          ],
          replaceDate: [
            { required: true, message: '换证日期不能为空', trigger: 'change' }
          ],
          attachmentId: [
            { required: true, message: '附件不能为空', trigger: 'change' }
          ]
        }
      }
    },
    components: { certificateSelectStaff },
    created () {
      this.departmentTree()
    },
    methods: {
      // 初始数据
      init (info, id) {
        this.isDisabled = false
        this.dataForm.id = id || ''
        this.visible = true
        this.dataForm.fileList = []
        this.fileList = []
        this.dataForm.certificateId = info.id
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (id) {
            this.isDisabled = true
            employeeCertificateInfo({
              'id': id || undefined
            }).then(({ data }) => {
              this.isDisabled = false
              if (data && data.code === 0) {
                this.dataForm = data.entity
                // this.dataForm.attachmentId = data.entity.attachmentId
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
      // 添加人员
      selectStaffShow () {
        this.selectStaffVisible = true
        this.$nextTick(() => {
          this.$refs.selectStaff.init()
        })
      },
      // 人员组件返回值
      selectStaffEmit (val, key) {
        this.dataForm.employeeName = val[0].name
        this.dataForm.employeeId = val[0].gh
        this.dataForm.deptName = val[0].dept
        // this.dataForm.sex = val[0].sex
      },
      // 部门树
      departmentTree () {
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
      // 部门的菜单树选中
      departListTreeCurrentChangeHandle1 (data, node) {
        // 当前节点的数据，对象
        this.dataForm.deptId = data.id
        this.dataForm.deptName = data.deptName
        this.popoverVisible = false
      },
      // 表单提交
      dataFormSubmit () {
        this.dataForm.fileName = this.dataForm.fileList[0].name
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isDisabled = true
            employeeCertificateAddOrUpdate(
              this.dataForm
            ).then(({ data }) => {
              this.visible = false
              this.$emit('refreshSubDataList')
              // this.$emit('refreshSubDataList', this.dataForm.certificateId)
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                  }
                })
              } else {
                this.isDisabled = false
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
        this.dataForm.fileName = fileList.name
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
<style lang="scss">

</style>
