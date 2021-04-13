<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '危险化学品'" :close-on-click-modal="false" class="dangeradd-area" width="600px" :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="110px">

      <el-form-item label="名称" prop="name">
        <el-input v-model="dataForm.name" placeholder="请输入高危化学品名称" clearable size="mini"></el-input>
      </el-form-item>
      <el-form-item label='cas号' prop='casNum' label-width="115px">
        <el-input v-model="dataForm.casNum" placeholder="请输入cas号" clearable size="mini"></el-input>
      </el-form-item>
      <el-form-item label='危险特性' prop='riskContent' label-width="115px">
        <el-input v-model="dataForm.riskContent" placeholder="请输入危险特性" clearable size="mini"></el-input>
      </el-form-item>

      <el-form-item label='物理形态' prop='type' label-width="115px">
        <el-select v-model="dataForm.type" clearable size="mini" placeholder="请选择物理形态">
          <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='火灾危险等级' prop='fireHazardous' label-width="115px">
        <el-select v-model="dataForm.fireHazardous" clearable size="mini" placeholder="请选择火灾危险等级">
          <el-option v-for="item in fireList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label='备注' prop='remarks' label-width="115px">
        <el-input v-model="dataForm.remarks" placeholder="请输入高危化学品的备注" clearable maxlength="60" size="mini"></el-input>
      </el-form-item>
      <el-form-item label='有机性' prop='organicFlag' label-width="115px">
        <el-radio v-model="dataForm.organicFlag" label="0">有机</el-radio>
        <el-radio v-model="dataForm.organicFlag" label="1">无机</el-radio>
      </el-form-item>

      <el-form-item label='毒害性' prop='toxicProperties' label-width="115px">
        <el-radio v-model="dataForm.toxicProperties" label="0">一级</el-radio>
        <el-radio v-model="dataForm.toxicProperties" label="1">二级</el-radio>
      </el-form-item>
      <el-form-item label='腐蚀性' prop='corrosive' label-width="115px">
        <el-radio v-model="dataForm.corrosive" label="0">一级</el-radio>
        <el-radio v-model="dataForm.corrosive" label="1">二级</el-radio>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false" size="mini">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()" size="mini">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { dangerChemicalsAddOrUpdate, dangerChemicalsInfo } from '@/api/sou/highRisk'
import { getLabels } from '@/api/common/sys'
export default {
  data () {
    return {
      dataForm: {
        name: '',
        symbol: '',
        riskContent: '',
        type: '', // 化学品形态
        organicFlag: '0',
        fireHazardous: '',
        toxicProperties: '0',
        corrosive: '0',
        remarks: '',
        casNum: ''
      },
      typeList: [{
        'label': '气态',
        'value': '0'
      }, {
        'label': '液态',
        'value': '1'
      }, {
        'label': '固态',
        'value': '2'
      }],
      fireList: [{
        'label': '甲类',
        'value': '0'
      }, {
        'label': '乙类',
        'value': '1'
      }, {
        'label': '丙类',
        'value': '2'
      }, {
        'label': '丁类',
        'value': '3'
      }, {
        'label': '戊类',
        'value': '4'
      }],
      expandArray: [], // 默认展开的级数
      isDisabled: false,
      disabled: false,
      visible: false,
      dataRule: {
        name: [{ required: true, message: '请输入高危化学品名称', trigger: 'blur', pattern: '[^ \x22]+' }],
        symbol: [{ required: true, message: '请输入化学品符号', trigger: 'blur', pattern: '[^ \x22]+' }],
        riskContent: [{ required: true, message: '请输入高危属性描述', trigger: 'blur', pattern: '[^ \x22]+' }],
        // remarks: [{ required: true, message: '请输入高危化学品的备注', trigger: 'blur' }],
        type: [{ required: true, message: '请选择化学品形态', trigger: 'change' }],
        organicFlag: [{ required: true, message: '请选择有机无机性', trigger: 'change' }],
        fireHazardous: [{ required: true, message: '请选择火灾风险等级', trigger: 'change' }],
        toxicProperties: [{ required: true, message: '请选择毒害性', trigger: 'change' }],
        corrosive: [{ required: true, message: '请选择腐蚀性', trigger: 'change' }],
        casNum: [{ required: true, message: '请输入cas号', trigger: 'blur', pattern: '[^ \x22]+' }]

      },
      optionList: []// 风险类型
    }
  },

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
      dangerChemicalsInfo({ 'id': id }).then(({ data }) => {
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
          // console.log(data)
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          dangerChemicalsAddOrUpdate(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              // console.log(data)
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
.dangeradd-area {
  .el-radio {
    margin: 0 10px 0 3px;
  }
}
</style>


