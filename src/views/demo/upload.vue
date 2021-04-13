<template>
  <!-- <el-upload class="upload-demo"
             :action="uploadUrl"
             :data="uploadData"
             :headers="uploadHeaders"
             :before-upload="beforeUploadFunction"
             :file-list="fileList"
             list-type="picture-card"
             :show-file-list="true"
             :on-change="statusChange"
             :on-success="successStatus"
             :on-preview="previewStatus">

    <i class="el-icon-plus avatar-uploader-icon"></i>

    <el-button size="small"
               type="primary">点击上传</el-button>

  </el-upload> -->
  <!-- <div>
    <el-upload action="#"
               list-type="picture-card"
               :auto-upload="false">
      <i slot="default"
         class="el-icon-plus"></i>
      <div slot="file"
           slot-scope="{file}">
        <img class="el-upload-list__item-thumbnail"
             :src="file.url"
             alt="">
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview"
                @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleDownload(file)">
            <i class="el-icon-download"></i>
          </span>
          <span v-if="!disabled"
                class="el-upload-list__item-delete"
                @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible"
               width="400px">
      <img width="100%"
           :src="dialogImageUrl"
           alt="">
    </el-dialog>
  </div> -->
  <div>
    <el-form :model="dataForm"
             ref="dataFormRef"
             label-width="120px">
      <el-form-item label="人员图表"
                    prop="iconName">
        <el-popover ref="iconListPopover"
                    placement="bottom-start"
                    trigger="click">
          <el-button v-for="(item,index) in $store.state.common.personTypeIcon"
                     :key="index"
                     @click="selectPerson(item)">
            <img :src="item.value"
                 alt="">

          </el-button>
        </el-popover>
        <el-input v-model="dataForm.iconName"
                  :readonly="true"
                  size="mini"
                  v-popover:iconListPopover></el-input>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
// eslint-disable-next-line no-unused-vars
import { promiseUpload } from '@/api/risk/card'
import http from '@/utils/httpRequest'
export default {
  data () {
    return {
      uploadUrl: '',
      uploadData: {},
      uploadHeaders: {},
      fileList: [],
      photoUrl: '',
      displayCertificate: false,
      disabled: false,
      dialogVisible: false,
      dataForm: {
        iconName: '',
        icon: ''
      }

    }
  },
  methods: {
    selectPerson (item) {
      this.dataForm.iconName = item.name
      this.dataForm.icon = item.icon
    },
    beforeUploadFunction () {
      let token = document.cookie.split('=')[1]
      console.log(document.cookie)

      this.uploadHeaders = { token: token }
      this.uploadUrl = http.adornUrl('/spring-riskweb/promise/upload')
      this.uploadData = { id: '1' }
    },
    statusChange (file) {
      console.log('statusChange', file.raw)
    },
    successStatus (res, file) {
      console.log('111111111', file)

      // this.photoUrl = URL.createObjectURL(file.raw)
      // console.log('111111', this.photoUrl)
    },
    previewStatus (file) {
      console.log('previewStatus', file)
      console.log(file.url)
      // this.photoUrl
    },
    previewCertificate () {
      this.displayCertificate = true
    },
    handleRemove () { },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }

  }
}
</script>
<style lang = "scss" scoped>
img {
  width: 100px;
  height: 100px;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
</style>
