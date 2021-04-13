<template>
  <el-dialog title="查看反应装置"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="50%"
             class="reactEdit-dialog">
    <div>
      <el-form :model="dataForm"
               :rules="dataRule"
               ref="dataForm"
               class="pr20"
               @keyup.enter.native="dataFormSubmit()"
               label-width="120px">
        <el-form-item label='所属区域'>
          <el-input v-model="dataForm.zoneName"
                    disabled
                    placeholder="所属区域"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="反应装置编号">
          <el-input v-model="dataForm.code"
                    disabled
                    placeholder="反应装置编号"
                    maxlength="20"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="反应装置名称"
                      prop="name">
          <el-input v-model="dataForm.name"
                    disabled
                    placeholder="反应装置名称"
                    maxlength="20"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="备注"
                      prop="remarks">
          <el-input v-model="dataForm.remarks"
                    disabled
                    placeholder="备注"
                    maxlength="60"
                    clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="visible = false">关闭</el-button>
      <!-- <el-button type="primary"
                 :disabled="isDisabled"
                 @click="dataFormSubmit()">确定</el-button>  -->
    </span>
  </el-dialog>
</template>

<script>
import { reactorAdd, reactorInfo } from '@/api/sou/equlpment'
export default {
  data () {
    let validateCode = (rule, value, callback) => {
      if (!/^[0-9a-zA-Z_]{1,}$/.test(value)) {
        callback(new Error('编号格式错误'))
      } else {
        callback()
      }
    }
    return {
      name: '',
      code: '',
      chemical: '',
      technology: '',
      visible: false,
      isDisabled: false,
      dataForm: {
        proId: '', // 生产场所ID
        zoneName: '',
        code: '',
        name: '',
        chemical: '',
        technology: '',
        location: '',
        remarks: '',
        producePlace: {
          id: ''
        }
      },
      dataRule: {
        proId: [{ required: true, message: '请输入生产场所id', trigger: 'change' }],
        code: [{ required: true, validator: validateCode, trigger: 'blur' }],
        zoneName: [{ required: true, message: '请输入装置名称', trigger: 'blur' }]
      },
      produceId: []// 所有生产场所id
    }
  },
  methods: {
    // 新增/修改
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.isDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (this.dataForm.id) {
          this.isDisabled = true
          reactorInfo({
            'id': this.dataForm.id || undefined
          }).then(({ data }) => {
            this.isDisabled = false
            if (data.data && data.code === 0) {
              this.dataForm = data.data
              // this.dataForm.proId = data.data.producePlace.id
            } else if (data.code === 0) {

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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.visible = false
          this.dataForm.producePlace.id = this.dataForm.proId

          reactorAdd(this.dataForm).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message.success('操作成功')
              this.$emit('refreshDataList')
            } else {
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.reactEdit-dialog {
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
  .pr20 {
    padding-right: 20px;
  }
  .el-select {
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
// 下拉框样式
.el-select-dropdown__item {
  padding: 0;
}
.select-right {
  margin-left: 6px;
  width: 24px;
  display: inline-block;
}
.right-img {
  height: 16px;
  width: 16px;
}
.el-icon-check {
  color: #4bd4fb;
}
.el-select-dropdown__item.selected {
  color: #606266;
  font-weight: normal;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
  color: #606266;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
  display: none;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: -webkit-linear-gradient(
    left,
    #7fc2f3,
    #d8e8f6
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    right,
    #7fc2f3,
    #d8e8f6
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    right,
    #7fc2f3,
    #d8e8f6
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #7fc2f3, #d8e8f6); /* 标准的语法 */
}
</style>
