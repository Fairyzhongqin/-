<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '风险因素'" :close-on-click-modal="false" class="station-area" width="600px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="110px">

      <el-form-item label="危险类型" prop="type">
        <el-select v-model="dataForm.type" clearable size="mini" placeholder="请选择危险类型">
          <el-option v-for="item in optionList" :key="item.label" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label='风险因素' prop='riskFactor' label-width="115px">
        <el-input v-model="dataForm.riskFactor" placeholder="请输入风险因素" clearable ref="riskRef" maxlength="60" size="mini"></el-input>
      </el-form-item>

      <el-form-item label='可能导致的危险' prop='danger' label-width="115px">
        <el-input v-model="dataForm.danger" placeholder="请输入可能导致的危险" clearable maxlength="60" size="mini"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { factorAddOrUpdate, factorInfo } from '@/api/risk/factor'
import { getLabels } from '@/api/common/sys'
export default {
  data () {
    return {
      dataForm: {
        type: '',
        riskFactor: '',
        danger: ''
      },
      reservorList: [], // 区域名称
      expandArray: [], // 默认展开的级数
      isDisabled: false,
      reservorTreeProps: {
        label: 'zoneName',
        children: 'subregion'
      }, // 树形结构展示
      disabled: false,
      visible: false,
      dataRule: {
        type: [{ required: true, message: '请选择危险类型', trigger: 'change' }],
        riskFactor: [{ required: true, message: '请输入危险因素', trigger: 'blur' }],
        danger: [{ required: true, message: '请输入可能的危险因素', trigger: 'blur' }]
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
      factorInfo({ 'id': id }).then(({ data }) => {
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
          factorAddOrUpdate(
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


