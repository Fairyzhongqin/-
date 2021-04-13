<template>
  <div>
    <!-- <div id="printTest">

      　　　　　　<p>锄禾日当午</p>

      　　　　　　<p>汗滴禾下土 </p>

      　　　　　　<p>谁知盘中餐</p>

      　　　　　　<p>粒粒皆辛苦</p>

      　　　　</div>
    　<button v-print="'#printTest'">打印</button>
    <a href="http://pic.90sjimg.com/back_pic/u/00/00/95/36/55e6b4967d6f2.jpg" download="img.png">下载</a> -->

    <!-- <el-upload action="#" :auto-upload="false" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-change="getFile">
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog> -->

    <!-- <el-upload action="#" list-type="picture-card" :auto-upload="false" :file-list="fileList" ref="elUpdateRefs">
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleDownload(file)">
            <i class="el-icon-download"></i>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog> -->
  </div>

</template>
<script>
export default {
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList: []
    }
  },
  methods: {
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
    },
    // 移除图片事件
    handleRemove (file) {
      this.$refs.elUpdateRefs.uploadFiles.splice(this.$refs.elUpdateRefs.uploadFiles.indexOf(file), 1)
    },
    // 预览事件
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 文件状态改变时的钩子
    getFile (file) {
      console.log(file)
      // if (this.beforeUpload(file)) {
      //   this.getBase64(file.raw).then(res => {
      //     this.imgInfo = res
      //     this.srcList.push(res)
      //     console.log(this.srcList)
      //   })
      // }
    },
    // 上传文件之前的钩子
    beforeUpload (file) {
      const isJPG = /^image\/(jpeg|png|jpg)$/.test(file.raw.type)
      const isLt2M = Number(file.size) / 1024 / 1024 < 2
      if (!isJPG) {
        this.$message.error('上传图片只能上传jpeg/jpg/png文件!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>
<style lang="scss">
</style>