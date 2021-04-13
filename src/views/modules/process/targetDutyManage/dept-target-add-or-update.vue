<template>
  <el-dialog :title="(!dataForm.id?'新增':'修改')+'目标拆解'" :close-on-click-modal="false" class="dept-target-dialog" width="750px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="110px">
      <el-form-item label="部门名称" prop="deptId">
        <el-popover v-model="popoverVisible1" ref="departPopover1" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree1" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle1" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptName" v-popover:departPopover1 :readonly="true" size="mini" class="select-depart" placeholder="请选择" clearable></el-input>
      </el-form-item>
      <el-form-item label="制定部门" prop="deptIdEstablishment">
        <el-popover v-model="popoverVisible2" ref="departPopover2" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="departListTree2" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle2" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.deptNameEstablishment" v-popover:departPopover2 :readonly="true" size="mini" class="select-depart" placeholder="请选择" clearable></el-input>
      </el-form-item>
      <el-form-item label="制定日期" prop="establishmentDate">
        <el-date-picker v-model="dataForm.establishmentDate" type="date" placeholder="请选择" value-format="yyyy-MM-dd"> </el-date-picker>
      </el-form-item>
      <el-form-item label="指标年度" prop="year">
        <el-date-picker v-model="dataForm.year" type="year" placeholder="选择部门目标后自动生成" value-format="yyyy" @change="selectYearHandle" disabled> </el-date-picker>
      </el-form-item>
      <el-form-item label="部门目标" prop="list">
        <el-button @click="selComTarget()" class="upload" size="small">选择目标</el-button>
        <el-row v-if="dataForm.list.length>0" :gutter="5">
          <el-col :span="8" class="material-name">
            <span>目标名称</span>
          </el-col>
          <el-col :span="6" class="material-name">
            <span>企业目标值</span>
          </el-col>
          <el-col :span="7" class="material-name">
            <span>部门目标值</span>
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
                <el-input v-model="item.targetValue" disabled class="target-value"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :prop="'list.'+index+'.assessmentValue'" :rules="dataRule.targetRule.assessmentValue">
                <el-input type="number" v-model="item.assessmentValue" controls-position="right" class="target-value" :min="0" :max="Number(item.targetValue)"></el-input>
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
import { organizationList, organizationAddOrUpdate, organizationInfo } from '@/api/process/targetDuty'
import { departList } from '@/api/sys/depart'
import selectComtarget from './dept-select-target'
import { getLabels } from '@/api/common/sys'
export default {
  components: {
    selectComtarget
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
        year: '',
        deptId: '', // 部门id
        deptName: '', // 部门名称
        deptIdEstablishment: '', // 制定部门部门ID
        deptNameEstablishment: '', // 制定部门名称
        deptNameResponsible: '', // 责任部门名称
        deptIdResponsible: '', // 责任部门ID
        establishmentDate: '', // 制定日期
        list: [], // 目标list
        targetLevelList: [],
        remarks: '',
        level: '2'
      },
      departList: [], // 部门列表
      isDisabled: false,
      disabled: false,
      visible: false,
      popoverVisible1: false,
      popoverVisible2: false,
      selectComtargetVisible: false,
      defaultProps: {
        label: 'deptName',
        children: 'child'
      }, // 树形结构展示
      dataRule: {
        deptId: [{ required: true, message: '请选择部门名称', trigger: 'change' }],
        year: [{ required: true, message: '请选择年份', trigger: 'change' }],
        deptIdEstablishment: [{ required: true, message: '请选择制定部门', trigger: 'change' }],
        establishmentDate: [{ required: true, message: '请选择制定日期', trigger: 'change' }],
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
        this.dataForm.deptNameEstablishment = ''
        this.dataForm.deptNameResponsible = ''
        this.dataForm.list = []
        if (id) {
          this.isDisabled = true
          organizationInfo({ id: id }).then(({ data }) => {
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
      let date = new Date()
      let date1 = date.toLocaleDateString()
      this.dataForm.establishmentDate = new Date(date1).Format('yyyy-MM-dd')
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
    // 获取企业方针和目标数据列表
    getDataList (year, dept) {
      this.dataListLoading = true
      organizationList({
        page: this.pageIndex,
        limit: this.pageSize,
        deptId: this.dataForm.deptId,
        year: year
      })
        .then(({ data }) => {
          if (data && data.code === 0) {
            // console.log(data)
            this.dataList = data.page.list
            this.totalPage = data.page.count
            this.isDisabled = false
            if (this.dataList.length > 0 && this.dataForm.deptId && !dept) {
              this.$message.warning('该年度部门目标已存在！请重新选择年度')
              this.isDisabled = true
            } else if (this.dataList.length > 0 && this.dataForm.deptId && dept) {
              this.$message.warning('该年度部门目标已存在！请重新选择部门')
              this.isDisabled = true
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
    // 选择年份变化的处理函数
    async selectYearHandle (val) {
      await this.getDataList(val)
    },
    // 部门菜单树选中
    departListTreeCurrentChangeHandle1 (data, node) {
      // 当前节点的数据，对象
      this.dataForm.deptId = data.id
      this.dataForm.deptName = data.deptName
      this.popoverVisible1 = false
      if (this.dataForm.year) {
        this.getDataList(this.dataForm.year, 'dept')
      }
    },
    // 制定部门菜单树选中
    departListTreeCurrentChangeHandle2 (data, node) {
      // 当前节点的数据，对象
      this.dataForm.deptIdEstablishment = data.id
      this.dataForm.deptNameEstablishment = data.deptName
      this.popoverVisible2 = false
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
    // 子组件返回
    selectComtargetEmit (val) {
      // console.log('返回', val)
      if (val) {
        this.dataForm.list = _.cloneDeep(val.list)
        this.dataForm.year = val.year
        if (this.dataForm.year && !this.dataForm.id) {
          this.getDataList(this.dataForm.year)
        }
        if (this.dataForm.list && this.dataForm.list.length > 0) {
          this.dataForm.list.forEach(item => {
            // item.assessmentValue = JSON.parse(JSON.stringify(Number(item.targetValue)))
            item.targetId = item.id
            item.targetValue = Number(item.targetValue)
          })
        }
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
          organizationAddOrUpdate(
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


