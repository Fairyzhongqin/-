<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '应急物资'" :close-on-click-modal="false" class="emergency-planning-dialog" width="600px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="115px">
      <el-form-item label="物资名称：" prop="suppliesName">
        <el-input v-model="dataForm.suppliesName" size="mini" placeholder="请输入物资名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="物资类型：" prop="suppliesType">
        <el-select v-model="dataForm.suppliesType" size="mini" clearable filterable allow-create>
          <el-option v-for="item in suppliesTypeList" :key="item" :value="item" :label="item">

          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="型号：" prop="model">
        <el-input v-model="dataForm.model" placeholder="请输入型号" size="mini"> clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="规格：" prop="specification">
        <el-input v-model="dataForm.specification" placeholder="请输入规格" size="mini" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="数量：" prop="num">
        <el-input v-model="dataForm.num" size="mini" clearable type="number"></el-input>
      </el-form-item>
      <el-form-item label="单位：" prop="unit">
        <el-input v-model="dataForm.unit" placeholder="请输入单位" size="mini" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="主要用途：" prop="purpose">
        <el-input v-model="dataForm.purpose" placeholder="请输入主要用途" size="mini" type="textarea" clearable>
        </el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="remarks">
        <el-input v-model="dataForm.remarks" placeholder="请输入备注" size="mini" type="textarea" clearable>
        </el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { emergencyMaterialInfo, emergencyAddOrUpdate, supplyType } from '@/api/process/emergencyPlan'
export default {
  components: {
  },
  data () {
    var validNum = (rule, value, callback) => {
      if (!(/(^[1-9]\d*$)/.test(this.dataForm.num))) {
        callback(new Error('必须是正整数'))
      } else if (this.dataForm.num.toString().length > 8) {
        callback(new Error('最大为8位数字'))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        suppliesName: '',
        suppliesType: '',
        specification: '',
        remarks: '',
        unit: '',
        purpose: '',
        num: '',
        model: ''
      },
      suppliesTypeList: [],
      isDisabled: false,
      disabled: false,
      visible: false,
      dataRule: {
        suppliesName: [{ required: true, message: '请输入物资名称', trigger: 'blur' }],
        suppliesType: [{ required: true, message: '请输入物资类型', trigger: 'blur' }],
        num: [{ required: true, validator: validNum, trigger: 'blur' }],
        unit: [{ required: true, message: '请输入物资单位', trigger: 'blur' }],
        purpose: [{ required: true, message: '请输入物资用途', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getEmengercyType()
  },
  methods: {
    // 获取应急物资类型
    getEmengercyType () {
      supplyType().then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)

          this.suppliesTypeList = data.list
        }
      })
    },
    // 页面初始化时加载的事件
    // 初始数据
    init (id) {
      this.isDisabled = false
      this.visible = true
      this.dataForm.id = id || ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (id) {
          this.isDisabled = true
          emergencyMaterialInfo({ id: id }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm = data.data
            } else {
              this.$message.error(data.msg)
              this.isDisabled = false
            }
          }).catch(err => {
            this.isDisabled = false
            console.log(err)
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.isDisabled = true
          emergencyAddOrUpdate(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.isDisabled = true
              console.log(data)
              this.$emit('refreshDataList')
              this.$emit('backSupplyType', this.dataForm.suppliesType)
            } else {
              this.visible = false
              this.isDisabled = true
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            this.visible = false
            this.isDisabled = true
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
.emergency-planning-dialog {
  .el-select {
    width: 100%;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
}
</style>


