<!--
 * @Descripttion: 高危工艺监测-查看
 * @version: 
 * @Author: Mr.What
 * @Date: 2019-11-20 10:02:56
 * @LastEditors: Mr.What
 * @LastEditTime: 2019-11-20 11:51:05
 -->
<template>
  <el-dialog title="高危工艺监测"
             class="process-monitor-view-container"
             :close-on-click-modal="false"
             append-to-body
             width="800px"
             :visible="true"
             @close="dialogCloseHandle">
    <!--反应装置信息-->
    <el-divider>反应装置基本信息</el-divider>
    <el-form :model="reactor"
             ref="dataForm"
             label-width="110px">
      <el-form-item label="装置编号"
                    prop="name">
        <el-input v-model="reactor.code"
                  disabled
                  size="mini"></el-input>
      </el-form-item>
      <el-form-item label="装置名称"
                    prop="name">
        <el-input v-model="reactor.name"
                  disabled
                  size="mini"></el-input>
      </el-form-item>
      <el-form-item label="设计高危工艺"
                    prop="name">
        <el-input v-model="reactor.technology"
                  disabled
                  size="mini"></el-input>
      </el-form-item>
      <el-form-item label="所属区域"
                    prop="name">
        <el-input v-model="reactor.zoneName"
                  disabled
                  size="mini"></el-input>
      </el-form-item>
    </el-form>
    <!--正在执行的工艺信息-->
    <el-divider>正在执行的工艺信息</el-divider>
    <el-form :model="process"
             ref="dataForm"
             label-width="110px">
      <el-form-item label="工艺编号"
                    prop="name">
        <el-input v-model="process.basicInfo.code"
                  disabled
                  size="mini"></el-input>
      </el-form-item>
      <el-form-item label="工艺名称"
                    prop="name">
        <el-input v-model="process.basicInfo.name"
                  disabled
                  size="mini"></el-input>
      </el-form-item>
    </el-form>
    <!--table-->
    <el-scrollbar style="width:100%;">
      <div class="cards">
        <el-card class="animated fadeIn"
                 v-for="(param, index) in paramList"
                 :key="index">
          <div slot="header"
               class="clearfix">
            <el-input v-model="param.name"
                      placeholder="监控参数名"></el-input>
          </div>
          <el-form :model="param"
                   label-width="70px">
            <el-form-item label="计量单位">
              <el-input v-model="param.unit"></el-input>
            </el-form-item>
            <el-form-item label="传感器标识">
              <el-input v-model="param.sensorId"></el-input>
            </el-form-item>
            <el-form-item label="高限阈值">
              <el-input v-model="param.highLimit"></el-input>
            </el-form-item>
            <el-form-item label="高高限阈值">
              <el-input v-model="param.highHighLimit"></el-input>
            </el-form-item>
            <el-form-item label="低限阈值">
              <el-input v-model="param.lowerLimit"></el-input>
            </el-form-item>
            <el-form-item label="低低限阈值">
              <el-input v-model="param.lowerLowerLimit"></el-input>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </el-scrollbar>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="$emit('input', false)">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getParamByReactor } from '@/api/sou/highRisk'
export default {
  props: {
    value: {
      type: Boolean
    }
  },
  data () {
    return {
      // 围栏或区域
      tableList: [],
      dataListLoading: false,
      reactor: {},
      process: {},
      paramList: []
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
  },
  watch: {
    value (val, oldVal) {
      this.visible = val
    }
  },
  methods: {
    // 获取反应装置工艺列表
    getqueryList (id) {
      this.dataListLoading = true
      this.tableList = []
      getParamByReactor({
        reactorId: id
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.paramList = data.data.paramList
          this.process = data.data.process
          this.reactor = data.data.reactor
          console.log(this.tableList)
          this.dataListLoading = false
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    dialogCloseHandle () {
      this.$emit('input', false)
    }
  }
}
</script>
<style lang="scss">
.process-monitor-view-container {
  .el-table th div {
    line-height: normal;
  }
  .el-dialog__body {
    padding: 15px 20px;
  }

  .cards {
    display: inline-flex;
    padding: 5px 2px;
    .el-card + .el-card {
      margin-left: 10px;
    }
    .el-card {
      width: 250px;
      float: left;
      &.is-always-shadow {
        border: 1px solid #ebeef5;
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      }
      .el-card__header {
        padding: 5px 0 5px 10px;
        .el-input {
          width: 40%;
          .el-input__inner {
            border: 1px solid #d9ecff;
            background-color: #ecf5ff;
            color: #409eff;
          }
        }
      }
      .el-card__body {
        padding: 10px;
      }
    }
  }
}
</style>
