<template>
  <el-dialog title="部门考核" :close-on-click-modal="false" class="dept-target-dialog" width="750px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="110px">
      <el-form-item label="部门名称" prop="deptId">
        <el-input v-model="dataForm.deptName" size="mini" disabled></el-input>
      </el-form-item>
      <el-form-item label="年度" prop="year">
        <el-date-picker v-model="dataForm.year" type="year" placeholder="选择年度" value-format="yyyy" disabled> </el-date-picker>
      </el-form-item>
      <el-form-item label="制定部门" prop="deptIdEstablishment">
        <el-input v-model="dataForm.deptNameEstablishment" size="mini" class="select-depart" disabled></el-input>
      </el-form-item>
      <el-form-item label="制定日期" prop="establishmentDate">
        <el-date-picker v-model="dataForm.establishmentDate" type="date" placeholder="请选择" value-format="yyyy-MM-dd" disabled> </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="责任部门" prop="deptIdResponsible">
        <el-input v-model="dataForm.deptNameResponsible" size="mini" class="select-depart" disabled></el-input>
      </el-form-item> -->
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
          <el-col :span="5" class="material-name">
            <el-button type="text">目标名称</el-button>
          </el-col>
          <el-col :span="4" class="material-name">
            <el-button type="text">部门目标值</el-button>
          </el-col>
          <el-col :span="8" class="material-name">
            <el-button type="text">完成值</el-button>
          </el-col>
          <el-col :span="5" class="material-name">
            <el-button type="text">考核结果</el-button>
          </el-col>
        </el-row>
        <div class="configStyle" v-for="(item,index) of dataForm.list" :key="index">
          <!-- <el-tooltip class="del-child" effect="dark" content="删除" placement="right">
            <i class="el-icon-remove" @click="removeClasses(index)"></i>
          </el-tooltip> -->
          <el-row :gutter="7" class="item-style">
            <el-col :span="5">
              <el-form-item>
                <el-input v-model="item.targetName" size="mini" disabled>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-form-item>
                <el-input v-model="item.assessmentValue" size="mini" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item>
                <el-input-number v-model="item.completionValue" controls-position="right"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item>
                <el-tag v-if="item.assessmentState==='0'" type="success">合格</el-tag>
                <el-tag v-if="item.assessmentState==='1'" type="danger">不合格</el-tag>
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
import { organizationInfo, organizationAssessment } from '@/api/process/targetDuty'
import { departList } from '@/api/sys/depart'
import selectComtarget from './dept-select-target'
import { getLabels } from '@/api/common/sys'
export default {
  components: {
    selectComtarget
  },
  data () {
    return {
      dataForm: {
        id: '',
        year: '',
        deptId: '', // 部门id
        deptName: '', // 部门名称
        deptIdEstablishment: '', // 制定部门部门ID
        deptNameEstablishment: '', // 制定部门名称
        deptNameResponsible: '', // 责任部门名称
        deptIdResponsible: '', // 责任部门ID
        deptIdAssessment: '', // 考核部门
        deptNameAssessment: '', // 考核部门名称
        establishmentDate: '', // 制定日期
        assessmentDate: '', // 考核日期
        list: [], // 目标list
        remarks: ''
      },
      // {
      //     assessmentState: '', // 目标名称
      //     assessmentDate: '', // 考核日期
      //     assessmentValue: '', // 评测值
      //     completionValue: '', // 完成值
      //     deptIdAssessment: '', // 考核部门id
      //     deptNameAssessment: '', // 考核部门名称
      //     organizationId: '', // 组织部门id
      //     targetId: '', // 目标id
      //     targetName: '', //
      //     targetValue: ''
      //   },
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
        deptId: [{ required: true, message: '请选择部门名称', trigger: 'change' }],
        year: [{ required: true, message: '请选择年份', trigger: 'change' }],
        deptIdEstablishment: [{ required: true, message: '请选择制定部门', trigger: 'change' }],
        deptNameResponsible: [{ required: true, message: '请选择责任部门', trigger: 'change' }],
        establishmentDate: [{ required: true, message: '请选择制定日期', trigger: 'change' }],
        list: [{ required: true, message: '请选择企业目标', trigger: 'change' }]
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
        this.dataForm.deptName = ''
        this.dataForm.deptNameEstablishment = ''
        this.dataForm.deptNameResponsible = ''
        this.dataForm.deptNameAssessment = ''
        this.dataForm.list = []
        if (id) {
          this.isDisabled = true
          organizationInfo({ id: id }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm = data.data
              // this.dataForm.list.forEach(item => {
              //   item.targetValue = parseInt(item.targetValue)
              // })
              this.dataForm.deptIdAssessment = ''
              this.dataForm.deptNameAssessment = ''
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
  // .el-row {
  //   margin-left: -60.5px;
  // }
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


