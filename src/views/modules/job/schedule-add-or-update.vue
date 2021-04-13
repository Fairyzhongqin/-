<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">
      <el-form-item label="定时任务名" prop="jobName">
        <el-input v-model="dataForm.jobName" placeholder="定时任务名" maxlength="85" :disabled="updateDisabled"></el-input>
      </el-form-item>
      <el-form-item label="类路径" prop="classPath">
        <el-input v-model="dataForm.classPath" placeholder="类路径" maxlength="85" :disabled="updateDisabled"></el-input>
      </el-form-item>
      <el-form-item label="参数" prop="params">
        <el-input v-model="dataForm.params" placeholder="参数" maxlength="1333"></el-input>
      </el-form-item>
      <el-form-item label="cron表达式" prop="cronExpression">
        <el-input v-model="dataForm.cronExpression" maxlength="85" placeholder="如: 0 0 12 * * ? *"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remarks">
        <el-input v-model="dataForm.remarks" placeholder="备注" maxlength="66"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isdisabled">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    data () {
      return {
        visible: false,
        isdisabled: false,
        updateDisabled: false,
        dataForm: {
          id: 0,
          jobName: '',
          classPath: '',
          params: '',
          cronExpression: '',
          remarks: '',
          status: 0
        },
        dataRule: {
          jobName: [
            { required: true, message: '定时任务名不能为空', trigger: 'blur' }
          ],
          classPath: [
            { required: true, message: '类路径不能为空', trigger: 'blur' }
          ],
          cronExpression: [
            { required: true, message: 'cron表达式不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        // this.updateDisabled = (id === undefined)
        if (id === undefined) {
          this.updateDisabled = false
        } else {
          this.updateDisabled = true
        }
        this.isdisabled = false
        this.dataForm.id = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            this.$http({
              url: this.$http.adornUrl(`/spring-sysweb/sys/schedule/info/${this.dataForm.id}`),
              method: 'get',
              params: this.$http.adornParams()
            }).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.jobName = data.schedule.jobName
                this.dataForm.classPath = data.schedule.classPath
                this.dataForm.params = data.schedule.params
                this.dataForm.cronExpression = data.schedule.cronExpression
                this.dataForm.remarks = data.schedule.remarks
                this.dataForm.status = data.schedule.status
              }
            })
          }
        })
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isdisabled = true
            this.$http({
              url: this.$http.adornUrl(`/spring-sysweb/sys/schedule/${!this.dataForm.id ? 'save' : 'update'}`),
              method: 'post',
              data: this.$http.adornData({
                'id': this.dataForm.id || undefined,
                'jobName': this.dataForm.jobName,
                'classPath': this.dataForm.classPath,
                'params': this.dataForm.params,
                'cronExpression': this.dataForm.cronExpression,
                'remarks': this.dataForm.remarks,
                'status': !this.dataForm.id ? undefined : this.dataForm.status
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
              }
              this.isDisabled = false
            })
          }
        })
      }
    }
  }
</script>
