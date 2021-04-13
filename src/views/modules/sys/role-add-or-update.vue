<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'"
             :close-on-click-modal="false"
             :visible.sync="visible"
             class="role-add-or">
    <!-- @keyup.enter.native="dataFormSubmit()" 回车事件监听-->
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             label-width="80px">
      <el-form-item label="角色名称"
                    prop="roleName">
        <el-input v-model="dataForm.roleName"
                  placeholder="角色名称"
                  maxlength="33"></el-input>
      </el-form-item>
      <el-form-item label="备注"
                    prop="remarks">
        <el-input v-model="dataForm.remarks"
                  placeholder="备注"
                  maxlength="66"></el-input>
      </el-form-item>
      <el-form-item size="mini"
                    label="授权"
                    class="role">
        <!--<div class="buttons">-->
        <!--<el-button @click="getCheckedNodes">通过 node 获取</el-button>-->
        <!--<el-button @click="getCheckedKeys">通过 key 获取</el-button>-->
        <!--<el-button @click="setCheckedNodes">通过 node 设置</el-button>-->
        <!--<el-button @click="setCheckedKeys">通过 key 设置</el-button>-->
        <!--<el-button @click="resetChecked">清空</el-button>-->
        <!--</div>-->
        <el-tabs class="form-item-tabs"
                 type="border-card"
                 v-model="activeName"
                 @tab-click="checkTabsHandle">
          <el-tab-pane label="人员在岗在位"
                       name="0">
            <el-scrollbar class="default-scrollbar"
                          style="height:240px"
                          wrap-class="default-scrollbar__wrap"
                          view-class="p20-scrollbar__view">
              <el-tree :data="menuList0"
                       show-checkbox
                       node-key="menuId"
                       @check-change="handleCheckChange"
                       :default-checked-keys="treeCheckBoxAll"
                       :ref="'menuListTree'+0"
                       :props="menuListTreeProps">
              </el-tree>
              <!--<el-tree :data="menuList0"-->
              <!--:props="menuListTreeProps"-->
              <!--node-key="menuId"-->
              <!--ref="menuListTree"-->
              <!--show-checkbox>-->
              <!--</el-tree>-->
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="重大危险源"
                       name="1">
            <el-scrollbar class="default-scrollbar"
                          style="height:240px"
                          wrap-class="default-scrollbar__wrap"
                          view-class="p20-scrollbar__view">
              <el-tree :data="menuList1"
                       :props="menuListTreeProps"
                       node-key="menuId"
                       @check-change="handleCheckChange"
                       :ref="'menuListTree'+1"
                       :default-checked-keys="treeCheckBoxAll"
                       show-checkbox>
              </el-tree>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="安全风险分区"
                       name="2">
            <el-scrollbar class="default-scrollbar"
                          style="height:240px"
                          wrap-class="default-scrollbar__wrap"
                          view-class="p20-scrollbar__view">
              <el-tree :data="menuList2"
                       :props="menuListTreeProps"
                       node-key="menuId"
                       @check-change="handleCheckChange"
                       :default-checked-keys="treeCheckBoxAll"
                       :ref="'menuListTree'+2"
                       show-checkbox>
              </el-tree>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="生产全流程"
                       name="3">
            <el-scrollbar class="default-scrollbar"
                          style="height:240px"
                          wrap-class="default-scrollbar__wrap"
                          view-class="p20-scrollbar__view">
              <el-tree :data="menuList3"
                       :props="menuListTreeProps"
                       node-key="menuId"
                       @check-change="handleCheckChange"
                       :ref="'menuListTree'+3"
                       :default-checked-keys="treeCheckBoxAll"
                       show-checkbox>
              </el-tree>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="3D地图"
                       name="4">
            <el-scrollbar class="default-scrollbar"
                          style="height:240px"
                          wrap-class="default-scrollbar__wrap"
                          view-class="p20-scrollbar__view">
              <el-tree :data="menuList4"
                       :props="menuListTreeProps"
                       node-key="menuId"
                       @check-change="handleCheckChange"
                       :ref="'menuListTree'+4"
                       :default-checked-keys="treeCheckBoxAll"
                       show-checkbox>
              </el-tree>
            </el-scrollbar>
          </el-tab-pane>
          <el-tab-pane label="全景视图"
                       name="5">
            <el-scrollbar class="default-scrollbar"
                          style="height:240px"
                          wrap-class="default-scrollbar__wrap"
                          view-class="p20-scrollbar__view">
              <el-tree :data="menuList5"
                       :props="menuListTreeProps"
                       node-key="menuId"
                       @check-change="handleCheckChange"
                       :ref="'menuListTree'+5"
                       :default-checked-keys="treeCheckBoxAll"
                       show-checkbox>
              </el-tree>
            </el-scrollbar>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-form>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button :disabled="isDisabled"
                 type="primary"
                 @click="dataFormSubmit()">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { treeDataTranslate } from '@/utils'
export default {
  data () {
    return {
      visible: false,
      isDisabled: false,
      menuList: [],
      menuList0: [],
      menuList1: [],
      menuList2: [],
      menuList3: [],
      menuList4: [],
      menuList5: [],
      treeCheckBoxAll: [], // 当前所有选中菜单
      treeCheckBox: [], // 当前tab选中的菜单
      activeName: '0', // 标签切换
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      },
      // menuTitle: [{ name: '0', value: '在岗在位管理系统' }, { name: '1', vale: '重大危险源监测预警' }, { name: '2', value: '安全风险分区' }, { name: '3', value: '企业生产全流程' }],
      defaultArr: [], // 默认tree勾选的数据
      dataForm: {
        id: 0,
        roleName: '',
        remarks: ''
      },
      dataRule: {
        roleName: [
          { required: true, message: '角色名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // getCheckedNodes () {
    //   console.log(this.$refs['menuListTree' + this.activeName].getCheckedNodes())
    // },
    getCheckedKeys () {
      console.log(this.$refs['menuListTree' + this.activeName].getCheckedKeys())
    },
    setCheckedNodes () {
      this.$refs.menuListTree.setCheckedNodes([{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 9,
        label: '三级 1-1-1'
      }])
    },
    setCheckedKeys () {
      this.$refs['menuListTree' + this.activeName].setCheckedKeys([3])
    },
    resetChecked () {
      this.$refs['menuListTree' + this.activeName].setCheckedKeys([])
    },
    init (id) {
      this.menuList = []
      this.menuList0 = []
      this.menuList1 = []
      this.menuList2 = []
      this.menuList3 = []
      this.menuList4 = []
      this.menuList5 = []
      this.treeCheckBoxAll = [] // 当前所有选中菜单
      this.treeCheckBox = []
      this.isDisabled = false
      this.dataForm.id = id || 0
      this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/role/menuList'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.menuList = data
        let menuAll = treeDataTranslate(data, 'menuId')
        menuAll.map(value => {
          if (value.flag === '0' || value.menuId === '1') { // 在岗在位管理系统
            this.menuList0.push(value)
          }
          if (value.flag === '1' || value.menuId === '1') { // 重大危险源监测预警
            this.menuList1.push(value)
          }
          if (value.flag === '2' || value.menuId === '1') { // 安全风险分区
            this.menuList2.push(value)
          }
          if (value.flag === '3' || value.menuId === '1') { // 企业生产全流程
            this.menuList3.push(value)
          }
          if (value.flag === '4') { // 3D地图
            this.menuList4.push(value)
          }
          if (value.flag === '5') { // 全景地图
            this.menuList5.push(value)
          }
        })
        // let menulistTypeAdming = []
        // let menulistType0 = []
        // let menulistType1 = []
        // let menulistType2 = []
        // let menulistType3 = []
        // let menulistType4 = []
        // let menulistType5 = []
        // this.menuList.map((value, index) => {
        //   if (value.menuId === '1' || value.parentId === '1') { // 系统管理
        //     menulistTypeAdming.push(value)
        //   } else {
        //     if (value.flag === '0') { // 在岗在位管理系统
        //       menulistType0.push(value)
        //     } else if (value.flag === '1') { // 重大危险源监测预警
        //       menulistType1.push(value)
        //     } else if (value.flag === '2') { // 安全风险分区
        //       menulistType2.push(value)
        //     } else if (value.flag === '3') { // 企业生产全流程
        //       menulistType3.push(value)
        //     } else if (value.flag === '4') { // 3D地图
        //       menulistType4.push(value)
        //     } else if (value.flag === '5') { // 全景地图
        //       menulistType5.push(value)
        //     }
        //   }
        // })
        // // 添加需要展示系统管理的菜单
        // menulistTypeAdming.map(value => {
        //   menulistType0.push(value) // 在岗在位管理系统
        //   menulistType1.push(value) // 重大危险源监测预警
        //   // menulistType2.push(value) // 安全风险分区
        //   // menulistType3.push(value) // 企业生产全流程
        // })
        // console.log(menulistTypeAdming)
        // this.menuList0 = treeDataTranslate(menulistType0, 'menuId')
        // this.menuList1 = treeDataTranslate(menulistType1, 'menuId')
        // this.menuList2 = treeDataTranslate(menulistType2, 'menuId')
        // this.menuList3 = treeDataTranslate(menulistType3, 'menuId')
        // this.menuList4 = treeDataTranslate(menulistType4, 'menuId')
        // this.menuList5 = treeDataTranslate(menulistType5, 'menuId')
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.$refs['menuListTree' + this.activeName].setCheckedKeys([])
        })
      }).then(() => {
        if (this.dataForm.id) {
          this.$http({
            url: this.$http.adornUrl(`/spring-sysweb/sys/role/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.roleName = data.role.roleName
              this.dataForm.remarks = data.role.remarks
              this.treeCheckBoxAll = data.role.menuIdList || []
            }
          })
        }
      })
    },
    // 切换tabs
    checkTabsHandle () {
      this.$refs['menuListTree' + this.activeName].setCheckedKeys(this.treeCheckBoxAll)
    },
    // 更新菜单list
    updateMenuList () {
    },
    // 树形选择
    handleCheckChange (data, check, selCheck) {
      // 获取当前tree的所有menuId，并清除treeCheckBoxAll所有记录
      this['menuList' + this.activeName].map(row => {
        this.treeCheckBoxAll.map((value, index) => {
          if (row.menuId === value) {
            this.treeCheckBoxAll.splice(index, 1)
          }
        })
        if (row.children) {
          row.children.map((val) => {
            this.treeCheckBoxAll.map((value, index) => {
              if (val.menuId === value) {
                this.treeCheckBoxAll.splice(index, 1)
              }
            })
          })
        }
      })
      // 获取当前tree选中数据，并添加到treeCheckBoxAll
      let arr = [].concat(this.$refs['menuListTree' + this.activeName].getCheckedKeys())
      // .concat(this.$refs['menuListTree' + this.activeName].getHalfCheckedKeys())
      arr.map(value => {
        this.treeCheckBoxAll.push(value)
      })
      console.log(this.treeCheckBoxAll)
    },
    // 表单提交
    dataFormSubmit () {
      console.log('提交：', this.treeCheckBoxAll)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isDisabled = true
          this.$http({
            url: this.$http.adornUrl(`/spring-sysweb/sys/role/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'roleName': this.dataForm.roleName,
              'remarks': this.dataForm.remarks,
              'menuIdList': this.treeCheckBoxAll
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.visible = false
              this.$emit('refreshDataList')
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                }
              })
            } else {
              this.$message.error(data.msg)
              this.isDisabled = false
            }
          })
        }
      })
    }
  },
  watch: {
    activeName () {
      this.$nextTick(() => {
        // this.$refs['menuListTree' + this.activeName].setCheckedKeys(this)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.role-add-or {
  .el-scrollbar__wrap {
    overflow-x: hidden;
    overflow-y: scroll;
  }
  /deep/.form-item-tabs {
    box-shadow: none;
    border-radius: 4px;
    overflow: hidden;
    .el-tabs__nav-prev,
    .el-tabs__nav-next {
      line-height: 31px;
    }
    .el-tabs__nav-prev {
      left: 6px;
    }
    .el-tabs__nav-next {
      right: 3px;
    }
  }
}
</style>
