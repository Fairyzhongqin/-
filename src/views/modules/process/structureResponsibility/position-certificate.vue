<!--岗位管理 新增/修改-->
<template>
  <el-dialog :title="(!dataForm.id ? '配置' : '修改') +'岗位证书'" :close-on-click-modal="false" class="private-dialog" width="600px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="岗位名称" prop="stationName">
        <el-input v-model="dataForm.stationName" size="mini" placeholder="岗位名称" clearable disabled></el-input>
      </el-form-item>
      <el-form-item label="部门名称" prop="deptId">
        <!-- <el-popover v-model="popoverVisible" ref="departPopover" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover> -->
        <el-input v-model="dataForm.deptName" size="mini" class="select-depart" disabled></el-input>
      </el-form-item>
      <el-form-item label="证书名称" prop="certificateName">
        <el-input v-model="dataForm.certificateName" placeholder="证书名称" @focus="certificateHandle" size="mini" class="size-mini-pople-input">
          <el-button slot="append" @click="certificateHandle">选择</el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
    <CertificateSelect v-if="certificateVisible" ref="CertificateSelect" @refreshment="certificateSelected"></CertificateSelect>
  </el-dialog>
</template>

<script>
import { stationCertInfo, stationCertAddOrUpdate } from '@/api/process/stationCertificate'
import CertificateSelect from './position-certificate-select'
// import { departList } from '@/api/sys/depart'
export default {
  components: {
    CertificateSelect
  },
  data () {
    return {
      dataForm: {
        deptId: '', // 所属部门Id
        deptName: '', // 所属部门名称
        stationId: '', // 岗位Id
        stationName: '', // 岗位名称
        certificateName: '', // 证书名称
        certificateId: '', // 证书Id
        remarks: ''// 备注
      },
      zoneList: [], // 区域列表
      departList: [], // 部门列表
      popoverVisible: false,
      certificateVisible: false,
      isDisabled: false,
      visible: false,
      defaultProps: {
        label: 'deptName',
        children: 'child'
      },
      dataRule: {
        deptId: [{ required: true, message: '部门名称不能为空', trigger: 'change' }],
        stationName: [{ required: true, message: '岗位名称不能为空', trigger: 'blur' }],
        certificateName: [{ required: true, message: '证书名称不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
  },
  methods: {
    // 初始数据
    init (val, id) {
      // console.log(id, '岗位证书')
      this.isDisabled = false
      if (val) {
        this.dataForm.stationId = val.id || ''
        this.dataForm.stationName = val.stationName || ''
        this.dataForm.deptId = val.deptId || ''
        this.dataForm.deptName = val.deptName || ''
      }
      this.dataForm.id = id || ''
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.isDisabled = true
          this.selectInfo(this.dataForm.id)
        }
      })
    },

    // 查询岗位信息
    selectInfo (id) {
      stationCertInfo({
        id: id
      }).then(({ data }) => {
        this.isDisabled = false
        if (data && data.code === 0) {
          this.dataForm = data.entity
        }
      }).catch((err) => {
        console.log(err)
        this.isDisabled = false
        this.$message.error('未知异常！请联系管理员')
      })
    },
    certificateHandle () {
      this.certificateVisible = true
      this.$nextTick(() => {
        this.$refs.CertificateSelect.init(this.dataForm)
      })
    },
    // 部门树
    // getDataList () {
    //   this.dataListLoading = true
    //   departList().then(({ data }) => {
    //     if (data && data.code === 0) {
    //       // this.dataList = treeDataTranslate2(data.data.subregion, 'id', 'parentId')
    //       // console.log(data)
    //       this.departList = [data.data[0]] || []
    //       // console.log(this.departList)
    //       this.dataListLoading = false
    //     } else {
    //       this.$message.error(data.msg)
    //     }
    //   }).catch((err) => {
    //     console.log(err)
    //     this.$message.error('未知异常！请联系管理员')
    //   })
    // },
    // 部门的菜单树选中
    departListTreeCurrentChangeHandle (data, node) {
      // 当前节点的数据，对象
      this.dataForm.deptId = data.id
      this.dataForm.deptName = data.deptName
      this.popoverVisible = false
    },
    certificateSelected (val) {
      console.log(val, '传过来的值')
      this.dataForm.certificateName = val.name
      this.dataForm.certificateId = val.id
      this.certificateVisible = false
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isDisabled = true
          stationCertAddOrUpdate(
            this.dataForm
          ).then(({ data }) => {
            this.visible = false
            this.$emit('refreshDataList')
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
    }
  }
}
</script>
<style lang="scss">
.private-dialog {
  .el-dialog {
    .report-err {
      display: inline-block;
      .el-input--medium {
        width: 65px;
        input {
          padding: 5px;
        }
      }
    }
  }
  .stationBorder {
    border: 1px solid #d8d8d8;
    border-radius: 4px;
    padding: 10px;
    min-height: 30px;
    max-height: 120px;
    overflow-y: auto;
    margin-top: 4px;
  }
  // .el-form-item--medium {
  //   margin-bottom: 12px;
  // }
  .el-select {
    width: 100%;
  }
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
}
</style>
