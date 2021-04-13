<template >
  <div class="certificate-list mod-config">
    <el-form :inline="true" :model="dataForm" ref="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item width="50" label="证书名称" prop="name">
        <el-input v-model.trim="dataForm.name" size="mini" clearable placeholder="请输入证书名称"></el-input>
      </el-form-item>
      <el-form-item width="50" label="证书类型" prop="type">
        <el-select v-model="dataForm.type" placeholder="请选择证书类型">
          <el-option v-for="item in certificateTypeList" :key="item.label" :label="item.value" :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="getDataList" icon="el-icon-search" v-waves>
          查询</el-button>
        <el-button type="info" size="mini" icon="el-icon-refresh-right" v-waves @click="
                   resetForm('dataForm')">重置</el-button>
        <el-button type="warning" size="mini" icon="el-icon-plus" @click="addOrUpdateHandle()" v-waves>新增证书</el-button>
        <!--<el-button type="danger"-->
        <!--size="mini"-->
        <!--icon="el-icon-delete"-->
        <!--@click="deleteHandle()"-->
        <!--v-waves-->
        <!--:disabled="dataListSelections.length <= 0">批量删除</el-button>-->
      </el-form-item>
    </el-form>
    <el-tooltip class="item" effect="dark" content="查看证书过期的人员" placement="left">
      <el-badge :value="reminderLength" class="badge">
        <el-button type="text" size="mini" @click="reminder()" class="remider"><i class="el-icon-bell"></i></el-button>
      </el-badge>
    </el-tooltip>
    <el-table :data="dataList" border row-key="id" ref="multipleTable" @cell-click="cellClick" v-loading="dataListLoading" @selection-change="selectionChangeHandle" @expand-change="expandTableRow" style="width: 100%;">
      <el-table-column type="expand" width="40" class="expand-style">
        <template slot-scope="props">
          <el-table :data="props.row.employeeCertificateList" :show-header="false" border class="certificateTable" style="width:100%">
            <el-table-column type="index" width="60" label="序号" header-align="center" align="center">
              <template slot-scope="propsChild">
                {{ (props.$index + 1) + '-' + (propsChild.$index + 1) }}
              </template>
            </el-table-column>
            <el-table-column label="员工姓名" :show-overflow-tooltip="true">
              <template slot-scope="propsChild">
                员工姓名: {{propsChild.row.employeeName}}
              </template>
            </el-table-column>
            <el-table-column label="员工工号" :show-overflow-tooltip="true">
              <template slot-scope="propsChild">
                员工工号: {{propsChild.row.employeeId}}
              </template>
            </el-table-column>
            <el-table-column label="性别" :show-overflow-tooltip="true" width="65">
              <template slot-scope="propsChild">
                性别: {{propsChild.row.sex === '0' ? '男' : '女'}}
              </template>
            </el-table-column>
            <el-table-column label="证书编号" :show-overflow-tooltip="true">
              <template slot-scope="propsChild">
                证书编号: {{propsChild.row.certificateCode}}
              </template>
            </el-table-column>
            <el-table-column label="所属部门" :show-overflow-tooltip="true">
              <template slot-scope="propsChild">
                所属部门: {{propsChild.row.deptName || '-'}}
              </template>
            </el-table-column>
            <el-table-column label="取证日期" :show-overflow-tooltip="true">
              <template slot-scope="propsChild">
                取证日期: {{propsChild.row.obtainDate}}
              </template>
            </el-table-column>
            <el-table-column label="过期日期" :show-overflow-tooltip="true">
              <template slot-scope="propsChild">
                过期日期: {{propsChild.row.overdueDate}}
              </template>
            </el-table-column>
            <el-table-column label="换证日期" :show-overflow-tooltip="true">
              <template slot-scope="propsChild">
                换证日期: {{propsChild.row.replaceDate}}
              </template>
            </el-table-column>
            <el-table-column :show-overflow-tooltip="true" label="证书附件">
              <template slot-scope="propsChild">
                <a @click.stop="downHandle(props.row.attachmentId)" title="下载">{{propsChild.row.fileName}}</a>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="propsChild">
                <el-button type="text" size="small" @click="updateCertificate(propsChild.row, propsChild.row.id, props.row)">修改</el-button>
                <el-button type="text" size="small" style="color:#E63031" @click="delCertificate(propsChild.row.id,propsChild.row.employeeName, propsChild.row.certificateId, propsChild.row)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>
        </template>
      </el-table-column>
      <!--<el-table-column type="selection"-->
      <!--width="40"-->
      <!--align="center"></el-table-column>-->
      <el-table-column prop="id" label="ID" :show-overflow-tooltip="true" v-if="false" width="60"></el-table-column>
      <el-table-column type="index" label="序号" align="center" :show-overflow-tooltip="true" width="60"></el-table-column>
      <el-table-column prop="name" :show-overflow-tooltip="true" label="证书名称">
      </el-table-column>
      <el-table-column prop="type" :show-overflow-tooltip="true" label="证书类型">
        <template slot-scope="scope">
          {{scope.row.type | filterType(certificateTypeList)}}
        </template>
      </el-table-column>
      <!--<el-table-column prop="validityTerm"-->
      <!--:show-overflow-tooltip="true"-->
      <!--label="有效期">-->
      <!--</el-table-column>-->
      <el-table-column prop="accessWay" :show-overflow-tooltip="true" label="获取途径">
        <template slot-scope="scope">
          {{scope.row.accessWay || '-'}}
        </template>
      </el-table-column>
      <!--<el-table-column prop="attachmentId"-->
      <!--:show-overflow-tooltip="true"-->
      <!--label="附件">-->
      <!--<template slot-scope="scope">-->
      <!--<a @click.stop="downHandle(scope.row.attachmentId)" title="下载">{{scope.row.fileName}}</a>-->
      <!--</template>-->
      <!--</el-table-column>-->
      <el-table-column :show-overflow-tooltip="true" label="员工数量">
        <template slot-scope="scope">
          {{scope.row.employeeCertificateList.length}}人
        </template>
      </el-table-column>
      <el-table-column width="200" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click.stop="certificateConfiguration(scope.row)" style="color: #3eaf7c">人员证书配置</el-button>
          <el-button type="text" size="small" @click.stop="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="text" size="small" style="color:#E63031" @click.stop="deleteHandle(scope.row.id, scope.row.name)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
    <!-- 弹窗, 人员证书配置 -->
    <certificate-configuration v-if="addOrUpdateVisible1" ref="addPersonnel" @refreshSubDataList="getDataList"></certificate-configuration>
    <!-- 弹窗, 人员证书过期提醒框 -->
    <certificate-expired-reminder v-if="addOrUpdateVisible2" ref="refreshReminder"></certificate-expired-reminder>
  </div>
</template>

<script>
import { certificateList, certificateDelete, employeeCertificateList, employeeCertificateDelete } from '@/api/process/certificate'
import { getLabels } from '@/api/common/sys'
import addOrUpdate from './certificate-add-or-update'
import certificateConfiguration from './certificate-configuration'
import certificateExpiredReminder from './certificate-expired-reminder'
export default {
  data () {
    return {
      dataForm: {
        name: '', // 证书名称
        type: '' // 证书类型
      },
      dataList: [], // 列表数据
      list: [],
      reminderList: [], // 人员证书过期数据
      reminderLength: '', // 人员证书过期数量
      gettime: '', // 当前时间
      certificateTypeList: [], // 证书类型数据
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      addOrUpdateVisible1: false,
      addOrUpdateVisible2: false
    }
  },
  created () {
    this.currentTime() // 获取当前时间
    this.getDataList() // 获取数据列表
    this.getReminderDate() // 获取人员证书过期数据
    this.getCertificateType() // 获取证书类型数据
  },
  activated () {
  },
  mounted () { },

  components: {
    addOrUpdate,
    certificateConfiguration,
    certificateExpiredReminder
  },
  methods: {
    getDataList () {
      this.dataListLoading = true
      certificateList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'name': this.dataForm.name, // 证书名称
        'type': this.dataForm.type // 证书类型
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
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 得到证书类型
    getCertificateType () {
      getLabels({
        type: 'CERTIFICATE_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.certificateTypeList = data.list
        }
      })
    },
    // 人员证书配置
    certificateConfiguration (info, id) {
      this.addOrUpdateVisible1 = true
      this.$nextTick(() => {
        this.$refs.addPersonnel.init(info, id)
      })
    },
    // 人员证书过期提醒
    reminder () {
      if (this.reminderList.length > 0) {
        this.addOrUpdateVisible2 = true
        this.$nextTick(() => {
          this.$refs.refreshReminder.init(this.reminderList)
        })
      } else {
        this.$message.info('暂无人员过期')
      }
    },
    // 删除
    deleteHandle (id, name) {
      let ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      let nameArr = name ? [name] : this.dataListSelections.map(item => {
        return item.name
      })
      this.$confirm(`确定对[证书名称=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        certificateDelete(ids).then(({ data }) => {
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
    // 下载处理
    downHandle (id) {
      let token = document.cookie.split('=')[1]
      this.downloadUrl = this.$http.adornUrl(`/spring-processweb/attachment/download?id=${id}&token=${token}`)
      window.location.href = this.downloadUrl
    },
    expandTableRow (event, expanded) {
      // if (expanded && expanded.length > 0) {
      //   employeeCertificateList({ certificateId: event.id }).then(({ data }) => {
      //     if (data && data.code === 0) {
      //       if (data.page.list.length > 0) {
      //         this.dataList = this.dataList.map(item => {
      //           if (event.id === item.id) {
      //             item.employeeCertificateList = data.page.list
      //           }
      //           return item
      //         })
      //       } else {
      //         // this.$message.error('暂无数据')
      //       }
      //       // console.log(this.dataList)
      //     }
      //   })
      // }
    },
    refreshSubDataList (id) {
      // employeeCertificateList({ certificateId: id }).then(({ data }) => {
      //   if (data && data.code === 0) {
      //     this.dataList = this.dataList.map(item => {
      //       if (id === item.certificateId) {
      //         item.employeeCertificateList = data.page.list
      //       }
      //       return item
      //     })
      //   }
      // })
    },
    // 更新人员证书信息
    updateCertificate (info, id, props) {
      this.$confirm(`确定对[姓名=${info.employeeName}]的[${props.name}]进行修改操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.addOrUpdateVisible1 = true
        this.$nextTick(() => {
          this.$refs.addPersonnel.init(info, id)
        })
      })
    },
    // 删除人员证书信息
    delCertificate (id, name, certificateId, scope) {
      this.$confirm(`确定对[员工姓名=${name}]进行[删除]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        employeeCertificateDelete([id]).then(({ data }) => {
          if (data && data.code === 0) {
            this.getDataList()
            // this.refreshSubDataList(certificateId)
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
    // 获取过期证书的人员数据
    getReminderDate () {
      this.reminderList = []
      this.dataListLoading = true
      employeeCertificateList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'certificateId': '' // 证书id
      }).then(({ data }) => {
        if (data && data.code === 0) {
          data.page.list.map(item => {
            if (new Date(this.gettime).getTime() > new Date(item.overdueDate).getTime()) {
              this.reminderList.push(item)
            }
          })
          if (this.reminderList.length > 0) {
            this.$notify({
              title: '警告',
              dangerouslyUseHTMLString: true,
              type: 'warning',
              message: '<span>当前' + this.reminderList.length + '人证书过期,请尽快去更换</span>'
            })
          }
          this.reminderLength = this.reminderList.length
          // this.dataList = data.page.list
        } else {
          this.reminderList = []
          this.totalPage = 0
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 获取当前时间
    getTime () {
      // var _this = this
      let yy = new Date().getFullYear()
      let mm = new Date().getMonth() + 1
      let dd = new Date().getDate()
      // let hh = new Date().getHours()
      // let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      // let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      // this.gettime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
      this.gettime = yy + '-' + mm + '-' + dd
      return yy + '-' + mm + '-' + dd
    },
    currentTime () {
      setInterval(this.getTime, 1000)
      this.gettime = this.getTime()
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
    }
  },
  filters: {
    filterType (val, data) {
      let value = ''
      data.map(item => {
        if (item.label === val) {
          value = item.value
        }
      })
      return value
    }
  }
}
</script>

<style lang="scss">
.certificate-list {
  position: relative;
  .el-input__suffix {
    position: absolute;
    top: 5px;
  }
  /deep/.el-table__expanded-cell {
    padding: 0;
    .certificateTable {
      margin-left: 39px;
      border-radius: 0;
    }
  }
  .badge {
    position: absolute;
    top: 5px;
    right: 30px;
    z-index: 99;
    .remider {
      padding: 0;
      font-size: 20px;
    }
  }
}
</style>
