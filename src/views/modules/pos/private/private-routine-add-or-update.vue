<template>
  <el-dialog :title="(!dataForm.id ? '新增' : '修改') + '常规作业活动'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             width="600px"
             class="private-routine-dialog">
    <div>
      <el-form :model="dataForm"
               :rules="dataRule"
               v-loading="dataListLoading"
               ref="dataForm"
               @keyup.enter.native="dataFormSubmit()"
               label-width="120px">
        <el-form-item label="作业活动名称" prop="operationName">
          <el-input v-model="dataForm.operationName" placeholder="作业活动名称" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="实施单位名称" prop="deptName">
          <el-popover ref="departPopover"
                      placement="bottom-start"
                      popper-class="high"
                      v-model="popoverVisible"
                      trigger="click">
            <el-tree :data="departList"
                     :props="departListTreeProps"
                     node-key="id"
                     ref="departListTree"
                     :default-expand-all="true"
                     :default-expanded-keys="[]"
                     @current-change="departListTreeCurrentChangeHandle"
                     :highlight-current="true"
                     :expand-on-click-node="false">
            </el-tree>
          </el-popover>
          <el-input v-model="dataForm.deptName"
                    v-popover:departPopover
                    :readonly="true"
                    size="mini"
                    class="size-mini-pople-input menu-list__input"
                    placeholder="点击选择实施单位"></el-input>
        </el-form-item>
        <el-form-item label="地点名称" prop="zoneName">
          <el-popover ref="menuListPopover" placement="bottom-start" v-model="parentNamePopover" trigger="click" popper-class="zone-el-popover high">
            <el-tree :data="menuList" :props="menuListTreeProps" node-key="menuId" ref="menuListTree" @current-change="menuListTreeCurrentChangeHandle" :default-expand-all="true" :highlight-current="true" :expand-on-click-node="false">
            </el-tree>
          </el-popover>
          <el-input v-model="dataForm.zoneName" v-popover:menuListPopover :readonly="true" size="mini" class="size-mini-pople-input menu-list__input" placeholder="点击选择地点"></el-input>
        </el-form-item>
        <el-form-item label="活动频率" prop="frequency">
          <el-select v-model="dataForm.frequency" clearable size="mini" placeholder="请选择">
            <el-option v-for="item in frequencyList" :key="item.label" :label="item.value" :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作业活动内容" prop="content">
          <el-input v-model="dataForm.content" placeholder="人员类型" size="mini" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input v-model="dataForm.remarks" placeholder="备注" size="mini" clearable></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer"
          class="dialog-footer">
      <el-row>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary"
                   :disabled="isDisabled"
                   @click="dataFormSubmit()">确定</el-button>
      </el-row>

    </span>
  </el-dialog>
</template>

<script>
  import { departList } from '@/api/sys/depart'
  import { treeDataTranslate2 } from '@/utils'
  import { rAddOrUpdata, rInfo } from '@/api/pos/private'
  import { queryZoneInfo } from '@/api/pos/region'
  export default {
    data () {
      return {
        isDisabled: false,
        visible: false,
        dataListLoading: true,
        dataForm: {
          id: '',
          deptId: '', // 实施单位
          deptName: '', // 实施单位名称
          frequency: '', // 活动频率
          zoneId: '', // 地点ID
          zoneName: '', // 地点名称
          operationName: '', // 作业活动名称
          content: '', // 作业活动内容
          remarks: '' // 备注
        },
        actIndex: 0,
        frequencyList: [], // 活动频率list
        menuList: [],
        menuListTreeProps: {
          label: 'zoneName',
          children: 'subregion'
        },
        parentNamePopover: false,
        popoverVisible: false,
        departList: [],
        departListTreeProps: {
          label: 'deptName',
          children: 'child'
        }, // 树形结构展示
        dataRule: {
          deptName: [
            { required: true, message: '实施单位名称不能为空', trigger: 'blur' }
          ],
          frequency: [
            { required: true, message: '活动频率不能为空', trigger: 'blur' }
          ],
          zoneName: [
            { required: true, message: '地点名称不能为空', trigger: 'blur' }
          ],
          operationName: [
            { required: true, message: '作业活动名称不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '作业活动内容不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created () {},
    methods: {
      // 菜单树选中 - 实施单位
      departListTreeCurrentChangeHandle (data, node) {
        this.popoverVisible = false
        this.dataForm.deptId = data.id
        this.dataForm.deptName = data.deptName
      },
      // 菜单树选中 - 地点名称
      menuListTreeCurrentChangeHandle (data, node) {
        this.parentNamePopover = false
        this.dataForm.zoneId = data.id
        this.dataForm.zoneName = data.zoneName
      },
      init (id) {
        this.dataForm.id = id || 0
        this.actIndex = 0
        this.isDisabled = false
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
        this.getBaseList()
      },
      getInfo () {
        if (this.dataForm.id) {
          this.isDisabled = true
          rInfo({
            'id': this.dataForm.id || undefined
          }).then(({ data }) => {
            this.isDisabled = false
            if (data && data.code === 0) {
              console.log(data)
              this.dataForm.deptName = data.data.deptName // 实施单位名称
              this.dataForm.frequency = data.data.frequency // 活动频率
              this.dataForm.zoneId = data.data.zoneId // 地点ID
              this.dataForm.zoneName = data.data.zoneName // 地点名称
              this.dataForm.operationName = data.data.operationName // 作业活动名称
              this.dataForm.content = data.data.content // 作业活动内容
              this.dataForm.remarks = data.data.remarks // 备注
            } else {
              this.$message.error(data.msg)
            }
            this.dataListLoading = false
          }).catch((err) => {
            console.log(err)
            this.isDisabled = false
            this.dataListLoading = false
            this.$message.error('未知异常！请联系管理员')
          })
        } else {
          this.dataListLoading = false
        }
      },
      getBaseList () {
        this.dataListLoading = true
        // 字典查询 - 活动频率
        this.$http({
          url: this.$http.adornUrl('/spring-sysweb/sys/dict/list'),
          method: 'get',
          params: this.$http.adornParams({
            'type': 'ACTIVITY_TYPE'
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            this.frequencyList = data.page.list
            if (this.frequencyList.length) this.dataForm.frequency = this.frequencyList[0].label
            this.actIndex ++
          }
        }).catch((err) => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
        queryZoneInfo().then(({ data }) => {
          let menulists = data.data
          if (menulists.subregion.length > 0) {
            menulists.subregion.map(val => {
              if (val.subregion && val.subregion.length > 0) {
                val.subregion.map(vals => {
                  vals.subregion = []
                })
              }
            })
          }
          this.menuList = treeDataTranslate2(menulists || [], 'id', 'parentId')
          this.dataForm.parentId = this.menuList[0].id
          this.dataForm.parentName = this.menuList[0].zoneName
          this.actIndex ++
        }).catch((err) => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
        departList().then(({ data }) => {
          if (data && data.code === 0) {
            // this.dataList = treeDataTranslate2(data.data.subregion, 'id', 'parentId')
            this.departList = [data.data[0]] || []
          } else {
            this.$message.error(data.msg)
          }
          this.actIndex ++
        }).catch((err) => {
          console.log(err)
          this.$message.error('未知异常！请联系管理员')
        })
      },
      personIcon (item) {
        this.dataForm2.iconName = item.name
        this.dataForm2.icon = item.icon
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            this.isDisabled = true
            rAddOrUpdata(this.dataForm).then(({ data }) => {
              this.visible = false
              this.$emit('refreshDataList')
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                  }
                })
              } else {
                this.isDisabled = false
                this.$message.error(data.msg)
              }
            }).catch((err) => {
              console.log(err)
              this.isDisabled = false
              this.$message.error('未知异常！请联系管理员')
            })
          }
        })
      }
    },
    watch: {
      actIndex (newValue) {
        if (newValue === 3) {
          this.getInfo()
        }
      }
    }
  }
</script>
<style lang="scss">
  .private-routine-dialog {}
</style>
