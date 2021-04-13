<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '查看') + '库房'" :close-on-click-modal="false" :visible.sync="visible" width="50%" class="depositoryEdit-dialog">
    <div>
      <el-row>
        <el-col :span="24">
          <!-- 添加内容位置 -->
          <el-form :model="dataForm" ref="dataForm" class="pr20" label-width="120px">
            <el-form-item label="库房编号" prop="code">
              <el-input v-model="dataForm.code" placeholder="库房编号" size="mini" maxlength="20" disabled clearable></el-input>
            </el-form-item>
            <el-form-item label="库房名称" prop="name">
              <el-input v-model="dataForm.name" placeholder="库房名称" size="mini" maxlength="20" disabled clearable></el-input>
            </el-form-item>
            <el-form-item label="存储化学品名称" prop="name">
              <el-input v-model="dataForm.storageGood" placeholder="存储化学品名称" size="mini" maxlength="20" disabled clearable></el-input>
            </el-form-item>
            <el-form-item label="风险属性" prop="remarks">
              <el-input v-model="dataForm.dangerAttr" placeholder="风险属性" maxlength="60" size="mini" disabled clearable></el-input>
            </el-form-item>
            <el-form-item label="备注" prop="remarks">
              <el-input v-model="dataForm.describe" placeholder="备注" maxlength="60" size="mini" disabled clearable></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="cancel()">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import { repositoryAdd, repositoryInfo, reservorId } from '@/api/sou/equlpment'
import { queryZoneByCode } from '@/api/pos/region'
export default {
  data () {
    return {
      visible: false,
      isDisabled: false,
      dataForm: {
        code: '',
        name: '',
        capacity: '',
        location: '',
        remarks: '',
        repositoryField: {
          id: ''
        },
        reId: ''
      },
      // 库区id
      reservorId: []
    }
  },
  methods: {
    // 新增/修改
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.isDisabled = false
      this.dataForm = {
        code: '',
        name: '',
        capacity: '',
        location: '',
        remarks: '',
        id: '',
        repositoryField: {
          id: ''
        },
        reId: ''
      }
      if (id) {
        this.isDisabled = true
        queryZoneByCode({
          'code': id
        }).then(({ data }) => {
          this.isDisabled = false
          if (data && data.code === 0) {
            this.dataForm = data.data
          } else {
            this.$message.error(data.msg)
          }
        }).catch((err) => {
          console.log(err)
          this.isDisabled = false
          this.$message.error('未知异常！请联系管理员')
        })
      }
    },
    // 表单关闭
    cancel () {
      this.$refs['dataForm'].resetFields()
      this.visible = false
    }
  }
}
</script>
<style lang="scss">
.depositoryEdit-dialog {
  .field-item {
    .el-form-item__content {
      padding-right: 50px;
      position: relative;
    }
    &-del {
      position: absolute;
      right: 10px;
      top: 0;
      line-height: 36px;
      font-size: 26px;
      color: #f56c6c;
    }
  }
  .pr20 {
    padding-right: 20px;
  }
  .el-select {
    width: 100%;
  }
}
</style>
<style lang="scss" scoped>
// 下拉框样式
.el-select-dropdown__item {
  padding: 0;
}
.select-right {
  margin-left: 6px;
  width: 24px;
  display: inline-block;
}
.right-img {
  height: 16px;
  width: 16px;
}
.el-icon-check {
  color: #4bd4fb;
}
.el-select-dropdown__item.selected {
  color: #606266;
  font-weight: normal;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected {
  color: #606266;
}
.el-select-dropdown.is-multiple .el-select-dropdown__item.selected::after {
  display: none;
}
.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background: -webkit-linear-gradient(
    left,
    #7fc2f3,
    #d8e8f6
  ); /* Safari 5.1 - 6.0 */
  background: -o-linear-gradient(
    right,
    #7fc2f3,
    #d8e8f6
  ); /* Opera 11.1 - 12.0 */
  background: -moz-linear-gradient(
    right,
    #7fc2f3,
    #d8e8f6
  ); /* Firefox 3.6 - 15 */
  background: linear-gradient(to right, #7fc2f3, #d8e8f6); /* 标准的语法 */
}
</style>
