<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '事故报告'" :close-on-click-modal="false" append-to-body class="accident-report-dialog" width="700px" :visible.sync="visible" v-dialogDrag>
    <div class="accident">
      <el-scrollbar style="height:100%" class="default-scrollbar" wrap-class="default-scrollbar__wrap" view-class="p20-scrollbar__view">
        <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120">
          <table class="accident-report-table" width="100%" cellspacing="0" align="left" border="1">
            <tr>
              <td colspan="2" class="baseinfo-title"> 事故基本信息</td>
            </tr>
            <tr>
              <td>
                <div class="content">
                  <el-form-item label="事故发生单位：" prop="deptName" :show-message="false">
                    <el-popover v-model="deptPopoverVisible" placement="bottom-start" popper-class="high" ref="deptPopover" trigger="click">
                      <el-tree :data="deptList" :props="defaultDeptProps" node-key="id" ref="deptTree" @current-change="deptSelectChange" default-expand-all :highlight-current="true" :expand-on-click-node="false"></el-tree>
                    </el-popover>
                    <el-input class="dept-input" v-model="dataForm.deptName" v-popover:deptPopover size="mini" placeholder="请选择事故发生单位" clearable></el-input>
                  </el-form-item>
                </div>
              </td>
              <td>
                <div class="content">
                  <el-form-item label="所属区域：" prop="zoneName" :show-message="false">
                    <el-popover v-model="popoverVisible" popper-class="high" placement="bottom-start" ref="zonePopover" trigger="click">

                      <el-tree :data="graphList" :props="defaultProps" node-key="id" ref="zoneTree" @current-change="zoneSelectChange" default-expand-all :highlight-current="true" :expand-on-click-node="false">

                      </el-tree>

                    </el-popover>
                    <el-input class="zone-input" v-model="dataForm.zoneName" v-popover:zonePopover size="mini" placeholder="请选择所属区域" clearable></el-input>
                  </el-form-item>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="content">
                  <el-form-item label="事故发生时间：" prop="occurrenceTime" :show-message="false">
                    <el-date-picker v-model="dataForm.occurrenceTime" type="datetime" placeholder="选择事故发生时间" clearable size="mini">
                    </el-date-picker>
                  </el-form-item>
                </div>
              </td>
              <td>
                <div class="content">
                  <el-form-item label="报告时间：" prop="reportingTime" :show-message="false">
                    <el-date-picker class="report-time" v-model="dataForm.reportingTime" type="datetime" placeholder="选择事故发生时间" clearable size="mini">
                    </el-date-picker>
                  </el-form-item>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="content">
                  <el-form-item label="事故分析会时间：" prop="analysisMeetingTime" :show-message="false">
                    <el-date-picker class="analysis-time " v-model="dataForm.analysisMeetingTime" type="datetime" placeholder="选择事故发生时间" clearable size="mini">
                    </el-date-picker>
                  </el-form-item>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="content">
                  <el-form-item label="事故涉及人：" prop="involveEmployeeName" :show-message="false">
                    <el-input class="involve-input" @focus="selectInvolve(dataForm.deptId)" v-model="dataForm.involveEmployeeName" placeholder="请输入事故涉及人" size="mini">
                      <el-button slot="append" @click="selectInvolve(dataForm.deptId)">选择</el-button>
                    </el-input>
                  </el-form-item>
                </div>
              </td>
            </tr>
            <tr>
            </tr>
            <tr>
              <td colspan="2">
                <div class="content">
                  <el-form-item label="事故类型：" prop="accidentType" :show-message="false">
                    <el-select class="type-input" v-model="dataForm.accidentType" placeholder="请输入事故类型" size="mini" clearable>
                      <el-option v-for="item in accidentTypeList" :label="item.value" :value="item.label" :key="item.label"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2" class="baseinfo-title special"> 工作描述</td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="textarea-content">
                  <el-form-item prop="jobDescription" :show-message="false">
                    <el-input class="desc-textarea" v-model="dataForm.jobDescription" size="mini" clearable placeholder="请输入工作描述" type="textarea" maxlength="150"></el-input>
                  </el-form-item>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2" class="baseinfo-title special"> 事故描述</td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="textarea-content">
                  <el-form-item prop="accidentDescription" :show-message="false">
                    <el-input class="desc-textarea" v-model="dataForm.accidentDescription" size="mini" clearable placeholder="请输入事故描述" type="textarea" maxlength="150"></el-input>
                  </el-form-item>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2" class="baseinfo-title special"> 事故分析</td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="textarea-content">
                  <el-form-item prop="accidentAnalysis" :show-message="false">
                    <el-input class="desc-textarea" v-model="dataForm.accidentAnalysis" size="mini" clearable placeholder="请输入事故分析" type="textarea" maxlength="150"></el-input>
                  </el-form-item>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2" class="baseinfo-title special"> 事故原因</td>
            </tr>
            <tr>
              <td colspan="2">
                <div class="textarea-content">
                  <el-form-item prop="accidentCause" :show-message="false">
                    <el-input class="desc-textarea" v-model="dataForm.accidentCause" size="mini" clearable placeholder="请输入事故原因" type="textarea" maxlength="150"></el-input>
                  </el-form-item>
                </div>
              </td>
            </tr>
            <tr>
              <td colspan="2" class="baseinfo-title special"> 事故处理</td>
            </tr>
            <tr>

              <td colspan="2">
                <div class="textarea-content">
                  <el-form-item prop="accidentHandling" :show-message="false">
                    <el-input class="desc-textarea" v-model="dataForm.accidentHandling" size="mini" clearable placeholder="请输入事故处理" type="textarea" maxlength="150"></el-input>
                  </el-form-item>
                </div>
              </td>

            </tr>
          </table>
        </el-form>
      </el-scrollbar>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
    <accidentReportTable v-if="selectVisible" ref="selectInvolveRef" @refreshSelect="refreshSelect"></accidentReportTable>
  </el-dialog>
</template>

<script>
import { departList } from '@/api/sys/depart'
import { treeDataTranslate2 } from '@/utils'
import { queryZoneInfo } from '@/api/pos/region'
import { getLabels } from '@/api/common/sys'
import accidentReportTable from './accident-report-involve-employee-table'
import { accidentReportInfo, accidentReportAddOrUpdate } from '@/api/process/accidentMange.js'
export default {
  data () {
    return {
      dialogVisible: false,
      disabled: false,
      visible: false,
      isDisabled: false,
      selectVisible: false,
      dataForm: {
        // accidentTime: '', // 事故时间
        reportingTime: '', // 报告时间
        analysisMeetingTime: '', // 分析会时间
        jobDescription: '',
        involveEmployeeName: '',
        involveEmployee: [],
        deptName: '', // 部门
        deptId: '',
        occurrenceTime: '',
        zoneName: '',
        isFiled: '0',
        zoneId: '',
        accidentType: '',
        accidentDescription: '',
        accidentAnalysis: '',
        accidentCause: '',
        accidentHandling: '',
        id: ''
      },
      deptList: [],
      accidentTypeList: [],
      deptPopoverVisible: false, // 部门菜单树是否可见
      defaultDeptProps: {
        label: 'deptName',
        children: 'child'
      },
      popoverVisible: false, // 菜单树是否可见
      defaultProps: {
        label: 'zoneName',
        children: 'subregion'
      },
      // expanded: [],
      graphList: [],
      // expandedquyu: [],
      loading: false,
      dataRule: {
        reportingTime: [
          { required: true, message: '报告时间不能为空', trigger: 'change' }],
        analysisMeetingTime: [
          { required: true, message: '分析时间不能为空', trigger: 'change' }
        ],
        occurrenceTime: [
          { required: true, message: '分析时间不能为空', trigger: 'change' }
        ],
        jobDescription: [
          { required: true, message: '工作描述不能为空', trigger: 'blur' }],
        involveEmployeeName: [
          { required: true, message: '涉及人员不能为空', trigger: 'change' }
        ],
        deptName: [
          { required: true, message: '事故发生单位不能为空', trigger: 'change' }
        ],
        zoneName: [
          { required: true, message: '所属区域不能为空', trigger: 'change' }
        ],
        accidentType: [
          { required: true, message: '事故类型不能为空', trigger: 'change' }
        ],
        accidentDescription: [
          { required: true, message: '事故描述不能为空', trigger: 'blur' }
        ],
        accidentAnalysis: [
          { required: true, message: '事故分析不能为空', trigger: 'blur' }
        ],
        accidentCause: [
          { required: true, message: '事故原因不能为空', trigger: 'blur' }
        ],
        accidentHandling: [
          { required: true, message: '事故处理不能为空', trigger: 'blur' }
        ]

      },
      dataList: {}
    }
  },
  components: {
    accidentReportTable
  },
  created () {
    this.getDept()
    this.getAccidentType()
    this.getAllZoneList()
  },
  methods: {
    // 选择涉及人员
    selectInvolve (deptId) {
      this.selectVisible = true
      this.$nextTick(() => {
        console.log('看看是否存在', this.dataForm.involveEmployee)

        this.$refs.selectInvolveRef.init(deptId, this.dataForm.involveEmployee)
      })
    },
    // 回显选择的涉及人员
    refreshSelect (val) {
      console.log('回显打印出来的涉及人员', val)

      let personStr = ''
      personStr = val.map(item => {
        return item.name
      }).join(',')
      this.$set(this.dataForm, 'involveEmployeeName', personStr)
      console.log(this.dataForm.involveEmployeeName)

      this.dataForm.involveEmployee = val.map(item => {
        item = { employeeGh: item.gh, employeeName: item.name }
        return item
      })
      this.selectVisible = false
      console.log(this.dataForm.involveEmployee)
    },
    // 初始数据
    init (id) {
      this.isDisabled = false
      this.visible = true
      this.$nextTick(() => {
        this.dataForm.involveEmployee = []
        this.dataForm.id = ''
        this.$refs['dataForm'].resetFields()

        console.log('初始化进来看是否有DATAFORM', this.dataForm)

        if (id) {
          accidentReportInfo({ id: id }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.id = id
              this.dataForm = data.data
              // console.log('看datform', this.dataForm)
              // this.dataForm.accidentTime = data.data.accidentTime
              // this.dataForm.reportingTime = data.data.reportingTime
              // this.dataForm.analysisMeetingTime = data.data.analysisMeetingTime
              // this.dataForm.jobDescription = data.data.jobDescription
              // this.dataForm.involveEmployee = data.data.involveEmployee
              // this.dataForm.deptName = data.data.deptName
              // this.dataForm.deptId = data.data.deptId
              // this.dataForm.occurrenceTime = data.data.occurrenceTime
              // this.dataForm.zoneName = data.data.zoneName
              // this.dataForm.zoneId = data.data.zoneId
              // this.dataForm.accidentType = data.data.accidentType
              // this.dataForm.accidentDescription = data.data.accidentDescription
              // this.dataForm.accidentAnalysis = data.data.accidentAnalysis
              // this.dataForm.accidentCause = data.data.accidentCause
              // this.dataForm.accidentHandling = data.data.accidentHandling
              let name = ''
              name = data.data.involveEmployee.map(item => {
                return item.employeeName
              }).join(',')
              this.$set(this.dataForm, 'involveEmployeeName', name)
            }
          })
        }
      })
    },

    // 得到事故类型
    getAccidentType () {
      getLabels({
        type: 'ACCIDENT_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log('事故类型', data.list)
          this.accidentTypeList = data.list
        }
      })
    },
    // 当前菜单树选中
    zoneSelectChange (data, node) {
      // 当前节点的数据，对象
      this.dataForm.zoneId = data.zoneCode
      this.dataForm.zoneName = data.zoneName
      this.popoverVisible = false
    },
    // 获取所有的区域
    getAllZoneList () {
      this.dataListLoading = true
      queryZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          console.log('区域', data)
          this.graphList = [data.data] || []
          // this.expandedquyu.push([data.data][0].id)
        } else {
          this.graphList = []
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    deptSelectChange (data, node) {
      console.log(data, node)
      this.dataForm.deptName = data.deptName
      this.dataForm.deptId = data.deptId
      this.deptPopoverVisible = false
    },
    // 查找部门
    getDept () {
      departList().then(({ data }) => {
        if (data && data.code === 0) {
          this.deptList = treeDataTranslate2(data.data[0] || [])
          console.log('xsaxsadcsadc', data.data[0], this.deptList)

          // this.expanded.push(this.deptList[0].id)
          // this.deptList[0].child.map(item => {
          //   this.expanded.push(item.id)
          // })
          // console.log(this.expanded)
        }
      })
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isDisabled = true
          this.dataForm.occurrenceTime = this.dataForm.occurrenceTime ? new Date(this.dataForm.occurrenceTime).Format('yyyy-MM-dd hh:mm:ss') : ''
          // this.dataForm.accidentTime = this.dataForm.accidentTime ? new Date(this.dataForm.accidentTime).Format('yyyy-MM-dd hh:mm:ss') : ''
          this.dataForm.reportingTime = this.dataForm.reportingTime ? new Date(this.dataForm.reportingTime).Format('yyyy-MM-dd hh:mm:ss') : ''
          this.dataForm.analysisMeetingTime = this.dataForm.analysisMeetingTime ? new Date(this.dataForm.analysisMeetingTime).Format('yyyy-MM-dd hh:mm:ss') : ''
          accidentReportAddOrUpdate(this.dataForm).then(({ data }) => {
            this.visible = false
            this.$emit('refreshDataList')
            this.$emit('closeDialog')
            if (data && data.code === 0) {
              this.isDisabled = false
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                }
              })
            } else {
              this.visible = false
              this.isDisabled = false
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.isDisabled = false
            this.$message.error('未知异常！请联系管理员')
          })
        }
      })
    }
  },
  filters: {

  },
  watch: {
    'dataForm.involveEmployeeName': {
      handler: function (newVal, oldVal) {
        console.log('当前的值：' + newVal)
        console.log('旧的值' + oldVal)
      },
      deep: true  // 深度监听
    }
  }
}
</script>
<style lang="scss">
.accident-report-dialog {
  font-size: 12px;
  color: #222222;
  .accident {
    height: 500px;
    .el-form-item {
      display: flex;
    }
    .accident-report-table {
      border: 1px solid #dcdfe6;
      border-collapse: collapse;
      tr {
        td {
          width: 50%;
          vertical-align: middle;
          border: 1px solid #dcdfe6;
          padding: 8px 11px;
          overflow: hidden;
          .content {
            height: 28px;
            display: flex;
            justify-content: space-between;
            .dept-input {
              width: 108%;
            }
            .zone-input {
              width: 121%;
            }
            .analysis-time {
              width: 259% !important;
            }
            .involve-input {
              width: 228%;
            }
            .descript-input {
              width: 294%;
            }
            .type-input {
              width: 302%;
            }
            .report-time {
              width: 112% !important;
            }
            .el-date-editor.el-input,
            .el-date-editor.el-input__inner {
              width: 100%;
            }
            .el-input__inner {
              width: 100%;
            }
            .el-input--medium .el-input__inner {
              width: 100%;
            }
          }
          .textarea-content {
            height: 80px;
            .desc-textarea {
              width: 363%;
              .el-textarea__inner {
                height: 75px;
              }
            }
            .el-form-item {
              margin-bottom: 0;
            }
          }
        }
        .baseinfo-title {
          background-color: #eef0f7;
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 500;
        }
        .special::before {
          content: '*';
          color: #e63031;
          margin-right: 4px;
        }
      }
    }
  }
  // .el-dialog__body {
  //   min-height: 700px;
  // }
}
</style>
