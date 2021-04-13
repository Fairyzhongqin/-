<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '查看') + '卡口'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="600px"
             class="checkpoint-dialog">
    <div>
      <el-row>
        <!-- 地图位置 -->
        <!-- <el-col :span="10">
          <div>地图开发中</div>
        </el-col> -->
        <el-col :span="24">
          <!-- 添加内容位置 -->
          <el-form :model="dataForm"
                   :rules="dataRule"
                   ref="dataForm"
                   class="pr20"
                   @keyup.enter.native="dataFormSubmit()"
                   label-width="120px">
            <el-form-item label="卡口类型"
                          prop="type">
              <el-select v-model="dataForm.type"
                         size="mini"
                         disabled
                         placeholder="请选择">
                <el-option v-for="item in sexListCheckpointType"
                           :key="item.value"
                           :label="item.value"
                           :value="item.lable">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="卡口名称"
                          prop="name">
              <el-input v-model="dataForm.name"
                        placeholder="卡口名称"
                        disabled
                        size="mini"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="值班室电话"
                          prop="contact">
              <el-input v-model="dataForm.contact"
                        size="mini"
                        disabled
                        placeholder="值班室电话"
                        maxlength="20"
                        clearable></el-input>
            </el-form-item>
            <el-form-item label="值班室人员"
                          class="personArray"
                          prop="staff">
              <div @click="selectStaffShow">
                <el-input v-model="dataForm.personName"
                          size="mini"
                          disabled
                          placeholder="选择人员"
                          :readonly="true">
                  <template slot="append">
                    选择
                  </template></el-input>
              </div>
            </el-form-item>
            <el-form-item label="地图位置"
                          prop="positionX">
              <el-tooltip class="item"
                          effect="dark"
                          content="点击查看"
                          placement="right">
                <a href="javascript:;"
                   @click="addOrUpdateHandle"
                   style="text-decoration: underline;"><i class="el-icon-location-outline"
                     style="cursor: pointer;color: #3E8EF7;"></i> {{dataForm.positionX}} , {{dataForm.positionY}} , {{dataForm.positionZ}} </a>
              </el-tooltip>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <!-- 向安保人员添加工作人员 -->
      <select-staff v-if="selectStaffVisible"
                    ref="selectStaff"
                    @selectStaffEmit='selectStaffEmit'></select-staff>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary"
                 :disabled="isDisabled"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { checkpointAdd, checkpointInfo } from '@/api/pos/checkpoint'
import selectAll from '@/components/select/select'
import selectStaff from '@/components/select/select-staff'
import eventBus from '@/bus/index'
export default {
  data () {
    return {
      visible: false,
      isDisabled: false,
      dataForm: {
        name: 'aaaa',
        contact: '',
        location: '',
        cgformId: '',
        managerId: '',
        positionX: '1111',
        positionY: '111',
        positionZ: '111',
        type: '0',
        personIds: [],
        personName: '',
        personShow: ''
      },
      selectStaffVisible: false,
      sexListCheckpointType: [{ value: '物理一道门', lable: '0' }, { value: '物理二道门', lable: '1' }],
      managerId: [],
      sexListPerson: { opction: [], key: { lable: 'cgformName', value: 'cgformId' } },
      sexListPersonType: [],
      dataRule: {
        name: [{ required: true, message: '请输入卡口名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择卡口类型', trigger: 'blur' }]
      }
    }
  },
  components: { selectAll, selectStaff },
  methods: {
    // 查看地图
    addOrUpdateHandle () {
      if (this.dataForm.id) {
        this.$router.push({
          name: 'comMap',
          params: {
            name: 'checkpoint',
            callBackFn: () => {
              eventBus.$emit('mainSidebarCoMap', {
                name: 'checkpointFun',
                info: this.dataForm
              }) // 卡口管理
            }
          } })
        this.$store.commit('common/updateMainTabs', [{
          iframeUrl: '',
          menuId: 'comMap',
          name: 'comMap',
          noClose: true,
          title: '视图模式',
          type: 'module'
        }])
        this.$store.commit('common/updateMainmodelFlag', 1)
        this.$cookie.set('navFlag', this.$store.state.common.navFlag)
        this.$store.commit('common/updatedNavbarFlag', '4')
      }
    },
    // 人员组件返回值
    selectStaffEmit (val) {
      this.dataForm.personIds = []
      this.dataForm.personName = ''
      val.map((values, index) => {
        if (Number(index) !== Number(val.length - 1)) {
          this.dataForm.personName += values.name + ', '
          this.dataForm.personIds.push(values.gh)
        } else {
          this.dataForm.personName += values.name
          this.dataForm.personIds.push(values.gh)
        }
      })
      this.selectStaffVisible = false
    },
    // 添加人员
    selectStaffShow () {
      this.selectStaffVisible = true
      this.$nextTick(() => {
        this.$refs.selectStaff.init(this.dataForm.personIds)
      })
    },
    // 新增/修改
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.isDisabled = false
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.dataForm.personName = ''
        this.dataForm.personIds = []
        if (this.dataForm.id) {
          this.isDisabled = true
          checkpointInfo({
            'id': this.dataForm.id || undefined
          }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              this.dataForm = data.data
              this.selectStaffEmit(this.dataForm.personList)
            } else {
              this.$message.error(data.msg)
            }
          }).catch((err) => {
            console.log(err)
            this.isDisabled = false
            this.$message.error('未知异常！请联系管理员')
          })
        }
      })
    },
    // 负责人选择
    // sexListPersonTypeSelect (cgformId) {
    //   pList({
    //     'page': 1,
    //     'limit': 20,
    //     'cgformId': cgformId // 人员类型
    //   }).then(({ data }) => {
    //     if (data && data.code === 0) {
    //       this.sexListPersonType = data.page.list
    //     }
    //   })
    // },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          this.visible = false
          checkpointAdd(this.dataForm).then(({ data }) => {
            if (data && data.code === 0) {
              this.$message.success('操作成功')
              this.$emit('refreshDataList')
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.checkpoint-dialog {
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
  .el-input-group__append {
    height: 26px;
    line-height: 26px;
    cursor: pointer;
  }
}
</style>
<style lang="scss" scoped>
</style>
