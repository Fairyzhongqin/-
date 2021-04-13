<template>
  <el-dialog :title="'新增设备'"
             :close-on-click-modal="false"
             width="600px"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item label="设备编号SN"
                    prop="deveui">
        <el-input v-model="dataForm.deveui"
                  placeholder="设备编号SN"
                  size="mini"
                  class="size-mini-pople-input"
                  maxlength="30"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="X轴"
                    prop="positionX">
        <el-input type="number"
                  size="mini"
                  class="size-mini-pople-input"
                  v-model="dataForm.positionX"
                  placeholder="X轴"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="Y轴"
                    prop="positionY">
        <el-input type="number"
                  size="mini"
                  class="size-mini-pople-input"
                  v-model="dataForm.positionY"
                  placeholder="Y轴"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="Z轴"
                    prop="positionZ">
        <el-input type="number"
                  size="mini"
                  class="size-mini-pople-input"
                  v-model="dataForm.positionZ"
                  placeholder="Z轴"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="buildId"
                    prop="buildId">
        <el-input size="mini"
                  class="size-mini-pople-input"
                  v-model="dataForm.buildId"
                  placeholder="该基站所属的楼房buildId,如cqhgc_110A_f01"
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
import { addBaseStation } from '@/api/pos/device'

export default {
  data () {
    return {
      visible: false,
      dataForm: {
        deveui: '',
        positionX: '',
        positionY: '',
        positionZ: '',
        buildId: ''
      },
      dataRule: {
        deveui: [
          { required: true, message: '设备编号SN不能为空', trigger: 'blur' }
        ],
        positionX: [
          { required: true, message: 'X轴不能为空', trigger: 'blur' }
        ],
        positionY: [
          { required: true, message: 'Y轴不能为空', trigger: 'blur' }
        ],
        positionZ: [
          { required: true, message: 'Z轴不能为空', trigger: 'blur' }
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
          addBaseStation(this.dataForm).then(({ data }) => {
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
