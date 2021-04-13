<template>
  <el-dialog :title="!dataForm.id ? '新增' : '修改'"
             :close-on-click-modal="false"
             width="600px"
             :visible.sync="visible">
    <el-form :model="dataForm"
             :rules="dataRule"
             ref="dataForm"
             @keyup.enter.native="dataFormSubmit()"
             label-width="120px">
      <el-form-item label="类型"
                    prop="type">
        <el-radio-group v-model="dataForm.type" @change="clearValidateChange">
          <el-radio v-for="(type, index) in dataForm.typeList"
                    :label="index"
                    :key="index">{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="所属系统"
                    prop=""
                    v-if="dataForm.id != '1'">
        <el-input size="mini"
                  class="size-mini-pople-input"
                  v-model="$store.state.common.navFlagName"
                  disabled></el-input>
      </el-form-item>
      <el-form-item :label="dataForm.typeList[dataForm.type] + '名称'"
                    required
                    prop="name">
        <el-input v-model="dataForm.name"
                  size="mini"
                  class="size-mini-pople-input"
                  :placeholder="dataForm.typeList[dataForm.type] + '名称'"></el-input>
      </el-form-item>
      <el-form-item label="上级菜单"
                    prop="parentName">
        <el-popover ref="menuListPopover"
                    placement="bottom-start"
                    v-model="popoverVisibleMenu"
                    trigger="click">
          <el-tree :data="menuList"
                   :props="menuListTreeProps"
                   node-key="menuId"
                   ref="menuListTree"
                   :default-expanded-keys="['0']"
                   @current-change="menuListTreeCurrentChangeHandle"
                   :default-expand-all="false"
                   :highlight-current="true"
                   :expand-on-click-node="false">
          </el-tree>
        </el-popover>
        <el-input v-model="dataForm.parentName"
                  v-popover:menuListPopover
                  :readonly="true"
                  size="mini"
                  class="size-mini-pople-input menu-list__input"
                  placeholder="点击选择上级菜单"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type === 1"
                    label="菜单路由"
                    prop="url">
        <el-input v-model="dataForm.url"
                  size="mini"
                  class="size-mini-pople-input"
                  placeholder="菜单路由"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 0"
                    label="授权标识"
                    prop="perms">
        <el-input v-model="dataForm.perms"
                  size="mini"
                  class="size-mini-pople-input"
                  placeholder="多个用逗号分隔, 如: user:list,user:create"></el-input>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2"
                    label="排序号"
                    prop="orderNum">
        <el-input-number v-model="dataForm.orderNum"
                         controls-position="right"
                         :min="0"
                         size="mini"
                         label="排序号"></el-input-number>
      </el-form-item>
      <el-form-item v-if="dataForm.type !== 2"
                    label="菜单图标"
                    prop="icon">
        <el-row>
          <el-col :span="24">
            <el-popover ref="iconListPopover"
                        placement="bottom-start"
                        trigger="click"
                        v-model="popoverVisible"
                        popper-class="mod-menu__icon-popover">
              <div class="mod-menu__icon-inner">
                <div class="mod-menu__icon-list">
                  <el-button v-for="(item, index) in iconList"
                             :key="index"
                             @click="iconActiveHandle(item)"
                             :class="{ 'is-active': item === dataForm.icon }">
                    <icon-svg :name="item"></icon-svg>
                  </el-button>
                </div>
              </div>
            </el-popover>
            <el-input v-model="dataForm.icon"
                      v-popover:iconListPopover
                      :readonly="true"
                      size="mini"
                      class="size-mini-pople-input icon-list__input"
                      placeholder="菜单图标名称"></el-input>
          </el-col>
          <!--<el-col :span="2"-->
                  <!--class="icon-list__tips">-->
            <!--<el-tooltip placement="top"-->
                        <!--effect="light">-->
              <!--<div slot="content">全站推荐使用SVG Sprite, 详细请参考:<a href="//github.com/daxiongYang/renren-fast-vue/blob/master/src/icons/index.js"-->
                   <!--target="_blank">icons/index.js</a>描述</div>-->
              <!--<i class="el-icon-warning"></i>-->
            <!--</el-tooltip>-->
          <!--</el-col>-->
        </el-row>
      </el-form-item>
    </el-form>
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
import { treeDataTranslate } from '@/utils'
import Icon from '@/icons'
export default {
  data () {
    let validateUrl = (rule, value, callback) => {
      if (this.dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error('菜单URL不能为空'))
      } else {
        callback()
      }
    }
    let validateName = (rule, value, callback) => {
      if (!/\S/.test(value)) {
        callback(new Error(`${this.dataForm.typeList[this.dataForm.type]}名称不能为空`))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      isDisabled: false,
      popoverVisible: false,
      popoverVisibleMenu: false,
      defaultExpand: [],
      dataForm: {
        id: 0,
        type: 1,
        typeList: ['目录', '菜单', '按钮'],
        name: '',
        parentId: 0,
        parentName: '',
        url: '',
        perms: '',
        orderNum: 0,
        icon: '',
        iconList: []
      },
      dataRule: {
        name: [
          // { required: true, message: '菜单名称不能为空', trigger: 'blur' },
          { validator: validateName, trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级菜单不能为空', trigger: 'change' }
        ],
        url: [
          { required: true, message: '菜单URL不能为空', trigger: 'change' },
          { validator: validateUrl, trigger: 'blur' }
        ]
      },
      menuList: [],
      menuListTreeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  created () {
    this.iconList = Icon.getMenuNameList()
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.isDisabled = false
      this.$http({
        url: this.$http.adornUrl('/spring-sysweb/sys/menu/select'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({ data }) => {
        this.visible = true
        let menuList = []
        data.menuList.map((value) => {
          if (value.flag === this.$store.state.common.navFlag || value.flag == null || value.menuId === '4' || value.menuId === '0' || value.menuId === '1' || value.menuId === '29') {
            menuList.push(value)
          }
        })
        menuList = treeDataTranslate(menuList, 'menuId')
        this.menuList = []
        menuList.map((value) => {
          if (value.children && value.children.length >= 0) {
            this.menuList.push(value)
          }
        })
        // this.menuList = treeDataTranslate(data.menuList, 'menuId')
      }).then(() => {
        // this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
        })
      }).then(() => {
        if (!this.dataForm.id) {
          // 新增
          this.menuListTreeSetCurrentNode()
        } else {
          this.isDisabled = true
          // 修改
          this.$http({
            url: this.$http.adornUrl(`/spring-sysweb/sys/menu/info/${this.dataForm.id}`),
            method: 'get',
            params: this.$http.adornParams()
          }).then(({ data }) => {
            this.isDisabled = false
            this.dataForm.id = data.menu.menuId
            this.dataForm.type = data.menu.type
            this.dataForm.name = data.menu.name
            this.dataForm.parentId = data.menu.parentId
            this.dataForm.url = data.menu.url
            this.dataForm.perms = data.menu.perms
            this.dataForm.orderNum = data.menu.orderNum
            this.dataForm.icon = data.menu.icon
            this.menuListTreeSetCurrentNode()
          })
        }
      })
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle (data, node) {
      this.dataForm.parentId = data.menuId
      this.dataForm.parentName = data.name
      this.popoverVisibleMenu = false
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode () {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId)
      this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() || {})['name']
    },
    // 图标选中
    iconActiveHandle (iconName) {
      this.dataForm.icon = iconName
      this.popoverVisible = false
    },
    // 清除validate校验
    clearValidateChange () {
      this.$refs['dataForm'].clearValidate()
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isDisabled = true
          this.$http({
            url: this.$http.adornUrl(`/spring-sysweb/sys/menu/${!this.dataForm.id ? 'save' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'menuId': this.dataForm.id || undefined,
              'type': this.dataForm.type,
              'name': this.dataForm.name,
              'parentId': this.dataForm.parentId,
              'url': this.dataForm.url,
              'perms': this.dataForm.perms,
              'orderNum': this.dataForm.orderNum,
              'icon': this.dataForm.icon,
              'flag': this.dataForm.type === 3 ? null : this.$store.state.common.navFlag
            })
          }).then(({ data }) => {
            this.isDisabled = false
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
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.mod-menu {
  .menu-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
  &__icon-popover {
    width: 458px;
    overflow: hidden;
  }
  &__icon-inner {
    width: 478px;
    max-height: 258px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &__icon-list {
    width: 458px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }
}
</style>
