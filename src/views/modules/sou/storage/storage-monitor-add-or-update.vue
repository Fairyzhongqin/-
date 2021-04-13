<template>
  <el-dialog title="报警阈值" :close-on-click-modal="false" width="750px" @close="$emit('close')" :visible.sync="visible" class="storage-params-edit">

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="configParamStyle" label-width="100px">
      <el-row>
        <p class="headerInfo" style="margin-top:0;color:#222222;">基本信息</p>
      </el-row>
      <div class="basic">
        <el-row :gutter="20">
          <el-col :span="5" class="basic-name">
            <span>设施名称</span>

          </el-col>
          <el-col :span="6" class="basic-value">
            <span v-if="dataForm.name">{{dataForm.name}}</span>
            <span v-else>暂无记录</span>
          </el-col>

        </el-row>

        <el-row :gutter="20">
          <el-col :span="5" class="basic-name">
            <span>存储物品名称</span>
          </el-col>
          <el-col :span="12" class="basic-value">
            <span v-if="dataForm.storageName">{{dataForm.storageName}}</span>
            <span v-else>暂无记录</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5" class="basic-name">
            <span>存储设施类型</span>
          </el-col>
          <el-col :span="12" class="basic-value">
            <span v-if="dataForm.tankTypeName">{{dataForm.tankTypeName}}</span>
            <span v-else>暂无记录</span>
          </el-col>

        </el-row>
        <el-row :gutter="20">
          <el-col :span="5" class="basic-name">
            <span>风险属性</span>
          </el-col>
          <el-col :span="12" class="basic-value">

            <span v-if="dataForm.dangerAttr" class="dangerContributter">{{dataForm.dangerAttr}}</span>
            <span v-else>
              暂无记录
            </span>
          </el-col>
        </el-row>
      </div>
      <el-divider></el-divider>
      <el-row>
        <p class="headerInfo" style="margin-top:0;color:#222222;">配置参数：
          <!-- <el-tooltip class="add-child" effect="dark" content="新增" placement="right" v-if="addVisible">
            <i class="el-icon-circle-plus-outline" @click="addClasses">
            </i>
          </el-tooltip> -->
          <el-button icon="el-icon-circle-plus-outline" @click="addClasses" size="normal" type="text" :disabled="!addVisible">新增</el-button>
        </p>
      </el-row>
      <el-form :model="panelForm" ref="panelForm" label-width="109px">
        <div class="configStyle" v-for="(item,index) of panelForm.panel" :key="index">
          <el-tooltip class="del-child" effect="dark" content="删除" placement="right">
            <i class="el-icon-close" @click="removeClasses(item)"></i>
          </el-tooltip>
          <el-row>
            <el-col :span="12">
              <el-form-item :prop="'panel.' + index + '.code'" :rules="panelRules.code" label="仪表位号">
                <el-select v-model="item.code" placeholder="请选择仪表位号" @change="selectMeter(item)">
                  <el-option v-for="itemM in meterOptions" :key="itemM.code" :label="itemM.code" :value="itemM.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :prop="'panel.' + index + '.status'" :rules="panelRules.status" label="是否启用">
                <el-switch v-model="item.status" active-color="#2c78bb">
                </el-switch>

              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :prop="'panel.' + index + '.type'" :rules="panelRules.type" label="仪表类型">
                <el-select v-model="item.type" size="mini" disabled clearable>
                  <el-option v-for="itemM in panelTypeList" :key="itemM.label" :value="itemM.label" :label="itemM.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :prop="'panel.' + index + '.range'" :rules="panelRules.range" label="仪表量程">
                <el-input v-model="item.range" size="mini" disabled type="text" maxlength="10" placeholder="请输入量程" clearable>
                </el-input>
              </el-form-item>
            </el-col>
            <template v-if="item.type != ''">
              <template v-if="item.type === '3'">
                <el-col :span="12">
                  <el-form-item :prop="'panel.' + index + '.highLimitF'" :rules="panelRules.highLimitF" label="一级报警阈值" label-width="110px" class="first-second">
                    <el-input v-model="item.highLimitF" size="mini" type="number" maxlength="10" placeholder="请输入一级报警阈值" clearable>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :prop="'panel.' + index + '.highLimitS'" :rules="panelRules.highLimitS" label="二级报警阀值" label-width="110px" class="first-second">
                    <el-input v-model="item.highLimitS" size="mini" type="number" maxlength="10" placeholder="请输入二级报警阀值" clearable>
                    </el-input>
                  </el-form-item>
                </el-col>
              </template>
              <template v-else>
                <el-col :span="12">
                  <el-form-item :prop="'panel.' + index + '.lowerLowerLimit'" :rules="panelRules.lowerLowerLimit" label="低低限阈值">
                    <el-input v-model="item.lowerLowerLimit" size="mini" type="number" maxlength="10" placeholder="请输入低低限阈值" clearable>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :prop="'panel.' + index + '.lowerLimit'" :rules="panelRules.lowerLimit" label="低限阈值">
                    <el-input v-model="item.lowerLimit" size="mini" type="number" maxlength="10" placeholder="请输入低限阈值" clearable>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :prop="'panel.' + index + '.highLimit'" :rules="panelRules.highLimit" label="高限阈值">
                    <el-input v-model="item.highLimit" size="mini" type="number" maxlength="10" placeholder="请输入高限阈值" clearable>
                    </el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :prop="'panel.' + index + '.highHighLimit'" :rules="panelRules.highHighLimit" label="高高限阈值">
                    <el-input v-model="item.highHighLimit" size="mini" type="number" maxlength="10" placeholder="请输入高高限阈值" clearable>
                    </el-input>
                  </el-form-item>
                </el-col>
              </template>
            </template>
          </el-row>
        </div>
      </el-form>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { parameterList, parameterAddBatch } from '@/api/sou/parameter'
import { panelInfo } from '@/api/sou/equlpment'
import { getLabels } from '@/api/common/sys'
export default {
  data () {
    let validateCode = (rule, value, callback) => {
      var num = 0
      this.panelForm.panel.forEach(item => {
        if (item.code === value) num++
      })
      console.log(num, '仪表位号11111111')
      if (num > 1) {
        callback(new Error('仪表位号重复！请重新选择'))
      } else {
        callback()
      }
    }
    // 低低限 与 低限
    let validatelowerRange = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      if (Number(this.panelForm.panel[index].lowerLowerLimit) >= Number(this.panelForm.panel[index].lowerLimit) && this.panelForm.panel[index].lowerLimit !== '') {
        callback(new Error('低低限阈值必须小于低限阈值'))
      } else {
        callback()
      }
    }
    // 低低限 与 量程最小值
    let validatelowerRangeLower = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      console.log(this.panelForm.panel[index].lowerLowerLimit, this.panelForm.panel[index].minRange)
      if (Number(this.panelForm.panel[index].lowerLowerLimit) < Number(this.panelForm.panel[index].minRange)) {
        callback(new Error('低低限阈值必须大于量程最小值'))
      } else {
        callback()
      }
    }
    // 低限 与 高限
    let validatelowerRangeHighLimit = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      if (Number(this.panelForm.panel[index].lowerLimit) >= Number(this.panelForm.panel[index].highLimit) && this.panelForm.panel[index].highLimit !== '') {
        callback(new Error('低限阈值必须小于高限阈值'))
      } else {
        callback()
      }
    }
    // 高限 与 高高限
    let validatehighLimitRangeHH = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      if (Number(this.panelForm.panel[index].highLimit) >= Number(this.panelForm.panel[index].highHighLimit) && this.panelForm.panel[index].highHighLimit !== '') {
        callback(new Error('高限阈值必须小于高高限阈值'))
      } else {
        callback()
      }
    }
    // 高高限 与 量程最大值
    let validatehighLimitRangeMax = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      if (Number(this.panelForm.panel[index].highHighLimit) > Number(this.panelForm.panel[index].maxRange)) {
        callback(new Error('高高限阈值必须小于量程最大值'))
      } else {
        callback()
      }
    }
    // 一级报警阈值 与 二级报警阈值
    let validatehighLimitFS = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      if (Number(this.panelForm.panel[index].highLimitF) >= Number(this.panelForm.panel[index].highLimitS) && this.panelForm.panel[index].highLimitS !== '') {
        callback(new Error('一级报警阈值必须小于二级报警阈值'))
      } else {
        callback()
      }
    }
    // 一级报警阈值 与 minRange
    let validatehighLimitFmin = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      if (Number(this.panelForm.panel[index].highLimitF) < Number(this.panelForm.panel[index].minRange)) {
        callback(new Error('一级报警阈值必须大于量程最小值'))
      } else {
        callback()
      }
    }
    // 二级报警阈值 与 maxRange
    let validatehighLimitSmin = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      if (Number(this.panelForm.panel[index].highLimitS) > Number(this.panelForm.panel[index].maxRange)) {
        callback(new Error('二级报警阈值必须小于量程最大值'))
      } else {
        callback()
      }
    }
    return {
      panelForm: {
        panel: [] // 仪表信息
      },
      checked: false,
      dialogVisible: false,
      disabled: false,
      visible: false,
      isDisabled: false,
      addVisible: true, // 增加仪表的按钮显示与隐藏
      panelList: [],
      type: '',
      businessIds: '',
      dataForm: {
        name: '',
        storageName: '',
        tankTypeName: '',
        dangerAttr: '',
        panelmeterList: [],
        businessId: '',
        businessType: '1'
      },
      dataRule: {},
      panelTypeList: [],
      allMeterOptions: [], // 所有的仪表数据
      meterOptions: [], // 仪表list
      panelRules: {
        code: [{ required: true, message: '请选择仪表位号', trigger: 'change' },
        { required: true, validator: validateCode, trigger: 'change' }
        ],
        type: [{ required: true, message: '请输入类型', trigger: 'change' }],
        // describe: [{ required: true, message: '请输入描述信息', trigger: 'blur' }],
        // unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        range: [{ required: true, message: '请输入量程', trigger: 'blur' }],
        // 低低限
        lowerLowerLimit: [
          { required: true, message: '请输入低低限阈值', trigger: 'blur' },
          { required: true, validator: validatelowerRange, trigger: 'blur' },
          { required: true, validator: validatelowerRangeLower, trigger: 'blur' }
        ],
        // 低限
        lowerLimit: [
          { required: true, message: '请输入低限阈值', trigger: 'blur' },
          { required: true, validator: validatelowerRangeHighLimit, trigger: 'blur' },
          { required: true, validator: validatelowerRange, trigger: 'blur' }
        ],
        // 高线
        highLimit: [
          { required: true, message: '请输入高限阈值', trigger: 'blur' },
          { required: true, validator: validatelowerRangeHighLimit, trigger: 'blur' },
          { required: true, validator: validatehighLimitRangeHH, trigger: 'blur' }
        ],
        // 高高线
        highHighLimit: [
          { required: true, message: '请输入高高限阈值', trigger: 'blur' },
          { required: true, validator: validatehighLimitRangeHH, trigger: 'blur' },
          { required: true, validator: validatehighLimitRangeMax, trigger: 'blur' }
        ],
        // 一级报警阈值
        highLimitF: [
          { required: true, message: '请输入一级报警阈值', trigger: 'blur' },
          { required: true, validator: validatehighLimitFS, trigger: 'blur' },
          { required: true, validator: validatehighLimitFmin, trigger: 'blur' }
        ],
        // 二级报警阈值
        highLimitS: [
          { required: true, message: '请输入二级报警阈值', trigger: 'blur' },
          { required: true, validator: validatehighLimitFS, trigger: 'blur' },
          { required: true, validator: validatehighLimitSmin, trigger: 'blur' }
        ],
        status: [{ required: true, message: '请输入启用状态', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getPanelType()
  },
  methods: {
    // 初始数据
    init (info) {
      this.dataForm.name = info.name
      this.dataForm.businessId = info.id
      this.dataForm.storageName = info.storageName
      this.dataForm.tankTypeName = info.tankTypeName
      this.dataForm.dangerAttr = info.dangerAttr
      this.businessIds = info.id
      this.visible = true
      this.isDisabled = false
      this.addVisible = true
      this.$nextTick(async () => {
        this.$refs['dataForm'].resetFields()
        this.isDisabled = true
        this.allMeterOptions = []
        this.meterOptions = []
        await panelInfo({
          id: info.id
        }).then(({ data }) => {
          this.isDisabled = false
          if (data && data.code === 0) {
            this.allMeterOptions = data.list
            this.meterOptions = data.list
            this.dataForm.panelmeterList = data.list.map(item => {
              item.isChecked = false
              item.range = item.minRange + item.unit + ' - ' + item.maxRange + item.unit
              if (item.parameter === null) {
                item.parameter = {
                  businessId: info.id,
                  businessType: '1'
                }
              }
              return item
            })
          } else {
            this.$message.error(data.msg)
          }
        }).catch(err => {
          console.log(err)
          this.isDisabled = false
          this.$message.error('未知异常，请联系管理员')
        })
        if (info.id) {
          this.getDataList(info.id)
        }
      })
    },
    // 初始化this.panelForm.panel里面的数据
    async getDataList (id) {
      await parameterList({
        'businessId': id
      }).then(({ data }) => {
        this.isDisabled = false
        if (data && data.code === 0) {
          data.list.map(item => {
            this.panelForm.panel.push({
              businessId: this.dataForm.businessId,
              businessType: '0',
              code: item.code,
              range: item.minRange + item.unit + '-' + item.maxRange + item.unit,
              minRange: item.minRange,
              maxRange: item.maxRange,
              lowerLimit: item.type !== '0' ? '' : item.lowerLimit,
              lowerLowerLimit: item.type !== '0' ? '' : item.lowerLowerLimit,
              highLimit: item.type !== '0' ? '' : item.highLimit,
              highHighLimit: item.type !== '0' ? '' : item.highHighLimit,
              highLimitF: item.type === '0' ? '' : item.highLimit,
              highLimitS: item.type === '0' ? '' : item.highHighLimit,
              status: item.status === '0',
              type: item.type,
              meterOptions: []
            })
          })
          if (this.allMeterOptions.length <= this.panelForm.panel.length) {
            this.addVisible = false
          }
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => {
        console.log(err)
        this.isDisabled = false
        this.$message.error('未知异常，请联系管理员')
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
    // 增加仪表
    addClasses () {
      this.panelForm.panel.unshift({
        businessId: this.dataForm.businessId,
        businessType: '1',
        code: '',
        range: '',
        minRange: '',
        maxRange: '',
        lowerLimit: '',
        lowerLowerLimit: '',
        highLimit: '',
        highHighLimit: '',
        highLimitF: '',
        highLimitS: '',
        status: true,
        type: ''
      })
      if (this.allMeterOptions.length <= this.panelForm.panel.length) {
        this.addVisible = false
      }
    },
    // 删除仪表
    removeClasses (item) {
      let index = this.panelForm.panel.indexOf(item)
      if (index !== -1) {
        this.panelForm.panel.splice(index, 1)
      }
      if (this.allMeterOptions.length > this.panelForm.panel.length) {
        this.addVisible = true
      }
    },
    // 选择仪表
    selectMeter (val) {
      val.lowerLimit = ''
      val.lowerLowerLimit = ''
      val.highLimit = ''
      val.highHighLimit = ''
      val.highLimitF = ''
      val.highLimitS = ''
      this.meterOptions.map(item => {
        if (item.code === val.code) {
          val.type = item.type
          val.range = item.range
          val.minRange = item.minRange
          val.maxRange = item.maxRange
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      let flag = true
      this.$refs.panelForm.validate(valid => {
        if (!valid) {
          flag = false
        }
      })
      if (flag) {
        let arr = []
        this.panelForm.panel.map(value => {
          arr.push({
            businessId: value.businessId,
            businessType: value.businessType,
            code: value.code,
            status: value.status ? 0 : 1,
            highLimit: value.type !== '0' ? value.highLimitF : value.highLimit,
            highHighLimit: value.type !== '0' ? value.highLimitS : value.highHighLimit,
            lowerLimit: value.lowerLimit,
            lowerLowerLimit: value.lowerLowerLimit
          })
        })
        parameterAddBatch({
          businessId: this.businessIds,
          parameterList: arr
        }).then(({ data }) => {
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
        })
      }
    }
  }
}
</script>
<style lang="scss">
.storage-params-edit {
  .el-dialog__body {
    padding: 17px 20px;
  }
  .el-form-item__content {
    line-height: 29px;
  }
  .configParamStyle {
    padding: 0;
    .headerInfo {
      font-size: 15px;
    }
    .basic {
      line-height: 1.8;
      .basic-name {
        color: rgba(34, 34, 34, 0.7);
        font-size: 12px;
        text-align: right;
      }
      .basic-value {
        color: #222222;
        font-size: 12px;
      }
      .dangerContributter {
        // // background-color: #e63031;
        background-color: #262d38;
        color: #fff;
        padding: 3px;
      }
    }
    // span {
    //   background-color: #262d38;
    //   color: #fff;
    // }
    .dashStyle {
      width: 100%;
      height: 1px;
      border: 1px dashed #ccc;
    }

    .configStyle {
      position: relative;
      width: 100%;
      padding: 20px 20px;
      background: #f8fafc;
      margin: 0 auto;
      margin-bottom: 15px;
      cursor: pointer;
      &:hover {
        box-shadow: 1px 1px 10px 0px #ccc;
      }
    }
  }
  // 新的样式
  .el-form {
    padding: 0;
    .configStyle {
      position: relative;
      width: 100%;
      background: #f8fafc;
      padding: 15px;
      padding-top: 25px;
      cursor: pointer;
      transition: ease 10;
      .add-child,
      .del-child {
        color: #2c78bb;
        cursor: pointer;
        line-height: 28px;
        font-size: 15px;
        vertical-align: middle;
      }
      .del-child {
        position: absolute;
        top: -1px;
        right: 6px;
        color: red;
      }
      &:hover {
        box-shadow: 1px 1px 10px 0px #ccc;
      }
      .el-form-item .first-second .is-required .el-form-item--medium {
        .el-form-item__label {
          position: absolute;
          left: -10px;
        }
      }
    }
    .configStyle + .configStyle {
      margin-top: 15px;
    }
    .el-select.el-select--medium {
      width: 100%;
    }
  }
}
</style>
