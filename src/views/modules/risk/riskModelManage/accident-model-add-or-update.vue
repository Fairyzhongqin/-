<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '事故类型'" :close-on-click-modal="false" class="station-area" width="600px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="110px">

      <el-form-item label='风险类型' prop='factorName'>
        <el-input v-model="dataForm.factorName" placeholder="请输入风险类型" clearable maxlength="20" size="mini"></el-input>
      </el-form-item>

      <el-form-item label='风险描述' prop='factorDescribe'>
        <el-input v-model="dataForm.factorDescribe" type="textarea" :autosize="{ minRows: 2}" placeholder="请输入风险描述" clearable maxlength="150" size="mini"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { factorAddOrUpdate, factorInfo } from '@/api/risk/factor'

export default {
  data () {
    return {
      dataForm: {
        factorName: '',
        factorDescribe: ''
      },
      isDisabled: false,
      disabled: false,
      visible: false,
      dataRule: {
        factorName: [{ required: true, message: '请输入事故名称', trigger: 'blur' }],
        factorDescribe: [{ required: true, message: '请输入事故描述', trigger: 'blur' }]

      }
    }
  },
  created () {

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
        if (id) {
          this.isDisabled = true
          factorInfo({ id: id }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm = data.data
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

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          factorAddOrUpdate(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.$emit('refreshDataList')
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
.station-area {
  .time {
    margin-right: 10px;
  }
  .el-row {
    margin-left: -60.5px;
  }
}
</style>


