<!--承包商列表-->
<template>
  <div>
    <div class="contract-manage mod-config" v-if="viewOrDetailVisible">
      <el-form :inline="true" class="el-form-margin-bottom" ref="dataForm" :model="dataForm" @submit.native.prevent @keyup.enter.native="getDataList()">
        <el-form-item label="承包商名称" prop="contractorName">
          <el-input v-model.trim="dataForm.contractorName" placeholder="承包商名称" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="getDataList()" v-waves>
            <i class="el-icon-search"></i>
            查询</el-button>
          <el-button type="info" size="mini" icon="el-icon-refresh-right" @click="
                   resetForm('dataForm')" v-waves>重置</el-button>
          <el-button type="warning" size="mini" icon="el-icon-plus" @click="addOrUpdateHandle()" v-waves>新增承包商</el-button>
        </el-form-item>
      </el-form>
      <el-scrollbar class="default-scrollbar" style="height:calc(100% - 66px)" wrap-class="default-scrollbar__wrap" view-class="p20-scrollbar__view">
        <div class="cardshow">
          <template v-if="dataList.length">
            <div v-for="(item,index) in dataList" :key='index' class="item">
              <el-card shadow="hover">
                <div slot="header" class="clearfix header" :show-overflow-tooltip="true">
                  <icon-svg name='cbsgl'></icon-svg>
                  <el-tooltip :content="item.contractorName" placement="top">
                    <span class="contractorName">{{item.contractorName}}</span>
                  </el-tooltip>
                  <!--<i class="el-icon-close"-->
                  <!--@click="deleteHandle(item.id,item.contractorName)"></i>-->
                  <div class="header-status" :class="item.state !=='0'?'status-work':''">
                    空闲
                    <i class="header-status-lef"></i>
                    <i class="header-status-rig"></i>
                  </div>
                </div>
                <p><span>负责人：</span>{{item.personLiable}}</p>
                <div class="personList">
                  <span>承包商人员：</span>
                  <template v-if="item.personNames">
                    <template v-for="item1 in item.personNames">
                      {{item1}}
                    </template>
                  </template>
                  <template v-else>暂无数据</template>
                </div>
                <!--<p>状态：<span :class="{unfinish1:item.state==='0',finish1:item.state==='1'}">{{item.state==='0'?'空闲':'正在作业'}}</span></p>-->
                <p><span>总人数：</span>{{item.personNames ? item.personNames.length : 0}}</p>
                <p><span>联系方式：</span>{{item.telephone}}</p>
                <div class="done">
                  <el-button type="danger" size="mini" @click.native="deleteHandle(item.id,item.contractorName)" class="edit">删除</el-button>
                  <el-button type="primary" size="mini" @click.native="addOrUpdateHandle(item.id)" class="edit">修改</el-button>
                  <el-button type="primary" size="mini" @click.native="showDetail(item.id)" class="edit">详情</el-button>
                </div>
              </el-card>
            </div>
          </template>
          <template v-else>
            <no-data></no-data>
          </template>
        </div>
      </el-scrollbar>
      <!-- 弹窗, 新增 / 修改 -->
      <add-or-update v-if="
                       addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList">

      </add-or-update>
    </div>
    <!-- 展示承包商详情信息 -->
    <!-- <contract-detail v-if="!viewOrDetailVisible"></contract-detail> -->
  </div>
</template>
<script>
import AddOrUpdate from './contract-add-or-update'
import contractDetail from './contract-detail-dialog'
import { contractList, contractDelete } from '@/api/pos/contractManage'
import waves from '@/utils/waves'
import NoData from '@/components/NoData'
export default {
  directives: {
    waves
  },
  data () {
    return {
      viewOrDetailVisible: true, // 控制那个展示
      dataForm: {
        contractorName: '' // 承包商名称，
      },
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false, // 新增弹框显示,
      detailDialogVisible: false, // 控制展示想去的弹框
      // pageSize: 10,
      // pageIndex: 1,
      totalPage: 0,
      dataListSelections: [] // 多选数据
    }
  },
  components: {
    AddOrUpdate,
    contractDetail,
    NoData
  },
  activated () {
    this.getDataList()
  },
  created () {
    this.getDataList()
    this.aa()
  },
  methods: {
    // 获取表格内容
    getDataList () {
      this.dataListLoading = true
      contractList({
        'contractorName': this.dataForm.contractorName
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
          this.dataListLoading = false
          if (data.list.length > 0) {
            this.dataList = data.list
            console.log(this.dataList)
            this.dataList.forEach(item => {
              if (item.personNames && item.personNames.length > 0) {
                item.personNames = item.personNames.split(',')
              }
            })
          } else {
            this.dataList = []
          }
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 控制显示详情的弹出框
    showDetail () {
      this.$router.push({ path: '/pos/contractManage/contract-detail-dialog' })
      // this.$confirm(`确定进入历史详情页面?`, '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
      //   // this.viewOrDetailVisible = !this.viewOrDetailVisible
      //   this.$router.push({ path: '/pos/contractManage/contract-detail-dialog' })
      // })
    },
    aa () {
      let width = document.getElementsByClassName('contractorName').offsetWidth
      console.log(width)
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 点击一行选中
    cellClick (row) {
      this.$refs.multipleTable.toggleRowSelection(row)
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
    // 删除
    deleteHandle (id, name) {
      let ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      let nameArr = name
        ? [name]
        : this.dataListSelections.map(item => {
          return item.contractName
        })
      this.$confirm(`确定对[姓名=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          contractDelete(ids)
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
    }
  }
}
</script>
<style lang="scss">
.contract-manage {
  .cardshow {
    .item {
      float: left;
      width: 284px;
      height: 180px;
      margin: 0 10px 18px 0;
    }
    .el-card {
      height: 100%;
      // background: #87bcce;
      color: #606266;
      border: 1px solid #dcdfe6;
      cursor: pointer;
      position: relative;
      .header {
        width: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        .header-status {
          position: absolute;
          top: 0px;
          right: 10px;
          padding: 4px 8px;
          font-size: 14px;
          font-weight: normal;
          white-space: normal;
          color: #ffffff;
          width: 30px;
          text-align: center;
          background: rgba(191, 205, 222, 1);
          i {
            width: 0;
            height: 0;
            position: absolute;
            bottom: -15px;
          }
          &-lef {
            left: 0;
            border: 15px solid transparent;
            border-left-color: #bfcdde;
          }
          &-rig {
            right: 0;
            border: 15px solid transparent;
            border-right-color: #bfcdde;
          }
        }
      }
      .status-work {
        background: #2a8aff;
        .header-status-lef {
          border-left-color: #2a8aff;
        }
        .header-status-rig {
          border-right-color: #2a8aff;
        }
      }
      &:hover {
        transition: 0.5s;
        box-shadow: 4px 4px 11px 2px #ccc;
      }
      .el-card__header {
        position: relative;
        font-size: 16px;
        color: #222222;
        font-weight: bold;
        border: 0;
        padding: 16px 16px 20px;
        .icon-svg {
          font-size: 19px;
          color: #326db0;
          vertical-align: middle;
          margin-right: 8px;
          margin-left: 1px;
        }
        span {
          vertical-align: middle;
        }
        .order {
          position: absolute;
          left: 10px;
          border-radius: 50%;
          height: 20px;
          width: 20px;
          line-height: 20px;
          background-color: #cdd7e1;
          color: #5b93cd;
          font-size: 13px;
        }
        .unfinish {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 35px;
          line-height: 35px;
          // background-color: #73ace7;
          // box-shadow: 0 0 2px #73ace7;
          // color: #fff;
        }
        .el-icon-close {
          position: absolute;
          right: 3px;
          top: 3px;
          color: #e8eef3;
          &:hover {
            color: #fff;
          }
        }
      }
      .el-card__body {
        padding: 0 11px;
        .unfinish1 {
          background-color: #5b93cd;
          color: #fff;
          padding: 3px;
          font-size: 12px;
        }
        .finish1 {
          background-color: #c55151;
          color: #fff;
          padding: 3px;
          font-size: 12px;
        }
      }
      .personList,
      p {
        padding: 2px;
        margin: 0;
        span {
          min-width: 84px;
          display: inline-block;
        }
      }
      .personList {
        word-break: keep-all;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        // &:hover {
        //   white-space: normal;
        // }
      }
    }
    .done {
      margin-top: 8px;
      text-align: center;
      transition: 0.3s;
      * {
        // display: none;
        transition: 0.3s;
      }
    }
    .el-calendar__header {
      background-color: #7cb5ef;
    }
  }
  .el-card.is-always-shadow {
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
  .clearfix:before,
  .clearfix:after {
    display: table;
    content: '';
  }
  .clearfix:after {
    clear: both;
  }
}
</style>
