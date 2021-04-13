<!--风险管控清单-->
<template>
  <div class="control-list-style mod-config">
    <el-form :inline="true" class="el-form-margin-bottom" ref="dataForm" :model="dataForm">

      <el-form-item label="风险点名称" prop="businessName">
        <el-input v-model="dataForm.businessName" size="mini" clearable placeholder="请输入风险点名称"></el-input>
      </el-form-item>

      <el-form-item label="所属区域" prop="zoneName">
        <el-popover v-model="popoverVisible" popper-class="high" placement="bottom-start" ref="zonePopover" trigger="click">

          <el-tree :data="graphList" :props="defaultProps" node-key="id" ref="zoneTree" @current-change="zoneSelectChange" default-expand-all :highlight-current="true" :expand-on-click-node="false">

          </el-tree>

        </el-popover>
        <el-input v-model="dataForm.zoneName" v-popover:zonePopover size="mini" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" v-waves>
          <i class="el-icon-search"></i>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="
                   resetForm('dataForm')" v-waves>重置</el-button>

      </el-form-item>
    </el-form>
    <el-table :data="dataList" border ref="multipleTable" tooltip-effect="dark" @cell-click="cellClick" v-loading="dataListLoading" class="lecTable" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="index" width="60" label="序号" header-align="center" align="center">

      </el-table-column>
      <el-table-column prop="businessName" width="110" :show-overflow-tooltip="true" label="风险点名称">
      </el-table-column>
      <el-table-column prop="rangeType" min-width="110" :show-overflow-tooltip="true" label="风险点类型">
        <template slot-scope="scope">{{scope.row.rangeType | matchType(rangeTypeList)}}</template>
      </el-table-column>
      <el-table-column prop="zoneName" min-width="120" :show-overflow-tooltip="true" label="所属区域">
      </el-table-column>

      <el-table-column min-width="130" :show-overflow-tooltip="true" label="可能发生的风险类型">
        <template slot-scope="scope">
          <span>{{handle(scope.row.factorList)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="riskDegree" width="100" header-align="center" align="center" :show-overflow-tooltip="true" label="固有风险等级">

        <template slot-scope="scope">
          <el-tag size="small" style="color:#fff" color="#E63031" v-if="scope.row.riskDegree === 'A'">{{scope.row.riskDegree}}</el-tag>
          <el-tag size="small" style="color:#fff" color="#E6A23C" v-if="scope.row.riskDegree === 'B'">{{scope.row.riskDegree}}</el-tag>
          <el-tag size="small" style="color:#fff" color="#E9ED06" v-if="scope.row.riskDegree === 'C'">{{scope.row.riskDegree}}</el-tag>
          <el-tag size="small" style="color:#fff" color="#2C78BB" v-if="scope.row.riskDegree === 'D'">{{scope.row.riskDegree}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="管控措施" header-align="center" width="100" align="center">
        <template slot-scope="scope">
          <el-popover placement="top" width="596" trigger="click" v-if="scope.row.controlStatus === '1'">
            <table cellspacing="0" align="left" border="1" class="table-style">
              <tr>
                <td class="first-cell">
                  工程技术措施
                </td>
                <td class="second-cell">
                  <template v-if="scope.row.gloryMeasures">
                    <el-input type="textarea" v-model="scope.row.gloryMeasures" readonly>
                    </el-input>
                  </template>
                  <template v-else>
                    <el-input type="textarea" v-model="nogloryMeasures" readonly class="noSpecialStyle">
                    </el-input>
                  </template>
                </td>
              </tr>
              <tr>
                <td class="first-cell">管理措施</td>
                <td class="second-cell">
                  <template v-if="scope.row.manageMeasures">
                    <el-input type="textarea" v-model="scope.row.manageMeasures" readonly>

                    </el-input>
                  </template>
                  <template v-else>
                    <el-input type="textarea" v-model="nomanageMeasures" readonly class="noSpecialStyle">
                    </el-input>
                  </template>
                </td>
              </tr>
              <tr>
                <td class="first-cell">培训教育措施</td>
                <td class="second-cell">
                  <template v-if="scope.row.trainMeasures">
                    <el-input type="textarea" v-model="scope.row.trainMeasures" readonly>

                    </el-input>
                  </template>
                  <template v-else>
                    <el-input type="textarea" v-model="notrainMeasures" readonly class="noSpecialStyle">

                    </el-input>
                  </template>
                </td>
              </tr>
              <tr>
                <td class="first-cell">个体防护措施</td>
                <td class="second-cell">
                  <template v-if="scope.row.selfMeasures">
                    <el-input type="textarea" v-model="scope.row.selfMeasures" readonly>

                    </el-input>
                  </template>
                  <template v-else>
                    <el-input type="textarea" v-model="noselfMeasures" readonly class="noSpecialStyle">

                    </el-input>
                  </template>
                </td>
              </tr>
              <tr>
                <td class="first-cell">应急处置措施</td>
                <td class="second-cell">
                  <template v-if="scope.row.emergencyMeasures">
                    <el-input type="textarea" v-model="scope.row.emergencyMeasures" readonly>

                    </el-input>
                  </template>
                  <template v-else>
                    <el-input type="textarea" v-model="noemergencyMeasures" readonly class="noSpecialStyle">

                    </el-input>
                  </template>
                </td>
              </tr>
            </table>
            <el-button slot="reference" type="text">查看管控</el-button>

          </el-popover>
          <span v-else> - </span>
        </template>

      </el-table-column>
      <el-table-column width="100" :show-overflow-tooltip="true" label="管控层级">
        <template slot-scope="scope">
          <span v-if="scope.row.riskDegree === 'A'">公司级</span>
          <span v-if="scope.row.riskDegree === 'B'">事业部级</span>
          <span v-if="scope.row.riskDegree === 'C'">部门级</span>
          <span v-if="scope.row.riskDegree === 'D'">班组,岗位级</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="liableUnit" min-width="100" :show-overflow-tooltip="true" label="责任部门">
        <template slot-scope="scope">
          <span v-if="scope.row.riskDegree === 'A'">
            {{(scope.row.controlOneDept ? scope.row.controlOneDept : '公司级责任部门暂无' )+ ',' + (scope.row.controlTwoDept  ? scope.row.controlTwoDept : '事业级责任部门暂无') + ',' + (scope.row.controlThreeDept  ? scope.row.controlThreeDept : '部门级责任部门暂无') + ',' + '当前班组'}}
          </span>
          <span v-if="scope.row.riskDegree === 'B'">
            {{ (scope.row.controlTwoDept ? scope.row.controlTwoDept : '事业级责任部门暂无') + ',' + (scope.row.controlThreeDept ? scope.row.controlThreeDept : '部门级责任部门暂无') + ',' + '当前班组'}}
          </span>
          <span v-if="scope.row.riskDegree === 'C'">
            {{ (scope.row.controlThreeDept ? scope.row.controlThreeDept : '部门级责任部门暂无') + ',' + '当前班组'}}
          </span>
          <span v-if="scope.row.riskDegree === 'D'">
            当前班组
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="liablePerson" min-width="100" :show-overflow-tooltip="true" label="责任人">
        <template slot-scope="scope">
          <span v-if="scope.row.riskDegree === 'A'">
            {{(scope.row.controlOneEmployeeName !== null ? scope.row.controlOneEmployeeName : '公司级责任人暂无') + ',' + (scope.row.controlTwoEmployeeName !== null  ? scope.row.controlTwoEmployeeName : '事业部级责任人暂无' )+ ',' + (scope.row.controlThreeEmployeeName !== null ? scope.row.controlThreeEmployeeName : '部门级责任人暂无') + ',' +  '当前班组成员'}}
          </span>
          <span v-if="scope.row.riskDegree === 'B'">
            {{(scope.row.controlTwoEmployeeName !== null ? scope.row.controlTwoEmployeeName : '事业部级责任人暂无') + ',' + (scope.row.controlThreeEmployeeName !== null ? scope.row.controlThreeEmployeeName : '部门级责任人暂无') + ',' + '当前班组成员'}}
          </span>
          <span v-if="scope.row.riskDegree === 'C'">
            {{ (scope.row.controlThreeEmployeeName !== null ? scope.row.controlThreeEmployeeName : '部门级责任人暂无' )+ ',' + '当前班组成员'}}
          </span>
          <span v-if="scope.row.riskDegree === 'D'">
            当前班组成员
          </span>
        </template>
      </el-table-column> -->
      <el-table-column prop="controlStatus" width="80" label="管控状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.controlStatus === '1'" type="success"> 已配置</el-tag>
          <el-tag v-else type="danger">未配置</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="addOrUpdateHandle(scope.row)" :disabled="scope.row.controlStatus === '1'">
            配置管控
          </el-button>
        </template>
      </el-table-column>

    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" background layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>

    <!-- 弹窗, 管控操作 -->
    <control-add-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList">
    </control-add-update>
  </div>
</template>
<script>
import { queryZoneInfo } from '@/api/pos/region'

import { facilitiesList } from '@/api/risk/analysis'

import controlAddUpdate from './control-add-update'
import waves from '@/utils/waves'
import { getLabels } from '@/api/common/sys.js'
export default {
  directives: {
    waves
  },
  data () {
    return {
      activeName: 'first',
      riskZoneList: [], // 所有的风险分区
      nogloryMeasures: '暂无措施',
      nomanageMeasures: '暂无措施',
      notrainMeasures: '暂无措施',
      noselfMeasures: '暂无措施',
      noemergencyMeasures: '暂无措施',
      dataForm: {
        businessName: '', // 风险分区，
        zoneCode: '',
        zoneName: ''
      },
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false, // 弹框显示
      pageSize: 10,
      pageIndex: 1,
      totalPage: 0,
      dataListSelections: [], // 多选数据
      rangeTypeList: [],
      graphList: [], // 所属区域
      defaultProps: {
        label: 'zoneName',
        children: 'subregion'
      },
      popoverVisible: false // 菜单树是否可见
    }
  },
  components: {
    controlAddUpdate
  },
  activated () {
    this.getDataList()
  },
  created () {
    this.getAllZoneList()
    this.getRiskPoinType()
  },
  methods: {
    // 当前菜单树选中
    zoneSelectChange (data, node) {
      // 当前节点数据，对象
      this.dataForm.zoneCode = data.id
      this.dataForm.zoneName = data.zoneName
      this.popoverVisible = false
    },
    // 从字典表获取风险点类型
    getRiskPoinType () {
      getLabels({
        type: 'RANGE_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.rangeTypeList = data.list
        }
      })
    },
    // 获取所有的区域
    getAllZoneList () {
      this.dataListLoading = true
      queryZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          this.graphList = [data.data] || []
        } else {
          this.graphList = []
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 处理数据
    handle (val) {
      if (val.length > 0) {
        let factorMainNameList = []
        val.map(item => {
          if (factorMainNameList.indexOf(item.factorMainName) === -1) {
            factorMainNameList.push(item.factorMainName)
          }
        })
        return factorMainNameList.join(',')
      } else {
        return '暂无'
      }
    },
    handleDanger (val) {
      if (val.length > 0) {
        let factorDangerList = []
        val.map(item => {
          if (factorDangerList.indexOf(item.factorDangerList) === -1) {
            factorDangerList.push(item.factorDanger)
          }
        })
        factorDangerList = factorDangerList.map((item, index) => {
          item = (index + 1) + '.' + item
          return item
        })
        return factorDangerList.join(';')
      } else {
        return '暂无'
      }
    },
    // 获取表格内容
    getDataList () {
      this.dataListLoading = true
      facilitiesList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'businessName': this.dataForm.businessName,
        'zoneCode': this.dataForm.zoneCode,
        'evaluateStatus': '1',
        'sortControlName': '1'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataListLoading = false
          this.dataList = data.page.list
          this.totalPage = data.page.count
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (tableInfo, type) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(tableInfo, type)
      })
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
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
      this.getDataList()
    },
    // 多选
    selectionChangeHandle (val) {
      this.dataListSelections = val
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.dataForm.zoneCode = ''
      this.getDataList()
    }
  },
  filters: {
    matchType (type, value) {
      let typeName = ''
      value.map(item => {
        if (item.label === type) {
          typeName = item.value
        }
      })
      return typeName
    }
  }
}
</script>
<style lang="scss">
.table-style {
  border-color: #ccc;
  .first-cell {
    height: 50px;
    width: 96px;
    padding-left: 10px;
    background-color: #eef0f7;
    color: #222;
  }
  .second-cell {
    width: 500px;
  }
  .noSpecialStyle {
    .el-textarea__inner {
      color: #ccc !important;
    }
  }
}
.control-list-style {
  .el-table thead.is-group th {
    background: linear-gradient(0deg, #ced1d6, #e4e7ea);
  }
}
</style>
