<!-- 检查项弹框 -->
<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '检查项'" :close-on-click-modal="false" class="check-item-add-dialog" width="600px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="110px">
      <el-form-item label="检查项名称" prop="itemName">
        <el-input v-model="dataForm.itemName" placeholder="检查项名称" clearable size="mini"></el-input>
      </el-form-item>
      <el-form-item label="检查项类型" prop="itemType">
        <el-select v-model="dataForm.itemType" clearable size="mini" placeholder="请选择">
          <el-option v-for="item in checkTypeList" :key="item.value" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="检查方法" prop="method">
        <el-input v-model="dataForm.method" placeholder="检查方法" size="mini" class="size-mini-pople-input" clearable></el-input>
      </el-form-item>
      <el-form-item label="检查标准" prop="standard">
        <el-input v-model="dataForm.standard" type="textarea" rows="4" placeholder="检查标准" size="mini" class="size-mini-pople-input" maxlength="500" show-word-limit></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { checkItemsAddOrUpdate, checkItemsInfo } from '@/api/process/safeSystemManage'
import { getLabels } from '@/api/common/sys'
export default {
  components: {
  },
  data () {
    return {
      dataForm: {
        id: '',
        itemName: '', // 检查项名称
        itemType: '', // 检查项类型
        method: '', // 检查方法
        standard: '' // 检查标准
      },
      checkTypeList: [], // 检查类型列表
      isDisabled: false,
      disabled: false,
      visible: false,
      dataRule: {
        itemName: [{ required: true, message: '请选择检查项名称', trigger: 'blur' }],
        itemType: [{ required: true, message: '请选择检查项类型', trigger: 'change' }],
        method: [{ required: true, message: '请输入检查方法', trigger: 'change' }],
        standard: [{ required: true, message: '请输入检查标准', trigger: 'change' }]
      }
    }
  },
  created () {
    this.getBaseData()
  },
  methods: {
    // 页面初始化时加载的事件
    // 初始数据
    init (id) {
      this.isDisabled = false
      this.visible = true
      this.dataForm.id = id || ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (id) {
          this.isDisabled = true
          checkItemsInfo({ id: id }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm = data.entity
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
    // 从字典表获取规程状态类型
    getBaseData () {
      getLabels({
        'type': 'CHECK_TABLE_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.checkTypeList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          checkItemsAddOrUpdate(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.$message.success('操作成功!')
              this.$emit('refreshDataList')
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
.check-item-add-dialog {
  .el-select {
    width: 100%;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
}
</style>


