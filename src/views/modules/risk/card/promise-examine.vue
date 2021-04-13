<template>
  <el-dialog title="承诺卡预览" :visible.sync="visible" append-to-body width="600px" class="promise-check-dialog">
    <el-carousel>
      <el-carousel-item v-for="(item,index) in fileList" :key="index">
        <img :src="item.url" width="100%" alt="轮播图" @click="previewImg(index)">
      </el-carousel-item>
    </el-carousel>
    <el-dialog :visible.sync="dialogVisible" width="900px" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="轮播图">
    </el-dialog>
  </el-dialog>
</template>
<script>
import { promiseInfo } from '@/api/risk/card'
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
        content: '',
        id: '', // promiseId
        imageList: []// 图片列表
      },
      fileList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      visible: false,
      dataRule: {
        // content: [{ required: true, message: '请输入承诺卡内容', trigger: 'blur' }]
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
        this.dataForm.content = ''
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
          if (data.data.imageList && data.data.imageList.length) {
            data.data.imageList.map(item => {
              this.fileList.push({
                url: item.image
              })
            })
          }
        }
      })
    },
    previewImg (index) {
      this.fileList.map((item, index1) => {
        if (index === index1) {
          this.dialogImageUrl = item.url
          this.dialogVisible = true
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
      this.visible = false
      // this.$refs['dataForm'].validate(valid => {
      //   if (valid) {
      //     promiseAddOrUpDate(
      //       this.dataForm
      //     ).then(({ data }) => {
      //       if (data && data.code === 0) {
      //         this.$message.success('操作成功!')
      //         this.visible = false
      //         console.log(data)
      //         this.$emit('refreshDataList')
      //       } else {
      //         this.$message.error(data.msg)
      //       }
      //       this.dataListLoading = false
      //     }).catch((err) => {
      //       console.log(err)
      //       this.$message.error('未知异常！请联系管理员')
      //       this.dataListLoading = false
      //     })
      //   }
      // })
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
.promise-check-dialog {
  .el-dialog__body {
    padding: 20px 20px 30px;
    min-height: 350px;
  }
  .el-carousel {
    height: 400px;
    .el-carousel__container {
      height: 100%;
    }
    img {
      width: 100%;
      height: 100%;
    }
    // .el-carousel__container {
    //   .el-carousel__item {
    //     position: relative;
    //   }
    //   .el-carousel--horizontal {
    //     box-shadow: 0 0 11px #909399d9;
    //   }
    // }
    // .el-carousel__button {
    //   height: 10px;
    //   width: 10px;
    //   border-radius: 50%;
    //   z-index: 9999;
    //   background-color: #5089c2;
    // }
  }
}
</style>
