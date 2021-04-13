<template>
  <!-- 巡检任务区域和巡检点 -->
  <div class="stationWorkArea">
    <!-- 任务 和 巡检点-->
    <el-form>
      <el-row class="workArea">
        <el-col :span="9" class="area">
          <!--巡检区域标题-->
          <el-alert title="巡检区域" type="info" effect="dark" center :closable="false">
          </el-alert>
          <div class="add">
            <i class="el-icon-plus" @click="addOrUpdateDialog()"></i>
          </div>
          <!-- 巡检区域详细列表 -->
          <el-card v-if="arealist.length===0">
            <el-alert title="暂无数据" type="info" description="请先添加巡检区域" :closable="false">
            </el-alert>
          </el-card>
          <el-tooltip class="item" effect="light" content="可拖拽进行排序" placement="top">
            <div class="areadetail">
              <el-scrollbar style="height:100%">
                <draggable v-model="arealist" group="people" @update="datadragEnd" :options="{animation:500}">
                  <li v-for="(value,index) in arealist" :key="value.id" :class="{lis:true,active:selectedIndex===index} " @click="addClass(index,value.id,value.zoneId)">
                    <!-- <el-tooltip content="可以拖拽任务区域"
                              placement="top"> -->
                    <div class="areadetailTop">
                      <span class="areadetail-top-count">{{index+1}}/{{arealist.length}}</span>
                      <span>{{value.zoneShow+'巡检区域'}}</span>
                    </div>
                    <el-row class="areadetailBottom">
                      <el-col :span="20">
                        <p>滞留时间：{{value.minRetentionTime+'分钟'}}</p>
                      </el-col>
                      <p class="areaoper">
                        <i class="el-icon-edit" @click.stop="addOrUpdateDialog(value.id)"></i>
                        <i class="el-icon-delete" @click.stop="deleteHandle(value.id,value.zoneShow)"></i>
                      </p>
                    </el-row>
                    <!-- </el-tooltip> -->
                  </li>
                </draggable>
              </el-scrollbar>
            </div>
          </el-tooltip>
        </el-col>
        <el-col :span="15" class="area">
          <!-- 巡检点标题 -->
          <el-alert title="巡检点" type="info" effect="dark" center :closable="false">
          </el-alert>
          <!-- 巡检点详情 -->
          <div class="add">
            <i class="el-icon-plus" @click="addOrUpdatePointDialog()"></i>
          </div>
          <el-card v-if="myArray2.length===0">
            <el-alert title="暂无数据" type="info" description="请先选择巡检区域" :closable="false">
            </el-alert>
          </el-card>
          <el-tooltip class="item" effect="light" content="可拖拽进行排序" placement="left">
            <ul class="pointArea" v-if="myArray2.length">
              <el-scrollbar style="height:100%">
                <draggable v-model="myArray2" group="people1" @update="pointdragEnd" :options="{animation:500}">

                  <li v-for="(value,index) in myArray2" :key="value.id" class="lis lis2">
                    <div class="areadetailTop">
                      <span class="areadetail-top-count">{{index+1}}/{{myArray2.length}}</span>
                      <span>{{value.name}}</span>
                      <span>
                        <el-tag size="mini" :type="value.type === '0' ? 'info' : ''">{{value.type | formatType(pointTypeList)}}</el-tag>
                      </span>
                    </div>
                    <el-row class="areadetailBottom">
                      <el-col :span="20">
                        <p>检查对象：{{value.facilityName}}</p>
                        <p>
                          <span>检查内容：</span>
                          <span>{{value.patrolPointDataAcquisitionList|formatCheckList}}</span>
                        </p>
                      </el-col>
                      <p class="pointop">
                        <i class="el-icon-edit" @click.stop="addOrUpdatePointDialog(value.id)"></i>
                        <i class="el-icon-delete" @click.stop="deletePoint(value.id,value.name)"></i>
                      </p>
                    </el-row>

                  </li>
                </draggable>
              </el-scrollbar>
            </ul>
          </el-tooltip>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item class="btn">
          <el-col :span="24" align="center">
            <el-button @click="goStationWork">上一步</el-button>
            <el-button @click="goStation">取消</el-button>
            <el-button type="primary" @click="enterPreview">保存并到下一步</el-button>
          </el-col>
        </el-form-item>
      </el-row>
    </el-form>
    <add-area v-if="addAreaVisible" @refreshArea='getAreaList' ref="addArea" :taskId='taskId'></add-area>
    <add-point v-if="addPonitVisible" ref="addPoint" :areaId="areaId" :zoneId="zoneId" @refreshPoint='getPointList(areaId)'></add-point>
  </div>
</template>
<script>
// 引入拖拽的组件，注册组件
import draggable from 'vuedraggable'
import AddArea from './station-work-add-area'
import AddPoint from './station-work-add-point'
import { patrolpointList, patrolzoneList, patrolzoneDelete, patrolzoneReorder, patrolpointReorder, patrolPointDelete } from '@/api/pos/person'
import { getLabels } from '@/api/common/sys'
export default {
  components: {
    draggable,
    AddArea,
    AddPoint
  },
  props: ['active', 'id', 'taskInfoForm'],
  data () {
    return {
      taskId: this.id, // 任务id
      areaId: '', // 判断是否选中一个巡检区域
      zoneId: '', // 巡检区域中zoneId
      dataForm: {
        taskId: '', // 任务ID
        zoneId: '', // 关联区域Id
        code: '',
        name: ''
      },
      addAreaVisible: false, // 控制弹出添加巡检区域对话框的显示
      addPonitVisible: false, // 控制弹出添加巡检点对话框的显示
      isEdit: false,
      isDel: false,
      data: {},
      arealist: [], // 巡检区域列表
      dataListSelections: [],
      pointList: [], // 巡检点列表,
      pointTypeList: [],
      myArray: [],
      myArray2: [], // 绑定的巡检列表数据
      selectedIndex: '', // 被选中的索引
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0
    }
  },
  created () {
    console.log(this.id)
    this.getAreaList()
    this.getBaseData()// 加载基础数据
  },

  methods: {
    // 左侧巡检区域拖拽实现
    datadragEnd (evt) {
      evt.preventDefault()
      patrolzoneReorder(
        this.arealist
      ).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
        this.$message.success('操作成功!')
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 右侧巡检点的拖拽
    pointdragEnd (evt) {
      console.log('拖动前的索引 :' + evt.oldIndex)
      console.log('拖动后的索引 :' + evt.newIndex)
      // console.log(this.myArray2)
      patrolpointReorder(
        this.myArray2
      ).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
        this.$message.success('操作成功!')
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 初始化数据
    init () {
      this.getAreaList()
    },
    // 获取巡检区域内容
    getAreaList () {
      this.dataListLoading = true
      patrolzoneList({
        'taskId': this.taskId
      }).then(({ data }) => {
        if (data && data.code === 0) {
          console.log(data)
          this.arealist = data.list || []
          if (this.arealist.length) this.addClass(0, this.arealist[0].id, this.arealist[0].zoneId)
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 获取巡检点内容
    getPointList (id) {
      this.dataListLoading = true
      patrolpointList({
        'zoneId': id
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.myArray2 = data.list
        } else {
          this.$message.error(data.msg)
        }
        this.dataListLoading = false
      }).catch((err) => {
        console.log(err)
        this.$message.error('未知异常！请联系管理员')
        this.dataListLoading = false
      })
    },
    // 加载基础数据
    getBaseData () {
      // 巡检点类型 - 字典
      getLabels({
        'type': 'PATROL_POINT_TYPE'
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.pointTypeList = data.list
        } else {
          this.$message.error(data.msg)
        }
      }).catch(err => console.log(err))
    },

    // 点击保存进入预览页
    enterPreview () {
      // this.data.data1 = 'stationWorkPreview'
      // this.data.data2 = 2
      // this.$store.commit('editName', this.data)
      this.$emit('enterPreview', 2, this.taskId, true)
    },
    // 点击上一步进入任务信息页
    goStationWork () {
      // this.data.data1 = 'stationWorkInfo'
      // this.data.data2 = 0
      // this.$store.commit('editName', this.data)
      // this.$emit('stationWorkUpdate', 0, this.taskId)
      this.$emit('stationWorkUpdate', 0, this.taskId)
    },
    // 点击取消进入stationWork的默认页
    goStation () {
      // this.data.data1 = 'stationWorkHome'
      // this.data.data2 = 0
      // this.$store.commit('editName', this.data)
      this.$emit('goStationWork')
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    // 添加添加按钮，弹出对话框，添加巡检区域
    addOrUpdateDialog (id) {
      this.addAreaVisible = true
      this.$nextTick(() => {
        this.$refs.addArea.init(id)
      })
    },
    // 给选中的索引赋值
    addClass (index, id, zoneId) {
      this.selectedIndex = index
      this.getPointList(id)// 获取巡检点列表
      this.areaId = id// 将选中的值赋给areaId
      this.zoneId = zoneId// 将列表里的zoneId赋给zoneId
    },
    // 删除单个巡检区域
    deleteHandle (id, name) {
      let ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      let nameArr = name
        ? [name]
        : this.dataListSelections.map(item => {
          return item.name
        })
      this.$confirm(`确定对[巡检区域名称为=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          patrolzoneDelete(ids)
            .then(({ data }) => {
              if (data && data.code === 0) {
                this.getAreaList()
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => { }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
            .catch(err => {
              console.log(err)
              this.$message.error('未知异常！请联系管理员')
            })
        })
        .catch(() => { })
    },

    // 删除单个巡检点
    deletePoint (id, name) {
      let ids = id
        ? [id]
        : this.dataListSelections.map(item => {
          return item.id
        })
      let nameArr = name
        ? [name]
        : this.dataListSelections.map(item => {
          return item.name
        })
      this.$confirm(`确定对[巡检点名称为=${nameArr.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          patrolPointDelete(ids)
            .then(({ data }) => {
              if (data && data.code === 0) {
                this.getPointList(this.areaId)
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => { }
                })
              } else {
                this.$message.error(data.msg)
              }
            })
            .catch(err => {
              console.log(err)
              this.$message.error('未知异常！请联系管理员')
            })
        })
        .catch(() => { })
    },
    // 添加或者编辑巡检点信息
    addOrUpdatePointDialog (id) {
      if (this.areaId) {
        this.addPonitVisible = true
        this.$nextTick(() => {
          this.$refs.addPoint.init(id)
        })
      } else {
        this.$message('请先选择巡检区域')
      }
    }
  },
  filters: {
    formatType (value, map) {
      let optionName = ''
      map.map((val) => {
        if (value === val.label) {
          optionName = val.value
        }
      })
      return optionName
    },
    formatCheckList (value) {
      let str = ''
      if (value) {
        value.map((r, index) => {
          str = str + (index + 1) + '、' + r.description + '；'
        })
      }
      return str
    }
  }
}
</script>
<style lang="scss">
.stationWorkArea {
  padding-top: 30px;
  > .el-form {
    margin: 0 50px;
  }
  .workArea {
    margin-bottom: 15px;
    height: calc(100% - 30px - 34px - 30px);
    border: 1px solid #ccc;
    border-right: none;
    overflow: hidden;
    .area {
      border-right: 1px solid #ccc;
      position: relative;
      height: calc(100vh - 18px - 209px);
      // overflow: hidden;
      .area > .el-alert {
        background: #6f9fca;
      }
      .add {
        position: absolute;
        top: 10px;
        right: 10px;
        i {
          cursor: pointer;
          font-size: 16px;
          color: #fff;
          // color: #2c78bb;
          &:hover {
            color: #2c78bb;
          }
        }
      }
      .areadetail,
      .pointArea {
        height: calc(100vh - 40px - 12px - 59px - 50px - 100px);
        // border-bottom: 1px solid #ccc;
        padding: 0;
        margin-top: 0;
        margin-bottom: 0;
        list-style: none;
        .el-scrollbar__wrap {
          overflow-x: hidden;
          .areadetailTop {
            width: 100%;
            .areadetail-top-count {
              line-height: 20px;
              text-align: center;
              color: #fff;
              background-color: #76b8ee;
              padding: 3px 8px;
            }
            .el-tag {
              margin-left: 10px;
            }
          }
        }

        .areadetailBottom {
          position: relative;
          p {
            margin: 14px 0 0 0;
            font-size: 12px;
            color: #222222b3;
            .el-tag {
              padding: 0;
            }
          }
          .areaoper {
            position: absolute;
            right: 0;
            bottom: -1px;
            i {
              margin-right: 3px;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
  .el-form-item__content {
    display: flex;
    // justify-content: center;
    .el-button {
      border-radius: 30px;
      margin: 0 7px;
    }
  }
  .el-alert {
    border-radius: 0;
  }
  .lis {
    padding: 10px;
    margin: 0 10px 10px 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    cursor: pointer;
    background-color: #fff;
    position: relative;
    &:nth-child(1) {
      margin-top: 10px;
    }
    &:hover {
      border: 1px solid #5693c9;
      box-shadow: 0px 0px 2px 0px #5693c9;
    }
  }
  .active {
    border: 1px solid #2c78bb;
  }
  .pointArea {
    .pointop {
      margin: 0;
      position: absolute;
      bottom: -3px;
      right: 2px;
    }
    i {
      margin-left: 3px;
      font-size: 16px;
    }
  }
  .lis2 {
    height: auto;
  }
  .el-icon-edit {
    &:hover {
      color: #2c78bb;
    }
  }
  .el-icon-delete {
    &:hover {
      color: #f56c6c;
    }
  }
  // .el-tag.el-tag--info {
  //   background-color: #fff;
  //   border-color: #fff;
  //   color: #222222b3;
  //   line-height: 1;
  //   height: auto;
  // }
}
</style>
