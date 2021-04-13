<template>
  <el-dialog title="新增检查项信息"
             class="addcheck-dialog"
             width="700px"
             :close-on-click-modal="false"
             :visible.sync="visible"
             :before-close="handleClose"
             append-to-body>
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             class="classes"
             label-width="110px">
      <el-form-item label="上传类型"
                    prop="parameterType">
        <el-select v-model="dataForm.parameterType"
                   placeholder="请选择上传类型"
                   size="mini"
                   @change="handleChange">
          <el-option v-for="item in options"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataForm.parameterType==='0'||dataForm.parameterType==='1'||dataForm.parameterType==='2'"
                    label="参数名称"
                    prop="parameterName">
        <el-input v-model="dataForm.parameterName"
                  placeholder="请输入参数名称"
                  size="mini"
                  clearable></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.parameterType==='0'||dataForm.parameterType==='2'"
                    label="参数描述"
                    prop="remarks">
        <el-input v-model="dataForm.remarks"
                  placeholder="请输入描述"
                  clearable
                  size="mini"></el-input>
      </el-form-item>
      <el-row v-if="dataForm.parameterType==='1'"
              :gutter="4"
              type="flex">
        <el-col :sapn="14">
          <el-form-item label="参数区间"
                        prop="style">
            <el-select v-model="dataForm.style"
                       placeholder="请选择条件"
                       class="paraWidth"
                       align="center"
                       size="mini">
              <el-option v-for="item in operOptions"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :sapn="5"
                v-if="['4','5','6','7'].indexOf(dataForm.style)!=-1">
          <el-form-item prop="minparameterValue"
                        label-width="10">
            <el-input v-model="dataForm.minparameterValue"
                      class="paraWidth"
                      placeholder="最小值"
                      type="number"
                      size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sapn="5"
                v-if="['4','5','6','7'].indexOf(dataForm.style)!=-1">
          <el-form-item prop="maxparameterValue"
                        label-width="10">
            <el-input v-model="dataForm.maxparameterValue"
                      class="paraWidth"
                      placeholder="最大值"
                      type="number"
                      size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :sapn="6"
                v-if="['0','1','2','3','8'].indexOf(dataForm.style)!=-1">
          <el-form-item prop="parameterValue"
                        label-width="10">
            <el-input v-model="dataForm.parameterValue"
                      class="paraWidth"
                      placeholder="请输入一个值"
                      type="number"
                      size="mini"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-if="dataForm.parameterType==='2'"
                    label="是否"
                    prop="parameterValue">
        <el-radio v-model="dataForm.parameterValue"
                  label="0">是
        </el-radio>
        <el-radio v-model="dataForm.parameterValue"
                  label="1">否
        </el-radio>
      </el-form-item>
      <el-form-item v-if="dataForm.parameterType==='3'"
                    label="仪表"
                    prop="code">
        <el-select v-model="dataForm.meaningless"
                   value-key="code"
                   placeholder="请选择"
                   size="mini"
                   @change="handleChangeParameter"
                   clearable>
          <el-option v-for="item in meterList"
                     :key="item.id"
                     :label="item.code + ' (' + formatType(item.type) + ':' + item.minRange + item.unit + ' - ' + item.maxRange + item.unit + ')'"
                     :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="dataForm.parameter.code"
                    label="阈值"
                    prop="range">
        <li v-if="dataForm.parameter.code && dataForm.type === '0'">
          {{showRange(dataForm.parameter.lowerLowerLimit, '1', dataForm.type)}}
        </li>
        <li v-if="dataForm.parameter.code && dataForm.type === '0'">
          {{showRange(dataForm.parameter.lowerLimit, '2', dataForm.type)}}
        </li>
        <li v-if="dataForm.parameter.code">
          {{showRange(dataForm.parameter.highLimit, '3', dataForm.type)}}
        </li>
        <li v-if="dataForm.parameter.code">
          {{showRange(dataForm.parameter.highHighLimit, '4', dataForm.type)}}
        </li>
      </el-form-item>
      <el-form-item label-width="110px"
                    v-if="dataForm.parameterType==='3'">
        <i class="el-icon-info">仪表阈值请在任务环节中查看</i>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary"
                 @click="submitHandle">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { meterShow } from '@/api/sou/parameter'
import { getLabels } from '@/api/common/sys'

export default {
  // props: ['taskId'], // 接收父组件传递过来的任务的id
  data () {
    // var checkMin = (rule, parameterValue, callback) => {
    //   if (parameterValue > this.dataForm.maxparameterValue) {
    //     return callback(new Error('请重新输入最小值'))
    //   }
    // }
    // var checkMax = (rule, parameterValue, callback) => {
    //   if (parameterValue < this.dataForm.maxparameterValue) {
    //     return callback(new Error('请重新输入最大值'))
    //   }
    // }
    return {
      visible: false,
      dataForm: {
        type: '', // 仪表类型
        facilityId: '',
        parameterName: '', // 参数名
        parameterType: '', // 类型
        remarks: '', // 参数值
        style: '', // 运算符的类型
        minparameterValue: '', // 最小值
        maxparameterValue: '', // 最大值
        parameterValue: '', // 定值
        code: '', // 仪表位号
        meaningless: {},
        parameter: {
          code: '',
          lowerLowerLimit: '',
          lowerLimit: '',
          highLimit: '',
          highHighLimit: ''
        }
      },
      meterList: [], // 仪表
      panelTypeList: [], // 仪表类型
      // 表单校验规则
      dataRule: {
        parameterName: [{ required: true, message: '检查项名称不能为空', trigger: 'blur' }],
        parameterType: [{ required: true, message: '请选择上传类型', trigger: 'change' }],
        remarks: [{ required: true, message: '参数描述不能为空', trigger: 'blur' }],
        style: [{ required: true, message: '请选择上传类型', trigger: 'change' }],
        minparameterValue: [{ required: true, message: '请输入参数下界', trigger: 'blur' }],
        maxparameterValue: [{ required: true, message: '请输入参数上界', trigger: 'blur' }],
        parameterValue: [{ required: true, message: '请输入值', trigger: 'blur' }],
        parameter: [{ required: true, message: '请选择仪表', trigger: 'change' }]
        //         validator: checkMin,
        // validator: checkMax,
      },
      // 上传类型的数据
      options: [{
        value: '0',
        label: '文本'
      }, {
        value: '1',
        label: '数值'
      }, {
        value: '2',
        label: '判断'
      }, {
        value: '3',
        label: '仪表'
      }],
      // 0:> 1:< 2:>= 3:<= 4: (,)  5: (,]6: [,) 7: [,]  8:=
      operOptions: [{
        value: '0',
        label: '> 大于'
      }, {
        value: '1',
        label: '< 小于'
      }, {
        value: '2',
        label: '>= 大于等于'
      }, {
        value: '3',
        label: '<= 小于等于'
      }, {
        value: '4',
        label: '(,) 开区间'
      }, {
        value: '5',
        label: '(,] 左开右闭'
      }, {
        value: '6',
        label: '[,) 左闭右开'
      }, {
        value: '7',
        label: '[,] 闭区间'
      }, {
        value: '8',
        label: '= 等于'
      }]
    }
  },
  methods: {
    init (facilityId) {
      this.isDisabled = false
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.parameterName = ''
        this.dataForm.parameterType = ''
        this.dataForm.remarks = ''
        this.dataForm.style = ''
        this.dataForm.parameterValue = ''
        this.dataForm.facilityId = facilityId
        this.dataForm.parameter = {}
        this.dataForm.meaningless = {}
        this.getPanelType()
      })
    },
    // 从字典表获取仪表类型
    getPanelType () {
      getLabels({
        type: 'METER_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.panelTypeList = data.list
        }
      })
    },
    formatType (value) {
      let optionName = ''
      this.panelTypeList.map((val) => {
        if (value === val.label) {
          optionName = val.value
        }
      })
      return optionName
    },
    handleClose () {
      this.visible = false
    },
    // 当选中的值发生改变的时候
    handleChange (val) {
      if (val === '3') {
        this.getMetersList()
      }
    },
    handleChangeParameter (val) {
      if (val.parameter) {
        this.dataForm.code = val.code ? val.code + '(' + this.formatType(val.type) + ':' + val.minRange + val.unit + ' - ' + val.maxRange + val.unit + ')' : ''
        this.dataForm.type = val.type
        this.dataForm.parameter = val.parameter
      } else {
        this.dataForm.parameter = {}
      }
    },
    showRange (data, val, type) {
      let result
      switch (val) {
        case '1':
          if (type === '0') {
            result = '低低位限： （' + (data || '暂未启用') + '）'
          }
          break
        case '2':
          if (type === '0') {
            result = '低位限： （' + (data || '暂未启用') + '）'
          }
          break
        case '3':
          if (type === '0') {
            result = '高位限： （' + (data || '暂未启用') + '）'
          } else {
            result = '一级预警阈值： （' + (data || '暂未启用') + '）'
          }
          break
        case '4':
          if (type === '0') {
            result = '高高位限： （' + (data || '暂未启用') + '）'
          } else {
            result = '二级预警阈值： （' + (data || '暂未启用') + '）'
          }
          break
        default:
          result = '错误'
          break
      }
      return result
    },
    // 查询 某个储罐/生产装置的所有仪表数据
    getMetersList () {
      meterShow({
        'id': this.dataForm.facilityId// 反应装置的id
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.meterList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    submitHandle () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.visible = false
          if (this.dataForm.parameterType === '0' || this.dataForm.parameterType === '2') {
            this.$emit('addCheckHandle', this.dataForm)
          } else if (this.dataForm.parameterType === '1') {
            if (['4', '5', '6', '7'].indexOf(this.dataForm.style) !== -1) {
              let arr = ['>', '<', '>=', '<=', '(,)', '(,]', '[,]', '=']
              let index = parseInt(this.dataForm.style)
              let oper = ''
              arr.forEach((item, i) => {
                if (index === i) {
                  oper = item
                }
              })
              let str = oper[0] + this.dataForm.minparameterValue + ',' + this.dataForm.maxparameterValue + oper[2]
              this.dataForm.parameterValue = str
              this.$emit('addCheckHandle', this.dataForm)
            } else {
              this.$emit('addCheckHandle', this.dataForm)
            }
          } else if (this.dataForm.parameterType === '3') {
            this.dataForm.parameterName = this.dataForm.code
            this.$emit('addCheckHandle', this.dataForm)
          }
          this.$refs['dataForm'].resetFields()
        }
      })
    }
  }
}
</script>

<style lang="scss">
.addcheck-dialog {
  .el-dialog__body {
    height: 265px;
  }

  .fh {
    position: absolute;
    left: 179px;
  }

  .paraWidth {
    width: 176px;
  }

  .el-radio {
    margin-right: 15px;
  }

  .selop {
    width: 150px;
  }
}
</style>
