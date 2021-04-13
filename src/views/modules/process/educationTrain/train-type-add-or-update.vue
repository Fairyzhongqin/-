<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '培训类别管理'" :close-on-click-modal="false" class="train-type-add" width="600px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="110px">

      <el-form-item label='培训类别名称' prop='trainCategoryName'>
        <el-input v-model="dataForm.trainCategoryName" placeholder="请输入培训类别名称" clearable maxlength="20" size="mini"></el-input>
      </el-form-item>
      <el-form-item label='培训类别' prop='trainType'>
        <el-select v-model="dataForm.trainType" size="mini" placeholder="请输入培训类别等级">
          <el-option v-for="item in trainTypeList" :key="item.label" :value="item.label" :label="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='培训类别简介' prop='trainCategoryMsg'>
        <el-input v-model="dataForm.trainCategoryMsg" type="textarea" :autosize="{ minRows: 2}" placeholder="请输入培训类别简介" clearable maxlength="150" size="mini"></el-input>
      </el-form-item>
      <el-form-item label="添加类别等级" class="formitem-style">
        <el-tooltip class="add-child" effect="dark" content="新增" placement="right">
          <i class="el-icon-circle-plus-outline" @click="addClasses"></i>
        </el-tooltip>
        <br />
        <div v-for="(item,index) in dataForm.list" :key="index" class="add-style">
          <div class="first">
            <span>培训类别等级</span>
            <el-select v-model="item.trainCategoryLevel" size="mini" placeholder="请输入培训类别等级">
              <el-option v-for="item in trainCategoryLevelList" :key="item.label" :value="item.label" :label="item.value"></el-option>
            </el-select>
          </div>
          <div class="second">
            <span style="line-height:4.2">详情说明</span>
            <el-input v-model="item.detailDescription" type="textarea" :autosize="{ minRows: 2}" placeholder="请输入详情说明" clearable maxlength="150" size="mini"></el-input>
            <el-tooltip class="del-child" effect="dark" content="删除" placement="right">
              <i class="el-icon-remove-outline del-child" @click="removeClasses(item)"></i>
            </el-tooltip>
          </div>
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
// eslint-disable-next-line no-unused-vars
import { factorAddOrUpdate, factorInfo } from '@/api/risk/factor'
import { traintypeAdd, traintypeInfo } from '@/api/process/education'

export default {
  data () {
    return {
      dataForm: {
        id: '',
        list: [

        ],
        trainCategoryName: '',
        trainCategoryMsg: '',
        trainType: ''
      },
      trainTypeList: [{
        label: '1',
        value: '从业人员培训'
      }, {
        label: '2',
        value: '管理人员培训'
      }, {
        label: '3',
        value: '其它人员培训'
      }, {
        label: '4',
        value: '日常安全培训'
      }],
      trainCategoryLevelList: [{
        label: '一级',
        value: '一级'
      }, {
        label: '二级',
        value: '二级'
      }, {
        label: '三级',
        value: '三级'
      }],
      isDisabled: false,
      disabled: false,
      visible: false,
      dataRule: {
        trainCategoryName: [{ required: true, message: '请输入培训类别名称', trigger: 'blur' }],
        trainCategoryMsg: [{ required: true, message: '请输入培训类别简介', trigger: 'blur' }],
        trainCategoryLevel: [{ required: true, message: '请输入培训类别等级', trigger: 'change' }],
        trainType: [{ required: true, message: '请输入培训类别', trigger: 'change' }]
      }
    }
  },
  created () {

  },
  methods: {
    // 新增子项
    addClasses () {
      this.dataForm.list.push({
        'detailDescription': '',
        'id': '',
        'remarks': '',
        'trainCategoryId': '',
        'trainCategoryLevel': ''
      })
    },
    // 删除子项
    removeClasses (item) {
      var index = this.dataForm.list.findIndex(val => val === item)
      this.dataForm.list.splice(index, 1)
    },
    // 页面初始化时加载的事件
    // 初始数据
    init (id) {
      this.isDisabled = false
      this.visible = true
      this.dataForm.id = id || ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.list = []
        if (id) {
          this.isDisabled = true
          traintypeInfo({ id: id }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm = data.entity
              // this.dataForm.detailDescription = data.data.list.detailDescription
              // this.dataForm.trainCategoryLevel = data.data.list.trainCategoryLevel
            } else {
              this.$message.error(data.msg)
            }
          }).catch(err => {
            this.isDisabled = false
            console.log(err)
          })
        }
      })
    },

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.$nextTick(() => {
            traintypeAdd(
              this.dataForm
            ).then(({ data }) => {
              if (data && data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList', this.dataForm.trainType)
              } else {
                this.$message.error(data.msg)
              }
            }).catch((err) => {
              console.log(err)
              this.$message.error('未知异常！请联系管理员')
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.train-type-add {
  .formitem-style {
    .el-form-item__content {
      margin-left: 28px !important;
      .add-style {
        background: #f8fafc;
        transition: all 3;
        position: relative;
        padding: 21px 10px;
        margin-bottom: 10px;
        font-size: 12px;
        color: #222;
      }
      .add-style:hover {
        box-shadow: 1px 1px 3px 3px #ccc;
      }
      .first {
        margin-bottom: 10px;
        .el-select.el-select--mini,
        .el-dialog .el-input-group {
          width: 83%;
          display: inline-block;
        }
      }
      .second {
        padding-left: 24px;
        margin-bottom: 10px;

        .el-textarea {
          width: 87% !important;
        }
      }
    }
    .add-child,
    .del-child {
      color: #2c78bb;
      cursor: pointer;
      line-height: 28px;
      font-size: 15px;
      vertical-align: middle;
    }
    .del-child {
      color: #e63031;
      margin-left: 8px;
      position: absolute;
      top: -5px;
      right: 4px;
    }
  }
}
</style>


