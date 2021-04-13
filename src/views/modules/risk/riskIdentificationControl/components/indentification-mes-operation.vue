
<template>
  <div class="bianshiStyle">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormone" label-position="top" label-width="200px">
      <div>
        <h3>风险程度分析法（MES）：</h3>
        <p style="text-indent:28px">将控制措施的状态M、暴露的频繁程度E（E1或E2）、一旦发生事故会造成的损失后果S分别分为若干等级，并赋予一定的相应分值。风险程度R为三者的乘积。将R亦分为若干等级。针对特定的作业条件，恰当选取M、E、S的值，根据相乘后的积确定风险程度R的级别。<span style="color:#E63031">即:R=M×E×S。</span></p>
        <el-form-item label="控制措施的状态（M）：" prop="likelihood" class="likeliHood-style">
          <el-select v-model="dataForm.likelihood" size="mini" clearable>
            <el-option v-for="item in likelihoodList" :key="item.label" :value="item.label" :label="item.value"></el-option>
          </el-select>
          <!-- <el-input v-model="dataForm.likelihood" placeholder="控制措施的状态" @focus="selectChoose('likelihood',dataForm.likelihoodScore)" size="mini">
            <el-button slot="append" @click="selectChoose('likelihood',dataForm.likelihoodScore)">
              选择
            </el-button>
          </el-input> -->
        </el-form-item>

        <el-form-item label="人体暴露或危险状态出现的频繁程度（E）：" prop="exposure" class="likeliHood-style">
          <el-radio v-model="selectDegree" label="0">人身伤害和职业相关病症</el-radio>
          <el-radio v-model="selectDegree" label="1">财产损失和环境污染</el-radio>
          <el-select v-model="dataForm.exposure" size="mini" clearable v-if="selectDegree === '0'">
            <el-option v-for="item in exposureListPerson" :key="item.label" :value="item.label" :label="item.value"></el-option>
          </el-select>
          <el-select v-model="dataForm.exposure" size="mini" clearable v-if="selectDegree === '1'">
            <el-option v-for="item in exposureListOther" :key="item.label" :value="item.label" :label="item.value"></el-option>
          </el-select>
          <!-- <el-input v-model="dataForm.exposure" placeholder="暴露于危险环境的频繁程度" @focus="selectChoose('exposure',dataForm.exposureScore)" size="mini">
            <el-button slot="append" @click="selectChoose('exposure',dataForm.exposureScore)">
              选择
            </el-button>
          </el-input> -->
        </el-form-item>
      </div>
    </el-form>
    <div class="result-title">事故的可能后果（S）：</div>
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormtwo" label-position="left" class="specialForm" label-width="200px">
      <div>
        <el-form-item label="伤害" prop="lawRegular">
          <el-select v-model="dataForm.lawRegular" size="mini" clearable @change="compareChange">
            <el-option v-for="item in legalList" :key="item.label" :value="item.label" :label="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="职业相关病症" prop="personInjury">
          <el-select v-model="dataForm.personInjury" size="mini" clearable @change="compareChange">
            <el-option v-for="item in personInjuryList" :key="item.label" :value="item.label" :label="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="财产损失（元）" prop="economicLoss">
          <el-select v-model="dataForm.economicLoss" size="mini" clearable @change="compareChange()">
            <el-option v-for="item in economicLossList" :key="item.label" :value="item.label" :label="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="环境影响" prop="stopWOrk">
          <el-select v-model="dataForm.stopWOrk" size="mini" clearable @change="compareChange()">
            <el-option v-for="item in stopWorkList" :key="item.label" :value="item.label" :label="item.value"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="result">
      <p>风险程度（R）:</p>
      <div class="result-content">
        <div class="imgStyle">
          <div class="outline"><span class="top-yuanhu" :style="{borderColor: result === '重大风险' && '#e63031' || result === '较大风险' && '#f48400' || result === '一般风险' && '#f1dd00' || result === '低风险' && '#00b0f0'}"></span></div>
          <span class="center-color" :style="{background: result === '重大风险' && '#e63031' || result === '较大风险' && '#f48400' || result === '一般风险' && '#f1dd00' || result === '低风险' && '#00b0f0'}"></span>
          <div class="bottomOutline"><span class="bottom-yuanhu" :style="{borderColor: result === '重大风险' && '#e63031' || result === '较大风险' && '#f48400' || result === '一般风险' && '#f1dd00' || result === '低风险' && '#00b0f0'}"></span></div>
          <icon-svg name="riskdegree" class="risk-icon"></icon-svg>
        </div>
        <span class="line"></span>
        <div class="character-content" v-if="result === '重大风险'">
          <div style="margin-bottom: 7px;">
            <span class="degree-block"></span>
            <span class="degree-block"></span>
            <span class="degree-block"></span>
            <span class="degree-block"></span>
            <span class="risk-score">>180</span>
            <span class="risk-degree">重大风险</span>
          </div>
          <div style="margin-bottom: 7px;">
            <span style="color:rgba(34,34,34,1); font-size:12px; opacity:0.7;">--安全风险等级：</span>
            <span class="measure">A/1级 </span>
            <span class="measure">极其危险</span>

          </div>
          <div style="margin-bottom: 7px;">
            <span style="color:rgba(34,34,34,1);opacity:0.7;font-size:12px;">--应采取的管控级别：</span>
            <span class="measure">公司（厂）级、车间(部室)级、班组、岗位管控</span>
          </div>
          <div style="margin-bottom: 7px;">
            <span style="color:rgba(34,34,34,1);opacity:0.7;font-size:12px;">--实施管控措施：</span>
            <span class="measure">立即补充管控措施，以期降低风险级别，定期检查、测量及评估</span>
          </div>
        </div>
        <div class="character-content" v-else-if="result === '较大风险'">
          <div style="margin-bottom: 7px;">
            <span class="orange-block"></span>
            <span class="orange-block"></span>
            <span class="orange-block"></span>
            <span class="white-block"></span>
            <span class="risk-score">91～180</span>
            <span class="risk-degree">较大风险</span>
          </div>
          <div style="margin-bottom: 7px;">
            <span style="color:rgba(34,34,34,1); font-size:12px; opacity:0.7;">--安全风险等级：</span>
            <span class="measure">B/2级 </span>
            <span class="measure">高度危险</span>

          </div>
          <div style="margin-bottom: 7px;">
            <span style="color:rgba(34,34,34,1);opacity:0.7;font-size:12px;">--应采取的管控级别：</span>
            <span class="measure">公司（厂）级、车间(部室)级、班组、岗位管控</span>
          </div>
          <div style="margin-bottom: 7px;">
            <span style="color:rgba(34,34,34,1);opacity:0.7;font-size:12px;">--实施管控措施：</span>
            <span class="measure">立即或近期补充管控措施，
              定期检查、测量及评估</span>
          </div>
        </div>
        <div class="character-content" v-else-if="result === '一般风险'">
          <div style="margin-bottom: 7px;">
            <span class="yellow-block"></span>
            <span class="yellow-block"></span>
            <span class="white-block"></span>
            <span class="white-block"></span>
            <span class="risk-score">51～90</span>
            <span class="risk-degree">一般风险</span>
          </div>
          <div style="margin-bottom: 7px;">
            <span style="color:rgba(34,34,34,1); font-size:12px; opacity:0.7;">--安全风险等级：</span>
            <span class="measure">C/3级 </span>
            <span class="measure">显著危险</span>

          </div>
          <div style="margin-bottom: 7px;">
            <span style="color:rgba(34,34,34,1);opacity:0.7;font-size:12px;">--应采取的管控级别：</span>
            <span class="measure">车间(部室)级、班组、岗位管控</span>
          </div>
          <div style="margin-bottom: 7px;">
            <span style="color:rgba(34,34,34,1);opacity:0.7;font-size:12px;">--实施管控措施：</span>
            <span class="measure">建立目标、建立操作规程，加强培训及沟通</span>
          </div>
        </div>
        <div class="character-content" v-else-if="result === '低风险'">
          <div style="margin-bottom: 7px;">
            <span class="blue-block"></span>
            <span class="white-block"></span>
            <span class="white-block"></span>
            <span class="white-block"></span>
            <span class="risk-score">
              &lt;50</span> <span class="risk-degree">低风险
            </span>
          </div>
          <div style="margin-bottom: 7px;">
            <span style="color:rgba(34,34,34,1); font-size:12px; opacity:0.7;">--安全风险等级：</span>
            <span class="measure">D/4级 </span>
            <span class="measure">轻度危险</span>

          </div>
          <div style="margin-bottom: 7px;">
            <span style="color:rgba(34,34,34,1);opacity:0.7;font-size:12px;">--应采取的管控级别：</span>
            <span class="measure">班组、岗位管控</span>
          </div>
          <div style="margin-bottom: 7px;">
            <span style="color:rgba(34,34,34,1);opacity:0.7;font-size:12px;">--实施管控措施：</span>
            <span class="measure">有条件、有经费时完善管控措施</span>
          </div>
        </div>
        <div class="character-content" v-else>
          <div style="margin-bottom: 7px;">
            <span class="white-block"></span>
            <span class="white-block"></span>
            <span class="white-block"></span>
            <span class="white-block"></span>
            <span style="font-size:12px;
font-family:PingFang SC;
font-weight:500;
color:rgba(200,206,213,1)">选择LEC，获得风险值
            </span>
          </div>
          <div style="margin-bottom: 7px;">
            <span style="color:rgba(34,34,34,1); font-size:12px; opacity:0.7;">--安全风险等级：</span>
            <span class="measure"> </span>
            <span class="measure"></span>

          </div>
          <div style="margin-bottom: 7px;">
            <span style="color:rgba(34,34,34,1);opacity:0.7;font-size:12px;">--应采取的管控级别：</span>
            <span class="measure"></span>
          </div>
          <div style="margin-bottom: 7px;">
            <span style="color:rgba(34,34,34,1);opacity:0.7;font-size:12px;">--实施管控措施：</span>
            <span class="measure"></span>
          </div>
        </div>
      </div>

    </div>
    <lec-select-table v-if="selectVisible" ref="selectRef" @selectEmit="select"></lec-select-table>
  </div>

</template>

<script>
// eslint-disable-next-line no-unused-vars
import { identificationAdd } from '@/api/risk/inventory'
import lecSelectTable from './lec-select-table'
export default {
  // props: {
  //   list: {
  //     type: Object
  //   }
  // },
  data () {
    let validSelect = (rule, value, callback) => {
      if (this.dataForm.lawRegular || this.dataForm.personInjury || this.dataForm.economicLoss || this.dataForm.stopWOrk) {
        callback()
      } else {
        return callback(new Error('至少选择一项'))
      }
    }
    return {
      selectDegree: '0',
      visible: false,
      isDisabled: false,
      selectVisible: false,
      name: '', // 风险名称
      riskFactor: '', // 风险因素
      legalList: [{ label: '1', value: '（1分）轻微，仅需急救' },
      { label: '2', value: '（2分）需医院治疗，缺工' },
      { label: '4', value: '（4分）永久失能（一人）' },
      { label: '8', value: '（8分）有一人死亡或多人永久失能' },
      { label: '10', value: '（10分）有多人死亡' }
      ],

      exposureListPerson: [{ label: '0.5', value: '（0.5分）更少的暴露' },
      { label: '1', value: '（1分）每年几次暴露' },
      { label: '2', value: '（2分）每月一次暴露' },
      { label: '3', value: '（3分）每周一次或偶然暴露' }, {
        label: '6', value: '（6分）每天工作时间内暴露'
      }, {
        label: '10', value: '（10分）连续暴露'
      }],
      exposureListOther: [{ label: '0.5', value: '（0.5分）更少的出现' },
      { label: '1', value: '（1分）每年几次出现' },
      { label: '2', value: '（2分）每月一次出现' },
      { label: '3', value: '（3分）每周一次，或偶然出现' }, {
        label: '6', value: '（6分）每天工作时间出现'
      }, {
        label: '10', value: '（10分）常态'
      }],
      likelihoodList: [{
        label: '1', value: '(1分)有预防措施，如机器防护装置等，但须保证有效'
      }, {
        label: '3', value: '(3分)有减轻后果的应急措施，如警报系统、个体防护用品'
      }, {
        label: '5', value: '(5分)无控制措施'
      }],
      personInjuryList: [{ label: '1', value: '（1分）职业因素引起的身体不适' },
      { label: '2', value: '（2分）职业性多发病' },
      { label: '4', value: '（4分）职业病（一人）' },
      { label: '8', value: '（8分）职业病（多人）' },
      { label: '10', value: '（10分）有多人死亡' }],
      economicLossList: [{ label: '1', value: '（1分）＜1万' },
      { label: '2', value: '（2分）1万—10万' },
      { label: '4', value: '（4分）10万—100万' },
      { label: '8', value: '（8分）100万—1000万' },
      { label: '10', value: '（10分）＞1千万' }],
      stopWorkList: [{ label: '1', value: '（1分）无环境影响' },
      { label: '2', value: '（2分）有局部环境影响的可控排放' },
      { label: '4', value: '（4分）有较轻环境影响的不可控排放' },
      { label: '8', value: '（8分）有中等环境影响的不可控排放' },
      { label: '10', value: '（10分）有重大环境影响的不可控排放' }],
      corporateImageList: [
        { label: '1', value: '（1分）本岗位或作业点' },
        { label: '3', value: '（3分）本车间、部门' }, {
          label: '7', value: '（7分）本企业'
        }, {
          label: '15', value: '（15分）区域影响'
        }, {
          label: '40', value: '（40分）同行业影响'
        }, {
          label: '100', value: '（100分）重大国际或国内影响'
        }
      ],

      dataForm: {
        likelihood: '',
        likelihoodScore: '',
        exposureScore: '',
        exposure: '',
        criticality: '',
        dangerDegree: '',
        measures: '',
        expose: '',
        consequence: '',
        riskDegree: '',
        lawRegular: '',
        personInjury: '',
        economicLoss: '',
        stopWOrk: '',
        corporateImage: '',
        maxScore: '',
        resultScore: ''
      },

      dangerDegreeValue: '',
      riskDegreeValue: '',
      typeFlag: '',
      dangerDegreeList: [],
      dataRule: {
        likelihood: [
          { required: true, message: '事故发生的可能性不能为空', trigger: 'change' }
        ],
        exposure: [
          { required: true, message: '暴露于危险环境的频繁程度不能为空', trigger: 'change' }
        ],
        criticality: [
          { required: true, message: '发生事故产生的后果不能为空', trigger: 'change' }
        ],
        measures: [
          { required: true, message: '控制措施的状态不能为空', trigger: 'change' }
        ],
        expose: [
          { required: true, message: '危险环境频繁程度 / 状态出现频次不能为空', trigger: 'change' }
        ],
        consequence: [
          { required: true, message: '事故可能产生的后果不能为空', trigger: 'change' }
        ],
        lawRegular: [
          { required: true, validator: validSelect, trigger: 'change' }
        ],
        personInjury: [
          { required: true, validator: validSelect, trigger: 'change' }
        ],
        economicLoss: [
          { required: true, validator: validSelect, trigger: 'change' }
        ],
        stopWOrk: [
          { required: true, validator: validSelect, trigger: 'change' }
        ],
        corporateImage: [
          { required: true, validator: validSelect, trigger: 'change' }
        ]

      }
    }
  },
  components: {
    lecSelectTable
  },

  methods: {

    compareChange (val) {

    },

    // 选择框change事件
    handleChange () {

    },
    selectChoose (type, score) {
      this.selectVisible = true
      this.$nextTick(() => {
        this.$refs.selectRef.init(type, score)
      })
    },
    // 回显选择

    select (val, type) {
      if (type === 'likelihood') {
        this.dataForm.likelihood = val.standard
        this.dataForm.likelihoodScore = val.score
      } else if (type === 'exposure') {
        this.dataForm.exposure = val.rate
        this.dataForm.exposureScore = val.score
      }
    },
    handleChangeMes () {
      if (this.dataForm.measures && this.dataForm.expose && this.dataForm.consequence) {
        let riskDegreeValue = Number(this.dataForm.measures) * Number(this.dataForm.expose) * Number(this.dataForm.consequence)
        this.liskMatch(riskDegreeValue)
      }
    },

    // 数据处理之风险程度匹配
    degreeMatch (value) {
      this.list.dangerDegreeList.map(val => {
        if (val.label === value) {
          this.riskDegreeValue = val.value
          this.dataForm.riskDegree = val.label

          return
        }
        if (value && val.label.indexOf('>') !== -1) {
          if (value > Number(val.label.substring(1, val.length))) {
            this.dangerDegreeValue = val.value
            this.dataForm.dangerDegree = val.label
          }
        } else if (value && val.label.indexOf('-') !== -1) {
          if (value >= Number(val.label.substring(0, val.label.indexOf('-'))) && value <= Number(val.label.substring(val.label.indexOf('-') + 1, val.label.length))) {
            this.dangerDegreeValue = val.value
            this.dataForm.dangerDegree = val.label
          }
        } else if (value && val.label.indexOf('<') !== -1) {
          if (value && value < Number(val.label.substring(1, val.length))) {
            this.dangerDegreeValue = val.value
            this.dataForm.dangerDegree = val.label
          }
        }
      })
    },

    // 初始化赋值的时候做匹配处理
    getDangerValue (value) {
      this.dataForm.dangerDegree = value
      this.list.dangerDegreeList.map(val => {
        if (val.label === value) {
          this.dangerDegreeValue = val.value
        }
      })
    },

    getRiskValue (value) {
      this.dataForm.riskDegree = value
      this.list.riskList.map(val => {
        if (val.label === value) {
          this.riskDegreeValue = val.value
        }
      })
    }
  },
  computed: {
    result () {
      if (this.dataForm.likelihood && this.dataForm.exposure && (this.dataForm.lawRegular || this.dataForm.personInjury || this.dataForm.economicLoss || this.dataForm.stopWOrk)) {
        let arr = [this.dataForm.lawRegular, this.dataForm.personInjury, this.dataForm.economicLoss, this.dataForm.stopWOrk]
        let max = Math.max(...arr)
        this.dataForm.maxScore = max
        let result = (Number(this.dataForm.likelihood) * Number(this.dataForm.exposure) * max).toFixed(2)
        this.dataForm.resultScore = result
        if (result > 180) {
          this.dataForm.riskDegree = 'A'
          return '重大风险'
        } else if (result >= 91 && result <= 180) {
          this.dataForm.riskDegree = 'B'
          return '较大风险'
        } else if (result >= 51 && result <= 90) {
          this.dataForm.riskDegree = 'C'

          return '一般风险'
        } else if (result <= 50) {
          this.dataForm.riskDegree = 'D'

          return '低风险'
        }
      }
    }
  }
}
</script>

<style lang="scss">
.bianshiStyle {
  .el-dialog__body {
    padding: 0 20px;
  }
  .likeliHood-style {
    .el-form-item__label {
      font-size: 14px;
      color: #222;
    }
  }
  .result-title {
    margin-bottom: 10px;
    color: #222;
  }
  .result-title:before {
    content: '*';
    color: #e63031;
    margin-right: 4px;
  }
  .specialForm {
    .el-form-item {
      margin-bottom: 0 !important;
      border: 1px solid #c0c4cc;
      // padding-left: 10px;
      text-indent: 10px;
      border-bottom: none;
    }
    .el-form-item:last-child {
      border-bottom: 1px solid #c0c4cc;
    }
    .el-input {
      width: 97%;
    }
    .el-input__inner {
      border-radius: 0;
      border: 0;
      padding: 0 !important;
      // border-right: 1px solid #c0c4cc;
      // border-left: 1px solid #c0c4cc;
    }
    .el-input__suffix {
      right: -10px;
    }
    label.el-form-item__label {
      background: #f5f7fa;
      border-right: 1px solid #c0c4cc;
    }
    .el-input__inner:focus {
      // border-left: 1px solid #c0c4cc;
    }
    .el-form-item.is-required:not(.is-no-asterisk)
      .el-form-item__label-wrap
      > .el-form-item__label:before,
    .el-form-item.is-required:not(.is-no-asterisk)
      > .el-form-item__label:before {
      display: none;
    }
  }
  .result {
    p {
      margin-bottom: 0px;
    }
    .result-content {
      display: flex;
      .imgStyle {
        position: relative;
        width: 197px;
        text-align: center;
        background: url(~@/assets/img/circle.png);
        .risk-icon {
          width: 104px;
          height: 57px;
          margin: 26px;
        }
        .outline {
          position: absolute;
          top: 20px;
          left: 71px;
          width: 60px;
          height: 10px;
          overflow: hidden;
          // background: yellow;
        }
        .top-yuanhu {
          position: absolute;
          top: 3px;
          left: -9px;
          display: inline-block;
          width: 73px;
          height: 73px;
          border: 2px solid #ecf1f6;
          border-radius: 50%;
        }
        .center-color {
          position: absolute;
          display: inline-block;
          width: 40px;
          height: 9px;
          top: 65px;
          left: 78px;
          background-color: #ecf1f6;
        }
        .bottomOutline {
          position: absolute;
          top: 84px;
          left: 71px;
          width: 72px;
          height: 10px;
          overflow: hidden;
          // background: yellow;
          -webkit-transform: rotate(180deg);
          transform: rotate(180deg);
        }
        .bottom-yuanhu {
          position: absolute;
          top: 1px;
          left: 8px;
          display: inline-block;
          width: 73px;
          height: 73px;
          border: 2px solid #ecf1f6;
          border-radius: 50%;
        }
      }
      .line {
        background: #dcdfe6;
        display: inline-block;
        width: 1px;
        height: 131px;
      }
      .character-content {
        padding-top: 10px;
        margin-left: 12px;
        .degree-block,
        .orange-block,
        .white-block,
        .yellow-block,
        .blue-block {
          display: inline-block;
          width: 24px;
          height: 12px;
          margin-right: 6px;
          background-color: #e63031;
        }
        .orange-block {
          background: #f48400;
        }
        .white-block {
          background-color: #ecf1f6;
        }
        .yellow-block {
          background-color: #f1dd00;
        }
        .blue-block {
          background-color: #00b0f0;
        }
        .risk-score {
          color: #e63031;
          padding-left: 5px;
          padding-right: 16px;
        }
        .risk-degree {
          color: #e63031;
        }
        .measure {
          font-weight: 500;
          font-size: 12px;
          color: rgba(34, 34, 34, 1);
        }
      }
    }
  }
  .final-result {
    margin-top: 10px;
  }

  .tableStyle {
    border-collapse: collapse;
    width: 100%;
    border: 1px solid #ddd;
    text-align: center;
    table-layout: fixed;
    td {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      border: 1px solid #ddd;
    }
  }
}
</style>
