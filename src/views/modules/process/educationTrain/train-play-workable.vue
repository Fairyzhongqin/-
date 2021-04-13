<!-- 法律法规知识库弹框 -->
<template>
  <el-dialog title="落实培训计划" :close-on-click-modal="false" class="train-planning" width="600px" :visible.sync="visible">
    <!-- <div style="height: 400px;">
      <el-scrollbar style="height:100%" class="default-scrollbar" wrap-class="default-scrollbar__wrap" view-class="p20-scrollbar__view"> -->
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="100px">
      <el-form-item label="完成日期" prop="completeDate">
        <el-date-picker v-model="dataForm.completeDate" type="date" placeholder="请选择完成日期" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <!-- <el-form-item label="实际培训讲师" prop="trainLecturer">
        <el-input v-model="dataForm.trainLecturer" size="mini" placeholder="请输入实际培训讲师" clearable></el-input>
      </el-form-item> -->
      <el-form-item label="实际培训费用/元" prop="trainActualCost">
        <el-input v-model="dataForm.trainActualCost" size="mini" placeholder="请输入实际培训费用" clearable type="number"></el-input>
      </el-form-item>
      <el-form-item label="人员评价" prop="signPerson">
        <el-input v-model="dataForm.signPerson" size="mini" placeholder="请输入人员评价" clearable @focus="selectPerson">
          <el-button slot="append" @click="selectPerson">选择</el-button>
        </el-input>
      </el-form-item>
    </el-form>
    <select-person v-if="selectPersonVisible" ref="selectPerson" @selectEmit="selectPersonEmit"></select-person>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { departList } from '@/api/sys/depart'
import { getLabels } from '@/api/common/sys'
import selectPerson from './select-person'
import { trainplayAdd, trainplayInfo } from '@/api/process/education'
export default {
  data () {
    return {
      dataForm: {
        completeDate: '',
        trainLecturer: '',
        trainActualCost: '',
        signPerson: '',
        trainState: '1',
        id: '',
        list: []
      },
      selectPersonVisible: false,
      trainTypeList: [{
        value: '从业人员培训',
        label: '1'
      }, {
        value: '管理人员培训',
        label: '2'
      }, {
        value: '其它人员培训',
        label: '3'
      }, {
        value: '日常安全培训',
        label: '4'
      }],
      fileList: [],
      layerTypeList: [],
      moduleTypeList: [{
        value: '1',
        label: '风险评价制度'
      }], // 模块类型列表
      isDisabled: false,
      disabled: false,
      visible: false,
      filelListVisible: false,
      isFlag: false,
      dataRule: {
        statuteType: [{ required: true, message: '请选择法规类型', trigger: 'change' }],
        codeNumber: [{ required: true, message: '请输入法规编号', trigger: 'blur' }],
        forceDegree: [{ required: true, message: '请选择强制程度', trigger: 'change' }],
        releaseDate: [{ required: true, message: '请选择发布日期', trigger: 'change' }],
        revisionDate: [{ required: true, message: '请选择修订日期', trigger: 'change' }],
        effectiveDate: [{ required: true, message: '请选择生效日期', trigger: 'change' }],
        identificationDate: [{ required: true, message: '请选择生效日期', trigger: 'change' }],
        existingLaws: [{ required: true, message: '请选择现行法规', trigger: 'change' }],
        attachmentId: [{ required: true, message: '请选择文件上传', trigger: 'change' }],
        issueName: [{ required: true, message: '请输入国家政府机构', trigger: 'blur' }],
        deptName: [{ required: true, message: '请选择适用部门', trigger: 'change' }],
        deptNameIdentification: [{ required: true, message: '请选择识别部门', trigger: 'change' }],
        matters: [{ required: true, message: '请输入法律法规及其他要求事项', trigger: 'blur' }],
        moduleType: [{ required: true, message: '请选择模块类型名称', trigger: 'change' }]
      }
    }
  },
  components: {
    selectPerson
  },
  created () {
  },
  methods: {
    // 选择参加人员弹框
    selectPerson () {
      this.selectPersonVisible = true
      this.$nextTick(() => {
        this.$refs.selectPerson.init(this.dataForm.id)
      })
    },
    // 回显 参加人员
    selectPersonEmit (list) {
      console.log(list)
      this.dataForm.list = list
      let fina = ''
      list.map(item => {
        if (item.trainEvaluate === '1') {
          item.trainEvaluateName = '合格'
        } else if (item.trainEvaluate === '2') {
          item.trainEvaluateName = '不合格'
        }
        fina += (item.trainPersonName + item.trainEvaluateName) + ','
      })
      fina = fina.substr(0, fina.length - 1)
      this.dataForm.signPerson = fina
      console.log(list, fina)
    },
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
          trainplayInfo({ id: id }).then(({ data }) => {
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
    // 加载基础数据
    getBaseData () {
      // 获取法规类型列表
      getLabels({
        'type': 'STATUTE_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.layerTypeList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 获取部门树
    getDepartList () {
      this.dataListLoading = true
      departList().then(({ data }) => {
        if (data && data.code === 0) {
          this.departList = [data.data[0]] || []
          this.dataListLoading = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },

    // 表单提交
    dataFormSubmit () {
      console.log(this.dataForm)
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          trainplayAdd(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.dataForm.fileList = []
              this.fileList = []
              this.$message.success('保存成功!')
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

  },
  filters: {
    formatType (val, map) {
      let optionName = ''
      map.map(item => {
        if (val === item.label) {
          optionName = item.value
        }
      })
      return optionName
    }
  }
}
</script>
<style lang="scss">
</style>


