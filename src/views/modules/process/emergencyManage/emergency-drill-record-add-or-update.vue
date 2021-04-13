
<!-- 应急演练记录弹框 -->
<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '应急演练记录'" :close-on-click-modal="false" class="emergency-drill-record-dialog" width="600px" :visible.sync="visible">
    <div style="height: 450px;">
      <el-scrollbar style="height:100%" class="default-scrollbar" wrap-class="default-scrollbar__wrap" view-class="p20-scrollbar__view">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="125px">
          <el-form-item label="演练计划名称" prop="drillId">
            <el-select v-model="dataForm.drillId" placeholder="请选择" @change="handleChange()" :disabled="dataForm.id ? true:false">
              <el-option v-for="item in drillList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应急预案名称" prop="contingencyPlanName">
            <el-input v-model="dataForm.contingencyPlanName" placeholder="应急预案名称" size="mini" class="size-mini-pople-input" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="计划演练时间" prop="drillTime">
            <el-date-picker v-model="dataForm.drillTime" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" disabled>
            </el-date-picker>
          </el-form-item>
          <el-form-item label="演练方式" prop="mode">
            <el-select v-model="dataForm.mode" placeholder="请选择" disabled>
              <el-option v-for="item in drillModeList" :key="item.label" :label="item.value" :value="item.label">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="演练目的" prop="aim">
            <el-input v-model="dataForm.aim" placeholder="演练目的" size="mini" class="size-mini-pople-input" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="组织部门" prop="organzizationDeptId">
            <el-popover v-model="popoverVisible1" ref="departPopover1" placement="bottom-start" trigger="click" popper-class="high">
              <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree1" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle1" default-expand-all :highlight-current="true" :expand-on-click-node="false">
              </el-tree>
            </el-popover>
            <el-input v-model="dataForm.organzizationDeptName" v-popover:departPopover1 :readonly="true" size="mini" class="select-depart" placeholder="请选择部门" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="配合部门" prop="coordinationDeptId">
            <el-popover v-model="popoverVisible2" ref="departPopover2" placement="bottom-start" trigger="click" popper-class="high">
              <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree2" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle2" default-expand-all :highlight-current="true" :expand-on-click-node="false">
              </el-tree>
            </el-popover>
            <el-input v-model="dataForm.coordinationDeptName" v-popover:departPopover2 :readonly="true" size="mini" class="select-depart" placeholder="请选择部门" clearable disabled></el-input>
          </el-form-item>
          <el-form-item label="编制人" prop="compilingPerson">
            <el-input v-model="dataForm.compilingPerson" placeholder="编制人" @focus="selectStaffShow" size="mini" class="size-mini-pople-input" clearable>
              <el-button slot="append" @click="selectStaffShow">选择</el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="演练过程描述" prop="drillProcess">
            <el-input v-model="dataForm.drillProcess" type="textarea" placeholder="演练过程描述" size="mini" class="size-mini-pople-input" clearable></el-input>
          </el-form-item>
          <el-form-item label="存在问题及改进措施" prop="existImproved">
            <el-input v-model="dataForm.existImproved" type="textarea" placeholder="存在问题及改进措施" size="mini" class="size-mini-pople-input" clearable></el-input>
          </el-form-item>
          <el-form-item label="注意问题" prop="noticeProblem">
            <el-input v-model="dataForm.noticeProblem" type="textarea" placeholder="注意问题" size="mini" class="size-mini-pople-input" clearable></el-input>
          </el-form-item>。
          <el-form-item label="演练小结" prop="summary">
            <el-input v-model="dataForm.summary" type="textarea" placeholder="演练小结" size="mini" class="size-mini-pople-input" clearable></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input v-model="dataForm.remarks" placeholder="备注" size="mini" class="size-mini-pople-input" clearable></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
    <select-staff v-if="selectStaffVisible" ref="selectStaff" @selectStaffEmit="selectStaffEmit">
    </select-staff>
  </el-dialog>
</template>

<script>
import { drillRecordInfo, drillRecordAddOrUpdate, contingencyList, drillList, drillInfo } from '@/api/process/emergencyPlan'
import { departList } from '@/api/sys/depart'
import { getLabels } from '@/api/common/sys'
import selectStaff from './emergency-plan-add-check-staff'
export default {
  components: {
    selectStaff
  },
  data () {
    return {
      dataForm: {
        id: '', // 演练记录id
        name: '', // 演练计划名称
        contingencyPlanId: '',
        contingencyPlanName: '',
        compilingPersonId: '',
        drillTime: '',
        drillId: '', // 应急演练计划id
        mode: '',
        aim: '', // 负责人Id
        organzizationDeptId: '', //
        organzizationDeptName: '',
        coordinationDeptName: '',
        coordinationDeptId: '', // 配合部门
        compilingPerson: '', // 编制人
        drillProcess: '', // 演练过程描述
        existImproved: '', // 存在问题及改进措施
        noticeProblem: '', // 注意问题
        summary: '', // 演练小结
        remarks: '',
        state1: '2'
      },
      dataList: [], // 审核通过的应急预案列表
      drillList: [], // 演练计划列表
      selectChange: {}, // 选中项
      drillModeList: [],
      departList: [],
      defaultProps: {
        label: 'deptName',
        children: 'child'
      }, // 树形结构展示
      popoverVisible1: false,
      popoverVisible2: false,
      selectStaffVisible: false,
      isDisabled: false,
      disabled: false,
      visible: false,
      pageIndex: 1,
      pageSize: 20,
      dataRule: {
        drillId: [{ required: true, message: '选择演练计划', trigger: 'blur' }],
        contingencyPlanName: [{ required: true, message: '请选择应急预案名称', trigger: 'change' }],
        drillTime: [{ required: true, message: '请选择计划演练时间', trigger: 'change' }],
        mode: [{ required: true, message: '请选择演练方式', trigger: 'change' }],
        aim: [{ required: true, message: '请输入演练目的', trigger: 'blur' }],
        organzizationDeptId: [{ required: true, message: '请选择组织部门', trigger: 'change' }],
        coordinationDeptId: [{ required: true, message: '请选择配合部门', trigger: 'change' }],
        compilingPerson: [{ required: true, message: '请选择编制人', trigger: 'blur,change' }],
        drillProcess: [{ required: true, message: '请输入演练过程描述', trigger: 'blur' }],
        existImproved: [{ required: true, message: '请输入存在问题及改进措施', trigger: 'blur' }],
        noticeProblem: [{ required: true, message: '请输入演练小结', trigger: 'blur' }],
        summary: [{ required: true, message: '请选择编制人', trigger: 'blur' }]

      }
    }
  },
  created () {
    // this.getDate()
    this.getBaseData()
    this.getDataList()
    this.getDepartList()
    this.getDrillList()
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
        this.dataForm.coordinationDeptName = ''
        this.dataForm.organzizationDeptName = ''
        if (id) {
          this.isDisabled = true
          drillRecordInfo({ id: id }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm = data.data
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
    // 初始化时间
    getDate () {
      this.dataForm.drillTime = new Date().Format('yy-MM-dd hh:mm:ss')
      // console.log(Object.prototype.toString.call(this.dataForm.drillTime))
    },
    // 加载基础数据
    getBaseData () {
      getLabels({
        'type': 'DRILL_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.drillModeList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 获取演练计划列表
    getDrillList () {
      this.dataListLoading = true
      drillList({
        'page': this.pageIndex,
        'limit': this.pageSize
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.drillList = data.page.list
          this.totalPage = data.page.count
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 获取应急预案列表
    getDataList () {
      this.dataListLoading = true
      contingencyList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'state': this.dataForm.state1
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.count
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 选中下拉框的值时的处理函数
    handleChange () {
      this.getDrillInfo()
    },
    // 查询演练计划信息
    getDrillInfo () {
      drillInfo({ id: this.dataForm.drillId }).then(({ data }) => {
        this.isDisabled = false
        if (data && data.code === 0) {
          // this.dataForm = data.data
          // console.log(this.dataForm, '000000000000000')
          this.dataForm.contingencyPlanId = data.data.contingencyPlanId
          this.dataForm.contingencyPlanName = data.data.contingencyPlanName
          this.dataForm.drillTime = data.data.drillTime
          this.dataForm.mode = data.data.mode
          this.dataForm.aim = data.data.aim
          this.dataForm.organzizationDeptId = data.data.organzizationDeptId
          this.dataForm.organzizationDeptName = data.data.organzizationDeptName
          this.dataForm.coordinationDeptId = data.data.coordinationDeptId
          this.dataForm.coordinationDeptName = data.data.coordinationDeptName
          this.dataForm.name = data.data.name
          this.dataForm.drillId = data.data.id
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => {
        this.isDisabled = false
        console.log(err)
      })
    },
    // 获取部门树
    getDepartList () {
      this.dataListLoading = true
      departList().then(({ data }) => {
        if (data && data.code === 0) {
          this.departList = [data.data[0]] || []
          console.log(this.departList)
          this.dataListLoading = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 部门菜单树选中
    departListTreeCurrentChangeHandle1 (data, node) {
      // 当前节点的数据，对象
      this.dataForm.organzizationDeptId = data.id
      this.dataForm.organzizationDeptName = data.deptName
      this.popoverVisible1 = false
    },
    // 部门菜单树选中
    departListTreeCurrentChangeHandle2 (data, node) {
      // 当前节点的数据，对象
      this.dataForm.coordinationDeptId = data.id
      this.dataForm.coordinationDeptName = data.deptName
      this.popoverVisible2 = false
    },
    // 添加人员
    selectStaffShow () {
      this.selectStaffVisible = true
      this.$nextTick(() => {
        this.$refs.selectStaff.init(this.selectChange)
      })
    },
    // 人员组件返回值
    selectStaffEmit (val) {
      this.selectChange = val
      this.dataForm.compilingPersonId = val.gh
      this.dataForm.compilingPerson = val.name
      this.selectStaffVisible = false
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          drillRecordAddOrUpdate(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.$message.success('操作成功!')
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
.emergency-drill-record-dialog {
  .el-select {
    width: 100%;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
  .material-name {
    display: flex;
    justify-content: center;
    .el-button--medium {
      padding: 0;
      padding-top: 8px;
    }
  }
  .configStyle {
    position: relative;
    width: 98%;
    background: #f8fafc;
    padding-top: 20px;
    margin-right: 10px;
    cursor: pointer;
    transition: ease 10;
    .item-style .add-child,
    .del-child {
      color: #2c78bb;
      cursor: pointer;
      line-height: 28px;
      font-size: 15px;
      vertical-align: middle;
    }
    .item-style {
      height: 35px;
      line-height: 35px;
      width: 98%;
    }
    .del-child {
      position: absolute;
      top: 20px;
      right: -8px;
      color: red;
    }
    // &:hover {
    //   box-shadow: 1px 1px 10px 0px #ccc;
    // }
    .el-input-number.is-controls-right[class*='medium'] [class*='increase'] {
      line-height: 4px;
    }
    .el-input-number.is-controls-right[class*='medium'] [class*='decrease'] {
      line-height: 9px;
    }
  }
}
</style>


