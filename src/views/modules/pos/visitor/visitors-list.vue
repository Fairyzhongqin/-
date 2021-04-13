<!--访客列表-->
<template>
  <div class="visitorStyle mod-config">
    <el-form :inline="true"
             ref="dataForm"
             :model="dataForm"
             class="el-form-margin-bottom"
             @keyup.enter.native="getDataList()">
      <el-form-item label="访客证件号/姓名"
                    prop="conditions">
        <el-input v-model.trim="dataForm.conditions"
                  size="mini"
                  clearable
                  placeholder="请输入访客证件号/姓名"></el-input>
      </el-form-item>
      <el-form-item label="访客状态"
                    prop="status">
        <el-select v-model="dataForm.status"
                   placeholder="请选择"
                   size="mini"
                   clearable>
          <el-option v-for="item in statusList"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="getDataList()"
                   v-waves>
          <i class="el-icon-search"></i>
          查询</el-button>
        <el-button type="info"
                   size="mini"
                   icon="el-icon-refresh-right"
                   @click="
                   resetForm('dataForm')"
                   v-waves>重置</el-button>
        <el-button type="danger"
                   size="mini"
                   @click="blackHandle()"
                   :disabled="dataListSelections.length <= 0"
                   v-waves>
          <icon-svg name="tijiao" class="piliang"></icon-svg>批量拉黑
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              ref="multipleTable"
              @cell-click="cellClick"
              v-loading="dataListLoading"
              @selection-change="selectionChangeHandle"
              style="width: 100%;">
      <el-table-column type="selection"
                       width="40"></el-table-column>
      <!-- <el-table-column type="index"
                       label="序号"
                       width="62">
      </el-table-column> -->
      <el-table-column prop="name"
                       label="访客姓名">
      </el-table-column>
      <el-table-column prop="id"
                       :show-overflow-tooltip="true"
                       label=访客证件号>
      </el-table-column>
      <el-table-column prop="sex"
                       align="center"
                       label="访客性别">
        <template slot-scope="scope">
          <span v-if="scope.row.sex == '0'"
                type="danger">男</span>
          <span v-else
                type="success">女</span>
        </template>
      </el-table-column>
      <el-table-column prop="status"
                       align="center"
                       label="访客状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == '0'"
                  type="danger">离开</el-tag>
          <el-tag v-else
                  type="success">未离开</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="来访次数"
                       prop="visitorNum">
        <template slot-scope="scope">
          <template v-if="scope.row.visitorNum">
            <span @click.stop="addOrUpdateHandle(scope.row.id)" class="visitTime">{{scope.row.visitorNum || 0}}</span>
          </template>
          <template v-else>0</template>
        </template>
      </el-table-column>
      <el-table-column prop="ladeDate"
                       label="最近来访时间"
                       min-width="92"
                       :show-overflow-tooltip="true"></el-table-column>

      <el-table-column prop="alermNum"
                       label="报警次数">
        <template slot-scope="scope">
          <span>{{scope.row.alermNum || 0}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="blacklistFlag"
                       label="黑名单标识">
        <template slot-scope="scope">
          <span v-if="scope.row.blacklistFlag == '0'">否</span>
          <span v-else
                type="danger">是</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text"
                     @click.stop="addOrUpdateHandle(scope.row.id)">查看</el-button> -->
          <el-button type="text"
                     @click.stop="blackHandle(scope.row.blacklistFlag,scope.row.id)"
                     v-if="scope.row.blacklistFlag == '1'">解除拉黑</el-button>
          <el-button type="text"
                     @click.stop="blackHandle(scope.row.blacklistFlag,scope.row.id)"
                     v-if="scope.row.blacklistFlag == '0'">拉黑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   background
                   :total="totalPage"
                   layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 访客详情记录 -->
    <add-or-update v-if="addOrUpdateVisible"
                   ref="addOrUpdate"
                   @refreshDataList="getDataList"></add-or-update>

  </div>

</template>

<script>
import { visitorList, visitorBlacken } from '@/api/pos/person'
import AddOrUpdate from './visitors-add-or-update'

import waves from '@/utils/waves'
export default {
  directives: {
    waves
  },
  data () {
    return {
      dataForm: {
        id: '', // 访客证件号
        conditions: '', // 访客姓名
        status: ''// 访客状态
      },
      statusList: [{
        value: '0',
        label: '离开'
      }, {
        value: '1',
        label: '未离开'
      }],
      typeList: [],
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: { AddOrUpdate },
  activated () {
    this.getDataList() // 获取数据列表
  },
  methods: {
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 展示地图
    showMap () {
      this.$message.info('程序猿正在建设。。。。')
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      visitorList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'conditions': this.dataForm.conditions,
        'status': this.dataForm.status
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.count
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
      this.getDataList()
    },
    // 查看详细信息
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 拉黑 批量拉黑 解除拉黑
    blackHandle (blacklistflag, id) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      // 单个拉黑或者解除拉黑
      if (ids.length === 1) {
        let blacklistFlag = blacklistflag
        blacklistFlag === '0' ? blacklistFlag = '1' : blacklistFlag = '0'
        this.$confirm(`确定对[访客证件号=${ids.join(',')}]进行[${blacklistFlag === '1' ? '拉黑' : '解绑拉黑'}]操作？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          visitorBlacken({ ids: ids.join(','), blacklistFlag: blacklistFlag }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message.success('操作成功')
              this.getDataList()
            } else {
              this.$message.error('未知异常！请联系管理员')
            }
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
          })
        }).catch((err) => {
          console.info(err)
        })
      } else if (ids.length > 1) {
        let blacklistFlags = (this.dataListSelections.map(item => {
          if (item.blacklistFlag === '0') {
            return item.blacklistFlag
          }
        })).filter(Boolean)
        // console.log(blacklistFlag)
        let handleId = (this.dataListSelections.map(item => {
          if (item.blacklistFlag === '0') {
            return item.id
          }
        })).filter(Boolean)
        // console.log(handleId + '................' + blacklistFlags)
        console.log('handleId', handleId)
        console.log(blacklistFlags)
        if (handleId.length === 0) {
          return this.$message.error('已全部拉黑,不能进行批量拉黑操作')
        }
        this.$confirm(`确定对[访客证件号=${handleId.join(',')}]进行批量拉黑操作？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          visitorBlacken({ ids: handleId.join(','), blacklistFlag: '1' }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message.success('操作成功')
              this.getDataList()
            } else {
              this.$message.error('未知异常！请联系管理员')
            }
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
          })
        }).catch((err) => {
          console.info(err)
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.visitorStyle {
  .visitTime {
    // color: red;
    // color: #3e8ef7;
    color: #2c78bb;
  }
  .visitTime:hover {
    text-decoration: underline;
  }
  .piliang {
    margin-right: 5px;
    vertical-align: top;
    margin-top: 1px;
  }
}
</style>
