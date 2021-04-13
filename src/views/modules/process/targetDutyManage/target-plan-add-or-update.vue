<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '目标计划'" :close-on-click-modal="false" class="target-plan-add-dialog" width="750px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="110px">
      <el-form-item label="部门名称" prop="deptCode">
        <el-popover v-model="popoverVisible1" ref="departPopover1" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree1" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle1" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptName" v-popover:departPopover1 :readonly="true" size="mini" class="select-depart" placeholder="请选择" clearable></el-input>
      </el-form-item>
      <el-form-item label="指标月度" prop="monthly">
        <el-date-picker v-model="dataForm.monthly" type="month" placeholder="指标月度" value-format="yyyy-MM" @change="selectYearHandle"> </el-date-picker>
      </el-form-item>
      <el-form-item label="部门目标" prop="list">
        <i class="el-icon-warning" size="small">请先选择部门和月度</i>
        <!-- <el-button @click="selComTarget()" class="upload" size="small">选择目标</el-button> -->
        <el-row v-if="dataForm.list.length>0" :gutter="5">
          <el-col :span="8" class="material-name">
            <span>目标名称</span>
          </el-col>
          <el-col :span="6" class="material-name">
            <span>企业目标值</span>
          </el-col>
          <el-col :span="7" class="material-name">
            <span type="text">部门目标值</span>
          </el-col>
        </el-row>
        <el-divider v-if="dataForm.list.length>0"></el-divider>
        <div class="configStyle" v-for="(item,index) of dataForm.list" :key="index">
          <el-tooltip class="del-child" effect="dark" content="删除" placement="right">
            <i class="el-icon-remove" @click="removeClasses(index)"></i>
          </el-tooltip>
          <el-row :gutter="7" class="item-style">
            <el-col :span="8">
              <el-form-item :prop="'list.'+index+'.targetName'" :rules="dataRule.targetRule.targetName">
                <el-input v-model="item.targetName" size="mini" disabled>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :prop="'list.'+index+'.targetValue'" :rules="dataRule.targetRule.targetValue">
                <el-input v-model="item.targetValue" class="target-value" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :prop="'list.'+index+'.assessmentValue'" :rules="dataRule.targetRule.assessmentValue">
                <el-input type="number" v-model="item.assessmentValue" :placeholder="'年度值'+'('+item.val+')'" controls-position="right" class="target-value" :min="0" :max="Number(item.val)"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item label="责任人" prop="responsiblePerson">
        <el-input v-model="dataForm.responsiblePerson" placeholder="责任人" @focus="responsibleHandle" size="mini" class="size-mini-pople-input">
          <el-button slot="append" @click="responsibleHandle">选择</el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
    <select-comtarget v-if="selectComtargetVisible" ref="selectComtarget" @selectComtargetEmit="selectComtargetEmit"></select-comtarget>
    <select-person v-if="selectPersonVisible" ref="selectPerson" @refreshment="personSelected"></select-person>
  </el-dialog>
</template>
<script>
import { organizationList, deptMonthlyList, deptMonthlyAddOrUpdate, deptMonthlyInfo } from '@/api/process/targetDuty'

import { departList } from '@/api/sys/depart'
import selectComtarget from './dept-select-target'
import selectPerson from './target-plan-select-person'
import { getLabels } from '@/api/common/sys'
export default {
  components: {
    selectComtarget,
    selectPerson
  },
  data () {
    var assessmentValue = (rule, value, callback) => {
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
        gh: '',
        year: '',
        list: [], // 目标list
        monthly: '', // 月度
        responsiblePerson: '', // 责任人
        remarks: ''
      },
      departList: [], // 部门列表
      targetLevelList: [],
      isDisabled: false,
      disabled: false,
      visible: false,
      popoverVisible1: false,
      popoverVisible2: false,
      popoverVisible3: false,
      selectComtargetVisible: false,
      selectPersonVisible: false,
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
        targetRule: {
          assessmentValue: [
            { required: true, message: '请输入部门目标值', trigger: 'blur' },
            { validator: assessmentValue, trigger: 'blur' }

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
        this.dataForm.deptId = ''
        this.dataForm.year = ''
        this.dataForm.list = []
        if (id) {
          this.isDisabled = true
          deptMonthlyInfo({ id: id }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm = data.data
              this.dataForm.list.forEach(item => {
                item.targetValue = parseInt(item.targetValue)
              })
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
      // this.dataForm.createDate = (new Date()).Format('yyyy-MM-dd HH:mm:ss')
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
          this.dataListLoading = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 选择月度后获取企业方针和目标数据列表
    getDataList (year, deptId) {
      this.dataListLoading = true
      organizationList({
        page: this.pageIndex,
        limit: this.pageSize,
        year: year,
        deptId: deptId
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            // console.log(data)s
            this.dataList = data.page.list
            this.totalPage = data.page.count
            this.dataForm.list = data.page.list[0].list
            if (this.dataForm.list && this.dataForm.list.length > 0) {
              this.dataForm.list.forEach(item => {
                // item.targetId = item.id
                item.targetValue = Number(item.targetValue)
                item.val = Number(item.assessmentValue)
                item.assessmentValue = ''
              })
            }
            // console.log(this.dataForm.list)
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
        .catch(err => {
          console.log(err)
          this.$message.warning('该年度不存在部门指标，请重新选择')
          this.dataListLoading = false
        })
    },
    // 选择部门后 获取目标拆解数据列表
    getDataList1 (deptId) {
      this.dataListLoading = true
      organizationList({
        page: this.pageIndex,
        limit: this.pageSize,
        deptId: deptId
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            // console.log(data)
            this.dataList = data.page.list
            if (this.dataList && this.dataList.length <= 0) {
              this.$message.warning('该部门年度目标不存在，请先配置或重新选择部门')
            }
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
        .catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
          this.dataListLoading = false
        })
    },
    // 获取目标拆解列表
    getDataList2 (deptId) {
      this.dataListLoading = true
      deptMonthlyList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'deptCode': this.dataForm.deptCode,
        'monthly': this.dataForm.monthly
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
          this.dataList = data.page.list
          if (this.dataList && this.dataList.length > 0) {
            this.$message.warning('该月份部门计划已存在，请重新选择')
          } else {
            this.getDataList(this.dataForm.year, this.dataForm.deptId)
          }
        } else {
          this.dataList = []
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 选择年份变化的处理函数
    selectYearHandle (val) {
      this.dataForm.year = val.split('-')[0]
      if (this.dataForm.year && this.dataForm.deptId) {
        this.getDataList2()
      }
    },
    // 部门菜单树选中
    departListTreeCurrentChangeHandle1 (data, node) {
      // 当前节点的数据，对象
      this.dataForm.deptCode = data.deptCode
      this.dataForm.deptId = data.id
      this.dataForm.deptName = data.deptName
      this.popoverVisible1 = false
      if (this.dataForm.deptId && !this.dataForm.year) {
        this.getDataList1(this.dataForm.deptId)
      } else if (this.dataForm.deptId && this.dataForm.year) {
        this.getDataList2()
      }
    },
    // 选择企业目标的处理函数
    selComTarget () {
      this.selectComtargetVisible = true
      // console.log(this.dataForm.list, '企业目标列表')
      this.$nextTick(() => {
        let arr = _.cloneDeep(this.dataForm)
        this.$refs.selectComtarget.init(arr)
      })
    },
    // 选择人员处理函数
    responsibleHandle () {
      this.selectPersonVisible = true
      this.$nextTick(() => {
        this.$refs.selectPerson.init(this.dataForm.deptId, this.dataForm)
      })
    },
    // 子组件返回
    selectComtargetEmit (val) {
      // console.log('返回', val)
      if (val) {
        this.dataForm.list = _.cloneDeep(val.list)
        if (this.dataForm.year && !this.dataForm.id) {
          this.getDataList(this.dataForm.year)
        }
        if (this.dataForm.list && this.dataForm.list.length > 0) {
          this.dataForm.list.forEach(item => {
            item.targetId = item.id
            item.targetValue = Number(item.targetValue)
          })
        }
        //   console.log(this.dataForm.list, '测试123')
      }
    },
    // 人员返回值的处理函数
    personSelected (val) {
      console.log(val, '人员返回值')
      this.dataForm.responsiblePerson = val.name
      this.dataForm.gh = val.gh
    },
    // 删除目标
    removeClasses (index) {
      this.dataForm.list.splice(index, 1)
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          deptMonthlyAddOrUpdate(
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
.target-plan-add-dialog {
  .el-input--medium .el-input__icon {
    line-height: 28px;
  }
  .el-select {
    width: 100%;
  }
  .el-icon-warning {
    color: #e6a23c;
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
  .el-divider--horizontal {
    margin: 15px 0;
  }
  .configStyle {
    position: relative;
    width: 98%;
    background: #f8fafc;
    padding: 0 0 0 15px;
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
      top: 2px;
      right: 35px;
      color: red;
      z-index: 99;
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


