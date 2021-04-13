<template>
  <el-dialog title="配置仪表" :close-on-click-modal="false" :visible.sync="visible" width="700px" @close="$emit('close')" class="reactEdit-dialog">
    <div>
      <!-- <div class="trigger"></div> -->
      <el-row>
        <p class="headerInfo">基础信息</p>
      </el-row>
      <div class="basic">
        <el-row :gutter="20">
          <el-col :span="5" style="color:#ccc">装置名称</el-col>
          <el-col :span="6">
            <span v-if="name">{{name}}</span>
            <span v-else>暂无记录</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5" style="color:#ccc">装置编号</el-col>
          <el-col :span="6">
            <span v-if="code">{{code}}</span>
            <span v-else>暂无记录</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5" style="color:#ccc">涉及危险化学品</el-col>
          <el-col :span="12">
            <span v-if="chemical">{{chemical}}</span>
            <span v-else>暂无记录</span>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="5" style="color:#ccc">涉及高危工艺</el-col>
          <el-col :span="12">
            <span v-if="technology">{{technology}}</span>
            <span v-else>暂无记录</span>
          </el-col>
        </el-row>
      </div>
      <div class="line"></div>
      <el-row>
        <p>仪表信息
          <el-tooltip class="add-child" effect="dark" content="新增" placement="right">
            <i class="el-icon-circle-plus-outline" @click="addClasses">
            </i>
          </el-tooltip>
        </p>
      </el-row>
      <el-form :model="dataForm" ref="dataForm" label-width="100px">
        <div v-for="(item,index) of dataForm.panelList" :key="index" class="panelStyle">
          <el-tooltip class="del-child" effect="dark" content="删除" placement="right">
            <i class="el-icon-close" @click="removeClasses(item)"></i>
          </el-tooltip>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :prop="'panelList.' + index + '.code'" :rules="panelRules.code" label="仪表位号">
                <el-input v-model="item.code" size="mini" maxlength="10" placeholder="请输入仪表位号" clearable>

                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :prop="'panelList.' + index + '.describe'" :rules="panelRules.describe" label="仪表描述">
                <el-input v-model="item.describe" size="mini" maxlength="20" placeholder="请输入仪表描述" clearable>

                </el-input>
              </el-form-item>
              <!-- <el-form-item prop="status"
                            label="启用状态">
                <el-tooltip :content="item.status=== '1' ? '启用' :'未启用'"
                            placement="top">
                  <el-switch v-model="item.status"
                             active-color="#13ce66"
                             inactive-color="#DCDFE6"
                             active-value="1"
                             inactive-value="0">
                  </el-switch>
                </el-tooltip>
              </el-form-item> -->
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :prop="'panelList.' + index + '.type'" :rules="panelRules.type" label="仪表类型">
                <el-select v-model="item.type" size="mini" clearable>
                  <el-option v-for="item in panelTypeList" :key="item.label" :value="item.label" :label="item.value">

                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :prop="'panelList.' + index + '.unit'" :rules="panelRules.unit" label="单位符号">
                <el-input v-model="item.unit" size="mini" maxlength="10" placeholder="请输入单位符号" clearable>

                </el-input>
              </el-form-item>
            </el-col>

          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item :prop="'panelList.' + index + '.minRange'" :rules="panelRules.minRange" label="量程下限">
                <el-input v-model="item.minRange" size="mini" maxlength="10" type="number" placeholder="请输入量程下限" clearable>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :prop="'panelList.' + index + '.maxRange'" :rules="panelRules.maxRange" label="量程上限">
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
// eslint-disable-next-line no-unused-vars
import { reactorAdd, reactorInfo, allProduceId, addPanel, panelInfo } from '@/api/sou/equlpment'
import { getLabels } from '@/api/common/sys'

export default {
  data () {
    let validRange = (rule, value, callback) => {
      let index = parseInt(rule.field.split('.')[1])
      if (parseInt(this.dataForm.panelList[index].maxRange) < parseInt(this.dataForm.panelList[index].minRange)) {
        callback(new Error('上限必须大于下限'))
      } else {
        callback()
      }
    }
    return {
      panelTypeList: [],
      businessIds: '',
      name: '',
      code: '',
      chemical: '',
      technology: '',
      visible: false,
      isDisabled: false,
      dataForm: {
        panelList: []
      },

      panelRules: {
        code: [{ required: true, message: '请选择仪表位号', trigger: 'blur' }],
        type: [{ required: true, message: '请输入类型', trigger: 'change' }],
        // describe: [{ required: true, message: '请输入描述信息', trigger: 'blur' }],
        unit: [{ required: true, message: '请输入单位', trigger: 'blur' }],
        maxRange: [{
          required: true, message: '请输入量程上限', trigger: 'blur'
        }, { required: true, validator: validRange, trigger: 'blur' }],
        minRange: [{
          required: true, message: '请输入量程下限', trigger: 'blur'
        }, { required: true, validator: validRange, trigger: 'blur' }]
        // status: [{ required: true, message: '请输入启用状态', trigger: 'blur' }]
      },
      produceId: []// 所有生产场所id
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
    // 新增/修改
    init (info) {
      this.name = info.name
      this.code = info.code
      this.businessIds = info.id
      this.chemical = info.chemical
      this.technology = info.technology
      this.visible = true
      this.isDisabled = false
      this.$nextTick(() => {
        console.info(this.$refs['dataForm'])
        this.$refs['dataForm'].resetFields()
        this.dataForm.panelList = []
        console.log('销毁', this.dataForm)
        if (info.id) {
          this.isDisabled = true
          panelInfo({
            'id': info.id || undefined
          }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm.panelList = data.list
            } else {
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.isDisabled = false
            this.$message.error('未知异常！请联系管理员')
          })
        }
      })
    },
    // 增加仪表
    addClasses () {
      this.dataForm.panelList.unshift({
        businessId: this.businessIds,
        businessType: '0',
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
      var index = this.dataForm.panelList.indexOf(item)
      if (index !== -1) {
        this.dataForm.panelList.splice(index, 1)
      }
    },
    // 获取生产场所id
    getProduceId () {
      allProduceId().then(({ data }) => {
        if (data && data.code === 0) {
          this.produceId = data.list
        } else {
          this.propduceId = []
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 表单提交
    dataFormSubmit () {
      let flag = true
      this.$refs['dataForm'].validate(valid => {
        if (!valid) {
          flag = false
        }
      })

      if (flag) {
        this.visible = false
        this.isDisabled = false
        addPanel({
          businessId: this.businessIds,
          meterList: this.dataForm.panelList
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('操作成功')
          } else {
            this.$message.error(data.msg)
          }
        })
        this.isDisabled = true
        this.addOrUpdateVisible = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.reactEdit-dialog {
  /deep/ .el-dialog__body {
    padding: 17px 20px;
  }

  // /deep/ .el-dialog__headerbtn {
  //   z-index: 999;
  //   .el-icon-close:before {
  //     content: "\E6DB";
  //     color: #fff;
  //   }
  // }
  .basic {
    margin-left: 30px;
    line-height: 1.5;
  }
  .headerInfo {
    font-size: 15px;
  }
  .line {
    margin-top: 10px;
    width: 100%;
    height: 1px;
    background-color: #eeeeee;
  }
  .panelStyle {
    position: relative;
    width: 99%;
    /* height: 212px; */
    background: #f8fafc;
    padding: 0 10px;
    padding-top: 30px;
    padding-bottom: 20px;
    margin: 0 auto;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 3;
  }
  .panelStyle:hover {
    box-shadow: 1px 1px 3px 3px #ccc;
  }
  .el-icon-close {
    position: absolute;
    top: 5px;
    right: 10px;
  }
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
  .trigger {
    position: absolute;
    top: -21px;
    right: -94px;
    width: 0;
    height: 0;
    border-width: 0px 145px 145px;
    border-style: solid;
    border-color: transparent transparent #262d38;
    transform: rotate(45deg);
    // box-shadow: -10px 0px 10px transparent, 0px -10px 10px transparent,
    //   10px 0px 10px transparent, 0px 10px 10px blue;
  }
}
</style>
