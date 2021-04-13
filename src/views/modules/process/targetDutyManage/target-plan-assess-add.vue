<template>
  <el-dialog title="部门考核" :close-on-click-modal="false" class="dept-target-dialog" width="750px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="110px">
      <el-form-item label="部门名称" prop="deptCode">
        <el-input v-model="dataForm.deptName" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="指标月度" prop="monthly">
        <el-date-picker v-model="dataForm.monthly" type="month" placeholder="选择年度" value-format="yyyy" disabled> </el-date-picker>
      </el-form-item>
      <el-form-item label="责任人" prop="responsiblePerson">
        <el-input v-model="dataForm.responsiblePerson" disabled></el-input>
      </el-form-item>
      <el-form-item label="考核部门" prop="deptIdAssessment">
        <el-popover v-model="popoverVisible4" ref="departPopover4" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree3" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle4" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptNameAssessment" v-popover:departPopover4 :readonly="true" size="mini" class="select-depart" placeholder="请选择"></el-input>
      </el-form-item>
      <el-form-item label="考核日期" prop="assessmentDate">
        <el-date-picker v-model="dataForm.assessmentDate" type="date" placeholder="请选择" value-format="yyyy-MM-dd"> </el-date-picker>
      </el-form-item>
      <el-form-item label="目标" prop="list">
        <el-row v-if="dataForm.list.length>0" :gutter="5">
          <el-col :span="6" class="material-name">
            <span type="text">目标名称</span>
          </el-col>
          <el-col :span="6" class="material-name">
            <span type="text">部门目标值</span>
          </el-col>
          <el-col :span="6" class="material-name">
            <span type="text">完成值</span>
          </el-col>
          <el-col :span="4" class="material-name">
            <span type="text">考核结果</span>
          </el-col>
        </el-row>
        <el-divider v-if="dataForm.list.length>0"></el-divider>
        <div class="configStyle" v-for="(item,index) of dataForm.list" :key="index">
          <el-row :gutter="7" class="item-style">
            <el-col :span="7">
              <el-form-item :prop="'list.'+index+'.targetName'" :rules="dataRule.targetRule.targetName">
                <el-input v-model="item.targetName" size="mini" readonly>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :prop="'list.'+index+'.assessmentValue'" :rules="dataRule.targetRule.assessmentValue">
                <el-input v-model="item.assessmentValue" size="mini" readonly class="target-value"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :prop="'list.'+index+'.completionValue'" :rules="dataRule.targetRule.completionValue">
                <el-input type="number" v-model="item.completionValue" controls-position="right" min="0" class="target-value"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-tag v-if="item.assessmentState==='0'" type="success">达标</el-tag>
                <el-tag v-if="item.assessmentState==='1'" type="danger">不达标</el-tag>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
    <select-comtarget v-if="selectComtargetVisible" ref="selectComtarget" @selectComtargetEmit="selectComtargetEmit"></select-comtarget>
  </el-dialog>
</template>
<script>
import { deptMonthlyInfo, organizationAssessment } from '@/api/process/targetDuty'
import { departList } from '@/api/sys/depart'
import selectComtarget from './dept-select-target'
import { getLabels } from '@/api/common/sys'
export default {
  components: {
    selectComtarget
  },
  data () {
    var completionValue = (rule, value, callback) => {
      let isFlag = new RegExp('^[1-9][0-9]*$').test(value)
      if (!isFlag) {
        callback(new Error('请输入正整数或零'))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        id: '',
        deptName: '', // 部门名称
        deptCode: '', // 部门编号
        deptId: '', // 部门id
        list: [], // 目标list
        monthly: '', // 月度
        responsiblePerson: '', // 责任人
        remarks: '',
        deptIdAssessment: '', // 考核部门
        deptNameAssessment: '', // 考核部门名称
        assessmentDate: '' // 考核日期
      },
      departList: [], // 部门列表
      isDisabled: false,
      disabled: false,
      visible: false,
      popoverVisible4: false,
      selectComtargetVisible: false,
      defaultProps: {
        label: 'deptName',
        children: 'child'
      }, // 树形结构展示
      dataRule: {
        deptCode: [{ required: true, message: '请选择部门名称', trigger: 'change' }],
        monthly: [{ required: true, message: '请选择月份', trigger: 'change' }],
        createDate: [{ required: true, message: '制定日期', trigger: 'change' }],
        responsiblePerson: [{ required: true, message: '责任人', trigger: 'blur' }],
        list: [{ required: true, message: '请选择企业目标', trigger: 'change' }],
        deptIdAssessment: [{ required: true, message: '请选择考核部门', trigger: 'change' }],
        assessmentDate: [{ required: true, message: '请选择考核日期', trigger: 'change' }],
        targetRule: {
          completionValue: [
            { required: true, message: '请输入部门目标值', trigger: 'blur' },
            { validator: completionValue, trigger: 'blur' }

          ]
        }
      }
    }
  },
  created () {
    this.getBaseData()
    this.getDepartList()
    this.getDate()
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
        this.dataForm.deptName = ''
        this.dataForm.deptNameAssessment = ''
        this.dataForm.list = []
        if (id) {
          this.isDisabled = true
          deptMonthlyInfo({ id: id }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm.id = data.data.id
              this.dataForm.deptName = data.data.deptName
              this.dataForm.deptCode = data.data.deptCode
              this.dataForm.list = data.data.list
              this.dataForm.monthly = data.data.monthly
              this.dataForm.responsiblePerson = data.data.responsiblePerson
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
    // 获取当前日期
    getDate () {
      let date = new Date()
      let date1 = date.toLocaleDateString()
      this.dataForm.assessmentDate = new Date(date1).Format('yyyy-MM-dd')
      console.log(this.dataForm.assessmentDate, '1111111111111111111')
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
    // 获取部门树
    getDepartList () {
      this.dataListLoading = true
      departList().then(({ data }) => {
        if (data && data.code === 0) {
          this.departList = [data.data[0]] || []
          // console.log(this.departList)
          this.dataListLoading = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 考核部门菜单树选中
    departListTreeCurrentChangeHandle4 (data, node) {
      // 当前节点的数据，对象
      this.dataForm.deptIdAssessment = data.id
      this.dataForm.deptNameAssessment = data.deptName
      this.popoverVisible4 = false
    },
    // 选择企业目标的处理函数
    selComTarget () {
      this.selectComtargetVisible = true
      this.$nextTick(() => {
        this.$refs.selectComtarget.init()
      })
    },
    // 子组件返回
    selectComtargetEmit (val) {
      // console.log('返回', val)
      if (val) {
        this.dataForm.list = val
        // this.dataForm.accidentFactor = val.map((item, index) => {
        //   return (index + 1) + '.' + item.factorDanger
        // }).join('；')
        this.dataForm.list.forEach(item => {
          // item.assessmentValue = 0
          item.targetId = item.id
          item.targetValue = Number(item.targetValue)
        })
        console.log(this.dataForm.list, '11111111111111111111')
        // let cache = this.dataForm
        // this.dataForm = null
        // this.dataForm = cache
      }
    },
    // 删除目标
    removeClasses (index) {
      this.dataForm.list.splice(index, 1)
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        console.log(this.dataForm, '11111111111111111')
        if (valid) {
          this.dataForm.list.map(item => {
            item.deptIdAssessment = this.dataForm.deptIdAssessment
            item.deptNameAssessment = this.dataForm.deptNameAssessment
            item.assessmentDate = this.dataForm.assessmentDate
          })

          organizationAssessment(
            this.dataForm.list
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
  },
  watch: {
    'dataForm.list': {
      handler (newVal, oldVal) {
        console.log(newVal)
        newVal.forEach((val, index) => {
          if (Number(val.completionValue) > Number(val.assessmentValue)) {
            val.assessmentState = '1'
          } else {
            val.assessmentState = '0'
          }
        })
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.dept-target-dialog {
  .el-input--medium .el-input__icon {
    line-height: 28px;
  }
  .el-select {
    width: 100%;
  }
  .upload {
    color: #2c78bb;
    border-color: #97c2e9;
  }
  .el-date-editor {
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
  .el-divider--horizontal {
    margin: 15px 0;
  }
  .configStyle {
    position: relative;
    width: 98%;
    background: #f8fafc;
    // padding-top: 20px;
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
      height: 43px;
      line-height: 35px;
      width: 98%;
      .target-value {
        .el-input__inner {
          text-align: center;
        }
      }
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

