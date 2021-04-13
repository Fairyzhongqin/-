<template>
  <!-- 巡检任务基本信息页 -->
  <div class="stationWorkInfo">
    <!-- 任务 和 巡检点-->
    <el-row class="workInfo">
      <el-col :span="10">
        <el-form ref="dataForm"
                 :model="dataForm"
                 :rules="dataRule">
          <el-form-item label="任务名称"
                        label-position="left"
                        prop="name"
                        label-width="70px">
            <el-input v-model="dataForm.name"
                      size="mini"
                      placeholder="任务名称"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="任务编号"
                        label-position="left"
                        prop="code"
                        label-width="70px">
            <el-input v-model="dataForm.code"
                      size="mini"
                      placeholder="任务编号"
                      clearable></el-input>
          </el-form-item>
          <el-form-item label="巡检类型"
                        label-position="left"
                        prop="patrolType"
                        label-width="70px">
            <el-select v-model="dataForm.patrolType"
                       size="mini"
                       placeholder="请选择巡检类型">
              <el-option v-for="item in options"
                         :key="item.value"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="巡检班组"
                        label-position="left"
                        label-width="70px"
                        required>
            <!-- 搜索框-->
            <el-select v-model="dataForm.teamId"
                       filterable
                       size="mini"
                       placeholder="请选择巡检班组">
              <el-option v-for="item in stationNameList"
                         :key="item.value"
                         :label="item.stationName"
                         :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-row>
            <el-col :span="11">
              <el-form-item label="巡检周期"
                            label-position="left"
                            prop="period"
                            required
                            label-width="70px">
                <!-- 巡检周期类型-->
                <el-select v-model="dataForm.period"
                           size="mini"
                           placeholder="请选择巡检周期"
                           class="pos">
                  <el-option v-for="item in optionsPeriod"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="dataForm.period=='1'"
                    :span="12">
              <el-form-item label-position="left"
                            prop="daysOfWeek">
                <!-- 巡检以周为周期的选择框 -->
                <el-select v-model="dataForm.daysOfWeek"
                           multiple
                           collapse-tags
                           size="mini"
                           placeholder="请选择日期">
                  <el-option v-for="item in WeekPeriod"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="dataForm.period=='2'"
                    :span="12">
              <el-form-item label-position="left"
                            prop="daysOfMonth">
                <!-- 巡检以月为周期的选择框 -->
                <el-select v-model="dataForm.daysOfMonth"
                           multiple
                           size="mini"
                           collapse-tags
                           placeholder="请选择日期">
                  <el-option v-for="item in monthPeriod"
                             :key="item.value"
                             :label="item.label"
                             :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </el-row>

          <el-form-item label="巡检时间"
                        label-position="left"
                        label-width="70px"
                        required>
            <el-time-select placeholder="起始时间"
                            size="mini"
                            v-model="startTime"
                            :picker-options="{start: '00:00',step: '00:15',end: '24:00'}"
                            class="pos">
            </el-time-select>
            <el-time-select placeholder="结束时间"
                            v-model="endTime"
                            size="mini"
                            :picker-options="{start: '00:15',step: '00:15',end: '24:00',minTime:startTime}">
            </el-time-select>
            <el-tooltip v-if="tipVisible"
                        class="item"
                        effect="dark"
                        content="时间段重复，请重新添加时间段"
                        placement="right">
              <el-button class="addTime"
                         size="mini"
                         type="primary"
                         plain
                         @click="addTime">添加</el-button>
            </el-tooltip>
            <el-button v-if="!tipVisible"
                       class="addTime"
                       size="mini"
                       type="primary"
                       plain
                       @click="addTime">添加</el-button>
          </el-form-item>
          <el-form-item prop="periodTimeEntityList"
                        label-width="70px">
            <div class="times"
                 v-if="dataForm.periodTimeEntityList.length>0">
              <el-tag v-for="(item,index) in dataForm.periodTimeEntityList"
                      :key="index"
                      closable
                      @close="handleClose(index)">{{item.beginTime+'-'+item.endTime}}</el-tag>
            </div>
          </el-form-item>

          <el-row class="btn">
            <el-form-item>
              <el-col :span="24"
                      align="center">
                <el-button @click="goStationWork">取消</el-button>
                <el-button type="primary"
                           @click="enterArea()">保存并到下一步</el-button>
              </el-col>
            </el-form-item>
          </el-row>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>
<script>
// 引入拖拽的组件，注册组件
import { stationList, stationSaveWork, patrolTaskInfo } from '@/api/pos/person'
export default {
  components: {

  },
  props: ['active', 'id', 'taskInfoForm'],
  created () {
    this.getMonth()
    this.getDataList()
  },
  data () {
    return {
      dialogVisible: true,
      data: {},
      dataForm:
      {
        id: '',
        name: '',
        code: '',
        patrolType: '', // 巡检类型
        enableFlag: '0',
        period: '', // 周期类型
        daysOfMonth: [], // 选择的月中的巡检的天数的集合
        daysOfWeek: [], // 选择星期的周一到周日的集合
        periodTimeEntityList: [], // 时间段列表
        teamId: ''// 班组的id
      },
      startTime: '', // 起始时间
      endTime: '', // 结束时间
      dataRule: {
        name: [{ required: true, message: '任务名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '任务编号不能为空', trigger: 'blur' }],
        patrolType: [
          { required: true, message: '请选择巡检类型', trigger: 'change' }
        ],
        period: [{
          required: true, message: '请选择巡检周期类型', trigger: 'change'
        }],
        periodTimeEntityList: [{ type: 'array', required: true, message: '请添加巡检时间' }],
        daysOfMonth: [{ required: true, message: '请选择日期', trigger: 'change' }],
        daysOfWeek: [{ required: true, message: '请选择日期', trigger: 'change' }]

      },
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
      monthPeriod: [], // 月的日期选项
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
      stationNameList: [], // 班组名称列表
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      tipVisible: false
    }
  },
  methods: {
    // 初始数据
    init (id) {
      this.isDisabled = false
      this.dataForm.id = id || ''
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        if (id) {
          patrolTaskInfo({
            'id': id
          }).then(({ data }) => {
            if (data && data.code === 0) {
              console.log(data)
              this.dataForm = data.data
              var daysOfMonth = this.dataForm.daysOfMonth
              this.dataForm.daysOfMonth = daysOfMonth ? daysOfMonth.split(',') : []
              var daysOfWeek = this.dataForm.daysOfWeek
              this.dataForm.daysOfWeek = daysOfWeek ? daysOfWeek.split(',') : []
            } else {
              this.dataList = []
              this.totalPage = 0
            }
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
            this.dataListLoading = false
          })
        }
      })
    },
    // 返回首页
    goStationWork () {
      this.$emit('goStationWork')
    },
    // 进入巡检任务区域和巡检点
    enterArea () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          console.log(this.dataForm.daysOfMonth, '1111111')
          console.log(this.dataForm.daysOfWeek, '222222')
          this.dataForm.daysOfWeek = this.dataForm.daysOfWeek.length > 0 ? this.dataForm.daysOfWeek.join(',') : ''
          this.dataForm.daysOfMonth = this.dataForm.daysOfMonth.length > 0 ? this.dataForm.daysOfMonth.join(',') : ''
          stationSaveWork(
            this.dataForm
          ).then(({ data }) => {
            if (data && data.code === 0) {
              // this.data.data1 = 'stationWorkArea'
              // this.data.data2 = 1
              // this.data.data3 = data.data.id
              // this.$store.commit('editName', this.data)
              this.$emit('stationgoArea', 1, data.data.id, data.data)
              console.log(data)
            } else {
              this.$message.error(data.msg)
            }
            this.dataListLoading = false
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
            this.dataListLoading = false
          })
        }
      })
    },
    // 生成月的选择项
    getMonth () {
      for (var i = 0; i < 31; i++) {
        let item = {}
        item.label = i + 1 + '号'
        item.value = i + 1 + ''
        this.monthPeriod.push(item)
      }
    },
    // 将添加的日期放在列表里
    addTime () {
      this.tipVisible = false
      if (!this.startTime || !this.endTime) {
        return
      }
      let arr = this.dataForm.periodTimeEntityList
      let arr1 = []
      arr.forEach(item => {
        arr1.push(item.beginTime + '-' + item.endTime)
      })
      let obj = {}
      obj.beginTime = this.startTime
      obj.endTime = this.endTime
      if (arr1.indexOf(this.startTime + '-' + this.endTime) === -1) {
        this.dataForm.periodTimeEntityList.push(obj)
      } else {
        this.tipVisible = true
      }
      this.startTime = ''
      this.endTime = ''
    },
    // 获取巡检班组名称的列表
    getDataList () {
      this.dataListLoading = true
      stationList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'stationName': this.dataForm.stationName
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.stationNameList = data.page.list
          this.totalPage = data.page.count
          console.log(this.stationNameList)
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
    // 标签关闭的处理函数
    handleClose (index) {
      this.dataForm.periodTimeEntityList.splice(index, 1)
    }

  }
}
</script>
<style lang="scss">
.stationWorkInfo {
  padding-top: 30px;
  .workInfo {
    width: 100%;
    position: relative;
  }
  .el-form {
    margin-top: 30px;
    position: absolute;
    width: 600px;
    left: 50%;
    transform: translateX(-50%);
    .el-input {
      width: 100%;
    }
  }
  .el-form-item__content {
    display: flex;
    // justify-content: center;
    .el-button {
      border-radius: 30px;
      margin: 0 7px;
      // background-color: #4aaff6;
    }
  }
  .times {
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    width: 100%;
    // height: 100px;
    .el-tag {
      margin: 7px;
      padding: 0 5px;
    }
  }
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .pos {
    margin-right: 10px;
  }
  .addTime {
    border-radius: 3px !important;
    float: right;
  }
  .btn {
    margin-top: 25px;
  }
}
</style>
