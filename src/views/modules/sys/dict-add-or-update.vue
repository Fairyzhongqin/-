<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <!-- @keyup.enter.native="dataFormSubmit()" 回车事件监听-->
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px">
      <el-form-item label="key键" prop="label">
        <el-input v-model="dataForm.label" placeholder="label" maxlength="25"></el-input>
      </el-form-item>
      <el-form-item label="value值" prop="value">
        <el-input v-model="dataForm.value" placeholder="value值" maxlength="25"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-input v-model="dataForm.type" placeholder="类型" maxlength="25"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="dataForm.sort" controls-position="right" :min="0" label="排序"></el-input-number>
      </el-form-item>
      <el-form-item label="描述" prop="remarks">
        <el-input v-model="dataForm.remarks" placeholder="描述" maxlength="166"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        isDisabled: false,
        dataForm: {
          label: '',
          value: '',
          type: '',
          sort: '',
          remarks: ''
        },
        dataRule: {
          label: [
            {required: true, message: 'label不能为空', trigger: 'blur'}
          ],
          value: [
            {required: true, message: 'value不能为空', trigger: 'blur'}
          ],
          type: [
            {required: true, message: '类型不能为空', trigger: 'blur'}
          ],
          sort: [
            {required: true, message: '排序不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.dataForm.id = id || 0
        this.isDisabled = false
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          // 修改
          if (this.dataForm.id) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/spring-sysweb/sys/dict/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              this.isDisabled = false
              if (data && data.code === 0) {
                this.dataForm.label = data.info.label
                this.dataForm.value = data.info.value
                this.dataForm.type = data.info.type
                this.dataForm.sort = data.info.sort
                this.dataForm.remarks = data.info.remarks
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isDisabled = true
            this.$http({
              url: this.$http.adornUrl(`/spring-sysweb/sys/dict/${!this.dataForm.id ? 'add' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'label': this.dataForm.label,
                'value': this.dataForm.value,
                'type': this.dataForm.type,
                'sort': this.dataForm.sort,
                'remarks': this.dataForm.remarks
              })
            }).then(({data}) => {
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
                this.isDisabled = false
              }
            })
          }
        })
      }
    }
  }
</script>
