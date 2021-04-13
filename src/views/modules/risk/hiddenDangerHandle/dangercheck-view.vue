<template>
  <el-dialog title="隐患验收" :close-on-click-modal="false" width="600px" :visible.sync="visible" class="hiddenDnagerStyle">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="110px">

      <el-form-item label="验收部门" prop="rectificationDepartment">
        <el-popover v-model="popoverdepartVisible" popper-class="high" placement="bottom-start" ref="departPopover" trigger="click">
          <el-tree :data="departList" :props="defaultProps" node-key="id" ref="deptTree" @current-change="deptSelectChange" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.checkUnit" v-popover:departPopover size="mini" placeholder="请选择验收部门" clearable :readonly="true" disabled></el-input>
      </el-form-item>
      <el-form-item label="验收人" prop="checkPerson">
        <el-input v-model="dataForm.checkPerson" placeholder="请选择验收人" @focus="selectPerson" disabled maxlength="150" size="mini"></el-input>
        <el-button slot="append" @click="selectPerson">选择</el-button>
      </el-form-item>
      <el-form-item label="验收时间" prop="checkDate">
        <el-date-picker v-model="dataForm.checkDate" disabled type="datetime" size="mini" placeholder="请选择整改时间" value-format="yyyy-MM-dd HH:mm:ss">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="验收结果" prop="checkSituation">
        <el-input v-model="dataForm.checkSituation" placeholder="请输入验收结果" disabled clearable type="textarea" :autosize="{ minRows: 2, maxRows: 3 }" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="验收人意见" prop="checkPersonOpinion">
        <el-input v-model="dataForm.checkPersonOpinion" placeholder="请输入验收人意见" disabled clearable type="textarea" :autosize="{ minRows: 2, maxRows: 3 }" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="是否重复整改" prop="repeatRectification">
        <el-radio v-model="dataForm.repeatRectification" label="1" disabled>是</el-radio>
        <el-radio v-model="dataForm.repeatRectification" label="0" disabled>否</el-radio>
      </el-form-item>
      <el-form-item label="原因分析" prop="repeatReason" v-if="dataForm.repeatRectification === '1'">
        <el-input v-model="dataForm.repeatReason" disabled placeholder="请输入原因分析" clearable type="textarea" :autosize="{ minRows: 2, maxRows: 3 }" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="现场图片" prop="photoAfter" class="photo-style">
        <el-scrollbar style="width:100%;height:100%;">
          <el-upload action="#" list-type="picture-card" :file-list="fileList" :auto-upload="false" :on-preview="handlePictureCardPreview" :on-change="getFile" :before-upload="beforeUpload">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-scrollbar>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
    </el-form>
    <rectificate-person v-if="rectificatePersonVisible" ref="rectificatePersonRef" @selectChange="selectPersonEmit"></rectificate-person>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
    </span>
  </el-dialog>
</template>
<script>
import rectificatePerson from './components/rectificate-person'
// eslint-disable-next-line no-unused-vars
import { departList } from '@/api/sys/depart'
import { hiddenDangerInfo } from '@/api/risk/hiddenDanger'

export default {
  data () {
    return {
      dataForm: {
        id: '',
        checkSituation: '',
        rectificationDepartment: '',
        checkPerson: '',
        checkPersonOpinion: '',
        repeatRectification: '',
        repeatReason: '',
        pictureList: [],
        checkStatus: '1',
        checkDate: ''
      },
      rectificatePersonVisible: false, // 整改人弹框
      defaultProps: {
        label: 'deptName',
        children: 'child'
      },
      dataRule: {
        // factorName: [{ required: true, message: '请输入事故名称', trigger: 'blur' }],
        // factorDescribe: [{ required: true, message: '请输入事故描述', trigger: 'blur' }]
      },
      popoverdepartVisible: false, // 部门菜单树是否可见
      isDisabled: false,
      disabled: false,
      visible: false,
      departList: [],
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [],
      rectificationStatusList: [
        {
          label: '1',
          value: '未整改'
        },
        {
          label: '2',
          value: '整改中'
        },
        {
          label: '3',
          value: '已整改'
        }
      ]
    }
  },
  components: {
    rectificatePerson
  },
  created () {
    this.getDepartList()
  },
  methods: {
    // 整改部门
    getDepartList () {
      departList().then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data.data)
          this.departList = data.data
        }
      })
    },
    // 选择整改人
    selectPerson () {
      this.rectificatePersonVisible = true
      this.$nextTick(() => {
        this.$refs.rectificatePersonRef.init(this.dataForm.rectificationDepartmentId, this.selectedPersongh)
      })
    },
    // 整改人回显示
    selectPersonEmit (selected) {
      // console.log(selected)
      this.dataForm.checkPerson = selected.name
      this.selectedPersongh = selected.gh
    },
    // 当前菜单树选中
    deptSelectChange (data, node) {
      // 当前节点数据，对象
      this.dataForm.rectificationDepartmentId = data.id
      this.dataForm.checkUnit = data.deptName
      this.popoverdepartVisible = false
    },
    // 当前菜单树选中
    zoneSelectChange (data, node) {
      // 当前节点数据，对象
      console.log(data)
      this.dataForm.zoneCode = data.code
      this.dataForm.zoneName = data.zoneName
      this.popoverVisible = false
    },
    // 页面初始化时加载的事件
    // 初始数据
    init (id) {
      console.log(id)
      this.isDisabled = false
      this.visible = true
      this.dataForm.id = id || ''

      console.log('初始化fileLIst', this.fileList)
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        console.log('啥', this.dataForm)
        this.fileList = []
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
                    if (i.photoAfter) {
                      this.fileList.push({ url: i.photoAfter })
                    }
                  })
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
    // handleRemove (file) {
    //   console.log(file)
    //   console.log(this.$refs.uploadRef)
    //   console.log(this.dataForm.pictureList)
    //   this.fileList.map((v, i) => {
    //     if (v === file) {
    //       this.fileList.splice(i, 1)
    //     }
    //   })
    //   this.dataForm.pictureList.map((v, i) => {
    //     if (v.photoAfter === file.url) {
    //       this.dataForm.pictureList.splice(i, 1)
    //     }
    //   })
    // },
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
          this.dataForm.pictureList.push({ photoAfter: res })
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
.hiddenDnagerStyle {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 100%;
  }
  .photo-style {
    .el-form-item__content {
      height: 300px;
    }
  }
}
</style>
