<template>
  <div>
    <el-upload class="upload-demo"
               :action="uploadUrl"
               :data="uploadData"
               :headers="uploadHeaders"
               :before-upload="beforeUploadFunction"
               :file-list="fileList">
      <el-button size="small"
                 type="primary">点击上传</el-button>
      <div slot="tip"
           class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
  </div>
</template>
<script>
import http from '@/utils/httpRequest'
export default {
  data () {
    return {
      uploadUrl: '',
      uploadData: {},
      uploadHeaders: {}
    }
  },
  methods: {
    beforeUploadFunction () {
      let token = document.cookie.split('=')[1]
      this.uploadHeaders = { token: token }
      this.uploadUrl = http.adornUrl('/spring-riskweb/promise/upload')
      this.uploadData = { id: '1' }
    }
  }
}
</script>
<style lang="scss">
</style>

  
 