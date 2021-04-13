<template>
  <el-dialog :title="(dataForm.id ? '修改' :'新增') + '安全因素控制'" :close-on-click-modal="false" class="policy-target-sub-dialog" width="600px" :visible.sync="visible" append-to-body>
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="110px">
      <el-form-item label="目标名称" prop="targetName">
        <el-input v-model="dataForm.targetName" placeholder="目标名称" clearable autosize size="mini"></el-input>
      </el-form-item>
      <el-form-item label="目标值" prop="targetValue">
        <el-input v-model.number="dataForm.targetValue" placeholder="目标值" type="tel" :min="0" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <i class="el-icon-warning">企业安全事故应严格控制在目标值限制内</i>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { objectivesInfo, objectivesAddOrUpdate } from '@/api/process/targetDuty'
export default {
  data () {
    var targetValue = (rule, value, callback) => {
      let isFlag = new RegExp('^[1-9][0-9]*$').test(value)
      if (!isFlag) {
        callback(new Error('请输入正整数或零'))
      } else {
        callback()
      }
    }
    return {
      dataForm: {
        id: '',
        policiesObjectivesId: '',
        targetName: '',
        targetValue: ''
      },
      dialogVisible: false, //
      isDisabled: false,
      disabled: false,
      visible: false,
      dataRule: {
        targetName: [{ required: true, message: '请输入目标名称', trigger: 'blur' }],
        targetValue: [
          { required: true, message: '请输入目标值', trigger: 'blur' },
          { validator: targetValue, trigger: 'blur' }
        ]
      }
    }
  },
  created () {
  },
  methods: {
    // 初始数据
    init (id, subId) {
      // console.log(id, subId, '测试123')
      this.isDisabled = false
      this.visible = true
      this.dataForm.policiesObjectivesId = id
      this.dataForm.id = subId || ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.targetState = ''
        if (id) {
          objectivesInfo({ id: subId }).then(({ data }) => {
            if (data && data.code === 0) {
              // console.log(data.data)
              this.dataForm.targetName = data.data.targetName
              this.dataForm.targetValue = data.data.targetValue
              this.dataForm.targetState = data.data.targetState
            } else {
              console.log(data.msg)
            }
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          objectivesAddOrUpdate(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.$emit('refreshSubDataList')
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
.policy-target-sub-dialog {
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
  .el-icon-warning {
    color: #e6a23c;
  }
}
</style>


