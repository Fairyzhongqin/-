<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '存储设施类型'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="650px"
             class="facilty-dialog">
    <el-row>

      <div>
        <el-form :model="dataForm"
                 :rules="dataRule"
                 ref="dataForm"
                 @keyup.enter.native="dataFormSubmit()"
                 label-width="80px">
          <el-form-item label="类型名称"
                        prop="name">
            <el-input v-model="dataForm.name"
                      placeholder="类型名称"
                      maxlength="20"
                      clearable></el-input>
          </el-form-item>

          <el-form-item label="类型补充说明"
                        prop="content">
            <el-input v-model="dataForm.content"
                      placeholder="类型补充说明"
                      clearable></el-input>
          </el-form-item>

          <el-form-item label="监测预警参数"
                        prop="monitoringParam">
            <el-input v-model="dataForm.monitoringParam"
                      type="textarea"
                      autosize
                      placeholder="监测预警参数"
                      clearable></el-input>
          </el-form-item>

          <el-form-item label="备注"
                        prop="remarks">
            <el-input v-model="dataForm.remarks"
                      type="textarea"
                      autosize
                      placeholder="备注"
                      maxlength="600"
                      clearable></el-input>
          </el-form-item>
        </el-form>
      </div>

    </el-row>

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
import { numberTwo } from '@/utils/validate'
import { storageTypeInfo, storageTypeAdd } from '@/api/risk/dangerStorageManage'
// import ThreeMap from '@/components/ThreeMap/index'
export default {
  components: {
    // ThreeMap
  },
  data () {
    var validateNumber = (rule, value, callback) => {
      if (!numberTwo(value)) {
        callback(new Error('请输入0~2位数字'))
      } else {
        callback()
      }
    }
    var minNumber = (rule, value, callback) => {
      if (this.dataForm.maxHeight !== '') {
        if (Number(value) > Number(this.dataForm.maxHeight)) {
          callback(new Error('最小高度不能大于最大高度'))
        } else {
          callback()
        }
      }
    }
    var maxNumber = (rule, value, callback) => {
      if (this.dataForm.minHeight !== '') {
        if (Number(value) < Number(this.dataForm.minHeight)) {
          callback(new Error('最大高度不能小于最大高度'))
        } else {
          callback()
        }
      }
    }
    return {
      visible: false,
      isDisabled: false,
      dataForm: {
        id: '',
        name: '',
        content: '',
        monitoringParam: '',
        remarks: ''
      },
      dataRule: {
        fencingName: [
          { required: true, message: '人员类型不能为空', trigger: 'blur' }
        ],
        coordinate: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        floor: [
          { required: true, message: '围栏高度不能为空', trigger: 'blur' },
          { validator: validateNumber, trigger: 'blur' }
        ],
        type: [
          { required: true, message: '围栏类型不能为空', trigger: 'change' }
        ],
        perpetualFlag: [
          { required: true, message: '围栏时效不能为空', trigger: 'change' }
        ],
        minHeight: [
          { required: true, message: '围栏最小高度不能为空', trigger: 'blur' },
          { validator: minNumber, trigger: 'blur' }
        ],
        maxHeight: [
          { required: true, message: '围栏最大高度不能为空', trigger: 'blur' },
          { validator: maxNumber, trigger: 'blur' }
        ]
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
          storageTypeInfo({
            'id': this.dataForm.id || undefined
          }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              // console.log('==========info========', data)
              this.dataForm = data.data
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
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isDisabled = true
          storageTypeAdd(
            this.dataForm
          ).then(({ data }) => {
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
    }
  }
}
</script>
<style lang="scss">
.facilty-dialog {
  // .field-item {
  //   .el-form-item__content {
  //     padding-right: 50px;
  //     position: relative;
  //   }
  //   &-del {
  //     position: absolute;
  //     right: 10px;
  //     top: 0;
  //     line-height: 36px;
  //     font-size: 26px;
  //     color: #f56c6c;
  //   }
  // }
}
</style>
