<template>
  <el-dialog title="落实" :close-on-click-modal="false" width="750px" class="workable-style" :visible.sync="visible">
    <p class="title">基本信息</p>
    <el-row>
      <el-col :span="12"> <span class="risk-point-title">风险点名称：</span> <span class="risk-point-content">{{businessName}}</span></el-col>
      <el-col :span="12"> <span class="risk-point-title">风险点类型：</span><span class="risk-point-content">{{rangeType | matchType(rangeTypeList)}}</span></el-col>
    </el-row>
    <el-divider></el-divider>
    <p class="title">落实情况（需落实则勾选这一项措施）</p>
    <table class="work-table" width="100%" cellspacing="0">
      <tr>
        <td style="text-align:center">
          <el-checkbox v-model="gloryMeasuresCheck" :disabled="gloryDisabled || type === '1'" @change="gloryChange"></el-checkbox>
        </td>
        <td width="90" style="padding-left:10px;background: #eef0f7;color:#222"><span>工程技术：</span></td>
        <td>
          <el-input class="noborder" :class="gloryMeasures === '暂无措施' ? 'deepglory' : ''" type="textarea" :autosize="{ minRows: 1, maxRows: 2}" placeholder="请输入内容" v-model="gloryMeasures" readonly>
          </el-input>
        </td>
      </tr>
      <tr>
        <td style="text-align:center">
          <el-checkbox v-model="engernnerMeasureCheck" :disabled="engerneerDisabled || type === '1'" @change="engerChange"></el-checkbox>
        </td>
        <td width="90" style="padding-left:10px;background: #eef0f7;color:#222"><span>管理措施：</span></td>
        <td>
          <el-input type="textarea" class="noborder" :class="manageMeasures === '暂无措施' ? 'deepglory' : ''" :autosize="{ minRows: 1, maxRows: 2}" placeholder="请输入内容" v-model="manageMeasures" readonly>
          </el-input>
        </td>
      </tr>
      <tr>
        <td style="text-align:center">
          <el-checkbox v-model="trainMeasuresCheck" :disabled="trainDisabled || type === '1'" @change="trainChange"></el-checkbox>
        </td>
        <td width="90" style="padding-left:10px;background: #eef0f7;color:#222"><span>培训教育：</span></td>
        <td>
          <el-input type="textarea" class="noborder" :class="trainMeasures === '暂无措施' ? 'deepglory' : ''" :autosize="{ minRows: 1, maxRows: 2}" placeholder="请输入内容" v-model="trainMeasures" readonly>
          </el-input>
        </td>
      </tr>
      <tr>
        <td style="text-align:center">
          <el-checkbox v-model="selfMeasuresCheck" :disabled="selfDisabled || type === '1'" @change="selfChange"></el-checkbox>
        </td>
        <td width="90" style="padding-left:10px;background: #eef0f7;color:#222"><span>个体防护：</span></td>
        <td>
          <el-input type="textarea" class="noborder" :class="selfMeasures === '暂无措施' ? 'deepglory' : ''" readonly :autosize="{ minRows: 1, maxRows: 2}" placeholder="请输入内容" v-model="selfMeasures">
          </el-input>
        </td>
      </tr>
      <tr>
        <td style="text-align:center">
          <el-checkbox v-model="emergencyMeasuresCheck" :disabled="emergencyDisabled || type === '1'" @change="emergencyChange"></el-checkbox>
        </td>
        <td width="90" style="padding-left:10px;background: #eef0f7;color:#222"><span>应急处置：</span></td>
        <td>
          <el-input type="textarea" readonly :class="emergencyMeasures === '暂无措施' ?  'deepglory' : ''" class="noborder" :autosize="{ minRows: 1, maxRows: 2}" placeholder="请输入内容" v-model="emergencyMeasures">
          </el-input>
        </td>
      </tr>
    </table>
    <p class="title">建议改正的措施</p>
    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 3}" placeholder="请输入内容" v-model="measuresCorrection" :disabled="type === '1'">
    </el-input>

    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getLabels } from '@/api/common/sys.js'
import { practicableControl } from '@/api/risk/analysis'

export default {
  props: {
    list: {
      type: Object
    }
  },
  data () {
    return {
      visible: false,
      isDisabled: false,
      businessName: '',
      zoneName: '',
      rangeType: '',
      factorList: '',
      id: '',
      type: '',
      gloryMeasuresCheck: false,
      engernnerMeasureCheck: false,
      trainMeasuresCheck: false,
      selfMeasuresCheck: false,
      emergencyMeasuresCheck: false,
      gloryStatus: '',
      manageStatus: '',
      trainStatus: '',
      selfStatus: '',
      emergencyStatus: '',
      gloryDisabled: false,
      engerneerDisabled: false,
      trainDisabled: false,
      selfDisabled: false,
      emergencyDisabled: false,
      gloryMeasures: '',
      manageMeasures: '',
      trainMeasures: '',
      selfMeasures: '',
      emergencyMeasures: '',
      measuresCorrection: '',
      dataRule: {},
      rangeTypeList: []
    }
  },
  created () {
    this.getRiskPoinType()
  },
  methods: {

    // 从字典表获取风险点类型
    getRiskPoinType () {
      getLabels({
        type: 'RANGE_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.rangeTypeList = data.list
        }
      })
    },
    init (tableInfo, type) {
      console.log(type)
      this.isDisabled = false
      this.visible = true
      this.gloryMeasuresCheck = false
      this.engernnerMeasureCheck = false
      this.trainMeasuresCheck = false
      this.selfMeasuresCheck = false
      this.emergencyMeasuresCheck = false
      this.gloryStatus = ''
      this.manageStatus = ''
      this.trainStatus = ''
      this.selfStatus = ''
      this.emergencyStatus = ''
      this.gloryDisabled = false
      this.engerneerDisabled = false
      this.trainDisabled = false
      this.selfDisabled = false
      this.emergencyDisabled = false
      this.measuresCorrection = ''
      this.$nextTick(() => {
        this.businessName = tableInfo.businessName
        this.type = type

        this.rangeType = tableInfo.rangeType
        this.id = tableInfo.id || ''
        this.gloryMeasures = tableInfo.gloryMeasures || '暂无措施'         // 工程技术措施
        this.manageMeasures = tableInfo.manageMeasures || '暂无措施'       // 管理措施
        this.trainMeasures = tableInfo.trainMeasures || '暂无措施'         // 培训教育措施
        this.selfMeasures = tableInfo.selfMeasures || '暂无措施'           // 个体防护措施
        this.emergencyMeasures = tableInfo.emergencyMeasures || '暂无措施' // 应急处置措施
        this.measuresCorrection = tableInfo.measuresCorrection
        if (tableInfo.gloryStatus === '1') {
          this.gloryMeasuresCheck = true
        } else if (tableInfo.gloryStatus === '0') {
          this.gloryMeasuresCheck = false
        }
        if (tableInfo.manageStatus === '1') {
          this.engernnerMeasureCheck = true
        } else if (tableInfo.manageStatus === '0') {
          this.engernnerMeasureCheck = false
        }
        if (tableInfo.trainStatus === '1') {
          this.trainMeasuresCheck = true
        } else if (tableInfo.trainStatus === '0') {
          this.trainMeasuresCheck = false
        }
        if (tableInfo.selfStatus === '1') {
          this.selfMeasuresCheck = true
        } else if (tableInfo.selfStatus === '0') {
          this.selfMeasuresCheck = false
        }
        if (tableInfo.emergencyStatus === '1') {
          this.emergencyMeasuresCheck = true
        } else if (tableInfo.emergencyStatus === '0') {
          this.emergencyMeasuresCheck = false
        }
        if (tableInfo.gloryMeasures === null || tableInfo.gloryMeasures === '') {
          this.gloryDisabled = true
          this.gloryStatus = null
        }
        if (tableInfo.manageMeasures === null || tableInfo.manageMeasures === '') {
          this.engerneerDisabled = true
          this.manageStatus = null
        }
        if (tableInfo.trainMeasures === null || tableInfo.trainMeasures === '') {
          this.trainDisabled = true
          this.trainStatus = null
        }
        if (tableInfo.selfMeasures === null || tableInfo.selfMeasures === '') {
          this.selfDisabled = true
          this.selfStatus = null
        }
        if (tableInfo.emergencyMeasures === null || tableInfo.emergencyMeasures === '') {
          this.emergencyDisabled = true
          this.emergencyStatus = null
        }
      })
    },
    gloryChange (val) {
      if (val === true) {
        this.gloryStatus = '1'
      }
    },
    engerChange (val) {
      if (val === true) {
        this.manageStatus = '1'
      }
    },
    trainChange (val) {
      if (val === true) {
        this.trainStatus = '1'
      }
    },
    selfChange (val) {
      if (val === true) {
        this.selfStatus = '1'
      }
    },
    emergencyChange (val) {
      if (val === true) {
        this.emergencyStatus = '1'
      }
    },

    // 表单提交
    dataFormSubmit () {
      if (this.gloryStatus !== '1' && this.gloryStatus !== null) {
        this.gloryStatus = '0'
      }
      if (this.manageStatus !== '1' && this.manageStatus !== null) {
        this.manageStatus = '0'
      }
      if (this.trainStatus !== '1' && this.trainStatus !== null) {
        this.trainStatus = '0'
      }
      if (this.selfStatus !== '1' && this.selfStatus !== null) {
        this.selfStatus = '0'
      }
      if (this.emergencyStatus !== '1' && this.emergencyStatus !== null) {
        this.emergencyStatus = '0'
      }

      this.isDisabled = true
      practicableControl({
        id: this.id,
        gloryStatus: this.gloryStatus,
        manageStatus: this.manageStatus,
        trainStatus: this.trainStatus,
        selfStatus: this.selfStatus,
        emergencyStatus: this.emergencyStatus,
        measuresCorrection: this.measuresCorrection
      }

      ).then(({ data }) => {
        if (data && data.code === 0) {
          this.visible = false
          this.$emit('refreshDataList')
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 1500,
            onClose: () => { }
          })
        } else {
          this.isDisabled = false
          this.$message.error(data.msg)
        }
      }).catch(err => {
        console.log(err)
        this.isDisabled = false
        this.$message.error('未知异常！请联系管理员')
      })
    }
  },
  filters: {
    matchType (type, value) {
      let typeName = ''
      value.map(item => {
        if (item.label === type) {
          typeName = item.value
        }
      })
      return typeName
    }
  }
}
</script>

<style lang="scss">
.workable-style {
  .el-dialog__body {
    padding-top: 10px;
    .noborder {
      .el-textarea__inner {
        border: 0;
        resize: none;
      }
    }
    .deepglory {
      .el-textarea__inner {
        color: #ccc;
      }
    }
    .title {
      font-size: 12px;
      color: #222;
    }
    .risk-point-title {
      font-size: 12px;
      color: rgba(34, 34, 34, 1);
      opacity: 0.7;
      font-weight: 500;
    }
    .risk-point-content {
      font-size: 12px;
      font-weight: bold;
      color: rgba(34, 34, 34, 1);
    }
    .work-table {
      border: 1px solid #dcdfe6;
      tr {
        td {
          border: 1px solid #dcdfe6;
        }
      }
    }
  }
}
</style>
