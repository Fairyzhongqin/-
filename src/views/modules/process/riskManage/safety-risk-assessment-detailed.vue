<template>
  <div class="assessment-detailed" v-loading="dataListLoading">
    <el-scrollbar class="default-scrollbar" style="height:100%" wrap-class="default-scrollbar__wrap" view-class="p20-scrollbar__view">
      <div class="detailed-bg" v-show="!dataListLoading">
        <div class="header">
        </div>
        <div class="body">
          <table border="1" width="100%" cellspacing=0 cellpadding=0>
            <tr class="body-title">
              <td colspan="3" align="center">
                <span class="companyName">江苏利士德化工有限公司</span>
                <div class="body-select" v-if="level > 0 && preview !== '1'">
                  <el-form :model="selectForm" :rules="rules" ref="ruleForm" :inline="true">
                    <template v-if="selectFlag && preview !== '3'">
                      <el-form-item prop="value1">
                        <el-select v-model="selectForm.value1" size="mini" placeholder="请选择">
                          <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.label">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </template>
                    <span v-else style="display: inline-block;padding: 0 10px;font-weight: bold">{{workshop}}</span>
                    <span style="padding: 0 5px;">车间</span>
                    <template v-if="level > 1">
                      <template v-if="selectFlag && preview !== '3'">
                        <el-form-item prop="value2">
                          <el-select v-model="selectForm.value2" size="mini" placeholder="请选择">
                            <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.label">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </template>
                      <span v-else style="display: inline-block;padding: 0 10px;font-weight: bold">{{postOrTeam}}</span>
                      <span>{{name}}</span>
                    </template>
                  </el-form>
                </div>
              </td>
            </tr>
            <tr>
              <!--合并 '状态' 数据长度的列-->
              <td width="10%" style="min-width: 80px" :rowspan="stateDataList.length">{{name + '状态'}}</td>
              <!--如果是公司级就不显示报告名称-->
              <template v-if="stateDataList.length > 1">
                <td>
                  <div>{{stateDataList[0].reportName}}</div>
                </td>
              </template>
              <td class="stateMsg">
                <div v-html="stateDataList0.msg"></div>
              </td>
            </tr>
            <template v-if="stateDataList.length > 1">
              <tr v-for="(item, index) in stateDataList" v-if="index > 0" :key="index">
                <td width="20%" v-if="level !== 0">
                  <div>{{item.reportName}}</div>
                </td>
                <td class="stateMsg">
                  <div v-html="item.msg"></div>
                </td>
              </tr>
            </template>
            <!--状态 ---- 承诺 ***-->
            <tr>
              <!--合并 '承诺' 数据长度的列-->
              <td width="10%" style="min-width: 80px" :rowspan="promiseDataList.length">{{name + '承诺'}}</td>
              <!--一般不显示承诺名称，防止多个-->
              <template v-if="promiseDataList.length > 1">
                <td>
                  <div>{{promiseDataList[0].reportName}}</div>
                </td>
              </template>
              <td :colspan="promiseDataList.length + 1" class="promiseMsg">
                <div v-html="promiseDataList0.msg"></div>
              </td>
            </tr>
            <template v-if="promiseDataList.length > 1">
              <tr v-for="(item, index) in promiseDataList" v-if="index > 0" :key="index">
                <td width="20%" v-if="level">
                  <div>{{item.reportName}}</div>
                </td>
                <td :colspan="promiseDataList.length + 1" class="promiseMsg">
                  <div v-html="item.msg"></div>
                </td>
              </tr>
            </template>
          </table>
        </div>
        <div class="ps" v-if="preview === '2'">{{ps}}</div>
        <div class="horn top-l"></div>
        <div class="horn top-r"></div>
        <div class="horn bottom-l"></div>
        <div class="horn bottom-r"></div>
      </div>
      <div class="footer" v-show="!dataListLoading">
        <span v-if="preview === '2'">
          <el-button type="primary" @click="finish()" :disabled="isDisabled">完成研判</el-button>
        </span>
        <span>
          <el-button @click="close()">{{btnName}}</el-button>
        </span>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { reportTemplateList } from '@/api/sou/productionSafety'
import { reportRecordAdd, reportRecordInfo } from '@/api/process/riskJudgment'
export default {
  data () {
    return {
      dataList: [],
      stateDataList: [],
      promiseDataList: [],
      valueList: [],
      name: '',
      selectForm: {
        value1: '',
        value2: ''
      },
      selectFlag: true,
      level: '',
      preview: '',
      id: '',
      btnName: '返回',
      stateDataList0: '',
      promiseDataList0: '',
      workshop: '',
      postOrTeam: '',
      isDisabled: false,
      dataListLoading: false,
      ps: '* 请填写全部浅绿色背景区域',
      options1: [{
        label: '反应一车间',
        value: 'workshop1'
      }, {
        label: '反应二车间',
        value: 'workshop2'
      }, {
        label: '反应三车间',
        value: 'workshop3'
      }],
      options2: [{
        label: '巡检班组',
        value: 'workshop1'
      }, {
        label: '测试班组',
        value: 'workshop2'
      }, {
        label: '反应班组',
        value: 'workshop3'
      }],
      rules: {
        value1: [{ required: true, message: ' ', trigger: 'change' }],
        value2: [{ required: true, message: ' ', trigger: 'change' }]
      }
    }
  },
  created () {
    // this.level = this.$route.query.level || this.level
    // this.preview = this.$route.query.preview || this.preview
    // this.id = this.$route.query.id || this.id
    // this.getDataList()
  },
  activated () {
    this.level = this.$route.query.level || this.level
    this.preview = this.$route.query.preview || this.preview
    this.id = this.$route.query.id || this.id
    this.getDataList()
    this.btnName = this.preview === '2' ? '取消' : '返回'
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.dataList = []
      this.stateDataList = []
      this.promiseDataList = []
      if (this.level === '0') {
        this.name = '公司'
      } else if (this.level === '1') {
        this.name = '车间'
      } else if (this.level === '2') {
        this.name = '班组'
      } else if (this.level === '3') {
        this.name = '岗位'
      }
      if (this.id === '') {
        reportTemplateList({
          'page': this.pageIndex,
          'limit': this.pageSize,
          'status': '',
          'reportLevel': this.level
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.init()
            this.dataList.map(item => {
              if (item.reportType === '0') {
                this.stateDataList.push(item)
                this.stateDataList0 = this.stateDataList[0]
              } else if (item.reportType === '1') {
                this.promiseDataList.push(item)
                this.promiseDataList0 = this.promiseDataList[0]
              }
            })
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          setTimeout(_ => {
            this.dataListLoading = false
          }, 200)
        }).catch((err) => {
          this.dataListLoading = false
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
      } else {
        reportRecordInfo({ 'id': this.id }).then(({ data }) => {
          if (data && data.code === 0) {
            this.dataList = data.data.contentList
            this.workshop = data.data.judgedWorkshop
            this.postOrTeam = data.data.judgedPost || data.data.judgedTeam
            // this.init()
            this.dataList.map(item => {
              if (item.reportType === '0') {
                this.stateDataList.push(item)
                this.stateDataList0 = this.stateDataList[0]
              } else if (item.reportType === '1') {
                this.promiseDataList.push(item)
                this.promiseDataList0 = this.promiseDataList[0]
              }
            })
          }
          setTimeout(_ => {
            this.dataListLoading = false
          }, 200)
        })
      }
    },
    // 初始化
    init () {
      this.isDisabled = false
      this.$nextTick(() => {
        this.dataList.map((item, index) => {
          let arr = item.msg.split('$')
          let valList = []
          let msg = item.msg
          arr.map(item => {
            if (item.indexOf('#') !== -1) {
              if (item.match(/#(\S*)#/)) {
                valList.push(item.match(/#(\S*)#/)[1])
              }
            }
          })
          if (this.preview === '1') {
            valList.map(item => {
              msg = msg.replace('$#' + item + '#$', '  ')
            })
          } else if (this.preview === '2') {
            valList.map(item => {
              msg = msg.replace('$#' + item + '#$', '<input class="inputDate"></input>')
            })
          }
          item.msg = msg
        })
      })
    },
    // 填写数据 / 处理数据
    finish () {
      let dom1 = document.getElementsByClassName('inputDate')
      for (let i = 0; i < dom1.length; i++) {
        this.valueList.push(dom1[i].value)
      }
      // 校验是否填入了内容
      let flag = false
      // 验证下拉框是否选择
      if (this.level !== '0') {
        this.$refs['ruleForm'].validate((valid) => {
          if (!valid) {
            flag = true
          }
        })
      }
      // 验证输入框是否填写
      this.valueList.map((item, index) => {
        if (item === '') {
          flag = true
          dom1[index].classList.add('notfilled')
        }
      })
      this.selectFlag = true
      if (flag) {
        this.$message.error('请填写完整')
        this.valueList = []
        return
      }
      this.dataList.map(item => {
        item.msg = item.msg.replace(/<input class="inputDate"><\/input>/g, '<span class="spanDate"></span>')
      })
      this.$nextTick(() => {
        let dom2 = document.getElementsByClassName('spanDate')
        for (let i = 0; i < dom2.length; i++) {
          dom2[i].innerText = this.valueList[i]
        }
        let dom3 = document.getElementsByClassName('stateMsg')
        for (let i = 0; i < dom3.length; i++) {
          this.stateDataList[i].msg = dom3[i].innerHTML
        }
        let dom4 = document.getElementsByClassName('promiseMsg')
        for (let i = 0; i < dom4.length; i++) {
          this.promiseDataList[i].msg = dom4[i].innerHTML
        }
        this.workshop = this.selectForm.value1
        this.postOrTeam = this.selectForm.value2
        this.selectFlag = false
        // let title = document.getElementsByClassName('body-title')[0].innerText
        // let msg = document.getElementsByClassName('body')[0].innerHTML
        reportRecordAdd({
          judgedCompany: '江苏利士德化工有限公司',
          judgedObject: this.level, // 研判对象类型
          judgedWorkshop: this.selectForm.value1, // 研判车间
          judgedTeam: this.selectForm.value2, // 研判班组
          judgedPost: this.selectForm.value2, // 研判岗位
          contentList: this.dataList
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => { }
            })
            this.isDisabled = true
            this.btnName = '返回'
            // this.$router.push({ path: '/process/riskManage/safety-risk-assessment-list' })
          } else {
            this.$message.error(data.msg)
          }
        }).catch((err) => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
      })
    },
    close () {
      if (this.preview === '1') {
        this.$router.push({ path: '/sou/productionSafety/production-safety' })
      } else if (this.preview === '2' || this.preview === '3') {
        this.$router.push({ path: '/process/riskManage/safety-risk-assessment-list' })
      }
      this.level = ''
      this.preview = ''
      this.id = ''
    }
  }
}
</script>

<style lang="scss">
.assessment-detailed {
  height: 100%;
  background-color: #fbfbfb;
  .detailed-bg {
    position: relative;
    width: 60%;
    min-width: 700px;
    min-height: 80%;
    padding: 80px;
    margin: 20px auto 0;
    background-color: #ffffff;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
    font-family: PingFang SC;
    .header {
      text-align: center;
    }
    .body {
      width: 100%;
      table {
        position: relative;
        border-collapse: collapse;
        tr {
          td {
            padding: 10px;
            /deep/ .body-select {
              input {
                width: auto;
                border: 1px solid #cccccc;
                background-color: #ffffff;
              }
              i {
                line-height: 27px;
              }
              .el-form {
                display: flex;
                align-items: center;
                justify-content: center;
                .el-form-item {
                  margin-bottom: 0;
                }
              }
            }
            input {
              width: 50px;
              padding-left: 5px;
              border: none;
              border-bottom: 1px solid #383b45;
              outline: none;
              background-color: rgba(0, 248, 122, 0.41);
              &:focus {
                border-bottom: 1px solid #42b983;
              }
            }
            .notfilled {
              background-color: rgba(255, 0, 0, 0.3);
            }
            div {
              .spanDate {
                display: inline-block;
                /*width: 50px;*/
                /*text-align: center;*/
                padding-left: 10px;
                padding-right: 10px;
                font-weight: bold;
                /*border-bottom: 1px solid #000000;*/
              }
            }
            .companyName {
              display: block;
              font-size: 24px;
              font-weight: bold;
              line-height: 36px;
              margin-bottom: 10px;
            }
          }
        }
      }
    }
    .ps {
      display: flex;
      justify-content: flex-end;
      width: 100%;
      margin: 0 auto;
      color: #fa3b3c;
    }
    .horn {
      position: absolute;
      width: 30px;
      height: 30px;
    }
    .top-l {
      top: 20px;
      left: 20px;
      border-right: 1px solid #cccccc;
      border-bottom: 1px solid #cccccc;
    }
    .top-r {
      top: 20px;
      right: 20px;
      border-left: 1px solid #cccccc;
      border-bottom: 1px solid #cccccc;
    }
    .bottom-l {
      bottom: 20px;
      left: 20px;
      border-right: 1px solid #cccccc;
      border-top: 1px solid #cccccc;
    }
    .bottom-r {
      bottom: 20px;
      right: 20px;
      border-left: 1px solid #cccccc;
      border-top: 1px solid #cccccc;
    }
  }
  .footer {
    text-align: center;
    margin-top: 10px;
    margin-bottom: 50px;
  }
}
</style>
