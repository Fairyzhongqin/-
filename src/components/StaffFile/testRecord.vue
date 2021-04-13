<template>
  <div class="special-work-info">
    <el-table :data="dataList" border height="478px" v-loading="dataListLoading" @selection-change="selectionChangeHandle" style="width: 100%;">
      <el-table-column type="selection" header-align="center" align="center" width="50">
      </el-table-column>
      <el-table-column prop="name" header-align="center" align="center" :show-overflow-tooltip="true" width="100" label="考试名称">
      </el-table-column>
      <el-table-column prop="gh" header-align="center" :show-overflow-tooltip="true" align="center" label="制定部门">
      </el-table-column>
      <el-table-column prop="bm" header-align="center" align="center" :show-overflow-tooltip="true" label="制定人">
      </el-table-column>
      <el-table-column prop="pxrq" header-align="center" align="center" :show-overflow-tooltip="true" label="命题方式">
      </el-table-column>
      <el-table-column prop="pxlb" header-align="center" :show-overflow-tooltip="true" align="center" label="类型">
      </el-table-column>
      <el-table-column prop="pxxs" header-align="center" :show-overflow-tooltip="true" align="center" label="开始时间">
      </el-table-column>
      <el-table-column prop="pxdw" header-align="center" :show-overflow-tooltip="true" align="center" label="结束时间">
      </el-table-column>
      <el-table-column prop="pxdw" header-align="center" :show-overflow-tooltip="true" align="center" label="参与范围">
      </el-table-column>
      <el-table-column prop="pxdw" header-align="center" :show-overflow-tooltip="true" align="center" label="结果统计">
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
      type: Object
    }
  },
  data () {
    return {
      dataForm: {
        paramKey: ''
      },
      dataList: [
        { name: '岗前培训抽考', gh: '09100978', bm: '设备部', pxrq: '2019-07-23', pxlb: '岗前培训', pxxs: '2h', pxdw: '教课部', khdw: '安环部', js: '王敏' },
        { name: '岗前培训抽考', gh: '09100978', bm: '设备部', pxrq: '2019-07-30', pxlb: '岗前培训', pxxs: '2h', pxdw: '教课部', khdw: '安环部', js: '王敏' },
        { name: '岗前培训抽考', gh: '09100978', bm: '设备部', pxrq: '2019-08-03', pxlb: '岗前培训', pxxs: '2h', pxdw: '教课部', khdw: '安环部', js: '王敏' },
        { name: '岗前培训抽考', gh: '09100978', bm: '设备部', pxrq: '2019-08-04', pxlb: '岗前培训', pxxs: '2h', pxdw: '教课部', khdw: '安环部', js: '王敏' },
        { name: '岗前培训抽考', gh: '09100978', bm: '设备部', pxrq: '2019-08-05', pxlb: '岗前培训', pxxs: '2h', pxdw: '教课部', khdw: '安环部', js: '王敏' },
        { name: '岗前培训抽考', gh: '09100978', bm: '设备部', pxrq: '2019-08-06', pxlb: '岗前培训', pxxs: '2h', pxdw: '教课部', khdw: '安环部', js: '王敏' },
        { name: '岗前培训抽考', gh: '09100978', bm: '设备部', pxrq: '2019-08-07', pxlb: '岗前培训', pxxs: '2h', pxdw: '教课部', khdw: '安环部', js: '王敏' },
        { name: '岗前培训抽考', gh: '09100978', bm: '设备部', pxrq: '2019-08-09', pxlb: '动火培训', pxxs: '2h', pxdw: '教课部', khdw: '安环部', js: '王敏' },
        { name: '岗前培训抽考', gh: '09100978', bm: '设备部', pxrq: '2019-09-12', pxlb: '动火培训', pxxs: '2h', pxdw: '教课部', khdw: '安环部', js: '王敏' },
        { name: '岗前培训抽考', gh: '09100978', bm: '设备部', pxrq: '2019-09-14', pxlb: '动火培训', pxxs: '2h', pxdw: '教课部', khdw: '安环部', js: '王敏' },
        { name: '岗前培训抽考', gh: '09100978', bm: '设备部', pxrq: '2019-09-16', pxlb: '动火培训', pxxs: '2h', pxdw: '教课部', khdw: '安环部', js: '王敏' },
        { name: '岗前培训抽考', gh: '09100978', bm: '设备部', pxrq: '2019-09-18', pxlb: '动火培训', pxxs: '2h', pxdw: '教课部', khdw: '安环部', js: '王敏' },
        { name: '岗前培训抽考', gh: '09100978', bm: '设备部', pxrq: '2019-09-20', pxlb: '动火培训', pxxs: '2h', pxdw: '教课部', khdw: '安环部', js: '王敏' }
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
  methods: {
    init (info) {
      console.log('==========', info)
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
