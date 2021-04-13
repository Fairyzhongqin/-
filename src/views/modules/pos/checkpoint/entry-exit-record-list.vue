<!--进出记录-->
<template>
  <div class="EntryRecord mod-config">
    <el-row class="record">
      <el-col :span="7"
              class="one">
        <el-card>
          <div slot="header"
               class="clearfix">
            <span>二道门卡口</span>
          </div>
          <el-scrollbar style="height: calc(100vh - 94px - 304px)">
            <div class="lis"
                 v-for="(item,index) in selectList"
                 :key="item.id"
                 @click="getInfo(index,item.fencingId)"
                 :class="{active:selectedIndex===index}">
              <span>{{index+1+'/'+selectList.length}}</span>
              <span>卡口名称：{{item.name?item.name:'暂无'}}</span>
              <p>
                <span>值班人员：{{item.personShow? item.personShow:'暂无'}}</span>
                <span>值班电话：{{item.contact ? item.contact:'暂无'}}</span>
              </p>
            </div>
          </el-scrollbar>
        </el-card>
      </el-col>
      <el-col :span="17"
              class="two">
        <el-card>
          <div slot="header"
               class="clearfix">
            <span>卡口进出记录</span>
          </div>
          <el-form :inline="true"
                   ref="dataForm"
                   :model="dataForm"
                   class="el-form-margin-bottom"
                   @keyup.enter.native="getDataList()">
            <el-form-item label="姓名/工号"
                          prop="name"
                          width="200">
              <el-input v-model="dataForm.name"
                        size="mini"
                        clearable
                        placeholder="请输入姓名/工号"></el-input>
            </el-form-item>
            <el-form-item label="日期范围"
                          prop="dataRange">
              <el-date-picker v-model="dataForm.dataRange"
                              type="daterange"
                              range-separator="至"
                              start-placeholder="开始日期"
                              end-placeholder="结束日期"
                              @change="change"
                              clearable
                              @clear="clear">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="primary"
                         size="mini"
                         @click="getDataList(firstId)"
                         v-waves>
                <i class="el-icon-search"></i>
                查询</el-button>
              <el-button type="info"
                         size="mini"
                         icon="el-icon-refresh-right"
                         @click="
                   resetForm('dataForm')"
                         v-waves>重置</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="dataList"
                    border
                    :height="tableHeight"
                    @cell-click="cellClick"
                    ref="multipleTable"
                    v-loading="dataListLoading"
                    @selection-change="selectionChangeHandle"
                    style="width: 100%;">
            <el-table-column type="index"
                             label="序号"
                             align="center"
                             width="50">
            </el-table-column>
            <el-table-column prop="personGh"
                             :show-overflow-tooltip="true"
                             align="center"
                             label="工号(车牌号)">
            </el-table-column>
            <el-table-column label="姓名"
                             prop="name"
                             min-width="50"
                             align="center"
                             :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="sex"
                             align="center"
                             width="50"
                             label="性别">
              <template slot-scope="scope">
                {{scope.row.sex==='0'?'男':'女'}}
              </template>
            </el-table-column>
            <el-table-column prop="cgfromName"
                             label="人员类型"
                             :show-overflow-tooltip="true"
                             align="center">
            </el-table-column>
            <el-table-column prop="state"
                             align="center"
                             width="80"
                             label="状态">
              <template slot-scope="scope">
                <el-tag v-if="scope.row.state==='0'"
                        type="success">
                  进入
                </el-tag>
                <el-tag v-if="scope.row.state==='1'"
                        type="danger">
                  离开
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="recordTime"
                             align="center"
                             label="时间"
                             :show-overflow-tooltip="true">
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChangeHandle"
                         @current-change="currentChangeHandle"
                         :current-page="pageIndex"
                         background
                         :page-sizes="[10, 20, 50, 100]"
                         :page-size="pageSize"
                         :total="totalPage"
                         layout="total, sizes, prev, pager, next, jumper"
                         class="pos">
          </el-pagination>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { entryRecordList, getAllSelectList } from '@/api/pos/checkpoint'
import { getLabels } from '@/api/common/sys'
import waves from '@/utils/waves'
export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        name: '',
        startTime: '',
        endTime: '',
        dataRange: []
      },
      selectedIndex: 0,
      firstId: '',
      selectList: [],
      // 绑定类型 0:人员 1:车辆
      typeList: [{
        label: '0',
        value: '人员'
      }, {
        label: '1',
        value: '车辆'
      }],
      locdevtypeList: [], // 设备类型list
      statusList: [], // 设备状态list
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      personInfoVisible: false,
      bindingStaffVisible: false,
      vehicleInfoVisible: false,
      tableHeight: 0
    }
  },
  components: {
  },
  activated () {
    // this.getDataList() // 获取数据列表
  },
  created () {
    // table高度固定
    this.$nextTick(() => {
      let manHeight = document.documentElement['clientHeight']
      this.tableHeight = manHeight - 110 - this.$refs.dataForm.$el.clientHeight - 35 - 47 - 42
    })
    this.getBaseData() // 加载基础数据
    this.getAllSelect()
  },
  methods: {
    // 对象信息
    personInfoHandle (info, type) {
      if (type === '0') {
        // 人员信息
        this.personInfoVisible = true
        this.$nextTick(() => {
          this.$refs.personInfo.init(info)
        })
      } else {
        // 车辆信息
        this.vehicleInfoVisible = true
        this.$nextTick(() => {
          this.$refs.vehicleInfo.init(info)
        })
      }
    },
    change (val) {
      console.log(val)
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取数据列表
    getDataList (fencingId) {
      this.dataList = []
      if (fencingId) {
        this.firstId = fencingId
      }
      this.dataListLoading = true
      entryRecordList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'name': this.dataForm.name,
        'fencingId': this.firstId,
        'endTime': this.dataForm.dataRange[1] ? new Date(this.dataForm.dataRange[1]).Format('yyyy-MM-dd') : null,
        'startTime': this.dataForm.dataRange[0] ? new Date(this.dataForm.dataRange[0]).Format('yyyy-MM-dd') : null
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.count
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    getAllSelect () {
      this.dataListLoading = true
      getAllSelectList({
        'type': '1'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.selectList = data.list
          console.log(this.selectList)
          this.getDataList(this.selectList[0].fencingId)
        } else {
          this.selectList = []
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 点击左侧部分，查询右侧对应的卡口信息
    getInfo (index, fencingId) {
      this.$refs.dataForm.resetFields()
      this.selectedIndex = index
      this.getDataList(fencingId)
    },
    // 清除之后的处理函数
    clear () {
      this.dataForm.dataRange = []
    },

    // 加载基础数据
    getBaseData () {
      // 设备类型 - 字典
      getLabels({
        'type': 'zxkl_device_type'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.locdevtypeList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
      // 设备状态 - 字典
      getLabels({
        'type': 'device_status'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.statusList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getDataList(this.firstId)
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 绑定人员
    bindingStaffHandle (id) {
      this.bindingStaffVisible = true
      this.$nextTick(() => {
        this.$refs.bindingStaff.init(id)
      })
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
    }
  },
  filters: {
    formatLocdevtype (value, map) {
      let optionName = ''
      map.map((val) => {
        if (value === val.label) {
          optionName = val.value
        }
      })
      return optionName
    },
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
.EntryRecord {
  padding: 25px 30px;
  // height: calc(100% - 30px - 34px - 55px);
  .record {
    width: 100%;
    height: calc(100vh - 18px - 115px);
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
    .alermicon {
      padding-left: 10px;
      color: red;
    }
    .el-range-editor--medium .el-range-separator,
    .el-range-editor--medium .el-range-input {
      font-size: 12px;
    }
    .el-range-editor--medium.el-input__inner {
      height: 28px;
      // margin-top: 5px;
    }
    .el-date-editor .el-range-separator {
      padding: 0px 0px;
    }

    .el-range-editor.el-input__inner {
      padding: 0px 10px;
    }
    .el-card__header {
      background-color: #5b96d2;
      // background-color: #41485b;
      color: #fff;
      font-size: 12px;
      padding: 8px;
      border-bottom: none;
    }
    .el-card__body {
      border: 1px solid #ccc;
      border-top: 0;
      height: calc(100vh - 165px);
    }
    .one {
      padding-right: 7px;
      height: calc(100vh - 135px);
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
      .el-card__body {
        padding: 3px;
      }
      .lis {
        padding: 10px;
        margin: 0 10px 10px 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
        background-color: #fff;
        position: relative;
        font-size: 12px;
        &:nth-child(1) {
          margin-top: 10px;
        }
        &:hover {
          border: 1px solid #5693c9;
          box-shadow: 0px 0px 2px 0px #5693c9;
        }
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
        p {
          span {
            background-color: #fff !important;
            color: #333333;
          }
        }
      }
      .active {
        border: 1px solid #2c78bb;
      }
    }
    .two {
      position: relative;
      height: 100%;
      .el-scrollbar__wrap {
        overflow-x: hidden;
      }
      .pos {
        // position: absolute;
        // // margin-top: 100px !important;
        // right: 0;
        // bottom: 20px;
      }
      .el-table::before {
        background-color: #ebeef5;
      }
      .el-table .el-table__header-wrapper thead tr .is-leaf {
        color: #222;
      }
      .el-button:nth-child(1) {
        background-color: #5b96d2;
        border-color: #5b96d2;
        &:hover {
          background-color: #6fa9e4;
          border-color: #6fa9e4;
        }
      }
      .el-form-item__label {
        color: #333;
      }
    }
  }
}
</style>
