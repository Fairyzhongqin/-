<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '处置卡'" :close-on-click-modal="false" :visible.sync="visible" width="600px" class="card-manage-dialog">
    <div>
      <el-row>
        <el-col :span="24">
          <!-- 添加内容位置 -->
          <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="pr20" label-width="120px">
            <el-form-item label="风险分区名称" prop="name">
              <el-input v-model="dataForm.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="风险编号" prop="code">
              <el-input v-model="dataForm.code" disabled></el-input>
            </el-form-item>
            <el-form-item label="风险提示" prop="riskTips">
              <el-input v-model="dataForm.riskTips" placeholder="请输入风险提示" clearable></el-input>
            </el-form-item>
            <el-form-item label="处置方法" prop="disposalMethod">
              <el-input v-model="dataForm.disposalMethod" type="textarea" placeholder="请输入处置方法" maxlength="200" clearable></el-input>
            </el-form-item>
            <el-form-item label="注意事项" prop="carefulMatter">
              <el-input v-model="dataForm.carefulMatter" type="textarea" placeholder="请输入注意事项" maxlength="200" clearable></el-input>
            </el-form-item>
            <el-form-item label="内部联系人" prop="insideContact">
              <el-input v-model="dataForm.contactsIn" placeholder="请输入内部联系人姓名" maxlength="20" clearable class="concat"></el-input>
            </el-form-item>
            <el-form-item prop="contactsInNumber">
              <el-input v-model="dataForm.contactsInNumber" placeholder="请输入内部联系人号码" maxlength="20" size="mini" clearable></el-input>

            </el-form-item>
            <el-form-item label="外部联系人" prop="externalContact">
              <el-input v-model="dataForm.externalContact" placeholder="外部联系人姓名" maxlength="60" clearable class="concat"></el-input>

            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { manageAdd, manageInfo } from '@/api/risk/card'
export default {
  data () {
    let validatePhone = (rule, value, callback) => {
      if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(value)) {
        callback(new Error('手机号格式错误'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      isDisabled: false,
      zoneIds: [],
      dataList: [],
      dataListLoading: false,
      dataForm: {
        id: '',
        name: '', // 风险分区名称
        code: '', // 风险分区编号
        riskTips: '', // 风险提示
        disposalMethod: '', // 处置方法
        carefulMatter: '', // 注意事项
        insideContact: '', // 内部联系人
        externalContact: '火警 119；医疗援助 120', // 外部联系人
        contactsIn: '', // 内部联系人
        contactsInNumber: '' // 内部联系人号码
      },

      riskZoneList: [], // 风险分区
      dataRule: {
        name: [{ required: true, message: '请选择风险分区名称', trigger: 'blur' }],
        code: [{ required: true, message: '请选择风险分区编号', trigger: 'blur' }],
        riskTips: [{ required: true, message: '请输入风险提示', trigger: 'blur' }],
        disposalMethod: [{ required: true, message: '请输入处置方法', trigger: 'blur' }],
        carefulMatter: [{ required: true, message: '请输入注意时事项', trigger: 'blur' }],
        insideContact: [{ required: true, message: '请输入内部联系方式', trigger: 'blur' }],
        contactsInNumber: [{ validator: validatePhone, trigger: 'blur' }],
        externalContact: [{ required: true, message: '请输入外部联系方式', trigger: 'blur' }]
      }
    }
  },
  created () {

  },
  methods: {
    // 新增/修改
    init (id, code, name) {
      this.dataForm.id = id || ''
      this.visible = true
      this.isDisabled = false
      this.contactsIn = ''
      this.contactsInNumber = ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.name = name
        this.dataForm.code = code
        this.dataForm.contactsIn = ''
        if (id) {
          this.selectInfo(id)
        }
      })
    },
    // 查询单个处置卡信息
    selectInfo (id) {
      manageInfo({ 'id': id }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
          this.dataForm.riskTips = data.data.riskTips
          this.dataForm.disposalMethod = data.data.disposalMethod
          this.dataForm.carefulMatter = data.data.carefulMatter
          this.dataForm.insideContact = data.data.insideContact
          this.dataForm.externalContact = data.data.externalContact
          this.dataForm.contactsIn = this.dataForm.insideContact.split(' ')[0]
          this.dataForm.contactsInNumber = this.dataForm.insideContact.split(' ')[1]
        }
      })
    },

    // 表单提交
    dataFormSubmit () {
      this.dataForm.insideContact = this.dataForm.contactsIn + ' ' + this.dataForm.contactsInNumber
      // this.dataForm.externalContact = this.contactsOut + ' ' + this.contactsOutNumber
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          manageAdd(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              console.log(data)
              this.$emit('refreshDataList')
            } else {
              this.$message.error(data.msg)
            }
            this.dataListLoading = false
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
            this.dataListLoading = false
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.card-manage-dialog {
  .concat {
    margin-bottom: 5px;
  }
}
</style>

<style scoped lang="scss">
textarea {
  margin: {
    top: 10px;
    bottom: 10px;
  }
}
</style>


