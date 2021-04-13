<template>
  <div class="daily-train-record">
    <el-table :data="dataList" border height="478px" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column prop="name" header-align="center" align="center" :show-overflow-tooltip="true" width="80" label="姓名">
      </el-table-column>
      <el-table-column prop="gh" header-align="center" :show-overflow-tooltip="true" align="center" label="工号">
      </el-table-column>
      <el-table-column prop="bm" header-align="center" align="center" :show-overflow-tooltip="true" label="部门">
      </el-table-column>
      <el-table-column prop="pxrq" header-align="center" align="center" :show-overflow-tooltip="true" label="培训日期">
      </el-table-column>
      <el-table-column prop="pxlb" header-align="center" :show-overflow-tooltip="true" align="center" label="培训类别">
      </el-table-column>
      <el-table-column prop="pxxs" header-align="center" :show-overflow-tooltip="true" align="center" label="培训学时">
      </el-table-column>
      <el-table-column prop="pxdw" header-align="center" :show-overflow-tooltip="true" align="center" label="培训单位">
      </el-table-column>
      <el-table-column prop="khdw" header-align="center" align="center" :show-overflow-tooltip="true" label="考核单位">
      </el-table-column>
      <el-table-column prop="js" header-align="center" :show-overflow-tooltip="true" align="center" label="讲师">
      </el-table-column>
    </el-table>
    <el-pagination @size-change="sizeChangeHandle" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
  </div>
</template>

<script>
// import {configList} from '@/api/sys/config'
export default {
  props: {
    staffInfo: {
      type: [Object, String]
    }
  },
  data () {
    return {
      infoName: '',
      gh: '',
      dataForm: {
        paramKey: ''
      },
      dataList: [
        { name: '张培信', gh: '0088017', bm: '设备部', pxrq: '2019-8-12', pxlb: '岗前培训', pxxs: '2h', pxdw: '教课部', khdw: '设备部', js: '王敏' },
        { name: '张培信', gh: '0088017', bm: '设备部', pxrq: '2019-8-14', pxlb: '岗前培训', pxxs: '1h', pxdw: '教课部', khdw: '设备部', js: '王敏' },
        { name: '张培信', gh: '0088017', bm: '设备部', pxrq: '2019-8-16', pxlb: '岗前培训', pxxs: '3h', pxdw: '教课部', khdw: '设备部', js: '王敏' },
        { name: '张培信', gh: '0088017', bm: '设备部', pxrq: '2019-8-18', pxlb: '岗前培训', pxxs: '3h', pxdw: '教课部', khdw: '设备部', js: '王敏' },
        { name: '张培信', gh: '0088017', bm: '设备部', pxrq: '2019-8-20', pxlb: '岗前培训', pxxs: '2h', pxdw: '教课部', khdw: '设备部', js: '王敏' },
        { name: '张培信', gh: '0088017', bm: '设备部', pxrq: '2019-8-22', pxlb: '岗前培训', pxxs: '2h', pxdw: '教课部', khdw: '设备部', js: '王敏' },
        { name: '张培信', gh: '0088017', bm: '设备部', pxrq: '2019-8-24', pxlb: '岗前培训', pxxs: '3h', pxdw: '教课部', khdw: '设备部', js: '王敏' },
        { name: '张培信', gh: '0088017', bm: '设备部', pxrq: '2019-8-26', pxlb: '岗前培训', pxxs: '1h', pxdw: '教课部', khdw: '设备部', js: '王敏' },
        { name: '张培信', gh: '0088017', bm: '设备部', pxrq: '2019-8-28', pxlb: '岗前培训', pxxs: '3h', pxdw: '教课部', khdw: '设备部', js: '王敏' },
        { name: '张培信', gh: '0088017', bm: '设备部', pxrq: '2019-8-30', pxlb: '岗前培训', pxxs: '2h', pxdw: '教课部', khdw: '设备部', js: '王敏' },
        { name: '张培信', gh: '0088017', bm: '设备部', pxrq: '2019-9-06', pxlb: '动火培训', pxxs: '2h', pxdw: '教课部', khdw: '设备部', js: '王敏' },
        { name: '张培信', gh: '0088017', bm: '设备部', pxrq: '2019-9-08', pxlb: '动火培训', pxxs: '3h', pxdw: '教课部', khdw: '设备部', js: '王敏' },
        { name: '张培信', gh: '0088017', bm: '设备部', pxrq: '2019-9-10', pxlb: '动火培训', pxxs: '2h', pxdw: '教课部', khdw: '设备部', js: '王敏' },
        { name: '张培信', gh: '0088017', bm: '设备部', pxrq: '2019-9-12', pxlb: '动火培训', pxxs: '3h', pxdw: '教课部', khdw: '设备部', js: '王敏' },
        { name: '张培信', gh: '0088017', bm: '设备部', pxrq: '2019-9-14', pxlb: '动火培训', pxxs: '2h', pxdw: '教课部', khdw: '设备部', js: '王敏' },
        { name: '张培信', gh: '0088017', bm: '设备部', pxrq: '2019-9-16', pxlb: '动火培训', pxxs: '3h', pxdw: '教课部', khdw: '设备部', js: '王敏' },
        { name: '张培信', gh: '0088017', bm: '设备部', pxrq: '2019-9-18', pxlb: '动火培训', pxxs: '2h', pxdw: '教课部', khdw: '设备部', js: '王敏' },
        { name: '张培信', gh: '0088017', bm: '设备部', pxrq: '2019-9-20', pxlb: '动火培训', pxxs: '2h', pxdw: '教课部', khdw: '设备部', js: '王敏' }
        // { name: '张培信', gh: '0082135', bm: '安保部', pxrq: '2019-8-15', pxlb: '安全管理类', pxxs: '30h', pxdw: '教课部', khdw: '安保部', js: '刘明' },
        // { name: '张培信', gh: '0088018', bm: '生产部', pxrq: '2019-10-12', pxlb: '安全生产类', pxxs: '40h', pxdw: '教课部', khdw: '生产部', js: '张杰' },
        // { name: '张培信', gh: '0088020', bm: '生产部', pxrq: '2019-10-12', pxlb: '岗前培训', pxxs: '40h', pxdw: '教课部', khdw: '生产部', js: '张杰' },
        // { name: '张培信', gh: '09100978', bm: '设备部', pxrq: '2019-10-12', pxlb: '岗前培训', pxxs: '45h', pxdw: '教课部', khdw: '设备部', js: '王敏' },
        // { name: '张培信', gh: '0089996', bm: '采购部', pxrq: '2019-10-12', pxlb: '采购物流类', pxxs: '30h', pxdw: '教课部', khdw: '采购部', js: '刘颖' },
        // { name: '张培信', gh: '0089020', bm: '技术部', pxrq: '2019-10-12', pxlb: '技术类', pxxs: '32h', pxdw: '教课部', khdw: '技术部', js: '王敏' },
        // { name: '张培信', gh: '0089027', bm: '企管部', pxrq: '2019-10-12', pxlb: '企业管理类', pxxs: '20h', pxdw: '教课部', khdw: '企管部', js: '孙琳' },
        // { name: '张培信', gh: '0089017', bm: '技术部', pxrq: '2019-10-12', pxlb: '技术类', pxxs: '32h', pxdw: '教课部', khdw: '技术部', js: '刘新' },
        // { name: '张培信', gh: '0089238', bm: '企管部', pxrq: '2019-10-12', pxlb: '企业管理类', pxxs: '20h', pxdw: '教课部', khdw: '企管部', js: '孙琳' },
        // { name: '张培信', gh: '0089294', bm: 'EPS销售部', pxrq: '2019-10-12', pxlb: '市场营销类', pxxs: '20h', pxdw: '教课部', khdw: 'EPS销售部', js: '江心' },
        // { name: '张培信', gh: '0089345', bm: 'EPS销售部', pxrq: '2019-10-12', pxlb: '市场营销类', pxxs: '20h', pxdw: '教课部', khdw: 'EPS销售部', js: '江心' },
        // { name: '张培信', gh: '0890286', bm: '安保部', pxrq: '2019-10-12', pxlb: '岗前培训', pxxs: '45h', pxdw: '教课部', khdw: '安保部', js: '刘明' },
        // { name: '张培信', gh: '0089802', bm: 'EPS外贸部', pxrq: '2019-10-12', pxlb: '市场调研类', pxxs: '20h', pxdw: '教课部', khdw: 'EPS外贸部', js: '王英' },
        // { name: '张培信', gh: '0089882', bm: 'EPS外贸部', pxrq: '2019-10-12', pxlb: '市场调研类', pxxs: '20h', pxdw: '教课部', khdw: 'EPS外贸部', js: '王英' },
        // { name: '张培信', gh: '0091126', bm: '采购部', pxrq: '2019-10-12', pxlb: '采购物流类', pxxs: '30h', pxdw: '教课部', khdw: '采购部', js: '刘颖' },
        // { name: '张培信', gh: '0091127', bm: '企管部', pxrq: '2019-10-12', pxlb: '企业管理类', pxxs: '20h', pxdw: '教课部', khdw: '企管部', js: '孙琳' },
        // { name: '张培信', gh: '0088014', bm: '安保部', pxrq: '2019-10-12', pxlb: '安全管理类', pxxs: '30h', pxdw: '教课部', khdw: '安保部', js: '刘明' }

      ],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false
    }
  },
  components: {},
  activated () {
    this.getDataList()
  },
  created () {
    console.log(this.staffInfo)

    // this.dataList.forEach(item => {
    //   item.name = this.staffInfo.name
    //   item.gh = this.staffInfo.gh
    //   item.bm = this.staffInfo.dept
    // })
  },
  methods: {
    init (info) {
      console.log('==========12312====', this.staffInfo)
      this.$nextTick(() => {
        this.dataList.forEach(item => {
          item.name = info.name
          item.gh = info.gh
          item.bm = info.dept
        })
      })
    },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = false
      this.totalPage = this.dataList.length
      // this.dataListLoading = true
      // configList({
      //   'page': this.pageIndex,
      //   'limit': this.pageSize,
      //   'paramKey': this.dataForm.paramKey
      // }).then(({data}) => {
      //   if (data && data.code === 0) {
      //     this.dataList = data.page.list
      //     this.totalPage = data.page.count
      //   } else {
      //     this.dataList = []
      //     this.totalPage = 0
      //   }
      //   this.dataListLoading = false
      // }).catch((err) => {
      //   console.log(err)
      //   this.$message.error('未知异常！请联系管理员')
      //   this.dataListLoading = false
      // })
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
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle (id) {
      var ids = id ? [id] : this.dataListSelections.map(item => {
        return item.id
      })
      this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/sys/config/delete'),
          method: 'post',
          data: this.$http.adornData(ids, false)
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
        })
      }).catch(() => { })
    }
  }
}
</script>
