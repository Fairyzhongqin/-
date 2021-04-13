<!-- 表格新增和详情页 -->
<template>
  <el-dialog :title="(preview==='1'?''+(!dataForm.id ? '新增' : '修改'):'查看') + '检查表'" :close-on-click-modal="false" class="check-table-add-dialog" width="900px" :visible.sync="visible">
    <div class="check-table-add" v-loading="dataListLoading">
      <el-scrollbar class="default-scrollbar" style="height:100%;width:100%" wrap-class="default-scrollbar__wrap" view-class="p20-scrollbar__view">
        <div class="detailed-bg" v-show="!dataListLoading">
          <!-- <div class="header">
          </div> -->
          <div class="body">
            <el-form ref="dataForm" :rules="dataRule" :model="dataForm">
              <table border="1" width="100%" cellspacing=0 cellpadding=0>
                <tr class="body-title">
                  <template v-if="preview==='1'">
                    <td class="bg-style">
                      <span :class="{item:preview==='1'}">名称</span>
                    </td>
                    <td colspan="6">
                      <el-form-item prop="name">
                        <el-input v-model="dataForm.name" clearable placeholder="检查表名称"></el-input>
                      </el-form-item>
                    </td>
                  </template>
                  <template v-else>
                    <td colspan="7" align="center" style="font-size:18px">
                      {{dataForm.name}}
                    </td>
                  </template>
                </tr>
                <tr>
                  <td class="body-title bg-style"><span :class="{item:preview==='1'}">检查人</span></td>
                  <td colspan="2">
                    <template v-if="preview==='1'">
                      <el-form-item prop="checkPerson">
                        <el-input v-model="dataForm.checkPerson" placeholder="检查人" @focus="selectStaffShow" size="mini" class="size-mini-pople-input" clearable>
                          <el-button slot="append" @click="selectStaffShow" size="mini">选择</el-button>
                        </el-input>
                      </el-form-item>
                    </template>
                    <template v-else>
                      {{dataForm.checkPerson}}
                    </template>
                  </td>
                  <td class="check-time bg-style"><span :class="{item:preview==='1'}">检查时间</span></td>
                  <td colspan="3">
                    <template v-if="preview==='1'">
                      <el-form-item prop="checkDate">
                        <el-date-picker v-model="dataForm.checkDate" type="datetime" placeholder="选择日期时间">
                        </el-date-picker>
                      </el-form-item>
                    </template>
                    <template v-else>
                      {{dataForm.checkDate}}
                    </template>
                  </td>
                </tr>
                <tr>
                  <td class="bg-style"><span :class="{item:preview==='1'}">检查计划</span></td>
                  <td colspan="6">
                    <template v-if="preview==='1'">
                      <el-form-item prop="plan">
                        <el-input v-model="dataForm.plan" clearable placeholder="例如(每月检查一次)"></el-input>
                      </el-form-item>
                    </template>
                    <template v-else>
                      {{dataForm.plan}}
                    </template>
                  </td>
                </tr>
                <!-- 目的 -->
                <tr>
                  <td class="bg-style"><span :class="{item:preview==='1'}">检查目的</span></td>
                  <td colspan="6">
                    <template v-if="preview==='1'">
                      <el-form-item prop="aim">
                        <el-input v-model="dataForm.aim" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" clearable placeholder="检查目的" maxlength="500" show-word-limit></el-input>
                      </el-form-item>
                    </template>
                    <template v-else>
                      {{dataForm.aim}}
                    </template>
                  </td>
                </tr>
                <tr>
                  <td class="bg-style"><span :class="{item:preview==='1'}">检查要求</span></td>
                  <td colspan="6">
                    <template v-if="preview==='1'">
                      <el-form-item prop="requirement">
                        <el-input v-model="dataForm.requirement" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" clearable placeholder="检查要求" maxlength="500" show-word-limit></el-input>
                      </el-form-item>
                    </template>
                    <template v-else>
                      {{dataForm.requirement}}
                    </template>
                  </td>
                </tr>

                <tr>
                  <td align="center" class="bg-style sort">
                    <!-- <span class="addItem"><i class="el-icon-circle-plus-outline"></i></span> -->
                    序号
                  </td>
                  <td align="center" class="bg-style"><span :class="{item:preview==='1'}">检查项</span></td>
                  <td align="center" class="bg-style"><span :class="{item:preview==='1'}">检查方法</span></td>
                  <td align="center" class="bg-style"><span :class="{item:preview==='1'}">检查标准</span></td>
                  <td align="center" class="bg-style"><span :class="{item:preview==='1'}">检查结果</span></td>
                  <td align="center" class="bg-style"><span :class="{item:preview==='1'}">检查问题</span></td>
                  <td align="center" v-if="preview==='1'" class="bg-style">操作</td>
                </tr>
                <template v-if="dataForm.checkList.length>0">
                  <tr v-for="(item,index) in dataForm.checkList" :key="index">
                    <td align="center" class="sort">
                      {{index+1}}
                    </td>
                    <td>
                      <template v-if="preview==='1'">
                        <el-form-item :prop="'checkList.'+index+'.itemName'" :rules="dataRule.contentRules.itemName">
                          <el-input v-model="item.itemName" placeholder="检查项名称" clearable></el-input>
                        </el-form-item>
                      </template>
                      <template v-else>
                        {{item.itemName}}
                      </template>
                    </td>
                    <td>
                      <template v-if="preview==='1'">
                        <el-form-item :prop="'checkList.'+index+'.method'" :rules="dataRule.contentRules.method">
                          <el-input v-model="item.method" placeholder="检查方法" clearable></el-input>
                        </el-form-item>
                      </template>
                      <template v-else>
                        {{item.method}}
                      </template>

                    </td>
                    <td>
                      <template v-if="preview==='1'">
                        <el-form-item :prop="'checkList.'+index+'.standard'" :rules="dataRule.contentRules.standard">
                          <el-tooltip v-if="item.standard" effect="dark" :content="item.standard" placement="top-start">
                            <el-input v-model="item.standard" type="textarea" :autosize="{ minRows:1, maxRows: 4}" placeholder="检查标准" @focus="inputHandle(index,'standard')"></el-input>
                          </el-tooltip>
                          <el-input v-else v-model="item.standard" type="textarea" :autosize="{ minRows:1, maxRows: 4}" placeholder="检查标准" @focus="inputHandle"></el-input>
                        </el-form-item>
                      </template>
                      <template v-else>
                        {{item.standard}}
                      </template>
                    </td>
                    <td>
                      <template v-if="preview==='1'">
                        <el-form-item :prop="'checkList.'+index+'.result'" :rules="dataRule.contentRules.result">
                          <span>合格：</span>
                          <el-radio v-model="item.result" label="0">是</el-radio>
                          <el-radio v-model="item.result" label="1">否</el-radio>
                        </el-form-item>
                      </template>
                      <template v-else>
                        {{item.result==='0'?'合格':'不合格'}}
                      </template>

                    </td>
                    <td>
                      <template v-if="preview==='1'">
                        <el-form-item :prop="'checkList.'+index+'.problem'" :rules="dataRule.contentRules.problem">
                          <el-tooltip v-if="item.problem" effect="dark" :content="item.problem" placement="top-start">
                            <el-input v-model="item.problem" type="textarea" :autosize="{ minRows: 1, maxRows: 4}" placeholder="检查问题"></el-input>
                          </el-tooltip>
                          <el-input v-else v-model="item.problem" type="textarea" :autosize="{ minRows: 1, maxRows: 4}" placeholder="检查问题"></el-input>
                        </el-form-item>
                      </template>
                      <template v-else>
                        {{item.problem}}
                      </template>
                    </td>
                    <td align="center" v-if="preview==='1'">
                      <el-button type="text" style="color:#E63031" @click="deleteItem(index)">删除</el-button>
                    </td>
                  </tr>
                </template>
                <tr v-if="this.preview!=='2'">
                  <td colspan="7" align=center>
                    <el-popover v-model="popoverVisible" ref="popover" placement="top" width="271" trigger="click">
                      <el-button type="primary" @click="addCheckContent()" size="mini">新增已有检查内容</el-button>
                      <el-button type="primary" @click="addCheckItem()" size="mini">新增自定义检查项</el-button>
                    </el-popover>
                    <el-button v-popover:popover type="primary" size="mini">新增</el-button>
                  </td>
                </tr>
                <tr>
                  <td class="bg-style"><span :class="{item:preview==='1'}">检查记录</span></td>
                  <td colspan="6">
                    <template v-if="this.preview==='1'">
                      <el-form-item prop="hookRecord">
                        <el-input v-model="dataForm.hookRecord" type="textarea" :autosize="{ minRows: 2, maxRows: 4}" clearable placeholder="检查记录" maxlength="500" show-word-limit></el-input>
                      </el-form-item>
                    </template>
                    <template v-else>
                      {{dataForm.hookRecord}}
                    </template>
                  </td>
                </tr>
              </table>
            </el-form>
          </div>
        </div>
        <!-- <div class="footer" v-show="!dataListLoading">
          <span v-if="this.preview!=='2'">
            <el-button type="primary" @click="finish()" :disabled="isDisabled">完成</el-button>
          </span>
          <span>
            <el-button @click="close()">{{btnName}}</el-button>
          </span>
        </div> -->
      </el-scrollbar>
      <select-staff v-if="selectStaffVisible" ref="selectStaff" @selectStaffEmit='selectStaffEmit'></select-staff>
      <check-content v-if="CheckContentVisible" ref="checkContent" @selectCheckItem='selectCheckItem'></check-content>
      <!-- <check-input v-if="checkInputVisible" ref="checkInput" @selectcheckInput='selectcheckInput'></check-input> -->
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :disabled="isDisabled" @click="finish()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { checkTableAddOrUpdate, checkTableInfo } from '@/api/process/safeSystemManage'

import selectStaff from './check-table-select-person'
import checkContent from './check-table-select-item'
// import checkInput from './check-table-add-input'

export default {
  components: {
    selectStaff,
    checkContent
    // checkInput
  },
  data () {
    return {
      dataForm: {
        id: '',
        name: '', // 检查表名称
        checkPerson: '', // 检查人
        checkPersonId: '', // 检查人工号
        checkDate: '', // 日期
        aim: '', // 目的
        requirement: '', // 检查要求
        plan: '', // 检查计划，
        hookRecord: '', // 检查记录
        type: '', // 检查表类型
        checkList: [
          //   {
          //   result: '0'
          // }
        ]
      },
      index: '',
      name: '',
      visible: false,
      selectStaffVisible: false,
      CheckContentVisible: false,
      checkInputVisible: false,
      popoverVisible: false,
      dataList: [],
      stateDataList: [],
      promiseDataList: [],
      valueList: [],
      level: '',
      preview: '',
      stateDataList0: '',
      promiseDataList0: '',
      workshop: '',
      postOrTeam: '',
      isDisabled: false,
      dataListLoading: false,
      dataRule: {
        name: [{ required: true, message: ' ', trigger: 'blur' }],
        checkPerson: [{ required: true, message: ' ', trigger: 'blur' }],
        checkDate: [{ required: true, message: ' ', trigger: 'change' }],
        plan: [{ required: true, message: ' ', trigger: 'blur' }],
        aim: [{ required: true, message: ' ', trigger: 'blur' }],
        requirement: [{ required: true, message: ' ', trigger: 'blur' }],
        hookRecord: [{ required: true, message: ' ', trigger: 'blur' }],
        contentRules: {
          itemName: [{ required: true, message: ' ', trigger: 'blur' }],
          method: [{ required: true, message: ' ', trigger: 'blur' }],
          standard: [{ required: true, message: ' ', trigger: 'blur' }],
          result: [{ required: true, message: ' ', trigger: 'blur' }],
          problem: [{ required: true, message: ' ', trigger: 'blur' }]

        }
      }
    }
  },
  created () {
    // this.level = this.$route.query.level || this.level
    // this.preview = this.$route.query.preview || this.preview
    // this.id = this.$route.query.id || this.id
    // this.getDataList()
    // if (this.dataForm.id) {
    //   this.selectInfo(this.dataForm.id)
    // }
  },
  activated () {
  },
  methods: {
    // 初始化
    init (id, preview) {
      this.visible = true
      this.isDisabled = false
      this.dataForm.id = id || ''
      this.preview = preview
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.name = ''
        this.dataForm.checkPerson = ''
        this.dataForm.checkPersonId = ''
        this.dataForm.aim = ''
        this.dataForm.requirement = ''
        this.dataForm.plan = ''
        this.dataForm.requirement = ''
        this.dataForm.type = ''
        this.dataForm.hookRecord = ''
        this.dataForm.checkList = []

        if (this.dataForm.id) {
          this.selectInfo(this.dataForm.id)
        }
        // this.dataList.map((item, index) => {
        //   let arr = item.msg.split('$')
        //   let valList = []
        //   let msg = item.msg
        //   arr.map(item => {
        //     if (item.indexOf('#') !== -1) {
        //       if (item.match(/#(\S*)#/)) {
        //         valList.push(item.match(/#(\S*)#/)[1])
        //       }
        //     }
        //   })
        //   if (this.preview === '1') {
        //     valList.map(item => {
        //       msg = msg.replace('$#' + item + '#$', '  ')
        //     })
        //   } else if (this.preview === '2') {
        //     valList.map(item => {
        //       msg = msg.replace('$#' + item + '#$', '<input class="inputDate"></input>')
        //     })
        //   }
        //   item.msg = msg
        // })
      })
    },
    // 获取数据列表

    // 查询信息
    selectInfo (id) {
      checkTableInfo({ id: id }).then(({ data }) => {
        this.isDisabled = false
        if (data && data.code === 0) {
          this.dataForm = data.data
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => {
        this.isDisabled = false
        console.log(err)
      })
    },
    // 新增检查内容
    addCheckContent (index, name) {
      // console.log(123)
      this.CheckContentVisible = true
      this.popoverVisible = false
      this.$nextTick(() => {
        this.$refs.checkContent.init()
      })
    },
    // 新增检查项
    addCheckItem () {
      this.popoverVisible = false
      console.log(this.popoverVisible)
      this.dataForm.checkList.push({
        id: '',
        checkItemsId: '',
        checkTableId: '',
        method: '',
        itemName: '',
        standard: '',
        problem: '',
        result: '0'
      })
    },

    inputHandle (index, name) {
      console.log(index, name)
      this.index = index
      this.name = name
      this.checkInputVisible = true
      this.$nextTick(() => {
        this.$refs.checkInput.init()
      })
    },
    selectcheckInput (val) {
      // console.log(this.dataForm.checkList[this.index])
      // this.dataForm.checkList[this.index][name] = val
    },
    // 删除了检查项
    deleteItem (index) {
      this.dataForm.checkList.splice(index, 1)
    },
    // 选择人员
    selectStaffShow () {
      this.selectStaffVisible = true
      this.$nextTick(() => {
        this.$refs.selectStaff.init()
      })
    },
    // 人员组件返回值
    selectStaffEmit (val) {
      this.dataForm.checkPerson = val.name
      this.dataForm.checkPersonId = val.gh
      this.selectStaffVisible = false
    },
    // 选择检查内容返回值
    selectCheckItem (val) {
      let list = _.cloneDeep(val)
      list.map(item => {
        this.dataForm.checkList.push({
          id: '',
          checkTableId: '',
          checkItemsId: item.id,
          itemName: item.itemName,
          method: item.method,
          standard: item.standard,
          problem: '',
          result: '0'
        })
      })
    },

    // 填写数据 / 处理数据
    finish () {
      if (this.preview === '1') {
        this.$refs['dataForm'].validate(valid => {
          if (valid) {
            // let dom2 = document.getElementsByClassName('spanDate')
            // for (let i = 0; i < dom2.length; i++) {
            //   dom2[i].innerText = this.valueList[i]
            // }
            // let dom3 = document.getElementsByClassName('stateMsg')
            // for (let i = 0; i < dom3.length; i++) {
            //   this.stateDataList[i].msg = dom3[i].innerHTML
            // }
            // let dom4 = document.getElementsByClassName('promiseMsg')
            // for (let i = 0; i < dom4.length; i++) {
            //   this.promiseDataList[i].msg = dom4[i].innerHTML
            // }
            // this.workshop = this.selectForm.value1
            // this.postOrTeam = this.selectForm.value2
            // this.selectFlag = false
            // let title = document.getElementsByClassName('body-title')[0].innerText
            // let msg = document.getElementsByClassName('body')[0].innerHTML
            checkTableAddOrUpdate(this.dataForm).then(({ data }) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => { }
                })
                this.isDisabled = true
                this.$emit('refreshDataList')
                this.visible = false
              } else {
                this.$message.error(data.msg)
              }
            }).catch((err) => {
              console.log(err)
              this.$message.error('未知异常！请联系管理员')
            })
          } else {
            this.$message.error('请将表单填写完整')
          }
        })
      } else {
        this.visible = false
      }
    },
    close () {
      // if (this.preview === '1') {
      //   this.$router.push({ path: '/sou/productionSafety/production-safety' })
      // } else if (this.preview === '2' || this.preview === '3') {
      //   this.$router.push({ path: '/process/riskManage/safety-risk-assessment-list' })
      // }
      // this.level = ''
      // this.preview = ''
      // this.id = ''
      this.$router.push({ path: '/process/safeSystemManage/check-table-list' })
    }
  }
}
</script>

<style lang="scss">
.check-table-add-dialog {
  .check-table-add {
    height: 100%;
    background-color: #fbfbfb;
    .detailed-bg {
      position: relative;
      width: 60%;
      min-width: 800px;
      min-height: 80%;
      // padding: 80px;
      margin: 0 auto;
      background-color: #ffffff;
      box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
      font-size: 12px;
      // font-family: PingFang SC;
      // .header {
      //   text-align: center;
      // }
      .body {
        width: 100%;
        table {
          position: relative;
          border-collapse: collapse;
          margin-bottom: 10px;
          border: 1px solid #dcdfe6;
          tr {
            td {
              // position: relative;
              width: 14.3%;
              padding: 4px 5px;
              border: 1px dashed #dcdfe6;
              line-height: 34px;
              .el-input {
                height: 32px;
                line-height: 32px;
              }
              .el-input__inner {
                height: 32px;
                line-height: 32px;
              }
              .item {
                &:before {
                  content: '*';
                  color: #e63031;
                  margin-right: 4px;
                }
              }
              .el-form-item {
                margin-bottom: 0;
              }
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
              .el-radio {
                margin-right: 4px;
              }
              .el-radio__label {
                padding-left: 3px;
              }
              .checkPerson.el-input {
                width: 250px;
              }
              .el-date-editor {
                input {
                  padding-left: 30px;
                }
                input.el-input__inner {
                  width: 309px;
                }
              }
              .el-input--medium .el-input__icon {
                line-height: 30px;
              }
              textarea {
                min-height: 33px;
                height: 33px;
              }
              input,
              .el-textarea__inner {
                // width: 200px;
                // padding-left: 5px;
                padding: 5px;
                font-size: 12px;
                // border: none;
                // border-bottom: 1px solid #383b45;
                // outline: none;
                // background-color: rgba(0, 248, 122, 0.41);
                // &:focus {
                //   border-bottom: 1px solid #42b983;
                // }
              }
              .el-input--suffix .el-input__inner {
                padding-right: 30px;
              }
              .el-form-item__content,
              .el-radio__label {
                font-size: 12px;
              }
              .el-textarea .el-input__count {
                bottom: -2px;
                background-color: transparent;
              }
              .addItem {
                position: absolute;
                left: 9px;
                top: 8px;
                font-size: 18px;
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
            td:nth-of-type(1) {
              width: 9%;
              padding-right: 0;
            }
            td:nth-of-type(7) {
              width: 6%;
            }
            td.check-time {
              width: 10%;
            }
            td.sort {
              padding-left: 0;
            }
            .bg-style {
              background-color: #eef0f7;
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
      // .horn {
      //   position: absolute;
      //   width: 30px;
      //   height: 30px;
      // }
      // .top-l {
      //   top: 20px;
      //   left: 20px;
      //   border-right: 1px solid #cccccc;
      //   border-bottom: 1px solid #cccccc;
      // }
      // .top-r {
      //   top: 20px;
      //   right: 20px;
      //   border-left: 1px solid #cccccc;
      //   border-bottom: 1px solid #cccccc;
      // }
      // .bottom-l {
      //   bottom: 20px;
      //   left: 20px;
      //   border-right: 1px solid #cccccc;
      //   border-top: 1px solid #cccccc;
      // }
      // .bottom-r {
      //   bottom: 20px;
      //   right: 20px;
      //   border-left: 1px solid #cccccc;
      //   border-top: 1px solid #cccccc;
      // }
    }
    // .footer {
    //   text-align: center;
    //   margin-top: 10px;
    //   margin-bottom: 50px;
    // }
  }
  .el-form {
    padding-right: 0;
  }
  .el-dialog__body {
    padding-top: 15px;
  }
}
</style>
