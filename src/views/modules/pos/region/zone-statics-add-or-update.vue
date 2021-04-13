<!--区域热度统计-->
<template>
  <el-dialog title="区域热度统计" :close-on-click-modal="false" :visible.sync="visible" width="800px" height="530px" class="zoneStatics-dialog" @close="handleclose">
    <div class="detailInfo">
      <i class="el-icon-warning-outline">区域信息：</i>
      <span>编号：{{dataForm.code}}</span>
      <span>名称：{{dataForm.zoneName}}</span>
      <span>等级：{{dataForm.zoneLevel==='2'?'二级':'三级'}}</span>
      <span v-if="dataForm.riskLevel===null">风险等级：空</span>
      <span v-if="dataForm.riskLevel!==null">风险等级：{{dataForm.riskLevel | formatType(typeList)}}</span>
      <span>进入人次：{{dataForm.zoneNum}}</span>
    </div>
    <div class="selectTime">
      <i class="el-icon-warning-outline">选择不同时间范围查看统计图：</i>
      <el-date-picker v-model="dataForm.dataRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
      </el-date-picker>
      <el-button size="mini" @click="selectInfo" type="primary">查询</el-button>
    </div>
    <div id="main" style="width:660px;height:400px;left:58px;"></div>
  </el-dialog>
</template>

<script>
import echarts from 'echarts'
import { getLabels } from '@/api/common/sys'
import { getZoneCountDetail } from '@/api/pos/region'
export default {
  components: {
    // ThreeMap
  },
  data () {
    return {
      dataForm: {
        zoneCode: '',
        code: '',
        zoneName: '',
        riskLevel: '',
        zoneLevel: '',
        zoneNum: '',
        dataRange: [] // 时间范围
      }, // 表单数据
      typeList: [], // 风险等级列表
      sourList: [], // 区域类型列表
      visible: false,
      isDisabled: false,
      option1: {
        // 'legend': {
        //   'data': ['进入人次']
        // },
        'tooltip': {
          'trigger': 'axis'
        },
        'grid': {
          'top': '10%',
          'left': '3%',
          // 'righthis.option1=t': '4%',
          'bottom': '10%',
          'containLabel': true
        },
        'xAxis': {
          'name': '日期',
          'type': 'category',
          'boundaryGap': false,
          'data': []// 横坐标
        },
        'yAxis': {
          'name': '进入人次(个)',
          'type': 'value'
        },
        'series': [
        ]
      }
    }
  },
  created () {

  },
  methods: {
    // 新增单个字段
    init (data, dataRange) {
      console.log(dataRange)
      this.visible = true
      this.isDisabled = false
      this.dataForm.zoneCode = data.zoneCode
      this.dataForm.dataRange = []
      this.dataForm.dataRange[0] = dataRange[0]
      this.dataForm.dataRange[1] = dataRange[1]
      this.$nextTick(() => {
        this.getBaseData()
        this.dataForm.code = data.code
        this.dataForm.zoneName = data.zoneName
        this.dataForm.riskLevel = data.riskLevel
        this.dataForm.zoneLevel = data.zoneLevel
        this.dataForm.zoneNum = data.zoneNum
        this.selectInfo()
      })
    },
    // 查询区域统计信息，生成折线图
    selectInfo () {
      this.option1 = {
        'tooltip': {
          'trigger': 'axis'
        },
        'grid': {
          'top': '10%',
          'left': '3%',
          // 'righthis.option1=t': '4%',
          'bottom': '10%',
          'containLabel': true
        },
        'xAxis': {
          'name': '日期',
          'type': 'category',
          'boundaryGap': false,
          'data': []// 横坐标
        },
        'yAxis': {
          'name': '进入人次(个)',
          'type': 'value'
        },
        'series': [
        ]
      }
      var myChart = echarts.init(document.getElementById('main'))
      getZoneCountDetail({
        'zoneCode': this.dataForm.zoneCode,
        'startTime': this.dataForm.dataRange[0] ? new Date(this.dataForm.dataRange[0]).Format('yyyy-MM-dd') : '',
        'endTime': this.dataForm.dataRange[1] ? new Date(this.dataForm.dataRange[1]).Format('yyyy-MM-dd') : ''
      }).then(({ data }) => {
        this.isDisabled = false
        if (data && data.code === 0) {
          console.log(data)
          let list = data.list
          var serobj = {}
          serobj.type = 'line'
          serobj.name = '进入人次'
          serobj.data = []
          list.forEach(item => {
            this.option1.xAxis.data.push(item.dayDate)
            serobj.data.push(item.zoneNum)
          })
          this.option1.series.push(serobj)
          // console.log(this.option1)
          myChart.setOption(this.option1)
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.isDisabled = false
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 处理关闭的回调
    handleclose () {
      this.option1 = {
        // 'legend': {
        //   'data': ['进入人次']
        // },
        'tooltip': {
          'trigger': 'axis'
        },
        'grid': {
          'top': '10%',
          'left': '3%',
          // 'righthis.option1=t': '4%',
          'bottom': '10%',
          'containLabel': true
        },
        'xAxis': {
          'name': '日期',
          'type': 'category',
          'boundaryGap': false,
          'data': []// 横坐标
        },
        'yAxis': {
          'name': '进入人次(个)',
          'type': 'value'
        },
        'series': [
        ]
      }
    },
    // 加载基础数据
    getBaseData () {
      // 风险等级 - 字典
      getLabels({
        'type': 'risk_level'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.typeList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
      // 区域类型
      getLabels({
        'type': 'SOUR_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.sourList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    }
  },
  filters: {
    formatType (value, map) {
      let optionName = ''
      map.map((val) => {
        if (value === val.label) {
          optionName = val.value
        }
      })
      return optionName
    }
  }
}
</script>
<style lang="scss">
.zoneStatics-dialog {
  .el-dialog__body {
    padding-top: 10px;
  }

  .el-dialog__title {
    padding: 5px 7px;
    color: #fff;
    font-weight: 700;
    background-color: #b03a5b;
  }
  .detailInfo {
    display: flex;
    align-content: center;
    padding: 3px 10px;
    span {
      margin-right: 3px;
      padding: 5px;
      background: #efe9e9;
      text-align: center;
      color: #000;
      font-size: 12px;
    }
    i {
      padding: 3px;
      color: #000;
    }
  }
  .selectTime {
    margin-top: 5px;
    padding: 3px 10px;
    display: flex;
    align-items: center;
    > i:first-child {
      padding: 3px;
      color: #000;
    }
    .el-button {
      margin-left: 5px;
      color: #fff;
    }
  }
  .el-icon-warning-outline:before {
    color: #a67a38;
  }
}
</style>
