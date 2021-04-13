<template>
  <div class='plb-table-container'>
    <el-table :data="tableData" style="width: 100%" size="mini" :height="height">
      <el-table-column v-for="(th, index) in thData" :prop="th.value" :label="th.name" :show-overflow-tooltip="true" :key="index" :width="th.width" :class-name="th.color" :align="th.align">
      </el-table-column>
      <el-table-column label="操作" :width="48" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="view(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    height: {
      type: Number
    }
  },
  components: {},
  data () {
    return {
      thData: [{
        name: '路线名称', value: 'rName', align: 'left'
      }, {
        name: '巡检区域', value: 'area', align: 'left'
      }, {
        name: '班组', value: 'tm', width: 65, align: 'left'
      }, {
        name: '状态', value: 'status', width: 60, color: 'red', align: 'left'
      }, {
        name: '路线达标率', value: 'lv', width: 80, color: 'red', align: 'center'
      }],
      tableData: [{
        rName: '罐区和车间巡检',
        area: '罐区和车间区域',
        tm: '巡检A班',
        status: '异常42',
        lv: '0%'
      }, {
        rName: '罐区和车间巡检',
        area: '罐区和车间区域',
        tm: '巡检A班',
        status: '异常42',
        lv: '0%'
      }, {
        rName: '罐区和车间巡检',
        area: '罐区和车间区域',
        tm: '巡检A班',
        status: '异常42',
        lv: '0%'
      }, {
        rName: '罐区和车间巡检',
        area: '罐区和车间区域',
        tm: '巡检A班',
        status: '异常42',
        lv: '0%'
      }, {
        rName: '罐区和车间巡检',
        area: '罐区和车间区域',
        tm: '巡检A班',
        status: '异常42',
        lv: '0%'
      }, {
        rName: '罐区和车间巡检',
        area: '罐区和车间区域',
        tm: '巡检A班',
        status: '异常42',
        lv: '0%'
      }, {
        rName: '罐区和车间巡检',
        area: '罐区和车间区域',
        tm: '巡检A班',
        status: '异常42',
        lv: '0%'
      }]
    }
  },
  created () { },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    view (val) {

    }
  }
}
</script>

<style lang='scss' scoped>
.plb-table-container {
  /deep/ .el-table {
    background-color: rgba(255, 255, 255, 0);
    .el-table__header-wrapper {
      tr {
        background: rgba(255, 255, 255, 0);
        th {
          background: rgba(255, 255, 255, 0);
          border-bottom-color: rgba(255, 255, 255, 0.15);
          div {
            color: #fff;
            font-weight: 100;
          }
        }
      }
    }
    .el-table__body-wrapper {
      tr {
        color: #a0a3ab;
        background-color: rgba(255, 255, 255, 0);
        &:hover {
          td {
            background-color: rgba(78, 88, 120, 0.3) !important;
          }
        }
        td {
          border: 0;
          padding: 0;
          .el-button--mini {
            padding: 0;
          }
          &.red {
            color: #fa3b3c;
          }
        }
      }
    }
    &::before {
      content: '';
      background-color: rgba(255, 255, 255, 0);
    }
  }
}
</style>
