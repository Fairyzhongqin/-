<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '高危工艺类型'" :close-on-click-modal="false" class="station-area" width="600px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="110px">

      <el-form-item label="高危工艺类型" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入高危工艺类型名称" clearable size="mini"></el-input>
      </el-form-item>
      <el-form-item label='工艺简介' prop='content' label-width="115px">
        <el-input v-model="dataForm.content" placeholder="请输入工艺简介" clearable type="textarea" autosize ref="riskRef" size="mini"></el-input>
      </el-form-item>

      <el-form-item label='工艺危险特点' prop='riskContent' label-width="115px">
        <el-input v-model="dataForm.riskContent" placeholder="请输入高危工艺类型的工艺危险特点" clearable type="textarea" autosize size="mini"></el-input>
      </el-form-item>
      <el-form-item label='监测预警参数' prop='monitorParam' label-width="115px">
        <el-input v-model="dataForm.monitorParam" placeholder="请输入高危工艺类型的风险描述" clearable type="textarea" autosize size="mini"></el-input>
      </el-form-item>
      <el-form-item label='备注' prop='remarks' label-width="115px">
        <el-input v-model="dataForm.remarks" placeholder="请输入高危工艺类型的备注" clearable size="mini"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="mini">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()" size="mini">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { processTypeAddOrUpdate, processTypeInfo } from '@/api/sou/highRisk'
import { getLabels } from '@/api/common/sys'
export default {
  data () {
    return {
      dataForm: {
        name: '',
        content: '',
        riskContent: '',
        remarks: '',
        monitorParam: ''
      },
      reservorList: [], // 区域名称
      expandArray: [], // 默认展开的级数
      isDisabled: false,
      disabled: false,
      visible: false,
      dataRule: {
        name: [{ required: true, message: '请输入高危工艺类型名称', trigger: 'blur', pattern: '[^ \x22]+' }],
        content: [{ required: true, message: '请输入高危工艺类型描述', trigger: 'blur', pattern: '[^ \x22]+' }],
        riskContent: [{ required: true, message: '请输入高危工艺类型的风险描述', trigger: 'blur', pattern: '[^ \x22]+' }],
        remarks: [{ required: true, message: '请输入高危工艺类型的备注', trigger: 'blur', pattern: '[^ \x22]+' }],
        monitorParam: [{ required: true, message: '请输入监测预警参数', trigger: 'blur', pattern: '[^ \x22]+' }]

      },
      optionList: []// 风险类型
    }
  },
  // watch: {   // watch()监听某个值（双向绑定）的变化，从而达到change事件监听的效果
  //   'dataForm.riskFactor': {
  //     handler: function () {
  //       var _this = this
  //       var _sum = 5 // 字体限制为100个
  //       _this.$refs.riskRef.setAttribute('maxlength', _sum)
  //     },
  //     deep: true
  //   }
  // },
  components: {

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
        // console.log(this.taskId)
        this.$refs['dataForm'].resetFields()
        if (id) {
          this.selectInfo(id)
        }
      })
    },
    // 查询单个班组信息
    selectInfo (id) {
      processTypeInfo({ 'id': id }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data.data)
          this.dataForm = data.data
          console.log(this.dataForm)
        }
      })
    },
    // 加载基础数据
    getBaseData () {
      getLabels({
        'type': 'accident_type'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.optionList = data.list
          // console.log(this.optionList)
          console.log(data)
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          console.log(this.dataForm)

          processTypeAddOrUpdate(
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
.station-area {
  .time {
    margin-right: 10px;
  }
  .el-row {
    margin-left: -60.5px;
  }
}
</style>


