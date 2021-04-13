<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '人员信息'" :close-on-click-modal="false" append-to-body class="person-dialog" width="600px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="80px" v-loading="loading">
      <el-row>
        <el-col :span="13">
          <el-form-item label="人员类型" prop="cgformId">
            <el-select v-model="dataForm.cgformId" @change="cgformChangeHandle" clearable size="mini" :disabled="cgformIdDisabled" placeholder="请选择">
              <el-option v-for="item in cgformIdList" :key="item.cgformId" :label="item.cgformName" :value="item.cgformId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="姓名" prop="name">
            <el-input v-model="dataForm.name" size="mini" placeholder="姓名" clearable></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="sex">
            <el-select v-model="dataForm.sex" clearable size="mini" placeholder="请选择">
              <el-option v-for="item in sexList" :key="item.value" :label="item.value" :value="item.key">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工号" prop="gh">
            <el-input :disabled="this.dataForm.id != 0" v-model="dataForm.gh" size="mini" placeholder="工号" clearable></el-input>
          </el-form-item>

          <el-form-item v-if="dataForm.cgformId === '713273002'" label="到期时间" prop="maturityTime">
            <el-date-picker v-model="dataForm.maturityTime" format="yyyy-MM-dd HH:mm" size="mini" value-format="yyyy-MM-dd HH:mm" type="datetime" placeholder="到期时间">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="人员图标" prop="iconName">
            <el-popover ref="iconListPopover" placement="bottom-start" trigger="click" popper-class="mod-menu__icon-popover">
              <el-button v-for="(item, index) in $store.state.common.personTypeIcon" :key="index" @click="personIcon(item)">
                <img :src="item.value" alt="#" class="mapPersonTypeimg">
              </el-button>

            </el-popover>
            <el-input v-model="dataForm.iconName" v-popover:iconListPopover :readonly="true" size="mini" class=" icon-list__input" placeholder="人员图标名称"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item class="item-img" prop="photo" label-width="20px">
            <el-upload class="avatar-uploader" action="#" :auto-upload="false" :show-file-list="false" :on-change="getFile" :before-upload="beforeUpload">
              <div v-if="dataForm.photo" @click.stop class="avatar-uploader-content">
                <img :src="dataForm.photo" class="avatar">
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-preview">
                    <i @click.stop="showImgHandle()" class="el-icon-zoom-in"></i>
                  </span>
                  <span v-if="dataForm.photo" class="el-upload-list__item-delete">
                    <i @click.stop="delImgHandle()" class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
              <div v-else class="avatar-uploader-content">
                <img src="~@/assets/img/staffIcon.png" class="avatar" alt="暂无图片">
                <span class="el-upload-list__item-actions">
                  <span class="el-upload-list__item-delete">
                    <i class="el-icon-upload2"></i>
                  </span>
                </span>
              </div>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item v-for="(item,index) in otherAttr" :key="index" :label="item.attributeName">
        <el-input v-model="item['otherName']" :placeholder="item.attributeName" size="mini" clearable></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
    <!--dialog - 图片查看-->
    <el-dialog :visible.sync="dialogVisible" width="700px" top="3vh" append-to-body>
      <img width="100%" :src="dataForm.photo" alt="上传图片">
    </el-dialog>
  </el-dialog>
</template>

<script>
import { pTypeList, pAddOrUpdate, pGetAttrs, pGet } from '@/api/pos/person'
export default {
  data () {
    return {
      // 人员类型是否禁用
      cgformIdDisabled: false,
      dialogVisible: false,
      disabled: false,
      visible: false,
      isDisabled: false,
      dataForm: {
        id: '',
        cgformId: '',     // 人员类型
        name: '',         // 姓名
        sex: '',          // 性别
        gh: '',           // 工号
        photo: '',        // 人员照片 base64
        maturityTime: '', // 到期时间
        otherInfo: [],
        iconName: '',
        icon: ''
      },
      srcList: [],    // 人员照片list
      otherAttr: [],  // 其他补充属性
      cgformIdList: [], // 人员类型列表
      sexList: [{
        key: '0',
        value: '男'
      }, {
        key: '1',
        value: '女'
      }],
      loading: false,
      dataRule: {
        cgformId: [
          { required: true, message: '人员类型不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        sex: [
          { required: true, message: '性别不能为空', trigger: 'blur' }
        ],
        gh: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        iconName: [
          { required: true, message: '人员图标不能为空', trigger: 'change' }
        ],
        maturityTime: [
          { required: true, message: '到期时间不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    // 查询共有哪些人员类型 - 初始数据
    pTypeList().then(({ data }) => {
      if (data && data.code === 0) {
        this.cgformIdList = data.list
      }
    }).catch((err) => {
      console.log(err)
      this.$message.error('未知异常！请联系管理员')
    })
  },
  methods: {
    // 人员图标名称
    personIcon (item) {
      this.dataForm.iconName = item.name
      this.dataForm.icon = item.icon
    },
    // 查看上传图片
    showImgHandle () {
      this.dialogVisible = true
    },
    // 删除上传图片
    delImgHandle () {
      this.dataForm.photo = ''
      this.srcList = []
    },
    // 文件状态改变时的钩子
    getFile (file) {
      if (this.beforeUpload(file)) {
        this.getBase64(file.raw).then(res => {
          this.dataForm.photo = res
          this.srcList = []
          this.srcList.push(res)
        })
      } else {
        this.dataForm.photo = ''
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
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 文件列表移除文件时的钩子
    handleRemove (file, fileList) {
      this.isDisabled = false
    },
    // 查询人员类型特有属性
    cgformChangeHandle (cgformId) {
      this.cgformIdList.map((value) => {
        if (value.cgformId === cgformId && value.icon !== null) {
          this.dataForm.icon = value.icon
          this.dataForm.iconName = this.$store.state.common.personTypeIcon[value.icon].name
        }
      })
      this.otherAttr = []
      pGetAttrs({
        cgformId: this.dataForm.cgformId // 人员类型
      }).then(({ data }) => {
        if (data && data.code === 0) {
          let otherAttr = data.list
          otherAttr.map(value => {
            this.dataForm.otherInfo.map(value1 => {
              if (value1.attributeName === value.attributeName) {
                value['otherName'] = value1.otherName
              }
            })
          })
          this.otherAttr = otherAttr
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 初始数据
    init (id, from) {
      if (from === 'contract') {
        this.dataForm.cgformId = '713273001'
        this.cgformIdDisabled = true
      }
      this.loading = true
      this.isDisabled = false
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.icon = ''
        this.dataForm.iconName = ''
        this.otherAttr = []
        this.dataForm.otherInfo = []
        if (this.dataForm.id) {
          this.isDisabled = true
          pGet({
            gh: this.dataForm.id
          }).then(({ data }) => {
            this.loading = false
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm.cgformId = data.info.cgformId
              this.dataForm.name = data.info.name
              this.dataForm.sex = data.info.sex
              this.dataForm.gh = data.info.gh
              this.dataForm.maturityTime = data.info.maturityTime
              this.dataForm.photo = data.info.photo
              this.dataForm.iconName = this.$store.state.common.personTypeIcon[data.info.icon].name
              this.dataForm.icon = this.$store.state.common.personTypeIcon[data.info.icon].icon
              for (let x in data.info.otherAttr) {
                this.dataForm.otherInfo.push({
                  attributeName: x,
                  otherName: data.info.otherAttr[x]
                })
              }
              this.cgformChangeHandle() // 查询人员类型特有属性
              this.loading = false
            }
          }).catch((err) => {
            console.log(err)
            this.loading = false
            this.isDisabled = false
            this.$message.error('未知异常！请联系管理员')
          })
        } else {
          this.loading = false
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let otherAttr = {}
          this.otherAttr.map(value => {
            otherAttr[value.columnName] = value.otherName
          })
          this.isDisabled = true
          pAddOrUpdate({
            id: this.dataForm.id || '',
            cgformId: this.dataForm.cgformId,         // 人员类型
            name: this.dataForm.name,                 // 姓名
            sex: this.dataForm.sex,                   // 性别
            gh: this.dataForm.gh,                     // 工号
            maturityTime: this.dataForm.maturityTime || '', // 结束时间
            photo: this.dataForm.photo,               // 人员照片 base64
            otherAttr: otherAttr,
            icon: this.dataForm.icon
          }).then(({ data }) => {
            this.visible = false
            this.$emit('refreshDataList')
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                }
              })
            } else {
              this.isDisabled = false
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
.person-dialog {
  .el-dialog {
    .el-select,
    .el-date-editor.el-input {
      width: 100%;
    }
    .avatar-uploader {
      .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      &-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
      }
      .avatar {
        width: 178px;
        height: 206px;
        display: block;
      }
      &-content {
        .el-upload-list__item-actions {
          line-height: 206px;
          position: absolute;
          width: 100%;
          height: 100%;
          left: 0;
          top: 0;
          cursor: default;
          text-align: center;
          color: #fff;
          opacity: 0;
          font-size: 20px;
          background-color: rgba(0, 0, 0, 0.5);
          transition: opacity 0.3s;
          span {
            line-height: 36px;
            cursor: pointer;
            display: inline-block;
            & + span {
              margin-left: 15px;
            }
          }
          .el-upload-list__item-delete {
            position: static;
            font-size: inherit;
            color: inherit;
          }
          &:hover {
            opacity: 1;
          }
        }
      }
    }
    .item-img {
      text-align: center;
      .el-upload-list {
        display: none;
      }
      .el-form-item__content {
        line-height: 1;
      }
      .image-slot {
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .el-form-item--medium {
    margin-bottom: 16px;
  }
}
</style>
<style lang="scss" scope>
.mapPersonTypeimg {
  width: 30px;
  height: 30px;
}
</style>
