<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '承诺卡'" :visible.sync="visible" width="588px" class="promise-editdialog">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="65px">
      <el-scrollbar style="height:100%">
        <el-form-item label="图片上传" prop="imageList">

          <el-upload action="#" :auto-upload="false" multiple list-type="picture-card" :file-list="fileList" :on-change="getFile" :before-upload="beforeUpload" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>

        </el-form-item>
      </el-scrollbar>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { promiseInfo, promiseAddOrUpDate } from '@/api/risk/card'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      dataForm: {
        code: '',

        id: '', // promiseId
        imageList: []// 图片列表
      },
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      visible: false,
      dataRule: {
        imageList: [{ required: true, message: '请上传图片', trigger: 'change' }]//
      }
    }
  },
  methods: {
    // 新增/修改
    init (code, id) {
      this.dataForm.code = code
      this.dataForm.id = id || ''
      this.visible = true
      this.isDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.fileList = []
        if (id) {
          this.selectInfo(id)
        }
      })
    },
    // 查询单个处置卡信息
    selectInfo (id) {
      promiseInfo({ 'id': id }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.data
          this.fileList = []
          data.data.imageList.map(item => {
            this.fileList.push({
              url: item.image
            })
          })
        }
      })
    },
    // 文件状态改变时的钩子
    getFile (file, fileList) {
      if (this.beforeUpload(file)) {
        this.getBase64(file.raw).then(res => {
          let img = { 'id': '', 'promiseId': '', 'image': '' }
          this.$set(img, 'image', res)
          this.dataForm.imageList.push(img)
        })
      }
    },
    // 上传文件之前的钩子
    beforeUpload (file) {
      const isJPG = /^image\/(jpeg|png|jpg)$/.test(file.raw.type)
      const isLt2M = Number(file.size) / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能上传jpeg/jpg/png文件!')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    handleRemove (file, fileList) {
      var i = 0
      this.dataForm.imageList.some((item, index) => {
        if (item.image === file.url) {
          i = index
        }
      })
      this.dataForm.imageList.splice(i, 1)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          promiseAddOrUpDate(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message.success('操作成功!')
              this.visible = false

              this.$emit('refreshDataList')
            } else {
              this.$message.error(data.msg)
            }
            this.dataListLoading = false
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
            this.dataListLoading = false
          })
        }
      })
    },
    // 图片内容转为base64格式
    getBase64 (file) {
      return new Promise(function (resolve, reject) {
        let reader = new FileReader()
        let imgResult = ''
        reader.readAsDataURL(file)
        reader.onload = function () {
          imgResult = reader.result
        }
        reader.onerror = function (error) {
          reject(error)
        }
        reader.onloadend = function () {
          resolve(imgResult)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.promise-editdialog {
  .el-dialog__body {
    padding: 20px 20px;
    .el-form {
      height: 500px;
    }
    .el-scrollbar {
    }
  }
}
</style>