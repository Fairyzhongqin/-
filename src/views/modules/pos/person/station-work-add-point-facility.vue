<!--高危工艺类型选择页-->
<template>
  <el-dialog title="选择设备设施" class="facilityadd-dialog" :close-on-click-modal="false" :visible.sync="visible" append-to-body width="600px">
    <el-form :inline="true" ref="dataForm" :model="dataForm" @keyup.enter.native="getqueryList()">

      <el-form-item label="编号/名称" size="mini" prop="name">
        <el-input v-model="dataForm.name" placeholder="编号/名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getqueryList()">
          <i class="el-icon-search"></i>
          查询
        </el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="
                   resetForm('dataForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="dataListLoading" :data="menuList" @selection-change="handleSelectionChange" @row-click="clickRow" style="width: 100%;cursor:pointer" row-key="id" border lazy default-expand-all highlight-current-row ref="multipleTable" tooltip-effect="dark" height="300px">
      <el-table-column type="selection" width="70">
      </el-table-column>
      <el-table-column label="编号" prop="code" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="name" label="名称">
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <span slot="footer" class="dialog-footer">
      <el-button @click="()=>{cancel;visible = false}">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getFacilityList } from '@/api/sou/equlpment'
export default {
  props: ['zoneId', 'type'],
  data () {
    return {
      dataForm: {
        name: ''
      },
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      // 围栏或区域
      visible: false,
      menuList: [],
      dataListLoading: false,
      selectChange: {}// 选中项的值
    }
  },
  created () {
    // this.getqueryList()
  },
  methods: {
    async init (select) {
      this.visible = true
      await this.getqueryList()
      this.$nextTick(() => {
        this.selectChange = select
        this.$refs.multipleTable.data.map(r => {
          if (r.id === select.id) {
            this.$refs.multipleTable.toggleRowSelection(r, true)
          }
        })
      })
    },
    // 查询设备设施列表
    async getqueryList (select) {
      this.dataListLoading = true
      this.menuList = []
      await getFacilityList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'type': this.type,
        'zoneId': this.zoneId,
        'name': this.dataForm.name
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.menuList = data.page.list
          this.totalPage = data.page.count
          // console.log(this.menuList)
          this.dataListLoading = false
        } else {
          this.dataList = []
          this.totalPage = 0
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 点击行选中
    clickRow (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // // 获取围栏列表
    // getfencingList (select) {
    //   this.dataListLoading = true
    //   this.menuList = []
    //   fencingList({
    //     'page': 1,
    //     'limit': 50
    //   }).then(({ data }) => {
    //     if (data && data.code === 0) {
    //       this.menuList = data.page.list
    //       this.$nextTick(() => {
    //         select.map(val => {
    //           this.menuList.map((vals, index) => {
    //             if (val.fencingId === vals.id || val.id === vals.id) {
    //               this.$refs.multipleTable.toggleRowSelection(this.menuList[index], true)
    //             }
    //           })
    //         })
    //       })
    //       this.dataListLoading = false
    //     }
    //   }).catch((err) => {
    //     console.log(err)
    //     this.$message.error('未知异常！请联系管理员')
    //   })
    // },
    // 属性构建选择时
    // handleCheckChange (val) {
    //   let res = this.$refs.menuListTree.getCheckedNodes()
    //   this.dataForm.zoneFencingIdList = []
    //   res.forEach((item) => {
    //     this.dataForm.zoneFencingIdList.push({ zoneId: item.id })
    //   })
    // },
    // 选中区域或围栏
    handleSelectionChange (val) {
      if (val.length > 1) {
        this.$refs.multipleTable.clearSelection()
        this.$refs.multipleTable.toggleRowSelection(val.pop())
      } else {
        this.selectChange = val.pop()
      }
      console.log(this.selectChange)
    },
    // 提交区域或围栏
    dataFormSubmit () {
      this.visible = false
      console.log(this.selectChange)
      this.$emit('selectChange', this.selectChange)
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getqueryList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.getqueryList()
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getqueryList()
    },
    cancel () {
      this.$refs.multipleTable.clearSelection()
    }
  }
}
</script>
<style lang="scss" scoped>
.facilityadd-dialog {
  .el-table th div {
    line-height: normal;
  }
  .el-dialog__body {
    padding: 15px 20px;
  }
  .el-pagination {
    text-align: right;
    margin-top: 8px;
  }
}
</style>
