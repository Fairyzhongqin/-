<template>
  <div class="demo-ab-container">
    <el-form ref="form"
             :model="dataForm">
      <el-form-item label="事故事件发生的可能性">
        <el-select v-model="dataForm.probability"
                   placeholder="请选择可能性"
                   style="width:100%">
          <el-option v-for="item in options1"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="暴露于危险环境的频繁程度">
        <el-select v-model="dataForm.frequently"
                   placeholder="请选择频繁程度"
                   style="width:100%">
          <el-option v-for="item in options2"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发生事故事件偏差产生的后果严重性">
      </el-form-item>
      <el-row class="seriousness">
        <el-col :span="3"
                class="type border-none border-top-left">
          <el-form-item label="法律法规及其他要求">
          </el-form-item>
        </el-col>
        <el-col :span="21"
                class="type border-bottom-none border-top-right">
          <el-select v-model="dataForm.serious1"
                     style="width:100%">
            <el-option v-for="(item,index3) in options3"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="seriousness">
        <el-col :span="3"
                class="type border-none">
          <el-form-item label="人员伤亡">
          </el-form-item>
        </el-col>
        <el-col :span="21"
                class="type border-bottom-none">
          <el-select v-model="dataForm.serious2"
                     style="width:100%">
            <el-option v-for="(item,index4) in options4"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="seriousness">
        <el-col :span="3"
                class="type border-none">
          <el-form-item label="直接经济损失（万元）">
          </el-form-item>
        </el-col>
        <el-col :span="21"
                class="type border-bottom-none">
          <el-select v-model="dataForm.serious3"
                     style="width:100%">
            <el-option v-for="(item,index5) in options5"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="seriousness">
        <el-col :span="3"
                class="type border-none">
          <el-form-item label="停工">
          </el-form-item>
        </el-col>
        <el-col :span="21"
                class="type border-bottom-none">
          <el-select v-model="dataForm.serious4"
                     style="width:100%">
            <el-option v-for="(item,index6) in options6"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="seriousness">
        <el-col :span="3"
                class="type border-right-none border-bottom-left">
          <el-form-item label="公司形象">
          </el-form-item>
        </el-col>
        <el-col :span="21"
                class="type border-bottom-right">
          <el-select v-model="dataForm.serious7"
                     style="width:100%">
            <el-option v-for="(item,index7) in options7"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <!-- <el-checkbox-group v-model="checkList"
                         @change="checkHanle">
        <el-form-item label="法律法规及其他要求">
          <el-checkbox :label="radio1">
            <el-radio-group v-model="radio1">
              <el-radio-button label="98"></el-radio-button>
              <el-radio-button label="10"></el-radio-button>
              <el-radio-button label="1"></el-radio-button>
              <el-radio-button label="5"></el-radio-button>
            </el-radio-group>
          </el-checkbox>
        </el-form-item>
        <el-form-item label="人员伤亡">
          <el-checkbox :label="radio2">
            <el-radio-group v-model="radio2">
              <el-radio-button label="40"></el-radio-button>
              <el-radio-button label="76"></el-radio-button>
              <el-radio-button label="14"></el-radio-button>
              <el-radio-button label="3"></el-radio-button>
            </el-radio-group>
          </el-checkbox>
        </el-form-item>
        <el-form-item label="直接经济损失">
          <el-checkbox :label="radio3">
            <el-radio-group v-model="radio3">
              <el-radio-button label="100"></el-radio-button>
              <el-radio-button label="88"></el-radio-button>
              <el-radio-button label="6"></el-radio-button>
              <el-radio-button label="1"></el-radio-button>
            </el-radio-group>
          </el-checkbox>
        </el-form-item>
        <el-form-item label="停工">
          <el-checkbox :label="radio4">
            <el-radio-group v-model="radio4">
              <el-radio-button label="100"></el-radio-button>
              <el-radio-button label="80"></el-radio-button>
              <el-radio-button label="50"></el-radio-button>
              <el-radio-button label="10"></el-radio-button>
            </el-radio-group>
          </el-checkbox>
        </el-form-item>
        <el-form-item label="公司形象">
          <el-checkbox :label="radio5">
            <el-radio-group v-model="radio5">
              <el-radio-button label="100"></el-radio-button>
              <el-radio-button label="9"></el-radio-button>
              <el-radio-button label="18"></el-radio-button>
              <el-radio-button label="12"></el-radio-button>
            </el-radio-group>
          </el-checkbox>
        </el-form-item>
      </el-checkbox-group> -->
      <el-form-item label="等级判定">
        <el-input :value="score"></el-input>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
export default {
  name: 'check-demo',
  data () {
    return {
      dataForm: {
        probability: '', // 可能性
        frequently: '', // 频繁长度
        seriousness: '', // 严重性
        score: '',
        serious1: '',
        serious2: '',
        serious3: '',
        serious4: '',
        serious5: ''
      },
      radio1: '98',
      radio2: '40',
      radio3: '100',
      radio4: '100',
      radio5: '100',
      checkList: [],
      options1: [{
        value: '10',
        label: '完全可以预料'
      }, {
        value: '6',
        label: '相当可能'
      }, {
        value: '3',
        label: '可能，但不经常'
      }, {
        value: '1',
        label: '可能性小，完全意外'
      }, {
        value: '0.5',
        label: '很不可能，可以设想'
      }, {
        value: '0.2',
        label: '极不可能'
      }, {
        value: '0.1',
        label: '实际不可能'
      }],
      options2: [{
        value: '10',
        label: '连续'
      }, {
        value: '6',
        label: '每天工作时间内'
      }, {
        value: '3',
        label: '每周一次或偶然'
      },
      {
        value: '2',
        label: '每月一次'
      },
      {
        value: '1',
        label: '每年几次'
      }, {
        value: '0.5',
        label: '非常罕见'
      }],
      options3: [{
        value: '100',
        label: '严重违反法律法规和标准'
      }, {
        value: '40',
        label: '违反法律法规和标准'
      }, {
        value: '15',
        label: '潜在违反法规和标准'
      }, {
        value: '7',
        label: '不符合上级或行业的安全方针、制度、规定等'
      }, {
        value: '2',
        label: '不符合公司的安全操作程序、规定'
      }, {
        value: '1',
        label: '完全符合'
      }],
      options4: [{
        value: '100',
        label: '10人以上死亡，或50人以上重伤'
      }, {
        value: '40',
        label: '3人以上10人以下死亡，或10人以上50人以下重伤'
      }, {
        value: '15',
        label: '3人以下死亡，或10人以下重伤'
      }, {
        value: '7',
        label: '失劳动力、截肢、骨折、听力丧失、慢性病丧'
      }, {
        value: '2',
        label: '轻微受伤、间歇不舒服'
      }, {
        value: '1',
        label: '无伤亡'
      }],
      options5: [{
        value: '100',
        label: '5000以上'
      }, {
        value: '40',
        label: '1000以上'
      }, {
        value: '15',
        label: '100以上'
      }, {
        value: '7',
        label: '10以上'
      }, {
        value: '2',
        label: '1以上'
      }, {
        value: '1',
        label: '1万以下'
      }],
      options6: [{
        value: '100',
        label: '公司停产'
      }, {
        value: '40',
        label: '装置停工'
      }, {
        value: '15',
        label: '部分装置停工'
      }, {
        value: '7',
        label: '部分设备停工'
      }, {
        value: '2',
        label: '1套设备停工'
      }, {
        value: '1',
        label: '没有停工'
      }],
      options7: [{
        value: '100',
        label: '重大国际、国内影响'
      }, {
        value: '40',
        label: '行业内、省内影响'
      }, {
        value: '15',
        label: '地区影响'
      }, {
        value: '7',
        label: '公司及周边范围'
      }, {
        value: '2',
        label: '引人关注，不利于基本的安全卫生要求'
      }, {
        value: '1',
        label: '形象没有受损'
      }]

    }
  },
  methods: {
    // 多选框的值发生变化时
    checkHanle (val) {
      console.log(val)
    }
  },
  computed: {
    score () {
      if (this.dataForm.probability && this.dataForm.frequently && (this.dataForm.serious1 || this.dataForm.serious2 || this.dataForm.serious3 || this.dataForm.serious4 || this.dataForm.serious5)) {
        let arr = [this.dataForm.serious1, this.dataForm.serious2, this.dataForm.serious3, this.dataForm.serious4, this.dataForm.serious5]
        let max = Math.max.apply(null, arr)
        let score = (Number(this.dataForm.probability) * Number(this.dataForm.frequently) * max).toFixed(2)
        if (score < 70) {
          return score + 'D/4级轻度危险'
        } else if (score >= 70 && score <= 159) {
          return score + 'C/3级显著危险'
        } else if (score >= 160 && score <= 319) {
          return score + '高度危险较大风险'
        } else if (score >= 320) {
          return score + 'A/1级极其危险'
        }
      }
    }
  }
}
</script>
<style lang="scss">
.demo-ab-container {
  .seriousness {
    // .el-form-item__label {
    //   border: 1px solid #ccc;
    // }
    .type {
      height: 30px;
      padding: 0 10px;
      border: 1px solid #c0c4cc;
      .el-input__inner {
        border: 0;
      }
    }
    .border-none {
      border-right: 0;
      border-bottom: 0;
    }
    .border-right-none {
      border-right: 0;
    }
    .border-bottom-none {
      border-bottom: 0;
    }
    .border-top-left {
      border-top-left-radius: 3px;
    }
    .border-bottom-left {
      border-bottom-left-radius: 3px;
    }
    .border-top-right {
      border-top-right-radius: 3px;
    }
    .border-bottom-right {
      border-bottom-right-radius: 3px;
    }
  }
}
</style>