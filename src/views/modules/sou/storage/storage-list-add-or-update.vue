<template>
  <el-dialog title="配置仪表" :close-on-click-modal="false" :visible.sync="visible" @close="$emit('close')" width="700px" class="tank-edit-dialog">
    <div>
      <!-- 基本信息 -->
      <p class="header-info" style="margin-top:0;">基本信息</p>
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
            <span>设施类型</span>
          </el-col>
          <el-col :span="12" class="basic-value">
            <span v-if="dataForm.tankTypeName">{{dataForm.tankTypeName}}</span>
            <span>暂无记录</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5" class="basic-name">
            <span>类型补充说明</span>
          </el-col>
          <el-col :span="12" class="basic-value">
            <span v-if="dataForm.content">{{dataForm.content}}</span>
            <span v-else>暂无记录</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5" class="basic-name">
            <span>监测预警参数</span>
          </el-col>
          <el-col :span="12" class="basic-value monitor-params">
            <pre v-if="dataForm.monitoringParam">{{dataForm.monitoringParam}}</pre>
            <span v-else>
              暂无记录
            </span>
          </el-col>
        </el-row>
      </div>
      <el-divider></el-divider>
      <!-- 仪表信息： -->
      <p class="header-info" style="margin-top:0;">仪表信息：
        <el-tooltip class="add-child" effect="dark" content="新增" placement="right">
          <i class="el-icon-circle-plus-outline" @click="addClasses">
          </i>
        </el-tooltip>
      </p>
      <el-form :model="panelForm" ref="panelForm" label-width="100px">
        <div class="configStyle" v-for="(item,index) of panelForm.panel" :key="index">
          <el-tooltip class="del-child" effect="dark" content="删除" placement="right">
            <i class="el-icon-close" @click="removeClasses(item)"></i>
          </el-tooltip>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :prop="'panel.' + index + '.code'" :rules="panelRules.code" label="仪表位号">
                <el-input v-model="item.code" size="mini" maxlength="10" placeholder="请输入仪表位号" clearable>

                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">

              <el-form-item :prop="'panel.' + index + '.describe'" :rules="panelRules.describe" label="仪表描述">
                <el-input v-model="item.describe" size="mini" maxlength="20" placeholder="请输入仪表描述" clearable>

                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :prop="'panel.' + index + '.type'" :rules="panelRules.type" label="仪表类型">
                <el-select v-model="item.type" size="mini" clearable>
                  <el-option v-for="item in panelTypeList" :key="item.label" :value="item.label" :label="item.value">

                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :prop="'panel.' + index + '.unit'" :rules="panelRules.unit" label="单位符号">
                <el-input v-model="item.unit" size="mini" maxlength="10" placeholder="请输入单位符号" clearable>

                </el-input>
              </el-form-item>
            </el-col>

          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :prop="'panel.' + index + '.minRange'" :rules="panelRules.minRange" label="量程下限">
                <el-input v-model="item.minRange" size="mini" maxlength="10" type="number" placeholder="请输入量程下限" clearable>

                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :prop="'panel.' + index + '.maxRange'" :rules="panelRules.maxRange" label="量程上限">
                <el-input v-model="item.maxRange" size="mini" type="number" maxlength="10" placeholder="请输入量程上限" clearable>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>

    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { addPanel, tankInfo, panelInfo } from '@/api/sou/equlpment'
import { getLabels } from '@/api/common/sys'
export default {
  data () {
    let validateCode = (rule, value, callback) => {
      if (/^[\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error('编号格式错误'))
      } else {
        callback()
      }
    }
    let validateNum = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      if (parseInt(this.panelForm.panel[index].maxRange) < parseInt(this.panelForm.panel[index].minRange)) {
        callback(new Error('上限必须大于下限'))
      } else {
        callback()
      }
    }
    return {
      businessIds: '',
      panelForm: {
        panel: [] // 仪表信息
      },
      panelTypeList: [],
      visible: false,
      isDisabled: false,
      dataForm: {
        id: '',
        code: '',
        name: ''
      },
      panelRules: {
        code: [{ required: true, message: '请输入仪表位号', trigger: 'blur' },
        { required: true, validator: validateCode, trigger: 'blur' }],
        type: [{ required: true, message: '请输入类型', trigger: 'change' }],
        // describe: [{ required: true, message: '请输入描述信息', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        maxRange: [{ required: true, validator: validateNum, trigger: 'blur' }, {
          required: true, message: '请输入量程上限', trigger: 'blur'
        }],
        minRange: [{ required: true, validator: validateNum, trigger: 'blur' }, {
          required: true, message: '请输入量程下限', trigger: 'blur'
        }],
        status: [{ required: true, message: '请输入启用状态', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getPanelType()
  },
  methods: {
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
    // 初始化
    init (info) {
      this.dataForm.id = info.id || 0
      this.dataForm.name = info.name
      this.dataForm.tankTypeName = info.tankTypeName
      this.dataForm.content = info.content
      this.dataForm.monitoringParam = info.monitoringParam
      this.businessIds = info.id
      this.visible = true
      this.isDisabled = false
      this.$nextTick(() => {
        // this.$refs['dataForm'].resetFields()
        this.$refs['panelForm'].resetFields()
        console.log(this.panelForm)

        this.panelForm.panel = []
        console.log(this.panelForm.panel)

        if (this.dataForm.id) {
          this.isDisabled = true
          tankInfo({
            'id': this.dataForm.id || undefined
          }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm = data.data
            } else {
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.isDisabled = false
            this.$message.error('未知异常！请联系管理员')
          })
          panelInfo({
            id: this.dataForm.id || undefined
          }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.panelForm.panel = data.list
              console.log(data.list)
            } else {
              this.$message.error(data.msg)
            }
          }).catch(err => {
            console.log(err)
            this.isDisabled = false
            this.$message.error('未知异常！请联系管理员')
          })
        }
      })
    },
    // 增加仪表
    addClasses () {
      this.panelForm.panel.unshift({
        businessId: this.businessIds,
        businessType: '1',
        code: '',
        describe: '',
        unit: '',
        maxRange: '',
        minRange: '',
        status: '1',
        type: ''
      })
    },
    // 删除仪表
    removeClasses (item) {
      var index = this.panelForm.panel.indexOf(item)
      if (index !== -1) {
        this.panelForm.panel.splice(index, 1)
      }
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
        addPanel({
          businessId: this.businessIds,
          meterList: this.panelForm.panel
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('操作成功')
            this.$emit('refreshDataList')
            this.visible = false
            this.isDisabled = false
          } else {
            this.$message.error(data.msg)
          }
        })

        this.addOrUpdateVisible = false
      }
    }
  }
}
</script>
<style lang="scss">
.tank-edit-dialog {
  .el-dialog__body {
    padding: 17px 20px;
  }
  .basic {
    line-height: 1.8;
    .basic-name {
      color: rgba(34, 34, 34, 0.7);
      font-size: 12px;
      text-align: right;
    }
    .basic-value {
      color: rgba(34, 34, 34, 1);
      font-size: 12px;
    }
    .monitor-params {
      // background-color: #e63031;
      background-color: #262d38;
      color: #fff;
    }
  }
  .header-info {
    font-size: 14px;
  }
  pre {
    margin: 0;
  }
  .el-select {
    width: 100%;
  }

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
    }
    .configStyle + .configStyle {
      margin-top: 15px;
    }
  }
}
</style>
