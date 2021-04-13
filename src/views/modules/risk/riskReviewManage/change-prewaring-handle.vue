<template>
  <el-dialog title="管控" :close-on-click-modal="false" width="650px" class="control-dialog" :visible.sync="visible">
    <p>基本信息</p>
    <el-row>
      <el-col>风险点名称：{{businessName}}</el-col>
      <!-- <el-col :span="20"></el-col> -->
    </el-row>
    <el-row>
      <el-col>风险点类型：{{rangeType | matchType(rangeTypeList)}}</el-col>
      <!-- <el-col :span="20"></el-col> -->
    </el-row>
    <el-row>
      <el-col>所属区域：{{zoneName}}</el-col>
    </el-row>
    <p>风险变更前管控措施：</p>
    <table border="1" cellspacing="0" class="control-table">
      <tr>
        <td class="first-cell">工程技术</td>
        <td>
          <el-input type="textarea" :disabled="type === '1'" :autosize="{ minRows: 1, maxRows: 2}" v-model="gloryMeasures" readonly :class="gloryMeasures === '暂无措施' ? 'noSpecialStyle' : ''">
          </el-input>
        </td>
      </tr>
      <tr>
        <td class="first-cell">管理措施</td>
        <td>
          <el-input type="textarea" :disabled="type === '1'" :autosize="{ minRows: 1, maxRows: 2}" v-model="manageMeasures" readonly :class="manageMeasures === '暂无措施' ? 'noSpecialStyle' : ''"> </el-input>
        </td>
      </tr>
      <tr>
        <td class="first-cell">培训教育</td>
        <td>
          <el-input type="textarea" :disabled="type === '1'" :autosize="{ minRows: 1, maxRows: 2}" v-model="trainMeasures" readonly :class="trainMeasures === '暂无措施' ? 'noSpecialStyle' : ''"></el-input>
        </td>
      </tr>
      <tr>
        <td class="first-cell">个体防护</td>
        <td>
          <el-input type="textarea" :disabled="type === '1'" :autosize="{ minRows: 1, maxRows: 2}" v-model="selfMeasures" readonly :class="selfMeasures === '暂无措施' ? 'noSpecialStyle' : ''"></el-input>
        </td>
      </tr>
      <tr>
        <td class="first-cell">应急处置</td>
        <td>
          <el-input type="textarea" :disabled="type === '1'" :autosize="{ minRows: 1, maxRows: 2}" v-model="emergencyMeasures" readonly :class="emergencyMeasures === '暂无措施' ? 'noSpecialStyle' : ''"></el-input>
        </td>
      </tr>
    </table>
    <p>风险变更后管控措施：</p>

    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="100px">

      <el-form-item label="工程技术措施：" prop="gloryMeasures">
        <el-input type="textarea" :disabled="type === '1'" :autosize="{ minRows: 1, maxRows: 2}" placeholder="请输入内容" v-model="dataForm.gloryMeasures">
        </el-input>
      </el-form-item>
      <el-form-item label="管理措施：" prop="manageMeasures">
        <el-input type="textarea" :disabled="type === '1'" :autosize="{ minRows: 1, maxRows: 2}" placeholder="请输入内容" v-model="dataForm.manageMeasures">
        </el-input>
      </el-form-item>
      <el-form-item label="培训教育措施：" prop="trainMeasures">
        <el-input type="textarea" :disabled="type === '1'" :autosize="{ minRows: 1, maxRows: 2}" placeholder="请输入内容" v-model="dataForm.trainMeasures">
        </el-input>
      </el-form-item>
      <el-form-item label="个体防护措施：" prop="selfMeasures">
        <el-input type="textarea" :disabled="type === '1'" :autosize="{ minRows: 1, maxRows: 2}" placeholder="请输入内容" v-model="dataForm.selfMeasures">
        </el-input>
      </el-form-item>
      <el-form-item label="应急处置措施：" prop="emergencyMeasures">
        <el-input type="textarea" :disabled="type === '1'" :autosize="{ minRows: 1, maxRows: 2}" placeholder="请输入内容" v-model="dataForm.emergencyMeasures">
        </el-input>
      </el-form-item>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { riskChangeControl } from '@/api/risk/inventory'
import { getLabels } from '@/api/common/sys.js'

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
      type: '',
      zoneName: '',
      rangeType: '',
      factorList: '',
      gloryMeasures: '', // 工程技术措施
      manageMeasures: '', // 管理措施
      trainMeasures: '', // 培训教育措施
      selfMeasures: '', // 个体防护措施
      emergencyMeasures: '', // 应急处置措施
      dataForm: {
        id: '',
        gloryMeasures: '', // 工程技术措施
        manageMeasures: '', // 管理措施
        trainMeasures: '', // 培训教育措施
        selfMeasures: '', // 个体防护措施
        emergencyMeasures: '', // 应急处置措施
        facilitiesId: ''
      },
      dataRule: {},
      rangeTypeList: []
    }
  },
  created () {
    this.getRiskPoinType()
  },
  methods: {
    // 处理数据
    handle (val) {
      if (val.length > 0) {
        let factorMainNameList = []
        val.map(item => {
          if (factorMainNameList.indexOf(item.factorMainName) === -1) {
            factorMainNameList.push(item.factorMainName)
          }
        })
        return factorMainNameList.join(',')
      } else {
        return '暂无'
      }
    },
    handleDanger (val) {
      if (val.length > 0) {
        let factorDangerList = []
        val.map(item => {
          if (factorDangerList.indexOf(item.factorDangerList) === -1) {
            factorDangerList.push(item.factorDanger)
          }
        })
        factorDangerList = factorDangerList.map((item, index) => {
          item = (index + 1) + '.' + item
          return item
        })
        // let reg = /[;；]/g
        // factorDangerList = factorDangerList.replace(reg, '$&\r\n')
        // console.log(factorDangerList)
        return factorDangerList
      } else {
        return '暂无'
      }
    },
    handleControl (val) {
      if (val.length > 0) {
        let factorControlList = []
        val.map(item => {
          if (factorControlList.indexOf(item.factorControlString) === -1) {
            factorControlList.push(item.factorControlString)
          }
        })
        factorControlList = factorControlList.map((item, index) => {
          item = (index + 1) + '.' + item
          return item
        })
        // let reg = /[;；]/g
        // factorDangerList = factorDangerList.replace(reg, '$&\r\n')
        // console.log(factorDangerList)
        return factorControlList
      } else {
        return '暂无'
      }
    },
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
      console.log(tableInfo, 'shshshhs')
      this.isDisabled = false
      this.visible = true

      this.$nextTick(() => {
        this.factorList = tableInfo.factorList
        this.businessName = tableInfo.businessName
        this.rangeType = tableInfo.rangeType
        this.type = type
        this.zoneName = tableInfo.zoneName
        this.dataForm.id = tableInfo.id || ''
        this.dataForm.facilitiesId = tableInfo.facilitiesId || '暂无措施'
        this.gloryMeasures = tableInfo.gloryMeasures || '暂无措施'         // 工程技术措施
        this.manageMeasures = tableInfo.manageMeasures || '暂无措施'       // 管理措施
        this.trainMeasures = tableInfo.trainMeasures || '暂无措施'         // 培训教育措施
        this.selfMeasures = tableInfo.selfMeasures || '暂无措施'           // 个体防护措施
        this.emergencyMeasures = tableInfo.emergencyMeasures || '暂无措施' // 应急处置措施
      })
    },

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isDisabled = true
          riskChangeControl(
            this.dataForm
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
.control-dialog {
  .el-row {
    margin-bottom: 10px;
  }
  .el-dialog .el-form {
    padding-right: 0;
  }
  .el-dialog__body {
    padding: 0px 20px;
    .control-table {
      width: 100%;
      border-color: #ccc;
      .first-cell {
        // height: 50px;
        width: 96px;
        padding-left: 10px;
        background-color: #eef0f7;
        color: #222;
      }
      .noSpecialStyle {
        .el-textarea__inner {
          color: #ccc !important;
        }
      }
    }
  }
}
</style>
