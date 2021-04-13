<!--高危工艺类型选择页-->
<template>
  <el-dialog title="选择高危工艺类型" class="hightadd-dialog" :close-on-click-modal="false" :visible.sync="visible" append-to-body width="600px">
    <el-row>
      <el-col :span="24">
        <el-table v-loading="dataListLoading" :data="menuList" @selection-change="handleSelectionChange" @row-click="clickRow" style="width: 100%;cursor:pointer" row-key="id" border lazy default-expand-all highlight-current-row ref="multipleTable" tooltip-effect="dark" height="300px">
          <el-table-column type="selection" width="70">
          </el-table-column>
          <el-table-column prop="name" label="高危工艺类型名称">
          </el-table-column>
          <el-table-column label="工艺简介" prop="content" :show-overflow-tooltip="true">
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { highRiskProcessTypeList } from '@/api/sou/highRisk'
export default {
  data () {
    return {
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
    // 获取高危工艺类型
    async getqueryList (select) {
      this.dataListLoading = true
      this.menuList = []
      await highRiskProcessTypeList().then(({ data }) => {
        if (data && data.code === 0) {
          console.log('menlist==========', data)

          this.menuList = data.page.list
          console.log(this.menuList)
          this.dataListLoading = false
        } else {
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
      console.log('选择得值', this.selectChange)
    },
    // 提交区域或围栏
    dataFormSubmit () {
      this.visible = false
      console.log(this.selectChange)
      this.$emit('selectChange', this.selectChange)
    }
  }
}
</script>
<style lang="scss" scoped>
.hightadd-dialog {
  .el-table th div {
    line-height: normal;
  }
  .el-dialog__body {
    padding: 15px 20px;
  }
}
</style>
