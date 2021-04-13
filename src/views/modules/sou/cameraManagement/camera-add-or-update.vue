<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '摄像头'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="700px"
             class="checkpoint-dialog">
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
            <el-form-item label="摄像头类型"
                          prop="type">
              <el-select v-model="dataForm.type"
                         placeholder="摄像头类型">
                <el-option label="海康威视"
                           value="0"></el-option>
                <el-option label="大华"
                           value="1"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="摄像头编号"
                          prop="code">
              <el-input v-model="dataForm.code"
                        placeholder="摄像头编号"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="摄像头名称"
                          prop="name">
              <el-input v-model="dataForm.name"
                        placeholder="摄像头名称"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="用户名"
                          prop="username">
              <el-input v-model="dataForm.username"
                        placeholder="用户名"
                        maxlength="20"
                        autocomplete="off"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="密码"
                          prop="password">
              <el-input v-model="dataForm.password"
                        placeholder="密码"
                        type="password"
                        maxlength="20"
                        auto-complete="new-password"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="摄像头IP"
                          prop="ip">
              <el-input v-model="dataForm.ip"
                        placeholder="摄像头IP"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="摄像头端口"
                          prop="port">
              <el-input v-model="dataForm.port"
                        placeholder="摄像头端口"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="X轴坐标"
                          prop="x">
              <el-input v-model="dataForm.x"
                        placeholder="X轴坐标"
                        maxlength="20"
                        clearable
                        :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="Y轴坐标"
                          prop="y">
              <el-input v-model="dataForm.y"
                        placeholder="Y轴坐标"
                        maxlength="20"
                        clearable
                        :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="Z轴坐标"
                          prop="z">
              <el-input v-model="dataForm.z"
                        placeholder="Z轴坐标"
                        maxlength="20"
                        clearable
                        :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="楼层"
                          prop="contact">
              <el-input v-model="dataForm.floor"
                        placeholder="楼层"
                        maxlength="20"
                        type="number"
                        min='0'
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="rtsp实时播放"
                          prop="rtspUrl01">
              <el-input v-model="dataForm.rtspUrl01"
                        placeholder="rtsp实时播放"
                        maxlength="20"
                        autocomplete="off"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="rtsp历史播放"
                          prop="rtspUrl01">
              <el-input v-model="dataForm.rtspUrl02"
                        placeholder="rtsp历史播放"
                        maxlength="20"
                        autocomplete="off"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="监控区域"
                          prop="location">
              <!-- <el-input v-model="dataForm.zoneIdList"
                        placeholder="监控区域"
                        maxlength="20"
                        clearable></el-input> -->
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
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
import { cameraAddOrUpdate, cameraInfo } from '@/api/sou/cameraManagement'
export default {
  data () {
    return {
      visible: false,
      isDisabled: false,
      dataForm: {
        code: '',
        name: '',
        floor: '',
        password: '',
        username: '',
        zoneIdList: [],
        type: '',
        x: '12',
        y: '32',
        z: '43',
        rtspUrl01: '',
        rtspUrl02: '',
        ip: '',
        port: ''
      },
      dataRule: {
        code: [{ required: true, message: '请输入摄像头编号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入摄像头名称', trigger: 'blur' }],
        username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入用户密码', trigger: 'blur' }],
        x: [{ required: true, message: '请输入X坐标轴', trigger: 'blur' }],
        y: [{ required: true, message: '请输入Y坐标轴', trigger: 'blur' }],
        z: [{ required: true, message: '请输入Z坐标轴', trigger: 'blur' }],
        type: [{ required: true, message: '请选择摄像头类型', trigger: 'change' }],
        rtspUrl01: [{ required: true, message: '请输入rstp实时播放', trigger: 'blur' }],
        rtspUrl02: [{ required: true, message: '请输入rstp历史播放', trigger: 'blur' }],

        ip: [{ required: true, message: '请输入摄像头ip地址', trigger: 'blur' }],
        port: [{ required: true, message: '请输入摄像头端口号', trigger: 'blur' }]
      }
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
          cameraInfo({
            'id': this.dataForm.id || undefined
          }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
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
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.visible = false
          cameraAddOrUpdate(this.dataForm).then(({ data }) => {
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
.checkpoint-dialog {
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
}
</style>
<style lang="scss" scoped>
</style>
