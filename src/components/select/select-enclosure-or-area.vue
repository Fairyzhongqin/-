<template>
  <el-dialog title="选择活动范围" class="select-dialog" :close-on-click-modal="false" :visible.sync="visible" append-to-body width="600px">
    <el-row>
      <el-col :span="24">

        <!-- <el-form ref="form"
                 v-if="!rateShow"
                 label-width="100px">
          <el-form-item label="新建作业区域">
            <a>开始画</a>
          </el-form-item>

        </el-form> -->
        <!-- <el-radio-group v-if="rateShow"
                        v-model="radioType"
                        style="margin-bottom:10px;"
                        @change='changeRadioType'>
          <el-radio label="enclosure">围栏</el-radio>
          <el-radio label="area">区域</el-radio>
        </el-radio-group> -->
        <!-- <div class="areaStyle">
          区域
        </div> -->
        <el-table v-loading="dataListLoading" :data="menuList" @selection-change="handleSelectionChange" @row-click="clickRow" style="width: 100%;cursor:pointer" row-key="id" border lazy default-expand-all highlight-current-row ref="multipleTable" tooltip-effect="dark" :tree-props="{children: 'subregion', hasChildren: 'hasChildren'}" height="300px">
          <!-- v-if="radioType==='enclosure'" -->
          <!-- @selection-change="handleSelectionChange" -->
          <el-table-column type="selection" width="70">
          </el-table-column>
          <el-table-column prop="zoneName" label="区域名称">
            <!-- <template slot-scope="scope">
          <el-tree :data="menuList"
                   :props="menuListTreeProps"
                   node-key="menuId"
                   ref="menuListTree"
                   show-checkbox
                   :default-expand-all="true"
                   :highlight-current="true"
                   :expand-on-click-node="false">
          </el-tree>
        </template> -->
          </el-table-column>
          <!-- <el-table-column v-else
                           prop="fencingName"
                           label="围栏名称">
            <template slot="header"
                      slot-scope="scope">
              <el-row>
                <el-col :span="10"> <span>围栏名称</span></el-col>
                <el-col :span="14">
                  <el-input v-model="fencingName"
                            size="mini"
                            placeholder="输入围栏名称搜索" />
                </el-col>
              </el-row>

            </template>
          </el-table-column> -->
          <!-- <el-table-column align="right">

          </el-table-column> -->
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
import { treeDataTranslate2 } from '@/utils'
import { queryZoneInfo } from '@/api/pos/region'
export default {
  data () {
    return {
      // 围栏或区域
      type: '',
      visible: false,
      treeids: [],
      menuList: [],
      dataListLoading: false,
      selectChange: {}, // 选中区域/围栏
      radioType: 'enclosure' // 表示围栏或区域
      // menuListTreeProps: {
      //   label: 'zoneName',
      //   children: 'subregion'
      // },
      // rateShow: true
      // fencingName: ''
    }
  },
  created () {
    // this.getqueryList()
  },
  methods: {
    init (name, select, rate) {
      this.type = name
      this.visible = true
      if (rate) {
        this.rateShow = false
      }
      this.$nextTick(() => {
        this.treeids = []
        this.selectChange = select
        // if (select.length >= 1) {
        //   if (select[0].zoneName) {
        //     this.radioType = 'area'
        //   } else {
        //     this.radioType = 'enclosure'
        //   }
        // }
        // this.changeRadioType()
        // this.getfencingList(select)
        this.getqueryList(select)
      })
    },
    //   // 围栏区域切换时
    //   changeRadioType () {
    //     if (this.radioType === 'enclosure') {
    //       this.getfencingList(this.selectChange)
    //     } else {
    //       this.getqueryList()
    //     }
    // },
    // 获取区域列表
    getqueryList (select) {
      this.dataListLoading = true
      this.menuList = []
      queryZoneInfo().then(({ data }) => {
        if (data && data.code === 0) {
          this.menuList = treeDataTranslate2(data.data || [], 'id', 'parentId')
          console.log(this.menuList)
          this.$nextTick(() => {
            select.map(val => {
              this.menuList.map((vals, index) => {
                if (val.zoneId === vals.id) {
                  this.$refs.multipleTable.toggleRowSelection(this.menuList[0], true)

                  console.log(vals)
                  // this.$refs.singleTable.setCurrentRow(this.menuList[0])
                }
              })
            })
          })
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
      console.log(this.selectChange)
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
.select-dialog {
  .el-table th div {
    line-height: normal;
  }
  .el-dialog__body {
    padding: 15px 20px;
  }
}
</style>
