<template>
  <div class="map-zone-edit-container">
    <el-scrollbar class="default-scrollbar" style="height:calc(100vh - 158px)" wrap-class="default-scrollbar__wrap" view-class="p20-scrollbar__view">
      <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
        <el-form-item label="区域名称" prop="name">
          <el-input v-model="dataForm.name" size="mini" class="size-mini-pople-input" placeholder="区域名称"></el-input>
        </el-form-item>
        <el-form-item label="区域编号" prop="code">
          <el-input maxlength='10' size="mini" class="size-mini-pople-input" :disabled="!dataForm.id?false:true" v-model="dataForm.code" placeholder="区域编号"></el-input>
        </el-form-item>
        <el-form-item label="上级区域" prop="parentName">
          <el-popover ref="menuListPopover" placement="bottom-start" v-model="parentNamePopover" trigger="click" popper-class="zone-el-popover high">
            <el-tree :data="menuList" :props="menuListTreeProps" node-key="menuId" ref="menuListTree" @current-change="menuListTreeCurrentChangeHandle" :default-expand-all="true" :highlight-current="true" :expand-on-click-node="false">
            </el-tree>
          </el-popover>
          <el-input v-model="dataForm.parentName" v-popover:menuListPopover :readonly="true" size="mini" class="size-mini-pople-input menu-list__input" placeholder="点击选择上级区域"></el-input>
        </el-form-item>
        <el-form-item label="绑定建筑">
          <el-input v-model="dataForm.buildId" placeholder="选择摄像头坐标" clearable size="mini" @focus="handleSelectBuild">
            <el-popover placement="top" trigger="manual" content="请在地图双击选则要绑定的建筑" v-model="tipVisible" slot="append">
              <el-button type="warning" slot="reference" size="mini" @click="handleSelectBuild">选取</el-button>
            </el-popover>
          </el-input>
        </el-form-item>
        <el-form-item label="绑定围栏" prop="dataListSelections">
          <el-input v-model="fencingName" size="mini" suffix-icon="el-icon-search" class="fencing-name" @keyup.enter.native="dataFencingList()" placeholder="输入围栏名称点回车检索"></el-input>
          <el-table :data="dataList" :show-header="false" @select="onTableSelect" @row-click="clickRow" ref="multipleTable" style="width: 100%;">
            <el-table-column type="gh" v-if="false" align="center">
            </el-table-column>
            <el-table-column type="selection" align="left" width="15">
            </el-table-column>
            <el-table-column prop="label" align="left" :show-overflow-tooltip="true" label="围栏名称">
            </el-table-column>
          </el-table>
          <el-pagination @size-change="sizeChangeHandle" small :pager-count="5" @current-change="currentChangeHandle" :current-page="pageIndex" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" :total="totalPage" layout="prev, pager, next">
          </el-pagination>
          <div class="personAdd">
            <div class="personAddover">
              <el-tag @close="handleClose(tag)" size="mini" v-for="tag in dataForm.dataListSelections" :key="tag.gh" closable>{{tag.label}}</el-tag>
            </div>
          </div>
        </el-form-item>
      </el-form>
    </el-scrollbar>
    <div class="map-bottom-btn">
      <el-button type="warning" size="mini" @click="dataFormSubmit">保存</el-button>
      <el-button type="info" size="mini" @click="cancel">取消</el-button>
    </div>
  </div>
</template>

<script>
import { treeDataTranslate2 } from '@/utils'
import { fencingList, queryZoneInfo, ZoneInfo } from '@/api/pos/region'

export default {
  inject: ['threeMap'], // 多级祖孙传值-接受方
  props: {
    resData: {
      type: [Object, Array]
    }
  },
  components: {},
  data () {
    return {
      fencingName: '',
      dataForm: {
        id: 0,
        parentName: '',
        name: '',
        parentIds: '',
        parentId: '',
        code: '',
        buildId: '',
        dataListSelections: []
      },
      parentNamePopover: false,
      tipVisible: false, // 选择建筑提示框
      dataRule: {
        name: [
          { required: true, message: '区域名称不能为空', trigger: 'blur' }
        ],
        parentName: [
          { required: true, message: '上级区域不能为空', trigger: 'change' }
        ],
        code: [
          { required: true, message: '编号不能为空', trigger: 'blur' }
        ],
        dataListSelections: [
          { required: true, message: '绑定围栏不能为空', trigger: 'blur' }
        ]
      },
      menuList: [],
      dataListSelections: [], // 选择绑定围栏tags
      dataList: [],
      dataListLoading: false,
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      menuListTreeProps: {
        label: 'zoneName',
        children: 'subregion'
      }
    }
  },
  created () {
    this.dataFencingList() // 获取围栏名称
  },
  mounted () {
    // this.init(this.resData)
  },
  computed: {},
  watch: {
    resData: {
      handler: function (val, oldval) {
        this.init(val)
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    init (info = {}) {
      if (info && info.id) {
        this.dataForm.id = info.id
      } else {
        this.dataForm.id = 0
      }
      this.isDisabled = false
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
      }).then(() => {
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          this.dataForm.parentId = this.menuList[0].id
          this.dataForm.parentName = this.menuList[0].zoneName
        })
      }).then(() => {
        if (info && info.id) {
          ZoneInfo({ id: info.id }).then(({ data }) => {
            this.dataForm.code = data.data.code
            this.dataForm.name = data.data.zoneName
            this.dataForm.parentName = data.data.parentName
            this.dataForm.parentId = data.data.parentId
            this.dataForm.parentIds = data.data.parentIds
            this.dataForm.buildId = data.data.buildId
            this.dataForm.dataListSelections = []
            data.data.fencingList.map(val => {
              this.dataForm.dataListSelections.push({
                gh: val.id,
                label: val.fencingName,
                coordinate: val.coordinate,
                maxHeight: val.maxHeight,
                minHeight: val.minHeight
              })
            })
            this.$emit('handleClick', 'view-fance', this.dataForm.dataListSelections) // 查看回显区域
            this.tagChanged(this.dataForm.dataListSelections)
          })
        }
      })
    },
    // 获取围栏名称
    dataFencingList () {
      fencingList({
        'page': this.pageIndex,
        'limit': this.pageSize,
        'fencingName': this.fencingName
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataList = data.page.list.map(val => {
            return {
              gh: val.id,
              label: val.fencingName,
              coordinate: val.coordinate,
              maxHeight: val.maxHeight,
              minHeight: val.minHeight
            }
          })
          this.totalPage = data.page.count
        } else {
          this.dataList = []
          this.totalPage = 0
        }
        this.tagChanged(this.dataForm.dataListSelections)
      })
    },
    handleSelectBuild () { // 选取建筑
      this.tipVisible = true
      this.threeMap.$refs.threeMap.mapStatus = 2
      this.threeMap.$refs.threeMap.mountFunction('buildSelect', obj => {
        this.threeMap.$refs.threeMap.mapStatus = 1
        this.tipVisible = false
        this.dataForm.buildId = obj.name
      }, 0) // 挂载回调函数
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let fencing = []
          console.log('11111', this.dataForm.dataListSelections)
          this.dataForm.dataListSelections.map(value => {
            fencing.push({
              id: value.gh
            })
          })
          this.$http({
            url: this.$http.adornUrl(`/spring-posweb/zone/${!this.dataForm.id ? 'add' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              'id': this.dataForm.id || '',
              'zoneName': this.dataForm.name,
              'parentIds': this.dataForm.parentIds,
              'parentId': this.dataForm.parentId,
              'fencingList': fencing,
              'code': this.dataForm.code,
              'buildId': this.dataForm.buildId
            })
          }).then(({ data }) => {
            if (data && data.code === 0) {
              this.$emit('handleClick', 'init')
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
    },
    // 请求选中标签
    tagChanged (personIds) {
      this.$nextTick(() => {
        this.dataForm.dataListSelections.map((val, index) => {
          this.dataList.map((vals, indexs) => {
            if (val.gh === vals.gh) {
              this.$refs.multipleTable.toggleRowSelection(this.dataList[indexs], true)
            }
          })
        })
      })
    },
    // 点击行选中
    clickRow (row) {
      if (this.dataForm.dataListSelections.indexOf(row) !== -1) {
        this.$refs.multipleTable.toggleRowSelection(row, false)
        this.dataForm.dataListSelections.splice(this.dataForm.dataListSelections.indexOf(row), 1)
      } else {
        this.$refs.multipleTable.toggleRowSelection(row)
        this.dataForm.dataListSelections.push(row)
      }
      this.$emit('handleClick', 'view-fance', this.dataForm.dataListSelections)
    },
    // 移除所选人员标签
    handleClose (tag) {
      this.dataList.map((vals, index) => {
        if (tag.gh === vals.gh) {
          this.$refs.multipleTable.toggleRowSelection(this.dataList[Number(index)], false)
        }
      })
      this.dataForm.dataListSelections.splice(this.dataForm.dataListSelections.indexOf(tag), 1)
      this.$emit('handleClick', 'view-fance', this.dataForm.dataListSelections)
    },
    // 单行数据选中发生变化时
    onTableSelect (rows, row) {
      console.log(rows, row)
      let selected = rows.length && rows.indexOf(row) !== -1
      if (selected !== true) {
        this.dataForm.dataListSelections.splice(this.dataForm.dataListSelections.indexOf(row), 1)
      } else {
        this.dataForm.dataListSelections.push(row)
      }
      this.$emit('handleClick', 'view-fance', this.dataForm.dataListSelections)
    },
    // 触发全选与取消
    selectAll (selection) {
      if (selection.length <= 0) {
        this.dataList.map(val => {
          this.dataForm.dataListSelections.map((vals, index) => {
            if (val.gh === vals.gh) {
              this.dataForm.dataListSelections.splice(index, 1)
            }
          })
        })
      }
    },
    // 多选
    selectionChangeHandle (val) {
      val.map(value => {
        // eslint-disable-next-line no-unused-vars
        let flag = false
        this.dataForm.dataListSelections.map(value1 => {
          if (value.gh === value1.gh) {
            // eslint-disable-next-line no-return-assign
            return flag = true
          }
        })
        if (flag === false) {
          this.dataForm.dataListSelections.push(value)
        }
      })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.pageSize = val
      this.pageIndex = 1
      this.dataFencingList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.pageIndex = val
      this.dataFencingList()
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle (data, node) {
      this.parentNamePopover = false
      this.dataForm.parentId = data.id
      this.dataForm.parentIds = data.parentIds
      this.dataForm.parentName = data.zoneName
    },
    cancel (val) {
      this.$emit('handleClick', 'init', val)
    }
  }
}
</script>

<style lang='scss'>
.map-zone-edit-container {
  .el-tag__close:hover {
    color: #fff !important;
  }
  .slide-bar-container .el-table::before {
    background-color: #ebeef5;
  }
  .fencing-name {
    margin-bottom: 10px;
  }
  .el-table {
    border-radius: 0;
  }
  .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: transparent !important;
    color: #2c77bd;
  }
  .el-table-column--selection .cell {
    padding: 0;
  }
  .personAdd {
    /*max-height: calc(100vh - 697px);*/
    overflow: hidden auto;
    /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
    &::-webkit-scrollbar {
      width: 6px; /*滚动条宽度*/
      height: 6px; /*滚动条高度*/
      background-color: transparent;
    }

    /*定义滑块 内阴影+圆角*/
    &::-webkit-scrollbar-thumb {
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
      background-color: hsla(220, 4%, 58%, 0.5); /*滚动条的背景颜色*/
      border-radius: 6px;
    }
  }
}
.zone-el-popover {
  .el-tree-node__label {
    font-size: 12px;
  }
}
</style>
