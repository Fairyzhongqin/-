<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '隐患'" :close-on-click-modal="false" class="report-style" width="600px" :visible.sync="visible" @close="closeReport">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="110px">
      <el-form-item label="隐患名称" prop="hiddenDangerName">
        <el-input v-model="dataForm.hiddenDangerName" placeholder="请输入隐患名称" clearable maxlength="20" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="隐患地点" prop="zoneName">
        <el-popover v-model="popoverVisible" popper-class="high" placement="bottom-start" ref="zonePopover" trigger="click">
          <el-tree :data="graphList" :props="defaultProps" node-key="id" ref="zoneTree" @current-change="zoneSelectChange" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.zoneName" v-popover:zonePopover size="mini" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item>
      <el-form-item label="隐患来源" prop="hiddenDangerSource">
        <el-select v-model="dataForm.hiddenDangerSource" clearable placeholder="请选择隐患来源" size="mini">
          <el-option v-for="item in dangerSournceList" :key="item.label" :value="item.label" :label="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="隐患描述" prop="hiddenDangerDescribe">
        <el-input v-model="dataForm.hiddenDangerDescribe" type="textarea" :autosize="{ minRows: 2 }" placeholder="请输入隐患描述" clearable maxlength="150" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="现场图片" prop="photoBefore" class="photo-style">
        <el-scrollbar style="width:100%;height:100%;">
          <el-upload action="#" list-type="picture-card" :file-list="fileList" :auto-upload="false" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :on-change="getFile" :before-upload="beforeUpload" ref="uploadRef">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-scrollbar>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import {
  hiddenDangerInfo,
  hiddenDangerAddOrUpdate
} from '@/api/risk/hiddenDanger'
import { queryZoneInfo } from '@/api/pos/region'
import { getLabels } from '@/api/common/sys.js'
export default {
  data () {
    return {
      dataForm: {
        zoneName: '',
        hiddenDangerName: '',
        hiddenDangerSource: '',
        hiddenDangerDescribe: '',
        pictureList: [] // 图片上传
      },
      dialogVisible: false,
      dialogImageUrl: '',
      isDisabled: false,
      disabled: false,
      visible: false,
      fileList: [],
      dangerSournceList: [], // 隐患来源
      graphList: [], // 所属区域

      defaultProps: {
        label: 'zoneName',
        children: 'subregion'
      },
      popoverVisible: false, // 菜单树是否可见
      dataRule: {
        hiddenDangerName: [
          { required: true, message: '请输入隐患名称', trigger: 'blur' }
        ],
        zoneName: [
          { required: true, message: '请输入隐患地点', trigger: 'change' }
        ],
        hiddenDangerSource: [
          { required: true, message: '请输入隐患来源', trigger: 'change' }
        ],
        hiddenDangerDescribe: [
          { required: true, message: '请输入隐患描述', trigger: 'blur' }
        ]
        // photoBefore: [{required: true, message: '请至少上传一张图片', trigger: 'blur'}]
      }
    }
  },
  created () {
    this.getAllZoneList()
    this.getDangerSource()
  },
  methods: {
    // 当前菜单树选中
    zoneSelectChange (data, node) {
      // 当前节点数据，对象
      console.log(data)
      this.dataForm.zoneCode = data.code
      this.dataForm.zoneName = data.zoneName
      this.popoverVisible = false
    },
    // 字典表查隐患来源
    getDangerSource () {
      getLabels({ type: 'DANGER_SOURCE' }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data.list)
          this.dangerSournceList = data.list
        }
      })
    },
    // 获取所有的区域
    getAllZoneList () {
      this.dataListLoading = true
      queryZoneInfo()
        .then(({ data }) => {
          if (data && data.code === 0) {
            this.graphList = [data.data] || []
          } else {
            this.graphList = []
          }
          this.dataListLoading = false
        })
        .catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
          this.dataListLoading = false
        })
    },
    // 页面初始化时加载的事件
    // 初始数据
    init (id) {
      console.log(id)
      this.isDisabled = false
      this.visible = true
      this.dataForm.id = id || ''
      // this.fileList = []
      console.log('初始化fileLIst', this.fileList)
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        console.log('啥', this.dataForm)

        if (id) {
          this.isDisabled = true
          hiddenDangerInfo({ id: id })
            .then(({ data }) => {
              this.isDisabled = false
              if (data && data.code === 0) {
                console.log(data.data)
                this.dataForm = data.data
                if (data.data.pictureList && data.data.pictureList.length > 0) {
                  data.data.pictureList.forEach(i => {
                    if (i.photoBefore) {
                      this.fileList.push({ url: i.photoBefore })
                    }
                  })
                  // for (var i = 0; i < data.data.pictureList.length; i++) {
                  //   this.fileList.push({ url: data.data.pictureList[i].photoBefore })
                  // }
                }
                console.log(this.fileList)
              } else {
                this.$message.error(data.msg)
              }
            })
            .catch(err => {
              this.isDisabled = false
              console.log(err)
            })
        }
      })
    },
    // 关闭弹框
    closeReport () {
      this.$emit('closeReport')
    },
    // 表单提交
    dataFormSubmit () {
      console.log('查看fileList', this.fileList)

      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.isDisabled = true
          console.log(this.dataForm)
          hiddenDangerAddOrUpdate(this.dataForm)
            .then(({ data }) => {
              if (data && data.code === 0) {
                this.isDisabled = false
                this.visible = false
                this.$emit('refreshDataList')
              } else {
                this.visible = false
                this.isDisabled = false

                this.$message.error(data.msg)
              }
            })
            .catch(err => {
              console.log(err)
              this.visible = false
              this.isDisabled = false

              this.$message.error('未知异常！请联系管理员')
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
    },
    // 移除图片事件
    handleRemove (file) {
      console.log(file)
      console.log(this.$refs.uploadRef)
      console.log(this.dataForm.pictureList)
      this.fileList.map((v, i) => {
        if (v === file) {
          this.fileList.splice(i, 1)
        }
      })
      this.dataForm.pictureList.map((v, i) => {
        if (v.photoBefore === file.url) {
          this.dataForm.pictureList.splice(i, 1)
        }
      })
    },
    // 预览事件
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 文件状态改变时的钩子
    getFile (file, fileList) {
      // console.log(1111)
      if (this.beforeUpload(file)) {
        this.getBase64(file.raw).then(res => {
          // console.log('图片上传时状态', this.dataForm.photoBefore)
          this.dataForm.pictureList.push({ photoBefore: res })
          console.log('图片list', this.dataForm.pictureList)
        })
      }
    },
    // 上传文件之前的钩子
    beforeUpload (file) {
      const isJPG = /^image\/(jpeg|png|jpg)$/.test(
        file.raw ? file.raw.type : file.type
      )
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
.report-style {
  .photo-style {
    .el-form-item__content {
      height: 300px;
    }
  }
}
</style>
