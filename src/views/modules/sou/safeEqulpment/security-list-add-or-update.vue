<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '设备'"
             :close-on-click-modal="false"
             width="600px"
             :visible.sync="visible"
             class="safeClass">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item label="安全设备名称"
                    prop="name">
        <el-input size="mini"
                  maxlength="30"
                  class="size-mini-pople-input"
                  v-model="dataForm.name"
                  placeholder="安全设备名称"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="安全设备编号"
                    prop="code">
        <el-input v-model="dataForm.code"
                  placeholder="安全设备编号"
                  maxlength="20"
                  size="mini"
                  class="size-mini-pople-input"
                  clearable></el-input>
      </el-form-item>

<!--      <el-form-item label="数量"-->
<!--                    prop="num">-->
<!--        <el-input size="mini"-->
<!--                  maxlength="10"-->
<!--                  class="size-mini-pople-input"-->
<!--                  v-model="dataForm.num"-->
<!--                  placeholder="数量"-->
<!--                  clearable></el-input>-->
<!--      </el-form-item>-->
      <el-form-item label="X轴坐标"
                    prop="positionX">
        <el-input maxlength="60"
                  size="mini"
                  class="size-mini-pople-input"
                  v-model="dataForm.positionX"
                  placeholder="X轴坐标"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="Y轴坐标"
                    prop="positionY">
        <el-input maxlength="60"
                  size="mini"
                  class="size-mini-pople-input"
                  v-model="dataForm.positionY"
                  placeholder="Y轴坐标"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="Z轴坐标"
                    prop="positionZ">
        <el-input maxlength="60"
                  size="mini"
                  class="size-mini-pople-input"
                  v-model="dataForm.positionZ"
                  placeholder="Z轴坐标"
                  clearable></el-input>
      </el-form-item>
      <el-form-item label="安全设备类型"
                    prop="type">
        <el-select size="mini"
                   v-model="dataForm.type">
          <el-option v-for="item in typeList"
                     :key="item.id"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 :disabled="isDisabled"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { typeOfEquipment, listSafeInfo, safeEquAdd } from '@/api/sou/safeEqument'

export default {
  data () {
    let validateCode = (rule, value, callback) => {
      if (!/^[0-9a-zA-Z_]{1,}$/.test(value)) {
        callback(new Error('编号格式错误'))
      } else {
        callback()
      }
    }
    // let validateNum = (rule, value, callback) => {
    //   if (!/^\+?[1-9]\d*$/.test(value)) {
    //     callback(new Error('数量格式错误'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      visible: false,

      typeList: [], // 设备类型
      loading: false,
      isDisabled: false,
      dataForm: {
        code: '',
        name: '',
        num: '',
        positionX: '',
        positionY: '',
        positionZ: '',
        type: '',
        safetyEquipmentType: {
          id: ''
        }
      },
      dataRule: {
        code: [{ required: true, validator: validateCode, trigger: 'blur' }],
        name: [
          { required: true, message: '不能为空安全设备名称', trigger: 'blur' }
        ],
        // num: [
        //   { required: true, validator: validateNum, trigger: 'blur' }
        // ],
        positionX: [
          { required: true, message: 'X轴坐标不能为空', trigger: 'blur' }
        ],
        positionY: [
          { required: true, message: 'Y轴坐标不能为空', trigger: 'blur' }
        ],
        positionZ: [{
          required: true, message: 'Z轴坐标不能为空', trigger: 'change'
        }],
        // specifications: [{ required: true, message: '规格不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '类型不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
  },
  methods: {
    // 组合类型编码
    getTypeOfEquipment () {
      // 获取设备类型
      typeOfEquipment().then(({ data }) => {
        if (data && data.code === 0) {
          this.typeList = data.list
          console.log(this.typeList, '===========设备类型============')
        } else {
          this.typeList = []
        }
      })
    },
    // 新增/修改
    init (id) {
      this.getTypeOfEquipment()
      this.dataForm.id = id || 0
      this.visible = true
      this.isDisabled = false
      // this.dataForm.type = ''
      this.$nextTick(() => {
        console.log(this.dataForm, '===================')
        this.$refs['dataForm'].resetFields()
        console.log('================', this.dataForm)

        if (this.dataForm.id) {
          this.isDisabled = true
          listSafeInfo(
            {
              id: this.dataForm.id
            }
          ).then(({ data }) => {
            this.isDisabled = false

            if (data && data.code === 0) {
              console.log('data.data=============', data.data)
              data.data.type = data.data.safetyEquipmentType.id
              this.dataForm = data.data

              // this.dataForm.type = data.data.safetyEquipmentType.id
              console.log(this.dataForm, '-------------------')
              // this.dataForm = {
              //   id: id,
              //   code: data.data.code || '',
              //   name: data.data.name || '',
              //   num: data.data.num || '',
              //   positionX: data.data.positionX || '',
              //   positionY: data.data.positionY || '',
              //   positionZ: data.data.positionZ || '',
              //   type: data.data.safetyEquipmentType['id'] || '',
              //   safetyEquipmentType: {
              //     // id: data.data.safetyEquipmentType['id'] || ''//留不留无所谓
              //   }
              // }
              // this.dataForm = data.data
              console.log(this.dataForm, '===========info数据=============')
              // this.dataForm.type = data.data.safetyEquipmentType ? data.data.safetyEquipmentType.id : ''

              console.log(data.data)
            } else {

            }
          }).catch((err) => {
            console.log(err)
          })
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataForm.safetyEquipmentType.id = this.dataForm.type
          safeEquAdd(this.dataForm).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.$emit('refreshDataList')
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                }
              })
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
.safeClass {
  .el-select {
    width: 100%;
    /deep/ .el-input--medium .el-input__inner {
      // height: 28px;
      // line-height: 28px;
    }
    /deep/ .el-input__prefix,
    .el-input__suffix {
      // top: 5px;
    }
  }
}
</style>
