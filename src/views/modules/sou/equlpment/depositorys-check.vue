<template>
  <el-dialog title="查看仓库"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="50%"
             class="depositoryEdit-dialog">
    <div>
      <el-row>
        <el-col :span="24">
          <!-- 添加内容位置 -->
          <el-form :model="dataForm"
                   :rules="dataRule"
                   ref="dataForm"
                   class="pr20"
                   @keyup.enter.native="dataFormSubmit()"
                   label-width="120px">
            <el-form-item label="库区名称"
                          prop="reId"
                          required>
              <el-select v-model="dataForm.reId"
                         size="mini"
                         placeholder="请选择库区">

                <el-option v-for="item in reservorId"
                           :key='item.id'
                           :label='item.name'
                           :value="item.id">

                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="仓库编号"
                          prop="code">
              <el-input v-model="dataForm.code"
                        placeholder="仓库编号"
                        size="mini"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="仓库名称"
                          prop="name">
              <el-input v-model="dataForm.name"
                        placeholder="仓库名称"
                        size="mini"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item>

            <el-form-item label="仓库容量/m³"
                          prop="capacity">
              <el-input v-model="dataForm.capacity"
                        placeholder="仓库容量m³"
                        size="mini"
                        maxlength="10"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="地理位置坐标"
                          prop="location">
              <el-input v-model="dataForm.location"
                        placeholder="地理位置坐标"
                        size="mini"
                        maxlength="1000"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="备注"
                          prop="remarks">
              <el-input v-model="dataForm.remarks"
                        placeholder="备注"
                        maxlength="60"
                        size="mini"
                        clearable></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary"
                 :disabled="isDisabled"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  // import { repositoryAdd, repositoryInfo, reservorId } from '@/api/sou/equlpment'
  import { reservorId } from '@/api/sou/equlpment'
  export default {
    data () {
      let validateCode = (rule, value, callback) => {
        if (!/^[0-9a-zA-Z_]{1,}$/.test(value)) {
          callback(new Error('编号格式错误'))
        } else {
          callback()
        }
      }
      let validateCapacity = (rule, value, callback) => {
        if (!/^[0-9]\d*$/.test(value)) {
          callback(new Error('容量格式错误'))
        } else {
          callback()
        }
      }
      return {
        visible: false,
        isDisabled: false,
        dataForm: {
          code: '',
          name: '',
          capacity: '',
          location: '',
          remarks: '',
          repositoryField: {
            id: ''
          },
          reId: ''
        },
        dataRule: {
          code: [{ required: true, validator: validateCode, trigger: 'blur' }],
          name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
          reId: [{ required: true, message: '请输入库区名称', trigger: 'change' }],
          capacity: [{ required: true, validator: validateCapacity, trigger: 'blur' }]
        },
        // 库区id
        reservorId: []
      }
    },
    methods: {
      // 新增/修改
      init (info) {
        this.visible = true
        this.isDisabled = false
        this.dataForm = info
        console.log(info)
        // this.dataForm.reId = info.repositoryField.id
        // this.dataForm = {
        //   code: '',
        //   name: '',
        //   capacity: '',
        //   location: '',
        //   remarks: '',
        //   id: '',
        //   repositoryField: {
        //     id: ''
        //   },
        //   reId: ''
        // }
        this.getReservorId()
      },
      // 查询库区id
      getReservorId () {
        reservorId().then(({ data }) => {
          if (data && data.code === 0) {
            this.reservorId = data.list
            console.log(this.reservorId)
          } else {
            this.reservorId = []
          }
        }).catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.visible = false
      },
      // 表单关闭
      cancel () {
        this.$refs['dataForm'].resetFields()
        this.visible = false
      }
    }
  }
</script>
<style lang="scss">
  .depositoryEdit-dialog {
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
