<template>
  <el-dialog :title="(dataForm.id ? '修改' :'新增') +'【'+(dataForm.name) +'】'+ '风险诱因'" :close-on-click-modal="false" class="station-area" width="600px" :visible.sync="visible" append-to-body>
    <div class="basic-info">
      <el-row :gutter="10">
        <el-col :span="4">风险名称：</el-col>
        <el-col :span="20">{{factorName}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="4">风险描述：</el-col>
        <el-col :span="20">{{factorDescribe}}</el-col>
      </el-row>
    </div>

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="115px">

      <el-form-item label='风险诱因：' prop='factorDanger'>
        <el-input v-model="dataForm.factorDanger" placeholder="请输入风险诱因：" clearable maxlength="150" type="textarea" autosize size="mini"></el-input>
      </el-form-item>

      <el-form-item label='管控措施：' prop='factorControl'>
        <el-button @click="addControlMeasure()" size="mini" type="primary">添加</el-button>
        <el-form class="contorl-measure">
          <el-form-item label="" v-for="(item,index) in dataForm.factorControl" :key="index">
            <el-tag size="mini" class="index">{{index + 1 + '.'}}</el-tag>
            <el-input type="textarea" autosize :rows="1" v-model="item.descript" maxlength="150" size="mini" placeholder="管控措施">

            </el-input>
            <i class="el-icon-remove" @click="dataForm.factorControl.splice(index,1)"></i>
          </el-form-item>

        </el-form>
      </el-form-item>
      <el-form-item label="安全标志：" prop="factorIcon">
        <el-popover ref="iconListPopover" placement="top" trigger="click" popper-class="mod-menu__icon-popover">
          <div class="mod-menu__icon-inner">
            <div class="mod-menu__icon-list">
              <el-button v-for="(item,index) in iconList" :key="index" @click="iconHandle(item)" :class="{'is-active' : item === dataForm.factorIcon}">
                <icon-svg :name="item"></icon-svg>
              </el-button>
            </div>
          </div>
        </el-popover>
        <div v-popover:iconListPopover class="safe-box">
          <el-button class="safe">
            <i v-if="!dataForm.factorIcon" class="el-icon-plus"></i>
            <icon-svg v-if="dataForm.factorIcon" :name="dataForm.factorIcon"></icon-svg>
            <i v-if="dataForm.factorIcon" class="el-icon-delete" @click="deleteImg"></i>
          </el-button>
          <el-button v-if="dataForm.factorIcon" class="safe1">
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { subFactorAddOrUpdate, accidentInfo } from '@/api/risk/factor'
import Icon from '@/icons'
export default {
  data () {
    return {
      factorDescribe: '',
      factorName: '',
      dataForm: {
        factorDanger: '',
        factorControl: [{ descript: '' }],
        factorIcon: '',
        id: '',
        name: ''
      },
      iconList: [],
      iconVisibleIndex: -1,
      imgInfo: '',
      dialogImageUrl: '', // 图片
      srcList: [],
      dialogVisible: false, //
      isDisabled: false,
      disabled: false,
      visible: false,
      isflag: false,
      dataRule: {
        factorName: [{ required: true, message: '请输入事故名称', trigger: 'blur' }],
        factorDescribe: [{ required: true, message: '请输入事故描述', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.iconList = Icon.getAlertIdentifierNameList()
  },
  methods: {
    // 点击图标，选中图标
    iconHandle (name) {
      this.dataForm.factorIcon = name
    },
    // 点击删除按钮，删除选中的图标
    deleteImg () {
      this.dataForm.factorIcon = ''
    },
    // 初始数据
    init (info, id) {
      this.isDisabled = false
      this.visible = true
      this.dataForm.id = id
      this.dataForm.name = info.factorName
      this.dataForm.factorMainId = info.id || ''
      this.dataForm.factorIcon = ''
      this.$nextTick(() => {
        this.imgInfo = ''
        this.srcList = []
        this.dataForm.factorIcon = ''

        this.$refs['dataForm'].resetFields()
        this.dataForm.factorControl = [{ descript: '' }]
        this.factorName = info.factorName
        this.factorDescribe = info.factorDescribe
        if (id) {
          this.isflag = true
          accidentInfo({ id: id }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.factorDanger = data.data.factorDanger
              this.dataForm.factorIcon = data.data.factorIcon
              this.dataForm.factorControl = data.data.factorControl.map(item => {
                item = { descript: item }
                return item
              })
            } else {
              console.log(data.msg)
            }
          })
        }
      })
    },
    // 添加管控措施项
    addControlMeasure () {
      this.dataForm.factorControl.push({ descript: '' })
    },
    // 放大图片
    enlargeImg (index) {
      this.dialogVisible = true
      this.dialogImageUrl = this.srcList[index]
    },
    endeleteImg (index) {
      this.srcList.splice(index, 1)
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
    handleRemove (file, fileList) {
    },
    // 预览事件
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 文件状态改变时的钩子
    getFile (file) {
      if (this.beforeUpload(file)) {
        this.getBase64(file.raw).then(res => {
          this.imgInfo = res
          this.srcList.push(res)
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
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.dataForm.factorControl = this.dataForm.factorControl.map(item => {
            item = item.descript
            return item
          })
          subFactorAddOrUpdate(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.$emit('refreshSubDataList', this.dataForm.factorMainId)
              this.visible = false
              this.$message.success('操作成功')
            } else {
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.mod-menu__icon-popover {
  width: 458px !important;
  overflow: hidden;
  .mod-menu__icon-inner {
    width: 478px;
    max-height: 335px;
    overflow-x: hidden;
    overflow-y: auto;
    .mod-menu__icon-list {
      width: 458px;
      padding: 0;
      margin: -8px 0 0 -8px;
      > .el-button {
        padding: 5px 3px;
        margin: 8px 0 0 8px;
        > span {
          display: inline-block;
          vertical-align: middle;
          width: 94px;
          height: 94px;
          font-size: 94px;
        }
      }
    }
  }
}
.station-area {
  .el-input {
    width: 100%;
  }
  .safe-box {
    height: 115px;
    width: 115px;
    .safe {
      position: relative;
      height: 115px;
      width: 115px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      .el-icon-delete {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #fff;
        font-size: 16px;
        display: none;
        z-index: 99;
      }
      .el-icon-plus {
        color: #ccc;
      }
      .icon-svg {
        font-size: 100px;
      }
    }
    .safe1 {
      height: 115px;
      width: 115px;
      position: absolute;
      top: 0%;
      left: -5px;
      opacity: 0;
      background-color: rgba(0, 0, 0, 0.5);
      transition: opacity 0.3s;
      color: #fff;
    }
    &:hover {
      .safe1 {
        opacity: 1;
      }
      .el-icon-delete {
        display: block;
      }
    }
  }

  .el-upload-list {
    display: none;
  }
  .img-div {
    float: left;
    width: 148px;
    height: 148px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .enlarge {
      font-size: 20px;
      color: #fff;
      position: absolute;
      top: 50%;
      left: 35%;
      transform: translateY(-50%);
      cursor: pointer;
    }
    .endelete {
      font-size: 20px;
      color: #fff;
      position: absolute;
      top: 50%;
      left: 55%;
      transform: translateY(-50%);
      cursor: pointer;
    }
  }
  .time {
    margin-right: 10px;
  }
  .el-row {
    margin-left: -60.5px;
  }
  .basic-info {
    margin-left: 34px;
    line-height: 1.5;
    margin-bottom: 10px;

    .el-col-20 {
      padding-left: 0 !important;
    }
  }
  .contorl-measure {
    padding-right: 0;
    position: relative;
    font-size: 12px;
    .el-form-item {
      margin: 7px 0;
      .el-form-item__content {
        display: flex;
        flex-direction: row;
        .index {
          position: absolute;
          width: 25px;
          top: 5px;
          left: -35px;
        }
        .el-icon-remove {
          margin-left: 5px;
          color: #f56c6c;
          line-height: 30px;
        }
      }
    }
  }
}
</style>


