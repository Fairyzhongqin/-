<template>
  <el-dialog :title="(!dataForm.id ? '新增' :'修改') + '设备类型'"
             :close-on-click-modal="false"
             width="600px"
             :visible.sync="visible"
             class="safeClass">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item label="类型名称"
                    prop="name">
        <el-input size="mini"
                  maxlength="30"
                  class="size-mini-pople-input"
                  v-model="dataForm.name"
                  placeholder="类型名称"
                  clearable></el-input>
      </el-form-item>
<!--      <el-form-item label="类型编号"-->
<!--                    prop="code">-->
<!--        <el-input v-model="dataForm.code"-->
<!--                  placeholder="类型编号"-->
<!--                  maxlength="20"-->
<!--                  size="mini"-->
<!--                  class="size-mini-pople-input"-->
<!--                  clearable></el-input>-->
<!--      </el-form-item>-->

      <el-form-item label="型号"
                    prop="model">
        <el-input size="mini"
                  maxlength="20"
                  class="size-mini-pople-input"
                  v-model="dataForm.model"
                  placeholder="型号"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="适用范围"
                    prop="scopeApplication">
        <el-input maxlength="60"
                  size="mini"
                  class="size-mini-pople-input"
                  v-model="dataForm.scopeApplication"
                  placeholder="适用范围"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="规格"
                    prop="specifications">
        <el-input size="mini"
                  maxlength="20"
                  class="size-mini-pople-input"
                  v-model="dataForm.specifications"
                  placeholder="规格"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="设备类型"
                    prop="type">
        <el-select v-model="dataForm.type">
          <el-option v-for="item in codeType"
                     :key="item.sort"
                     :label="item.value"
                     :value="item.sort"
                     size="mini"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 :disabled="isDisabled"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { typeOfEquipment, safeTYpeInfo, safeTypeAdd } from '@/api/sou/safeEqument'
import { getLabels } from '@/api/common/sys'

export default {
  data () {
    let validateCode = (rule, value, callback) => {
      if (!/^[0-9a-zA-Z_]{1,}$/.test(value)) {
        callback(new Error('编号格式错误'))
      } else {
        callback()
      }
    }
    let validateModel = (rule, value, callback) => {
      if (!/^[0-9a-zA-Z_]{1,}$/.test(value)) {
        callback(new Error('型号格式错误'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      codeType: [], // 字典表码值
      typeList: [], // 设备类型
      loading: false,
      isDisabled: false,
      dataForm: {
        code: '',
        name: '',
        model: '',
        scopeApplication: '',
        specifications: '',
        type: ''
      },
      dataRule: {
        code: [{ required: true, validator: validateCode, trigger: 'blur' }],
        name: [
          { required: true, message: '类型名称不能为空', trigger: 'blur' }
        ],
        model: [
          { required: true, validator: validateModel, trigger: 'blur' }
        ],
        // scopeApplication: [
        //   { required: true, message: '适用范围不能为空', trigger: 'blur' }
        // ],
        specifications: [
          { required: true, message: '规格不能为空', trigger: 'blur' }
        ],
        type: [{
          required: true, message: '设备类型不能为空', trigger: 'change'
        }]
      }
    }
  },

  methods: {
    // 组合类型编码
    getCodeAndType () {
      // 获取对应码值  getCodeOfType () {
      getLabels({
        type: 'safety_equipment_type'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.codeType = data.list
          console.log('sasas', this.codeType)
        }
      }).then(() => {
        // 获取设备类型
        typeOfEquipment().then(({ data }) => {
          if (data && data.code === 0) {
            this.typeList = data.list
            this.typeList.map(val => {
              this.codeType.map(vals => {
                if (val.type === vals.sort) {
                  val.value = vals.value
                }
              })
            })
            console.log(this.typeList)
          }
        })
      })
    },
    // 新增/修改
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.isDisabled = false

      this.getCodeAndType()

      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()

        if (this.dataForm.id) {
          this.isDisabled = true
          safeTYpeInfo(
            {
              id: this.dataForm.id || undefined
            }
          ).then(({ data }) => {
            this.isDisabled = false

            if (data && data.code === 0) {
              this.dataForm = data.data
              // console.log('data.data=====================', data.data)

              // this.dataForm.id = id
              console.log(data.data)
            } else {

            }
          }).catch((err) => {
            console.log(err)
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          safeTypeAdd(this.dataForm).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.$emit('refreshDataList')
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                }
              })
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
.safeClass {
  .el-select {
    width: 100%;
    /deep/ .el-input--medium .el-input__inner {
      height: 28px;
      line-height: 28px;
    }
    /deep/ .el-input__prefix,
    .el-input__suffix {
      top: 5px;
    }
  }
}
</style>
