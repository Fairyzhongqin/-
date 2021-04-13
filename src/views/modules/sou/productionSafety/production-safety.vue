<template >
  <div class='highrisk-type mod-config'>
    <el-form :inline="true"
             :model="dataForm"
             ref="dataForm"
             @keyup.enter.native="getDataList()">
      <el-form-item width="50"
                    label="报告状态"
                    prop="status">
        <el-select v-model="dataForm.status"  placeholder="请选择报告状态" class="select">
          <el-option label="失效" value="0"></el-option>
          <el-option label="生效" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="getDataList"
                   icon="el-icon-search"
                   v-waves>
          查询</el-button>
        <el-button type="info"
                   size="mini"
                   icon="el-icon-refresh-right"
                   v-waves
                   @click="
                   resetForm('dataForm')">重置</el-button>
        <el-button type="warning"
                   size="mini"
                   icon="el-icon-plus"
                   @click="addOrUpdateHandle()"
                   v-waves>新增报告</el-button>
        <el-button type="danger"
                   size="mini"
                   icon="el-icon-delete"
                   @click="deleteHandle()"
                   v-waves
                   :disabled="dataListSelections.length <= 0">批量删除</el-button>
        <el-button type="primary" size="mini" icon="el-icon-view" @click="preview">预览模板</el-button>
      </el-form-item>
    </el-form>
    <el-tabs type="card" v-model="activeName" @tab-click="tabClick" class="tabs">
      <el-tab-pane label="公司级" name="0">
        <company-level ref="company"></company-level>
      </el-tab-pane>
      <el-tab-pane label="车间级" name="1">
        <workshop-level ref="workshop"></workshop-level>
      </el-tab-pane>
      <el-tab-pane label="班组级" name="2">
        <post-level ref="post"></post-level>
      </el-tab-pane>
      <el-tab-pane label="岗位级" name="3">
        <team-level ref="team" @func="deleteHandleVal"></team-level>
      </el-tab-pane>

    </el-tabs>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList2"></add-or-update>
  </div>
</template>

<script>
  import { reportTemplateDel } from '@/api/sou/productionSafety'
  import addOrUpdate from './production-safety-add-update'
  import companyLevel from './company-level-table' // 公司级
  import workshopLevel from './workshop-level-table' // 车间级
  import postLevel from './post-level-table' // 岗位级
  import teamLevel from './team-level-table' // 班组级
  export default {
    data () {
      return {
        dataForm: {
          status: ''// 报告状态
        },
        dataList: [], // 列表数据
        typeList: [], // 模板等级
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        activeName: '0'
      }
    },
    created () {
    },
    activated () {
    },
    mounted () { },

    components: {
      addOrUpdate,
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
      getDataList2 () {
        this.$refs.company.getDataList(this.dataForm.status)
        this.$refs.workshop.getDataList(this.dataForm.status)
        this.$refs.post.getDataList(this.dataForm.status)
        this.$refs.team.getDataList(this.dataForm.status)
      },
      // tab栏切换
      tabClick (e, v) {
        this.activeName = e.name
      },
      // 预览
      preview () {
        this.$router.push({ path: '/process/riskManage/safety-risk-assessment-detailed', query: {level: this.activeName, preview: '1'} })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      deleteHandleVal (data) {
        this.dataListSelections = data
      },
      // 批量删除
      deleteHandle () {
        let ids = this.dataListSelections.map(item => {
          return item.id
        })
        let nameArr = name
          ? [name]
          : this.dataListSelections.map(item => {
            return item.reportName
          })
        this.$confirm(`确定对[安全生产报告名称为=${nameArr.join(',')}]进行[批量删除]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            reportTemplateDel(ids)
              .then(({ data }) => {
                if (data && data.code === 0) {
                  this.getDataList()
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
      },
      // 重置
      resetForm (formName) {
        this.$refs[formName].resetFields()
        this.getDataList2()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .highrisk-type {
    .el-scrollbar__wrap {
      height: 200px;
    }
    /deep/ .select {
      .el-input {
        .el-select__caret {
          line-height: 0;
        }
      }
    }
    .tabs {
      height: calc( 100% - 50px );
      /deep/ .el-tabs__content {
        height: 100%;
        .el-tab-pane {
          height: 100%;
        }
      }
    }
  }
</style>
