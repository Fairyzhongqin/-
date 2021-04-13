<template>
  <div class="history-detail">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" :inline="true">
      <el-form-item label="承包商姓名" prop="name">
        <el-select v-model="dataForm.name" filterable placeholder="请选择" class="contractorWidth">
          <el-option v-for="item in nameList" :key="item.key" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期范围" prop="dataRange">
        <el-date-picker v-model="dataForm.dataRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size="mini" :picker-options="pickerOptions1" clearable>
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" v-waves icon="el-icon-search">查询</el-button>
        <el-button type="info" size="mini" @click="resetForm('dataForm')" v-waves icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="person">
      <el-card shadow="hover" class="company">
        <div slot="header" class="clearfix header">
          <icon-svg name='cbsxq'></icon-svg>
          <span>{{contractorName}}</span>
          <div class="header-status" :class="state !=='0'?'status-work':''">
            空闲
            <i class="header-status-lef"></i>
            <i class="header-status-rig"></i>
          </div>
        </div>
        <p><span>员工：</span><span>{{staffName}}</span></p>
        <p><span>负责人：</span><span>{{responsibleName}}</span></p>
        <p><span>总人数：</span><span>{{totalPerson}}</span></p>
        <p><span>联系方式：</span><span>{{contact}}</span></p>
        <p><span>作业次数：</span><span>{{workTime}}</span></p>
        <p><span>作业时长：</span><span class="workhour">{{workHour}}</span></p>
        <p><span>违规次数：</span><span>{{violateTime}}</span></p>
      </el-card>
      <div class="working">
        <p class="title">当前作业</p>
        <el-row>
          <el-col :span="24">
            <span class="leftSpan">作业地点：</span>
            <span class="rightSpan">甲酯车间</span>
          </el-col>
          <el-col :span="24">
            <span class="leftSpan">作业时间：</span>
            <span class="rightSpan">2019/11/28-2019/12/31</span>
          </el-col>
          <el-col :span="24" class="workingName">
            <span class="leftSpan">作业人员：</span>
            <span class="rightSpan">李晓琪、李莉莉、李悠悠、李明明、李信新</span>
          </el-col>
          <el-col :span="24">
            <span class="leftSpan">当天工时：</span>
            <span class="rightSpan special">2019/11/28-2019/12/31</span>
          </el-col>
        </el-row>
      </div>
      <ul class="staffList">
        <li class="staffTitle">员工(4/5)</li>
        <el-scrollbar style="height:calc(100vh - 45px - 190px - 150px - 16px - 120px - 25px)">
          <li v-for="item in personList" :key="item.id">
            <span class="name">{{item.name}}</span>
            <span class="status" :class="{statusa:item.status==='0',statusb:item.status==='1'}">
              {{item.status==='0' ? '在线':'离线'}}
            </span>
          </li>
        </el-scrollbar>
      </ul>
    </div>
    <div class="block time-line">
      <p class="title">历史作业</p>
      <el-scrollbar style="height:calc(100vh - 45px - 120px - 10px)">
        <el-timeline>
          <el-timeline-item v-for="(item,index) in historyWorkList" :key="index" class="time-line-item">
            <img src="~@/assets/img/oblong.png" alt="" class="item-img">
            <p class="time-style">
              <span>10</span>
              <span> /12</span>
            </p>
            <el-card>
              <el-popover ref="popover2" placement="right" width="200" trigger="click" content="作业详情">
                <h4 class="sub-title" slot="reference">{{item.name}}</h4>
              </el-popover>
              <el-row class="el">
                <el-col :span="8">
                  <span class="leftSpan">作业地点：</span>
                  <span class="rightSpan">{{item.workPlace}}</span>
                </el-col>
                <el-col :span="12">
                  <span class="leftSpan">作业时间：</span>
                  <span class="rightSpan">{{item.workTime}}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <span class="leftSpan">作业人员：</span>
                  <span class="rightSpan">{{item.workStaff}}</span>
                </el-col>
                <el-col :span="12">
                  <span class="leftSpan">当天工时：</span>
                  <span class="rightSpan special">{{item.workHours}}</span>
                  <div class="warningNum">
                    <i class="num">3</i>
                    <icon-svg name="weiguijilu" class="warning">
                    </icon-svg>
                  </div>
                </el-col>
              </el-row>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>

    </div>
    <!-- </el-col>
    </el-row> -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      dataRule: {},
      dataForm: {
        name: '',
        dataRange: []
      },
      state: '0',
      contractorName: '江苏第五建筑公司', // 卡片里承包商标题
      nameList: [{
        'label': '郭梦风',
        'value': 20
      }],
      staffName: '郭梦风',
      responsibleName: '李威威',
      totalPerson: '19',
      contact: '1982222222',
      workTime: '34',
      workHour: '56时27分30秒',
      violateTime: '2',
      status: '',
      pickerOptions1: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e7
        }
      },
      personList: [{
        id: '0',
        name: '李晓琪',
        status: '0'
      },
      {
        id: '1',
        name: '李莉莉',
        status: '0'
      },
      {
        id: '2',
        name: '李悠悠',
        status: '0'
      },
      {
        id: '3',
        name: '李明明',
        status: '0'
      },
      {
        id: '4',
        name: '李信新',
        status: '1'
      }, {
        id: '5',
        name: '李琪琪',
        status: '0'
      }, {
        id: '6',
        name: '李佳佳',
        status: '0'
      }, {
        id: '7',
        name: '李薇薇',
        status: '0'
      }, {
        id: '8',
        name: '李星星',
        status: '1'
      }, {
        id: '9',
        name: '李薇薇',
        status: '0'
      }, {
        id: '10',
        name: '李星星',
        status: '1'
      }], // 员工列表
      historyWorkList: [{
        name: '特级动火-施工区域-明火动迁',
        workPlace: '甲酯车间',
        workStaff: '李晓琪、李莉莉、李悠悠、李明明、李信新',
        workTime: '2019/11/28-2019/12/31',
        workHours: '10时30分'
      }, {
        name: '特级动火-施工区域-明火动迁',
        workPlace: '甲酯车间',
        workStaff: '李晓琪、李莉莉、李悠悠、李明明、李信新',
        workTime: '2019/11/28-2019/12/31',
        workHours: '10时30分'
      }, {
        name: '特级动火-施工区域-明火动迁',
        workPlace: '甲酯车间',
        workStaff: '李晓琪、李莉莉、李悠悠、李明明、李信新',
        workTime: '2019/11/28-2019/12/31',
        workHours: '10时30分'
      }, {
        name: '特级动火-施工区域-明火动迁',
        workPlace: '甲酯车间',
        workStaff: '李晓琪、李莉莉、李悠悠、李明明、李信新',
        workTime: '2019/11/28-2019/12/31',
        workHours: '10时30分'
      }, {
        name: '特级动火-施工区域-明火动迁',
        workPlace: '甲酯车间',
        workStaff: '李晓琪、李莉莉、李悠悠、李明明、李信新',
        workTime: '2019/11/28-2019/12/31',
        workHours: '10时30分'
      }, {
        name: '特级动火-施工区域-明火动迁',
        workPlace: '甲酯车间',
        workStaff: '李晓琪、李莉莉、李悠悠、李明明、李信新',
        workTime: '2019/11/28-2019/12/31',
        workHours: '10时30分'
      }, {
        name: '特级动火-施工区域-明火动迁',
        workPlace: '甲酯车间',
        workStaff: '李晓琪、李莉莉、李悠悠、李明明、李信新',
        workTime: '2019/11/28-2019/12/31',
        workHours: '10时30分'
      }]// 历史作业
    }
  },
  created () {
    this.getDate()
  },
  methods: {
    // 初始化时间
    getDate () {
      let date = new Date()
      let dateLast = new Date(date)
      dateLast.setDate(date.getDate() - 30)
      this.todayDate = date.toLocaleDateString()
      this.lastDate = dateLast.getFullYear() + '-' + (dateLast.getMonth() + 1) + '-' + dateLast.getDate()
      this.dataForm.dataRange[0] = new Date(this.lastDate).Format('yyyy-MM-dd')
      this.dataForm.dataRange[1] = new Date(this.todayDate).Format('yyyy-MM-dd')
    }
  }
}
</script>
<style lang="scss">
.history-detail {
  .el-input--medium .el-input__icon {
    line-height: 28px;
  }
  .person {
    float: left;
    .el-card {
      height: 100%;
      padding-bottom: 15px;
      // background: #87bcce;
      color: #606266;
      border: 1px solid #dcdfe6;
      cursor: pointer;
      position: relative;
      .header-status {
        position: absolute;
        top: 0px;
        right: 10px;
        padding: 4px 8px;
        font-size: 14px;
        font-weight: normal;
        color: #ffffff;
        width: 30px;
        text-align: center;
        background: rgba(191, 205, 222, 1);
        i {
          width: 0;
          height: 0;
          position: absolute;
          bottom: -15px;
        }
        &-lef {
          left: 0;
          border: 15px solid transparent;
          border-left-color: #bfcdde;
        }
        &-rig {
          right: 0;
          border: 15px solid transparent;
          border-right-color: #bfcdde;
        }
      }
      .status-work {
        background: #2a8aff;
        .header-status-lef {
          border-left-color: #2a8aff;
        }
        .header-status-rig {
          border-right-color: #2a8aff;
        }
      }
      // &:hover {
      //   transition: 0.5s;
      //   box-shadow: 4px 4px 11px 2px #ccc;
      // }
      .el-card__header {
        position: relative;
        font-size: 16px;
        color: #222222;
        font-weight: bold;
        border: 0;
        padding: 16px 16px 20px;
        .icon-svg {
          font-size: 19px;
          color: #3871b2;
          vertical-align: middle;
          margin-right: 8px;
          margin-left: 1px;
        }
        span {
          vertical-align: middle;
        }
        .order {
          position: absolute;
          left: 10px;
          border-radius: 50%;
          height: 20px;
          width: 20px;
          line-height: 20px;
          background-color: #cdd7e1;
          color: #5b93cd;
          font-size: 13px;
        }
        .unfinish {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 35px;
          line-height: 35px;
          // background-color: #73ace7;
          // box-shadow: 0 0 2px #73ace7;
          // color: #fff;
        }
        .el-icon-close {
          position: absolute;
          right: 3px;
          top: 3px;
          color: #e8eef3;
          &:hover {
            color: #fff;
          }
        }
      }
      .el-card__body {
        padding: 0 11px;
        .unfinish1 {
          background-color: #5b93cd;
          color: #fff;
          padding: 3px;
          font-size: 12px;
        }
        .finish1 {
          background-color: #c55151;
          color: #fff;
          padding: 3px;
          font-size: 12px;
        }
        p {
          font-size: 12px;
          span:first-child {
            color: #a4a4a4;
          }
          span:last-child {
            color: #727272;
          }
          .workhour {
            color: #76acff !important;
          }
        }
      }
      p {
        padding: 2px;
        margin: 0;
        span {
          min-width: 84px;
          display: inline-block;
        }
      }
    }
    .company {
      width: 284px;
      height: 190px;
    }
    .working {
      padding: 0 10px;
      width: 284px;
      height: 140px;
      border: 1px solid rgba(220, 223, 230, 1);
      margin-top: 8px;
      .workingName {
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        &:hover {
          overflow: visible;
          white-space: normal;
        }
      }
    }
    .staffList {
      width: 284px;
      height: calc(100vh - 45px - 190px - 140px - 100px);
      padding: 13px 0 10px 13px;
      margin-top: 8px;
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(220, 223, 230, 1);
      border-radius: 4px;
      .staffTitle {
        list-style: none;
        font-size: 14px;
        margin: 0;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(34, 34, 34, 1);
      }
      li {
        position: relative;
        padding: 10px 0;
        margin-left: 17px;
        font-size: 12px;
        .name {
          font-size: 12px;
          // font-family: PingFang SC;
          font-weight: 500;
          color: rgba(34, 34, 34, 1);
          opacity: 0.7;
        }
        .status {
          position: absolute;
          right: 13px;
        }
        .statusa {
          color: #34c2aa;
        }
        .statusb {
          color: #ff4444;
        }
      }
    }
  }
  .time-line {
    float: right;
    height: calc(100vh - 45px - 84px );
    width: calc(100% - 284px - 8px);

    padding-left: 12px;
    border: 1px solid rgba(220, 223, 230, 1);
    .el-timeline {
      padding-left: 0;
      span {
        min-width: 0;
      }
      // .leftSpan {
      //   font-size: 12px;
      //   font-family: PingFang SC;
      //   font-weight: 500;
      //   color: rgba(34, 34, 34, 1);
      //   opacity: 0.7;
      // }
      // .rightSpan {
      //   font-size: 12px;
      //   font-family: PingFang SC;
      //   font-weight: 500;
      //   color: rgba(34, 34, 34, 1);
      // }
      // .special {
      //   color: rgba(42, 138, 255, 1) !important;
      // }
      .el-timeline-item__node--normal {
        display: none;
      }
      .el-timeline-item__tail {
        display: none;
      }
    }
    .time-line-item {
      position: relative;
      // margin-top: 5px;
      .el {
        height: 20px;
        margin: 7px 0 7px 0;
      }
      .el-card {
        margin-left: 20px;
        padding-top: 0px;
        height: fit-content;
        padding-bottom: 7px;
        color: #606266;
        border: 0;
        border-bottom: 1px solid #dcdfe6;
      }
      .el-card__body {
        padding: 10px 0;
      }
      .sub-title {
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: bold;
        margin: 0;
        color: rgba(34, 34, 34, 1);
        &:hover {
          cursor: pointer;
          color: #2c78bb;
          text-decoration: underline;
        }
      }
      .item-img {
        position: absolute;
        top: 31px;
        left: 10px;
      }
      .time-style {
        position: absolute;
        top: -5px;
        left: 0px;
        vertical-align: bottom;
        span:first-child {
          font-size: 16px;
          color: #222;
        }
        span:last-child {
          font-size: 12px;
          color: rgba(34, 34, 34, 1);
          opacity: 0.7;
        }
      }
      .el-timeline-item__content {
        // padding-top: 9px;
        height: 76px;
      }
      .warningNum {
        position: absolute;
        right: 10px;
        bottom: 28px;
        cursor: pointer;
        margin-right: 20px;
        .warning {
          color: #fe6644;
          font-size: 18px;
          height: 18px;
          width: 21px;
        }
        .num {
          position: absolute;
          right: 0;
          top: -7px;
          font-family: PingFang SC;
          font-size: 12px;
          color: #fe6644;
        }
      }
    }
  }
  .title {
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: bold;
    color: rgba(34, 34, 34, 1);
  }
  .leftSpan {
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(34, 34, 34, 1);
    opacity: 0.7;
  }
  .rightSpan {
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 500;
    color: rgba(34, 34, 34, 1);
  }
  .special {
    color: rgba(42, 138, 255, 1) !important;
  }
}
</style>
