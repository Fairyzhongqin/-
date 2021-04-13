
<template>
  <div class="bianshiStyle">
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormone" label-position="top" label-width="200px">
      <div>
        <h3>风险矩阵分析法（LS）：</h3>
        <p style="text-indent:28px">
          风险矩阵分析法（简称LS）， <span style="color:#E63031">R=L×S，</span>其中R是风险值，事故发生的可能性与事件后果的结合，L是事故发生的可能性；S是事故后果严重性；R值越大，说明该系统危险性大、风险大。

        </p>
        <el-form-item label="事故发生的可能性（L）：" prop="likelihood" class="likeliHood-style">
          <el-input v-model="dataForm.likelihood" placeholder="事故发生的可能性" @focus="selectChoose('likelihood',dataForm.likelihoodScore)" size="mini">
            <el-button slot="append" @click="selectChoose('likelihood',dataForm.likelihoodScore)">
              选择
            </el-button>
          </el-input>
        </el-form-item>

      </div>
    </el-form>
    <div class="result-title">事件后果严重性（S）：</div>
    <el-form :model="dataForm" :rules="dataRule" ref="dataFormtwo" label-position="left" class="specialForm" label-width="200px">
      <div>
        <el-form-item label="法律法规及其他要求" prop="lawRegular">
          <el-select v-model="dataForm.lawRegular" size="mini" clearable @change="compareChange">
            <el-option v-for="item in legalList" :key="item.label" :value="item.label" :label="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="人员" prop="personInjury">
          <el-select v-model="dataForm.personInjury" size="mini" clearable @change="compareChange">
            <el-option v-for="item in personInjuryList" :key="item.label" :value="item.label" :label="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="直接经济损失" prop="economicLoss">
          <el-select v-model="dataForm.economicLoss" size="mini" clearable @change="compareChange()">
            <el-option v-for="item in economicLossList" :key="item.label" :value="item.label" :label="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="停工" prop="stopWOrk">
          <el-select v-model="dataForm.stopWOrk" size="mini" clearable @change="compareChange()">
            <el-option v-for="item in stopWorkList" :key="item.label" :value="item.label" :label="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="企业形象" prop="corporateImage">
          <el-select v-model="dataForm.corporateImage" size="mini" clearable @change="compareChange()">
            <el-option v-for="item in corporateImageList" :key="item.label" :value="item.label" :label="item.value"></el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
    <div class="result">
      <p>安全风险等级判定准则（R）:</p>
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
            <span class="risk-score">20-25</span>
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
            <span class="risk-score">15-16</span>
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
            <span class="measure">立即或近期补充管控措施，定期检查、测量及评估
            </span>
          </div>
        </div>
        <div class="character-content" v-else-if="result === '一般风险'">
          <div style="margin-bottom: 7px;">
            <span class="yellow-block"></span>
            <span class="yellow-block"></span>
            <span class="white-block"></span>
            <span class="white-block"></span>
            <span class="risk-score">9-12</span>
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
              1-8</span> <span class="risk-degree">低风险
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
color:rgba(200,206,213,1)">选择LS，获得风险值
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
    <ls-select-table v-if="selectVisible" ref="selectRef" @selectEmit="select"></ls-select-table>
  </div>

</template>

<script>
// eslint-disable-next-line no-unused-vars
import { identificationAdd } from '@/api/risk/inventory'
import lsSelectTable from './ls-select-table'
export default {
  // props: {
  //   list: {
  //     type: Object
  //   }
  // },
  data () {
    let validSelect = (rule, value, callback) => {
      if (this.dataForm.lawRegular || this.dataForm.personInjury || this.dataForm.economicLoss || this.dataForm.stopWOrk || this.dataForm.corporateImage) {
        callback()
      } else {
        return callback(new Error('至少选择一项'))
      }
    }
    return {
      visible: false,
      isDisabled: false,
      selectVisible: false,
      name: '', // 风险名称
      riskFactor: '', // 风险因素
      legalList: [{ label: '1', value: '（1级）完全符合' },
      { label: '2', value: '（2级）不符合企业的安全操作程序、规定' },
      { label: '3', value: '（3级）不符合上级公司或行业的安全方针、制度、规定等' },
      { label: '4', value: '（4级）潜在违反法规和标准' },
      { label: '5', value: '（5级）违反法律、法规和标准' }
      ],
      exposureList: [{ label: '0.5', value: '非常罕见地暴露' },
      { label: '1', value: '每年几次暴露' },
      { label: '2', value: '每月一次暴露' },
      { label: '3', value: '每周一次或偶然暴露' }, {
        label: '6', value: '每天工作时间内暴露'
      }, {
        label: '10', value: '连续暴露'
      }],

      personInjuryList: [{ label: '1', value: '（1级）无伤亡' },
      { label: '2', value: '（2级）轻微受伤、间歇不舒服' },
      { label: '3', value: '（3级）截肢、骨折、听力丧失、慢性病' },
      { label: '4', value: '（4级）丧失劳动能力' },
      { label: '5', value: '（5级）死亡' }],
      economicLossList: [{ label: '1', value: '（1级）无损失' },
      { label: '2', value: '（2级）1万元以下' },
      { label: '3', value: '（3级）1万元以上' },
      { label: '4', value: '（4级）50万元以上' },
      { label: '5', value: '（5级）100万元以上' }],
      stopWorkList: [{ label: '1', value: '（1级）没有停工' },
      { label: '2', value: '（2级）受影响不大，几乎不停工' },
      { label: '3', value: '（3级）1 套装置停工或设备' },
      { label: '4', value: '（4级）2套装置停工、或设备停工' },
      { label: '5', value: '（5级）重大国际影响' }],
      corporateImageList: [
        { label: '1', value: '（1级）形象没有受损' },
        { label: '2', value: '（2级）公司及周边范围' },
        { label: '3', value: '（3级）地区影响' },
        { label: '4', value: '（4级）行业内、省内影响' },
        { label: '5', value: '（5级）部分装置（>2 套）或设备' }
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
      isMounted: false,
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
    lsSelectTable
  },

  mounted () {
    this.isMounted = true
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
      }
    },
    handleChangeMes () {
      if (this.dataForm.measures && this.dataForm.expose && this.dataForm.consequence) {
        let riskDegreeValue = Number(this.dataForm.measures) * Number(this.dataForm.expose) * Number(this.dataForm.consequence)
        this.liskMatch(riskDegreeValue)
      }
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
      if (this.dataForm.likelihood && (this.dataForm.lawRegular || this.dataForm.personInjury || this.dataForm.economicLoss || this.dataForm.stopWOrk || this.dataForm.corporateImage)) {
        let arr = [this.dataForm.lawRegular, this.dataForm.personInjury, this.dataForm.economicLoss, this.dataForm.stopWOrk, this.dataForm.corporateImage]
        let max = Math.max(...arr)
        this.dataForm.maxScore = max

        let result = (Number(this.dataForm.likelihoodScore) * max).toFixed(2)

        this.dataForm.resultScore = result
        if (result >= 20 && result <= 25) {
          this.dataForm.riskDegree = 'A'
          return '重大风险'
        } else if (result >= 15 && result <= 19) {
          this.dataForm.riskDegree = 'B'
          return '较大风险'
        } else if (result >= 9 && result <= 14) {
          this.dataForm.riskDegree = 'C'

          return '一般风险'
        } else if (result >= 1 && result <= 8) {
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
  .result-title {
    margin-bottom: 10px;
    color: #222;
  }
  .result-title:before {
    content: '*';
    color: #e63031;
    margin-right: 4px;
  }
  .likeliHood-style {
    .el-form-item__label {
      font-size: 14px;
      color: #222;
    }
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
