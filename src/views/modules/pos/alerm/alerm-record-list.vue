<!--报警查看-->
<template>
  <div class="mod-config">
    <el-form :inline="true" ref="dataForm" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item label="报警类型" prop="type">
        <el-select v-model="dataForm.type" size="mini" clearable placeholder="请选择">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in typeList" :key="item.value" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary"
                   @click="getDataList()">查询</el-button>
        <el-button @click="resetForm('dataForm')">重置</el-button>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList()" v-waves>
          <i class="el-icon-search"></i>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="
                   resetForm('dataForm')" v-waves>重置</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList" border v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="id" v-if="false" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column prop="alermTime" width="150" header-align="center" align="center" label="报警时间">
      </el-table-column>
      <el-table-column prop="infos" header-align="center" align="center" min-width="120px" :show-overflow-tooltip="true" label="报警信息">
      </el-table-column>
      <el-table-column prop="type" header-align="center" align="center" width="100px" label="报警类型">
        <template slot-scope="scope">
          {{scope.row.type | formatType(typeList)}}
        </template>
      </el-table-column>
      <el-table-column prop="location" width="150" header-align="center" align="center" label="报警坐标">
        <template slot-scope="scope">
          {{scope.row.location}}
          <el-tooltip class="item" effect="dark" content="点击查看" placement="right">
            <i class="el-icon-location-outline" @click="showMap()" style="cursor: pointer;color: #3E8EF7;"></i>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="replyTime" width="150" header-align="center" align="center" label="处理时间">
        <template slot-scope="scope">
          {{scope.row.replyTime || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="replyInfo" header-align="center" align="center" min-width="100px" :show-overflow-tooltip="true" label="处理信息">
        <template slot-scope="scope">
          {{scope.row.replyInfo || '-'}}
        </template>
      </el-table-column>
      <el-table-column prop="status" header-align="center" width="100px" align="center" label="处理状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == '0'" type="danger">报警中</el-tag>
          <el-tag v-else type="success">已处理</el-tag>
        </template>
      </el-table-column>
      <el-table-column header-align="center" align="center" width="120px" label="操作">
        <template slot-scope="scope">
          <el-button :disabled="scope.row.status != '0'" type="text" size="small" @click="ignoreHandle(scope.row.id)">忽略</el-button>
          <el-button :disabled="scope.row.status != '0'" type="text" size="small" @click="handleAlerm(scope.row.id)">处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
import { zoneAlermRecordList, ignore, handleAlerm } from '@/api/pos/alerm'
import { getLabels } from '@/api/common/sys'
export default {
  data () {
    return {
      dataForm: {
        type: '' // 报警类型
      },
      typeList: [], // 报警类型列表
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: []
    }
  },
  activated () {
    this.getDataList() // 获取数据列表
  },
  created () {
    this.getBaseData() // 加载基础数据
  },
  methods: {
    // 展示地图
    showMap () {
      this.$message.info('程序猿正在建设。。。')
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      zoneAlermRecordList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'type': this.dataForm.type // 报警描述
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list
          this.totalPage = data.page.count
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
    // 加载基础数据
    getBaseData () {
      // 区域报警类型 - 字典
      getLabels({
        'type': 'alerm_zone_type'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.typeList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },
    // 忽略
    ignoreHandle (id) {
      this.$confirm(`确定进行[${id ? '忽略' : '批量忽略'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        ignore({
          'id': id
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        }).catch((err) => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
      }).catch(() => { })
    },
    // 处理
    handleAlerm (id) {
      this.$prompt('请输入处理内容', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(({ value }) => {
        handleAlerm({
          'id': id,
          'replyInfo': value
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            this.$message({
              message: '操作成功',
              type: 'success',
              duration: 1500,
              onClose: () => {
              }
            })
          } else {
            this.$message.error(data.msg)
          }
        }).catch((err) => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
      }).catch(() => { })
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
