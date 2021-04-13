<!-- 法律法规知识库弹框 -->
<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '培训计划'" :close-on-click-modal="false" class="train-planning" width="600px" :visible.sync="visible">
    <!-- <div style="height: 400px;">
      <el-scrollbar style="height:100%" class="default-scrollbar" wrap-class="default-scrollbar__wrap" view-class="p20-scrollbar__view"> -->
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="100px">
      <el-form-item label="培训名称" prop="trainName">
        <el-input v-model="dataForm.trainName" size="mini" placeholder="请输入培训名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="培训类型" prop="trainType">
        <el-select v-model="dataForm.trainType" placeholder="请选择培训类型" @change="selectTrainType(dataForm.trainType)">
          <el-option v-for="item in trainTypeList" :key="item.label" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="培训类别" prop="trainCategory">
        <el-popover v-model="popoverVisible" popper-class="high" placement="bottom-start" ref="trainPopover" trigger="click">

          <el-tree :data="trainData" :props="defaultProps" node-key="id" ref="zoneTree" @current-change="selectTrainTypeChange" default-expand-all :highlight-current="true" :expand-on-click-node="false">

          </el-tree>

        </el-popover>
        <el-input v-model="dataForm.trainCategory" v-popover:trainPopover size="mini" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item>
      <el-form-item label="培训地点" prop="trainPlace">
        <el-input v-model="dataForm.trainPlace" size="mini" placeholder="请输入培训地点" clearable></el-input>
      </el-form-item>
      <el-form-item label="培训时间" prop="trainDate">
        <el-date-picker v-model="dataForm.trainDate" type="date" placeholder="选择培训时间" value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="培训简介" prop="trainContent">
        <el-input v-model="dataForm.trainContent" size="mini" placeholder="请输入培训简介" clearable type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="计划费用/元" prop="trainPlanCost">
        <el-input v-model="dataForm.trainPlanCost" size="mini" placeholder="请输入计划费用" clearable type="number"></el-input>
      </el-form-item>
      <el-form-item label="培训学时/时" prop="trainPeriod">
        <el-input v-model="dataForm.trainPeriod" size="mini" placeholder="请输入培训学时" clearable type="number"></el-input>
      </el-form-item>
      <el-form-item label="培训讲师" prop="trainLecturer">
        <el-input v-model="dataForm.trainLecturer" size="mini" placeholder="请输入培训讲师" clearable></el-input>
      </el-form-item>
      <el-form-item label="培训人员类别">
        <el-radio v-model="dataForm.trainPersonType" label="1">全部员工</el-radio>
        <el-radio v-model="dataForm.trainPersonType" label="2">部门员工</el-radio>
        <el-radio v-model="dataForm.trainPersonType" label="3">自定义人员</el-radio>
      </el-form-item>
      <el-form-item label="参加培训人员" prop="trainPerson" v-if="dataForm.trainPersonType==='3'">
        <el-input v-model="dataForm.trainPerson" placeholder="请选择参加培训人员" @focus="selectStaffShow" size="mini"></el-input>
        <el-button slot="append" @click="selectStaffShow">选择</el-button>
      </el-form-item>
      <el-form-item label="培训部门" prop="trainDepart" v-if="dataForm.trainPersonType === '2'">
        <el-popover v-model="popoverVisible2" popper-class="high" placement="bottom-start" ref="deptPopover2" trigger="click">
          <el-tree :data="departList" :props="defaultPropsdept" node-key="id" ref="zoneTree" @current-change="deptSelectChangepeixun" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.trainDepart" v-popover:deptPopover2 size="mini" placeholder="请选择培训部门" clearable></el-input>
      </el-form-item>
      <el-form-item label="是否考核" prop="trainExamination">

        <el-radio v-model="dataForm.trainExamination" label="1">是</el-radio>
        <el-radio v-model="dataForm.trainExamination" label="0">否</el-radio>
      </el-form-item>
      <!-- 选择部门 -->
      <el-form-item label="考核单位" prop="assessmentDepart" v-if="dataForm.trainExamination === '1'">
        <el-popover v-model="popoverVisible1" popper-class="high" placement="bottom-start" ref="deptPopover" trigger="click">

          <el-tree :data="departList" :props="defaultPropsdept" node-key="id" ref="zoneTree" @current-change="deptSelectChange" default-expand-all :highlight-current="true" :expand-on-click-node="false">

          </el-tree>

        </el-popover>
        <el-input v-model="dataForm.assessmentDepart" v-popover:deptPopover size="mini" placeholder="请选择考核单位" clearable></el-input>
      </el-form-item>
      <el-form-item label="及格分数线" prop="passScoreLine" v-if="dataForm.trainExamination === '1'">
        <el-input v-model="dataForm.passScoreLine" size="mini" placeholder="请输入及格分数线" clearable type="number"></el-input>
      </el-form-item>
    </el-form>
    <!-- </el-scrollbar>
    </div> -->
    <!-- <train-person v-if="rectificatePersonVisible" ref="rectificatePersonRef" @selectChange="selectPersonEmit"></train-person> -->
    <train-person v-if="selectStaffVisible" ref="selectStaff" @selectStaffEmit='selectStaffEmit'></train-person>

    <!-- <train-category v-if="trainCategoryVisible" ref="trainCategory" @selectTrainCategoryEmit="selectTrainCategoryEmit"></train-category> -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import trainCategory from './train-category'
import { departList } from '@/api/sys/depart'
import { getLabels } from '@/api/common/sys'
import trainPerson from './train-person'

// eslint-disable-next-line no-unused-vars
import { trainplayAdd, trainplayInfo, traintypeList, traintypeChildList } from '@/api/process/education'
export default {
  data () {
    return {
      dataForm: {
        trainName: '',
        trainType: '',
        trainCategory: '',
        trainPlace: '',
        trainDate: '',
        trainDepart: '',
        trainContent: '',
        trainPlanCost: '',
        trainPeriod: '',
        compliedPerson: '',
        trainLecturer: '',
        trainPerson: '',
        trainExamination: '0',
        assessmentDepart: '',
        passScoreLine: '',
        trainPersonType: '1',
        list: []
      },
      popoverVisible1: false,
      popoverVisible2: false,
      defaultPropsdept: {
        label: 'deptName',
        children: 'child'
      },
      rectificatePersonVisible: false,
      trainCategoryVisible: false,
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
      selectStaffVisible: false,

      selected: [],
      trainData: [], // 关联的数据
      disabled: false,
      visible: false,
      filelListVisible: false,
      isFlag: false,
      departList: [],
      defaultProps: {
        label: 'selectlabel',
        children: 'child'
      }, // 树形结构展示
      popoverVisible: false,
      pageIndex: 1,
      pageSize: 20,
      uploadUrl: '',
      uploadData: {},
      uploadHeaders: {},
      filename: '', // 文件名
      selectChange: {}, // 选中项
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
    // trainCategory
    trainPerson
  },
  created () {
    this.getBaseData()
    this.getDepartList()
    this.selectTrainType('1')
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
    // 添加人员
    selectStaffShow () {
      this.selectStaffVisible = true
      this.$nextTick(() => {
        this.$refs.selectStaff.init(this.selected)
      })
    },
    // 整改人回显示
    selectStaffEmit (selected) {
      console.log(selected)
      this.selected = selected
      let name = selected[0].name
      for (var i = 1; i < selected.length; i++) {
        name += ',' + selected[i].name
      }
      this.dataForm.trainPerson = name

      for (var g = 0; g < selected.length; g++) {
        this.dataForm.list.push({
          trainPersonName: selected[g].name,
          trainPersonCode: selected[g].gh
        })
      }
      // this.selectedPersongh = selected.gh
    },
    // // 选择关联的培训类别
    // selectTrainCategory (type) {
    //   this.trainCategoryVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.trainCategory.init(type)
    //   })
    // },
    // // 回显培训类别
    // selectTrainCategoryEmit () {

    // },
    // 根据培训类型关联培训类别
    selectTrainType (trainType) {
      this.trainData = []
      traintypeList({ trainType: trainType }).then(({ data }) => {
        if (data && data.code === 0) {
          if (data.page.list.length > 0) {
            data.page.list.map(async item => {
              await traintypeChildList({ id: item.id }).then(data2 => {
                if (data2.data && data2.data.code === 0) {
                  data2.data.list.map((val, index) => {
                    val.id = index + item.id
                    val.selectlabel = val.trainCategoryLevel + item.trainCategoryName
                  })
                }
                item.selectlabel = item.trainCategoryName
                item.child = data2.data.list || []
              })
              this.trainData.push(item)
            })
            console.log(this.trainData)
          }
        }
      })
    },
    // 获取部门树
    getDepartList () {
      this.dataListLoading = true
      departList().then(({ data }) => {
        if (data && data.code === 0) {
          this.departList = [data.data[0]] || []
          console.log(this.departList)
          this.dataListLoading = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 识别部门菜单树选中
    selectTrainTypeChange (data, node) {
      // 当前节点的数据，对象
      console.log(data)
      this.dataForm.trainCategory = data.selectlabel
      this.popoverVisible = false
    },
    deptSelectChange (data, node) {
      // 当前节点的数据，对象
      console.log(data)
      this.dataForm.assessmentDepart = data.deptName
      this.popoverVisible1 = false
    },
    deptSelectChangepeixun (data, node) {
      this.dataForm.trainDepart = data.deptName
      this.dataForm.trainDepartId = data.id
      this.popoverVisible2 = false
    },
    // 表单提交
    dataFormSubmit () {
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
.emergency-planning-dialog {
  .el-select {
    width: 100%;
  }
  .el-date-editor.el-input {
    width: 100%;
  }
  .upload {
    color: #2c78bb;
    border-color: #97c2e9;
  }
}
</style>


