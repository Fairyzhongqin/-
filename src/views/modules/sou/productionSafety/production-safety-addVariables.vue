<template>
    <el-dialog class="addVariables"
               width="600px"
               title="新增报告变量"
               append-to-body
               :visible.sync="innerVisible">
      <el-form
        ref="dataForm"
        label-width="80px"
        :model="dataForm"
        :rules="dataRule"
        :inline="true"
      >
        <el-form-item label="报告变量" prop="label">
          <el-input
            v-model="dataForm.label"
            size="mini"
            placeholder="label"
            class="size-mini-pople-input"
          ></el-input>
        </el-form-item>
        <el-form-item prop="value1">
          <el-input
            v-model="dataForm.value1"
            size="mini"
            placeholder="value"
            class="size-mini-pople-input"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <i class="el-icon-circle-plus-outline iconAdd" @click="addVariable"></i>
        </el-form-item>

        <el-form-item label="可选报告变量" class="optionalVariables">
          <el-table :data="dataList" border size="mini"  style="width:100%" max-height="201" height="201">
            <!--<el-table-column prop="value1" v-if="false" header-align="center" align="center" label="label"></el-table-column>-->
            <el-table-column prop="label" header-align="center" align="center" label="变量名"></el-table-column>
            <el-table-column prop="value1" header-align="center" align="center" label="变量值">
              <!--<template slot-scope="scope">-->
                <!--<el-form class="scopeForm">-->
                  <!--<el-form-item label="">-->
                    <!--<el-input v-model="dataList[scope.$index].value2"-->
                              <!--placeholder="报告值"-->
                              <!--maxlength="21"-->
                              <!--clearable></el-input>-->
                  <!--</el-form-item>-->
                <!--</el-form>-->
              <!--</template>-->
            </el-table-column>
            <el-table-column label="操作" header-align="center" align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="deleteHandle(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="innerVisible=false">取消</el-button>
        <el-button  @click="dataFormSubmit" type="primary">确定</el-button>
      </div>
    </el-dialog>

</template>

<script>
  import { findVariablesByTemplateId, reportVariablesAdd, reportVariablesDel } from '@/api/sou/productionSafety'
  export default {
    // props: [ 'varList', 'timeList', 'templateId' ],
    data () {
      return {
        dataForm: {
          id: '',
          templateId: '',
          label: '',
          value1: '',
          value2: '',
          varType: ''
        },
        variablesId: '',
        dataList: [],
        innerVisible: false,
        dataRule: {
          label: [{ required: true, message: 'label值不能为空', trigger: 'blur' }],
          value1: [{ required: true, message: 'value值不能为空', trigger: 'blur' }]
        }
      }
    },
    created () {},
    methods: {
      init (templateId) {
        this.variableId = templateId
        this.innerVisible = true
        if (this.variableId) {
          findVariablesByTemplateId({'id': this.variableId}).then(({data}) => {
            if (data && data.code === 0) {
              this.dataForm.templateId = templateId
              this.dataList = data.list
            } else {
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.$message.error('未知异常！请联系管理员')
          })
        }
      },
      addVariable () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            reportVariablesAdd(this.dataForm).then(({data}) => {
              if (data && data.code === 0) {
                this.$refs['dataForm'].resetFields()
                this.init(this.variableId)
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
          }
        })
      },
      deleteHandle (row) {
        this.$confirm(`确定对[变量=${row.label}]进行删除操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          reportVariablesDel([row.id])
            .then(({ data }) => {
              if (data && data.code === 0) {
                this.init(row.templateId)
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
      dataFormSubmit () {
        this.innerVisible = false
        this.$emit('refreshOptios')
      }
    }
  }
</script>

<style lang="scss">
  .addVariables{
    .iconAdd{
      font-size: 18px;
      margin-top: 5px;
    }
    .optionalVariables{
      width: 100%;
      .el-form-item__content{
        width: 70%;
      }
    }
    .scopeForm {
      .el-form-item__content {
        width: 100px;
      }
    }
  }
</style>
