<template >
  <div class='saftety-risk mod-config'>
    <!-- 查看研判记录 -->
    <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item width="50" label="公司名称" prop="judgedCompany">
        <el-input v-model.trim="dataForm.judgedCompany" size="mini" clearable placeholder="请输入公司名称"></el-input>
      </el-form-item>
      <el-form-item width="50" label="研判对象类型" prop="judgedObject">
        <el-select v-model="dataForm.judgedObject" placeholder="请选择" class="select">
          <el-option label="公司级" value="0"></el-option>
          <el-option label="车间级" value="1"></el-option>
          <el-option label="班组级" value="2"></el-option>
          <el-option label="岗位级" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList" icon="el-icon-search" v-waves>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" v-waves @click="
                   resetForm('dataForm')">重置</el-button>
        <el-button type="warning" size="mini" icon="el-icon-plus" @click="judgedToday()" v-waves>今日研判</el-button>
        <!--<el-button type="danger"-->
        <!--size="mini"-->
        <!--icon="el-icon-delete"-->
        <!--@click="deleteHandle()"-->
        <!--v-waves-->
        <!--:disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-tabs type="card" v-model="activeName" @tab-click="tabClick" class="tabs">
      <el-tab-pane label="公司级" name="0">
        <company-level ref="company" @refGetList="getList"></company-level>
      </el-tab-pane>
      <el-tab-pane label="车间级" name="1">
        <workshop-level ref="workshop" @refGetList="getList"></workshop-level>
      </el-tab-pane>
      <el-tab-pane label="班组级" name="2">
        <post-level ref="post" @refGetList="getList"></post-level>
      </el-tab-pane>
      <el-tab-pane label="岗位级" name="3">
        <team-level ref="team" @refGetList="getList"></team-level>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import asfetyRiskAssessment from './safety-risk-assessment-detailed' // 弹框  查看研判记录
import companyLevel from './company-level-table2' // 公司级
import workshopLevel from './workshop-level-table2' // 车间级
import postLevel from './post-level-table2' // 岗位级
import teamLevel from './team-level-table2' // 班组级
export default {
  data () {
    return {
      dataForm: {
        judgedCompany: '', // 公司名称
        judgedObject: '' // 研判对象
      },
      typeList: [], // 模板等级
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      activeName: '3',
      preview: false,
      dataList: {} // 列表数据
    }
  },
  created () {
  },
  activated () {
  },
  mounted () { },

  components: {
    asfetyRiskAssessment,
    companyLevel,
    workshopLevel,
    postLevel,
    teamLevel
  },
  methods: {
    // 获取数据列表
    getDataList () {
      if (this.activeName === '0') {
        this.$refs.company.getDataList(this.dataForm.status)
      } else if (this.activeName === '1') {
        this.$refs.workshop.getDataList(this.dataForm.status)
      } else if (this.activeName === '2') {
        this.$refs.post.getDataList(this.dataForm.status)
      } else if (this.activeName === '3') {
        this.$refs.team.getDataList(this.dataForm.status)
      }
    },
    // tab栏切换
    tabClick (e, v) {
      this.activeName = e.name
    },
    // 今日研判
    judgedToday () {
      // this.preview = true
      // this.$nextTick(() => {
      //   this.$refs.previewRecord.getDataList()
      // })
      // this.$ref.previewRecord.init(this.dataList, 0) 查看记录
      this.$router.push({ path: '/process/riskManage/safety-risk-assessment-detailed', query: { level: this.activeName, preview: '2' } })
    },
    judgementRecord () {
      this.preview = false
    },
    getList (data) {
      this.dataList = []
      this.dataList = data
      this.preview = true
      this.$nextTick(() => {
        this.$refs.previewRecord.getDataList(data)
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
.saftety-risk {
  .el-scrollbar__wrap {
    height: 200px;
  }
  /deep/ .select {
    .el-input__suffix {
      top: 5px;
    }
  }
  .tabs {
    height: calc(100% - 50px);
    /deep/ .el-tabs__content {
      height: 100%;
      .el-tab-pane {
        height: 100%;
      }
    }
  }
}
</style>
