<!--部门管理-->
<template>
  <div class="department-manage mod-config">
    <el-form :inline="true" :model="dataForm">
      <el-form-item>
        <el-button type="primary" size="mini" @click="addOrUpdateHandle()">新增部门</el-button>
      </el-form-item>
    </el-form>
    <div class="department-manage-content">
      <el-scrollbar class="default-scrollbar" style="height:100%" wrap-class="default-scrollbar__wrap" view-class="p20-scrollbar__view">
        <org-tree name="test" :data="data" :horizontal="horizontal" :collapsable="collapsable" :label-class-name="labelClassName" :render-content="renderContent" @on-expand="onExpand" @on-node-click="onNodeClick" />
      </el-scrollbar>
      <!--部门信息-->
      <div class="info depart-info">
        <p>部门信息</p>
        <div class="info-content">
          <p><span>部门编号：</span><span>{{dataForm.code}}</span></p>
          <p><span>部门名称：</span><span>{{dataForm.name}}</span></p>
          <p><span>上级部门：</span><span>{{dataForm.parentName}}</span></p>
          <div class="info-content-btn">
            <el-button type="primary" size="mini" :disabled="dataForm.code==='10'" @click="addOrUpdateHandle(dataForm.id)">修改</el-button>
            <el-button type="danger" size="mini" :disabled="dataForm.code==='10'" @click="deleteHandle(dataForm.id, dataForm.name)">删除</el-button>
          </div>
        </div>
      </div>
      <!--员工信息-->
      <div class="info staff-info">
        <p>员工信息<a href="javascript:;" @click="addStaffHandle(dataForm.id)">绑定员工</a></p>
        <div class="info-content">
          <el-table :data="dataList" border max-height="calc(100vh - 381px)" ref="multipleTable" v-loading="dataListLoading" style="width: 100%;">
            <el-table-column type="id" v-if="false" width="50">
            </el-table-column>
            <el-table-column prop="gh" label="工号" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="name" label="姓名" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column prop="description" label="职位" :show-overflow-tooltip="true">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="deletePerHandle(scope.row.relId, scope.row.name)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination :page-size="10" :pager-count="5" layout="prev, pager, next" :total="totalPage" :current-page.sync="current" @current-change="handleBuyerCurrentChange">
          </el-pagination>
        </div>
      </div>
    </div>
    <!-- 弹窗, 新增 / 修改 部门-->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗, 绑定人员-->
    <staff-add v-if="staffAddVisible" ref="staffAdd" :isRadio="true" @refreshDataList="getStaffDataList"></staff-add>
  </div>
</template>

<script>
import OrgTree from '@/components/OrgTree'
import AddOrUpdate from './depart-add-or-update'
import StaffAdd from './depart-staff-add.vue'

import { departList, departDelete, employeeList, deleteDeptEmployee } from '@/api/sys/depart'

export default {
  data () {
    return {
      dataForm: {
        id: '',
        name: '',
        code: '',
        parentId: 0, // 上级部门Id,一级为0
        parentName: ''
      },
      dataList: [],
      data: {},
      isShowOrg: false,
      dataListLoading: false,
      props: {
        children: 'child'
      },
      horizontal: true,
      collapsable: true,
      expandAll: true,
      labelClassName: 'bg-white',
      addOrUpdateVisible: false,
      staffAddVisible: false,
      dataListSelections: [],
      current: 1,
      totalPage: 0
    }
  },
  components: {
    AddOrUpdate,
    OrgTree,
    StaffAdd
  },
  created () {
    this.getDataList()
  },
  mounted () {
  },
  methods: {
    // 绑定员工
    addStaffHandle (id) {
      this.staffAddVisible = true
      this.$nextTick(() => {
        this.$refs.staffAdd.init(id)
      })
    },
    renderContent (h, data) {
      return data.deptName
    },
    onExpand (e, data) {
      if ('expand' in data) {
        data.expand = !data.expand
        if (!data.expand && data.child) {
          this.collapse(data.child)
        }
      } else {
        this.$set(data, 'expand', true)
      }
    },
    // 点击选项执行的方法，可以用于跳转到其他链接，注意一定要写协议头
    onNodeClick (e, data) {
      let isDivDom = !e.target.className.indexOf('org-tree-node-label-inner')
      if (isDivDom) {
        this.dataForm.id = data.id
        this.dataForm.code = data.deptCode
        this.dataForm.name = data.deptName
        this.dataForm.parentId = data.parentId
        this.dataForm.parentName = data.parentName
        let y = document.getElementsByClassName('org-tree-node-label-inner')
        for (let i = 0; i < y.length; i++) {
          y[i].classList.remove('deleSign')
        }
        e.target.classList.add('deleSign')
        this.getStaffDataList() // 获取员工列表
      }
      if (data.url == null) {
        return false
      } else {
        window.open(data.url)
      }
    },
    collapse (list) {
      let _this = this
      list.forEach(function (child) {
        if (child.expand) {
          child.expand = false
        }
        child.child && _this.collapse(child.child)
      })
    },
    expandChange () {
      this.toggleExpand(this.data, this.expandAll)
    },
    toggleExpand (data, val) {
      let _this = this
      if (Array.isArray(data)) {
        data.forEach(function (item) {
          _this.$set(item, 'expand', val)
          if (item.child) {
            _this.toggleExpand(item.child, val)
          }
        })
      } else {
        this.$set(data, 'expand', val)
        if (data.child) {
          _this.toggleExpand(data.child, val)
        }
      }
    },
    // 获取数据列表
    getDataList () {
      departList().then(({ data }) => {
        if (data && data.code === 0) {
          this.data = data.data[0]
          this.dataForm.id = this.data.id
          this.dataForm.code = this.data.deptCode
          this.dataForm.name = this.data.deptName
          this.dataForm.parentId = this.data.parentId
          this.dataForm.parentName = this.data.parentName
          this.getStaffDataList() // 获取员工列表
          this.$nextTick(() => {
            this.expandChange()
          })
        } else {
          this.$message.error(data.msg)
        }
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
      })
    },
    // 获取员工列表
    getStaffDataList () {
      this.dataListLoading = true
      employeeList({
        'page': this.current,
        'limit': '10',
        'deptId': this.dataForm.id
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
      })
    },
    // 新增部门
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除员工
    deletePerHandle (id, name) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      let nameArr = name ? [name] : this.dataListSelections.map(item => {
        return item.name
      })
      this.$confirm(`确定对[姓名=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDeptEmployee({
          id: ids[0]
        }).then(({ data }) => {
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
        }).catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
      }).catch(() => { })
    },
    // 删除部门
    deleteHandle (id, name) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      let nameArr = name ? [name] : this.dataListSelections.map(item => {
        return item.name
      })
      this.$confirm(`确定对[部门名称=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        departDelete(ids).then(({ data }) => {
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
        }).catch(err => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
      }).catch(() => { })
    },
    // 分页
    handleBuyerCurrentChange (val) {
      this.current = val
      this.getStaffDataList()
    }
  }
}
</script>
<style lang="scss">
.department-manage {
  &-content {
    height: calc(100vh - 112px);
    position: relative;
    padding-right: 364px;
    .info {
      width: 360px;
      position: absolute;
      right: 0;
      top: 0;
      border: 1px solid rgba(220, 223, 230, 1);
      border-radius: 4px;
      > p {
        margin: 0;
        padding: 10px;
        font-size: 12px;
        position: relative;
        color: rgba(34, 34, 34, 1);
        background: linear-gradient(
          0deg,
          rgba(236, 239, 242, 1),
          rgba(217, 223, 231, 1)
        );
        font-weight: bold;
      }
      &-content {
        padding: 0 12px;
        font-size: 12px;
        &-btn {
          text-align: center;
          margin-bottom: 12px;
        }
      }
    }
    .staff-info {
      top: 170px;
      > p > a {
        float: right;
      }
      .info-content {
        padding: 12px;
      }
    }
  }
}
</style>
