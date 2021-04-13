<template>
  <div class='plb-table-container'>
    <el-table :data="tableData"
              style="width: 100%"
              size="mini"
              :cell-class-name="cellStyle"
              :height="height">
      <el-table-column v-for="(th, index) in thData"
                       :prop="th.value"
                       :label="th.name"
                       :show-overflow-tooltip="true"
                       :key="index"
                       :width="th.width"
                       :class-name="th.color"
                       :align="th.align">
      </el-table-column>
      <el-table-column label="操作"
                       :width="48"
                       align="center">
        <template slot-scope="scope">
          <el-button type="text"
                     size="mini"
                     @click="view(scope.row)">{{scope.row.status ==='0' ? '未处理' : '已处理'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { alermPlane } from '@/api/kanban/souBoard'
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
        name: '时间', value: 'rName', width: 80, align: 'left'
      }, {
        name: '区域', value: 'area', width: 80, align: 'left'
      }, {
        name: '报警原因，当前值/阈值', value: 'tm', align: 'left'
      }],
      tableData: []
    }
  },
  created () {
    this.getAlermPlane()
  },
  mounted () { },
  computed: {},
  watch: {},
  methods: {
    view (val) {

    },
    cellStyle ({ row, column, rowIndex, columnIndex }) {
      // status: 0-未处理 1-已处理
      if (row.status === '1') {
        return
      }
      return 'colorcal'
    },
    getAlermPlane () {
      alermPlane().then(({ data }) => {
        if (data && data.code === 0) {
          if (data.list) {
            let _tableData = []
            data.list.map(item => {
              _tableData.push({
                rName: item.createDate.split(' ')[1],
                area: item.zoneName || '未知',
                tm: item.alarmInfo,
                status: item.alarmStatus
              })
            })
            this.tableData = _tableData
          }
        } else {
          console.log(data.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.plb-table-container {
  /deep/ .el-table {
    background-color: #fff0;
    .colorcal {
      color: #ffea21;
      .el-button--text {
        color: #ff2829;
      }
    }
    .el-table__header-wrapper {
      tr {
        background: #fff0;
        th {
          background: #fff0;
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
        background-color: #fff0;
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
      content: "";
      background-color: #fff0;
    }
  }
}
</style>
