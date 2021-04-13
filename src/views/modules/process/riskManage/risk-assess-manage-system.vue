<!-- 风险评价管理制度页面 -->
<template>
  <div class="risk-assess-manage-system-container">
    <div class="clearfix">
      <div class="system-left">
        <div class="system-img">
          <img src="~@/assets/img/systembg.png" alt="" class="img1">
          <div class="title">
            <img src="~@/assets/img/book.png" alt="" class="img2">
            <p>风险评价管理制度</p>
          </div>
        </div>
        <div class="system-list">
          <ul class="system-item">
            <li v-for="(item,index) in systemList" :key="item.value" @click="handleDetail(item,index)" :class="{checked:currentIndex===index}">
              {{item.label}}
            </li>
          </ul>
        </div>
      </div>
      <div class="system-right">
        <div class="general-rules">
          <span class="zong">
            总则
          </span>
          <p>
            为实现公司的安全生产，实现管理关口前移、重心下移，做到事前预防，达到消除减少危害、控制预防的目的，规范企业风险评价管理工作，
            建立健全风险管理机制，有效辨识企业在生产、管理、服务、活动过程中存在潜在的危险、有害因素，并进行分析评价，评定其危害程度和影响范围，合理划分风险等级，
            确定优先控制顺序，为安全生产决策提供可靠依据，根据《危险化学品从业单位安全标准化通用规范》AQ3013-2008，结合公司实际，制定本制度。
          </p>
          <p>
            明确风险评价的目的、范围、频次、准则及工作程序，明确各部门及有关人员在开展风险评价过程中的职责和任务
          </p>
          <p>
            本制度主要从风险管理的范围与评价方法、风险评价、风险控制、隐患治理和风险信息更新等环节进行规定
          </p>
        </div>
        <div class="system-detail">
          <div class="item-one" v-if="itemNum==='1'">
            <span class="title-one">
              一、引用和支持性文件
            </span>
            <el-scrollbar style="height:calc(100vh - 12px - 140px - 74px - 36px)">
              <p>
                <span>
                  <span>
                    （1）《中华人民共和国安全生产法》主席令第70号(2002年11月1日实施)
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （2）《危险化学品安全管理条例》国务院令第591号(2011.12.1实施)
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （3）《危险化学品从业单位安全标准化通用规范》AQ3013-2008
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （4）《生产过程危险和有害因素分类与代码》GB/T13861-2009
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （5）《生产过程安全卫生要求总则》GB/T12801-2008
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （6）《生产设备安全卫生设计总则》GB5083-1999
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （7）《企业职工伤亡事故分类标准》GB6441-89
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （8）《职业性接触毒物危害程度分级》GBZ230-2010
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （9）《工作场所有害因素职业接触限值 第1部分 化学有害因素》GBZ 2.1-2007
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （10）《工作场所有害因素职业接触限值 第2部分 物理因素》GBZ2.2-2007
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （11）《有毒作业分级》GB12331-1990
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （12）《噪声作业分级》LD80-1995
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （13）《高处作业分级》GB/T3608-2008
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （14）《危险化学品重大危险源辨识》GBl8218-2009
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （15）《职业安全卫生术语》GB/T15236-2008
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （16）《安全标志及其使用导则》GB2894-2008
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （17）《安全色》GB2893-2008
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （18）《危险化学品重大危险源辨识》 GB 18218-2009
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （19）《常用危险化学品的分类及及标志》GB13690-1992
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （20）《化学品安全标签编写规定》GB15258-2009
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （21）《化学品安全技术说明书编写规定》GB16483-2000
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
              <p>
                <span>
                  <span>
                    （22） 其他相关规范、标准等
                  </span>
                  <span class="down">
                    <icon-svg name="download"></icon-svg>下载
                  </span>
                </span>
              </p>
            </el-scrollbar>
          </div>
          <div class="item-two" v-if="itemNum==='2'">
            <div class="purpose">
              <span>
                二、风险评价的目的、范围与准则
              </span>
              <br>
              <span class="purpose-title">
                目的
              </span>
              <p>
                识别生产中的所有常规和非常规活动存在的危害，以及所有生产现场使用设备设施和作业环境中存在的危害，
                采用科学合理的评价方法进行评价。加强管理和个体防护等措施，遏止事故，避免人身伤害、死亡、职业病、
                财产损失和工作环境破坏
              </p>
            </div>
            <div class="range">
              <span>
                范围
              </span>
              <p>（1）规划、设计和建设、投产、运行等阶段；</p>
              <p>（2）常规和非常规活动；</p>
              <p>（3）事故及潜在的紧急情况；</p>
              <p>（4）所有进入作业场所人员的活动；</p>
              <p>（5）原材料、产品的运输和使用过程；</p>
              <p>（6）作业场所的设施、设备、车辆、安全防护用品；</p>
              <p>（7）人为因素，包括违反操作规程和安全生产规章制度；</p>
              <p>（8）丢弃、废弃、拆除与处置；</p>
              <p>（9）企业周围环境；</p>
              <p>（10）气候、地震及其他自然灾害。</p>
            </div>
          </div>
          <div class="item-three" v-if="itemNum==='3'">
            <span class="three-title">
              三、各部门的职责和任务
            </span>
            <div style="height:calc(100vh - 12px - 140px - 74px - 36px)">
              <el-scrollbar style="height:100%">
                <el-table :data="assessmentList" row-key="id" border default-expand-all ref="multipleTable" v-loading="dataListLoading" highlight-current-row @cell-click="cellClick" :tree-props="{children:'subregion'}" style="width:100%">
                  <el-table-column prop="zoneName" min-width="180" label="区域名称">
                    <template slot-scope="scope">
                      <div class="area clearfix">
                        <span>
                          {{scope.row.zoneName}}
                        </span>
                        <span v-if="scope.row.level===1 || scope.row.level===2" class="opertion">
                          <span @click="settingHandle(scope.row.id,scope.row.assessmentInstitutionId,scope.row.level,scope.row.subregion)" style="margin-right:10px">
                            <el-tooltip class="item" effect="dark" content="批量配置" placement="top" :visible-arrow="false">
                              <icon-svg name="bulkOperation" class="setting"></icon-svg>
                            </el-tooltip>
                          </span>
                          <!-- 控制删除按钮是否显示 -->
                          <span v-if="scope.row.subregion[0].deptIdControlOneName ||scope.row.subregion[0].deptIdControlTwoName ||scope.row.subregion[0].deptIdControlThreeName
                          ||scope.row.subregion[0].deptIdControlFourName||scope.row.subregion[0].deptIdAssessName" @click="handleDelete(scope.row.subregion)">
                            <el-tooltip class="item" effect="dark" content="批量删除配置" placement="top" :visible-arrow="false">
                              <icon-svg name="shanchu" class="setting"></icon-svg>
                            </el-tooltip>
                          </span>
                        </span>

                        <span v-if="scope.row.level===3" @click="settingHandle(scope.row.id,scope.row.assessmentInstitutionId,null,null,scope.row.code)" class="item-operation">
                          <el-tooltip class="item" effect="dark" content="配置" placement="top" :visible-arrow="false">
                            <icon-svg name="paramsSetting" class="setting"></icon-svg>
                          </el-tooltip>
                        </span>
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column label="管控部门" align="center">
                    <el-table-column prop="deptIdControlOneName" min-width="150" label="一级(公司级)" align="center">
                    </el-table-column>
                    <el-table-column prop="deptIdControlTwoName" min-width="150" label="二级(事业部级)" align="center">
                    </el-table-column>
                    <el-table-column prop="deptIdControlThreeName" min-width="150" label="三级(部门级)" align="center">
                    </el-table-column>
                    <el-table-column prop="deptIdControlFourName" min-width="150" label="四级(班组、岗位级)" align="center">
                    </el-table-column>
                  </el-table-column>
                  <el-table-column prop="deptIdAssessName" min-width="150" label="风评部门">
                  </el-table-column>
                  <el-table-column prop="riskLevel" label="风险等级(当前)" width="150px">
                    <template slot-scope="scope">
                      <template v-if="scope.row.id !== '0'">
                        <el-tag v-if="scope.row.riskLevel === '0'" size="mini" class="redStyle">{{scope.row.riskLevel | riskMatch(riskList)}}</el-tag>
                        <el-tag v-else-if="scope.row.riskLevel === '1'" size="mini" class="orangeStyle">{{scope.row.riskLevel | riskMatch(riskList)}}</el-tag>
                        <el-tag v-else-if="scope.row.riskLevel === '2'" size="mini" class="yellowStyle">{{scope.row.riskLevel | riskMatch(riskList)}}</el-tag>
                        <el-tag v-else-if="scope.row.riskLevel === '3'" size="mini" class="blueStyle">{{scope.row.riskLevel | riskMatch(riskList)}}</el-tag>
                        <span v-else>-</span>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
              </el-scrollbar>
            </div>
            <risk-assess ref="riskAssess" v-if="riskAsessVisible" @refreshDataList="getAssessmentList"></risk-assess>
          </div>
          <div class="item-four" v-if="itemNum==='4'">
            <span class="four-title">
              四、风险评价
            </span>
            <p> 1、各单位应依据企业风险评价准则，选定合适的评价方法，定期和及时对作业活动和设备设施进行危险、有害因素识别和风险评价。在进行风险评价时，应从影响人、财产和环境等三个方面的可能性和严重程度分析。编制《风险评价报告》，并做好《风险评价记录》。</p>
            <p>2、风险评价小组对危险与有害因素进行判定后，对于LEC法危险性程度分值大于70、JHA法危险性程度分值大于15的危险与有害因素填写《重大风险清单》，发放到各相关部门，进行限期整改。</p>
            <p>3、各级管理人员应参与风险评价工作，鼓励从业人员积极参与风险评价和风险控制。</p>
          </div>
          <div class="item-four" v-if="itemNum==='5'">
            <span class="four-title">
              五、风险控制
            </span>
            <p>
              1、各单位应根据风险评价结果及经营运行情况等，确定不可接受的风险，按规定程序审批，制定并落实控制措施，将风险尤其是重大及以上风险控制在可以接受的程度。在选择风险控制措施时：
            </p>
            <p>
              （1）考虑：⑴可行性；⑵安全性；⑶可靠性；
            </p>
            <p>
              （2）包括：⑴工程技术措施；⑵管理措施；⑶培训教育措施；⑷个体防护措施。
            </p>
            <p>
              2、各单位应将风险评价的结果及所采取的控制措施对从业人员进行宣传、培训，使其熟悉工作岗位和作业环境中存在的危险、有害因素，掌握、落实应采取的控制措施。
            </p>
          </div>
          <div class="item-four" v-if="itemNum==='6'">
            <span class="four-title">
              六、隐患治理
            </span>
            <p>
              1、 针对风险评价组织评价出的隐患项目，下达隐患治理通知,限期治理，做到定治理措施、定负责人、定资金来源、定治理期限，应建立隐患治理台帐。
            </p>
            <p>
              2、 企业对确定的重大隐患项目建立档案，档案内容包括：1）评价报告与技术结论；2）评审意见；3）隐患治理方案，包括资金概预算情况等；4）治理时间表和责任人；5）验收报告。
            </p>
            <p>
              3、企业无力解决的重大事故隐患，除采取有效防范措施外，应书面向企业直接主管部门和当地政府报告。
            </p>
            <p>
              4、企业对不具备整改条件的重大事故隐患，必须采取防范措施，并纳入计划，限期解决或停产。
            </p>
          </div>
          <div class="item-four" v-if="itemNum==='7'">
            <span class="four-title">
              七、风险信息更新
            </span>
            <p> 1、 企业应适时组织风险评价工作，识别与生产经营活动有关的危险、有害因素和隐患。</p>
            <p> 2、 企业应每年至少一次评审或检查风险评价结果和风险控制效果。</p>
            <p>3、企业应在下列情形发生时及时进行风险评价：</p>
            <p> （1）新的或变更的法律法规或其他要求；</p>
            <p> （2）操作条件变化或工艺改变；</p>
            <p> （3）技术改造项目；</p>
            <p> （4）有对事件、事故或其他信息的新认识；</p>
            <p> （5）组织机构发生大的调整。</p>
            <!-- <p>4、风险评价程序图</p>
            <p>
              <img src="~@/assets/img/riskInfoUpdate.png" alt="" class="updateImg">
            </p> -->
          </div>
          <div class="item-four" v-if="itemNum==='8'">
            <span class="four-title">
              八、附则
            </span>
            <p> 1、本制度从下发之日起执行。</p>
            <p> 2、本制度由安全标准化领导小组负责解释，如有争议时由公司安全生产管理委员会仲裁。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAssessmentList, institutionDelete } from '@/api/risk/inventory'
import riskAssess from './risk-assess-add-or-update'
import { getLabels } from '@/api/common/sys.js'
export default {
  components: {
    riskAssess
  },
  data () {
    return {
      itemNum: '1',
      assessmentList: [], // 评价制度列表
      riskAsessVisible: false,
      currentIndex: 0, // 当前索引
      riskList: [], // 风险等级列表
      systemList: [{
        value: '1',
        label: '一、引用和支持性文件'
      }, {
        value: '2',
        label: '二、风险评价目的、范围与准则'
      }, {
        value: '3',
        label: '三、部门的职责和任务'
      }, {
        value: '4',
        label: '四、风险评价'
      }, {
        value: '5',
        label: '五、风险控制'
      }, {
        value: '6',
        label: '六、隐患治理'
      }, {
        value: '7',
        label: '七、风险信息更新'
      }, {
        value: '8',
        label: '八、附则'
      }]
    }
  },
  created () {
    this.getAssessmentList()
    this.initGetLabelRisk()
  },
  methods: {
    // 点击左侧的准则目录
    handleDetail (data, index) {
      this.itemNum = data.value
      this.currentIndex = index
    },
    // 获取部门列表
    getAssessmentList (obj) {
      this.dataListLoading = true
      getAssessmentList().then(({ data }) => {
        if (data && data.code === 0) {
          this.assessmentList = [data.data] || []
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
    // 在字典表里查询事故发生的可能性
    initGetLabelRisk () {
      getLabels({
        type: 'risk_level'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.riskList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 设置表单
    settingHandle (zoneId, id, level, subregion, zoneCode) {
      this.riskAsessVisible = true
      this.$nextTick(() => {
        this.$refs.riskAssess.init(zoneId, id, level, subregion, zoneCode)
      })
    },
    // 批量删除
    handleDelete (subregion) {
      let ids = subregion.map(item => {
        return item.assessmentInstitutionId
      })
      this.$confirm(`确定进行批量操作`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          institutionDelete(ids)
            .then(({ data }) => {
              if (data && data.code === 0) {
                this.getAssessmentList()
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => { }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
            .catch(err => {
              console.log(err)
              this.$message.error('未知异常！请联系管理员')
            })
        })
        .catch(() => { })
    }
  },
  filters: {
    riskMatch (val, map) {
      let riskName = ''
      map.map(value => {
        if (val === value.label) {
          riskName = value.value
        }
      })
      return riskName
    }
  }
}
</script>
<style lang="scss">
.risk-assess-manage-system-container {
  .el-table__header-wrapper {
    thead {
      tr {
        th {
          padding: 3px 0;
          background: linear-gradient(
            0deg,
            rgba(206, 209, 214, 1),
            rgba(228, 231, 234, 1)
          );
        }
      }
    }
  }
  .system-left {
    float: left;
    width: 270px;
    border: 1px solid #dcdfe6;
    .system-img {
      position: relative;
      width: 100%;
      height: 140px;
      // background-color: #4082bc;
      .img1 {
        position: absolute;
        width: 270px;
        height: 140px;
        top: -1px;
        left: -1px;
      }
      .title {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 20px;
      }
    }
    .system-list {
      width: 100%;
      height: calc(100vh - 12px - 140px - 74px);
      padding-top: 12px;
      .system-item {
        list-style: none;
        padding: 0;
        margin: 0;
        li {
          height: 28px;
          line-height: 28px;
          padding-left: 20px;
          font-size: 12px;
          font-family: PingFang SC;
          color: #222222;
          &:hover {
            cursor: pointer;
            background-color: #e7ebef;
            color: #2c78bb;
          }
        }
        .checked {
          cursor: pointer;
          background-color: #e7ebef;
          color: #2c78bb;
        }
      }
    }
  }
  .system-right {
    float: left;
    width: calc(100% - 12px - 270px - 30px);
    border: 1px solid #dcdfe6;
    border-left: 0;
    .general-rules {
      height: 140px;
      width: 100%;
      padding: 14px 12px;
      border-bottom: 1px solid #dcdfe6;
      .zong {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: bold;
        color: rgba(34, 34, 34, 1);
        line-height: 20px;
      }
      p {
        margin: 5px 0;
        text-indent: 2em;
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(34, 34, 34, 1);
        line-height: 15px;
      }
    }
    .system-detail {
      width: 100%;
      height: calc(100vh - 12px - 140px - 74px);
      padding: 12px 0 12px 12px;
      .item-one {
        .title-one {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: bold;
          color: rgba(34, 34, 34, 1);
          line-height: 22px;
        }
        p {
          font-size: 12px;
          font-family: PingFang-SC;
          color: #222222;
          line-height: 20px;
          max-height: 20px;
          span:first-child {
            &:hover {
              span:first-child {
                cursor: pointer;
                color: #2c78bb;
                text-decoration: underline;
              }
              .down {
                display: inline;
                cursor: pointer;
              }
            }
            .down {
              display: none;
              color: #2c78bb;
              font-size: 12px;
              font-weight: 400;
              margin-left: 10px;
              .icon-svg {
                font-size: 16px;
                vertical-align: middle;
              }
            }
          }
        }
      }
      .item-two {
        .purpose {
          height: 90px;
          border-bottom: 1px dashed #ccc;
          span {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: bold;
            color: rgba(34, 34, 34, 1);
            line-height: 22px;
          }
          .purpose-title {
            font-size: 12px;
          }
          p {
            margin: 0;
            text-indent: 2em;
            font-size: 12px;
            font-family: PingFang-SC;
            color: #222222;
            line-height: 20px;
          }
        }
        .range {
          padding-top: 10px;
          span {
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: bold;
            color: rgba(34, 34, 34, 1);
            line-height: 22px;
          }
          p {
            margin: 0;
            font-size: 12px;
            font-family: PingFang-SC;
            color: #222222;
            line-height: 20px;
          }
        }
      }
      .item-three {
        .three-title {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: bold;
          color: rgba(34, 34, 34, 1);
          line-height: 22px;
        }
        .area {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .opertion {
            position: absolute;
            right: 10px;
            top: 3px;
            width: 36px;
            height: 20px;
            z-index: 99;
            display: flex;
            justify-content: flex-end;
            align-items: center;
          }
          .item-operation {
            width: 20px;
            height: 20px;
            position: absolute;
            right: 10px;
            top: 3px;
            z-index: 9;
          }
          .icon-svg {
            display: none;
            font-size: 16px;
            // margin-right: 15px;
          }
        }
        .redStyle {
          padding: 0px 5px;
          color: #fff;
          background-color: red;
        }
        .orangeStyle {
          padding: 0px 5px;
          color: #fff;
          background-color: orange;
        }
        .yellowStyle {
          padding: 0px 5px;
          color: gray;
          background-color: yellow;
          border-color: #d5e4f1;
        }
        .blueStyle {
          padding: 0px 5px;
          color: #fff;
          background-color: blue;
        }
        .el-table--border td:first-child .cell {
          display: flex;
          position: relative;
          &:hover {
            color: #2c78bb;
            .icon-svg {
              display: block;
            }
          }
        }
      }
      .item-four {
        .four-title {
          font-size: 14px;
          font-family: PingFang SC;
          font-weight: bold;
          color: rgba(34, 34, 34, 1);
          line-height: 22px;
        }
        p {
          margin: 0;
          padding: 0 10px;
          font-size: 12px;
          font-family: PingFang-SC;
          color: #222222;
          line-height: 25px;
          .updateImg {
            display: block;
            height: 300px;
            width: 600px;
          }
        }
      }
    }
  }
  .clearfix:after {
    content: ''; /*设置内容为空*/
    height: 0; /*高度为0*/
    line-height: 0; /*行高为0*/
    display: block; /*将文本转为块级元素*/
    visibility: hidden; /*将元素隐藏*/
    clear: both; /*清除浮动*/
  }
  .clearfix {
    zoom: 1; /*为了兼容IE*/
  }
  ::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 5px;
  }
}
</style>
