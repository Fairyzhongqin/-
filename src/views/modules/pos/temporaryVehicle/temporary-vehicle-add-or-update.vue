<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '临时车辆'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="600px"
             class="personType-dialog">
    <div>
      <el-form :model="dataForm"
               :rules="dataRule"
               ref="dataForm"
               @keyup.enter.native="dataFormSubmit()"
               label-width="120px">
        <el-form-item label="车牌号"
                      prop="type">
          <el-input v-model="dataForm.numberPlates"
                    placeholder="车牌号"
                    maxlength="20"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="驾驶员信息"
                      prop="numberPlates">
          <el-input v-model="dataForm.numberPlates"
                    placeholder="驾驶员信息"
                    maxlength="20"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="联系方式"
                      prop="vehicleType">
          <el-input v-model="dataForm.vehicleType"
                    placeholder="联系方式"
                    maxlength="20"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="车型"
                      prop="driverId">
          <el-input v-model="dataForm.driverId"
                    placeholder="车型"
                    maxlength="20"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="到期时间"
                      prop="driverId">
          <el-date-picker v-model="datePick"
                          type="datetime"
                          placeholder="选择到期时间"></el-date-picker>
        </el-form-item>
      </el-form>
    </div>
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
// import { vehicleAddOrUpdate, vehicleInfo } from '@/api/pos/vehicle'
export default {
  data () {
    return {
      visible: false,
      isDisabled: false,
      dataForm: {
        id: '',
        numberPlates: '',
        vehicleType: '',
        type: '0',
        driverId: '',
        supercargoId: '',
        maturityTime: ''
      },
      datePick: '',
      dataRule: {
        numberPlates: [{ required: true, message: '车牌号不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '车辆类型不能为空', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 新增单个字段
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.isDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.isDisabled = true
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.isDisabled = true
        }
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
      right: 10px;
      top: 0;
      line-height: 36px;
      font-size: 26px;
      color: #f56c6c;
    }
  }
}
</style>
