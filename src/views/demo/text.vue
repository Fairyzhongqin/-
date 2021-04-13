<template>
  <el-dialog class="risk-factor"
             width="750px"
             title="选择事故因素"
             :visible.sync="visible"
             append-to-body>
    <!-- 所选事故 -->
    <el-form ref="form"
             label-width="60px">
      <el-form-item label="所选事故">
        <div class="accidentAdd">
          <div class="accidentAddHover">
            <el-tag @close="handleClose(tag)"
                    size="mini"
                    v-for="tag in dataListSelections"
                    :key="tag.id"
                    closable>
              {{tag.factorDanger}}
            </el-tag>
          </div>
        </div>
      </el-form-item>

    </el-form>
    <el-form :inline="true"
             ref="dataForm"
             :model="dataForm"
             @keyup.enter.native="getDataList()">
      <el-form-item label="事故名称"
                    size="mini"
                    prop="factorName">
        <el-input v-model="dataForm.factorName"
                  placeholder="事故名称"
                  clearable>

        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary"
                   size="mini"
                   @click="getDataList()">
          <i class="el-icon-search"></i>
          查询
        </el-button>
        <el-button type="info"
                   size="mini"
                   icon="el-icon-refresh-right"
                   @click="resetForm('dataForm')">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-table :data="dataList"
              border
              ref="multipleTable"
              row-key="id"
              @row-click="rowClick"
              @expand-change="expandTableRow"
              v-loading="dataListLoading"
              style="width:100%">

      <el-table-column type="expand"
                       width="40">
        <template slot-scope="props">
          <div v-for="(item,index) in dataList[props.$index].children"
               :key="index"
               class="sub-content"
               @click="plog(props)">
            <span class="vertical"></span>
            <span class="horizon"></span>
            <el-checkbox v-model="item.checked"
                         @change="checkChange(item)"
                         class="check-style"></el-checkbox>
            <p class="index-style">{{`${props.$index+1} - ${Number(index) + 1}`}}</p>
            <el-tooltip placement="top">
              <div slot="content">{{item.factorDanger}}</div>
              <p class="danger-factor"><span class="pre-title">主要危害因素：</span><span class="result-risk">{{item.factorDanger}}</span></p>
            </el-tooltip>

            <el-tooltip placement="top">
              <div slot="content">{{item.factorControl}}</div>
              <p class="danger-factor special-left"><span class="pre-title">控制措施：</span><span class="result-risk">{{item.factorControl}}</span></p>
            </el-tooltip>

          </div>
        </template>
      </el-table-column>
      <el-table-column type="index"
                       width="60"
                       label="序号"></el-table-column>
      <el-table-column prop="factorName"
                       width="100"
                       label="事故名称">

      </el-table-column>
      <el-table-column prop="factorDescribe"
                       label="事故描述"
                       :show-overflow-tooltip="true">

      </el-table-column>

    </el-table>
    <el-pagination @size-change="sizeChangeHandle"
                   @current-change="currentChangeHandle"
                   :current-page="pageIndex"
                   :page-sizes="[10, 20, 50, 100]"
                   :page-size="pageSize"
                   :total="totalPage"
                   layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <div slot="footer">
      <el-button @click="visible=false">取消</el-button>
      <el-button @click="addAccident()"
                 type="primary">确定</el-button>
    </div>
  </el-dialog>

</template>
<script>
import { factorList, queryFactorByType } from '@/api/risk/factor'
export default {
  data () {
    return {
      accidentTypeList: [],
      dataListSelections: [],
      dataList: [], // 列表数
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      visible: true,
      dataForm: {
        factorName: ''

      }
    }
  },
  created () {
    this.getDataList()
  },
  methods: {
    init () {
      this.visible = true
    },
    // 点击一行选中
    rowClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
      console.log(row)
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      factorList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'factorName': this.dataForm.factorName
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
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
    // 子表
    expandTableRow (event, expanded) {
      if (expanded && expanded.length > 0) {
        queryFactorByType({ factorMainId: event.id }).then(({ data }) => {
          if (data && data.code === 0) {
            if (data.list.length > 0) {
              this.dataList = this.dataList.map(item => {
                if (event.id === item.id) {
                  data.list.map(res => {
                    res.checked = false
                  })
                  item.children = [...data.list]
                }
                return item
              })
            } else {
              this.$message.error('暂无数据')
            }
            console.log(this.dataList)
          }
        })
      }
    },
    // 返回
    addAccident () {
      this.visible = false
      this.$emit('selectAccidentEmit', this.dataListSelections)
      this.dataListSelections = []
    },
    // 子项选中状态
    checkChange (val) {
      if (this.dataListSelections.indexOf(val) !== -1) {
        this.dataListSelections.splice(this.dataListSelections.indexOf(val), 1)
      } else {
        this.dataListSelections.push(val)
      }
      console.log(this.dataListSelections)
    },
    // 重置
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.getDataList()
    },
    // 移除选中项
    handleClose (val) {
      this.dataListSelections.splice(this.dataListSelections.indexOf(val), 1)
      this.dataList.map((vals) => {
        if (vals.id === val.factorMainId) {
          vals.children.map(item => {
            if (item.id === val.id) {
              this.$set(item, 'checked', false)
            }
          })
        }
      })
      console.log(this.dataList, '++++')
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
    plog (val) {
      console.log(val)
    }
  }

}
</script>
<style lang="scss">
