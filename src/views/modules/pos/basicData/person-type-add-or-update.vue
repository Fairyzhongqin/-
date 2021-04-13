<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '人员类型'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="600px"
             class="personType-dialog"
             v-dialogDrag>
    <div>
      <div style="height: 360px;"
           v-if="dataForm.id === '1' ? dataForm2.fieldList.length>0 : dataForm2.fieldList.length>1">
        <el-scrollbar style="height:100%"
                      class="default-scrollbar"
                      wrap-class="default-scrollbar__wrap"
                      view-class="p20-scrollbar__view">
          <el-form :model="dataForm"
                   :rules="dataRule"
                   ref="dataForm"
                   @keyup.enter.native="dataFormSubmit()"
                   label-width="120px">
            <el-form-item label="人员类型"
                          prop="cgformName">
              <el-input v-model="dataForm.cgformName"
                        size="mini"
                        class="size-mini-pople-input"
                        :disabled="dataForm.id === '0' || dataForm.id === '1'"
                        placeholder="人员类型"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item>

            <el-form-item label="字段1"
                          prop="name">
              <el-input :disabled="true"
                        size="mini"
                        class="size-mini-pople-input"
                        v-model="dataForm.name"
                        placeholder="字段1"></el-input>
            </el-form-item>
            <el-form-item label="字段2"
                          prop="sex">
              <el-input :disabled="true"
                        v-model="dataForm.sex"
                        size="mini"
                        class="size-mini-pople-input"
                        placeholder="字段2"></el-input>
            </el-form-item>
            <el-form-item label="字段3"
                          prop="sn">
              <el-input :disabled="true"
                        v-model="dataForm.sn"
                        size="mini"
                        class="size-mini-pople-input"
                        placeholder="字段3"></el-input>
            </el-form-item>
            <el-form-item v-if="dataForm.id === '1'"
                          label="字段4"
                          prop="maturityTime">
              <el-input :disabled="true"
                        v-model="dataForm.maturityTime"
                        placeholder="字段4"></el-input>
            </el-form-item>
            <el-form-item label="人员图标"
                          prop="iconName">
              <el-popover ref="iconListPopover"
                          placement="bottom-start"
                          trigger="click"
                          popper-class="mod-menu__icon-popover">
                <div class="mod-menu__icon-inner">
                  <div class="mod-menu__icon-list">

                    <el-button v-for="(item, index) in $store.state.common.personTypeIcon"
                               :key="index"
                               @click="personIcon(item)">
                      <img :src="item.value"
                           alt="#"
                           class="mapPersonTypeimg">
                    </el-button>
                  </div>
                </div>
              </el-popover>
              <el-input v-model="dataForm2.iconName"
                        v-popover:iconListPopover
                        :readonly="true"
                        size="mini"
                        class="size-mini-pople-input icon-list__input"
                        placeholder="人员图标名称"></el-input>
            </el-form-item>
          </el-form>
          <el-form :model="dataForm2"
                   ref="dataForm2"
                   label-width="120px">
            <el-form-item v-for="(item,index) in dataForm2.fieldList"
                          :key="index"
                          :label="dataForm.id === '1'?'字段'+(index+5):'字段'+(index+4)"
                          :prop="'fieldList.' + index + '.attributeName'"
                          :rules="moreRules.attributeName"
                          class="field-item">
              <el-input v-model="item.attributeName"
                        size="mini"
                        class="size-mini-pople-input"
                        :placeholder="dataForm.id === '1'?'字段'+(index+5):'字段'+(index+4)"
                        maxlength="20"
                        clearable />
              <el-tooltip class="field-item-del"
                          effect="dark"
                          content="删除"
                          placement="right">
                <i class="el-icon-delete"
                   @click="delFieldHandle(index)"></i>
              </el-tooltip>
              <el-row>
                <el-checkbox v-model="item.labelType">在标签列表中展示</el-checkbox>
                <el-checkbox v-model="item.alertType">在报警列表中展示</el-checkbox>
              </el-row>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
      <template v-else>
        <el-form :model="dataForm"
                 :rules="dataRule"
                 ref="dataForm"
                 @keyup.enter.native="dataFormSubmit()"
                 label-width="120px">
          <el-form-item label="人员类型"
                        prop="cgformName">
            <el-input v-model="dataForm.cgformName"
                      :disabled="dataForm.id === '0' || dataForm.id === '1'"
                      placeholder="人员类型"
                      maxlength="20"
                      size="mini"
                      class="size-mini-pople-input"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="字段1"
                        prop="name">
            <el-input :disabled="true"
                      v-model="dataForm.name"
                      size="mini"
                      class="size-mini-pople-input"
                      placeholder="字段1"></el-input>
          </el-form-item>
          <el-form-item label="字段2"
                        prop="sex">
            <el-input :disabled="true"
                      v-model="dataForm.sex"
                      size="mini"
                      class="size-mini-pople-input"
                      placeholder="字段2"></el-input>
          </el-form-item>
          <el-form-item label="字段3"
                        prop="sn">
            <el-input :disabled="true"
                      v-model="dataForm.sn"
                      size="mini"
                      class="size-mini-pople-input"
                      placeholder="字段3"></el-input>
          </el-form-item>
          <el-form-item v-if="dataForm.id === '713273002'"
                        label="字段4"
                        prop="maturityTime">
            <el-input :disabled="true"
                      size="mini"
                      class="size-mini-pople-input"
                      v-model="dataForm.maturityTime"
                      placeholder="字段4"></el-input>
          </el-form-item>
        </el-form>
        <el-form :model="dataForm2"
                 ref="dataForm2"
                 :rules="dataFormTwo"
                 label-width="120px">
          <el-form-item label="人员图标"
                        prop="iconName">
            <el-popover ref="iconListPopover"
                        placement="bottom-start"
                        trigger="click"
                        popper-class="mod-menu__icon-popover">

              <div class="mod-menu__icon-inner">
                <div class="mod-menu__icon-list">

                  <el-button v-for="(item, index) in $store.state.common.personTypeIcon"
                             :key="index"
                             @click="personIcon(item)">
                    <img :src="item.value"
                         alt="#"
                         class="mapPersonTypeimg">
                  </el-button>
                </div>
              </div>
            </el-popover>
            <el-input v-model="dataForm2.iconName"
                      v-popover:iconListPopover
                      :readonly="true"
                      placeholder="人员图标名称"
                      size="mini"
                      class="size-mini-pople-input icon-list__input"></el-input>
          </el-form-item>
          <el-form-item v-for="(item,index) in dataForm2.fieldList"
                        :key="index"
                        :label="dataForm.id === '1'?'字段'+(index+5):'字段'+(index+4)"
                        :prop="'fieldList.' + index + '.attributeName'"
                        :rules="moreRules.attributeName"
                        class="field-item">
            <el-input v-model="item.attributeName"
                      size="mini"
                      class="size-mini-pople-input"
                      :placeholder="dataForm.id === '1'?'字段'+(index+5):'字段'+(index+4)"
                      maxlength="20"
                      clearable />
            <el-tooltip class="field-item-del"
                        effect="dark"
                        content="删除"
                        placement="right">
              <i class="el-icon-delete"
                 @click="delFieldHandle(index)"></i>
            </el-tooltip>
            <el-row>
              <el-checkbox v-model="item.labelType">在标签列表中展示</el-checkbox>
              <el-checkbox v-model="item.alertType">在报警列表中展示</el-checkbox>
            </el-row>
          </el-form-item>
        </el-form>
      </template>
      <el-form label-width="120px">
        <el-form-item>
          <el-button type="primary"
                     size="medium"
                     @click="addFieldHandle">新增字段</el-button>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-row>
        <!-- <el-col :span="6">
          <el-button type="primary"
                     size="medium"
                     @click="addFieldHandle">新增字段</el-button>
        </el-col>
        <el-col :span="18"> -->
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary"
                   :disabled="isDisabled"
                   @click="dataFormSubmit()">确定</el-button>
        <!-- </el-col> -->
      </el-row>

    </span>
  </el-dialog>
</template>

<script>
import { personTypeAddOrUpdate, personTypeInfo } from '@/api/pos/person'
export default {
  data () {
    const validateAttributeName = (rule, value, callback) => {
      let isIdentical = false
      let num = 0
      this.dataForm2.fieldList.map(value1 => {
        if (value === value1.attributeName) num++
        if (num > 1) isIdentical = true
      })
      if (isIdentical || value === '姓名' || value === '性别' || value === '工号') {
        callback(new Error(`不能添加重复字段：${value}`))
      } else {
        if (this.dataForm.id === '1' && value === '到期时间') {
          callback(new Error(`不能添加重复字段：${value}`))
        }
        callback()
      }
    }
    return {
      dataForm2: {
        iconName: '',
        icon: '',
        fieldList: []
      },
      isDisabled: false,
      visible: false,
      dataForm: {
        id: '',
        cgformName: '', // 人员类型
        name: '姓名',
        sex: '性别',
        sn: '工号/证件号',
        maturityTime: '到期时间',
        icon: '' // 图标名称
      },
      dataRule: {
        cgformName: [
          { required: true, message: '人员类型不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ],
        sn: [
          { required: true, message: 'sn不能为空', trigger: 'blur' }
        ],
        maturityTime: [
          { required: true, message: '到期时间不能为空', trigger: 'blur' }
        ]
      },
      // 新增表单的验证规则
      moreRules: {
        attributeName: [
          { required: true, message: '字段内容不能为空', trigger: 'blur' },
          { validator: validateAttributeName, trigger: 'blur' }
        ]
      },
      dataFormTwo: {
        iconName: [
          { required: true, message: '人员图标不能为空', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 新增单个字段
    addFieldHandle () {
      this.dataForm2.fieldList.push({
        id: '',
        cgformId: this.dataForm.id || '',
        attributeName: '',
        labelType: false, // 是否在标签列表中展示（0：是 1：否）
        alertType: false // 是否在报警列表中展示（0：是 1：否)
      })
    },
    // 删除单个字段
    delFieldHandle (index) {
      this.dataForm2.fieldList.splice(index, 1)
    },
    init (id) {
      this.dataForm.id = id || 0
      this.isDisabled = false
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.$refs['dataForm2'].resetFields()
        this.dataForm2.iconName = ''
        this.dataForm2.icon = ''
        this.dataForm2.fieldList = []
        if (this.dataForm.id) {
          this.isDisabled = true
          personTypeInfo({
            'id': this.dataForm.id || undefined
          }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm.cgformName = data.data.cgformName
              data.data.wisdomPersonCgformEntities.map(value => {
                this.dataForm2.fieldList.push({
                  id: value.id || '',
                  cgformId: value.cgformId || '',
                  attributeName: value.attributeName || '',
                  labelType: value.labelType === '0', // 是否在标签列表中展示（0：是 1：否）
                  alertType: value.alertType === '0', // 是否在报警列表中展示（0：是 1：否)
                  columnName: value.columnName || ''
                })
              })
              if (data.data.icon != null) {
                this.dataForm2.icon = data.data.icon
                this.dataForm2.iconName = this.$store.state.common.personTypeIcon[this.dataForm2.icon].name
              }
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
    personIcon (item) {
      this.dataForm2.iconName = item.name
      this.dataForm2.icon = item.icon
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        this.$refs['dataForm2'].validate((valid2) => {
          if (valid && valid2) {
            this.isDisabled = true
            // （0：是 1：否）
            let fieldList = []
            this.dataForm2.fieldList.map(value => {
              fieldList.push({
                id: value.id,
                cgformId: value.cgformId,
                attributeName: value.attributeName,
                columnName: value.columnName || '',
                labelType: value.labelType ? '0' : '1', // 是否在标签列表中展示（0：是 1：否）
                alertType: value.alertType ? '0' : '1' // 是否在报警列表中展示（0：是 1：否)
              })
            })
            personTypeAddOrUpdate({
              'cgformId': this.dataForm.id || '',
              'cgformName': this.dataForm.cgformName,
              'wisdomPersonCgformEntities': fieldList,
              'icon': this.dataForm2.icon
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
            }).catch((err) => {
              console.log(err)
              this.isDisabled = false
              this.$message.error('未知异常！请联系管理员')
            })
          }
        })
      })
    }
  }
}
</script>
<style lang="scss">
.personType-dialog {
  .field-item {
    .el-form-item__content {
      padding-right: 50px;
      position: relative;
    }
    &-del {
      position: absolute;
      right: 20px;
      top: -5px;
      line-height: 36px;
      font-size: 26px;
      color: #f56c6c;
    }
  }
  .el-icon-delete {
    cursor: pointer;
    font-size: 20px;
  }
}
</style>
<style lang="scss" scope>
.mapPersonTypeimg {
  width: 30px;
  height: 30px;
}
.el-scrollbar__wrap {
  overflow-y: scroll;
  height: 100%;
}
</style>
