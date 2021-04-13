<!--绑定员工-->
<template>
  <el-dialog title="绑定员工" :close-on-click-modal="false" class="department-manage" width="600px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="110px">
      <el-form-item label="选择员工" prop="employeeName">
        <el-input v-model="dataForm.employeeName" placeholder="班组人员" @focus="selectStaffShow" size="mini" class="size-mini-pople-input" clearable>
          <el-button slot="append" @click="selectStaffShow">选择</el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="主要负责人" prop="isPrincipal">
        <el-radio-group v-model="dataForm.isPrincipal">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="职位描述" prop="description">
        <el-input v-model="dataForm.description" placeholder="例：部门经理" size="mini" clearable></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="dataForm.remarks" placeholder="请输入备注" size="mini" clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
    <!-- 向时间段添加工作人员 -->
    <select-staff v-if="selectStaffVisible" ref="selectStaff" :isRadio="true" @selectStaffEmit="selectStaffEmit"></select-staff>
  </el-dialog>
</template>

<script>
import { updateDeptEmployee, departInfo, employeeList } from '@/api/sys/depart'

import enclosureOrArea from '@/components/select/select-enclosure-or-area'
import selectStaff from '@/components/select/select-staff'
export default {
  data () {
    return {
      dataForm: {
        id: '',
        deptId: '',
        deptName: '',
        description: '', // 职位描述
        employeeGh: '', // 员工工号
        employeeName: '', // 员工名称
        isPrincipal: 1, // 是否主要负责人 0-否/1-是
        remarks: ''
      },
      personIdList: [],
      isDisabled: false,
      popoverVisible: false,
      selectStaffVisible: false,
      disabled: false,
      visible: false,
      dataRule: {
        employeeName: [{ required: true, message: '请选择员工', trigger: 'blur' }],
        code: [{ required: true, message: '请输入部门编号', trigger: 'blur' }],
        parentId: [{ required: true, message: '请选择上级部门', trigger: 'change' }]
      },
      departList: [],
      departListTreeProps: {
        label: 'deptName',
        children: 'child'
      } // 树形结构展示
    }
  },
  components: {
    selectStaff,
    enclosureOrArea
  },
  created () {

  },
  methods: {
    // 添加人员
    selectStaffShow () {
      this.selectStaffVisible = true
      this.$nextTick(() => {
        this.$refs.selectStaff.init(this.personIdList)
      })
    },
    // 人员组件返回值
    selectStaffEmit (val, key) {
      // console.log(val, 'val值')
      // console.log(key, 'key值')
      this.dataForm.employeeName = val[0].name
      this.dataForm.employeeGh = val[0].gh
      this.selectStaffVisible = false
      if (!key) {
        this.personIdList = []
        val.map((values) => {
          this.personIdList.push(values.gh)
        })
      }
    },
    // 初始数据
    init (id) {
      this.isDisabled = false
      this.visible = true
      this.dataForm.deptId = id || ''
      this.dataForm.deptName = ''
      this.dataForm.parentName = ''
      this.dataForm.description = ''
      this.dataForm.employeeGh = ''
      this.dataForm.employeeName = ''
      this.dataForm.isPrincipal = 1
      this.dataForm.remarks = ''
      this.personIdList = []
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.getDataList()
        if (id) {
          this.selectInfo(id)
        }
      })
    },
    // 查询单个分区
    selectInfo (id) {
      departInfo({ 'id': id }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm.id = data.data.id
          this.dataForm.deptName = data.data.deptName
          this.dataForm.code = data.data.deptCode
          this.dataForm.parentId = data.data.parentId // 上级部门Id,一级为0
          this.dataForm.parentName = data.data.parentName
        }
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      employeeList().then(({ data }) => {
        if (data && data.code === 0) {
          // this.dataList = treeDataTranslate2(data.data.subregion, 'id', 'parentId')
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
    // 菜单树选中
    departListTreeCurrentChangeHandle (data, node) {
      // 当前节点的数据，对象
      this.dataForm.parentId = data.id
      this.dataForm.parentName = data.deptName
      this.popoverVisible = false
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode () {
      // this.$refs.departListTree.setCurrentKey(this.dataForm.parentId)
      this.dataForm.parentName = (this.$refs.departListTree.getCurrentNode() || {})['name']
    },
    handleNodeClick () { },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let dataForm = {
            id: this.dataForm.id,
            deptId: this.dataForm.deptId,
            deptName: this.dataForm.deptName,
            description: this.dataForm.description, // 职位描述
            employeeGh: this.dataForm.employeeGh, // 员工工号
            employeeName: this.dataForm.employeeName, // 员工名称
            isPrincipal: this.dataForm.isPrincipal, // 是否主要负责人 0-否/1-是
            remarks: this.dataForm.remarks
          }
          updateDeptEmployee(
            dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.$emit('refreshDataList')
            } else {
              this.$message.error(data.msg)
            }
            this.dataListLoading = false
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
            this.dataListLoading = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.department-manage {
  .time {
    margin-right: 10px;
  }
  .el-row {
    margin-left: -60.5px;
  }
}
</style>
