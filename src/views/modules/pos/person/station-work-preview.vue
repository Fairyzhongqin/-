<template>
  <!-- 巡检区域预览 -->
  <div class="stationWorkPreview">
    <!--内容部分-->
    <div class="content">
      <div class="top">
        <h3>{{taskInfo.name}}</h3>
        <el-row>
          <el-col :span="8">
            任务编号：<span class="top-text">{{taskInfo.code}}</span>
          </el-col>
          <el-col :span="8">
            巡检类型：<span class="top-text">{{taskInfo.patrolType | formatType(options)}}</span>
          </el-col>
          <el-col :span="8">
            巡检班组：<span class="top-text">{{taskInfo.teamName}}</span>
          </el-col>
        </el-row>
        <p>
          任务周期：
          <!-- <span style="color: #2C78BB;"> -->
          <!-- {{taskInfo.period | formatTypePeriod(periodList)}}</span> -->
          <!-- <i class="el-icon-caret-right"
             v-if="taskInfo.period!=='0'"></i> -->
          <template v-if="taskInfo.period==='0'">
            <span class="top-period">每天</span>
          </template>
          <template v-if="taskInfo.period==='1'">
            <template v-for="(item,index) in taskInfo.daysOfWeek">
              <span v-if="item==='1'" :key="index" class="top-period">
                {{index < (taskInfo.daysOfWeek.length-1) ? '周日、':'周日'}}
              </span>
              <span v-if="item==='2'" :key="index" class="top-period">
                {{index < (taskInfo.daysOfWeek.length-1) ? '周一、':'周一'}}
              </span>
              <span v-if="item==='3'" :key="index" class="top-period">
                {{index < (taskInfo.daysOfWeek.length-1) ? '周二、':'周二'}}
              </span>
              <span v-if="item==='4'" :key="index" class="top-period">
                {{index < (taskInfo.daysOfWeek.length-1) ? '周三、':'周三'}}
              </span>
              <span v-if="item==='5'" :key="index" class="top-period">
                {{index < (taskInfo.daysOfWeek.length-1) ? '周四、':'周四'}}
              </span>
              <span v-if="item==='6'" :key="index" class="top-period">
                {{index < (taskInfo.daysOfWeek.length-1) ? '周五、':'周五'}}
              </span>
              <span v-if="item==='7'" :key="index" class="top-period">
                {{index < (taskInfo.daysOfWeek.length-1) ? '周六、':'周六'}}
              </span>
            </template>
          </template>
          <template v-if="taskInfo.period==='2'">
            <template v-for="(item,index) in taskInfo.daysOfMonth">
              <span :key="index" class="top-period">
                {{index < (taskInfo.daysOfMonth.length-1) ?  item+'号、' : item+'号'}}
              </span>
            </template>
          </template>
        </p>
        <div class="period-time">
          巡检时间：
          <el-tag v-for="(item,index) in taskInfo.periodTimeEntityList" :key="index">
            {{item.beginTime+'-'+item.endTime}}
          </el-tag>
        </div>
      </div>
      <el-row class="bottom">
        <el-col :span="12" class="bottom-left">
          <p class="bottom-title">巡检区域</p>
          <el-scrollbar style="height: calc(100vh - 94px - 304px)">
            <!-- 巡检区域详细列表 -->
            <el-card v-if="taskInfoList.length===0">
              <el-alert title="暂无数据" type="info" description="请先添加巡检区域" :closable="false">
              </el-alert>
            </el-card>
            <div v-for="(value,index) in taskInfoList" :key="value.id" :class="{lis:true,active:selectedIndex===index} " @click="addClass(index,value)">
              <div class="areadetailTop">
                <span>{{index+1}}/{{taskInfoList.length}}</span>
                <span>{{value.zoneShow+'巡检区域'}}</span>
              </div>
              <el-row class="areadetailBottom">
                <el-col :span="20">
                  <p>滞留时间：{{value.minRetentionTime+'分钟'}}</p>
                </el-col>
              </el-row>
            </div>
          </el-scrollbar>
        </el-col>
        <el-col :span="12" class="bottom-right">
          <p class="bottom-title">巡检点</p>
          <el-scrollbar style="height:calc(100vh - 94px - 304px)">
            <el-card v-if="patrolPointEntityList.length===0">
              <el-alert title="暂无数据" type="info" description="请先选择巡检区域" :closable="false">
              </el-alert>
            </el-card>
            <div v-for="(value,index) in patrolPointEntityList" :key="value.id" class="lis lis2">
              <div class="areadetailTop">
                <span>{{index+1}}/{{patrolPointEntityList.length}}</span>
                <span>{{value.name}}</span>
                <span>{{value.type | formatType(pointTypeList)}}</span>
              </div>
              <el-row class="areadetailBottom">
                <el-col :span="24">
                  <p>检查对象：{{value.name}}</p>
                  <p v-if="value.type==='1'">
                    <span>
                      检查内容：
                    </span>
                    <!-- <span v-for="(item,index) in value.patrolPointDataAcquisitionList" :key="index" class="text item" type="info">
                      {{index < (value.patrolPointDataAcquisitionList.length-1) ? index+1+'、'+item.description+',': index+1+'、'+item.description}}
                    </span> -->
                    <span>
                      {{value.patrolPointDataAcquisitionList|formatCheckList}}
                    </span>
                  </p>
                </el-col>
              </el-row>
            </div>
          </el-scrollbar>
        </el-col>
      </el-row>
    </div>
    <el-row class="btn">
      <el-col :span="24" align="center">
        <el-button @click="goStationWork" v-if="flag">上一步</el-button>
        <el-button @click="goStation">{{flag?'取消':'返回'}}</el-button>
        <el-button @click="goStationHome" type="primary" v-if="flag">完成</el-button>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { patroltaskInfoAll, patroltaskPublish } from '@/api/pos/person'
import { getLabels } from '@/api/common/sys'

// 引入拖拽的组件，注册组件
export default {
  props: ['id', 'active', 'flag'],
  components: {
  },
  data () {
    return {
      dataForm: {
        'id': this.id
      },
      arealist: [], // 巡检区域列表
      myArray2: [], // 绑定的巡检列表数据
      taskInfo: {}, // 任务基本信息
      // 巡检数据类型
      options: [{
        value: '0',
        label: '常规巡检'
      }, {
        value: '1',
        label: '专项巡检'
      }],
      // 周期数据类型
      optionsPeriod: [{
        value: '0',
        label: '每天'
      }, {
        value: '1',
        label: '每周'
      }, {
        value: '2',
        label: '每月'
      }],
      WeekPeriod: [{
        value: '1',
        label: '周日'
      },
      {
        value: '2',
        label: '周一'
      },
      {
        value: '3',
        label: '周二'
      },
      {
        value: '4',
        label: '周三'
      },
      {
        value: '5',
        label: '周四'
      },
      {
        value: '6',
        label: '周五'
      }, {
        value: '7',
        label: '周六'
      }],
      dialogVisible: true,
      data: {},
      taskInfoList: [], // 所有的巡检任务列表
      stationNameList: [], // 班组名称列表
      periodList: [], // 周期类型
      selectedIndex: '', // 被选中的索引
      areaParamsVisible: true,
      pointTypeList: [],
      patrolPointEntityList: []// 巡检点信息表
    }
  },
  created () {
    this.getBaseData() // 获取全部任务信息
    this.getDataList() // 加载基础数据
  },
  methods: {
    // 给选中的索引赋值
    addClass (index, item) {
      this.selectedIndex = index
      // this.getPointList(id)// 获取巡检点列表
      this.patrolPointEntityList = item.patrolPointEntityList
      console.log(this.patrolPointEntityList)
    },
    // 点击上一步进入巡检区域/巡检点页
    goStationWork () {
      // this.data.data1 = 'stationWorkArea'
      // this.data.data2 = 1
      // this.$store.commit('editName', this.data)
      this.$emit('goArea', 1)
    },
    // 点击完成进入巡检任务默认页
    goStation () {
      // this.data.data1 = 'stationWorkHome'
      // this.data.data2 = 0
      // this.$store.commit('editName', this.data)
      this.$emit('goStationWork')
    },
    // 点击确认进入首页
    goStationHome () {
      this.$confirm(`确定发布巡检任务？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          patroltaskPublish(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              console.log(data)
              this.$emit('goStationWork')
            } else {
              this.$message.error(data.msg)
            }
            this.dataListLoading = false
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
            this.dataListLoading = false
          })
        })
        .catch(() => { })
    },
    // 获取全部任务信息
    getDataList () {
      patroltaskInfoAll({
        'id': this.id
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.taskInfo = data.data
          this.taskInfoList = data.data.patrolZoneEntityList || []
          if (this.taskInfoList.length) this.addClass(0, this.taskInfoList[0])

          if (this.taskInfo.period === '1') {
            this.taskInfo.daysOfWeek = this.taskInfo.daysOfWeek.split(',')
            this.taskInfo.daysOfWeek.sort(function (a, b) { return a - b })
          } else if (this.taskInfo.period === '2') {
            this.taskInfo.daysOfMonth = this.taskInfo.daysOfMonth.split(',')
            this.taskInfo.daysOfMonth.sort(function (a, b) { return a - b })
          }

          console.log(this.taskInfo, '1111111111111')
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 加载基础数据
    getBaseData () {
      // 巡检点类型 - 字典
      getLabels({
        'type': 'PATROL_POINT_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.pointTypeList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
      // 周期类型
      getLabels({
        'type': 'PERIOD_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.periodList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 展示右边的巡检点信息
    pointDisplay (list) {
      console.log(1)
      console.log(list)
      this.patrolPointEntityList = list
    }

  },
  filters: {
    formatType (value, map) {
      let optionName = ''
      map.map((val) => {
        if (value === val.value) {
          optionName = val.label
        }
      })
      return optionName
    },
    formatTypePeriod (value, map) {
      let optionName = ''
      map.map((val) => {
        if (value === val.label) {
          optionName = val.value
        }
      })
      return optionName
    },
    formatCheckList (value) {
      let str = ''
      if (value) {
        value.map((r, index) => {
          str = str + (index + 1) + '、' + r.description + '；'
        })
      }
      return str
    }
  }
}
</script>
<style lang="scss">
.stationWorkPreview {
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  /*内容*/
  .content {
    margin: 20px 24px;
    border: 1px solid rgba(220, 223, 230, 1);
    .top {
      padding: 0 16px 16px 16px;
      border-bottom: 1px solid rgba(220, 223, 230, 1);
      h3 {
        margin: 13px 0;
        font-size: 18px;
        text-align: center;
        min-height: 20px;
        color: rgba(34, 34, 34, 1);
      }
      p {
        margin: 9px 0;
      }
      &-text {
        color: rgba(34, 34, 34, 0.7);
      }
      .period-time {
        min-height: 28px;
      }
      &-period {
        color: #2c78bb;
        font-size: 12px;
      }
    }
    .bottom {
      &-title {
        display: inline-block;
        margin: 0;
        height: 35px;
        line-height: 35px;
        padding: 0 12px;
        width: 100%;
        border-bottom: 1px solid #dcdfe6;
        background-color: #77a2c7;
        color: #ffffff;
      }
      &-left {
        border-right: 1px solid #dcdfe6;
      }
      .lis {
        padding: 12px;
        cursor: pointer;
        border-bottom: 1px solid #dcdfe6;
        transition: 0.3s;
        p {
          margin: 15px 0 0 0;
        }
        &:nth-last-child(1) {
          /*border-bottom: none;*/
        }
        &.active {
          background: rgba(234, 242, 248, 1);
          position: relative;
          &:before {
            /*position: absolute;*/
            /*display: block;*/
            /*width: 0;*/
            /*height: 0;*/
            /*border: 16px solid transparent;*/
            /*content: "";*/
            /*border-bottom-width: 0;*/
            /*border-top-color: #fff;*/
            /*left: 50%;*/
            /*top: 50%;*/
            /*transform: translate(-50%, -50%);*/
          }
        }
      }
      .areadetailTop {
        width: 100%;
        // border-bottom: 1px solid #ccc;
        span {
          line-height: 20px;
          text-align: center;
          color: #fff;
        }
        span:nth-of-type(1) {
          background-color: #76b8ee;
          padding: 3px 8px;
        }
        span:nth-of-type(2),
        span:nth-of-type(3) {
          color: #333333;
        }
      }
      .el-tag.el-tag--info {
        background-color: #fff;
        border-color: #fff;
        color: #222222b3;
        line-height: 1;
        height: auto;
      }
    }
  }
  .el-button {
    border-radius: 30px;
    margin: 0 7px;
  }
}
</style>
