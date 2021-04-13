<template>
  <el-dialog width="600px" title="实际参加培训人员" :visible.sync="innerVisible" append-to-body>
    <el-table :data="dataList" border height="300" ref="multipleTable" v-loading="dataListLoading" style="width: 100%;">
      <!-- <el-table-column type="selection" header-align="center" align="center" width="50"></el-table-column> -->
      <el-table-column prop="trainPersonName" header-align="center" align="center" label="姓名" width="100" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="trainPersonCode" header-align="center" align="center" :show-overflow-tooltip="true" label="工号" width="100"></el-table-column>
      <el-table-column header-align="center" align="center" label="评价结果">
        <template slot-scope="scope">

          <el-radio v-model="scope.row.trainEvaluate" label="1">合格</el-radio>
          <el-radio v-model="scope.row.trainEvaluate" label="2">不合格</el-radio>
        </template>
      </el-table-column>
    </el-table>
    <div slot="footer">
      <el-button @click="innerVisible=false">取消</el-button>
      <el-button @click="dataFormSubmit()" type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { trainPerson } from '@/api/process/education'
export default {
  data () {
    return {
      dataListLoading: false,
      trainEvaluate: '',
      innerVisible: false,
      dataList: []
    }
  },
  methods: {
    init (id) {
      this.innerVisible = true
      this.getPerson(id)
      console.log(id)
    },
    getPerson (id) {
      trainPerson({ id: id }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.list
        }
      })
    },
    dataFormSubmit () {
      // console.log(this.$refs.multipleTable.data)
      this.$emit('selectEmit', this.$refs.multipleTable.data)
      this.innerVisible = false
    }
  }
}
</script>