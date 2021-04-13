<!--区域热度统计-->
<template>
  <div class="zoneStatics mod-config">
    <!--搜索条件-->
    <el-form :inline="true" ref="dataForm" :model="dataForm" class="el-form-margin-bottom" @keyup.enter.native="getDataList()">

      <el-form-item label="上级区域" prop="parentId">
        <el-popover v-model="popoverVisible" ref="departPopover" placement="bottom-start" trigger="click" popper-class="high">
          <el-tree :data="zoneList" :props="defaultProps" node-key="id" ref="departListTree" :default-expanded-keys="[]" @current-change="departListTreeCurrentChangeHandle" default-expand-all :highlight-current="true" :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.zoneName" v-popover:departPopover :readonly="true" size="mini" class="size-mini-pople-input menu-list__input" placeholder="请选择所属区域" clearable></el-input>
      </el-form-item>

      <el-form-item label="日期范围" prop="dataRange">
        <el-date-picker v-model="dataForm.dataRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" clearable>
        </el-date-picker>
      </el-form-item>

      <!-- 操作按钮 -->
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" v-waves>
          <i class="el-icon-search"></i>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="
                   resetForm('dataForm')" v-waves>重置</el-button>
      </el-form-item>

    </el-form>

    <!--table显示的主体-->
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="index" label="排行" width="62" align="center">
        <template slot-scope="scope">
          <span v-if="scope.$index+1===1" class="hot1"></span>
          <span v-if="scope.$index+1===2" class="hot2"></span>
          <span v-if="scope.$index+1===3" class="hot3"></span>
          <span v-if="[0,1,2].indexOf(scope.$index)==-1" class="general">{{scope.$index+1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="code" :show-overflow-tooltip="true" label="区域编号" align="center">
        <template slot-scope="scope">
          {{scope.row.code===null?'-':scope.row.code}}
        </template>
      </el-table-column>
      <el-table-column prop="zoneName" label="区域名称">
      </el-table-column>
      <el-table-column prop="riskLevel" :show-overflow-tooltip="true" label="风险等级">
        <template slot-scope="scope">
          {{scope.row.riskLevel | formatType(typeList)}}
          <i v-if="scope.row.riskLevel==='0'" class="el-icon-warning"></i>
          <i v-if="scope.row.riskLevel==='1'" class="el-icon-warning orange"></i>
          <span v-if="scope.row.riskLevel===null">-</span>
        </template>
      </el-table-column>
      <el-table-column prop="sourType" :show-overflow-tooltip="true" label="区域类型">
        <template slot-scope="scope">
          <span v-if="scope.row.sourType===null">-</span>
          <el-tag v-if="scope.row.sourType === '0'" type="success">
            {{scope.row.sourType | formatType(sourList)}}
          </el-tag>
          <el-tag v-else-if="scope.row.sourType === '1'" class="shenlv" type="success"> {{scope.row.sourType | formatType(sourList)}}</el-tag>
          <el-tag v-else-if="scope.row.sourType === '2'" type="danger"> {{scope.row.sourType | formatType(sourList)}}</el-tag>
          <el-tag v-else-if="scope.row.sourType === '3'" type="warning"> {{scope.row.sourType | formatType(sourList)}}</el-tag>
          <el-tag v-else-if="scope.row.sourType!==null" type="info"> {{scope.row.sourType | formatType(sourList)}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="zoneLevel" label="区域等级">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.zoneLevel==='1'" type="danger">一级</el-tag>
          <el-tag v-if="scope.row.zoneLevel==='2'" type="success">二级</el-tag>
          <el-tag v-if="scope.row.zoneLevel==='3'" type="primary">三级</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="zoneNum" label="进入人次" align="center" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          {{scope.row.zoneNum===null?'0':parseInt(scope.row.zoneNum)}}
        </template>
      </el-table-column>
      <el-table-column label="操作" :show-overflow-tooltip="true">
        <template slot-scope="scope">
          <el-button type="text" @click="detailShow(scope.row)">详情</el-button>
        </template></el-table-column>
    </el-table>

    <!-- 查询详情的form页面 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>

  </div>
</template>
<script>
import { getZonePersonList, queryZoneInfo } from '@/api/pos/region'
import waves from '@/utils/waves'
import { getLabels } from '@/api/common/sys'
import addOrUpdate from './zone-statics-add-or-update'
export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        parentId: '',
        zoneName: '',
        startTime: '',
        endTime: '',
        dataRange: []
      },
      defaultProps: {
        label: 'zoneName',
        children: 'subregion'
      },
      typeList: [], // 风险等级列表
      sourList: [], // 区域类型列表
      dataList: [],
      zoneList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      popoverVisible: false,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {
    addOrUpdate
  },
  // 初始化方法
  created () {
    this.getDate()  // 初始化时间
    this.getAllZoneList() // 获得上级区域下拉框的值
    this.getBaseData()  // 获取字典数据
  },
  // 声明所有的方法
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
    },
    // 获得上级区域下拉框的值，并在加载结束后初始化table的list
    getAllZoneList () {
      this.dataListLoading = true
      queryZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          // console.log(data)
          this.zoneList = [data.data] || []
          this.dataForm.parentId = this.zoneList[0].id
          this.dataForm.zoneName = this.zoneList[0].zoneName
          this.getDataList()
        } else {
          this.zoneList = []
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
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      getZonePersonList({
        'parentId': this.dataForm.parentId,
        'endTime': this.dataForm.dataRange[1] ? new Date(this.dataForm.dataRange[1]).Format('yyyy-MM-dd') : '',
        'startTime': this.dataForm.dataRange[0] ? new Date(this.dataForm.dataRange[0]).Format('yyyy-MM-dd') : ''
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.list
          // this.totalPage = data.page.count
          // console.log(data)
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
    // 菜单树选中
    departListTreeCurrentChangeHandle (data, node) {
      // 当前节点的数据，对象
      this.dataForm.parentId = data.id
      this.dataForm.zoneName = data.zoneName
      this.popoverVisible = false
    },
    detailShow (data) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(data, this.dataForm.dataRange)
      })
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
      this.getDate()  // 初始化时间
      this.getAllZoneList() // 获得上级区域下拉框的值
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
.zoneStatics {
  .popoverStyle {
    background: #fff !important;
  }
  .popoverStyle[x-placement^='top'] .popper__arrow::after {
    border-top-color: #151414;
  }
  .popoverStyle[x-placement^='bottom'] .popper__arrow::after {
    border-bottom-color: #151414;
  }
  .alermTable {
    td {
      border-bottom: 1px solid transparent;
    }
    .el-table__body tr:hover > td {
      background-color: #ccc !important;
    }
  }
  .hot1 {
    background: url(~@/assets/img/hot/hot_one.png) no-repeat center;
  }
  .hot2 {
    background: url(~@/assets/img/hot/hot_tow.png) no-repeat center;
  }
  .hot3 {
    background: url(~@/assets/img/hot/hot_three.png) no-repeat center;
  }
  .general {
    background-color: #8eb9f5;
  }
  .hot1,
  .hot2,
  .hot3,
  .general {
    display: block;
    width: 23px;
    height: 23px;
    margin: auto;
    color: #fff;
    line-height: 23px;
    text-align: center;
    background-size: auto 100%;
  }

  .el-icon-warning {
    color: red;
  }
  .orange {
    color: orange !important;
  }
  .el-range-editor--medium .el-range-separator {
    font-size: 12px;
  }
}
</style>
<style lang="scss" scoped>
.zoneStatics {
  .alermicon {
    padding-left: 10px;
    color: red;
  }
  /deep/ .el-range-editor--medium.el-input__inner {
    height: 28px;
    font-size: 12px;
  }
  /deep/ .el-date-editor .el-range-separator {
    padding: 0px 0px;
  }

  /deep/ .el-range-editor.el-input__inner {
    padding: 0px 10px;
  }
}
</style>
