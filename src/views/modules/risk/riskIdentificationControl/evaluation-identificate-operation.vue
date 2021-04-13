<template>

  <div>
    <el-dialog title="辨识" :close-on-click-modal="false" class="identificate-style" width="685px" :visible.sync="visible" append-to-body @close="closeDialog">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" class="classes" label-width="65px">
        <el-row :gutter="30">
          <el-col :span="12" class="evluationStyle">
            <el-form-item label="风险评价" prop="evaluationType">
              <el-select v-model="dataForm.evaluationType" placeholder="请选择风险评价类型" clearable :disabled="disableEvaluate" size="mini" @change="change">
                <el-option v-for="item in evaluationTypeList" :label="item.value" :value="item.label" :key="item.label">

                </el-option>

              </el-select>
              <el-tooltip placement="top">
                <div slot="content">1.可选用LS法对作业活动、SCL法对设备设施（安全生产条件）进行危险、有害因素识别和风险评价；<br />2.可选用HAZOP法对危险性工艺进行危险、有害因素识别和风险评价；<br />3.选用其他方法对相关方面进行危险、有害因素识别和风险评价。</div>
                <i class="el-icon-info icontipstyle"></i>
              </el-tooltip>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="复评周期" prop="evaluationCycle">
              <el-select v-model="dataForm.evaluationCycle" placeholder="请选择风险评价周期" clearable size="mini">
                <el-option v-for="item in evaluationCycleList" :label="item.value" :value="item.label" :key="item.label">

                </el-option>

              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <div>
          <h3>基本信息</h3>
          <el-row class="col-style">
            <el-col>风险名称：{{businessName}}</el-col>
          </el-row>
          <el-row class="col-style">
            <el-col>所属区域：{{zoneName}}</el-col>
          </el-row>
          <el-row class="col-style">
            <el-col :span="4" style="width:11.66667%">风险因素：</el-col>
            <el-col :span="20">
              <p v-for="(item,index) in factorCollectionName" :key="index" style="margin-bottom:5px;margin-top:0">{{item}}</p>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <indentification-lec-Operation v-if="dataForm.evaluationType === '1' && lecVisible" ref="lecOperation">
      </indentification-lec-Operation>
      <indentification-ls-operation v-if="dataForm.evaluationType === '0' && lsVisible" ref="lsOperation">
      </indentification-ls-operation>
      <indentification-mes-operation v-if="dataForm.evaluationType === '3' && mesVisible" ref="mesOperation"></indentification-mes-operation>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancle">取消</el-button>
        <el-button type="primary" :disabled="isDisabled" @click="dataFormSubmit()">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getLabels } from '@/api/common/sys'
import indentificationLecOperation from './components/indentification-lec-operation'
import indentificationLsOperation from './components/indentification-ls-operation'
import { riskPointEvaluate } from '@/api/risk/analysis'
import indentificationMesOperation from './components/indentification-mes-operation'
export default {
  data () {
    return {
      lecVisible: true,
      lsVisible: true,
      mesVisible: true,
      emergencyMeasures: '',
      gloryMeasures: '',
      manageMeasures: '',
      selfMeasures: '',
      trainMeasures: '',
      visible: false,
      isDisabled: false,
      businessName: '',
      id: '',
      disableEvaluate: false,
      zoneName: '',
      zoneCode: '',
      rangeType: '',
      factorCollectionName: '',
      factorMainName: '',
      dataForm: {
        evaluationType: '0',
        evaluationCycle: ''
      },
      evaluationTypeList: [], // 评价法类型
      evaluationCycleList: [], // 评价周期
      dataRule: {
        evaluationType: [
          { required: true, message: '风险评价类型不能为空', trigger: 'change' }
        ],
        evaluationCycle: [
          { required: true, message: '风险评价周期不能为空', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    indentificationLecOperation,
    indentificationLsOperation,
    indentificationMesOperation
  },
  created () {

  },
  methods: {
    closeDialog () {
      this.lecVisible = false
      this.lsVisible = false
      this.mesVisible = false
    },
    // 加载基础数据
    getBaseData () {
      // 风险点类型- 字典
      getLabels({
        'type': 'RANGE_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.rangeTypeList = data.list
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      }).catch(err => console.log(err))
      // 评价法类型 - 字典
      getLabels({
        'type': 'EVALUATION_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.evaluationTypeList = data.list
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      }).catch(err => console.log(err))
      // 评价法周期 - 字典
      getLabels({
        'type': 'EVALUATION_CYCLE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.evaluationCycleList = data.list
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      }).catch(err => console.log(err))
    },
    init (info) {
      this.getBaseData()
      this.emergencyMeasures = info.emergencyMeasures
      this.gloryMeasures = info.gloryMeasures
      this.manageMeasures = info.manageMeasures
      this.selfMeasures = info.selfMeasures
      this.trainMeasures = info.trainMeasures
      this.visible = true
      this.businessName = info.businessName
      this.id = info.id
      this.zoneName = info.zoneName
      this.zoneCode = info.zoneCode
      this.rangeType = info.rangeType
      this.lsVisible = true
      this.mesVisible = true
      this.lecVisible = true
      if (info.evaluationType !== null && info.evaluateStatus === '1') {
        this.dataForm.evaluationType = info.evaluationType
        this.disableEvaluate = true
      } else {
        this.disableEvaluate = false
        this.evaluationTypeList = '0'
      }
      this.factorMainName = this.handle(info.factorList)
      this.factorCollectionName = this.handleDanger(info.factorList)
    },
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
        return factorDangerList
      } else {
        return '暂无'
      }
    },
    change (val) {

    },
    // 表单提交
    dataFormSubmit () {
      let flag = true

      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          flag = false
        }
      })
      if (this.dataForm.evaluationType === '1' && this.lecVisible) {
        this.$refs.lecOperation.$refs['dataFormone'].validate((valid) => {
          if (!valid) {
            flag = false
          }
        })
        this.$refs.lecOperation.$refs['dataFormtwo'].validate((valid) => {
          if (!valid) {
            flag = false
          }
        })
      } else if (this.dataForm.evaluationType === '0' && this.lsVisible) {
        this.$refs.lsOperation.$refs['dataFormone'].validate((valid) => {
          if (!valid) {
            flag = false
          }
        })
        this.$refs.lsOperation.$refs['dataFormtwo'].validate(valid => {
          if (!valid) {
            flag = false
          }
        })
      } else if (this.dataForm.evaluationType === '3' && this.mesVisible) {
        this.$refs.mesOperation.$refs['dataFormone'].validate((valid) => {
          if (!valid) {
            flag = false
          }
        })
        this.$refs.mesOperation.$refs['dataFormtwo'].validate((valid) => {
          if (!valid) {
            flag = false
          }
        })
      }

      if (flag) {
        var content
        var riskDegree
        if (this.dataForm.evaluationType === '1' && this.lecVisible) {
          content = this.$refs.lecOperation.dataForm.likelihoodScore + '/' + this.$refs.lecOperation.dataForm.exposureScore + '/' + this.$refs.lecOperation.dataForm.maxScore + '/' + this.$refs.lecOperation.dataForm.resultScore
          riskDegree = this.$refs.lecOperation.dataForm.riskDegree
        } else if (this.dataForm.evaluationType === '0' && this.lsVisible) {
          content = this.$refs.lsOperation.dataForm.likelihoodScore + '/' + this.$refs.lsOperation.dataForm.maxScore + '/' + this.$refs.lsOperation.dataForm.resultScore
          riskDegree = this.$refs.lsOperation.dataForm.riskDegree
        } else if (this.dataForm.evaluationType === '3' && this.mesVisible) {
          content = this.$refs.mesOperation.dataForm.likelihood + '/' + this.$refs.mesOperation.dataForm.exposure + '/' + this.$refs.mesOperation.dataForm.maxScore + '/' + this.$refs.mesOperation.dataForm.resultScore
          riskDegree = this.$refs.mesOperation.dataForm.riskDegree
        }
        var facilitiesAnalysisEntity = {
          id: this.id,
          rangeType: this.rangeType,
          zoneName: this.zoneName,
          zoneCode: this.zoneCode,
          businessName: this.businessName,
          factorCollectionName: this.factorCollectionName.join(','),
          factorMainName: this.factorMainName,
          evaluationCycle: this.dataForm.evaluationCycle,
          evaluationType: this.dataForm.evaluationType,
          content: content,
          riskDegree: riskDegree,
          emergencyMeasures: this.emergencyMeasures,
          gloryMeasures: this.gloryMeasures,
          manageMeasures: this.manageMeasures,
          selfMeasures: this.selfMeasures,
          trainMeasures: this.trainMeasures
        }
        this.isDisabled = true
        riskPointEvaluate(facilitiesAnalysisEntity).then(({ data }) => {
          if (data && data.code === 0) {
            this.$refs.dataForm.resetFields()
            // if (this.dataForm.evaluationType === '1' && this.lecVisible) {
            //   this.$nextTick(() => {
            //     this.$refs.lecOperation.$refs.dataFormone.resetFields()
            //     this.$refs.lecOperation.$refs.dataFormtwo.resetFields()
            //   })
            // } else if (this.dataForm.evaluationType === '0' && this.lsVisible) {
            //   this.$nextTick(() => {
            //     this.$refs.lsOperation.$refs.dataFormone.resetFields()
            //     this.$refs.lsOperation.$refs.dataFormtwo.resetFields()
            //   })
            // } else if (this.dataForm.evaluationType === '3' && this.mesVisible) {
            //   this.$nextTick(() => {
            //     this.$refs.mesOperation.$refs.dataFormone.resetFields()
            //     this.$refs.mesOperation.$refs.dataFormtwo.resetFields()
            //   })
            // }
            this.visible = false
            this.isDisabled = false
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
      } else {
        this.$message.error('请输入完整信息!')
      }
    },
    cancle () {
      this.$refs.dataForm.resetFields()

      this.visible = false
    }
  }
}
</script>
<style lang="scss">
.identificate-style {
  .evluationStyle {
    position: relative;
    .icontipstyle {
      position: absolute;
      top: 7px;
      left: 236px;
    }
  }
  .col-style {
    margin-bottom: 5px;
    .el-col-4 {
      width: 13.66667%;
    }
  }
}
</style>