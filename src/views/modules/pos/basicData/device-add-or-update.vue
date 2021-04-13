<!--新增胸卡设备-->
<template>
  <el-dialog :title="'新增设备'"
             :close-on-click-modal="false"
             width="600px"
             class="dialog-all"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item label="设备编号SN"
                    prop="deveui">
        <el-input v-model="dataForm.deveui"
                  size="mini"
                  class="size-mini-pople-input"
                  placeholder="设备编号SN"
                  maxlength="30"
                  clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { deveuiAddDev } from '@/api/pos/device'

export default {
  data () {
    return {
      visible: false,
      dataForm: {
        deveui: ''
      },
      dataRule: {
        deveui: [
          { required: true, message: '设备编号SN不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init () {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          deveuiAddDev({
            'deveui': this.dataForm.deveui
          }).then(({ data }) => {
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
