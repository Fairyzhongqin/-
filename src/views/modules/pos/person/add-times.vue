<template>
  <el-dialog class="add-times" width="600px" title="新增时间段" append-to-body="" :visible.sync="innerVisible">
    <el-form ref="dataForm" label-width="110px" :rules="dataRule" :model="dataForm">
      <el-form-item label="时间段名称" prop="periodName">
        <el-input v-model="dataForm.periodName" size="mini" placeholder="时间段名称" class="size-mini-pople-input"></el-input>
      </el-form-item>
      <el-form-item label="新增时间段" required>
        <el-col :span="12">
          <el-form-item prop="startTime">
            <el-time-select placeholder="起始时间" size="mini" @change="dataForm.endTime = ''" v-model="dataForm.startTime" :picker-options="{start: '00:00',step: '00:15',end: '24:00'}">
            </el-time-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="endTime">
            <el-time-select placeholder="结束时间" size="mini" v-model="dataForm.endTime" :picker-options="{start:'00:00',step: '00:15',end: '24:00',minTime: dataForm.startTime}">
            </el-time-select>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item label="可选时间段" class="optionalTimes">
        <el-table :data="optionalTimes" border size="mini" height="201" style="width:100%">
          <!-- <el-table-column type="selection"
                           header-align="center"
                           align="center"
                           width="55"></el-table-column> -->
          <el-table-column prop="periodName" header-align="center" align="center" label="班次"></el-table-column>
          <el-table-column prop="time" header-align="center" align="center" label="时间段">
            <template slot-scope='scope'>
              {{scope.row.startTime + ' ~ ' + scope.row.endTime}}
            </template></el-table-column>
          <el-table-column label="操作" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button type="text" size="small" @click="deleteTime(scope.row.id,scope.row.periodName)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button @click="innerVisible=false">取消</el-button>
      <el-button @click="addSTimes()" type="primary">确定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { stationAdd, stationListTime, stationDeleteTime } from '@/api/pos/person'
export default {
  data () {
    return {
      optionalTimes: [], // 可选时间段
      dataForm: {
        startTime: '', // 开始时间
        endTime: '',  // 结束时间
        periodName: ''  // 时间段名称
      },
      startTime: '',
      endTime: '',
      innerVisible: false,
      dataRule: {
        periodName: [{ required: true, message: '时间段名称不能为空', trigger: 'blur' }],
        startTime: [{ required: true, message: '起始时间不能为空', trigger: 'blur' }],
        endTime: [{ required: true, message: '结束时间不能为空', trigger: 'blur' }]
      }
    }
  },
  props: {
    personIdList: { type: Array }
  },
  created () {
  },
  methods: {
    // 获取时间段
    getTimeList () {
      // Number.MAX_SAFE_INTEGER
      stationListTime({ page: 1, limit: 30, periodName: '' }).then(({ data }) => {
        if (data && data.code === 0) {
          this.optionalTimes = data.page.list
        }
      })
    },
    // 确定添加时间段
    addSTimes () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          stationAdd(this.dataForm).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message.success('添加成功')
              this.$emit('addTimes')
            } else {
              this.$message.error('未知异常，请联系管理员')
            }
          })
          this.innerVisible = false
        }
      })
    },
    // 删除时间段
    deleteTime (id, name) {
      let ids = [id]
      this.$confirm(`确定对[时间段=${name}]进行删除操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        stationDeleteTime(ids).then(({ data }) => {
          if (data && data.code === 0) {
            this.$message.success('操作成功')
            this.getTimeList()
          }
        })
      })
    },
    // 初始化数据
    init (sub) {
      // this.setStaff()
      this.sub = sub
      this.getTimeList()
      this.innerVisible = true
      // this.dataForm = {
      //   startTime: '', // 开始时间
      //   endTime: '',  // 结束时间
      //   periodName: ''
      // }
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    }
  }
}
</script>
<style lang="scss">
.add-times {
  .el-checkbox.is-bordered.el-checkbox--small {
    padding: 5px;
  }
}
</style>
<style lang="scss" scoped>
.add-times {
  .optionalTimes {
    margin-bottom: 0;
  }
  .el-date-editor.el-input {
    width: 213px;
  }
}
</style>
